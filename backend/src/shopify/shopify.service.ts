import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { ShopifyOrderPayload, CreateShopifyOrderInput } from './shopify.interface.js';

@Injectable()
export class ShopifyService {
  private readonly logger = new Logger(ShopifyService.name);
  private client: AxiosInstance | null = null;
  private readonly shopDomain: string;
  private readonly accessToken: string;
  private readonly apiVersion: string;

  constructor(private readonly configService: ConfigService) {
    this.shopDomain = this.configService.get<string>('SHOPIFY_SHOP_DOMAIN', '');
    this.accessToken = this.configService.get<string>('SHOPIFY_ADMIN_ACCESS_TOKEN', '');
    this.apiVersion = this.configService.get<string>('SHOPIFY_API_VERSION', '2024-01');

    this.initClient();
  }

  private initClient() {
    if (!this.shopDomain || !this.accessToken) {
      this.logger.warn(
        'Shopify credentials (SHOPIFY_SHOP_DOMAIN, SHOPIFY_ADMIN_ACCESS_TOKEN) are not set. API calls will operate in demo/simulation mode.',
      );
      this.client = null;
      return;
    }

    // Sanitize shop domain
    let cleanDomain = this.shopDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!cleanDomain.includes('.myshopify.com')) {
      cleanDomain = `${cleanDomain}.myshopify.com`;
    }

    const baseURL = `https://${cleanDomain}/admin/api/${this.apiVersion}`;

    this.client = axios.create({
      baseURL,
      headers: {
        'X-Shopify-Access-Token': this.accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 15000,
    });

    // Add interceptor for rate-limit handling (429 Too Many Requests)
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          const waitMs = retryAfter ? parseFloat(retryAfter) * 1000 : 2000;
          this.logger.warn(`Shopify rate limit hit. Retrying after ${waitMs}ms...`);
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          return this.client!.request(error.config!);
        }
        return Promise.reject(error);
      },
    );

    this.logger.log(`Shopify API client initialized for store: ${cleanDomain} (API: ${this.apiVersion})`);
  }

  isConfigured(): boolean {
    return !!this.client;
  }

  getStoreInfo() {
    return {
      isConfigured: this.isConfigured(),
      shopDomain: this.shopDomain || 'Not Configured (Demo Mode Active)',
      apiVersion: this.apiVersion,
    };
  }

  /**
   * Fetch all orders from Shopify Admin API
   */
  async fetchOrdersFromShopify(limit = 50): Promise<ShopifyOrderPayload[]> {
    if (!this.client) {
      this.logger.warn('Shopify client not configured. Returning empty list.');
      return [];
    }

    try {
      this.logger.log(`Fetching orders from Shopify Admin API... (limit: ${limit})`);
      const response = await this.client.get('/orders.json', {
        params: {
          status: 'any',
          limit,
        },
      });

      const orders: ShopifyOrderPayload[] = response.data.orders || [];
      this.logger.log(`Successfully fetched ${orders.length} orders from Shopify`);
      return orders;
    } catch (error: any) {
      const errorMsg = error.response?.data?.errors || error.message;
      this.logger.error(`Failed to fetch orders from Shopify: ${JSON.stringify(errorMsg)}`);
      throw new HttpException(
        `Shopify API error: ${typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /**
   * Fetch single order from Shopify by ID
   */
  async fetchOrderById(shopifyOrderId: string): Promise<ShopifyOrderPayload | null> {
    if (!this.client) return null;

    try {
      const response = await this.client.get(`/orders/${shopifyOrderId}.json`);
      return response.data.order;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      this.logger.error(`Failed to fetch order ${shopifyOrderId} from Shopify: ${error.message}`);
      throw new HttpException('Shopify API order fetch failed', HttpStatus.BAD_GATEWAY);
    }
  }

  /**
   * Create an order in Shopify (Optional Feature)
   */
  async createOrderInShopify(input: CreateShopifyOrderInput): Promise<ShopifyOrderPayload> {
    if (!this.client) {
      this.logger.log('Shopify not configured. Generating simulated Shopify order response.');
      const simulatedShopifyId = Math.floor(1000000000 + Math.random() * 9000000000);
      const simulatedOrderNumber = Math.floor(1000 + Math.random() * 9000);
      const nameParts = (input.customerName || 'Customer').split(' ');
      const firstName = nameParts[0] || 'Customer';
      const lastName = nameParts.slice(1).join(' ') || '';

      const subtotal = input.lineItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const tax = +(subtotal * 0.08).toFixed(2);
      const total = +(subtotal + tax).toFixed(2);

      return {
        id: simulatedShopifyId,
        order_number: simulatedOrderNumber,
        name: `#${simulatedOrderNumber}`,
        email: input.email || `${firstName.toLowerCase()}@example.com`,
        phone: input.phone || '+1 555-0199',
        financial_status: input.financialStatus || 'pending',
        fulfillment_status: input.fulfillmentStatus || 'unfulfilled',
        currency: input.currency || 'USD',
        total_price: total,
        subtotal_price: subtotal,
        total_tax: tax,
        total_discounts: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        note: input.notes,
        customer: {
          first_name: firstName,
          last_name: lastName,
          email: input.email,
          phone: input.phone,
        },
        shipping_address: input.shippingAddress || {
          name: input.customerName,
          address1: '123 Innovation Way',
          city: 'San Francisco',
          province: 'California',
          zip: '94107',
          country: 'United States',
        },
        line_items: input.lineItems.map((item, index) => ({
          id: Math.floor(2000000000 + Math.random() * 8000000000),
          title: item.title,
          variant_title: item.variantTitle || 'Default Variant',
          sku: item.sku || `SKU-${1000 + index}`,
          quantity: item.quantity,
          price: item.price,
          total_discount: 0,
        })),
      };
    }

    try {
      this.logger.log(`Creating order in Shopify Admin API for ${input.customerName}...`);
      const nameParts = (input.customerName || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const payload = {
        order: {
          email: input.email,
          phone: input.phone,
          note: input.notes,
          financial_status: input.financialStatus || 'pending',
          currency: input.currency || 'USD',
          customer: {
            first_name: firstName,
            last_name: lastName,
            email: input.email,
            phone: input.phone,
          },
          shipping_address: input.shippingAddress,
          billing_address: input.shippingAddress,
          line_items: input.lineItems.map((item) => ({
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            sku: item.sku,
          })),
        },
      };

      const response = await this.client.post('/orders.json', payload);
      this.logger.log(`Successfully created order in Shopify: #${response.data.order?.order_number}`);
      return response.data.order;
    } catch (error: any) {
      const errorMsg = error.response?.data?.errors || error.message;
      this.logger.error(`Failed to create order in Shopify: ${JSON.stringify(errorMsg)}`);
      throw new HttpException(
        `Failed to create order in Shopify: ${typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
