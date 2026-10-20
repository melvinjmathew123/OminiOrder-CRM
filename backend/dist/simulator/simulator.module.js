var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SimulatorController } from './simulator.controller.js';
import { SimulatorService } from './simulator.service.js';
import { OrdersModule } from '../orders/orders.module.js';
import { WebhooksModule } from '../webhooks/webhooks.module.js';
import { ShopifyModule } from '../shopify/shopify.module.js';
let SimulatorModule = class SimulatorModule {
};
SimulatorModule = __decorate([
    Module({
        imports: [OrdersModule, WebhooksModule, ShopifyModule],
        controllers: [SimulatorController],
        providers: [SimulatorService],
        exports: [SimulatorService],
    })
], SimulatorModule);
export { SimulatorModule };
//# sourceMappingURL=simulator.module.js.map