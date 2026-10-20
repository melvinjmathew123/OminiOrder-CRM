import { PrismaService } from '../prisma/prisma.service.js';
import { ShopifyService } from '../shopify/shopify.service.js';
import { GetOrdersFilterDto } from './dto/get-orders-filter.dto.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { ShopifyOrderPayload } from '../shopify/shopify.interface.js';
export declare class OrdersService {
    private readonly prisma;
    private readonly shopifyService;
    private readonly logger;
    private memOrders;
    private memSyncLogs;
    constructor(prisma: PrismaService, shopifyService: ShopifyService);
    private initDefaultMockData;
    getOrders(filter: GetOrdersFilterDto): Promise<{
        data: any[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }>;
    getOrderById(id: string): Promise<any>;
    getOrderStats(): Promise<{
        totalOrders: number;
        paidOrders: number;
        pendingOrders: number;
        fulfilledOrders: number;
        totalRevenue: number;
        averageOrderValue: number;
    }>;
    syncOrdersFromShopify(trigger?: string): Promise<{
        success: boolean;
        ordersFetched: number;
        ordersCreated: number;
        ordersUpdated: number;
    }>;
    createOrder(dto: CreateOrderDto): Promise<{
        message: string;
        order: ({
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
        } | null;
    }>;
    upsertShopifyOrderPayload(payload: ShopifyOrderPayload, source?: string): Promise<{
        order: ({
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
        }) | null;
        isNew: boolean;
    } | {
        order: {
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
        };
        isNew: boolean;
    }>;
}
