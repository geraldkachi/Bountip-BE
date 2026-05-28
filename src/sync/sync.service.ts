import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {
  SyncOperation,
  SyncOperationDocument,
  OperationStatus,
} from './entities/sync-operation.entity';
import { SyncBatchDto, SyncResultDto, SyncResponseDto } from './dto/sync.dto';

/**
 * Conflict Resolution Strategy: SERVER-WINS with MERGE for stock operations.
 *
 * For stock decrements (ITEM_SOLD, STOCK_ADJUSTED), we check whether another
 * client already applied an op to the same itemId after the incoming client's
 * timestamp. If so we annotate the accepted op as MERGED rather than silently
 * overwriting, giving operators a full audit trail.
 *
 * Idempotency is enforced via a unique index on `idempotencyKey`. A replayed
 * batch simply finds the existing document and returns `duplicate`.
 *
 * Tradeoffs vs CRDT: G-Counters eliminate this class of conflict entirely but
 * require all clients to share counter registers and add wire-format complexity.
 * Server-wins is pragmatic for a bakery POS where stock accuracy > availability.
 */
@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectModel(SyncOperation.name)
    private readonly syncModel: Model<SyncOperationDocument>,
  ) {}

  async processBatch(dto: SyncBatchDto): Promise<SyncResponseDto> {
    const batchId = uuidv4();
    const results: SyncResultDto[] = [];

    // Causal ordering — process by sequence number
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

  private async processOperation(
    tenantId: string,
    clientId: string,
    op: any,
  ): Promise<SyncResultDto> {
    // Idempotency check — unique index makes this race-safe
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
      if (conflict) return this.resolveConflict(tenantId, clientId, op, conflict);
    }

    await this.syncModel.create({
      tenantId,
      clientId,
      sequenceNumber: op.sequenceNumber,
      operationType: op.operationType,
      payload: op.payload,
      idempotencyKey: op.idempotencyKey,
      status: OperationStatus.ACCEPTED,
      clientTimestamp: new Date(op.clientTimestamp),
    });

    return { idempotencyKey: op.idempotencyKey, status: 'accepted' };
  }

  private async detectStockConflict(
    tenantId: string,
    op: any,
  ): Promise<Record<string, any> | null> {
    const { itemId } = op.payload;
    if (!itemId) return null;

    const conflicting = await this.syncModel.findOne(
      {
        tenantId,
        'payload.itemId': itemId,
        serverTimestamp: { $gt: new Date(op.clientTimestamp) },
        status: OperationStatus.ACCEPTED,
      },
      null,
      { sort: { serverTimestamp: -1 } },
    );

    return conflicting ? { conflictingOp: conflicting } : null;
  }

  private async resolveConflict(
    tenantId: string,
    clientId: string,
    op: any,
    conflict: Record<string, any>,
  ): Promise<SyncResultDto> {
    const requestedQty: number = op.payload.quantity ?? 0;

    if (requestedQty <= 0) {
      await this.syncModel.create({
        tenantId, clientId,
        sequenceNumber: op.sequenceNumber,
        operationType: op.operationType,
        payload: op.payload,
        idempotencyKey: op.idempotencyKey,
        status: OperationStatus.REJECTED,
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
      status: OperationStatus.MERGED,
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

  async getOperations(tenantId: string, clientId?: string) {
    const filter: Record<string, any> = { tenantId };
    if (clientId) filter.clientId = clientId;
    return this.syncModel.find(filter).sort({ serverTimestamp: -1 }).limit(100);
  }
}
