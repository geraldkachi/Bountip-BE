import { SyncService } from './sync.service';
import { SyncBatchDto } from './dto/sync.dto';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    processBatch(dto: SyncBatchDto): Promise<import("./dto/sync.dto").SyncResponseDto>;
    getOperations(tenantId: string, clientId?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./entities/sync-operation.entity").SyncOperation, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/sync-operation.entity").SyncOperation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./entities/sync-operation.entity").SyncOperation, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/sync-operation.entity").SyncOperation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
}
