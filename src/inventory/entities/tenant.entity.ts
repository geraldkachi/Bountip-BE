import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TenantDocument = HydratedDocument<Tenant>;

@Schema({ collection: 'tenants', timestamps: true, toJSON: { virtuals: true } })
export class Tenant {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null, type: String })
  parentId: string | null;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
