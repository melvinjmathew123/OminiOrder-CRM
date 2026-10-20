var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SimulatorService_1;
import { Injectable, Logger } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service.js';
import { WebhooksService } from '../webhooks/webhooks.service.js';
import { ShopifyService } from '../shopify/shopify.service.js';
let SimulatorService = SimulatorService_1 = class SimulatorService {
    ordersService;
    webhooksService;
    shopifyService;
    logger = new Logger(SimulatorService_1.name);
    constructor(ordersService, webhooksService, shopifyService) {
        this.ordersService = ordersService;
        this.webhooksService = webhooksService;
        this.shopifyService = shopifyService;
    }
    async seedSampleOrders(count = 8) {
        this.logger.log(`Seeding ${count} sample Shopify orders...`);
        const customers = [
            { name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '+1 415-555-0132', city: 'San Francisco', province: 'CA' },
            { name: 'Marcus Chen', email: 'marcus.chen@example.com', phone: '+1 212-555-0198', city: 'New York', province: 'NY' },
            { name: 'Elena Rostova', email: 'elena.rostova@example.com', phone: '+1 312-555-0144', city: 'Chicago', province: 'IL' },
            { name: 'David Kim', email: 'david.kim@example.com', phone: '+1 206-555-0176', city: 'Seattle', province: 'WA' },
            { name: 'Amara Okafor', email: 'amara.okafor@example.com', phone: '+1 404-555-0112', city: 'Atlanta', province: 'GA' },
            { name: 'Liam O\'Connor', email: 'liam.oc@example.com', phone: '+1 617-555-0185', city: 'Boston', province: 'MA' },
            { name: 'Sofia Rodriguez', email: 'sofia.r@example.com', phone: '+1 305-555-0191', city: 'Miami', province: 'FL' },
            { name: 'Alexander Wright', email: 'a.wright@example.com', phone: '+1 512-555-0163', city: 'Austin', province: 'TX' },
        ];
        const catalogItems = [
            { title: 'Ergonomic Mechanical Keyboard', sku: 'KB-MECH-01', price: 149.99, variant: 'Wireless / RGB' },
            { title: 'Ultra-Wide 34" Curved Monitor', sku: 'MON-34-UW', price: 499.5, variant: '144Hz IPS' },
            { title: 'Noise-Canceling Wireless Headphones', sku: 'AUDIO-NC-PRO', price: 279.0, variant: 'Midnight Black' },
            { title: 'Anodized Aluminum Laptop Stand', sku: 'ACC-STND-AL', price: 59.95, variant: 'Space Gray' },
            { title: 'Precision USB-C Docking Station', sku: 'HUB-USBC-10', price: 119.0, variant: '10-in-1 Dual 4K' },
            { title: 'Full-Grain Leather Desk Mat', sku: 'ACC-MAT-BRN', price: 45.0, variant: 'Cognac Brown' },
            { title: 'Smart LED Lightbar for Monitor', sku: 'LGT-BAR-01', price: 68.5, variant: 'Auto-Dimming' },
        ];
        const statuses = [
            { financial: 'paid', fulfillment: 'fulfilled' },
            { financial: 'paid', fulfillment: 'unfulfilled' },
            { financial: 'pending', fulfillment: 'unfulfilled' },
            { financial: 'paid', fulfillment: 'partial' },
            { financial: 'refunded', fulfillment: 'restocked' },
        ];
        const seededOrders = [];
        for (let i = 0; i < Math.min(count, customers.length); i++) {
            const cust = customers[i];
            const status = statuses[i % statuses.length];
            const orderNumber = 1000 + i + 1;
            const shopifyId = 7800000000 + i;
            const numItems = (i % 3) + 1;
            const orderItems = [];
            let subtotal = 0;
            for (let j = 0; j < numItems; j++) {
                const item = catalogItems[(i + j) % catalogItems.length];
                const qty = (j % 2) + 1;
                subtotal += item.price * qty;
                orderItems.push({
                    id: 8900000000 + i * 10 + j,
                    title: item.title,
                    variant_title: item.variant,
                    sku: item.sku,
                    quantity: qty,
                    price: item.price,
                    total_discount: 0,
                    vendor: 'TechGear Pro',
                });
            }
            const tax = +(subtotal * 0.08).toFixed(2);
            const total = +(subtotal + tax).toFixed(2);
            const daysAgo = (count - i) * 1.5;
            const orderDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
            const nameParts = cust.name.split(' ');
            const payload = {
                id: shopifyId,
                order_number: orderNumber,
                name: `#${orderNumber}`,
                email: cust.email,
                phone: cust.phone,
                financial_status: status.financial,
                fulfillment_status: status.fulfillment,
                currency: 'USD',
                total_price: total,
                subtotal_price: subtotal,
                total_tax: tax,
                total_discounts: 0,
                created_at: orderDate.toISOString(),
                updated_at: orderDate.toISOString(),
                note: i % 2 === 0 ? 'Please deliver during business hours' : undefined,
                customer: {
                    first_name: nameParts[0],
                    last_name: nameParts.slice(1).join(' '),
                    email: cust.email,
                    phone: cust.phone,
                },
                shipping_address: {
                    name: cust.name,
                    address1: `${100 + i * 12} Market Street`,
                    city: cust.city,
                    province: cust.province,
                    zip: `9410${i}`,
                    country: 'United States',
                    phone: cust.phone,
                },
                line_items: orderItems,
            };
            const result = await this.ordersService.upsertShopifyOrderPayload(payload, 'SIMULATOR_SEED');
            seededOrders.push(result.order);
        }
        return {
            message: `Successfully seeded ${seededOrders.length} sample orders`,
            count: seededOrders.length,
            orders: seededOrders,
        };
    }
    async simulateWebhook(event) {
        const webhookId = event.customWebhookId ||
            (event.forceDuplicate
                ? 'wh-duplicate-test-id-12345'
                : `wh-sim-${Date.now()}-${Math.random().toString(36).substring(7)}`);
        let payload;
        if (event.topic === 'orders/updated' && event.orderId) {
            const existing = await this.ordersService.getOrderById(event.orderId);
            payload = {
                id: existing.shopifyOrderId,
                order_number: Number(existing.orderNumber.replace('#', '')),
                name: existing.orderNumber,
                email: existing.customerEmail || 'customer@example.com',
                phone: existing.customerPhone || '+1 555-0100',
                financial_status: event.financialStatus || (existing.financialStatus === 'pending' ? 'paid' : 'refunded'),
                fulfillment_status: event.fulfillmentStatus || (existing.fulfillmentStatus === 'unfulfilled' ? 'fulfilled' : 'partial'),
                currency: existing.currency,
                total_price: existing.totalPrice,
                subtotal_price: existing.subtotalPrice,
                total_tax: existing.totalTax,
                total_discounts: existing.totalDiscounts,
                created_at: existing.orderDate.toISOString(),
                updated_at: new Date().toISOString(),
                customer: {
                    first_name: existing.customerName.split(' ')[0] || 'Customer',
                    last_name: existing.customerName.split(' ').slice(1).join(' ') || '',
                    email: existing.customerEmail || undefined,
                },
                shipping_address: existing.shippingAddress
                    ? {
                        name: existing.shippingAddress.name || existing.customerName,
                        address1: existing.shippingAddress.address1 || '123 Market St',
                        city: existing.shippingAddress.city || 'San Francisco',
                        province: existing.shippingAddress.province || 'CA',
                        zip: existing.shippingAddress.zip || '94105',
                        country: existing.shippingAddress.country || 'United States',
                    }
                    : undefined,
                line_items: (existing.items || []).map((i) => ({
                    id: i.shopifyLineItemId || 1,
                    title: i.title,
                    variant_title: i.variantTitle || undefined,
                    sku: i.sku || undefined,
                    quantity: i.quantity,
                    price: i.price,
                    total_discount: i.totalDiscount,
                })),
            };
        }
        else {
            const randomOrderNum = Math.floor(2000 + Math.random() * 8000);
            const randomShopifyId = Math.floor(8000000000 + Math.random() * 1000000000);
            payload = {
                id: randomShopifyId,
                order_number: randomOrderNum,
                name: `#${randomOrderNum}`,
                email: `client.${randomOrderNum}@domain.com`,
                phone: '+1 415-555-8822',
                financial_status: event.financialStatus || 'paid',
                fulfillment_status: event.fulfillmentStatus || 'unfulfilled',
                currency: 'USD',
                total_price: 329.98,
                subtotal_price: 299.98,
                total_tax: 30.0,
                total_discounts: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                note: 'Order simulated via Mini CRM Webhook Simulator',
                customer: {
                    first_name: 'Jordan',
                    last_name: 'Taylor',
                    email: `client.${randomOrderNum}@domain.com`,
                },
                shipping_address: {
                    name: 'Jordan Taylor',
                    address1: '742 Evergreen Terrace',
                    city: 'Springfield',
                    province: 'OR',
                    zip: '97477',
                    country: 'United States',
                },
                line_items: [
                    {
                        id: 99001,
                        title: 'Wireless Ergonomic Vertical Mouse',
                        variant_title: 'Graphite',
                        sku: 'MSE-VERT-01',
                        quantity: 1,
                        price: 79.99,
                    },
                    {
                        id: 99002,
                        title: 'Mechanical Keypad with OLED Screen',
                        variant_title: 'White',
                        sku: 'PAD-MECH-02',
                        quantity: 1,
                        price: 249.99,
                    },
                ],
            };
        }
        const result = await this.webhooksService.processOrderWebhook(event.topic, webhookId, payload);
        return {
            simulation: {
                topic: event.topic,
                webhookId,
                isDuplicateTest: !!event.forceDuplicate,
            },
            result,
        };
    }
    async getSystemStatus() {
        const storeInfo = this.shopifyService.getStoreInfo();
        const webhookCount = await this.webhooksService.getWebhookLogs(1);
        return {
            store: storeInfo,
            database: 'PostgreSQL (Prisma ORM)',
            webhooksActive: true,
            lastWebhookReceived: webhookCount[0]?.receivedAt || null,
        };
    }
};
SimulatorService = SimulatorService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [OrdersService,
        WebhooksService,
        ShopifyService])
], SimulatorService);
export { SimulatorService };
//# sourceMappingURL=simulator.service.js.map