import { Module } from '@nestjs/common';
import { SimulatorController } from './simulator.controller.js';
import { SimulatorService } from './simulator.service.js';
import { OrdersModule } from '../orders/orders.module.js';
import { WebhooksModule } from '../webhooks/webhooks.module.js';
import { ShopifyModule } from '../shopify/shopify.module.js';

@Module({
  imports: [OrdersModule, WebhooksModule, ShopifyModule],
  controllers: [SimulatorController],
  providers: [SimulatorService],
  exports: [SimulatorService],
})
export class SimulatorModule {}
