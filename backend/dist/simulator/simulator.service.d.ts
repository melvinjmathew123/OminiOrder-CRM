import { OrdersService } from '../orders/orders.service.js';
import { WebhooksService } from '../webhooks/webhooks.service.js';
import { ShopifyService } from '../shopify/shopify.service.js';
export declare class SimulatorService {
    private readonly ordersService;
    private readonly webhooksService;
    private readonly shopifyService;
    private readonly logger;
    constructor(ordersService: OrdersService, webhooksService: WebhooksService, shopifyService: ShopifyService);
    seedSampleOrders(count?: number): Promise<{
        message: string;
        count: number;
        orders: (({
            shippingAddress: {
                id: string;
                name: string | null;
                phone: string | null;
                address1: string | null;
                city: string | null;
                province: string | null;
                zip: string | null;
                country: string | null;
                address2: string | null;
                orderId: string;
            } | null;
            items: {
                id: string;
                createdAt: Date;
                title: string;
                variantTitle: string | null;
                sku: string | null;
                quantity: number;
                price: number;
                orderId: string;
                shopifyLineItemId: string | null;
                totalDiscount: number;
                vendor: string | null;
            }[];
        } & {
            id: string;
            currency: string;
            tags: string | null;
            financialStatus: string;
            fulfillmentStatus: string;
            orderDate: Date;
            totalPrice: number;
            orderNumber: string;
            createdAt: Date;
            customerName: string;
            customerEmail: string | null;
            customerPhone: string | null;
            notes: string | null;
            shopifyOrderId: string;
            subtotalPrice: number;
            totalTax: number;
            totalDiscounts: number;
            shopifyUpdatedAt: Date | null;
            source: string;
            rawPayload: string | null;
            updatedAt: Date;
        }) | {
            id: any;
            shopifyOrderId: string;
            orderNumber: string;
            customerName: string;
            customerEmail: string | null;
            customerPhone: string | null;
            financialStatus: string;
            fulfillmentStatus: string;
            currency: string;
            totalPrice: number;
            subtotalPrice: number;
            totalTax: number;
            totalDiscounts: number;
            orderDate: Date;
            shopifyUpdatedAt: Date;
            notes: string | null;
            tags: string | null;
            source: string;
            rawPayload: string;
            createdAt: any;
            updatedAt: Date;
            items: {
                id: string;
                orderId: any;
                shopifyLineItemId: string | null;
                title: string;
                variantTitle: string | null;
                sku: string | null;
                quantity: number;
                price: number;
                totalDiscount: number;
                vendor: string | null;
            }[];
            shippingAddress: {
                id: string;
                orderId: any;
                name: string;
                address1: string | null;
                address2: string | null;
                city: string | null;
                province: string | null;
                zip: string | null;
                country: string | null;
                phone: string | null;
            } | null;
        } | null)[];
    }>;
    simulateWebhook(event: {
        topic: 'orders/create' | 'orders/updated';
        orderId?: string;
        financialStatus?: string;
        fulfillmentStatus?: string;
        forceDuplicate?: boolean;
        customWebhookId?: string;
    }): Promise<{
        simulation: {
            topic: "orders/updated" | "orders/create";
            webhookId: string;
            isDuplicateTest: boolean;
        };
        result: {
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
        };
    }>;
    getSystemStatus(): Promise<{
        store: {
            isConfigured: boolean;
            shopDomain: string;
            apiVersion: string;
        };
        database: string;
        webhooksActive: boolean;
        lastWebhookReceived: any;
    }>;
}
