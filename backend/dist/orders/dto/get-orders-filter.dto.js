var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
export class GetOrdersFilterDto {
    search;
    financialStatus;
    fulfillmentStatus;
    startDate;
    endDate;
    sortBy = 'orderDate';
    sortOrder = 'desc';
    page = 1;
    limit = 10;
}
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], GetOrdersFilterDto.prototype, "search", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], GetOrdersFilterDto.prototype, "financialStatus", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], GetOrdersFilterDto.prototype, "fulfillmentStatus", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], GetOrdersFilterDto.prototype, "startDate", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], GetOrdersFilterDto.prototype, "endDate", void 0);
__decorate([
    IsOptional(),
    IsString(),
    IsIn(['orderDate', 'totalPrice', 'orderNumber', 'createdAt']),
    __metadata("design:type", String)
], GetOrdersFilterDto.prototype, "sortBy", void 0);
__decorate([
    IsOptional(),
    IsString(),
    IsIn(['asc', 'desc', 'ASC', 'DESC']),
    __metadata("design:type", String)
], GetOrdersFilterDto.prototype, "sortOrder", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], GetOrdersFilterDto.prototype, "page", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], GetOrdersFilterDto.prototype, "limit", void 0);
//# sourceMappingURL=get-orders-filter.dto.js.map