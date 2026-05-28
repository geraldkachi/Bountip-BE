import { PaymentsService } from './payments.service';
import { InitiatePaymentDto, ReconcileDto } from './dto/payment.dto';
type ProviderScenario = 'success' | 'timeout' | 'provider_error' | 'network_failure';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    initiatePayment(dto: InitiatePaymentDto, scenario?: ProviderScenario): Promise<{
        payment: import("mongoose").Document<unknown, {}, import("./entities/payment.entity").Payment, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/payment.entity").Payment & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
        duplicate: boolean;
    }>;
    getPayments(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./entities/payment.entity").Payment, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/payment.entity").Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./entities/payment.entity").Payment, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/payment.entity").Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getPaymentEvents(_tenantId: string, paymentId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./entities/payment.entity").PaymentEvent, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/payment.entity").PaymentEvent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./entities/payment.entity").PaymentEvent, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/payment.entity").PaymentEvent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
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
}
export {};
