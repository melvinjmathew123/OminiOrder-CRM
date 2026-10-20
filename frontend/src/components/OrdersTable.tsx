import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Truck,
  Package,
  Layers,
} from 'lucide-react';
import type { Order, OrdersPagination } from '../types/order.js';

interface OrdersTableProps {
  orders: Order[];
  pagination: OrdersPagination;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onSelectOrder: (order: Order) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  pagination,
  isLoading,
  onPageChange,
  onSelectOrder,
}) => {
  const formatCurrency = (val: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const renderFinancialBadge = (status: string) => {
    const s = (status || 'pending').toLowerCase();
    switch (s) {
      case 'paid':
      case 'authorized':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 9px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#34d399',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}>
            <CheckCircle size={11} />
            <span>{s}</span>
          </span>
        );
      case 'refunded':
      case 'voided':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 9px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            background: 'rgba(244, 63, 94, 0.12)',
            color: '#fb7185',
            border: '1px solid rgba(244, 63, 94, 0.3)',
          }}>
            <RotateCcw size={11} />
            <span>{s}</span>
          </span>
        );
      default: // pending
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 9px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            background: 'rgba(245, 158, 11, 0.12)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.3)',
          }}>
            <AlertCircle size={11} />
            <span>{s}</span>
          </span>
        );
    }
  };

  const renderFulfillmentBadge = (status: string) => {
    const s = (status || 'unfulfilled').toLowerCase();
    switch (s) {
      case 'fulfilled':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 9px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            background: 'rgba(99, 102, 241, 0.12)',
            color: '#818cf8',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          }}>
            <Truck size={11} />
            <span>{s}</span>
          </span>
        );
      case 'partial':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 9px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            background: 'rgba(139, 92, 246, 0.12)',
            color: '#c084fc',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          }}>
            <Layers size={11} />
            <span>{s}</span>
          </span>
        );
      default: // unfulfilled
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 9px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            background: 'rgba(100, 116, 139, 0.12)',
            color: '#94a3b8',
            border: '1px solid rgba(100, 116, 139, 0.3)',
          }}>
            <Package size={11} />
            <span>{s}</span>
          </span>
        );
    }
  };

  const renderSourceTag = (source: string) => {
    let color = '#94a3b8';
    let label = 'Shopify';
    if (source.includes('WEBHOOK')) {
      color = '#06b6d4';
      label = 'Webhook';
    } else if (source.includes('CRM')) {
      color = '#a855f7';
      label = 'CRM Created';
    } else if (source.includes('SYNC')) {
      color = '#3b82f6';
      label = 'Shopify Sync';
    }

    return (
      <span style={{
        fontSize: '0.68rem',
        color,
        fontWeight: 600,
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '2px 6px',
        borderRadius: '4px',
      }}>
        {label}
      </span>
    );
  };

  return (
    <div className="glass-panel" style={{ overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.84rem',
        }}>
          <thead>
            <tr style={{
              background: 'rgba(15, 23, 42, 0.95)',
              borderBottom: '1px solid var(--border-subtle)',
              color: 'var(--text-dim)',
              fontSize: '0.74rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              <th style={{ padding: '14px 18px' }}>Order</th>
              <th style={{ padding: '14px 18px' }}>Date</th>
              <th style={{ padding: '14px 18px' }}>Customer</th>
              <th style={{ padding: '14px 18px' }}>Payment</th>
              <th style={{ padding: '14px 18px' }}>Fulfillment</th>
              <th style={{ padding: '14px 18px' }}>Items</th>
              <th style={{ padding: '14px 18px' }}>Total</th>
              <th style={{ padding: '14px 18px' }}>Source</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      border: '3px solid rgba(99, 102, 241, 0.2)',
                      borderTopColor: '#6366f1',
                      borderRadius: '50%',
                    }} className="animate-spin-fast" />
                    <span>Loading orders from database...</span>
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
                  <Package size={38} color="var(--text-dim)" style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                  <p style={{ fontWeight: 600, color: 'var(--text-main)', margin: '0 0 4px 0' }}>No orders found</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    Try adjusting your search filters or click "Sync Shopify" / "Seed Data".
                  </p>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const totalItemQty = order.items?.reduce((acc, it) => acc + it.quantity, 0) || 0;
                const firstItemTitle = order.items?.[0]?.title || 'No items';

                return (
                  <tr
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Order Number */}
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: '#ffffff',
                        fontSize: '0.86rem',
                      }}>
                        {order.orderNumber}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {formatDate(order.orderDate)}
                    </td>

                    {/* Customer */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2))',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#e2e8f0',
                        }}>
                          {order.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                            {order.customerName}
                          </div>
                          {order.customerEmail && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                              {order.customerEmail}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td style={{ padding: '14px 18px' }}>
                      {renderFinancialBadge(order.financialStatus)}
                    </td>

                    {/* Fulfillment Status */}
                    <td style={{ padding: '14px 18px' }}>
                      {renderFulfillmentBadge(order.fulfillmentStatus)}
                    </td>

                    {/* Items */}
                    <td style={{ padding: '14px 18px', maxWidth: '200px' }}>
                      <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {totalItemQty} {totalItemQty === 1 ? 'item' : 'items'}
                      </div>
                      <div style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-dim)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {firstItemTitle}
                      </div>
                    </td>

                    {/* Total */}
                    <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem' }}>
                        {formatCurrency(order.totalPrice, order.currency)}
                      </span>
                    </td>

                    {/* Source */}
                    <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                      {renderSourceTag(order.source)}
                    </td>

                    {/* Action */}
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order);
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '6px 11px',
                          borderRadius: '7px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#818cf8',
                          background: 'rgba(99, 102, 241, 0.12)',
                          border: '1px solid rgba(99, 102, 241, 0.25)',
                        }}
                      >
                        <Eye size={13} />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div style={{
        padding: '12px 18px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.5)',
      }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          Page {pagination.page} of {pagination.totalPages || 1}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={!pagination.hasPrevPage || isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              color: pagination.hasPrevPage ? 'var(--text-main)' : 'var(--text-dim)',
              opacity: pagination.hasPrevPage ? 1 : 0.5,
              cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed',
            }}
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={!pagination.hasNextPage || isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              color: pagination.hasNextPage ? 'var(--text-main)' : 'var(--text-dim)',
              opacity: pagination.hasNextPage ? 1 : 0.5,
              cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed',
            }}
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
