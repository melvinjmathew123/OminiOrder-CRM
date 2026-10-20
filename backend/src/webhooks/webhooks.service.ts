import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrdersService } from '../orders/orders.service.js';
import { ShopifyOrderPayload } from '../shopify/shopify.interface.js';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private memWebhookLogs: any[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersService: OrdersService,
  ) {}

  /**
   * Process Shopify order webhooks with idempotency, stale update protection, and audit logging
   */
  async processOrderWebhook(
    topic: string,
    webhookId: string | undefined,
    payload: ShopifyOrderPayload,
  ) {
    const shopifyOrderId = String(payload.id);

    this.logger.log(
      `Received webhook event: [${topic}] for Shopify Order ID: ${shopifyOrderId} (Delivery ID: ${webhookId || 'N/A'})`,
    );

    // 1. Idempotency Check: Duplicate delivery check
    if (webhookId) {
      let isDuplicate = false;

      if (this.prisma.isConnected) {
        try {
          const existingDelivery = await this.prisma.webhookLog.findUnique({
            where: { webhookId },
          });
          if (existingDelivery) isDuplicate = true;
        } catch (e) {
          isDuplicate = this.memWebhookLogs.some((l) => l.webhookId === webhookId);
        }
      } else {
        isDuplicate = this.memWebhookLogs.some((l) => l.webhookId === webhookId);
      }

      if (isDuplicate) {
        this.logger.warn(
          `Duplicate webhook delivery detected for Webhook ID: ${webhookId}. Acknowledging with 200 OK.`,
        );

        await this.recordWebhookLog({
          webhookId: `${webhookId}-dup-${Date.now()}`,
          topic,
          shopifyOrderId,
          status: 'DUPLICATE',
          details: `Duplicate delivery of original webhook ${webhookId}`,
        });

        return {
          success: true,
          status: 'DUPLICATE',
          message: 'Webhook already processed (Idempotent response)',
          orderId: shopifyOrderId,
        };
      }
    }

    // 2. Out-of-order check (stale update protection)
    try {
      const existingOrder = await this.ordersService.getOrderById(shopifyOrderId);
      if (existingOrder && existingOrder.shopifyUpdatedAt && payload.updated_at) {
        const incomingUpdate = new Date(payload.updated_at);
        const existingUpdate = new Date(existingOrder.shopifyUpdatedAt);
        if (incomingUpdate < existingUpdate) {
          this.logger.warn(
            `Received older webhook event (${incomingUpdate.toISOString()}) for order ${shopifyOrderId} with newer data (${existingUpdate.toISOString()}). Skipping update.`,
          );

          await this.recordWebhookLog({
            webhookId: webhookId || `wh-${Date.now()}`,
            topic,
            shopifyOrderId,
            status: 'DUPLICATE',
            details: 'Stale webhook update rejected (newer state already exists in DB)',
          });

          return {
            success: true,
            status: 'SKIPPED_STALE',
            message: 'Stale update skipped; newer data present in database',
            orderId: shopifyOrderId,
          };
        }
      }
    } catch (e) {
      // Order doesn't exist yet, proceeding to creation
    }

    // 3. Process the event and update the database
    try {
      const { order, isNew } = await this.ordersService.upsertShopifyOrderPayload(
        payload,
        'SHOPIFY_WEBHOOK',
      );

      // Record successful webhook execution
      await this.recordWebhookLog({
        webhookId: webhookId || `wh-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        topic,
        shopifyOrderId,
        status: 'PROCESSED',
        details: isNew ? 'Order created via webhook' : 'Order updated via webhook',
      });

      this.logger.log(`Webhook [${topic}] processed successfully for Order ${order?.orderNumber}`);

      return {
        success: true,
        status: 'PROCESSED',
        action: isNew ? 'CREATED' : 'UPDATED',
        orderNumber: order?.orderNumber,
        orderId: order?.id,
      };
    } catch (error: any) {
      this.logger.error(`Error processing webhook [${topic}]: ${error.message}`);

      await this.recordWebhookLog({
        webhookId: webhookId || `wh-err-${Date.now()}`,
        topic,
        shopifyOrderId,
        status: 'FAILED',
        details: `Error: ${error.message}`,
      });

      throw new BadRequestException(`Webhook processing failed: ${error.message}`);
    }
  }

  /**
   * Helper: Record webhook log to PostgreSQL and memory
   */
  private async recordWebhookLog(data: {
    webhookId?: string;
    topic: string;
    shopifyOrderId?: string;
    status: string;
    details?: string;
  }) {
    const logItem = {
      id: `whlog-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      webhookId: data.webhookId || null,
      topic: data.topic,
      shopifyOrderId: data.shopifyOrderId || null,
      status: data.status,
      details: data.details || null,
      receivedAt: new Date(),
    };

    this.memWebhookLogs.unshift(logItem);
    if (this.memWebhookLogs.length > 100) this.memWebhookLogs.pop();

    if (this.prisma.isConnected) {
      try {
        await this.prisma.webhookLog.create({
          data: {
            webhookId: logItem.webhookId,
            topic: logItem.topic,
            shopifyOrderId: logItem.shopifyOrderId,
            status: logItem.status,
            details: logItem.details,
            receivedAt: logItem.receivedAt,
          },
        });
      } catch (err: any) {
        this.logger.debug(`Prisma webhook log error: ${err.message}`);
      }
    }
  }

  /**
   * Fetch recent webhook logs for the audit inspector UI
   */
  async getWebhookLogs(limit = 20) {
    if (this.prisma.isConnected) {
      try {
        const logs = await this.prisma.webhookLog.findMany({
          orderBy: { receivedAt: 'desc' },
          take: limit,
        });
        if (logs.length > 0) return logs;
      } catch (e) {
        // Fallback
      }
    }

    return this.memWebhookLogs.slice(0, limit);
  }
}
