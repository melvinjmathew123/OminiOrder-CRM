import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  ShoppingBag,
  User,
  MapPin,
  Check,
} from 'lucide-react';
import { createOrder } from '../services/api.js';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: () => void;
}

interface LineItemInput {
  title: string;
  variantTitle?: string;
  sku?: string;
  quantity: number;
  price: number;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [financialStatus, setFinancialStatus] = useState('pending');
  const [notes, setNotes] = useState('');

  // Shipping
  const [address1, setAddress1] = useState('100 Market Street');
  const [city, setCity] = useState('San Francisco');
  const [province, setProvince] = useState('CA');
  const [zip, setZip] = useState('94105');
  const country = 'United States';

  // Line items
  const [lineItems, setLineItems] = useState<LineItemInput[]>([
    {
      title: 'Ergonomic Desk Accessory',
      variantTitle: 'Matte Black',
      sku: 'ACC-DSK-01',
      quantity: 1,
      price: 89.0,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleAddItem = () => {
    setLineItems([
      ...lineItems,
      {
        title: '',
        variantTitle: '',
        sku: '',
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof LineItemInput, val: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: val };
    setLineItems(updated);
  };

  const subtotal = lineItems.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Customer name is required');
      return;
    }

    if (lineItems.some((it) => !it.title.trim() || it.price <= 0 || it.quantity <= 0)) {
      setErrorMessage('All line items must have a title, positive price and quantity');
      return;
    }

    try {
      setIsSubmitting(true);
      await createOrder({
        customerName,
        customerEmail: customerEmail || undefined,
        customerPhone: customerPhone || undefined,
        financialStatus,
        notes: notes || undefined,
        currency: 'USD',
        lineItems: lineItems.map((it) => ({
          title: it.title,
          variantTitle: it.variantTitle || undefined,
          sku: it.sku || undefined,
          quantity: Number(it.quantity),
          price: Number(it.price),
        })),
        shippingAddress: {
          name: customerName,
          address1,
          city,
          province,
          zip,
          country,
          phone: customerPhone || undefined,
        },
      });

      onOrderCreated();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      background: 'rgba(2, 6, 23, 0.75)',
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
          maxWidth: '720px',
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
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShoppingBag size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Create Order & Sync to Shopify
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Creates the order in Shopify Admin API and persists to PostgreSQL
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {errorMessage && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              fontSize: '0.82rem',
            }}>
              {errorMessage}
            </div>
          )}

          {/* Section: Customer Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              <User size={13} />
              <span>Customer Details</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Reed"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="jordan.reed@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="+1 555-0199"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section: Shipping Address */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              <MapPin size={13} />
              <span>Shipping Address</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.65rem' }}>
              <div>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                  }}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                  }}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="State/Prov"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                  }}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section: Line Items */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                <ShoppingBag size={13} />
                <span>Line Items ({lineItems.length})</span>
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#818cf8',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                }}
              >
                <Plus size={13} />
                <span>Add Item</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {lineItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 80px 100px 32px',
                    gap: '0.5rem',
                    alignItems: 'center',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <input
                    type="text"
                    required
                    placeholder="Product Title"
                    value={item.title}
                    onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)',
                      fontSize: '0.78rem',
                    }}
                  />

                  <input
                    type="text"
                    placeholder="Variant"
                    value={item.variantTitle}
                    onChange={(e) => handleItemChange(index, 'variantTitle', e.target.value)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)',
                      fontSize: '0.78rem',
                    }}
                  />

                  <input
                    type="text"
                    placeholder="SKU"
                    value={item.sku}
                    onChange={(e) => handleItemChange(index, 'sku', e.target.value)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)',
                      fontSize: '0.78rem',
                    }}
                  />

                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)',
                      fontSize: '0.78rem',
                      textAlign: 'center',
                    }}
                  />

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Price ($)"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)',
                      fontSize: '0.78rem',
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={lineItems.length === 1}
                    style={{
                      color: lineItems.length === 1 ? 'var(--text-dim)' : '#fb7185',
                      opacity: lineItems.length === 1 ? 0.3 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Status & Summary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Payment Status
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
                <option value="pending">Pending</option>
                <option value="paid">Paid (Capture immediately)</option>
              </select>

              <div style={{ marginTop: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Special instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                  }}
                />
              </div>
            </div>

            {/* Price Preview Card */}
            <div style={{
              padding: '1rem',
              borderRadius: '10px',
              background: 'rgba(2, 6, 23, 0.5)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Est. Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderTop: '1px dashed var(--border-subtle)',
                paddingTop: '0.5rem',
                marginTop: '0.5rem',
              }}>
                <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>Order Total:</span>
                <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '1.25rem' }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '9px 22px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#ffffff',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              <Check size={16} strokeWidth={2.5} />
              <span>{isSubmitting ? 'Syncing to Shopify...' : 'Create & Sync Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
