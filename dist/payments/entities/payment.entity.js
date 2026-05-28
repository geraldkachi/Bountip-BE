"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentEventSchema = exports.PaymentEvent = exports.PaymentSchema = exports.Payment = exports.FailureMode = exports.PaymentStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["INITIATED"] = "INITIATED";
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["CONFIRMED"] = "CONFIRMED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
    PaymentStatus["TIMEOUT"] = "TIMEOUT";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var FailureMode;
(function (FailureMode) {
    FailureMode["PROVIDER_TIMEOUT"] = "PROVIDER_TIMEOUT";
    FailureMode["PROVIDER_ERROR"] = "PROVIDER_ERROR";
    FailureMode["NETWORK_FAILURE"] = "NETWORK_FAILURE";
})(FailureMode || (exports.FailureMode = FailureMode = {}));
let Payment = class Payment {
    tenantId;
    orderId;
    idempotencyKey;
    amount;
    currency;
    customerEmail;
    status;
    providerReference;
    providerStatus;
    failureMode;
    failureReason;
    providerResponse;
    reconciledAt;
    reconciledBy;
    initiatedAt;
    updatedAt;
};
exports.Payment = Payment;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Payment.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Payment.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Payment.prototype, "idempotencyKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'NGN' }),
    __metadata("design:type", String)
], Payment.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Payment.prototype, "customerEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: PaymentStatus, default: PaymentStatus.INITIATED }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, type: String }),
    __metadata("design:type", Object)
], Payment.prototype, "providerReference", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, type: String }),
    __metadata("design:type", Object)
], Payment.prototype, "providerStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: FailureMode, default: null, type: String }),
    __metadata("design:type", Object)
], Payment.prototype, "failureMode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, type: String }),
    __metadata("design:type", Object)
], Payment.prototype, "failureReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: null }),
    __metadata("design:type", Object)
], Payment.prototype, "providerResponse", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, type: Date }),
    __metadata("design:type", Object)
], Payment.prototype, "reconciledAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, type: String }),
    __metadata("design:type", Object)
], Payment.prototype, "reconciledBy", void 0);
exports.Payment = Payment = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'payments',
        timestamps: { createdAt: 'initiatedAt', updatedAt: 'updatedAt' },
        toJSON: { virtuals: true },
    })
], Payment);
exports.PaymentSchema = mongoose_1.SchemaFactory.createForClass(Payment);
exports.PaymentSchema.index({ tenantId: 1, orderId: 1 }, { unique: true });
exports.PaymentSchema.index({ tenantId: 1, status: 1 });
let PaymentEvent = class PaymentEvent {
    paymentId;
    tenantId;
    eventType;
    metadata;
};
exports.PaymentEvent = PaymentEvent;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], PaymentEvent.prototype, "paymentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PaymentEvent.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PaymentEvent.prototype, "eventType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: null }),
    __metadata("design:type", Object)
], PaymentEvent.prototype, "metadata", void 0);
exports.PaymentEvent = PaymentEvent = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'payment_events',
        timestamps: { createdAt: true, updatedAt: false },
        toJSON: { virtuals: true },
    })
], PaymentEvent);
exports.PaymentEventSchema = mongoose_1.SchemaFactory.createForClass(PaymentEvent);
exports.PaymentEventSchema.index({ paymentId: 1, createdAt: -1 });
//# sourceMappingURL=payment.entity.js.map