import { Model } from 'mongoose';
import { SyncOperation, SyncOperationDocument } from './entities/sync-operation.entity';
import { SyncBatchDto, SyncResponseDto } from './dto/sync.dto';
export declare class SyncService {
    private readonly syncModel;
    private readonly logger;
    constructor(syncModel: Model<SyncOperationDocument>);
    processBatch(dto: SyncBatchDto): Promise<SyncResponseDto>;
    private processOperation;
    private detectStockConflict;
    private resolveConflict;
    getOperations(tenantId: string, clientId?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, SyncOperation, {}, import("mongoose").DefaultSchemaOptions> & SyncOperation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, SyncOperation, {}, import("mongoose").DefaultSchemaOptions> & SyncOperation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
}
