import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ShopifyService } from '../shopify/shopify.service.js';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly shopifyService: ShopifyService,
  ) {}

  @Get()
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
}
