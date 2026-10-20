-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "shopifyOrderId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "financialStatus" TEXT NOT NULL DEFAULT 'pending',
    "fulfillmentStatus" TEXT NOT NULL DEFAULT 'unfulfilled',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "subtotalPrice" DOUBLE PRECISION NOT NULL,
    "totalTax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDiscounts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "shopifyUpdatedAt" TIMESTAMP(3),
    "notes" TEXT,
    "tags" TEXT,
    "source" TEXT NOT NULL DEFAULT 'SHOPIFY',
    "rawPayload" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "shopifyLineItemId" TEXT,
    "title" TEXT NOT NULL,
    "variantTitle" TEXT,
    "sku" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,
    "totalDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vendor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingAddress" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "name" TEXT,
    "address1" TEXT,
    "address2" TEXT,
    "city" TEXT,
    "province" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "phone" TEXT,

    CONSTRAINT "ShippingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookLog" (
    "id" TEXT NOT NULL,
    "webhookId" TEXT,
    "topic" TEXT NOT NULL,
    "shopifyOrderId" TEXT,
    "status" TEXT NOT NULL,
    "details" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "trigger" TEXT NOT NULL DEFAULT 'MANUAL',
    "ordersFetched" INTEGER NOT NULL DEFAULT 0,
    "ordersCreated" INTEGER NOT NULL DEFAULT 0,
    "ordersUpdated" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_shopifyOrderId_key" ON "Order"("shopifyOrderId");

-- CreateIndex
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_customerName_idx" ON "Order"("customerName");

-- CreateIndex
CREATE INDEX "Order_customerEmail_idx" ON "Order"("customerEmail");

-- CreateIndex
CREATE INDEX "Order_financialStatus_idx" ON "Order"("financialStatus");

-- CreateIndex
CREATE INDEX "Order_fulfillmentStatus_idx" ON "Order"("fulfillmentStatus");

-- CreateIndex
CREATE INDEX "Order_orderDate_idx" ON "Order"("orderDate");

-- CreateIndex
CREATE INDEX "LineItem_orderId_idx" ON "LineItem"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingAddress_orderId_key" ON "ShippingAddress"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookLog_webhookId_key" ON "WebhookLog"("webhookId");

-- CreateIndex
CREATE INDEX "WebhookLog_webhookId_idx" ON "WebhookLog"("webhookId");

-- CreateIndex
CREATE INDEX "WebhookLog_shopifyOrderId_idx" ON "WebhookLog"("shopifyOrderId");

-- CreateIndex
CREATE INDEX "WebhookLog_receivedAt_idx" ON "WebhookLog"("receivedAt");

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingAddress" ADD CONSTRAINT "ShippingAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
