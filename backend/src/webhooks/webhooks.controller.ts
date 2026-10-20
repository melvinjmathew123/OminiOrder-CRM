import {
  Controller,
  Post,
  Get,
  Headers,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service.js';
import { ShopifyHmacGuard } from './guards/shopify-hmac.guard.js';
import type { ShopifyOrderPayload } from '../shopify/shopify.interface.js';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('shopify')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ShopifyHmacGuard)
  async handleShopifyWebhook(
    @Headers('x-shopify-topic') topic: string,
    @Headers('x-shopify-webhook-id') webhookId: string,
    @Body() payload: Record<string, any>,
  ) {
    const eventTopic = topic || 'orders/updated';
    return this.webhooksService.processOrderWebhook(
      eventTopic,
      webhookId,
      payload as ShopifyOrderPayload,
    );
  }

  @Get('logs')
  async getWebhookLogs(@Query('limit') limit?: number) {
    return this.webhooksService.getWebhookLogs(limit ? Number(limit) : 25);
  }
}
