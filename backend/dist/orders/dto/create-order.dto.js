var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsOptional, IsEmail, IsArray, ValidateNested, IsNumber, Min, } from 'class-validator';
import { Type } from 'class-transformer';
export class OrderItemDto {
    title;
    variantTitle;
    sku;
    quantity;
    price;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "title", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "variantTitle", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "sku", void 0);
__decorate([
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "quantity", void 0);
__decorate([
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "price", void 0);
export class OrderShippingAddressDto {
    name;
    address1;
    address2;
    city;
    province;
    zip;
    country;
    phone;
}
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], OrderShippingAddressDto.prototype, "name", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], OrderShippingAddressDto.prototype, "address1", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], OrderShippingAddressDto.prototype, "address2", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], OrderShippingAddressDto.prototype, "city", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], OrderShippingAddressDto.prototype, "province", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], OrderShippingAddressDto.prototype, "zip", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], OrderShippingAddressDto.prototype, "country", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], OrderShippingAddressDto.prototype, "phone", void 0);
export class CreateOrderDto {
    customerName;
    customerEmail;
    customerPhone;
    financialStatus = 'pending';
    fulfillmentStatus = 'unfulfilled';
    currency = 'USD';
    notes;
    lineItems;
    shippingAddress;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "customerName", void 0);
__decorate([
    IsOptional(),
    IsEmail(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "customerEmail", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "customerPhone", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "financialStatus", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "fulfillmentStatus", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "currency", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "notes", void 0);
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => OrderItemDto),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "lineItems", void 0);
__decorate([
    IsOptional(),
    ValidateNested(),
    Type(() => OrderShippingAddressDto),
    __metadata("design:type", OrderShippingAddressDto)
], CreateOrderDto.prototype, "shippingAddress", void 0);
//# sourceMappingURL=create-order.dto.js.map