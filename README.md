# 🛍️ OmniOrder CRM — Mini Order Management System

A high-performance, full-stack **Mini Order Management CRM** engineered for Shopify store integration. Built with **NestJS**, **PostgreSQL (Prisma ORM)**, and **React (TypeScript + Vite)**, featuring real-time webhook synchronization, cryptographic HMAC verification, idempotent duplicate handling, and an end-to-end "Create Order" synchronization flow.

---

## 📋 Table of Contents
1. [Core Features & Requirements](#-core-features--requirements)
2. [Technology Stack & Architecture](#-technology-stack--architecture)
3. [Project Structure](#-project-structure)
4. [Database Schema & Migrations](#-database-schema--migrations)
5. [Shopify Integration Architecture](#-shopify-integration-architecture)
6. [Webhook Synchronization & Security](#-webhook-synchronization--security)
7. [Getting Started & Local Setup](#-getting-started--local-setup)
8. [Environment Variables](#-environment-variables)
9. [Built-in Webhook & Idempotency Simulator](#-built-in-webhook--idempotency-simulator)
10. [Walkthrough & Demonstration Guide](#-walkthrough--demonstration-guide)
11. [Technical Decisions & Trade-Offs](#-technical-decisions--trade-offs)

---

## 🌟 Core Features & Requirements

- ✅ **Shopify Admin API Integration**: Fetches orders via REST Admin API with pagination, rate-limit backoff (HTTP 429), and stores them in PostgreSQL.
- ✅ **Orders Section**: Real-time multi-attribute search (by order number, customer name, email, item title), filtering by financial status (`paid`, `pending`, `refunded`, etc.) and fulfillment status (`fulfilled`, `unfulfilled`, `partial`), custom date ranges, and sorting.
- ✅ **Rich Order Details Drawer**: Detailed breakdown displaying order number, customer profile, shipping address, line items (title, variant, SKU, quantity, unit price), tax calculation, discounts, and raw Shopify payload inspector.
- ✅ **Webhook Integration (`orders/create`, `orders/updated`)**:
  - Secure HMAC SHA-256 verification with timing-safe buffer comparison.
  - Idempotent deduplication against duplicate webhook deliveries.
  - Stale update protection (rejects older out-of-order events if newer data exists).
- ✅ **Create Order Feature (Optional Feature Completed)**: Full interface to create orders in the CRM, calculate totals, sync with Shopify's `POST /admin/api/{version}/orders.json`, and persist in PostgreSQL.
- ✅ **Built-in Webhook Simulator & Audit Suite**: Zero-configuration demo suite allowing reviewers to test webhook events, duplicate delivery rejection, and order updates without needing an active ngrok tunnel.
- ✅ **Zero-Config Resilient Fallback**: Out-of-the-box dual-mode architecture that connects to PostgreSQL when available, or provides a seamless in-memory evaluation store if running without an active database.

---

## 🛠 Technology Stack & Architecture

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (Node.js v22+)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Validation & Transformation**: `class-validator`, `class-transformer`
- **HTTP Client**: `axios` with automatic 429 rate-limiting retry interceptors
- **Security**: Node.js `crypto` for HMAC-SHA256 signature verification and timing-safe equality

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Design System**: Modern Glassmorphic UI with tailored HSL color tokens, dark mode gradients, and micro-interactions

---

## 📂 Real-World Enterprise Project Structure

The project follows a clean **Enterprise Monorepo Architecture** separating concern between containerization, CI/CD, database migrations, typed configurations, telemetry, and domain modules:

```
MOM CRM/
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI (lint, typecheck, Prisma generate, build)
├── docker-compose.yml              # Multi-container production stack (PostgreSQL + Backend + Frontend)
├── package.json                    # Monorepo orchestration scripts
├── README.md                       # Architecture & deployment manual
│
├── backend/                        # Production NestJS Application
│   ├── Dockerfile                  # Multi-stage production build (Node 22 Alpine)
│   ├── .dockerignore
│   ├── .env.example                # Documented environment template
│   ├── prisma/
│   │   ├── schema.prisma           # Relational schema (Orders, LineItems, Addresses, WebhookLogs, SyncLogs)
│   │   └── migrations/             # Idempotent SQL migrations (20261020000000_init)
│   └── src/
│       ├── common/                 # Enterprise cross-cutting concerns
│       │   ├── filters/            # RFC-standardized AllExceptionsFilter
│       │   ├── interceptors/       # LoggingInterceptor (HTTP performance duration)
│       │   └── guards/             # ShopifyHmacGuard (cryptographic timingSafeEqual)
│       ├── config/                 # Type-safe configuration
│       │   ├── configuration.ts    # Config loader factory
│       │   └── env.validation.ts   # class-validator runtime environment assertions
│       ├── health/                 # Kubernetes / Docker health probes
│       │   ├── health.controller.ts# GET /api/health (Database, Shopify, memory, uptime)
│       │   └── health.module.ts
│       ├── prisma/                 # PrismaService & lifecycle hooks
│       ├── shopify/                # Shopify Admin REST API Client & 429 Rate Limiter
│       ├── orders/                 # Order domain: Service, Controller, DTOs
│       ├── webhooks/               # Webhooks domain: Controller, Service, HMAC Guard
│       ├── simulator/              # Simulator domain for zero-config demonstration
│       ├── app.module.ts           # Root module with global config & health
│       └── main.ts                 # Bootstrap: rawBody, CORS, GlobalPipes, GlobalFilters
│
└── frontend/                       # Production React 19 + TypeScript + Vite Application
    ├── Dockerfile                  # Multi-stage Nginx production container
    ├── .dockerignore
    ├── index.html                  # Responsive shell with Google Fonts & metadata
    ├── vite.config.ts              # Vite proxy configuration to /api
    └── src/
        ├── components/             # Component Architecture
        │   ├── Navbar.tsx          # Navigation header with system health pills
        │   ├── StatsCards.tsx      # KPI cards (Revenue, Total, Paid, Pending, Fulfilled, AOV)
        │   ├── OrdersFilter.tsx    # Multi-criteria filter, search, date range & sort bar
        │   ├── OrdersTable.tsx     # Data table with status badges and pagination
        │   ├── OrderDetailModal.tsx# Slide-over drawer with item breakdown & raw payload
        │   ├── CreateOrderModal.tsx# Dynamic line items order builder & Shopify sync
        │   └── WebhookSimulatorModal.tsx # Webhook testing & live audit table
        ├── services/               # API Integration
        │   └── api.ts              # Typed Axios HTTP client
        ├── types/                  # Domain Types
        │   └── order.ts            # Order, LineItem, Address, WebhookLog, Stats
        ├── App.tsx                 # Core application controller & state orchestrator
        └── index.css               # Design system tokens, glassmorphism, animations
```

---

## 🗄️ Database Schema & Migrations

The database is modeled in PostgreSQL using Prisma with indexes on frequently searched and filtered fields (`orderNumber`, `customerName`, `customerEmail`, `financialStatus`, `fulfillmentStatus`, `orderDate`):

```mermaid
erDiagram
    ORDER ||--o{ LINE_ITEM : contains
    ORDER ||--o| SHIPPING_ADDRESS : ships_to
    ORDER {
        string id PK
        string shopifyOrderId UK
        string orderNumber
        string customerName
        string customerEmail
        string customerPhone
        string financialStatus
        string fulfillmentStatus
        string currency
        float totalPrice
        float subtotalPrice
        float totalTax
        float totalDiscounts
        datetime orderDate
        datetime shopifyUpdatedAt
        string notes
        string source
        string rawPayload
        datetime createdAt
        datetime updatedAt
    }
    LINE_ITEM {
        string id PK
        string orderId FK
        string shopifyLineItemId
        string title
        string variantTitle
        string sku
        int quantity
        float price
        float totalDiscount
        string vendor
    }
    SHIPPING_ADDRESS {
        string id PK
        string orderId FK
        string name
        string address1
        string address2
        string city
        string province
        string zip
        string country
        string phone
    }
    WEBHOOK_LOG {
        string id PK
        string webhookId UK
        string topic
        string shopifyOrderId
        string status
        string details
        datetime receivedAt
    }
    SYNC_LOG {
        string id PK
        string status
        string trigger
        int ordersFetched
        int ordersCreated
        int ordersUpdated
        string error
        datetime startedAt
        datetime completedAt
    }
```

The database migration SQL is stored under:
[`backend/prisma/migrations/20261020000000_init/migration.sql`](file:///c:/MERN/MOM%20CRM/backend/prisma/migrations/20261020000000_init/migration.sql)

---

## 🔌 Shopify Integration Architecture

### 1. Fetching Orders (`GET /admin/api/2024-01/orders.json`)
The `ShopifyService` interacts with Shopify's REST Admin API using an authorized Axios instance:
- Passes `status=any&limit=50`.
- Includes interceptors for Shopify's API rate limits (HTTP 429): automatically parses the `Retry-After` header and performs an asynchronous backoff retry.
- Normalizes Shopify payload formats into our relational structure and handles customer information regardless of whether the order was placed by a registered customer or guest.

### 2. Creating Orders (`POST /admin/api/2024-01/orders.json`)
Allows staff to create orders directly from the CRM:
- Formats line items, variant titles, pricing, and shipping address.
- Sends payload to Shopify Admin API.
- Stores the newly created order in PostgreSQL and updates live dashboard metrics.

---

## ⚡ Webhook Synchronization & Security

### 1. HMAC Verification (`ShopifyHmacGuard`)
Shopify signs all webhook requests with an HMAC-SHA256 signature passed in the `X-Shopify-Hmac-Sha256` header.
- The backend enables `rawBody: true` in NestJS bootstrap so the exact request payload is preserved.
- The signature is calculated using `crypto.createHmac('sha256', secret).update(rawBody).digest('base64')`.
- Timing attacks are mitigated using `crypto.timingSafeEqual` comparison.

### 2. Duplicate Delivery Handling (Idempotency)
Shopify may retry webhook deliveries if acknowledgment is delayed. To ensure idempotency:
1. Every webhook request contains an `X-Shopify-Webhook-Id` header.
2. The `WebhooksService` checks if the `webhookId` already exists in `WebhookLog`.
3. If duplicate: logs status as `DUPLICATE` and returns HTTP 200 OK immediately without modifying the order or duplicating records.

### 3. Out-Of-Order Event Handling
If network latency causes an older `orders/updated` event to arrive after a newer one:
- The service compares `payload.updated_at` against the existing `shopifyUpdatedAt` timestamp in the database.
- If the incoming event is older, it is flagged as `SKIPPED_STALE` to prevent overwriting newer customer updates.

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- Node.js v20+ or v22+
- npm v10+
- (Optional) Docker for PostgreSQL

### Step 1: Clone and Install Dependencies
```bash
# Clone the repository
cd "MOM CRM"

# Install backend dependencies
cd backend
npm install --legacy-peer-deps

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

### Step 2: Database Setup (PostgreSQL)

**Option A: Using Docker (Recommended)**
```bash
docker compose up -d
```

**Option B: Using Native PostgreSQL**
Ensure PostgreSQL is running locally on port `5432` with a database named `mom_crm`.

Apply database migrations:
```bash
cd backend
npx prisma migrate deploy
cd ..
```

> **Note**: If testing without an active PostgreSQL instance, the application automatically activates its built-in in-memory fallback store so all UI features, searches, filters, order creation, and webhook simulations work immediately!

### Step 3: Run the Application

In terminal 1 (Backend):
```bash
cd backend
npm run start:dev
```
*Backend runs on `http://localhost:4000/api`*

In terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`*

Open your browser at **`http://localhost:5173`**.

---

## 🔑 Environment Variables

Backend environment variables are configured in `backend/.env`:

```env
# Application Port
PORT=4000

# PostgreSQL Connection String (Prisma ORM)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mom_crm?schema=public"

# Shopify Store Credentials (Optional for local simulation mode)
SHOPIFY_SHOP_DOMAIN="your-store.myshopify.com"
SHOPIFY_ADMIN_ACCESS_TOKEN="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
SHOPIFY_API_VERSION="2024-01"

# Shopify Webhook Secret (For HMAC-SHA256 signature verification)
SHOPIFY_WEBHOOK_SECRET="shpss_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## 🧪 Built-in Webhook & Idempotency Simulator

To make technical evaluations fast and seamless, the application includes a **Webhook Simulator Suite** accessible directly from the top navigation bar (`Webhooks Simulator` button):

1. **Simulate `orders/create`**: Emits a simulated order creation webhook payload. The backend processes it, updates PostgreSQL, and the new order appears on the dashboard.
2. **Simulate `orders/updated`**: Select any existing order and modify its payment status (e.g. from `pending` to `paid`) or fulfillment status (e.g. to `fulfilled`).
3. **Test Duplicate Delivery (Idempotency)**: Check the "Test Duplicate Webhook Delivery" checkbox. The simulator fires the same webhook ID twice. The second request returns `status: DUPLICATE` with HTTP 200 OK, verifying that duplicate deliveries are handled gracefully.
4. **Live Audit Trail**: View real-time webhook logs showing timestamps, webhook delivery IDs, event topics, status, and processing notes.

---

## 📹 Walkthrough & Demonstration Guide

### Part 1: User Experience Walkthrough
1. **Overview Dashboard**: Observe the live KPI metrics (Total Orders, Total Revenue, Paid, Pending, Fulfilled, Average Order Value).
2. **Seed Sample Data**: Click **"Seed Data"** in the top bar to populate 8 realistic orders spanning multiple categories, dates, and statuses.
3. **Search & Filter**:
   - Type a customer name (e.g. `Sarah`) or order number (e.g. `#1001`) into the search bar.
   - Filter by **Payment: Paid** and **Fulfillment: Fulfilled**.
   - Select custom date ranges or change sorting by **Total Amount**.
4. **Order Details**: Click **"Details"** on any order to open the slide-over drawer:
   - View customer contact information and full shipping address.
   - Inspect line items, SKUs, quantities, and pricing breakdown.
   - Switch to the **"Raw Shopify Payload"** tab to view the exact JSON payload.
5. **Demonstrating Webhook Synchronization**:
   - In the Order Details drawer, click **"Emit Webhook: Mark Paid"** or **"Emit Webhook: Mark Fulfilled"**.
   - Notice the status badge and KPI counters update immediately.
6. **Create Order Flow**:
   - Click **"Create Order"** in the top navigation bar.
   - Fill in Customer Name (`Jordan Taylor`), email, and address.
   - Add items (title, quantity, price), select **Payment Status: Paid**, and click **"Create & Sync Order"**.
   - The order is created, synced, and displayed in the table.

### Part 2: Backend Architecture & Code Walkthrough
- **NestJS Architecture**:
  - `orders/`: Handles CRUD, multi-attribute filtering, aggregation queries, and Shopify sync logic.
  - `webhooks/`: Handles webhook endpoints, HMAC guard, duplicate detection, and audit logging.
  - `shopify/`: Encapsulates Shopify Admin REST API communication, rate-limit backoffs, and error handlers.
  - `prisma/`: Manages PostgreSQL database connection lifecycle.
- **Webhook Security**:
  - Review [`backend/src/webhooks/guards/shopify-hmac.guard.ts`](file:///c:/MERN/MOM%20CRM/backend/src/webhooks/guards/shopify-hmac.guard.ts) for raw body HMAC calculation and timing-safe comparison.
  - Review [`backend/src/webhooks/webhooks.service.ts`](file:///c:/MERN/MOM%20CRM/backend/src/webhooks/webhooks.service.ts) for duplicate detection and stale update protection.

---

## 💡 Technical Decisions & Trade-Offs

1. **Preserving Raw Body for HMAC**: In NestJS, standard body parsers transform JSON into JavaScript objects before guards execute. To guarantee cryptographic HMAC validity with Shopify, we enabled `rawBody: true` in `NestFactory.create()` to preserve the byte stream.
2. **Idempotency Strategy**: We store every received `X-Shopify-Webhook-Id` in a dedicated `WebhookLog` table. This allows fast O(1) indexed lookups to detect duplicate delivery without modifying the primary `Order` table.
3. **Stale Update Protection**: Webhooks can arrive out of chronological order due to network retries. By comparing the incoming payload's `updated_at` against the stored `shopifyUpdatedAt`, we prevent an older update from overwriting newer customer data.
4. **Zero-Config Evaluator Fallback**: Understanding that interview evaluators may not always have a local PostgreSQL daemon or active Shopify Partner store running, we architected a dual-mode service that operates against PostgreSQL when connected, and gracefully falls back to an in-memory store so all features remain testable out of the box.
