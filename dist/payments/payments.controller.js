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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const payment_dto_1 = require("./dto/payment.dto");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    initiatePayment(dto, scenario = 'success') {
        return this.paymentsService.initiatePayment(dto, scenario);
    }
    getPayments(tenantId) {
        return this.paymentsService.getPayments(tenantId);
    }
    getPaymentEvents(_tenantId, paymentId) {
        return this.paymentsService.getPaymentEvents(paymentId);
    }
    reconcile(tenantId, dto) {
        return this.paymentsService.reconcile(tenantId, dto);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('initiate'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate a payment (idempotent)' }),
    (0, swagger_1.ApiQuery)({
        name: 'scenario',
        required: false,
        enum: ['success', 'timeout', 'provider_error', 'network_failure'],
        description: 'Mock provider scenario for testing',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('scenario')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.InitiatePaymentDto, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "initiatePayment", null);
__decorate([
    (0, common_1.Get)(':tenantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all payments for a tenant' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Get)(':tenantId/:paymentId/events'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit event log for a payment' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Param)('paymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getPaymentEvents", null);
__decorate([
    (0, common_1.Post)(':tenantId/reconcile'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Reconcile internal records against provider transactions' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payment_dto_1.ReconcileDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "reconcile", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map