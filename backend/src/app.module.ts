import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration.js';
import { validate } from './config/env.validation.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ShopifyModule } from './shopify/shopify.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { WebhooksModule } from './webhooks/webhooks.module.js';
import { SimulatorModule } from './simulator/simulator.module.js';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    ShopifyModule,
    OrdersModule,
    WebhooksModule,
    SimulatorModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
