import { OperationType } from '../entities/sync-operation.entity';
export declare class SyncOperationDto {
    idempotencyKey: string;
    sequenceNumber: number;
    operationType: OperationType;
    payload: Record<string, any>;
    clientTimestamp: string;
}
export declare class SyncBatchDto {
    tenantId: string;
    clientId: string;
    operations: SyncOperationDto[];
}
export declare class SyncResultDto {
    idempotencyKey: string;
    status: 'accepted' | 'rejected' | 'merged' | 'duplicate';
    message?: string;
    resolvedPayload?: Record<string, any>;
}
export declare class SyncResponseDto {
    batchId: string;
    processedAt: string;
    results: SyncResultDto[];
    summary: {
        accepted: number;
        rejected: number;
        merged: number;
        duplicates: number;
    };
}
