export interface LineItem {
  id: string;
  orderId: string;
  shopifyLineItemId?: string | null;
  title: string;
  variantTitle?: string | null;
  sku?: string | null;
  quantity: number;
  price: number;
  totalDiscount: number;
  vendor?: string | null;
}

export interface ShippingAddress {
  id: string;
  orderId: string;
  name?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  province?: string | null;
  zip?: string | null;
  country?: string | null;
  phone?: string | null;
}

export interface Order {
  id: string;
  shopifyOrderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  financialStatus: 'paid' | 'pending' | 'refunded' | 'authorized' | 'voided' | string;
  fulfillmentStatus: 'fulfilled' | 'unfulfilled' | 'partial' | 'restocked' | string;
  currency: string;
  totalPrice: number;
  subtotalPrice: number;
  totalTax: number;
  totalDiscounts: number;
  orderDate: string;
  shopifyUpdatedAt?: string | null;
  notes?: string | null;
  tags?: string | null;
  source: string;
  rawPayload?: string | null;
  createdAt: string;
  updatedAt: string;
  items: LineItem[];
  shippingAddress?: ShippingAddress | null;
}

export interface OrdersPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface OrdersResponse {
  data: Order[];
  pagination: OrdersPagination;
}

export interface OrderStats {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  fulfilledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface WebhookLog {
  id: string;
  webhookId?: string | null;
  topic: string;
  shopifyOrderId?: string | null;
  status: 'PROCESSED' | 'DUPLICATE' | 'FAILED' | string;
  details?: string | null;
  receivedAt: string;
}

export interface SystemStatus {
  store: {
    isConfigured: boolean;
    shopDomain: string;
    apiVersion: string;
  };
  database: string;
  webhooksActive: boolean;
  lastWebhookReceived?: string | null;
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  financialStatus?: string;
  fulfillmentStatus?: string;
  currency?: string;
  notes?: string;
  lineItems: {
    title: string;
    variantTitle?: string;
    sku?: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress?: {
    name?: string;
    address1?: string;
    city?: string;
    province?: string;
    zip?: string;
    country?: string;
    phone?: string;
  };
}
