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
var SyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
const sync_operation_entity_1 = require("./entities/sync-operation.entity");
let SyncService = SyncService_1 = class SyncService {
    syncModel;
    logger = new common_1.Logger(SyncService_1.name);
    constructor(syncModel) {
        this.syncModel = syncModel;
    }
    async processBatch(dto) {
        const batchId = (0, uuid_1.v4)();
        const results = [];
        const sorted = [...dto.operations].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        for (const op of sorted) {
            results.push(await this.processOperation(dto.tenantId, dto.clientId, op));
        }
        const summary = {
            accepted: results.filter(r => r.status === 'accepted').length,
            rejected: results.filter(r => r.status === 'rejected').length,
            merged: results.filter(r => r.status === 'merged').length,
            duplicates: results.filter(r => r.status === 'duplicate').length,
        };
        this.logger.log(`Batch ${batchId} processed: ${JSON.stringify(summary)}`);
        return { batchId, processedAt: new Date().toISOString(), results, summary };
    }
    async processOperation(tenantId, clientId, op) {
        const existing = await this.syncModel.findOne({ idempotencyKey: op.idempotencyKey });
        if (existing) {
            return {
                idempotencyKey: op.idempotencyKey,
                status: 'duplicate',
                message: 'Operation already processed; idempotency enforced.',
            };
        }
        if (op.operationType === 'ITEM_SOLD' || op.operationType === 'STOCK_ADJUSTED') {
            const conflict = await this.detectStockConflict(tenantId, op);
            if (conflict)
                return this.resolveConflict(tenantId, clientId, op, conflict);
        }
        await this.syncModel.create({
            tenantId,
            clientId,
            sequenceNumber: op.sequenceNumber,
            operationType: op.operationType,
            payload: op.payload,
            idempotencyKey: op.idempotencyKey,
            status: sync_operation_entity_1.OperationStatus.ACCEPTED,
            clientTimestamp: new Date(op.clientTimestamp),
        });
        return { idempotencyKey: op.idempotencyKey, status: 'accepted' };
    }
    async detectStockConflict(tenantId, op) {
        const { itemId } = op.payload;
        if (!itemId)
            return null;
        const conflicting = await this.syncModel.findOne({
            tenantId,
            'payload.itemId': itemId,
            serverTimestamp: { $gt: new Date(op.clientTimestamp) },
            status: sync_operation_entity_1.OperationStatus.ACCEPTED,
        }, null, { sort: { serverTimestamp: -1 } });
        return conflicting ? { conflictingOp: conflicting } : null;
    }
    async resolveConflict(tenantId, clientId, op, conflict) {
        const requestedQty = op.payload.quantity ?? 0;
        if (requestedQty <= 0) {
            await this.syncModel.create({
                tenantId, clientId,
                sequenceNumber: op.sequenceNumber,
                operationType: op.operationType,
                payload: op.payload,
                idempotencyKey: op.idempotencyKey,
                status: sync_operation_entity_1.OperationStatus.REJECTED,
                conflictDetails: { reason: 'invalid_quantity', conflict },
                clientTimestamp: new Date(op.clientTimestamp),
            });
            return {
                idempotencyKey: op.idempotencyKey,
                status: 'rejected',
                message: 'Conflict: stock already modified by another client. Operation rejected.',
            };
        }
        const mergedPayload = {
            ...op.payload,
            mergedDueToConflict: true,
            originalQuantity: requestedQty,
        };
        await this.syncModel.create({
            tenantId, clientId,
            sequenceNumber: op.sequenceNumber,
            operationType: op.operationType,
            payload: mergedPayload,
            idempotencyKey: op.idempotencyKey,
            status: sync_operation_entity_1.OperationStatus.MERGED,
            conflictDetails: conflict,
            clientTimestamp: new Date(op.clientTimestamp),
        });
        return {
            idempotencyKey: op.idempotencyKey,
            status: 'merged',
            message: 'Concurrent modification detected. Operation accepted with conflict annotation.',
            resolvedPayload: mergedPayload,
        };
    }
    async getOperations(tenantId, clientId) {
        const filter = { tenantId };
        if (clientId)
            filter.clientId = clientId;
        return this.syncModel.find(filter).sort({ serverTimestamp: -1 }).limit(100);
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = SyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(sync_operation_entity_1.SyncOperation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SyncService);
//# sourceMappingURL=sync.service.js.map