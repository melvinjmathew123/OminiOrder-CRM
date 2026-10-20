var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ShopifyService } from '../shopify/shopify.service.js';
let HealthController = class HealthController {
    prisma;
    shopifyService;
    constructor(prisma, shopifyService) {
        this.prisma = prisma;
        this.shopifyService = shopifyService;
    }
    async check() {
        const memory = process.memoryUsage();
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: `${Math.floor(process.uptime())}s`,
            database: {
                connected: this.prisma.isConnected,
                type: 'PostgreSQL (Prisma ORM)',
            },
            shopify: this.shopifyService.getStoreInfo(),
            system: {
                nodeVersion: process.version,
                platform: process.platform,
                memoryUsageMb: {
                    rss: Math.round(memory.rss / 1024 / 1024),
                    heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
                    heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
                },
            },
        };
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
HealthController = __decorate([
    Controller('health'),
    __metadata("design:paramtypes", [PrismaService,
        ShopifyService])
], HealthController);
export { HealthController };
//# sourceMappingURL=health.controller.js.map