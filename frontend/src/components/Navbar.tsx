import React from 'react';
import {
  ShoppingBag,
  RefreshCw,
  Plus,
  Zap,
  Database,
  Globe,
  Sparkles,
} from 'lucide-react';
import type { SystemStatus } from '../types/order.js';

interface NavbarProps {
  systemStatus: SystemStatus | null;
  isSyncing: boolean;
  onSync: () => void;
  onOpenCreateOrder: () => void;
  onOpenSimulator: () => void;
  onSeedData: () => void;
  isSeeding: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  systemStatus,
  isSyncing,
  onSync,
  onOpenCreateOrder,
  onOpenSimulator,
  onSeedData,
  isSeeding,
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(10, 13, 20, 0.8)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      padding: '0 1.5rem',
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
        gap: '1rem',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <ShoppingBag size={22} color="#ffffff" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                background: 'linear-gradient(to right, #ffffff, #cbd5e1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                OmniOrder
              </span>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '2px 7px',
                borderRadius: '6px',
              }}>
                CRM
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Shopify Order Management & Webhook Sync
            </p>
          </div>
        </div>

        {/* System Status Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Shopify status badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '4px 10px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}>
            <Globe size={13} color={systemStatus?.store.isConfigured ? '#10b981' : '#f59e0b'} />
            <span>Shopify:</span>
            <span style={{
              fontWeight: 600,
              color: systemStatus?.store.isConfigured ? '#34d399' : '#fbbf24',
            }}>
              {systemStatus?.store.isConfigured ? 'Connected' : 'Simulation Mode'}
            </span>
          </div>

          {/* Database status badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '4px 10px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}>
            <Database size={13} color="#818cf8" />
            <span>DB:</span>
            <span style={{ fontWeight: 600, color: '#a5b4fc' }}>
              PostgreSQL / Prisma
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Seed button */}
          <button
            onClick={onSeedData}
            disabled={isSeeding}
            title="Seed 8 realistic sample orders for instant demonstration"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '8px 13px',
              borderRadius: '9px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#cbd5e1',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Sparkles size={15} color="#38bdf8" className={isSeeding ? 'animate-spin-fast' : ''} />
            <span>{isSeeding ? 'Seeding...' : 'Seed Data'}</span>
          </button>

          {/* Webhook Simulator trigger */}
          <button
            onClick={onOpenSimulator}
            title="Open Webhook Simulator and duplicate delivery testing suite"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '8px 13px',
              borderRadius: '9px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#facc15',
              background: 'rgba(250, 204, 21, 0.1)',
              border: '1px solid rgba(250, 204, 21, 0.25)',
            }}
          >
            <Zap size={15} color="#facc15" />
            <span>Webhooks Simulator</span>
          </button>

          {/* Sync Button */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '8px 14px',
              borderRadius: '9px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#ffffff',
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
            }}
          >
            <RefreshCw
              size={15}
              color="#818cf8"
              className={isSyncing ? 'animate-spin-fast' : ''}
            />
            <span>{isSyncing ? 'Syncing...' : 'Sync Shopify'}</span>
          </button>

          {/* Create Order Button */}
          <button
            onClick={onOpenCreateOrder}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '8px 16px',
              borderRadius: '9px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#ffffff',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <Plus size={16} color="#ffffff" strokeWidth={2.5} />
            <span>Create Order</span>
          </button>
        </div>
      </div>
    </header>
  );
};
