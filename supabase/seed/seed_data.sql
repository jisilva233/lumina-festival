-- ============================================
-- Lumina Festival - Seed Data
-- ============================================
-- Test data for development and testing
-- Created: 2025-01-31

-- ============================================
-- Sample Users
-- ============================================
INSERT INTO users (email, full_name, phone, is_admin) VALUES
  ('admin@luminafestival.com', 'Admin User', '+5585987654321', true),
  ('john@example.com', 'John Doe', '+5585912345678', false),
  ('maria@example.com', 'Maria Silva', '+5585998765432', false),
  ('carlos@example.com', 'Carlos Santos', '+5585987654321', false),
  ('ana@example.com', 'Ana Costa', '+5585912345678', false)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Sample Events (Festival Lineup)
-- ============================================
INSERT INTO events (
  name, description, artist_name, stage, event_date,
  duration_minutes, ticket_price, total_tickets, available_tickets,
  genre, is_featured
) VALUES
  (
    'Opening Ceremony',
    'Spectacular opening show with pyrotechnics and live orchestra',
    'Various Artists',
    'Main Stage',
    '2025-03-01 18:00:00+00',
    90,
    150.00,
    5000,
    5000,
    'Live Performance',
    true
  ),
  (
    'Cosmic Dreams',
    'Electronic masterpiece from world-renowned DJ',
    'Alan Walker',
    'Main Stage',
    '2025-03-01 20:00:00+00',
    120,
    200.00,
    8000,
    8000,
    'Electronic',
    true
  ),
  (
    'Samba Night',
    'Traditional Brazilian samba with modern twist',
    'Anitta',
    'Secondary Stage',
    '2025-03-01 21:30:00+00',
    90,
    120.00,
    4000,
    4000,
    'Samba/Pop',
    false
  ),
  (
    'Indie Dreams',
    'Indie rock collective performance',
    'The Neighbourhood',
    'Indie Corner',
    '2025-03-02 19:00:00+00',
    100,
    100.00,
    3000,
    3000,
    'Indie Rock',
    false
  ),
  (
    'Jazz & Vibes',
    'Smooth jazz and fusion performance',
    'Kamasi Washington',
    'Jazz Stage',
    '2025-03-02 20:30:00+00',
    110,
    110.00,
    2500,
    2500,
    'Jazz',
    false
  ),
  (
    'Hip-Hop Takeover',
    'International hip-hop stars collaboration',
    'Kendrick Lamar ft. Drake',
    'Main Stage',
    '2025-03-02 22:00:00+00',
    120,
    250.00,
    10000,
    10000,
    'Hip-Hop/Rap',
    true
  ),
  (
    'Classical Evening',
    'Symphony orchestra performance',
    'London Symphony Orchestra',
    'Amphitheater',
    '2025-03-03 19:00:00+00',
    150,
    130.00,
    3500,
    3500,
    'Classical',
    false
  ),
  (
    'Reggae Sunset',
    'Reggae legends bringing island vibes',
    'Chronixx',
    'Beach Stage',
    '2025-03-03 20:30:00+00',
    100,
    90.00,
    2000,
    2000,
    'Reggae',
    false
  ),
  (
    'Electronic Odyssey',
    'Four-hour electronic music journey',
    'Deadmau5',
    'Main Stage',
    '2025-03-03 21:00:00+00',
    240,
    300.00,
    12000,
    12000,
    'Electronic',
    true
  ),
  (
    'Closing Ceremony',
    'Grand finale with fireworks and tribute performances',
    'Various Artists',
    'Main Stage',
    '2025-03-04 22:00:00+00',
    120,
    180.00,
    6000,
    6000,
    'Live Performance',
    true
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- Sample Orders
-- ============================================
INSERT INTO orders (user_id, order_number, total_amount, status, payment_status, completed_at)
SELECT
  (SELECT id FROM users WHERE email = 'john@example.com'),
  'ORD-2025-001',
  350.00,
  'completed',
  'paid',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM orders WHERE order_number = 'ORD-2025-001'
);

INSERT INTO orders (user_id, order_number, total_amount, status, payment_status)
SELECT
  (SELECT id FROM users WHERE email = 'maria@example.com'),
  'ORD-2025-002',
  200.00,
  'pending',
  'unpaid'
WHERE NOT EXISTS (
  SELECT 1 FROM orders WHERE order_number = 'ORD-2025-002'
);

INSERT INTO orders (user_id, order_number, total_amount, status, payment_status, completed_at)
SELECT
  (SELECT id FROM users WHERE email = 'carlos@example.com'),
  'ORD-2025-003',
  600.00,
  'completed',
  'paid',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM orders WHERE order_number = 'ORD-2025-003'
);

-- ============================================
-- Sample Order Items
-- ============================================
INSERT INTO order_items (order_id, event_id, quantity, unit_price, subtotal)
SELECT
  o.id,
  e.id,
  2,
  e.ticket_price,
  e.ticket_price * 2
FROM orders o
CROSS JOIN events e
WHERE o.order_number = 'ORD-2025-001'
  AND e.artist_name = 'Alan Walker'
  AND NOT EXISTS (
    SELECT 1 FROM order_items
    WHERE order_id = o.id AND event_id = e.id
  );

INSERT INTO order_items (order_id, event_id, quantity, unit_price, subtotal)
SELECT
  o.id,
  e.id,
  1,
  e.ticket_price,
  e.ticket_price
FROM orders o
CROSS JOIN events e
WHERE o.order_number = 'ORD-2025-001'
  AND e.artist_name = 'Anitta'
  AND NOT EXISTS (
    SELECT 1 FROM order_items
    WHERE order_id = o.id AND event_id = e.id
  );

INSERT INTO order_items (order_id, event_id, quantity, unit_price, subtotal)
SELECT
  o.id,
  e.id,
  1,
  e.ticket_price,
  e.ticket_price
FROM orders o
CROSS JOIN events e
WHERE o.order_number = 'ORD-2025-002'
  AND e.artist_name = 'Kamasi Washington'
  AND NOT EXISTS (
    SELECT 1 FROM order_items
    WHERE order_id = o.id AND event_id = e.id
  );

INSERT INTO order_items (order_id, event_id, quantity, unit_price, subtotal)
SELECT
  o.id,
  e.id,
  3,
  e.ticket_price,
  e.ticket_price * 3
FROM orders o
CROSS JOIN events e
WHERE o.order_number = 'ORD-2025-003'
  AND e.artist_name = 'Kendrick Lamar ft. Drake'
  AND NOT EXISTS (
    SELECT 1 FROM order_items
    WHERE order_id = o.id AND event_id = e.id
  );

-- ============================================
-- Sample Payments
-- ============================================
INSERT INTO payments (order_id, payment_method, amount, status, transaction_id, provider, completed_at)
SELECT
  o.id,
  'credit_card',
  o.total_amount,
  'completed',
  'TXN-' || o.order_number,
  'stripe',
  NOW()
FROM orders o
WHERE o.payment_status = 'paid'
  AND NOT EXISTS (
    SELECT 1 FROM payments WHERE order_id = o.id
  );

INSERT INTO payments (order_id, payment_method, amount, status, transaction_id, provider)
SELECT
  o.id,
  'pix',
  o.total_amount,
  'pending',
  NULL,
  'mercado_pago'
FROM orders o
WHERE o.payment_status = 'unpaid'
  AND NOT EXISTS (
    SELECT 1 FROM payments WHERE order_id = o.id
  );

-- ============================================
-- Audit Log Entry
-- ============================================
INSERT INTO audit_logs (action, table_name) VALUES
  ('seed_data_loaded', 'all_tables');
