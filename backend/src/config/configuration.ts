export default () => ({
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mom_crm?schema=public',
  },
  shopify: {
    shopDomain: process.env.SHOPIFY_SHOP_DOMAIN || '',
    accessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
    apiVersion: process.env.SHOPIFY_API_VERSION || '2024-01',
    webhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET || '',
  },
});
