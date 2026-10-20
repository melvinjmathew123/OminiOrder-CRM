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
import { Controller, Get, Post, Param, Query, Body, UsePipes, ValidationPipe, } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { GetOrdersFilterDto } from './dto/get-orders-filter.dto.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async getOrders(filter) {
        return this.ordersService.getOrders(filter);
    }
    async getOrderStats() {
        return this.ordersService.getOrderStats();
    }
    async syncOrders() {
        return this.ordersService.syncOrdersFromShopify('MANUAL');
    }
    async getOrderById(id) {
        return this.ordersService.getOrderById(id);
    }
    async createOrder(createOrderDto) {
        return this.ordersService.createOrder(createOrderDto);
    }
};
__decorate([
    Get(),
    UsePipes(new ValidationPipe({ transform: true })),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetOrdersFilterDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrders", null);
__decorate([
    Get('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrderStats", null);
__decorate([
    Post('sync'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "syncOrders", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrderById", null);
__decorate([
    Post(),
    UsePipes(new ValidationPipe({ transform: true })),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
OrdersController = __decorate([
    Controller('orders'),
    __metadata("design:paramtypes", [OrdersService])
], OrdersController);
export { OrdersController };
//# sourceMappingURL=orders.controller.js.map