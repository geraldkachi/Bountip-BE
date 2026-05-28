import { InventoryService } from './inventory.service';
import { CreateTenantDto, CreateStockItemDto, UpdateStockItemDto, RecordMovementDto } from './dto/inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    createTenant(dto: CreateTenantDto): Promise<import("./entities/tenant.entity").Tenant>;
    getTenants(): Promise<import("./entities/tenant.entity").Tenant[]>;
    createItem(tenantId: string, dto: CreateStockItemDto): Promise<import("./entities/stock-item.entity").StockItem>;
    updateItem(tenantId: string, itemId: string, dto: UpdateStockItemDto): Promise<import("./entities/stock-item.entity").StockItem>;
    getStockLevels(tenantId: string): Promise<import("./entities/stock-item.entity").StockItem[]>;
    getLowStock(tenantId: string): Promise<any[]>;
    recordMovement(tenantId: string, itemId: string, dto: RecordMovementDto): Promise<import("./entities/stock-movement.entity").StockMovement>;
    getMovements(tenantId: string, itemId: string): Promise<{
        item: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./entities/stock-item.entity").StockItem, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/stock-item.entity").StockItem & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./entities/stock-item.entity").StockItem, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/stock-item.entity").StockItem & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
        movements: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./entities/stock-movement.entity").StockMovement, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/stock-movement.entity").StockMovement & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./entities/stock-movement.entity").StockMovement, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/stock-movement.entity").StockMovement & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    getAggregate(parentTenantId: string): Promise<{
        parentTenantId: string;
        childCount: number;
        aggregates: any[];
    }>;
}
