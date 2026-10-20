import { Module } from '@nestjs/common';
import { HealthController } from './health.controller.js';
import { ShopifyModule } from '../shopify/shopify.module.js';

@Module({
  imports: [ShopifyModule],
  controllers: [HealthController],
})
export class HealthModule {}
