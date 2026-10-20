export declare class OrderItemDto {
    title: string;
    variantTitle?: string;
    sku?: string;
    quantity: number;
    price: number;
}
export declare class OrderShippingAddressDto {
    name?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    zip?: string;
    country?: string;
    phone?: string;
}
export declare class CreateOrderDto {
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    financialStatus?: string;
    fulfillmentStatus?: string;
    currency?: string;
    notes?: string;
    lineItems: OrderItemDto[];
    shippingAddress?: OrderShippingAddressDto;
}
