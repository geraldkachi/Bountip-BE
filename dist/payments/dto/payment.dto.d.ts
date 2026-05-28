export declare class InitiatePaymentDto {
    tenantId: string;
    orderId: string;
    amount: number;
    currency?: string;
    customerEmail?: string;
}
export declare class ReconcileDto {
    providerTransactions: Array<{
        reference: string;
        status: string;
        amount: number;
        paidAt?: string;
    }>;
}
