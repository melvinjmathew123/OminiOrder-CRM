export interface ShopifyAddress {
  first_name?: string;
  last_name?: string;
  name?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  zip?: string;
  country?: string;
  phone?: string;
}

export interface ShopifyLineItem {
  id?: number | string;
  title: string;
  variant_title?: string;
  sku?: string;
  quantity: number;
  price: string | number;
  total_discount?: string | number;
  vendor?: string;
}

export interface ShopifyCustomer {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export interface ShopifyOrderPayload {
  id: number | string;
  name?: string;
  order_number?: number | string;
  email?: string;
  phone?: string;
  financial_status?: string;
  fulfillment_status?: string;
  currency?: string;
  total_price?: string | number;
  subtotal_price?: string | number;
  total_tax?: string | number;
  total_discounts?: string | number;
  created_at?: string;
  updated_at?: string;
  note?: string;
  tags?: string;
  customer?: ShopifyCustomer;
  shipping_address?: ShopifyAddress;
  billing_address?: ShopifyAddress;
  line_items: ShopifyLineItem[];
}

export interface CreateShopifyOrderInput {
  email?: string;
  phone?: string;
  customerName: string;
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
  shippingAddress?: ShopifyAddress;
}
