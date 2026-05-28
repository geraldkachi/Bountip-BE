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
exports.SyncResponseDto = exports.SyncResultDto = exports.SyncBatchDto = exports.SyncOperationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const sync_operation_entity_1 = require("../entities/sync-operation.entity");
class SyncOperationDto {
    idempotencyKey;
    sequenceNumber;
    operationType;
    payload;
    clientTimestamp;
}
exports.SyncOperationDto = SyncOperationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'op_abc123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncOperationDto.prototype, "idempotencyKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SyncOperationDto.prototype, "sequenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: sync_operation_entity_1.OperationType }),
    (0, class_validator_1.IsEnum)(sync_operation_entity_1.OperationType),
    __metadata("design:type", String)
], SyncOperationDto.prototype, "operationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { itemId: 'item_1', quantity: 3 } }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SyncOperationDto.prototype, "payload", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-01T12:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SyncOperationDto.prototype, "clientTimestamp", void 0);
class SyncBatchDto {
    tenantId;
    clientId;
    operations;
}
exports.SyncBatchDto = SyncBatchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'tenant_lagos_001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncBatchDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'client_pos_01' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncBatchDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SyncOperationDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SyncOperationDto),
    __metadata("design:type", Array)
], SyncBatchDto.prototype, "operations", void 0);
class SyncResultDto {
    idempotencyKey;
    status;
    message;
    resolvedPayload;
}
exports.SyncResultDto = SyncResultDto;
class SyncResponseDto {
    batchId;
    processedAt;
    results;
    summary;
}
exports.SyncResponseDto = SyncResponseDto;
//# sourceMappingURL=sync.dto.js.map