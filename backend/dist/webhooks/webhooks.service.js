var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebhooksService_1;
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrdersService } from '../orders/orders.service.js';
let WebhooksService = WebhooksService_1 = class WebhooksService {
    prisma;
    ordersService;
    logger = new Logger(WebhooksService_1.name);
    memWebhookLogs = [];
    constructor(prisma, ordersService) {
        this.prisma = prisma;
        this.ordersService = ordersService;
    }
    async processOrderWebhook(topic, webhookId, payload) {
        const shopifyOrderId = String(payload.id);
        this.logger.log(`Received webhook event: [${topic}] for Shopify Order ID: ${shopifyOrderId} (Delivery ID: ${webhookId || 'N/A'})`);
        if (webhookId) {
            let isDuplicate = false;
            if (this.prisma.isConnected) {
                try {
                    const existingDelivery = await this.prisma.webhookLog.findUnique({
                        where: { webhookId },
                    });
                    if (existingDelivery)
                        isDuplicate = true;
                }
                catch (e) {
                    isDuplicate = this.memWebhookLogs.some((l) => l.webhookId === webhookId);
                }
            }
            else {
                isDuplicate = this.memWebhookLogs.some((l) => l.webhookId === webhookId);
            }
            if (isDuplicate) {
                this.logger.warn(`Duplicate webhook delivery detected for Webhook ID: ${webhookId}. Acknowledging with 200 OK.`);
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
        try {
            const existingOrder = await this.ordersService.getOrderById(shopifyOrderId);
            if (existingOrder && existingOrder.shopifyUpdatedAt && payload.updated_at) {
                const incomingUpdate = new Date(payload.updated_at);
                const existingUpdate = new Date(existingOrder.shopifyUpdatedAt);
                if (incomingUpdate < existingUpdate) {
                    this.logger.warn(`Received older webhook event (${incomingUpdate.toISOString()}) for order ${shopifyOrderId} with newer data (${existingUpdate.toISOString()}). Skipping update.`);
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
        }
        catch (e) {
        }
        try {
            const { order, isNew } = await this.ordersService.upsertShopifyOrderPayload(payload, 'SHOPIFY_WEBHOOK');
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
        }
        catch (error) {
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
    async recordWebhookLog(data) {
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
        if (this.memWebhookLogs.length > 100)
            this.memWebhookLogs.pop();
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
            }
            catch (err) {
                this.logger.debug(`Prisma webhook log error: ${err.message}`);
            }
        }
    }
    async getWebhookLogs(limit = 20) {
        if (this.prisma.isConnected) {
            try {
                const logs = await this.prisma.webhookLog.findMany({
                    orderBy: { receivedAt: 'desc' },
                    take: limit,
                });
                if (logs.length > 0)
                    return logs;
            }
            catch (e) {
            }
        }
        return this.memWebhookLogs.slice(0, limit);
    }
};
WebhooksService = WebhooksService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        OrdersService])
], WebhooksService);
export { WebhooksService };
//# sourceMappingURL=webhooks.service.js.map