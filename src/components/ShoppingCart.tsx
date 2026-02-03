/**
 * Shopping Cart Component
 * Lumina Festival
 */

import React, { useState, useEffect } from 'react';
import { CartItem } from '../types/payment';
import { PaymentService } from '../services/paymentService';

interface ShoppingCartProps {
  items: CartItem[];
  onCheckout?: (total: number) => void;
  onRemoveItem?: (eventId: string) => void;
  onUpdateQuantity?: (eventId: string, quantity: number) => void;
}

/**
 * Shopping Cart Component
 */
export const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  onCheckout,
  onRemoveItem,
  onUpdateQuantity,
}) => {
  const [subtotal, setSubtotal] = useState(0);
  const [totals, setTotals] = useState({ subtotal: 0, tax: 0, fees: 0, total: 0 });

  /**
   * Calculate totals when items change
   */
  useEffect(() => {
    const itemSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    setSubtotal(itemSubtotal);

    const calculated = PaymentService.calculateTotals(itemSubtotal);
    setTotals(calculated);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="shopping-cart empty">
        <div className="empty-state">
          <h3>🎵 Your cart is empty</h3>
          <p>Select events from the lineup to add tickets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      <div className="cart-header">
        <h2>Shopping Cart ({items.length} event{items.length !== 1 ? 's' : ''})</h2>
      </div>

      <div className="cart-items">
        {items.map((item) => (
          <div key={item.eventId} className="cart-item">
            <div className="item-details">
              <h4>{item.eventName}</h4>
              {item.artist && <p className="artist">{item.artist}</p>}
              {item.eventDate && <p className="date">{new Date(item.eventDate).toLocaleDateString()}</p>}
            </div>

            <div className="item-quantity">
              <button
                onClick={() => onUpdateQuantity?.(item.eventId, Math.max(0, item.quantity - 1))}
                disabled={item.quantity <= 1}
              >
                −
              </button>
              <input type="number" value={item.quantity} readOnly />
              <button onClick={() => onUpdateQuantity?.(item.eventId, item.quantity + 1)}>+</button>
            </div>

            <div className="item-price">
              <p className="price">{PaymentService.formatCurrency(item.subtotal)}</p>
              <small>{PaymentService.formatCurrency(item.unitPrice)} each</small>
            </div>

            <button
              className="remove-btn"
              onClick={() => onRemoveItem?.(item.eventId)}
              title="Remove from cart"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>{PaymentService.formatCurrency(totals.subtotal)}</span>
        </div>

        <div className="summary-row">
          <span>Tax (15%):</span>
          <span>{PaymentService.formatCurrency(totals.tax)}</span>
        </div>

        <div className="summary-row">
          <span>Platform Fee (3%):</span>
          <span>{PaymentService.formatCurrency(totals.fees)}</span>
        </div>

        <div className="summary-row total">
          <span>Total:</span>
          <span>{PaymentService.formatCurrency(totals.total)}</span>
        </div>
      </div>

      <button
        className="checkout-btn"
        onClick={() => onCheckout?.(totals.total)}
        disabled={items.length === 0}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default ShoppingCart;
