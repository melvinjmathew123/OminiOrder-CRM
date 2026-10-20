import { PrismaService } from '../prisma/prisma.service.js';
import { OrdersService } from '../orders/orders.service.js';
import { ShopifyOrderPayload } from '../shopify/shopify.interface.js';
export declare class WebhooksService {
    private readonly prisma;
    private readonly ordersService;
    private readonly logger;
    private memWebhookLogs;
    constructor(prisma: PrismaService, ordersService: OrdersService);
    processOrderWebhook(topic: string, webhookId: string | undefined, payload: ShopifyOrderPayload): Promise<{
        success: boolean;
        status: string;
        message: string;
        orderId: string;
        action?: undefined;
        orderNumber?: undefined;
    } | {
        success: boolean;
        status: string;
        action: string;
        orderNumber: string | undefined;
        orderId: any;
        message?: undefined;
    }>;
    private recordWebhookLog;
    getWebhookLogs(limit?: number): Promise<any[]>;
}
