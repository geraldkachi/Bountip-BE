import { Injectable, Logger } from '@nestjs/common';

export type ProviderScenario = 'success' | 'timeout' | 'provider_error' | 'network_failure';

export interface ProviderResponse {
  success: boolean;
  reference?: string;
  status?: string;
  message?: string;
  scenario: ProviderScenario;
}

/**
 * Mock Paystack-compatible provider for testing payment flows.
 * Simulates the three failure modes required by the assessment.
 */
@Injectable()
export class MockPaymentProvider {
  private readonly logger = new Logger(MockPaymentProvider.name);

  async charge(
    idempotencyKey: string,
    amount: number,
    currency: string,
    email: string,
    scenario: ProviderScenario = 'success',
  ): Promise<ProviderResponse> {
    this.logger.debug(`Charging via mock provider: ${scenario}`);

    switch (scenario) {
      case 'success':
        await this.delay(100);
        return {
          success: true,
          reference: `mock_${idempotencyKey.slice(0, 12)}`,
          status: 'success',
          scenario,
        };

      case 'timeout':
        // Simulate 30s timeout — we throw after simulated wait
        await this.delay(200); // Fast timeout for tests
        throw Object.assign(new Error('Provider request timed out'), { code: 'ETIMEDOUT' });

      case 'provider_error':
        await this.delay(80);
        return {
          success: false,
          status: 'declined',
          message: 'Card declined by issuer',
          scenario,
        };

      case 'network_failure':
        await this.delay(50);
        throw Object.assign(new Error('Network unreachable'), { code: 'ECONNREFUSED' });

      default:
        throw new Error(`Unknown scenario: ${scenario}`);
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
