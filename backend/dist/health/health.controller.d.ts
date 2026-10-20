import { PrismaService } from '../prisma/prisma.service.js';
import { ShopifyService } from '../shopify/shopify.service.js';
export declare class HealthController {
    private readonly prisma;
    private readonly shopifyService;
    constructor(prisma: PrismaService, shopifyService: ShopifyService);
    check(): Promise<{
        status: string;
        timestamp: string;
        uptime: string;
        database: {
            connected: boolean;
            type: string;
        };
        shopify: {
            isConfigured: boolean;
            shopDomain: string;
            apiVersion: string;
        };
        system: {
            nodeVersion: string;
            platform: NodeJS.Platform;
            memoryUsageMb: {
                rss: number;
                heapUsed: number;
                heapTotal: number;
            };
        };
    }>;
}
