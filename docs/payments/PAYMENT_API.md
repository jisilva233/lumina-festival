# Payment Processing API Documentation

**API Version:** 1.0.0
**Last Updated:** 2025-01-31
**Status:** Complete

---

## Overview

Complete payment processing system supporting Stripe and Mercado Pago. Handles checkout, payment intent creation, order creation, and webhook processing.

---

## Payment Methods Supported

### Stripe
- Credit/Debit Cards (Visa, Mastercard, Amex)
- iDEAL (European banks)

### Mercado Pago
- Credit/Debit Cards
- PIX (Instant payment - Brazil)
- Boleto (Bank transfer - Brazil)

---

## Endpoints

### 1. Create Payment Intent (Stripe)

**Endpoint:** `POST /api/payments/stripe/intent`

**Request:**
```json
{
  "amount": 55000,
  "currency": "BRL",
  "paymentMethod": "stripe_card",
  "description": "Lumina Festival Tickets",
  "receiptEmail": "user@example.com",
  "metadata": {
    "orderId": "order-123",
    "eventIds": ["event-1", "event-2"]
  }
}
```

**Response (200):**
```json
{
  "id": "pi_1234567890",
  "status": "requires_payment_method",
  "amount": 55000,
  "currency": "BRL",
  "client_secret": "pi_1234567890_secret_abcdefg",
  "paymentMethod": "stripe_card"
}
```

---

### 2. Create Payment Preference (Mercado Pago)

**Endpoint:** `POST /api/payments/mercado-pago/preference`

**Request:**
```json
{
  "amount": 55000,
  "currency": "BRL",
  "paymentMethod": "mercado_pago_pix",
  "description": "Lumina Festival Tickets",
  "customerEmail": "user@example.com",
  "metadata": {
    "orderId": "order-123"
  }
}
```

**Response (200):**
```json
{
  "id": "preference-id-123",
  "status": "pending",
  "total_amount": 55000,
  "init_point": "https://www.mercadopago.com.br/checkout/v1/redirect",
  "paymentMethod": "mercado_pago_pix"
}
```

---

### 3. Process Payment

**Endpoint:** `POST /api/payments/process`

**Request:**
```json
{
  "checkoutSessionId": "session-123",
  "paymentMethod": "stripe_card",
  "amount": 55000,
  "currency": "BRL",
  "items": [
    {
      "eventId": "event-1",
      "eventName": "Alan Walker",
      "quantity": 2,
      "unitPrice": 20000,
      "subtotal": 40000
    }
  ],
  "customerInfo": {
    "email": "user@example.com",
    "fullName": "John Doe",
    "phone": "+5585987654321"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "orderId": "order-uuid",
  "transactionId": "txn_1234567890",
  "status": "completed",
  "amount": 55000
}
```

**Errors:**
- `400` - Invalid input
- `422` - Invalid amount
- `402` - Payment declined
- `429` - Rate limited
- `500` - Server error

---

### 4. Confirm Payment

**Endpoint:** `POST /api/payments/confirm`

**Request:**
```json
{
  "payment_intent_id": "pi_1234567890",
  "payment_method_token": "pm_1234567890"
}
```

**Response (200):**
```json
{
  "success": true,
  "orderId": "order-uuid",
  "transactionId": "txn_1234567890",
  "status": "completed",
  "amount": 55000
}
```

---

### 5. Get Payment Status

**Endpoint:** `GET /api/payments/status/:transactionId`

**Response (200):**
```json
{
  "status": "completed",
  "amount": 55000,
  "currency": "BRL",
  "createdAt": "2025-01-31T12:00:00Z",
  "completedAt": "2025-01-31T12:05:00Z"
}
```

---

### 6. Refund Payment

**Endpoint:** `POST /api/payments/refund`

**Request:**
```json
{
  "orderId": "order-uuid",
  "transactionId": "txn_1234567890",
  "amount": 55000,
  "reason": "Customer request"
}
```

**Response (200):**
```json
{
  "success": true,
  "refundId": "ref_1234567890",
  "status": "completed",
  "amount": 55000
}
```

---

### 7. Get Order

**Endpoint:** `GET /api/payments/order/:orderId`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": "order-uuid",
  "orderNumber": "ORD-2025-001",
  "items": [
    {
      "eventId": "event-1",
      "eventName": "Alan Walker",
      "quantity": 2,
      "unitPrice": 20000
    }
  ],
  "totalAmount": 55000,
  "status": "completed",
  "paymentStatus": "paid",
  "paymentMethod": "stripe_card",
  "transactionId": "txn_1234567890",
  "createdAt": "2025-01-31T12:00:00Z"
}
```

---

### 8. List Orders

**Endpoint:** `GET /api/payments/orders`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `limit` (default: 20)
- `offset` (default: 0)
- `status` (pending, completed, cancelled)

**Response (200):**
```json
{
  "orders": [
    {
      "id": "order-uuid",
      "orderNumber": "ORD-2025-001",
      "totalAmount": 55000,
      "status": "completed",
      "createdAt": "2025-01-31T12:00:00Z"
    }
  ],
  "total": 5,
  "limit": 20,
  "offset": 0
}
```

---

## Webhooks

### Stripe Webhook

**Endpoint:** `POST /api/webhooks/stripe`

**Events Handled:**
- `payment_intent.succeeded` - Payment completed
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Refund processed

**Signature Verification:**
```
Stripe-Signature: t=timestamp,v1=signature
```

---

### Mercado Pago Webhook

**Endpoint:** `POST /api/webhooks/mercado-pago`

**Events Handled:**
- `payment` - Payment status updated

**Verification:**
- Verify webhook ID exists
- Validate request origin

---

## Cart Management

### Cart Item
```typescript
{
  eventId: string;
  eventName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
```

### Cart Operations
- Add item to cart (local)
- Remove item from cart (local)
- Update quantity (local)
- Clear cart (local)

---

## Pricing Calculation

```
Subtotal = Sum of all item subtotals
Tax = Subtotal × 15%
Platform Fee = Subtotal × 3%
Total = Subtotal + Tax + Platform Fee
```

---

## Payment Flow

```
1. User selects events
   ↓
2. View shopping cart
   ↓
3. Proceed to checkout
   ↓
4. Enter customer info
   ↓
5. Select payment method
   ↓
6. Create payment intent
   ↓
7. Show payment form (Stripe/MP)
   ↓
8. Complete payment
   ↓
9. Webhook: Payment confirmed
   ↓
10. Create order in database
   ↓
11. Send confirmation email
```

---

## Security

### PCI DSS Compliance
- No card data stored locally
- Stripe/Mercado Pago handles PCI
- Tokens only transmitted

### Webhook Security
- Signature verification required
- HTTPS only
- IP whitelisting (optional)

### Rate Limiting
- 100 requests/minute per user
- 1000 requests/minute per IP

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `invalid_amount` | 422 | Amount invalid or below minimum |
| `payment_declined` | 402 | Card declined |
| `invalid_payment_method` | 400 | Unknown payment method |
| `invalid_currency` | 400 | Unsupported currency |
| `insufficient_funds` | 402 | Insufficient balance |
| `card_expired` | 402 | Card expired |
| `lost_card` | 402 | Card reported lost |
| `stolen_card` | 402 | Card reported stolen |
| `processing_error` | 500 | Gateway processing error |
| `rate_limited` | 429 | Too many requests |

---

## Currency Support

- `BRL` - Brazilian Real
- `USD` - US Dollar
- `EUR` - Euro

---

## Testing

### Test Cards (Stripe)
- Visa: `4242 4242 4242 4242`
- Mastercard: `5555 5555 5555 4444`
- Amex: `3782 822463 10005`

### Test PIX (Mercado Pago)
- Use test account for simulations

---

## Environment Variables

```bash
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

VITE_MERCADO_PAGO_PUBLIC_KEY=APP_...
MERCADO_PAGO_ACCESS_TOKEN=APP_...

WEBHOOK_STRIPE_SECRET=whsec_...
WEBHOOK_MERCADO_PAGO_SECRET=...
```

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| Create intent | 10/min | Per user |
| Process payment | 5/min | Per user |
| Refund | 2/min | Per user |
| List orders | 30/min | Per user |

---

## Examples

### JavaScript/TypeScript
```typescript
import { PaymentService } from '../services/paymentService';

// Create Stripe intent
const intent = await PaymentService.createStripePaymentIntent({
  amount: 55000,
  currency: 'BRL',
  paymentMethod: 'stripe_card',
  description: 'Festival tickets'
});

// Process payment
const response = await PaymentService.processPayment({
  checkoutSessionId: 'session-123',
  paymentMethod: 'stripe_card',
  amount: 55000,
  currency: 'BRL',
  items: [...],
  customerInfo: {...}
});
```

---

## Troubleshooting

### "Payment declined"
- Check card validity
- Verify CVV
- Check expiration date
- Contact card issuer

### "Webhook not received"
- Verify endpoint URL
- Check webhook secret
- Verify signature
- Review logs

### "Order not created after payment"
- Check webhook processing
- Verify database connection
- Review error logs

---

**Last Updated:** 2025-01-31
**Status:** COMPLETE
