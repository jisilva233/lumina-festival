# Lumina Festival - Database Schema Documentation

**Created:** 2025-01-31
**Status:** Complete
**Database:** Supabase (PostgreSQL)

---

## Overview

The Lumina Festival database is built on PostgreSQL via Supabase and includes comprehensive support for:
- User authentication and profiles
- Event/concert lineup management
- Order and ticket purchasing
- Payment processing
- Row-level security (RLS)
- Audit logging

---

## Tables

### 1. Users Table

**Purpose:** Store user accounts and profiles

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_admin BOOLEAN DEFAULT false
)
```

**Indexes:**
- `idx_users_email` - Fast email lookups
- `idx_users_created_at` - Recent users queries

**RLS Policies:**
- Users can view their own profile
- Admins can view any profile
- Users can update their own profile

---

### 2. Events Table

**Purpose:** Store festival events and concerts

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  artist_name VARCHAR(255) NOT NULL,
  stage VARCHAR(100),
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER,
  image_url TEXT,
  ticket_price DECIMAL(10, 2) NOT NULL,
  total_tickets INTEGER NOT NULL,
  available_tickets INTEGER NOT NULL,
  genre VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
```

**Indexes:**
- `idx_events_event_date` - Timeline queries
- `idx_events_artist_name` - Artist lookups
- `idx_events_genre` - Genre filtering
- `idx_events_is_featured` - Featured events

**RLS Policies:**
- Anyone can view events
- Only admins can create/edit events

---

### 3. Orders Table

**Purpose:** Track ticket purchases

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
)
```

**Status Values:**
- `pending` - Order created, waiting for payment
- `completed` - Order fulfilled
- `cancelled` - Order was cancelled
- `refunded` - Order was refunded

**Payment Status Values:**
- `unpaid` - Awaiting payment
- `paid` - Payment received
- `failed` - Payment failed
- `refunded` - Payment refunded

**Indexes:**
- `idx_orders_user_id` - User's orders
- `idx_orders_order_number` - Order lookup
- `idx_orders_status` - Status filtering
- `idx_orders_created_at` - Recent orders

**RLS Policies:**
- Users can only view their own orders
- Users can create orders for themselves

---

### 4. Order Items Table

**Purpose:** Store individual items in an order

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
```

**Indexes:**
- `idx_order_items_order_id` - Items in order
- `idx_order_items_event_id` - Tickets per event

**RLS Policies:**
- Users can only view items from their own orders

---

### 5. Payments Table

**Purpose:** Track payment transactions

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_method VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  transaction_id VARCHAR(255),
  provider VARCHAR(100),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
)
```

**Payment Methods:**
- `credit_card` - Visa, Mastercard, Amex
- `debit_card` - Bank debit cards
- `pix` - Brazilian instant payment
- `bank_transfer` - Direct bank transfer

**Providers:**
- `stripe` - International payments
- `mercado_pago` - Latin America payments
- `local_gateway` - Custom payment gateway

**Indexes:**
- `idx_payments_order_id` - Order payments
- `idx_payments_status` - Payment filtering
- `idx_payments_transaction_id` - Transaction lookup
- `idx_payments_created_at` - Recent payments

**RLS Policies:**
- Users can only view their own payment records

---

### 6. Audit Logs Table

**Purpose:** Track all data modifications for compliance

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
```

**RLS Policies:**
- Only admins can view audit logs

---

## Row-Level Security (RLS)

All tables have RLS enabled. Key principles:

1. **Users can only see their own data** (except admins)
2. **Public data is readable by everyone** (events)
3. **Modifications are restricted to data owners**

**Example RLS Policy:**
```sql
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (user_id = auth.uid());
```

---

## Relationships

```
users
  ├─ 1:N → orders
  │         ├─ 1:N → order_items
  │         │         └─ N:1 → events
  │         └─ 1:N → payments
  └─ 1:N → audit_logs

events (reference in order_items)
```

---

## Constraints

### Primary Keys
- All tables use UUID primary keys for security and distribution

### Foreign Keys
- `orders.user_id` → `users.id` (ON DELETE CASCADE)
- `order_items.order_id` → `orders.id` (ON DELETE CASCADE)
- `order_items.event_id` → `events.id` (ON DELETE RESTRICT)
- `payments.order_id` → `orders.id` (ON DELETE CASCADE)

### Unique Constraints
- `users.email` - Email must be unique
- `orders.order_number` - Order number must be unique

---

## Indexes

**Total Indexes:** 17

**Rationale:**
- Foreign keys have automatic indexes
- Frequently queried columns (date, status) are indexed
- Composite indexes on common queries

---

## Performance Considerations

### Query Patterns

**Fast Queries (indexed):**
- `SELECT * FROM events ORDER BY event_date DESC`
- `SELECT * FROM orders WHERE user_id = $1`
- `SELECT * FROM payments WHERE status = 'pending'`

**Optimization Tips:**
1. Always filter by `user_id` for user-specific queries
2. Use `event_date` index for timeline queries
3. Cache event listings (rarely changes)
4. Use pagination for large result sets

### Scaling Strategy

1. **Current:** Single PostgreSQL instance (Supabase)
2. **Scale-up:** Read replicas for high-traffic queries
3. **Scale-out:** Partitioning by date for audit logs

---

## Migration Management

**Location:** `supabase/migrations/`

**Files:**
- `001_initial_schema.sql` - Initial schema creation

**Running Migrations:**
```bash
# Via Supabase CLI
supabase migration up

# Via custom script
psql $DB_URL < migrations/001_initial_schema.sql
```

---

## Seed Data

**Location:** `supabase/seed/seed_data.sql`

**Included:**
- 5 test users (1 admin, 4 regular)
- 10 sample events
- 3 sample orders with items
- Payment records

**Running Seeds:**
```bash
psql $DB_URL < seed/seed_data.sql
```

---

## Backup & Recovery

**Recommended Strategy:**
- Daily automated backups via Supabase
- Weekly test restores
- Transaction logs for point-in-time recovery

**Important Records:**
- Users with payment history (DO NOT DELETE)
- Orders and audit logs (REQUIRED for compliance)

---

## Security Best Practices

1. **RLS Enabled:** All tables have RLS policies
2. **JWT Authentication:** Via Supabase Auth
3. **Encryption:** Sensitive data encrypted at rest
4. **Audit Logging:** All modifications tracked
5. **Rate Limiting:** Applied at API layer

---

## Troubleshooting

### Common Issues

**Issue:** "permission denied" errors
- **Cause:** RLS policy blocking access
- **Solution:** Check user ID matches policy conditions

**Issue:** Foreign key violations
- **Cause:** Cascading deletes
- **Solution:** Check deletion order

**Issue:** Slow queries
- **Cause:** Missing indexes
- **Solution:** Review query plan, add indexes if needed

---

## Related Documents

- **Setup Guide:** `docs/database/SETUP.md`
- **API Reference:** `docs/api/DATABASE_API.md`
- **Migration Guide:** `docs/database/MIGRATIONS.md`

---

**Last Updated:** 2025-01-31
**Next Review:** 2025-03-31
