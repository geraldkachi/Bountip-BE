import { Model } from 'mongoose';
import { Tenant, TenantDocument } from './entities/tenant.entity';
import { StockItem, StockItemDocument } from './entities/stock-item.entity';
import { StockMovement, StockMovementDocument } from './entities/stock-movement.entity';
import { CreateTenantDto, CreateStockItemDto, UpdateStockItemDto, RecordMovementDto } from './dto/inventory.dto';
export declare class InventoryService {
    private tenantModel;
    private stockItemModel;
    private movementModel;
    private readonly logger;
    constructor(tenantModel: Model<TenantDocument>, stockItemModel: Model<StockItemDocument>, movementModel: Model<StockMovementDocument>);
    createTenant(dto: CreateTenantDto): Promise<Tenant>;
    getTenants(): Promise<Tenant[]>;
    createStockItem(tenantId: string, dto: CreateStockItemDto): Promise<StockItem>;
    updateStockItem(tenantId: string, itemId: string, dto: UpdateStockItemDto): Promise<StockItem>;
    getStockLevels(tenantId: string): Promise<StockItem[]>;
    getAggregateStockLevels(parentTenantId: string): Promise<{
        parentTenantId: string;
        childCount: number;
        aggregates: any[];
    }>;
    recordMovement(tenantId: string, itemId: string, dto: RecordMovementDto): Promise<StockMovement>;
    getMovementHistory(tenantId: string, itemId: string): Promise<{
        item: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, StockItem, {}, import("mongoose").DefaultSchemaOptions> & StockItem & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, StockItem, {}, import("mongoose").DefaultSchemaOptions> & StockItem & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
        movements: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, StockMovement, {}, import("mongoose").DefaultSchemaOptions> & StockMovement & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, StockMovement, {}, import("mongoose").DefaultSchemaOptions> & StockMovement & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    getLowStockItems(tenantId: string): Promise<any[]>;
    private movementDelta;
    private assertTenantExists;
}
