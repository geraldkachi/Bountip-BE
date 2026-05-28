import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, Min, IsUUID } from 'class-validator';
import { MovementType } from '../entities/stock-movement.entity';

export class CreateTenantDto {
  @ApiProperty({ example: 'lagos-main' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Lagos Main Branch' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'parent-tenant-uuid' })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class CreateStockItemDto {
  @ApiProperty({ example: 'CHOC-001' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 'Chocolate Cake' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Cakes' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentQuantity?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;

  @ApiPropertyOptional({ example: 'pieces' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ example: 2500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPerUnit?: number;
}

export class UpdateStockItemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPerUnit?: number;
}

export class RecordMovementDto {
  @ApiProperty({ enum: MovementType })
  @IsEnum(MovementType)
  type: MovementType;

  @ApiProperty({ example: 3, description: 'Positive for in, negative for out' })
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional({ example: 'order_12345' })
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  performedBy?: string;
}
