import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsObject, IsString, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OperationType } from '../entities/sync-operation.entity';

export class SyncOperationDto {
  @ApiProperty({ example: 'op_abc123' })
  @IsString()
  idempotencyKey: string;

  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  sequenceNumber: number;

  @ApiProperty({ enum: OperationType })
  @IsEnum(OperationType)
  operationType: OperationType;

  @ApiProperty({ example: { itemId: 'item_1', quantity: 3 } })
  @IsObject()
  payload: Record<string, any>;

  @ApiProperty({ example: '2025-01-01T12:00:00Z' })
  @IsDateString()
  clientTimestamp: string;
}

export class SyncBatchDto {
  @ApiProperty({ example: 'tenant_lagos_001' })
  @IsString()
  tenantId: string;

  @ApiProperty({ example: 'client_pos_01' })
  @IsString()
  clientId: string;

  @ApiProperty({ type: [SyncOperationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncOperationDto)
  operations: SyncOperationDto[];
}

export class SyncResultDto {
  idempotencyKey: string;
  status: 'accepted' | 'rejected' | 'merged' | 'duplicate';
  message?: string;
  resolvedPayload?: Record<string, any>;
}

export class SyncResponseDto {
  batchId: string;
  processedAt: string;
  results: SyncResultDto[];
  summary: {
    accepted: number;
    rejected: number;
    merged: number;
    duplicates: number;
  };
}
