import axios from 'axios';
import type {
  OrdersResponse,
  Order,
  OrderStats,
  WebhookLog,
  SystemStatus,
  CreateOrderPayload,
} from '../types/order.js';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

export const fetchOrders = async (params: {
  search?: string;
  financialStatus?: string;
  fulfillmentStatus?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}): Promise<OrdersResponse> => {
  const { data } = await api.get('/orders', { params });
  return data;
};

export const fetchOrderById = async (id: string): Promise<Order> => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

export const fetchOrderStats = async (): Promise<OrderStats> => {
  const { data } = await api.get('/orders/stats');
  return data;
};

export const syncOrdersWithShopify = async (): Promise<{
  success: boolean;
  ordersFetched: number;
  ordersCreated: number;
  ordersUpdated: number;
}> => {
  const { data } = await api.post('/orders/sync');
  return data;
};

export const createOrder = async (payload: CreateOrderPayload): Promise<{
  message: string;
  order: Order;
}> => {
  const { data } = await api.post('/orders', payload);
  return data;
};

export const fetchWebhookLogs = async (limit = 25): Promise<WebhookLog[]> => {
  const { data } = await api.get('/webhooks/logs', { params: { limit } });
  return data;
};

export const fetchSystemStatus = async (): Promise<SystemStatus> => {
  const { data } = await api.get('/simulator/status');
  return data;
};

export const seedSampleOrders = async (count = 8): Promise<{
  message: string;
  count: number;
}> => {
  const { data } = await api.post('/simulator/seed', { count });
  return data;
};

export const simulateWebhook = async (payload: {
  topic: 'orders/create' | 'orders/updated';
  orderId?: string;
  financialStatus?: string;
  fulfillmentStatus?: string;
  forceDuplicate?: boolean;
}): Promise<any> => {
  const { data } = await api.post('/simulator/webhook', payload);
  return data;
};

export default api;
