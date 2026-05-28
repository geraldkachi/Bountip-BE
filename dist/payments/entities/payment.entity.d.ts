import { HydratedDocument } from 'mongoose';
export type PaymentDocument = HydratedDocument<Payment>;
export type PaymentEventDocument = HydratedDocument<PaymentEvent>;
export declare enum PaymentStatus {
    INITIATED = "INITIATED",
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    TIMEOUT = "TIMEOUT"
}
export declare enum FailureMode {
    PROVIDER_TIMEOUT = "PROVIDER_TIMEOUT",
    PROVIDER_ERROR = "PROVIDER_ERROR",
    NETWORK_FAILURE = "NETWORK_FAILURE"
}
export declare class Payment {
    tenantId: string;
    orderId: string;
    idempotencyKey: string;
    amount: number;
    currency: string;
    customerEmail: string;
    status: PaymentStatus;
    providerReference: string | null;
    providerStatus: string | null;
    failureMode: FailureMode | null;
    failureReason: string | null;
    providerResponse: Record<string, any> | null;
    reconciledAt: Date | null;
    reconciledBy: string | null;
    initiatedAt: Date;
    updatedAt: Date;
}
export declare const PaymentSchema: import("mongoose").Schema<Payment, import("mongoose").Model<Payment, any, any, any, any, any, Payment>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Payment, import("mongoose").Document<unknown, {}, Payment, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<string, Payment, import("mongoose").Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    orderId?: import("mongoose").SchemaDefinitionProperty<string, Payment, import("mongoose").Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    idempotencyKey?: import("mongoose").SchemaDefinitionProperty<string, Payment, import("mongoose").Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Payment, import("mongoose").Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currency?: import("mongoose").SchemaDefinitionProperty<string, Payment, import("mongoose").Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    customerEmail?: import("mongoose").SchemaDefinitionProperty<string, Payment, import("mongoose").Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<PaymentStatus, Payment, import("mongoose").Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    providerReference?: import("mongoose").SchemaDefinitionProperty<string | null, Payment, import("mongoose").Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    providerStatus?: import("mongoose").SchemaDefinitionProperty<string | null, Payment, import("mongoose").Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    failureMode?: import("mongoose").SchemaDefinitionProperty<FailureMode | null, Payment, import("mongoose").Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    failureReason?: import("mongoose").SchemaDefinitionProperty<string | null, Payment, import("mongoose").Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    providerResponse?: import("mongoose").SchemaDefinitionProperty<Record<string, any> | null, Payment, import("mongoose").Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reconciledAt?: import("mongoose").SchemaDefinitionProperty<Date | null, Payment, import("mongoose").Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reconciledBy?: import("mongoose").SchemaDefinitionProperty<string | null, Payment, import("mongoose").Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    initiatedAt?: import("mongoose").SchemaDefinitionProperty<Date, Payment, import("mongoose").Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date, Payment, import("mongoose").Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Payment>;
export declare class PaymentEvent {
    paymentId: string;
    tenantId: string;
    eventType: string;
    metadata: Record<string, any> | null;
}
export declare const PaymentEventSchema: import("mongoose").Schema<PaymentEvent, import("mongoose").Model<PaymentEvent, any, any, any, any, any, PaymentEvent>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PaymentEvent, import("mongoose").Document<unknown, {}, PaymentEvent, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PaymentEvent & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    paymentId?: import("mongoose").SchemaDefinitionProperty<string, PaymentEvent, import("mongoose").Document<unknown, {}, PaymentEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PaymentEvent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tenantId?: import("mongoose").SchemaDefinitionProperty<string, PaymentEvent, import("mongoose").Document<unknown, {}, PaymentEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PaymentEvent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    eventType?: import("mongoose").SchemaDefinitionProperty<string, PaymentEvent, import("mongoose").Document<unknown, {}, PaymentEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PaymentEvent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metadata?: import("mongoose").SchemaDefinitionProperty<Record<string, any> | null, PaymentEvent, import("mongoose").Document<unknown, {}, PaymentEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PaymentEvent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, PaymentEvent>;
