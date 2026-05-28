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
exports.SyncOperationSchema = exports.SyncOperation = exports.OperationStatus = exports.OperationType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var OperationType;
(function (OperationType) {
    OperationType["ITEM_SOLD"] = "ITEM_SOLD";
    OperationType["STOCK_ADJUSTED"] = "STOCK_ADJUSTED";
    OperationType["ORDER_PLACED"] = "ORDER_PLACED";
})(OperationType || (exports.OperationType = OperationType = {}));
var OperationStatus;
(function (OperationStatus) {
    OperationStatus["PENDING"] = "PENDING";
    OperationStatus["ACCEPTED"] = "ACCEPTED";
    OperationStatus["REJECTED"] = "REJECTED";
    OperationStatus["MERGED"] = "MERGED";
})(OperationStatus || (exports.OperationStatus = OperationStatus = {}));
let SyncOperation = class SyncOperation {
    tenantId;
    clientId;
    sequenceNumber;
    operationType;
    payload;
    idempotencyKey;
    status;
    conflictDetails;
    clientTimestamp;
    serverTimestamp;
};
exports.SyncOperation = SyncOperation;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], SyncOperation.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SyncOperation.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SyncOperation.prototype, "sequenceNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: OperationType }),
    __metadata("design:type", String)
], SyncOperation.prototype, "operationType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], SyncOperation.prototype, "payload", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], SyncOperation.prototype, "idempotencyKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: OperationStatus, default: OperationStatus.ACCEPTED }),
    __metadata("design:type", String)
], SyncOperation.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: null }),
    __metadata("design:type", Object)
], SyncOperation.prototype, "conflictDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], SyncOperation.prototype, "clientTimestamp", void 0);
exports.SyncOperation = SyncOperation = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'sync_operations',
        timestamps: { createdAt: 'serverTimestamp' },
        toJSON: { virtuals: true },
    })
], SyncOperation);
exports.SyncOperationSchema = mongoose_1.SchemaFactory.createForClass(SyncOperation);
exports.SyncOperationSchema.index({ tenantId: 1, clientId: 1 });
exports.SyncOperationSchema.index({ tenantId: 1, 'payload.itemId': 1, serverTimestamp: -1 });
//# sourceMappingURL=sync-operation.entity.js.map