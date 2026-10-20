import { WebhooksService } from './webhooks.service.js';
export declare class WebhooksController {
    private readonly webhooksService;
    constructor(webhooksService: WebhooksService);
    handleShopifyWebhook(topic: string, webhookId: string, payload: Record<string, any>): Promise<{
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
    getWebhookLogs(limit?: number): Promise<any[]>;
}
