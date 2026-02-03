/**
 * Payment Service
 * Handles Stripe and Mercado Pago integration
 * Lumina Festival
 */

import {
  PaymentMethod,
  PaymentStatus,
  PaymentProvider,
  PaymentIntentRequest,
  PaymentIntentResponse,
  PaymentRequest,
  PaymentResponse,
  RefundRequest,
  RefundResponse,
} from '../types/payment';

/**
 * Payment Service Class
 */
export class PaymentService {
  private static stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
  private static mercadoPagoPublicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || '';

  /**
   * Initialize payment gateways
   */
  static async initialize(): Promise<boolean> {
    try {
      // Check Stripe availability
      if (this.stripePublicKey) {
        // Load Stripe script dynamically
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        document.head.appendChild(script);
      }

      // Check Mercado Pago availability
      if (this.mercadoPagoPublicKey) {
        // Load Mercado Pago script
        const script = document.createElement('script');
        script.src = 'https://sdk.mercadopago.com/js/v2';
        script.async = true;
        document.head.appendChild(script);
      }

      return true;
    } catch (error) {
      console.error('Payment gateway initialization error:', error);
      return false;
    }
  }

  /**
   * Create payment intent for Stripe
   */
  static async createStripePaymentIntent(
    request: PaymentIntentRequest
  ): Promise<PaymentIntentResponse> {
    try {
      const response = await fetch('/api/payments/stripe/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          id: '',
          status: PaymentStatus.FAILED,
          amount: request.amount,
          currency: request.currency,
          paymentMethod: request.paymentMethod,
          provider: PaymentProvider.STRIPE,
          error: {
            code: error.code || 'unknown',
            message: error.message || 'Failed to create payment intent',
          },
        };
      }

      const data = await response.json();
      return {
        id: data.id,
        status: PaymentStatus.PROCESSING,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: request.paymentMethod,
        provider: PaymentProvider.STRIPE,
        clientSecret: data.client_secret,
      };
    } catch (error) {
      return {
        id: '',
        status: PaymentStatus.FAILED,
        amount: request.amount,
        currency: request.currency,
        paymentMethod: request.paymentMethod,
        provider: PaymentProvider.STRIPE,
        error: {
          code: 'request_failed',
          message: error instanceof Error ? error.message : 'Request failed',
        },
      };
    }
  }

  /**
   * Create preference for Mercado Pago
   */
  static async createMercadoPagoPreference(
    request: PaymentIntentRequest
  ): Promise<PaymentIntentResponse> {
    try {
      const response = await fetch('/api/payments/mercado-pago/preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          id: '',
          status: PaymentStatus.FAILED,
          amount: request.amount,
          currency: request.currency,
          paymentMethod: request.paymentMethod,
          provider: PaymentProvider.MERCADO_PAGO,
          error: {
            code: error.code || 'unknown',
            message: error.message || 'Failed to create payment preference',
          },
        };
      }

      const data = await response.json();
      return {
        id: data.id,
        status: PaymentStatus.PENDING,
        amount: data.total_amount,
        currency: request.currency,
        paymentMethod: request.paymentMethod,
        provider: PaymentProvider.MERCADO_PAGO,
        nextStep: data.init_point, // Redirect URL
      };
    } catch (error) {
      return {
        id: '',
        status: PaymentStatus.FAILED,
        amount: request.amount,
        currency: request.currency,
        paymentMethod: request.paymentMethod,
        provider: PaymentProvider.MERCADO_PAGO,
        error: {
          code: 'request_failed',
          message: error instanceof Error ? error.message : 'Request failed',
        },
      };
    }
  }

  /**
   * Process payment (Stripe or Mercado Pago)
   */
  static async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          status: PaymentStatus.FAILED,
          amount: request.amount,
          error: {
            code: error.code || 'unknown',
            message: error.message || 'Payment processing failed',
          },
        };
      }

      const data = await response.json();
      return {
        success: data.success,
        orderId: data.order_id,
        transactionId: data.transaction_id,
        status: data.status,
        amount: data.amount,
      };
    } catch (error) {
      return {
        success: false,
        status: PaymentStatus.FAILED,
        amount: request.amount,
        error: {
          code: 'request_failed',
          message: error instanceof Error ? error.message : 'Payment processing failed',
        },
      };
    }
  }

  /**
   * Confirm payment with token
   */
  static async confirmPayment(
    paymentIntentId: string,
    paymentMethodToken: string
  ): Promise<PaymentResponse> {
    try {
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_intent_id: paymentIntentId,
          payment_method_token: paymentMethodToken,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          status: PaymentStatus.FAILED,
          amount: 0,
          error: {
            code: error.code || 'unknown',
            message: error.message || 'Payment confirmation failed',
          },
        };
      }

      const data = await response.json();
      return {
        success: data.success,
        orderId: data.order_id,
        transactionId: data.transaction_id,
        status: data.status,
        amount: data.amount,
      };
    } catch (error) {
      return {
        success: false,
        status: PaymentStatus.FAILED,
        amount: 0,
        error: {
          code: 'request_failed',
          message: error instanceof Error ? error.message : 'Payment confirmation failed',
        },
      };
    }
  }

  /**
   * Get payment status
   */
  static async getPaymentStatus(transactionId: string): Promise<PaymentStatus | null> {
    try {
      const response = await fetch(`/api/payments/status/${transactionId}`);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.status as PaymentStatus;
    } catch (error) {
      console.error('Get payment status error:', error);
      return null;
    }
  }

  /**
   * Refund payment
   */
  static async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          status: 'failed',
          amount: request.amount || 0,
          error: {
            code: error.code || 'unknown',
            message: error.message || 'Refund failed',
          },
        };
      }

      const data = await response.json();
      return {
        success: data.success,
        refundId: data.refund_id,
        status: data.status,
        amount: data.amount,
      };
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        amount: request.amount || 0,
        error: {
          code: 'request_failed',
          message: error instanceof Error ? error.message : 'Refund request failed',
        },
      };
    }
  }

  /**
   * Get order details
   */
  static async getOrder(orderId: string) {
    try {
      const response = await fetch(`/api/payments/order/${orderId}`);

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Get order error:', error);
      return null;
    }
  }

  /**
   * List user orders
   */
  static async listOrders(userId: string) {
    try {
      const response = await fetch(`/api/payments/orders?userId=${userId}`);

      if (!response.ok) {
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('List orders error:', error);
      return [];
    }
  }

  /**
   * Calculate totals
   */
  static calculateTotals(
    subtotal: number,
    taxRate: number = 0.15,
    platformFee: number = 0.03
  ) {
    const tax = subtotal * taxRate;
    const fees = subtotal * platformFee;
    const total = subtotal + tax + fees;

    return {
      subtotal,
      tax,
      fees,
      total,
    };
  }

  /**
   * Validate payment amount
   */
  static validateAmount(amount: number, currency: string = 'BRL'): boolean {
    if (amount <= 0) return false;
    if (isNaN(amount) || !isFinite(amount)) return false;

    // Minimum amount validation (e.g., R$ 1.00 = 100 cents)
    const minimumAmounts: Record<string, number> = {
      BRL: 100, // R$ 1.00
      USD: 50, // $0.50
      EUR: 50, // €0.50
    };

    const minimum = minimumAmounts[currency] || 50;
    return amount >= minimum;
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number, currency: string = 'BRL'): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
    });

    return formatter.format(amount / 100);
  }

  /**
   * Check payment gateway availability
   */
  static isStripeAvailable(): boolean {
    return !!this.stripePublicKey && !!(window as any).Stripe;
  }

  static isMercadoPagoAvailable(): boolean {
    return !!this.mercadoPagoPublicKey && !!(window as any).MercadoPago;
  }

  /**
   * Get available payment methods
   */
  static getAvailablePaymentMethods(): PaymentMethod[] {
    const methods: PaymentMethod[] = [];

    if (this.isStripeAvailable()) {
      methods.push(PaymentMethod.STRIPE_CARD);
      methods.push(PaymentMethod.STRIPE_IDEAL);
    }

    if (this.isMercadoPagoAvailable()) {
      methods.push(PaymentMethod.MERCADO_PAGO_CARD);
      methods.push(PaymentMethod.MERCADO_PAGO_PIX);
      methods.push(PaymentMethod.MERCADO_PAGO_BOLETO);
    }

    return methods;
  }
}
