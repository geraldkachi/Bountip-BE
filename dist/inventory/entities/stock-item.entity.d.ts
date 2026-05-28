import { HydratedDocument } from 'mongoose';
export type StockItemDocument = HydratedDocument<StockItem>;
export declare class StockItem {
    tenantId: string;
    sku: string;
    name: string;
    category: string | null;
    currentQuantity: number;
    lowStockThreshold: number;
    unit: string;
    costPerUnit: number;
}
export declare const StockItemSchema: import("mongoose").Schema<StockItem, import("mongoose").Model<StockItem, any, any, any, any, any, StockItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StockItem, import("mongoose").Document<unknown, {}, StockItem, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<StockItem & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<string, StockItem, import("mongoose").Document<unknown, {}, StockItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sku?: import("mongoose").SchemaDefinitionProperty<string, StockItem, import("mongoose").Document<unknown, {}, StockItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, StockItem, import("mongoose").Document<unknown, {}, StockItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string | null, StockItem, import("mongoose").Document<unknown, {}, StockItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currentQuantity?: import("mongoose").SchemaDefinitionProperty<number, StockItem, import("mongoose").Document<unknown, {}, StockItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lowStockThreshold?: import("mongoose").SchemaDefinitionProperty<number, StockItem, import("mongoose").Document<unknown, {}, StockItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    unit?: import("mongoose").SchemaDefinitionProperty<string, StockItem, import("mongoose").Document<unknown, {}, StockItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    costPerUnit?: import("mongoose").SchemaDefinitionProperty<number, StockItem, import("mongoose").Document<unknown, {}, StockItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, StockItem>;
