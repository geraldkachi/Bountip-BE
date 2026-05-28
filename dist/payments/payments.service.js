"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const crypto = __importStar(require("crypto"));
const payment_entity_1 = require("./entities/payment.entity");
const mock_provider_service_1 = require("./mock-provider.service");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    paymentModel;
    eventModel;
    provider;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(paymentModel, eventModel, provider) {
        this.paymentModel = paymentModel;
        this.eventModel = eventModel;
        this.provider = provider;
    }
    async initiatePayment(dto, scenario = 'success') {
        const idempotencyKey = crypto
            .createHash('sha256')
            .update(`${dto.tenantId}:${dto.orderId}`)
            .digest('hex');
        const existing = await this.paymentModel.findOne({ idempotencyKey });
        if (existing) {
            this.logger.log(`Duplicate payment request for order ${dto.orderId} — returning existing`);
            return { payment: existing, duplicate: true };
        }
        let payment;
        try {
            payment = await this.paymentModel.create({
                tenantId: dto.tenantId,
                orderId: dto.orderId,
                idempotencyKey,
                amount: dto.amount,
                currency: dto.currency ?? 'NGN',
                customerEmail: dto.customerEmail ?? '',
                status: payment_entity_1.PaymentStatus.INITIATED,
            });
        }
        catch (err) {
            if (err.code === 11000) {
                const race = await this.paymentModel.findOne({ idempotencyKey });
                return { payment: race, duplicate: true };
            }
            throw err;
        }
        await this.emitEvent(String(payment._id), dto.tenantId, 'initiated', {
            amount: dto.amount,
            currency: dto.currency,
        });
        try {
            const response = await Promise.race([
                this.provider.charge(idempotencyKey, dto.amount, dto.currency ?? 'NGN', dto.customerEmail ?? '', scenario),
                new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error('Gateway timeout'), { code: 'ETIMEDOUT' })), 5000)),
            ]);
            if (response.success) {
                return this.confirmPayment(payment, response.reference, response);
            }
            return this.failPayment(payment, payment_entity_1.FailureMode.PROVIDER_ERROR, response.message ?? 'Provider declined');
        }
        catch (err) {
            const mode = err.code === 'ETIMEDOUT'
                ? payment_entity_1.FailureMode.PROVIDER_TIMEOUT
                : payment_entity_1.FailureMode.NETWORK_FAILURE;
            return this.failPayment(payment, mode, err.message);
        }
    }
    async confirmPayment(payment, ref, providerResponse) {
        payment.status = payment_entity_1.PaymentStatus.CONFIRMED;
        payment.providerReference = ref;
        payment.providerStatus = 'success';
        payment.providerResponse = providerResponse;
        const updated = await payment.save();
        await this.emitEvent(String(payment._id), payment.tenantId, 'confirmed', { providerReference: ref });
        return { payment: updated, duplicate: false };
    }
    async failPayment(payment, mode, reason) {
        const status = mode === payment_entity_1.FailureMode.PROVIDER_TIMEOUT
            ? payment_entity_1.PaymentStatus.TIMEOUT
            : payment_entity_1.PaymentStatus.FAILED;
        payment.status = status;
        payment.failureMode = mode;
        payment.failureReason = reason;
        const updated = await payment.save();
        await this.emitEvent(String(payment._id), payment.tenantId, mode === payment_entity_1.FailureMode.PROVIDER_TIMEOUT ? 'timeout' : 'failed', { failureMode: mode, reason });
        return { payment: updated, duplicate: false };
    }
    async emitEvent(paymentId, tenantId, eventType, metadata) {
        await this.eventModel.create({ paymentId, tenantId, eventType, metadata });
    }
    async reconcile(tenantId, dto) {
        const providerMap = new Map(dto.providerTransactions.map(t => [t.reference, t]));
        const internalPayments = await this.paymentModel.find({ tenantId });
        const discrepancies = [];
        const matched = [];
        for (const payment of internalPayments) {
            if (!payment.providerReference) {
                if ([payment_entity_1.PaymentStatus.INITIATED, payment_entity_1.PaymentStatus.TIMEOUT].includes(payment.status)) {
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
            const statusMismatch = (providerTxn.status === 'success' && payment.status !== payment_entity_1.PaymentStatus.CONFIRMED) ||
                (providerTxn.status === 'failed' && payment.status === payment_entity_1.PaymentStatus.CONFIRMED);
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
            }
            else {
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
    async getPayments(tenantId) {
        return this.paymentModel.find({ tenantId }).sort({ initiatedAt: -1 }).limit(50);
    }
    async getPaymentEvents(paymentId) {
        return this.eventModel.find({ paymentId }).sort({ createdAt: 1 });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_entity_1.Payment.name)),
    __param(1, (0, mongoose_1.InjectModel)(payment_entity_1.PaymentEvent.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mock_provider_service_1.MockPaymentProvider])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map