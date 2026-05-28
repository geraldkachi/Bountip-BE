export type ProviderScenario = 'success' | 'timeout' | 'provider_error' | 'network_failure';
export interface ProviderResponse {
    success: boolean;
    reference?: string;
    status?: string;
    message?: string;
    scenario: ProviderScenario;
}
export declare class MockPaymentProvider {
    private readonly logger;
    charge(idempotencyKey: string, amount: number, currency: string, email: string, scenario?: ProviderScenario): Promise<ProviderResponse>;
    private delay;
}
