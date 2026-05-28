import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StockItemDocument = HydratedDocument<StockItem>;

@Schema({
  collection: 'stock_items',
  timestamps: true,
  toJSON: { virtuals: true },
})
export class StockItem {
  // Tenant isolation enforced at DB layer: every document carries tenantId
  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null, type: String })
  category: string | null;

  @Prop({ default: 0 })
  currentQuantity: number;

  @Prop({ default: 0 })
  lowStockThreshold: number;

  @Prop({ default: 'unit' })
  unit: string;

  @Prop({ default: 0 })
  costPerUnit: number;
}

export const StockItemSchema = SchemaFactory.createForClass(StockItem);

// Tenant isolation — same SKU cannot exist twice within one tenant
StockItemSchema.index({ tenantId: 1, sku: 1 }, { unique: true });

// Chosen index: supports low-stock queries which filter by tenant + compare quantity
// to threshold. Without this, every low-stock check scans the full tenant partition.
StockItemSchema.index({ tenantId: 1, currentQuantity: 1 });
