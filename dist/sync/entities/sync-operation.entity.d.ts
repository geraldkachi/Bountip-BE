import { HydratedDocument } from 'mongoose';
export type SyncOperationDocument = HydratedDocument<SyncOperation>;
export declare enum OperationType {
    ITEM_SOLD = "ITEM_SOLD",
    STOCK_ADJUSTED = "STOCK_ADJUSTED",
    ORDER_PLACED = "ORDER_PLACED"
}
export declare enum OperationStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    MERGED = "MERGED"
}
export declare class SyncOperation {
    tenantId: string;
    clientId: string;
    sequenceNumber: number;
    operationType: OperationType;
    payload: Record<string, any>;
    idempotencyKey: string;
    status: OperationStatus;
    conflictDetails: Record<string, any> | null;
    clientTimestamp: Date;
    serverTimestamp: Date;
}
export declare const SyncOperationSchema: import("mongoose").Schema<SyncOperation, import("mongoose").Model<SyncOperation, any, any, any, any, any, SyncOperation>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SyncOperation, import("mongoose").Document<unknown, {}, SyncOperation, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SyncOperation & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<string, SyncOperation, import("mongoose").Document<unknown, {}, SyncOperation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SyncOperation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    clientId?: import("mongoose").SchemaDefinitionProperty<string, SyncOperation, import("mongoose").Document<unknown, {}, SyncOperation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SyncOperation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sequenceNumber?: import("mongoose").SchemaDefinitionProperty<number, SyncOperation, import("mongoose").Document<unknown, {}, SyncOperation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SyncOperation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    operationType?: import("mongoose").SchemaDefinitionProperty<OperationType, SyncOperation, import("mongoose").Document<unknown, {}, SyncOperation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SyncOperation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    payload?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, SyncOperation, import("mongoose").Document<unknown, {}, SyncOperation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SyncOperation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    idempotencyKey?: import("mongoose").SchemaDefinitionProperty<string, SyncOperation, import("mongoose").Document<unknown, {}, SyncOperation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SyncOperation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<OperationStatus, SyncOperation, import("mongoose").Document<unknown, {}, SyncOperation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SyncOperation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    conflictDetails?: import("mongoose").SchemaDefinitionProperty<Record<string, any> | null, SyncOperation, import("mongoose").Document<unknown, {}, SyncOperation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SyncOperation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    clientTimestamp?: import("mongoose").SchemaDefinitionProperty<Date, SyncOperation, import("mongoose").Document<unknown, {}, SyncOperation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SyncOperation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    serverTimestamp?: import("mongoose").SchemaDefinitionProperty<Date, SyncOperation, import("mongoose").Document<unknown, {}, SyncOperation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SyncOperation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, SyncOperation>;
