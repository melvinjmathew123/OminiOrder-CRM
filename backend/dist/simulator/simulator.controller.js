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
import { Controller, Post, Get, Body } from '@nestjs/common';
import { SimulatorService } from './simulator.service.js';
let SimulatorController = class SimulatorController {
    simulatorService;
    constructor(simulatorService) {
        this.simulatorService = simulatorService;
    }
    async seedOrders(count) {
        return this.simulatorService.seedSampleOrders(count || 8);
    }
    async simulateWebhook(body) {
        return this.simulatorService.simulateWebhook(body);
    }
    async getStatus() {
        return this.simulatorService.getSystemStatus();
    }
};
__decorate([
    Post('seed'),
    __param(0, Body('count')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SimulatorController.prototype, "seedOrders", null);
__decorate([
    Post('webhook'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SimulatorController.prototype, "simulateWebhook", null);
__decorate([
    Get('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SimulatorController.prototype, "getStatus", null);
SimulatorController = __decorate([
    Controller('simulator'),
    __metadata("design:paramtypes", [SimulatorService])
], SimulatorController);
export { SimulatorController };
//# sourceMappingURL=simulator.controller.js.map