import { Controller, Post, Get, Body } from '@nestjs/common';
import { SimulatorService } from './simulator.service.js';

@Controller('simulator')
export class SimulatorController {
  constructor(private readonly simulatorService: SimulatorService) {}

  @Post('seed')
  async seedOrders(@Body('count') count?: number) {
    return this.simulatorService.seedSampleOrders(count || 8);
  }

  @Post('webhook')
  async simulateWebhook(
    @Body()
    body: {
      topic: 'orders/create' | 'orders/updated';
      orderId?: string;
      financialStatus?: string;
      fulfillmentStatus?: string;
      forceDuplicate?: boolean;
      customWebhookId?: string;
    },
  ) {
    return this.simulatorService.simulateWebhook(body);
  }

  @Get('status')
  async getStatus() {
    return this.simulatorService.getSystemStatus();
  }
}
