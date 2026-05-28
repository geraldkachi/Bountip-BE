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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inventory_service_1 = require("./inventory.service");
const inventory_dto_1 = require("./dto/inventory.dto");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    createTenant(dto) {
        return this.inventoryService.createTenant(dto);
    }
    getTenants() {
        return this.inventoryService.getTenants();
    }
    createItem(tenantId, dto) {
        return this.inventoryService.createStockItem(tenantId, dto);
    }
    updateItem(tenantId, itemId, dto) {
        return this.inventoryService.updateStockItem(tenantId, itemId, dto);
    }
    getStockLevels(tenantId) {
        return this.inventoryService.getStockLevels(tenantId);
    }
    getLowStock(tenantId) {
        return this.inventoryService.getLowStockItems(tenantId);
    }
    recordMovement(tenantId, itemId, dto) {
        return this.inventoryService.recordMovement(tenantId, itemId, dto);
    }
    getMovements(tenantId, itemId) {
        return this.inventoryService.getMovementHistory(tenantId, itemId);
    }
    getAggregate(parentTenantId) {
        return this.inventoryService.getAggregateStockLevels(parentTenantId);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)('tenants'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new tenant / location' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_dto_1.CreateTenantDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createTenant", null);
__decorate([
    (0, common_1.Get)('tenants'),
    (0, swagger_1.ApiOperation)({ summary: 'List all tenants' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getTenants", null);
__decorate([
    (0, common_1.Post)('tenants/:tenantId/items'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a stock item for a tenant' }),
    (0, swagger_1.ApiHeader)({ name: 'x-tenant-id', description: 'Tenant ID for audit logging' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_dto_1.CreateStockItemDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createItem", null);
__decorate([
    (0, common_1.Patch)('tenants/:tenantId/items/:itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a stock item' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, inventory_dto_1.UpdateStockItemDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Get)('tenants/:tenantId/items'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current stock levels for a tenant' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getStockLevels", null);
__decorate([
    (0, common_1.Get)('tenants/:tenantId/items/low-stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Get items at or below low-stock threshold' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getLowStock", null);
__decorate([
    (0, common_1.Post)('tenants/:tenantId/items/:itemId/movements'),
    (0, swagger_1.ApiOperation)({ summary: 'Record a stock movement (sale, restock, waste)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, inventory_dto_1.RecordMovementDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "recordMovement", null);
__decorate([
    (0, common_1.Get)('tenants/:tenantId/items/:itemId/movements'),
    (0, swagger_1.ApiOperation)({ summary: 'Get movement history for a stock item' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getMovements", null);
__decorate([
    (0, common_1.Get)('aggregate/:parentTenantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Aggregate stock levels across all child locations' }),
    __param(0, (0, common_1.Param)('parentTenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getAggregate", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('inventory'),
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map