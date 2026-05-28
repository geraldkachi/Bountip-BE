import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PaymentsService } from '../payments.service';
import { MockPaymentProvider } from '../mock-provider.service';
import {
  Payment,
  PaymentEvent,
  PaymentStatus,
  FailureMode,
} from '../entities/payment.entity';

const makePayment = (overrides: Partial<any> = {}) => ({
  _id: 'pay_uuid',
  tenantId: 'tenant_001',
  orderId: 'order_001',
  idempotencyKey: 'idem_key',
  amount: 15000,
  currency: 'NGN',
  customerEmail: 'test@example.com',
  status: PaymentStatus.INITIATED,
  providerReference: null,
  failureMode: null,
  failureReason: null,
  save: jest.fn().mockImplementation(function () { return Promise.resolve(this); }),
  ...overrides,
});

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentModel: any;
  let eventModel: any;
  let provider: MockPaymentProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        MockPaymentProvider,
        {
          provide: getModelToken(Payment.name),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken(PaymentEvent.name),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    paymentModel = module.get(getModelToken(Payment.name));
    eventModel = module.get(getModelToken(PaymentEvent.name));
    provider = module.get<MockPaymentProvider>(MockPaymentProvider);
  });

  // ─── Test 1: Successful payment ───────────────────────────────────────────

  describe('Successful Payment', () => {
    it('should initiate, call provider, and confirm payment', async () => {
      const payment = makePayment();
      paymentModel.findOne.mockResolvedValue(null);
      paymentModel.create.mockResolvedValue(payment);
      eventModel.create.mockResolvedValue({});

      const result = await service.initiatePayment(
        { tenantId: 'tenant_001', orderId: 'order_success', amount: 15000, customerEmail: 'x@x.com' },
        'success',
      );

      expect(result.duplicate).toBe(false);
      expect(result.payment.status).toBe(PaymentStatus.CONFIRMED);
      expect(result.payment.providerReference).toContain('mock_');
    });
  });

  // ─── Test 2: Idempotency ──────────────────────────────────────────────────

  describe('Idempotency', () => {
    it('should return existing payment without calling provider on retry', async () => {
      const existing = makePayment({ status: PaymentStatus.CONFIRMED });
      paymentModel.findOne.mockResolvedValue(existing);
      const chargeSpy = jest.spyOn(provider, 'charge');

      const result = await service.initiatePayment(
        { tenantId: 'tenant_001', orderId: 'order_001', amount: 15000 },
        'success',
      );

      expect(result.duplicate).toBe(true);
      expect(result.payment.status).toBe(PaymentStatus.CONFIRMED);
      // Provider must never be called for a duplicate
      expect(chargeSpy).not.toHaveBeenCalled();
    });
  });

  // ─── Test 3: All three failure modes ──────────────────────────────────────

  describe('Failure Modes', () => {
    const setup = () => {
      const payment = makePayment();
      paymentModel.findOne.mockResolvedValue(null);
      paymentModel.create.mockResolvedValue(payment);
      eventModel.create.mockResolvedValue({});
      return payment;
    };

    it('should handle provider timeout → TIMEOUT status', async () => {
      setup();
      const result = await service.initiatePayment(
        { tenantId: 'tenant_001', orderId: 'order_timeout', amount: 5000 },
        'timeout',
      );
      expect(result.payment.status).toBe(PaymentStatus.TIMEOUT);
      expect(result.payment.failureMode).toBe(FailureMode.PROVIDER_TIMEOUT);
    });

    it('should handle provider error (card declined) → FAILED + PROVIDER_ERROR', async () => {
      setup();
      const result = await service.initiatePayment(
        { tenantId: 'tenant_001', orderId: 'order_declined', amount: 5000 },
        'provider_error',
      );
      expect(result.payment.status).toBe(PaymentStatus.FAILED);
      expect(result.payment.failureMode).toBe(FailureMode.PROVIDER_ERROR);
    });

    it('should handle network failure → FAILED + NETWORK_FAILURE', async () => {
      setup();
      const result = await service.initiatePayment(
        { tenantId: 'tenant_001', orderId: 'order_network', amount: 5000 },
        'network_failure',
      );
      expect(result.payment.status).toBe(PaymentStatus.FAILED);
      expect(result.payment.failureMode).toBe(FailureMode.NETWORK_FAILURE);
    });
  });

  // ─── Test 4: Reconciliation ────────────────────────────────────────────────

  describe('Reconciliation', () => {
    it('should detect STATUS_MISMATCH when provider shows success but DB shows TIMEOUT', async () => {
      paymentModel.find.mockResolvedValue([
        makePayment({ status: PaymentStatus.TIMEOUT, providerReference: 'pstk_abc' }),
      ]);

      const result = await service.reconcile('tenant_001', {
        providerTransactions: [{ reference: 'pstk_abc', status: 'success', amount: 15000 }],
      });

      const mismatch = result.discrepancies.find((d: any) => d.type === 'STATUS_MISMATCH');
      expect(mismatch).toBeDefined();
      expect(mismatch.providerStatus).toBe('success');
      expect(mismatch.internalStatus).toBe(PaymentStatus.TIMEOUT);
    });

    it('should identify PROVIDER_ONLY transactions not in internal DB', async () => {
      paymentModel.find.mockResolvedValue([]);

      const result = await service.reconcile('tenant_001', {
        providerTransactions: [{ reference: 'pstk_ghost', status: 'success', amount: 3000 }],
      });

      const ghost = result.discrepancies.find((d: any) => d.type === 'PROVIDER_ONLY');
      expect(ghost).toBeDefined();
      expect(ghost.reference).toBe('pstk_ghost');
    });

    it('should flag MISSING_PROVIDER_REF for INITIATED payment with no reference', async () => {
      paymentModel.find.mockResolvedValue([
        makePayment({ status: PaymentStatus.INITIATED, providerReference: null }),
      ]);

      const result = await service.reconcile('tenant_001', { providerTransactions: [] });

      const missing = result.discrepancies.find((d: any) => d.type === 'MISSING_PROVIDER_REF');
      expect(missing).toBeDefined();
    });
  });
});
