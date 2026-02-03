/**
 * Payment Types & Interfaces
 * Lumina Festival
 */

/**
 * Payment Method Types
 */
export enum PaymentMethod {
  STRIPE_CARD = 'stripe_card',
  STRIPE_IDEAL = 'stripe_ideal',
  MERCADO_PAGO_CARD = 'mercado_pago_card',
  MERCADO_PAGO_PIX = 'mercado_pago_pix',
  MERCADO_PAGO_BOLETO = 'mercado_pago_boleto',
  BANK_TRANSFER = 'bank_transfer',
}

/**
 * Payment Status
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

/**
 * Payment Provider
 */
export enum PaymentProvider {
  STRIPE = 'stripe',
  MERCADO_PAGO = 'mercado_pago',
  LOCAL = 'local_gateway',
}

/**
 * Cart Item
 */
export interface CartItem {
  eventId: string;
  eventName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  artist?: string;
  eventDate?: string;
}

/**
 * Shopping Cart
 */
export interface ShoppingCart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  fees: number;
  total: number;
  itemCount: number;
  lastUpdated: Date;
}

/**
 * Checkout Session
 */
export interface CheckoutSession {
  id: string;
  userId: string;
  cart: ShoppingCart;
  paymentIntentId?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
  expiresAt: Date;
}

/**
 * Payment Intent Request
 */
export interface PaymentIntentRequest {
  amount: number; // in cents
  currency: string; // 'USD', 'BRL', etc
  paymentMethod: PaymentMethod;
  description: string;
  metadata: Record<string, unknown>;
  receiptEmail?: string;
  customerEmail?: string;
}

/**
 * Payment Intent Response
 */
export interface PaymentIntentResponse {
  id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  provider: PaymentProvider;
  clientSecret?: string; // For Stripe
  nextStep?: string; // For Mercado Pago
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Payment Request
 */
export interface PaymentRequest {
  checkoutSessionId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: string;
  items: CartItem[];
  customerInfo: {
    email: string;
    fullName: string;
    phone?: string;
  };
  metadata?: Record<string, unknown>;
}

/**
 * Payment Response
 */
export interface PaymentResponse {
  success: boolean;
  orderId?: string;
  transactionId?: string;
  status: PaymentStatus;
  amount: number;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Order (from Payment Success)
 */
export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'failed' | 'refunded';
  paymentMethod: PaymentMethod;
  transactionId: string;
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Webhook Event (Stripe)
 */
export interface StripeWebhookEvent {
  id: string;
  type: string;
  created: number;
  data: {
    object: Record<string, unknown>;
    previous_attributes?: Record<string, unknown>;
  };
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: string;
    idempotency_key: string;
  };
}

/**
 * Webhook Event (Mercado Pago)
 */
export interface MercadoPagoWebhookEvent {
  id: string;
  type: string;
  action: string;
  data: {
    id: string;
    status?: string;
  };
  datetime: string;
}

/**
 * Webhook Payload
 */
export interface WebhookPayload {
  provider: PaymentProvider;
  event: StripeWebhookEvent | MercadoPagoWebhookEvent;
  signature: string;
}

/**
 * Refund Request
 */
export interface RefundRequest {
  orderId: string;
  transactionId: string;
  amount?: number;
  reason: string;
}

/**
 * Refund Response
 */
export interface RefundResponse {
  success: boolean;
  refundId?: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Payment Configuration
 */
export interface PaymentConfig {
  stripe?: {
    publicKey: string;
    secretKey: string;
  };
  mercadoPago?: {
    accessToken: string;
    publicKey: string;
  };
  webhookSecrets?: {
    stripe: string;
    mercadoPago: string;
  };
  currency: string;
  taxRate: number;
  platformFee: number; // percentage
}

/**
 * Payment Context State
 */
export interface PaymentContextState {
  cart: ShoppingCart;
  checkoutSession: CheckoutSession | null;
  paymentStatus: PaymentStatus | null;
  loading: boolean;
  error: { code: string; message: string } | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (eventId: string) => void;
  updateCartItem: (eventId: string, quantity: number) => void;
  clearCart: () => void;
  createCheckoutSession: () => Promise<CheckoutSession | null>;
  processPayment: (request: PaymentRequest) => Promise<PaymentResponse>;
  getPaymentIntent: (amount: number, method: PaymentMethod) => Promise<PaymentIntentResponse>;
  refund: (request: RefundRequest) => Promise<RefundResponse>;
}

/**
 * Payment Endpoints
 */
export const PAYMENT_ENDPOINTS = {
  CREATE_PAYMENT_INTENT: '/api/payments/intent',
  PROCESS_PAYMENT: '/api/payments/process',
  CONFIRM_PAYMENT: '/api/payments/confirm',
  GET_ORDER: '/api/payments/order/:id',
  LIST_ORDERS: '/api/payments/orders',
  REFUND: '/api/payments/refund',
  WEBHOOK_STRIPE: '/api/webhooks/stripe',
  WEBHOOK_MERCADO_PAGO: '/api/webhooks/mercado-pago',
} as const;

/**
 * Currency Configuration
 */
export const CURRENCY_CONFIG = {
  BRL: {
    symbol: 'R$',
    decimal: ',',
    thousand: '.',
    decimals: 2,
  },
  USD: {
    symbol: '$',
    decimal: '.',
    thousand: ',',
    decimals: 2,
  },
  EUR: {
    symbol: '€',
    decimal: ',',
    thousand: '.',
    decimals: 2,
  },
} as const;
