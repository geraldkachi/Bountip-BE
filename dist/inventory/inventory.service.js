"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InventoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tenant_entity_1 = require("./entities/tenant.entity");
const stock_item_entity_1 = require("./entities/stock-item.entity");
const stock_movement_entity_1 = require("./entities/stock-movement.entity");
let InventoryService = InventoryService_1 = class InventoryService {
    tenantModel;
    stockItemModel;
    movementModel;
    logger = new common_1.Logger(InventoryService_1.name);
    constructor(tenantModel, stockItemModel, movementModel) {
        this.tenantModel = tenantModel;
        this.stockItemModel = stockItemModel;
        this.movementModel = movementModel;
    }
    async createTenant(dto) {
        return this.tenantModel.create(dto);
    }
    async getTenants() {
        return this.tenantModel.find().sort({ name: 1 });
    }
    async createStockItem(tenantId, dto) {
        await this.assertTenantExists(tenantId);
        return this.stockItemModel.create({ ...dto, tenantId });
    }
    async updateStockItem(tenantId, itemId, dto) {
        const item = await this.stockItemModel.findOneAndUpdate({ _id: itemId, tenantId }, { $set: dto }, { new: true });
        if (!item)
            throw new common_1.NotFoundException(`Item ${itemId} not found for tenant ${tenantId}`);
        return item;
    }
    async getStockLevels(tenantId) {
        await this.assertTenantExists(tenantId);
        return this.stockItemModel.find({ tenantId }).sort({ name: 1 });
    }
    async getAggregateStockLevels(parentTenantId) {
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
    async recordMovement(tenantId, itemId, dto) {
        const delta = this.movementDelta(dto.type, dto.quantity);
        const filter = { _id: itemId, tenantId };
        if (delta < 0) {
            filter.currentQuantity = { $gte: Math.abs(delta) };
        }
        const before = await this.stockItemModel.findOne({ _id: itemId, tenantId });
        if (!before)
            throw new common_1.NotFoundException(`Stock item ${itemId} not found for tenant ${tenantId}`);
        const updated = await this.stockItemModel.findOneAndUpdate(filter, { $inc: { currentQuantity: delta } }, { new: true });
        if (!updated) {
            throw new common_1.BadRequestException(`Insufficient stock. Current: ${before.currentQuantity}, Requested: ${dto.quantity}`);
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
    async getMovementHistory(tenantId, itemId) {
        const item = await this.stockItemModel.findOne({ _id: itemId, tenantId });
        if (!item)
            throw new common_1.NotFoundException(`Item ${itemId} not found`);
        const movements = await this.movementModel
            .find({ tenantId, stockItemId: itemId })
            .sort({ createdAt: -1 })
            .limit(50);
        return { item, movements };
    }
    async getLowStockItems(tenantId) {
        return this.stockItemModel.aggregate([
            { $match: { tenantId, lowStockThreshold: { $gt: 0 } } },
            { $match: { $expr: { $lte: ['$currentQuantity', '$lowStockThreshold'] } } },
            { $sort: { currentQuantity: 1 } },
        ]);
    }
    movementDelta(type, quantity) {
        return type === stock_movement_entity_1.MovementType.SALE || type === stock_movement_entity_1.MovementType.WASTE
            ? -Math.abs(quantity)
            : Math.abs(quantity);
    }
    async assertTenantExists(tenantId) {
        const exists = await this.tenantModel.findById(tenantId);
        if (!exists)
            throw new common_1.NotFoundException(`Tenant ${tenantId} not found`);
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = InventoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tenant_entity_1.Tenant.name)),
    __param(1, (0, mongoose_1.InjectModel)(stock_item_entity_1.StockItem.name)),
    __param(2, (0, mongoose_1.InjectModel)(stock_movement_entity_1.StockMovement.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map