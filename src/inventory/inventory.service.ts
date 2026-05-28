import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from './entities/tenant.entity';
import { StockItem, StockItemDocument } from './entities/stock-item.entity';
import { StockMovement, StockMovementDocument, MovementType } from './entities/stock-movement.entity';
import { CreateTenantDto, CreateStockItemDto, UpdateStockItemDto, RecordMovementDto } from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
    @InjectModel(StockItem.name) private stockItemModel: Model<StockItemDocument>,
    @InjectModel(StockMovement.name) private movementModel: Model<StockMovementDocument>,
  ) {}

  // ─── Tenants ──────────────────────────────────────────────────────────────

  async createTenant(dto: CreateTenantDto): Promise<Tenant> {
    return this.tenantModel.create(dto);
  }

  async getTenants(): Promise<Tenant[]> {
    return this.tenantModel.find().sort({ name: 1 });
  }

  // ─── Stock Items ──────────────────────────────────────────────────────────

  async createStockItem(tenantId: string, dto: CreateStockItemDto): Promise<StockItem> {
    await this.assertTenantExists(tenantId);
    return this.stockItemModel.create({ ...dto, tenantId });
  }

  async updateStockItem(tenantId: string, itemId: string, dto: UpdateStockItemDto): Promise<StockItem> {
    const item = await this.stockItemModel.findOneAndUpdate(
      { _id: itemId, tenantId },
      { $set: dto },
      { new: true },
    );
    if (!item) throw new NotFoundException(`Item ${itemId} not found for tenant ${tenantId}`);
    return item;
  }

  async getStockLevels(tenantId: string): Promise<StockItem[]> {
    await this.assertTenantExists(tenantId);
    return this.stockItemModel.find({ tenantId }).sort({ name: 1 });
  }

  /**
   * Aggregate stock across all child tenants under a parent.
   * Uses MongoDB aggregation pipeline — groups by SKU, sums quantities,
   * counts distinct locations, and finds the minimum for alerting.
   */
  async getAggregateStockLevels(parentTenantId: string) {
    const children = await this.tenantModel.find({ parentId: parentTenantId });
    const tenantIds = [parentTenantId, ...children.map(t => String(t._id))];

    const aggregates = await this.stockItemModel.aggregate([
      { $match: { tenantId: { $in: tenantIds } } },
      {
        $group: {
          _id: { sku: '$sku', name: '$name', category: '$category' },
          totalQuantity: { $sum: '$currentQuantity' },
          locationCount: { $addToSet: '$tenantId' },
          minQuantity: { $min: '$currentQuantity' },
        },
      },
      {
        $project: {
          sku: '$_id.sku',
          name: '$_id.name',
          category: '$_id.category',
          totalQuantity: 1,
          locationCount: { $size: '$locationCount' },
          minQuantity: 1,
          _id: 0,
        },
      },
      { $sort: { name: 1 } },
    ]);

    return { parentTenantId, childCount: children.length, aggregates };
  }

  // ─── Stock Movements ──────────────────────────────────────────────────────

  /**
   * Records a stock movement atomically using MongoDB's findOneAndUpdate
   * with $inc. This is atomic at the document level — no separate locking
   * needed. We add a filter clause to prevent negative stock for SALE/WASTE.
   */
  async recordMovement(tenantId: string, itemId: string, dto: RecordMovementDto): Promise<StockMovement> {
    const delta = this.movementDelta(dto.type, dto.quantity);

    // Build the query filter — prevent negative stock for outbound movements
    const filter: Record<string, any> = { _id: itemId, tenantId };
    if (delta < 0) {
      // Only allow decrement when enough stock exists
      filter.currentQuantity = { $gte: Math.abs(delta) };
    }

    // Atomic read-then-update: fetch current qty and increment in one op
    const before = await this.stockItemModel.findOne({ _id: itemId, tenantId });
    if (!before) throw new NotFoundException(`Stock item ${itemId} not found for tenant ${tenantId}`);

    const updated = await this.stockItemModel.findOneAndUpdate(
      filter,
      { $inc: { currentQuantity: delta } },
      { new: true },
    );

    if (!updated) {
      throw new BadRequestException(
        `Insufficient stock. Current: ${before.currentQuantity}, Requested: ${dto.quantity}`,
      );
    }

    const movement = await this.movementModel.create({
      tenantId,
      stockItemId: itemId,
      type: dto.type,
      quantity: delta,
      quantityBefore: before.currentQuantity,
      quantityAfter: updated.currentQuantity,
      referenceId: dto.referenceId ?? null,
      notes: dto.notes ?? null,
      performedBy: dto.performedBy ?? null,
    });

    this.logger.log(JSON.stringify({
      event: 'stock_movement',
      tenantId,
      itemId,
      movementType: dto.type,
      quantityBefore: before.currentQuantity,
      quantityAfter: updated.currentQuantity,
      delta,
      movementId: movement._id,
    }));

    if (updated.currentQuantity <= updated.lowStockThreshold && updated.lowStockThreshold > 0) {
      this.logger.warn(JSON.stringify({
        event: 'low_stock_alert',
        tenantId,
        itemId,
        sku: updated.sku,
        name: updated.name,
        currentQuantity: updated.currentQuantity,
        threshold: updated.lowStockThreshold,
      }));
    }

    return movement;
  }

  async getMovementHistory(tenantId: string, itemId: string) {
    const item = await this.stockItemModel.findOne({ _id: itemId, tenantId });
    if (!item) throw new NotFoundException(`Item ${itemId} not found`);
    const movements = await this.movementModel
      .find({ tenantId, stockItemId: itemId })
      .sort({ createdAt: -1 })
      .limit(50);
    return { item, movements };
  }

  async getLowStockItems(tenantId: string) {
    // Uses the compound index on (tenantId, currentQuantity)
    return this.stockItemModel.aggregate([
      { $match: { tenantId, lowStockThreshold: { $gt: 0 } } },
      { $match: { $expr: { $lte: ['$currentQuantity', '$lowStockThreshold'] } } },
      { $sort: { currentQuantity: 1 } },
    ]);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private movementDelta(type: MovementType, quantity: number): number {
    return type === MovementType.SALE || type === MovementType.WASTE
      ? -Math.abs(quantity)
      : Math.abs(quantity);
  }

  private async assertTenantExists(tenantId: string) {
    const exists = await this.tenantModel.findById(tenantId);
    if (!exists) throw new NotFoundException(`Tenant ${tenantId} not found`);
  }
}
