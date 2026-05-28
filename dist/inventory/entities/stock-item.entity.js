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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockItemSchema = exports.StockItem = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let StockItem = class StockItem {
    tenantId;
    sku;
    name;
    category;
    currentQuantity;
    lowStockThreshold;
    unit;
    costPerUnit;
};
exports.StockItem = StockItem;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], StockItem.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], StockItem.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], StockItem.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, type: String }),
    __metadata("design:type", Object)
], StockItem.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StockItem.prototype, "currentQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StockItem.prototype, "lowStockThreshold", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'unit' }),
    __metadata("design:type", String)
], StockItem.prototype, "unit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StockItem.prototype, "costPerUnit", void 0);
exports.StockItem = StockItem = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'stock_items',
        timestamps: true,
        toJSON: { virtuals: true },
    })
], StockItem);
exports.StockItemSchema = mongoose_1.SchemaFactory.createForClass(StockItem);
exports.StockItemSchema.index({ tenantId: 1, sku: 1 }, { unique: true });
exports.StockItemSchema.index({ tenantId: 1, currentQuantity: 1 });
//# sourceMappingURL=stock-item.entity.js.map