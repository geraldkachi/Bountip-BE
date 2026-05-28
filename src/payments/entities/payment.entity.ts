import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;
export type PaymentEventDocument = HydratedDocument<PaymentEvent>;

export enum PaymentStatus {
  INITIATED = 'INITIATED',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  TIMEOUT = 'TIMEOUT',
}

export enum FailureMode {
  PROVIDER_TIMEOUT = 'PROVIDER_TIMEOUT',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  NETWORK_FAILURE = 'NETWORK_FAILURE',
}

@Schema({
  collection: 'payments',
  timestamps: { createdAt: 'initiatedAt', updatedAt: 'updatedAt' },
  toJSON: { virtuals: true },
})
export class Payment {
  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true })
  orderId: string;

  // Deterministic key: sha256(tenantId:orderId) — unique index prevents double-charge
  @Prop({ required: true, unique: true, index: true })
  idempotencyKey: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'NGN' })
  currency: string;

  @Prop({ default: '' })
  customerEmail: string;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.INITIATED })
  status: PaymentStatus;

  @Prop({ default: null, type: String })
  providerReference: string | null;

  @Prop({ default: null, type: String })
  providerStatus: string | null;

  @Prop({ enum: FailureMode, default: null, type: String })
  failureMode: FailureMode | null;

  @Prop({ default: null, type: String })
  failureReason: string | null;

  @Prop({ type: Object, default: null })
  providerResponse: Record<string, any> | null;

  @Prop({ default: null, type: Date })
  reconciledAt: Date | null;

  @Prop({ default: null, type: String })
  reconciledBy: string | null;

  initiatedAt: Date;
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// One payment per order per tenant — idempotency enforced at DB layer
PaymentSchema.index({ tenantId: 1, orderId: 1 }, { unique: true });
PaymentSchema.index({ tenantId: 1, status: 1 });

// ─── Payment Event ────────────────────────────────────────────────────────────

@Schema({
  collection: 'payment_events',
  timestamps: { createdAt: true, updatedAt: false },
  toJSON: { virtuals: true },
})
export class PaymentEvent {
  @Prop({ required: true, index: true })
  paymentId: string;

  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  eventType: string;

  @Prop({ type: Object, default: null })
  metadata: Record<string, any> | null;
}

export const PaymentEventSchema = SchemaFactory.createForClass(PaymentEvent);
PaymentEventSchema.index({ paymentId: 1, createdAt: -1 });
