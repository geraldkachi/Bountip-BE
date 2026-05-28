import { MovementType } from '../entities/stock-movement.entity';
export declare class CreateTenantDto {
    slug: string;
    name: string;
    parentId?: string;
}
export declare class CreateStockItemDto {
    sku: string;
    name: string;
    category?: string;
    currentQuantity?: number;
    lowStockThreshold?: number;
    unit?: string;
    costPerUnit?: number;
}
export declare class UpdateStockItemDto {
    name?: string;
    category?: string;
    lowStockThreshold?: number;
    costPerUnit?: number;
}
export declare class RecordMovementDto {
    type: MovementType;
    quantity: number;
    referenceId?: string;
    notes?: string;
    performedBy?: string;
}
