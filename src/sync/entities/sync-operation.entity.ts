import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SyncOperationDocument = HydratedDocument<SyncOperation>;

export enum OperationType {
  ITEM_SOLD = 'ITEM_SOLD',
  STOCK_ADJUSTED = 'STOCK_ADJUSTED',
  ORDER_PLACED = 'ORDER_PLACED',
}

export enum OperationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  MERGED = 'MERGED',
}

@Schema({
  collection: 'sync_operations',
  timestamps: { createdAt: 'serverTimestamp' },
  toJSON: { virtuals: true },
})
export class SyncOperation {
  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true })
  clientId: string;

  @Prop({ required: true })
  sequenceNumber: number;

  @Prop({ required: true, enum: OperationType })
  operationType: OperationType;

  @Prop({ type: Object, required: true })
  payload: Record<string, any>;

  // Idempotency — unique index enforced at DB layer
  @Prop({ required: true, unique: true, index: true })
  idempotencyKey: string;

  @Prop({ enum: OperationStatus, default: OperationStatus.ACCEPTED })
  status: OperationStatus;

  @Prop({ type: Object, default: null })
  conflictDetails: Record<string, any> | null;

  @Prop({ required: true })
  clientTimestamp: Date;

  serverTimestamp: Date; // injected by timestamps option
}

export const SyncOperationSchema = SchemaFactory.createForClass(SyncOperation);

// Compound index for conflict queries
SyncOperationSchema.index({ tenantId: 1, clientId: 1 });
SyncOperationSchema.index({ tenantId: 1, 'payload.itemId': 1, serverTimestamp: -1 });
