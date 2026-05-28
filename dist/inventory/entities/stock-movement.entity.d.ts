import { HydratedDocument } from 'mongoose';
export type StockMovementDocument = HydratedDocument<StockMovement>;
export declare enum MovementType {
    SALE = "SALE",
    RESTOCK = "RESTOCK",
    WASTE = "WASTE",
    ADJUSTMENT = "ADJUSTMENT"
}
export declare class StockMovement {
    tenantId: string;
    stockItemId: string;
    type: MovementType;
    quantity: number;
    quantityBefore: number;
    quantityAfter: number;
    referenceId: string | null;
    notes: string | null;
    performedBy: string | null;
}
export declare const StockMovementSchema: import("mongoose").Schema<StockMovement, import("mongoose").Model<StockMovement, any, any, any, any, any, StockMovement>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StockMovement, import("mongoose").Document<unknown, {}, StockMovement, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<string, StockMovement, import("mongoose").Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    stockItemId?: import("mongoose").SchemaDefinitionProperty<string, StockMovement, import("mongoose").Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<MovementType, StockMovement, import("mongoose").Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, StockMovement, import("mongoose").Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quantityBefore?: import("mongoose").SchemaDefinitionProperty<number, StockMovement, import("mongoose").Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quantityAfter?: import("mongoose").SchemaDefinitionProperty<number, StockMovement, import("mongoose").Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    referenceId?: import("mongoose").SchemaDefinitionProperty<string | null, StockMovement, import("mongoose").Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string | null, StockMovement, import("mongoose").Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    performedBy?: import("mongoose").SchemaDefinitionProperty<string | null, StockMovement, import("mongoose").Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, StockMovement>;
