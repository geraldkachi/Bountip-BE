import { HydratedDocument } from 'mongoose';
export type TenantDocument = HydratedDocument<Tenant>;
export declare class Tenant {
    slug: string;
    name: string;
    parentId: string | null;
}
export declare const TenantSchema: import("mongoose").Schema<Tenant, import("mongoose").Model<Tenant, any, any, any, any, any, Tenant>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Tenant, import("mongoose").Document<unknown, {}, Tenant, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    slug?: import("mongoose").SchemaDefinitionProperty<string, Tenant, import("mongoose").Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Tenant, import("mongoose").Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    parentId?: import("mongoose").SchemaDefinitionProperty<string | null, Tenant, import("mongoose").Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Tenant>;
