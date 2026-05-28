import {
  Controller, Get, Post, Patch, Body, Param, Headers,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiHeader } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import {
  CreateTenantDto, CreateStockItemDto, UpdateStockItemDto, RecordMovementDto,
} from './dto/inventory.dto';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // ─── Tenants ──────────────────────────────────────────────────────────────

  @Post('tenants')
  @ApiOperation({ summary: 'Register a new tenant / location' })
  createTenant(@Body() dto: CreateTenantDto) {
    return this.inventoryService.createTenant(dto);
  }

  @Get('tenants')
  @ApiOperation({ summary: 'List all tenants' })
  getTenants() {
    return this.inventoryService.getTenants();
  }

  // ─── Stock Items ──────────────────────────────────────────────────────────

  @Post('tenants/:tenantId/items')
  @ApiOperation({ summary: 'Create a stock item for a tenant' })
  @ApiHeader({ name: 'x-tenant-id', description: 'Tenant ID for audit logging' })
  createItem(
    @Param('tenantId') tenantId: string,
    @Body() dto: CreateStockItemDto,
  ) {
    return this.inventoryService.createStockItem(tenantId, dto);
  }

  @Patch('tenants/:tenantId/items/:itemId')
  @ApiOperation({ summary: 'Update a stock item' })
  updateItem(
    @Param('tenantId') tenantId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateStockItemDto,
  ) {
    return this.inventoryService.updateStockItem(tenantId, itemId, dto);
  }

  @Get('tenants/:tenantId/items')
  @ApiOperation({ summary: 'Get current stock levels for a tenant' })
  getStockLevels(@Param('tenantId') tenantId: string) {
    return this.inventoryService.getStockLevels(tenantId);
  }

  @Get('tenants/:tenantId/items/low-stock')
  @ApiOperation({ summary: 'Get items at or below low-stock threshold' })
  getLowStock(@Param('tenantId') tenantId: string) {
    return this.inventoryService.getLowStockItems(tenantId);
  }

  // ─── Stock Movements ──────────────────────────────────────────────────────

  @Post('tenants/:tenantId/items/:itemId/movements')
  @ApiOperation({ summary: 'Record a stock movement (sale, restock, waste)' })
  @HttpCode(HttpStatus.CREATED)
  recordMovement(
    @Param('tenantId') tenantId: string,
    @Param('itemId') itemId: string,
    @Body() dto: RecordMovementDto,
  ) {
    return this.inventoryService.recordMovement(tenantId, itemId, dto);
  }

  @Get('tenants/:tenantId/items/:itemId/movements')
  @ApiOperation({ summary: 'Get movement history for a stock item' })
  getMovements(
    @Param('tenantId') tenantId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.inventoryService.getMovementHistory(tenantId, itemId);
  }

  // ─── Aggregate View ───────────────────────────────────────────────────────

  @Get('aggregate/:parentTenantId')
  @ApiOperation({ summary: 'Aggregate stock levels across all child locations' })
  getAggregate(@Param('parentTenantId') parentTenantId: string) {
    return this.inventoryService.getAggregateStockLevels(parentTenantId);
  }
}
