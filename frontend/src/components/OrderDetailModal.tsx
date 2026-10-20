import React, { useState } from 'react';
import {
  X,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Zap,
  Code,
  CheckCircle,
  Copy,
} from 'lucide-react';
import type { Order } from '../types/order.js';
import { simulateWebhook } from '../services/api.js';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onOrderUpdated: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onOrderUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'raw'>('details');
  const [isSimulating, setIsSimulating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!order) return null;

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
      return d.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.shopifyOrderId);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSimulateStatus = async (
    financialStatus?: string,
    fulfillmentStatus?: string,
  ) => {
    try {
      setIsSimulating(true);
      await simulateWebhook({
        topic: 'orders/updated',
        orderId: order.id,
        financialStatus,
        fulfillmentStatus,
      });
      onOrderUpdated();
    } catch (err: any) {
      alert(`Simulation error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      background: 'rgba(2, 6, 23, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease-out',
    }}>
      {/* Slide-over Container */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          height: '100%',
          borderRadius: 0,
          borderLeft: '1px solid var(--border-light)',
          background: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-15px 0 35px rgba(0, 0, 0, 0.6)',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10, 13, 20, 0.6)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
              }}>
                {order.orderNumber}
              </h2>
              <button
                onClick={handleCopyId}
                title="Copy Shopify Order ID"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: copySuccess ? '#34d399' : 'var(--text-dim)',
                }}
              >
                {copySuccess ? <CheckCircle size={11} /> : <Copy size={11} />}
                <span>ID: {order.shopifyOrderId}</span>
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '4px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <Calendar size={13} />
              <span>Created: {formatDate(order.orderDate)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={onClose}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 1.5rem',
          background: 'rgba(10, 13, 20, 0.3)',
        }}>
          <button
            onClick={() => setActiveTab('details')}
            style={{
              padding: '12px 16px',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: activeTab === 'details' ? '#ffffff' : 'var(--text-muted)',
              borderBottom: activeTab === 'details' ? '2px solid #6366f1' : '2px solid transparent',
            }}
          >
            Order Overview
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            style={{
              padding: '12px 16px',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: activeTab === 'raw' ? '#ffffff' : 'var(--text-muted)',
              borderBottom: activeTab === 'raw' ? '2px solid #6366f1' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Code size={14} />
            <span>Raw Shopify Payload</span>
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {activeTab === 'details' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Webhook Quick Action Bar */}
              <div style={{
                padding: '1rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.05))',
                border: '1px solid rgba(99, 102, 241, 0.25)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
                  <Zap size={15} color="#818cf8" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e0e7ff' }}>
                    Live Webhook Synchronization Actions
                  </span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '0 0 0.75rem 0' }}>
                  Simulate incoming Shopify <code>orders/updated</code> webhook payloads for this order in real time:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleSimulateStatus('paid')}
                    disabled={isSimulating}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '7px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    Emit Webhook: Mark Paid
                  </button>

                  <button
                    onClick={() => handleSimulateStatus(undefined, 'fulfilled')}
                    disabled={isSimulating}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '7px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#818cf8',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    Emit Webhook: Mark Fulfilled
                  </button>

                  <button
                    onClick={() => handleSimulateStatus('refunded', 'restocked')}
                    disabled={isSimulating}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '7px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: 'rgba(244, 63, 94, 0.15)',
                      color: '#fb7185',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                    }}
                  >
                    Emit Webhook: Mark Refunded
                  </button>
                </div>
              </div>

              {/* Customer & Shipping Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Customer card */}
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    <User size={14} />
                    <span>Customer</span>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem', marginBottom: '4px' }}>
                    {order.customerName}
                  </div>
                  {order.customerEmail && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <Mail size={12} color="var(--text-dim)" />
                      <span>{order.customerEmail}</span>
                    </div>
                  )}
                  {order.customerPhone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <Phone size={12} color="var(--text-dim)" />
                      <span>{order.customerPhone}</span>
                    </div>
                  )}
                </div>

                {/* Shipping address card */}
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    <MapPin size={14} />
                    <span>Shipping Address</span>
                  </div>
                  {order.shippingAddress ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {order.shippingAddress.name || order.customerName}
                      </div>
                      <div>{order.shippingAddress.address1}</div>
                      {order.shippingAddress.address2 && <div>{order.shippingAddress.address2}</div>}
                      <div>
                        {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
                        {order.shippingAddress.zip}
                      </div>
                      <div>{order.shippingAddress.country}</div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      No physical shipping address provided
                    </div>
                  )}
                </div>
              </div>

              {/* Line Items Table */}
              <div className="glass-panel" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  <Package size={14} />
                  <span>Line Items ({order.items?.length || 0})</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {order.items?.map((item) => {
                    const lineTotal = item.price * item.quantity;
                    return (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0, paddingRight: '1rem' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>
                            {item.title}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                            {item.variantTitle && <span>Variant: {item.variantTitle}</span>}
                            {item.sku && <span>SKU: {item.sku}</span>}
                            {item.vendor && <span>Vendor: {item.vendor}</span>}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.88rem' }}>
                            {formatCurrency(lineTotal, order.currency)}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                            {item.quantity} × {formatCurrency(item.price, order.currency)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div style={{
                  marginTop: '1.25rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  fontSize: '0.82rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Subtotal:</span>
                    <span>{formatCurrency(order.subtotalPrice, order.currency)}</span>
                  </div>
                  {order.totalDiscounts > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fb7185' }}>
                      <span>Discounts:</span>
                      <span>-{formatCurrency(order.totalDiscounts, order.currency)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Estimated Tax:</span>
                    <span>{formatCurrency(order.totalTax, order.currency)}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 800,
                    fontSize: '1rem',
                    color: '#ffffff',
                    marginTop: '0.4rem',
                    paddingTop: '0.4rem',
                    borderTop: '1px dashed var(--border-subtle)',
                  }}>
                    <span>Grand Total:</span>
                    <span style={{ color: '#38bdf8' }}>{formatCurrency(order.totalPrice, order.currency)}</span>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              {order.notes && (
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Customer Notes
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
                    "{order.notes}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{
                background: 'rgba(2, 6, 23, 0.8)',
                padding: '1.25rem',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                overflowX: 'auto',
              }}>
                <pre style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  color: '#94a3b8',
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  {order.rawPayload
                    ? JSON.stringify(JSON.parse(order.rawPayload), null, 2)
                    : JSON.stringify(order, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
