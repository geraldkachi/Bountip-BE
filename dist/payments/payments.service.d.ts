import { Model } from 'mongoose';
import { Payment, PaymentDocument, PaymentEvent, PaymentEventDocument } from './entities/payment.entity';
import { MockPaymentProvider, ProviderScenario } from './mock-provider.service';
import { InitiatePaymentDto, ReconcileDto } from './dto/payment.dto';
export declare class PaymentsService {
    private paymentModel;
    private eventModel;
    private provider;
    private readonly logger;
    constructor(paymentModel: Model<PaymentDocument>, eventModel: Model<PaymentEventDocument>, provider: MockPaymentProvider);
    initiatePayment(dto: InitiatePaymentDto, scenario?: ProviderScenario): Promise<{
        payment: import("mongoose").Document<unknown, {}, Payment, {}, import("mongoose").DefaultSchemaOptions> & Payment & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
        duplicate: boolean;
    }>;
    private confirmPayment;
    private failPayment;
    private emitEvent;
    reconcile(tenantId: string, dto: ReconcileDto): Promise<{
        reconciledAt: string;
        tenantId: string;
        summary: {
            totalInternal: number;
            totalProvider: number;
            matched: number;
            discrepancies: number;
        };
        matched: any[];
        discrepancies: any[];
    }>;
    getPayments(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Payment, {}, import("mongoose").DefaultSchemaOptions> & Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Payment, {}, import("mongoose").DefaultSchemaOptions> & Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getPaymentEvents(paymentId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, PaymentEvent, {}, import("mongoose").DefaultSchemaOptions> & PaymentEvent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, PaymentEvent, {}, import("mongoose").DefaultSchemaOptions> & PaymentEvent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
}
