import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import {
  Payment, PaymentDocument,
  PaymentEvent, PaymentEventDocument,
  PaymentStatus, FailureMode,
} from './entities/payment.entity';
import { MockPaymentProvider, ProviderScenario } from './mock-provider.service';
import { InitiatePaymentDto, ReconcileDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(PaymentEvent.name) private eventModel: Model<PaymentEventDocument>,
    private provider: MockPaymentProvider,
  ) {}

  /**
   * Idempotent payment initiation.
   *
   * The idempotency key is sha256(tenantId:orderId) — deterministic, stateless,
   * and collision-resistant. A unique index on `idempotencyKey` means concurrent
   * retries for the same order cannot both succeed: one will get E11000 and be
   * routed to return the already-persisted payment.
   */
  async initiatePayment(dto: InitiatePaymentDto, scenario: ProviderScenario = 'success') {
    const idempotencyKey = crypto
      .createHash('sha256')
      .update(`${dto.tenantId}:${dto.orderId}`)
      .digest('hex');

    // Fast path — return existing payment without calling provider
    const existing = await this.paymentModel.findOne({ idempotencyKey });
    if (existing) {
      this.logger.log(`Duplicate payment request for order ${dto.orderId} — returning existing`);
      return { payment: existing, duplicate: true };
    }

    // Persist in INITIATED state before calling provider.
    // If the process crashes after this but before confirmation, the
    // reconciliation job will detect the discrepancy.
    let payment: PaymentDocument;
    try {
      payment = await this.paymentModel.create({
        tenantId: dto.tenantId,
        orderId: dto.orderId,
        idempotencyKey,
        amount: dto.amount,
        currency: dto.currency ?? 'NGN',
        customerEmail: dto.customerEmail ?? '',
        status: PaymentStatus.INITIATED,
      });
    } catch (err: any) {
      // Race condition: another request created it between our findOne and create
      if (err.code === 11000) {
        const race = await this.paymentModel.findOne({ idempotencyKey });
        return { payment: race!, duplicate: true };
      }
      throw err;
    }

    await this.emitEvent(String(payment._id), dto.tenantId, 'initiated', {
      amount: dto.amount,
      currency: dto.currency,
    });

    // Call provider with 5 s timeout guard
    try {
      const response = await Promise.race([
        this.provider.charge(
          idempotencyKey,
          dto.amount,
          dto.currency ?? 'NGN',
          dto.customerEmail ?? '',
          scenario,
        ),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(Object.assign(new Error('Gateway timeout'), { code: 'ETIMEDOUT' })),
            5000,
          ),
        ),
      ]);

      if (response.success) {
        return this.confirmPayment(payment, response.reference!, response);
      }
      return this.failPayment(payment, FailureMode.PROVIDER_ERROR, response.message ?? 'Provider declined');
    } catch (err: any) {
      const mode = err.code === 'ETIMEDOUT'
        ? FailureMode.PROVIDER_TIMEOUT
        : FailureMode.NETWORK_FAILURE;
      return this.failPayment(payment, mode, err.message);
    }
  }

  private async confirmPayment(payment: PaymentDocument, ref: string, providerResponse: any) {
    payment.status = PaymentStatus.CONFIRMED;
    payment.providerReference = ref;
    payment.providerStatus = 'success';
    payment.providerResponse = providerResponse;
    const updated = await payment.save();
    await this.emitEvent(String(payment._id), payment.tenantId, 'confirmed', { providerReference: ref });
    return { payment: updated, duplicate: false };
  }

  private async failPayment(payment: PaymentDocument, mode: FailureMode, reason: string) {
    const status = mode === FailureMode.PROVIDER_TIMEOUT
      ? PaymentStatus.TIMEOUT
      : PaymentStatus.FAILED;
    payment.status = status;
    payment.failureMode = mode;
    payment.failureReason = reason;
    const updated = await payment.save();
    await this.emitEvent(
      String(payment._id), payment.tenantId,
      mode === FailureMode.PROVIDER_TIMEOUT ? 'timeout' : 'failed',
      { failureMode: mode, reason },
    );
    return { payment: updated, duplicate: false };
  }

  private async emitEvent(
    paymentId: string,
    tenantId: string,
    eventType: string,
    metadata: Record<string, any>,
  ) {
    await this.eventModel.create({ paymentId, tenantId, eventType, metadata });
  }

  /**
   * Two-way reconciliation: internal log vs provider transaction list.
   * Surfaces four discrepancy types:
   *  STATUS_MISMATCH       — provider success but DB pending/failed (common after timeout)
   *  AMOUNT_MISMATCH       — charged amount differs
   *  MISSING_PROVIDER_REF  — initiated but no provider reference recorded
   *  PROVIDER_ONLY         — provider shows transaction with no internal record
   */
  async reconcile(tenantId: string, dto: ReconcileDto) {
    const providerMap = new Map(dto.providerTransactions.map(t => [t.reference, t]));
    const internalPayments = await this.paymentModel.find({ tenantId });

    const discrepancies: any[] = [];
    const matched: any[] = [];

    for (const payment of internalPayments) {
      if (!payment.providerReference) {
        if ([PaymentStatus.INITIATED, PaymentStatus.TIMEOUT].includes(payment.status)) {
          discrepancies.push({
            type: 'MISSING_PROVIDER_REF',
            internalId: payment._id,
            orderId: payment.orderId,
            status: payment.status,
            amount: payment.amount,
            message: 'Payment initiated but no provider reference — possible timeout or network failure',
          });
        }
        continue;
      }

      const providerTxn = providerMap.get(payment.providerReference);
      if (!providerTxn) {
        discrepancies.push({
          type: 'MISSING_IN_PROVIDER',
          internalId: payment._id,
          orderId: payment.orderId,
          providerReference: payment.providerReference,
          internalStatus: payment.status,
          message: 'Internal reference exists but provider does not show this transaction',
        });
        continue;
      }

      providerMap.delete(payment.providerReference);

      const statusMismatch =
        (providerTxn.status === 'success' && payment.status !== PaymentStatus.CONFIRMED) ||
        (providerTxn.status === 'failed' && payment.status === PaymentStatus.CONFIRMED);
      const amountMismatch = Math.abs(Number(providerTxn.amount) - Number(payment.amount)) > 0.01;

      if (statusMismatch || amountMismatch) {
        discrepancies.push({
          type: statusMismatch ? 'STATUS_MISMATCH' : 'AMOUNT_MISMATCH',
          internalId: payment._id,
          orderId: payment.orderId,
          providerReference: payment.providerReference,
          internalStatus: payment.status,
          providerStatus: providerTxn.status,
          internalAmount: payment.amount,
          providerAmount: providerTxn.amount,
          message: statusMismatch
            ? `Provider shows ${providerTxn.status} but internal is ${payment.status}`
            : `Amount mismatch: internal=${payment.amount}, provider=${providerTxn.amount}`,
        });
      } else {
        matched.push({ internalId: payment._id, providerReference: payment.providerReference });
      }
    }

    for (const [ref, txn] of providerMap.entries()) {
      discrepancies.push({
        type: 'PROVIDER_ONLY',
        reference: ref,
        providerStatus: txn.status,
        amount: txn.amount,
        message: 'Provider transaction with no matching internal record',
      });
    }

    return {
      reconciledAt: new Date().toISOString(),
      tenantId,
      summary: {
        totalInternal: internalPayments.length,
        totalProvider: dto.providerTransactions.length,
        matched: matched.length,
        discrepancies: discrepancies.length,
      },
      matched,
      discrepancies,
    };
  }

  async getPayments(tenantId: string) {
    return this.paymentModel.find({ tenantId }).sort({ initiatedAt: -1 }).limit(50);
  }

  async getPaymentEvents(paymentId: string) {
    return this.eventModel.find({ paymentId }).sort({ createdAt: 1 });
  }
}
