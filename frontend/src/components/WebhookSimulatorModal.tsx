import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  History,
  ShieldCheck,
  Play,
} from 'lucide-react';
import type { WebhookLog, Order } from '../types/order.js';
import { fetchWebhookLogs, simulateWebhook } from '../services/api.js';

interface WebhookSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onWebhookExecuted: () => void;
}

export const WebhookSimulatorModal: React.FC<WebhookSimulatorModalProps> = ({
  isOpen,
  onClose,
  orders,
  onWebhookExecuted,
}) => {
  const [topic, setTopic] = useState<'orders/create' | 'orders/updated'>('orders/create');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [financialStatus, setFinancialStatus] = useState('paid');
  const [fulfillmentStatus, setFulfillmentStatus] = useState('fulfilled');
  const [forceDuplicate, setForceDuplicate] = useState(false);

  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const loadLogs = async () => {
    try {
      setIsLoadingLogs(true);
      const data = await fetchWebhookLogs(15);
      setLogs(data);
    } catch (err) {
      console.error('Failed to load webhook logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLogs();
      if (orders.length > 0 && !selectedOrderId) {
        setSelectedOrderId(orders[0].id);
      }
    }
  }, [isOpen, orders]);

  if (!isOpen) return null;

  const handleSimulate = async () => {
    try {
      setIsSimulating(true);
      setSimulationResult(null);

      const res = await simulateWebhook({
        topic,
        orderId: topic === 'orders/updated' ? selectedOrderId : undefined,
        financialStatus: topic === 'orders/updated' ? financialStatus : undefined,
        fulfillmentStatus: topic === 'orders/updated' ? fulfillmentStatus : undefined,
        forceDuplicate,
      });

      setSimulationResult(res);
      await loadLogs();
      onWebhookExecuted();
    } catch (err: any) {
      setSimulationResult({
        error: true,
        message: err.response?.data?.message || err.message,
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'PROCESSED':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            padding: '2px 7px',
            borderRadius: '5px',
            fontSize: '0.7rem',
            fontWeight: 700,
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}>
            <CheckCircle size={10} />
            <span>PROCESSED</span>
          </span>
        );
      case 'DUPLICATE':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            padding: '2px 7px',
            borderRadius: '5px',
            fontSize: '0.7rem',
            fontWeight: 700,
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.3)',
          }}>
            <ShieldCheck size={10} />
            <span>DUPLICATE</span>
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            padding: '2px 7px',
            borderRadius: '5px',
            fontSize: '0.7rem',
            fontWeight: 700,
            background: 'rgba(244, 63, 94, 0.15)',
            color: '#fb7185',
            border: '1px solid rgba(244, 63, 94, 0.3)',
          }}>
            <AlertTriangle size={10} />
            <span>FAILED</span>
          </span>
        );
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 70,
      background: 'rgba(2, 6, 23, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      animation: 'fadeIn 0.2s ease-out',
    }}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '840px',
          maxHeight: '90vh',
          background: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Zap size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Shopify Webhook Simulator & Idempotency Suite
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Test orders/create, orders/updated, duplicate delivery handling, and view audit trail
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Controls Box */}
          <div style={{
            padding: '1.25rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              {/* Topic Select */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '5px' }}>
                  Webhook Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                  }}
                >
                  <option value="orders/create">orders/create (New Order)</option>
                  <option value="orders/updated">orders/updated (Order Modified)</option>
                </select>
              </div>

              {/* If Topic is orders/updated, pick target order */}
              {topic === 'orders/updated' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '5px' }}>
                    Target Order to Update
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem',
                    }}
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.orderNumber} — {o.customerName} (${o.totalPrice})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Financial Status change */}
              {topic === 'orders/updated' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '5px' }}>
                    Set Payment Status
                  </label>
                  <select
                    value={financialStatus}
                    onChange={(e) => setFinancialStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem',
                    }}
                  >
                    <option value="paid">paid</option>
                    <option value="pending">pending</option>
                    <option value="refunded">refunded</option>
                  </select>
                </div>
              )}

              {/* Fulfillment Status change */}
              {topic === 'orders/updated' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '5px' }}>
                    Set Fulfillment Status
                  </label>
                  <select
                    value={fulfillmentStatus}
                    onChange={(e) => setFulfillmentStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem',
                    }}
                  >
                    <option value="fulfilled">fulfilled</option>
                    <option value="unfulfilled">unfulfilled</option>
                    <option value="partial">partial</option>
                  </select>
                </div>
              )}
            </div>

            {/* Duplicate delivery test toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              marginBottom: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <ShieldCheck size={18} color="#f59e0b" />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fef3c7' }}>
                    Test Duplicate Webhook Delivery (Idempotency)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#fde68a' }}>
                    Forces identical Shopify Webhook ID delivery to test deduplication and prevent duplicate database records
                  </div>
                </div>
              </div>

              <input
                type="checkbox"
                checked={forceDuplicate}
                onChange={(e) => setForceDuplicate(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#f59e0b' }}
              />
            </div>

            {/* Fire webhook button */}
            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#ffffff',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.25)',
              }}
            >
              <Play size={15} fill="#ffffff" />
              <span>{isSimulating ? 'Processing Webhook Event...' : 'Fire Simulated Shopify Webhook'}</span>
            </button>
          </div>

          {/* Simulation Result Output */}
          {simulationResult && (
            <div style={{
              padding: '1rem',
              borderRadius: '10px',
              background: simulationResult.result?.status === 'DUPLICATE'
                ? 'rgba(245, 158, 11, 0.1)'
                : 'rgba(16, 185, 129, 0.1)',
              border: `1px solid ${simulationResult.result?.status === 'DUPLICATE' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
                  Webhook Execution Result:
                </span>
                {renderStatusBadge(simulationResult.result?.status || 'PROCESSED')}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {simulationResult.result?.message || `Webhook event successfully synced to Order ${simulationResult.result?.orderNumber || ''}`}
              </div>
            </div>
          )}

          {/* Live Webhook Logs Table */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                <History size={14} />
                <span>Live Webhook Audit Log ({logs.length})</span>
              </div>
              <button
                onClick={loadLogs}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.74rem',
                  color: '#818cf8',
                }}
              >
                <RotateCcw size={12} className={isLoadingLogs ? 'animate-spin-fast' : ''} />
                <span>Refresh Logs</span>
              </button>
            </div>

            <div style={{
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              overflowX: 'auto',
              background: 'rgba(2, 6, 23, 0.5)',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    color: 'var(--text-dim)',
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                  }}>
                    <th style={{ padding: '8px 12px' }}>Timestamp</th>
                    <th style={{ padding: '8px 12px' }}>Topic</th>
                    <th style={{ padding: '8px 12px' }}>Delivery Webhook ID</th>
                    <th style={{ padding: '8px 12px' }}>Status</th>
                    <th style={{ padding: '8px 12px' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                        No webhook deliveries recorded yet
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '8px 12px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                          {new Date(log.receivedAt).toLocaleTimeString()}
                        </td>
                        <td style={{ padding: '8px 12px', fontWeight: 600, color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>
                          {log.topic}
                        </td>
                        <td style={{ padding: '8px 12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                          {log.webhookId ? log.webhookId.slice(0, 24) : 'N/A'}...
                        </td>
                        <td style={{ padding: '8px 12px' }}>
                          {renderStatusBadge(log.status)}
                        </td>
                        <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>
                          {log.details || '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
