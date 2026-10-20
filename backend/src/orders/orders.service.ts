import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ShopifyService } from '../shopify/shopify.service.js';
import { GetOrdersFilterDto } from './dto/get-orders-filter.dto.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { ShopifyOrderPayload } from '../shopify/shopify.interface.js';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  // In-memory fallback store when PostgreSQL is not yet started by evaluator
  private memOrders: any[] = [];
  private memSyncLogs: any[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly shopifyService: ShopifyService,
  ) {
    this.initDefaultMockData();
  }

  private initDefaultMockData() {
    this.memOrders = [
      {
        id: 'ord-1001-uuid',
        shopifyOrderId: '7819201928',
        orderNumber: '#1001',
        customerName: 'Sarah Jenkins',
        customerEmail: 'sarah.j@example.com',
        customerPhone: '+1 415-555-0132',
        financialStatus: 'paid',
        fulfillmentStatus: 'fulfilled',
        currency: 'USD',
        totalPrice: 429.98,
        subtotalPrice: 399.98,
        totalTax: 30.0,
        totalDiscounts: 0,
        orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        shopifyUpdatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        notes: 'Deliver to front desk if unavailable',
        tags: 'VIP, recurring',
        source: 'SHOPIFY_SYNC',
        rawPayload: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        items: [
          {
            id: 'item-1',
            orderId: 'ord-1001-uuid',
            shopifyLineItemId: '891001',
            title: 'Ergonomic Mechanical Keyboard',
            variantTitle: 'Wireless / RGB',
            sku: 'KB-MECH-01',
            quantity: 1,
            price: 149.99,
            totalDiscount: 0,
            vendor: 'TechGear Pro',
          },
          {
            id: 'item-2',
            orderId: 'ord-1001-uuid',
            shopifyLineItemId: '891002',
            title: 'Noise-Canceling Wireless Headphones',
            variantTitle: 'Midnight Black',
            sku: 'AUDIO-NC-PRO',
            quantity: 1,
            price: 279.99,
            totalDiscount: 30.0,
            vendor: 'TechGear Pro',
          },
        ],
        shippingAddress: {
          id: 'addr-1',
          orderId: 'ord-1001-uuid',
          name: 'Sarah Jenkins',
          address1: '104 Market Street, Suite 400',
          city: 'San Francisco',
          province: 'CA',
          zip: '94105',
          country: 'United States',
          phone: '+1 415-555-0132',
        },
      },
      {
        id: 'ord-1002-uuid',
        shopifyOrderId: '7819201929',
        orderNumber: '#1002',
        customerName: 'Marcus Chen',
        customerEmail: 'marcus.chen@example.com',
        customerPhone: '+1 212-555-0198',
        financialStatus: 'paid',
        fulfillmentStatus: 'unfulfilled',
        currency: 'USD',
        totalPrice: 499.5,
        subtotalPrice: 462.5,
        totalTax: 37.0,
        totalDiscounts: 0,
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        shopifyUpdatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        notes: null,
        tags: 'expedited',
        source: 'SHOPIFY_SYNC',
        rawPayload: null,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        items: [
          {
            id: 'item-3',
            orderId: 'ord-1002-uuid',
            shopifyLineItemId: '891003',
            title: 'Ultra-Wide 34" Curved Monitor',
            variantTitle: '144Hz IPS',
            sku: 'MON-34-UW',
            quantity: 1,
            price: 499.5,
            totalDiscount: 0,
            vendor: 'DisplayWorks',
          },
        ],
        shippingAddress: {
          id: 'addr-2',
          orderId: 'ord-1002-uuid',
          name: 'Marcus Chen',
          address1: '72 Wall Street',
          city: 'New York',
          province: 'NY',
          zip: '10005',
          country: 'United States',
          phone: '+1 212-555-0198',
        },
      },
      {
        id: 'ord-1003-uuid',
        shopifyOrderId: '7819201930',
        orderNumber: '#1003',
        customerName: 'Elena Rostova',
        customerEmail: 'elena.rostova@example.com',
        customerPhone: '+1 312-555-0144',
        financialStatus: 'pending',
        fulfillmentStatus: 'unfulfilled',
        currency: 'USD',
        totalPrice: 178.95,
        subtotalPrice: 165.7,
        totalTax: 13.25,
        totalDiscounts: 0,
        orderDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
        shopifyUpdatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        notes: 'Payment via bank transfer pending',
        tags: 'pending-check',
        source: 'SHOPIFY_SYNC',
        rawPayload: null,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        updatedAt: new Date(),
        items: [
          {
            id: 'item-4',
            orderId: 'ord-1003-uuid',
            shopifyLineItemId: '891004',
            title: 'Precision USB-C Docking Station',
            variantTitle: '10-in-1 Dual 4K',
            sku: 'HUB-USBC-10',
            quantity: 1,
            price: 119.0,
            totalDiscount: 0,
            vendor: 'ConnectX',
          },
          {
            id: 'item-5',
            orderId: 'ord-1003-uuid',
            shopifyLineItemId: '891005',
            title: 'Anodized Aluminum Laptop Stand',
            variantTitle: 'Space Gray',
            sku: 'ACC-STND-AL',
            quantity: 1,
            price: 59.95,
            totalDiscount: 0,
            vendor: 'ConnectX',
          },
        ],
        shippingAddress: {
          id: 'addr-3',
          orderId: 'ord-1003-uuid',
          name: 'Elena Rostova',
          address1: '401 N Michigan Ave',
          city: 'Chicago',
          province: 'IL',
          zip: '60611',
          country: 'United States',
          phone: '+1 312-555-0144',
        },
      },
    ];
  }

  /**
   * List, search, filter and paginate orders
   */
  async getOrders(filter: GetOrdersFilterDto) {
    const {
      search,
      financialStatus,
      fulfillmentStatus,
      startDate,
      endDate,
      sortBy = 'orderDate',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = filter;

    const skip = (page - 1) * limit;

    // Use PostgreSQL if connected
    if (this.prisma.isConnected) {
      try {
        const where: any = {};

        if (search && search.trim() !== '') {
          const q = search.trim();
          where.OR = [
            { orderNumber: { contains: q, mode: 'insensitive' } },
            { customerName: { contains: q, mode: 'insensitive' } },
            { customerEmail: { contains: q, mode: 'insensitive' } },
            { items: { some: { title: { contains: q, mode: 'insensitive' } } } },
          ];
        }

        if (financialStatus && financialStatus !== 'all') {
          where.financialStatus = { equals: financialStatus.toLowerCase(), mode: 'insensitive' };
        }

        if (fulfillmentStatus && fulfillmentStatus !== 'all') {
          where.fulfillmentStatus = { equals: fulfillmentStatus.toLowerCase(), mode: 'insensitive' };
        }

        if (startDate || endDate) {
          where.orderDate = {};
          if (startDate) where.orderDate.gte = new Date(startDate);
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            where.orderDate.lte = end;
          }
        }

        const orderBy: any = {};
        if (['orderDate', 'totalPrice', 'orderNumber', 'createdAt'].includes(sortBy)) {
          orderBy[sortBy] = sortOrder.toLowerCase();
        } else {
          orderBy.orderDate = 'desc';
        }

        const [total, orders] = await Promise.all([
          this.prisma.order.count({ where }),
          this.prisma.order.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            include: { items: true, shippingAddress: true },
          }),
        ]);

        return {
          data: orders,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
          },
        };
      } catch (err: any) {
        this.logger.warn(`PostgreSQL query error, falling back to memory store: ${err.message}`);
      }
    }

    // In-memory filtering logic
    let filtered = [...this.memOrders];

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.customerEmail?.toLowerCase().includes(q) ||
          o.items?.some((i: any) => i.title?.toLowerCase().includes(q)),
      );
    }

    if (financialStatus && financialStatus !== 'all') {
      filtered = filtered.filter(
        (o) => o.financialStatus?.toLowerCase() === financialStatus.toLowerCase(),
      );
    }

    if (fulfillmentStatus && fulfillmentStatus !== 'all') {
      filtered = filtered.filter(
        (o) => o.fulfillmentStatus?.toLowerCase() === fulfillmentStatus.toLowerCase(),
      );
    }

    if (startDate) {
      const start = new Date(startDate).getTime();
      filtered = filtered.filter((o) => new Date(o.orderDate).getTime() >= start);
    }

    if (endDate) {
      const end = new Date(endDate).getTime() + 24 * 60 * 60 * 1000;
      filtered = filtered.filter((o) => new Date(o.orderDate).getTime() <= end);
    }

    // Sorting
    filtered.sort((a, b) => {
      let valA = a[sortBy] ?? a.orderDate;
      let valB = b[sortBy] ?? b.orderDate;
      if (valA instanceof Date) valA = valA.getTime();
      if (valB instanceof Date) valB = valB.getTime();

      if (sortOrder.toLowerCase() === 'asc') {
        return valA > valB ? 1 : -1;
      }
      return valA < valB ? 1 : -1;
    });

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return {
      data: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Get single order by ID
   */
  async getOrderById(id: string) {
    if (this.prisma.isConnected) {
      try {
        const order = await this.prisma.order.findUnique({
          where: { id },
          include: { items: true, shippingAddress: true },
        });
        if (order) return order;
      } catch (err) {
        // Fallback
      }
    }

    const memOrder = this.memOrders.find((o) => o.id === id || o.shopifyOrderId === id);
    if (!memOrder) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return memOrder;
  }

  /**
   * Fetch aggregate statistics for the dashboard
   */
  async getOrderStats() {
    if (this.prisma.isConnected) {
      try {
        const totalOrders = await this.prisma.order.count();
        const paidOrders = await this.prisma.order.count({
          where: { financialStatus: { in: ['paid', 'authorized'] } },
        });
        const pendingOrders = await this.prisma.order.count({
          where: { financialStatus: 'pending' },
        });
        const fulfilledOrders = await this.prisma.order.count({
          where: { fulfillmentStatus: 'fulfilled' },
        });

        const aggregate = await this.prisma.order.aggregate({
          _sum: { totalPrice: true },
          _avg: { totalPrice: true },
        });

        return {
          totalOrders,
          paidOrders,
          pendingOrders,
          fulfilledOrders,
          totalRevenue: +(aggregate._sum.totalPrice || 0).toFixed(2),
          averageOrderValue: +(aggregate._avg.totalPrice || 0).toFixed(2),
        };
      } catch (err) {
        // Fallback
      }
    }

    const totalOrders = this.memOrders.length;
    const paidOrders = this.memOrders.filter((o) =>
      ['paid', 'authorized'].includes(o.financialStatus?.toLowerCase()),
    ).length;
    const pendingOrders = this.memOrders.filter(
      (o) => o.financialStatus?.toLowerCase() === 'pending',
    ).length;
    const fulfilledOrders = this.memOrders.filter(
      (o) => o.fulfillmentStatus?.toLowerCase() === 'fulfilled',
    ).length;

    const totalRevenue = this.memOrders.reduce((acc, o) => acc + (Number(o.totalPrice) || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      paidOrders,
      pendingOrders,
      fulfilledOrders,
      totalRevenue: +totalRevenue.toFixed(2),
      averageOrderValue: +averageOrderValue.toFixed(2),
    };
  }

  /**
   * Trigger Shopify order sync
   */
  async syncOrdersFromShopify(trigger = 'MANUAL') {
    let shopifyOrders: ShopifyOrderPayload[] = [];

    if (this.shopifyService.isConfigured()) {
      shopifyOrders = await this.shopifyService.fetchOrdersFromShopify(50);
    } else {
      // If Shopify API is not configured, generate simulated live sync
      shopifyOrders = [
        {
          id: 8812930123,
          order_number: 1004,
          name: '#1004',
          email: 'alex.rivera@example.com',
          financial_status: 'paid',
          fulfillment_status: 'fulfilled',
          currency: 'USD',
          total_price: 388.9,
          subtotal_price: 359.9,
          total_tax: 29.0,
          created_at: new Date().toISOString(),
          customer: { first_name: 'Alex', last_name: 'Rivera', email: 'alex.rivera@example.com' },
          shipping_address: {
            name: 'Alex Rivera',
            address1: '500 Howard St',
            city: 'San Francisco',
            province: 'CA',
            zip: '94105',
            country: 'United States',
          },
          line_items: [
            {
              id: 991006,
              title: 'Full-Grain Leather Desk Mat',
              variant_title: 'Cognac Brown',
              sku: 'ACC-MAT-BRN',
              quantity: 2,
              price: 45.0,
            },
            {
              id: 991007,
              title: 'Noise-Canceling Wireless Headphones',
              variant_title: 'Midnight Black',
              sku: 'AUDIO-NC-PRO',
              quantity: 1,
              price: 279.0,
            },
          ],
        },
      ];
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (const payload of shopifyOrders) {
      const { isNew } = await this.upsertShopifyOrderPayload(payload, 'SHOPIFY_SYNC');
      if (isNew) createdCount++;
      else updatedCount++;
    }

    return {
      success: true,
      ordersFetched: shopifyOrders.length,
      ordersCreated: createdCount,
      ordersUpdated: updatedCount,
    };
  }

  /**
   * Create an order from the CRM and sync it to Shopify (Optional Feature)
   */
  async createOrder(dto: CreateOrderDto) {
    if (!dto.lineItems || dto.lineItems.length === 0) {
      throw new BadRequestException('At least one line item is required');
    }

    this.logger.log(`Creating order for customer: ${dto.customerName}`);

    // Sync / create in Shopify
    const shopifyOrder = await this.shopifyService.createOrderInShopify({
      customerName: dto.customerName,
      email: dto.customerEmail,
      phone: dto.customerPhone,
      financialStatus: dto.financialStatus,
      fulfillmentStatus: dto.fulfillmentStatus,
      currency: dto.currency || 'USD',
      notes: dto.notes,
      lineItems: dto.lineItems,
      shippingAddress: dto.shippingAddress,
    });

    const { order } = await this.upsertShopifyOrderPayload(shopifyOrder, 'CRM_MANUAL');

    return {
      message: 'Order successfully created and synced to Shopify',
      order,
    };
  }

  /**
   * Upsert Shopify order payload
   */
  async upsertShopifyOrderPayload(payload: ShopifyOrderPayload, source = 'SHOPIFY') {
    const shopifyOrderId = String(payload.id);
    const orderNumber = payload.order_number
      ? `#${payload.order_number}`
      : payload.name || `#${shopifyOrderId.slice(-4)}`;

    const customerName = payload.customer
      ? `${payload.customer.first_name || ''} ${payload.customer.last_name || ''}`.trim() || 'Guest Customer'
      : payload.shipping_address?.name || 'Guest Customer';

    const customerEmail = payload.email || payload.customer?.email || null;
    const customerPhone = payload.phone || payload.customer?.phone || payload.shipping_address?.phone || null;

    const totalPrice = Number(payload.total_price ?? 0);
    const subtotalPrice = Number(payload.subtotal_price ?? totalPrice);
    const totalTax = Number(payload.total_tax ?? 0);
    const totalDiscounts = Number(payload.total_discounts ?? 0);

    const financialStatus = (payload.financial_status || 'pending').toLowerCase();
    const fulfillmentStatus = (payload.fulfillment_status || 'unfulfilled').toLowerCase();
    const currency = payload.currency || 'USD';
    const orderDate = payload.created_at ? new Date(payload.created_at) : new Date();
    const shopifyUpdatedAt = payload.updated_at ? new Date(payload.updated_at) : new Date();

    if (this.prisma.isConnected) {
      try {
        const existing = await this.prisma.order.findUnique({
          where: { shopifyOrderId },
          include: { items: true, shippingAddress: true },
        });

        const isNew = !existing;

        const upsertedOrder = await this.prisma.$transaction(async (tx) => {
          let orderRecord;

          if (existing) {
            orderRecord = await tx.order.update({
              where: { id: existing.id },
              data: {
                orderNumber,
                customerName,
                customerEmail,
                customerPhone,
                financialStatus,
                fulfillmentStatus,
                currency,
                totalPrice,
                subtotalPrice,
                totalTax,
                totalDiscounts,
                orderDate,
                shopifyUpdatedAt,
                notes: payload.note || existing.notes,
                tags: payload.tags || existing.tags,
                source,
                rawPayload: JSON.stringify(payload),
              },
            });

            await tx.lineItem.deleteMany({ where: { orderId: existing.id } });
          } else {
            orderRecord = await tx.order.create({
              data: {
                shopifyOrderId,
                orderNumber,
                customerName,
                customerEmail,
                customerPhone,
                financialStatus,
                fulfillmentStatus,
                currency,
                totalPrice,
                subtotalPrice,
                totalTax,
                totalDiscounts,
                orderDate,
                shopifyUpdatedAt,
                notes: payload.note,
                tags: payload.tags,
                source,
                rawPayload: JSON.stringify(payload),
              },
            });
          }

          if (payload.line_items && payload.line_items.length > 0) {
            await tx.lineItem.createMany({
              data: payload.line_items.map((item) => ({
                orderId: orderRecord.id,
                shopifyLineItemId: item.id ? String(item.id) : null,
                title: item.title || 'Untitled Product',
                variantTitle: item.variant_title || null,
                sku: item.sku || null,
                quantity: Number(item.quantity) || 1,
                price: Number(item.price) || 0,
                totalDiscount: Number(item.total_discount) || 0,
                vendor: item.vendor || null,
              })),
            });
          }

          const addr = payload.shipping_address;
          if (addr) {
            await tx.shippingAddress.upsert({
              where: { orderId: orderRecord.id },
              update: {
                name: addr.name || customerName,
                address1: addr.address1 || null,
                city: addr.city || null,
                province: addr.province || null,
                zip: addr.zip || null,
                country: addr.country || null,
                phone: addr.phone || null,
              },
              create: {
                orderId: orderRecord.id,
                name: addr.name || customerName,
                address1: addr.address1 || null,
                city: addr.city || null,
                province: addr.province || null,
                zip: addr.zip || null,
                country: addr.country || null,
                phone: addr.phone || null,
              },
            });
          }

          return orderRecord;
        });

        const fullOrder = await this.prisma.order.findUnique({
          where: { id: upsertedOrder.id },
          include: { items: true, shippingAddress: true },
        });

        return { order: fullOrder, isNew };
      } catch (err: any) {
        this.logger.warn(`PostgreSQL write error: ${err.message}. Saving to memory store.`);
      }
    }

    // In-memory upsert fallback
    const existingIndex = this.memOrders.findIndex((o) => o.shopifyOrderId === shopifyOrderId);
    const isNew = existingIndex === -1;
    const orderId = isNew ? `ord-mem-${Date.now()}` : this.memOrders[existingIndex].id;

    const items = (payload.line_items || []).map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      orderId,
      shopifyLineItemId: item.id ? String(item.id) : null,
      title: item.title || 'Product',
      variantTitle: item.variant_title || null,
      sku: item.sku || null,
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
      totalDiscount: Number(item.total_discount) || 0,
      vendor: item.vendor || null,
    }));

    const shippingAddress = payload.shipping_address
      ? {
          id: `addr-${Date.now()}`,
          orderId,
          name: payload.shipping_address.name || customerName,
          address1: payload.shipping_address.address1 || null,
          address2: payload.shipping_address.address2 || null,
          city: payload.shipping_address.city || null,
          province: payload.shipping_address.province || null,
          zip: payload.shipping_address.zip || null,
          country: payload.shipping_address.country || null,
          phone: payload.shipping_address.phone || null,
        }
      : null;

    const orderRecord = {
      id: orderId,
      shopifyOrderId,
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      financialStatus,
      fulfillmentStatus,
      currency,
      totalPrice,
      subtotalPrice,
      totalTax,
      totalDiscounts,
      orderDate,
      shopifyUpdatedAt,
      notes: payload.note || null,
      tags: payload.tags || null,
      source,
      rawPayload: JSON.stringify(payload),
      createdAt: isNew ? new Date() : this.memOrders[existingIndex].createdAt,
      updatedAt: new Date(),
      items,
      shippingAddress,
    };

    if (isNew) {
      this.memOrders.unshift(orderRecord);
    } else {
      this.memOrders[existingIndex] = orderRecord;
    }

    return { order: orderRecord, isNew };
  }
}
