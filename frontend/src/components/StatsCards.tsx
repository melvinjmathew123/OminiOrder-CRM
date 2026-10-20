import React from 'react';
import {
  ShoppingBag,
  DollarSign,
  CheckCircle2,
  Clock,
  Truck,
  TrendingUp,
} from 'lucide-react';
import type { OrderStats } from '../types/order.js';

interface StatsCardsProps {
  stats: OrderStats | null;
  isLoading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const cards = [
    {
      title: 'Total Revenue',
      value: stats ? formatCurrency(stats.totalRevenue) : '$0.00',
      subtitle: 'Across all synchronized orders',
      icon: DollarSign,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.25)',
    },
    {
      title: 'Total Orders',
      value: stats ? stats.totalOrders : 0,
      subtitle: 'Recorded in database',
      icon: ShoppingBag,
      color: '#6366f1',
      bgGlow: 'rgba(99, 102, 241, 0.12)',
      border: 'rgba(99, 102, 241, 0.25)',
    },
    {
      title: 'Paid Orders',
      value: stats ? stats.paidOrders : 0,
      subtitle: 'Successfully captured',
      icon: CheckCircle2,
      color: '#06b6d4',
      bgGlow: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.25)',
    },
    {
      title: 'Pending Orders',
      value: stats ? stats.pendingOrders : 0,
      subtitle: 'Awaiting payment/auth',
      icon: Clock,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
    },
    {
      title: 'Fulfilled',
      value: stats ? stats.fulfilledOrders : 0,
      subtitle: 'Dispatched to customer',
      icon: Truck,
      color: '#8b5cf6',
      bgGlow: 'rgba(139, 92, 246, 0.12)',
      border: 'rgba(139, 92, 246, 0.25)',
    },
    {
      title: 'Avg Order Value',
      value: stats ? formatCurrency(stats.averageOrderValue) : '$0.00',
      subtitle: 'Revenue per transaction',
      icon: TrendingUp,
      color: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.25)',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem',
    }}>
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="glass-panel"
            style={{
              padding: '1.25rem 1.15rem',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Ambient subtle glow */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: c.bgGlow,
              filter: 'blur(25px)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {c.title}
              </span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: c.bgGlow,
                border: `1px solid ${c.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon size={16} color={c.color} />
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--text-main)',
                lineHeight: 1.1,
                marginBottom: '0.35rem',
              }}>
                {isLoading ? '...' : c.value}
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)' }}>
                {c.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
