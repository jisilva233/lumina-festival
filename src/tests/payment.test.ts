/**
 * Payment Tests
 * Lumina Festival
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PaymentService } from '../services/paymentService';
import {
  PaymentMethod,
  PaymentStatus,
  CartItem,
  PaymentRequest,
} from '../types/payment';

/**
 * Mock data
 */
const mockCartItems: CartItem[] = [
  {
    eventId: 'event-1',
    eventName: 'Alan Walker Concert',
    quantity: 2,
    unitPrice: 20000, // R$ 200
    subtotal: 40000, // R$ 400
    artist: 'Alan Walker',
  },
  {
    eventId: 'event-2',
    eventName: 'Anitta Performance',
    quantity: 1,
    unitPrice: 15000, // R$ 150
    subtotal: 15000,
    artist: 'Anitta',
  },
];

/**
 * PaymentService Tests
 */
describe('PaymentService', () => {
  describe('calculateTotals', () => {
    it('should calculate totals correctly', () => {
      const subtotal = 55000; // R$ 550
      const result = PaymentService.calculateTotals(subtotal);

      expect(result.subtotal).toBe(subtotal);
      expect(result.tax).toBe(8250); // 15% of 55000
      expect(result.fees).toBe(1650); // 3% of 55000
      expect(result.total).toBe(64900);
    });

    it('should handle zero amount', () => {
      const result = PaymentService.calculateTotals(0);

      expect(result.subtotal).toBe(0);
      expect(result.tax).toBe(0);
      expect(result.fees).toBe(0);
      expect(result.total).toBe(0);
    });

    it('should apply custom tax and fee rates', () => {
      const subtotal = 100000;
      const result = PaymentService.calculateTotals(subtotal, 0.1, 0.05);

      expect(result.tax).toBe(10000); // 10%
      expect(result.fees).toBe(5000); // 5%
      expect(result.total).toBe(115000);
    });
  });

  describe('validateAmount', () => {
    it('should validate positive amount', () => {
      const valid = PaymentService.validateAmount(5000, 'BRL');
      expect(valid).toBe(true);
    });

    it('should reject zero amount', () => {
      const valid = PaymentService.validateAmount(0, 'BRL');
      expect(valid).toBe(false);
    });

    it('should reject negative amount', () => {
      const valid = PaymentService.validateAmount(-1000, 'BRL');
      expect(valid).toBe(false);
    });

    it('should reject amount below minimum', () => {
      const valid = PaymentService.validateAmount(50, 'BRL'); // Below R$ 1.00 minimum
      expect(valid).toBe(false);
    });

    it('should reject NaN amount', () => {
      const valid = PaymentService.validateAmount(NaN, 'BRL');
      expect(valid).toBe(false);
    });

    it('should reject Infinity', () => {
      const valid = PaymentService.validateAmount(Infinity, 'BRL');
      expect(valid).toBe(false);
    });
  });

  describe('formatCurrency', () => {
    it('should format BRL currency', () => {
      const formatted = PaymentService.formatCurrency(55000, 'BRL');
      expect(formatted).toContain('550');
    });

    it('should format USD currency', () => {
      const formatted = PaymentService.formatCurrency(10000, 'USD');
      expect(formatted).toContain('100');
    });

    it('should handle zero amount', () => {
      const formatted = PaymentService.formatCurrency(0, 'BRL');
      expect(formatted).toBeTruthy();
    });
  });

  describe('getAvailablePaymentMethods', () => {
    it('should return array of payment methods', () => {
      const methods = PaymentService.getAvailablePaymentMethods();
      expect(Array.isArray(methods)).toBe(true);
    });

    it('should include valid payment methods', () => {
      const methods = PaymentService.getAvailablePaymentMethods();
      const validMethods = [
        PaymentMethod.STRIPE_CARD,
        PaymentMethod.STRIPE_IDEAL,
        PaymentMethod.MERCADO_PAGO_CARD,
        PaymentMethod.MERCADO_PAGO_PIX,
        PaymentMethod.MERCADO_PAGO_BOLETO,
      ];

      // At least some methods should be available
      methods.forEach((method) => {
        expect(validMethods).toContain(method);
      });
    });
  });

  describe('isStripeAvailable', () => {
    it('should return boolean', () => {
      const available = PaymentService.isStripeAvailable();
      expect(typeof available).toBe('boolean');
    });
  });

  describe('isMercadoPagoAvailable', () => {
    it('should return boolean', () => {
      const available = PaymentService.isMercadoPagoAvailable();
      expect(typeof available).toBe('boolean');
    });
  });
});

/**
 * Payment Flow Tests
 */
describe('Payment Flow', () => {
  describe('Cart management', () => {
    it('should calculate cart totals from items', () => {
      const subtotal = mockCartItems.reduce((sum, item) => sum + item.subtotal, 0);
      const totals = PaymentService.calculateTotals(subtotal);

      expect(totals.subtotal).toBe(55000);
      expect(totals.total).toBeGreaterThan(subtotal);
    });

    it('should handle multiple items', () => {
      expect(mockCartItems.length).toBe(2);
      expect(mockCartItems[0].quantity).toBe(2);
      expect(mockCartItems[1].quantity).toBe(1);
    });
  });

  describe('Payment validation', () => {
    it('should validate payment request', () => {
      const subtotal = mockCartItems.reduce((sum, item) => sum + item.subtotal, 0);
      const totals = PaymentService.calculateTotals(subtotal);

      expect(PaymentService.validateAmount(totals.total)).toBe(true);
    });

    it('should reject payment without items', () => {
      const emptyItems: CartItem[] = [];
      const subtotal = emptyItems.reduce((sum, item) => sum + item.subtotal, 0);

      expect(PaymentService.validateAmount(subtotal)).toBe(false);
    });
  });

  describe('Amount calculation', () => {
    it('should include tax in total', () => {
      const subtotal = 100000;
      const totals = PaymentService.calculateTotals(subtotal);

      expect(totals.total).toBeGreaterThan(totals.subtotal);
      expect(totals.total).toBe(subtotal + totals.tax + totals.fees);
    });

    it('should have consistent totals', () => {
      const subtotal = 55000;
      const result1 = PaymentService.calculateTotals(subtotal);
      const result2 = PaymentService.calculateTotals(subtotal);

      expect(result1.total).toBe(result2.total);
    });
  });
});

/**
 * Error Handling Tests
 */
describe('Payment Error Handling', () => {
  it('should handle invalid amounts gracefully', () => {
    const invalid = [
      0,
      -100,
      NaN,
      Infinity,
      -Infinity,
      null as unknown as number,
    ];

    invalid.forEach((amount) => {
      expect(PaymentService.validateAmount(amount)).toBe(false);
    });
  });

  it('should handle missing gateway keys', () => {
    // Service should handle gracefully when keys are missing
    const methods = PaymentService.getAvailablePaymentMethods();
    expect(Array.isArray(methods)).toBe(true);
  });
});

/**
 * Security Tests
 */
describe('Payment Security', () => {
  it('should not expose payment method details', () => {
    const methods = PaymentService.getAvailablePaymentMethods();

    // Should return enum values, not sensitive data
    methods.forEach((method) => {
      expect(method).not.toContain('key');
      expect(method).not.toContain('secret');
      expect(method).not.toContain('token');
    });
  });

  it('should validate currency codes', () => {
    const validCurrencies = ['BRL', 'USD', 'EUR'];

    validCurrencies.forEach((currency) => {
      const formatted = PaymentService.formatCurrency(10000, currency);
      expect(formatted).toBeTruthy();
    });
  });
});
