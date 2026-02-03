/**
 * Checkout Form Component
 * Lumina Festival
 */

import React, { useState, useEffect } from 'react';
import { CartItem, PaymentMethod, PaymentRequest } from '../types/payment';
import { PaymentService } from '../services/paymentService';

interface CheckoutFormProps {
  items: CartItem[];
  total: number;
  onPaymentSubmit?: (request: PaymentRequest) => void;
  onCancel?: () => void;
}

/**
 * Checkout Form Component
 */
export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  items,
  total,
  onPaymentSubmit,
  onCancel,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableMethods, setAvailableMethods] = useState<PaymentMethod[]>([]);

  /**
   * Get available payment methods on mount
   */
  useEffect(() => {
    const methods = PaymentService.getAvailablePaymentMethods();
    setAvailableMethods(methods);
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate inputs
      if (!fullName || !email || !paymentMethod) {
        throw new Error('Please fill in all required fields');
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (!PaymentService.validateAmount(total)) {
        throw new Error('Invalid order amount');
      }

      // Create payment request
      const request: PaymentRequest = {
        checkoutSessionId: `session_${Date.now()}`,
        paymentMethod: paymentMethod as PaymentMethod,
        amount: total,
        currency: 'BRL',
        items,
        customerInfo: {
          email,
          fullName,
          phone: phone || undefined,
        },
      };

      // Submit payment
      onPaymentSubmit?.(request);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Checkout failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get payment method label
   */
  const getMethodLabel = (method: PaymentMethod): string => {
    switch (method) {
      case PaymentMethod.STRIPE_CARD:
        return 'Credit/Debit Card (Stripe)';
      case PaymentMethod.STRIPE_IDEAL:
        return 'iDEAL (Stripe)';
      case PaymentMethod.MERCADO_PAGO_CARD:
        return 'Credit/Debit Card (Mercado Pago)';
      case PaymentMethod.MERCADO_PAGO_PIX:
        return 'PIX (Instant Transfer)';
      case PaymentMethod.MERCADO_PAGO_BOLETO:
        return 'Boleto (Bank Transfer)';
      default:
        return method;
    }
  };

  return (
    <div className="checkout-form-container">
      <div className="checkout-form">
        <h2>Checkout</h2>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Customer Information */}
          <fieldset>
            <legend>Personal Information</legend>

            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input
                id="phone"
                type="tel"
                placeholder="+55 85 98765-4321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>
          </fieldset>

          {/* Order Summary */}
          <fieldset>
            <legend>Order Summary</legend>

            <div className="order-summary">
              <div className="summary-items">
                {items.map((item) => (
                  <div key={item.eventId} className="summary-item">
                    <span>{item.eventName}</span>
                    <span>
                      {item.quantity}x {PaymentService.formatCurrency(item.unitPrice)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-total">
                <span>Total:</span>
                <span className="amount">{PaymentService.formatCurrency(total)}</span>
              </div>
            </div>
          </fieldset>

          {/* Payment Method Selection */}
          {availableMethods.length > 0 && (
            <fieldset>
              <legend>Payment Method *</legend>

              <div className="payment-methods">
                {availableMethods.map((method) => (
                  <label key={method} className="payment-method-option">
                    <input
                      type="radio"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      disabled={loading}
                      required
                    />
                    <span className="method-label">{getMethodLabel(method)}</span>
                  </label>
                ))}
              </div>

              {paymentMethod === PaymentMethod.MERCADO_PAGO_PIX && (
                <div className="method-info">
                  <p>💡 PIX payments are instant! You'll receive a QR code to scan.</p>
                </div>
              )}

              {paymentMethod === PaymentMethod.MERCADO_PAGO_BOLETO && (
                <div className="method-info">
                  <p>📋 Boleto payments process within 1-2 business days.</p>
                </div>
              )}
            </fieldset>
          )}

          {availableMethods.length === 0 && (
            <div className="form-error">
              ⚠️ No payment methods available. Please contact support.
            </div>
          )}

          {/* Submit Buttons */}
          <div className="form-actions">
            <button type="button" onClick={onCancel} disabled={loading} className="cancel-btn">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !paymentMethod || availableMethods.length === 0}
              className="submit-btn"
            >
              {loading ? 'Processing...' : `Pay ${PaymentService.formatCurrency(total)}`}
            </button>
          </div>
        </form>

        {/* Trust Badges */}
        <div className="trust-badges">
          <p>🔒 Secure payment processing by Stripe & Mercado Pago</p>
          <p>✅ Your information is protected with industry-standard encryption</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
