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
exports.StockMovementSchema = exports.StockMovement = exports.MovementType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var MovementType;
(function (MovementType) {
    MovementType["SALE"] = "SALE";
    MovementType["RESTOCK"] = "RESTOCK";
    MovementType["WASTE"] = "WASTE";
    MovementType["ADJUSTMENT"] = "ADJUSTMENT";
})(MovementType || (exports.MovementType = MovementType = {}));
let StockMovement = class StockMovement {
    tenantId;
    stockItemId;
    type;
    quantity;
    quantityBefore;
    quantityAfter;
    referenceId;
    notes;
    performedBy;
};
exports.StockMovement = StockMovement;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "stockItemId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: MovementType }),
    __metadata("design:type", String)
], StockMovement.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], StockMovement.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], StockMovement.prototype, "quantityBefore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], StockMovement.prototype, "quantityAfter", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, type: String }),
    __metadata("design:type", Object)
], StockMovement.prototype, "referenceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, type: String }),
    __metadata("design:type", Object)
], StockMovement.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, type: String }),
    __metadata("design:type", Object)
], StockMovement.prototype, "performedBy", void 0);
exports.StockMovement = StockMovement = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'stock_movements',
        timestamps: { createdAt: true, updatedAt: false },
        toJSON: { virtuals: true },
    })
], StockMovement);
exports.StockMovementSchema = mongoose_1.SchemaFactory.createForClass(StockMovement);
exports.StockMovementSchema.index({ tenantId: 1, createdAt: -1 });
exports.StockMovementSchema.index({ stockItemId: 1, createdAt: -1 });
//# sourceMappingURL=stock-movement.entity.js.map