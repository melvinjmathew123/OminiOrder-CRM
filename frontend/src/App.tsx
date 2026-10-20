import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.js';
import { StatsCards } from './components/StatsCards.js';
import { OrdersFilter } from './components/OrdersFilter.js';
import { OrdersTable } from './components/OrdersTable.js';
import { OrderDetailModal } from './components/OrderDetailModal.js';
import { CreateOrderModal } from './components/CreateOrderModal.js';
import { WebhookSimulatorModal } from './components/WebhookSimulatorModal.js';
import type {
  Order,
  OrderStats,
  OrdersPagination,
  SystemStatus,
} from './types/order.js';
import {
  fetchOrders,
  fetchOrderStats,
  fetchSystemStatus,
  syncOrdersWithShopify,
  seedSampleOrders,
} from './services/api.js';

export function App() {
  // Data state
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [pagination, setPagination] = useState<OrdersPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter state
  const [search, setSearch] = useState('');
  const [financialStatus, setFinancialStatus] = useState('all');
  const [fulfillmentStatus, setFulfillmentStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Loading states
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load orders
  const loadOrders = useCallback(async () => {
    try {
      setIsLoadingOrders(true);
      const res = await fetchOrders({
        search,
        financialStatus,
        fulfillmentStatus,
        startDate,
        endDate,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: 10,
      });
      setOrders(res.data);
      setPagination(res.pagination);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [search, financialStatus, fulfillmentStatus, startDate, endDate, sortBy, sortOrder, currentPage]);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      setIsLoadingStats(true);
      const s = await fetchOrderStats();
      setStats(s);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // Load system status
  const loadStatus = useCallback(async () => {
    try {
      const st = await fetchSystemStatus();
      setSystemStatus(st);
    } catch (err) {
      console.error('Error loading system status:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadOrders();
    loadStats();
    loadStatus();
  }, [loadOrders, loadStats, loadStatus]);

  // Handle Shopify Sync
  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const res = await syncOrdersWithShopify();
      showToast(
        `Sync complete! Fetched ${res.ordersFetched} orders (Created: ${res.ordersCreated}, Updated: ${res.ordersUpdated})`,
        'success',
      );
      await Promise.all([loadOrders(), loadStats(), loadStatus()]);
    } catch (err: any) {
      showToast(`Shopify sync failed: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle Seeding Sample Data
  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const res = await seedSampleOrders(8);
      showToast(res.message, 'success');
      await Promise.all([loadOrders(), loadStats(), loadStatus()]);
    } catch (err: any) {
      showToast(`Seeding failed: ${err.message}`, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setFinancialStatus('all');
    setFulfillmentStatus('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 100,
          padding: '12px 18px',
          borderRadius: '10px',
          background: toast.type === 'error' ? 'rgba(244, 63, 94, 0.95)' : 'rgba(16, 185, 129, 0.95)',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: '0.84rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.25s ease-out',
        }}>
          {toast.message}
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        systemStatus={systemStatus}
        isSyncing={isSyncing}
        onSync={handleSync}
        onOpenCreateOrder={() => setIsCreateOrderOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onSeedData={handleSeedData}
        isSeeding={isSeeding}
      />

      {/* Main Container */}
      <main style={{
        flex: 1,
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        padding: '1.75rem 1.5rem 3rem 1.5rem',
      }}>
        {/* KPI Dashboard Cards */}
        <StatsCards stats={stats} isLoading={isLoadingStats} />

        {/* Filter and Search Bar */}
        <OrdersFilter
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          financialStatus={financialStatus}
          onFinancialStatusChange={(val) => {
            setFinancialStatus(val);
            setCurrentPage(1);
          }}
          fulfillmentStatus={fulfillmentStatus}
          onFulfillmentStatusChange={(val) => {
            setFulfillmentStatus(val);
            setCurrentPage(1);
          }}
          startDate={startDate}
          onStartDateChange={(val) => {
            setStartDate(val);
            setCurrentPage(1);
          }}
          endDate={endDate}
          onEndDateChange={(val) => {
            setEndDate(val);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          onSortByChange={(val) => setSortBy(val)}
          sortOrder={sortOrder}
          onSortOrderToggle={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          onReset={handleResetFilters}
          totalResults={pagination.total}
        />

        {/* Orders Table */}
        <OrdersTable
          orders={orders}
          pagination={pagination}
          isLoading={isLoadingOrders}
          onPageChange={(page) => setCurrentPage(page)}
          onSelectOrder={(order) => setSelectedOrder(order)}
        />
      </main>

      {/* Order Details Slide-over Drawer */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onOrderUpdated={async () => {
          await Promise.all([loadOrders(), loadStats()]);
          if (selectedOrder) {
            // refresh selected order details
            try {
              const res = await fetchOrders({ search: selectedOrder.orderNumber });
              if (res.data[0]) setSelectedOrder(res.data[0]);
            } catch (e) {}
          }
        }}
      />

      {/* Create Order Modal (Optional Feature) */}
      <CreateOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
        onOrderCreated={async () => {
          showToast('Order successfully created and synced with Shopify!', 'success');
          await Promise.all([loadOrders(), loadStats()]);
        }}
      />

      {/* Webhook Simulator Modal */}
      <WebhookSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        orders={orders}
        onWebhookExecuted={async () => {
          await Promise.all([loadOrders(), loadStats()]);
        }}
      />
    </div>
  );
}

export default App;
