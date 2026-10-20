import { ConfigService } from '@nestjs/config';
import { ShopifyOrderPayload, CreateShopifyOrderInput } from './shopify.interface.js';
export declare class ShopifyService {
    private readonly configService;
    private readonly logger;
    private client;
    private readonly shopDomain;
    private readonly accessToken;
    private readonly apiVersion;
    constructor(configService: ConfigService);
    private initClient;
    isConfigured(): boolean;
    getStoreInfo(): {
        isConfigured: boolean;
        shopDomain: string;
        apiVersion: string;
    };
    fetchOrdersFromShopify(limit?: number): Promise<ShopifyOrderPayload[]>;
    fetchOrderById(shopifyOrderId: string): Promise<ShopifyOrderPayload | null>;
    createOrderInShopify(input: CreateShopifyOrderInput): Promise<ShopifyOrderPayload>;
}
