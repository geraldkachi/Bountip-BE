import { Controller, Post, Get, Body, Param, Query, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto, ReconcileDto } from './dto/payment.dto';

type ProviderScenario = 'success' | 'timeout' | 'provider_error' | 'network_failure';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Initiate a payment (idempotent)' })
  @ApiQuery({
    name: 'scenario',
    required: false,
    enum: ['success', 'timeout', 'provider_error', 'network_failure'],
    description: 'Mock provider scenario for testing',
  })
  initiatePayment(
    @Body() dto: InitiatePaymentDto,
    @Query('scenario') scenario: ProviderScenario = 'success',
  ) {
    return this.paymentsService.initiatePayment(dto, scenario);
  }

  @Get(':tenantId')
  @ApiOperation({ summary: 'Get all payments for a tenant' })
  getPayments(@Param('tenantId') tenantId: string) {
    return this.paymentsService.getPayments(tenantId);
  }

  @Get(':tenantId/:paymentId/events')
  @ApiOperation({ summary: 'Get audit event log for a payment' })
  getPaymentEvents(
    @Param('tenantId') _tenantId: string,
    @Param('paymentId') paymentId: string,
  ) {
    return this.paymentsService.getPaymentEvents(paymentId);
  }

  @Post(':tenantId/reconcile')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reconcile internal records against provider transactions' })
  reconcile(
    @Param('tenantId') tenantId: string,
    @Body() dto: ReconcileDto,
  ) {
    return this.paymentsService.reconcile(tenantId, dto);
  }
}
