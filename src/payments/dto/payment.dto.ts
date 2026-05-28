import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEmail, IsOptional, Min } from 'class-validator';

export class InitiatePaymentDto {
  @ApiProperty({ example: 'tenant_lagos_001' })
  @IsString()
  tenantId: string;

  @ApiProperty({ example: 'order_20250101_001' })
  @IsString()
  orderId: string;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiPropertyOptional({ example: 'NGN' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 'customer@example.com' })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;
}

export class ReconcileDto {
  @ApiProperty({
    description: 'Provider-side transactions (mock Paystack response)',
    example: [{ reference: 'pstk_123', status: 'success', amount: 15000 }],
  })
  providerTransactions: Array<{
    reference: string;
    status: string;
    amount: number;
    paidAt?: string;
  }>;
}
