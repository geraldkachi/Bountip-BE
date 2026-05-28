import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StockMovementDocument = HydratedDocument<StockMovement>;

export enum MovementType {
  SALE = 'SALE',
  RESTOCK = 'RESTOCK',
  WASTE = 'WASTE',
  ADJUSTMENT = 'ADJUSTMENT',
}

@Schema({
  collection: 'stock_movements',
  timestamps: { createdAt: true, updatedAt: false },
  toJSON: { virtuals: true },
})
export class StockMovement {
  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true, index: true })
  stockItemId: string;

  @Prop({ required: true, enum: MovementType })
  type: MovementType;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  quantityBefore: number;

  @Prop({ required: true })
  quantityAfter: number;

  @Prop({ default: null, type: String })
  referenceId: string | null;

  @Prop({ default: null, type: String })
  notes: string | null;

  @Prop({ default: null, type: String })
  performedBy: string | null;
}

export const StockMovementSchema = SchemaFactory.createForClass(StockMovement);

// Time-series queries per tenant, and per-item history
StockMovementSchema.index({ tenantId: 1, createdAt: -1 });
StockMovementSchema.index({ stockItemId: 1, createdAt: -1 });
