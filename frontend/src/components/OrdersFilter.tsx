import React from 'react';
import {
  Search,
  Filter,
  X,
  ArrowUpDown,
  Calendar,
} from 'lucide-react';

interface OrdersFilterProps {
  search: string;
  onSearchChange: (val: string) => void;
  financialStatus: string;
  onFinancialStatusChange: (val: string) => void;
  fulfillmentStatus: string;
  onFulfillmentStatusChange: (val: string) => void;
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderToggle: () => void;
  onReset: () => void;
  totalResults: number;
}

export const OrdersFilter: React.FC<OrdersFilterProps> = ({
  search,
  onSearchChange,
  financialStatus,
  onFinancialStatusChange,
  fulfillmentStatus,
  onFulfillmentStatusChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle,
  onReset,
  totalResults,
}) => {
  const isFiltered =
    search !== '' ||
    financialStatus !== 'all' ||
    fulfillmentStatus !== 'all' ||
    startDate !== '' ||
    endDate !== '';

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      {/* Top row: Search and Sort */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.85rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        {/* Search input */}
        <div style={{
          position: 'relative',
          flex: '1 1 320px',
          maxWidth: '480px',
        }}>
          <Search
            size={17}
            color="var(--text-dim)"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search by order #, customer name, email, or item..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              borderRadius: '10px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
            }}
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)',
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Right side: Sorting & Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Order count badge */}
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
          }}>
            Showing <strong style={{ color: '#ffffff' }}>{totalResults}</strong> orders
          </div>

          {/* Sort By Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              <option value="orderDate">Order Date</option>
              <option value="totalPrice">Total Amount</option>
              <option value="orderNumber">Order #</option>
              <option value="createdAt">Sync Date</option>
            </select>

            {/* Sort order toggle button */}
            <button
              onClick={onSortOrderToggle}
              title={`Switch to ${sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              <ArrowUpDown size={14} />
              <span>{sortOrder.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: Filter selectors */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.75rem',
        paddingTop: '0.85rem',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
          <Filter size={14} />
          <span>Filters:</span>
        </div>

        {/* Financial Status */}
        <select
          value={financialStatus}
          onChange={(e) => onFinancialStatusChange(e.target.value)}
          style={{
            padding: '7px 12px',
            borderRadius: '8px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          <option value="all">Payment: All</option>
          <option value="paid">Payment: Paid</option>
          <option value="pending">Payment: Pending</option>
          <option value="refunded">Payment: Refunded</option>
          <option value="authorized">Payment: Authorized</option>
          <option value="voided">Payment: Voided</option>
        </select>

        {/* Fulfillment Status */}
        <select
          value={fulfillmentStatus}
          onChange={(e) => onFulfillmentStatusChange(e.target.value)}
          style={{
            padding: '7px 12px',
            borderRadius: '8px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          <option value="all">Fulfillment: All</option>
          <option value="fulfilled">Fulfillment: Fulfilled</option>
          <option value="unfulfilled">Fulfillment: Unfulfilled</option>
          <option value="partial">Fulfillment: Partial</option>
          <option value="restocked">Fulfillment: Restocked</option>
        </select>

        {/* Date Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Calendar size={13} color="var(--text-dim)" style={{ position: 'absolute', left: '10px' }} />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              title="Start Date"
              style={{
                padding: '6px 10px 6px 30px',
                borderRadius: '8px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.78rem',
              }}
            />
          </div>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            title="End Date"
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.78rem',
            }}
          />
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            onClick={onReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '6px 11px',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 600,
              color: '#f43f5e',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              marginLeft: 'auto',
            }}
          >
            <X size={13} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
