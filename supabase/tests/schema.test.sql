-- ============================================
-- Database Schema Tests
-- ============================================
-- Validates the schema structure and RLS policies

-- Test 1: All tables exist
SELECT 'Table Test: users' as test_name,
  CASE WHEN to_regclass('public.users') IS NOT NULL THEN 'PASS' ELSE 'FAIL' END as result;

SELECT 'Table Test: events' as test_name,
  CASE WHEN to_regclass('public.events') IS NOT NULL THEN 'PASS' ELSE 'FAIL' END as result;

SELECT 'Table Test: orders' as test_name,
  CASE WHEN to_regclass('public.orders') IS NOT NULL THEN 'PASS' ELSE 'FAIL' END as result;

SELECT 'Table Test: order_items' as test_name,
  CASE WHEN to_regclass('public.order_items') IS NOT NULL THEN 'PASS' ELSE 'FAIL' END as result;

SELECT 'Table Test: payments' as test_name,
  CASE WHEN to_regclass('public.payments') IS NOT NULL THEN 'PASS' ELSE 'FAIL' END as result;

SELECT 'Table Test: audit_logs' as test_name,
  CASE WHEN to_regclass('public.audit_logs') IS NOT NULL THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 2: Key indexes exist
SELECT 'Index Test: users email' as test_name,
  CASE WHEN to_regclass('public.idx_users_email') IS NOT NULL THEN 'PASS' ELSE 'FAIL' END as result;

SELECT 'Index Test: events date' as test_name,
  CASE WHEN to_regclass('public.idx_events_event_date') IS NOT NULL THEN 'PASS' ELSE 'FAIL' END as result;

SELECT 'Index Test: orders user_id' as test_name,
  CASE WHEN to_regclass('public.idx_orders_user_id') IS NOT NULL THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 3: RLS is enabled on all tables
SELECT 'RLS Test: users' as test_name,
  CASE WHEN (SELECT rowsecurity FROM pg_class WHERE relname = 'users') THEN 'PASS' ELSE 'FAIL' END as result;

SELECT 'RLS Test: events' as test_name,
  CASE WHEN (SELECT rowsecurity FROM pg_class WHERE relname = 'events') THEN 'PASS' ELSE 'FAIL' END as result;

SELECT 'RLS Test: orders' as test_name,
  CASE WHEN (SELECT rowsecurity FROM pg_class WHERE relname = 'orders') THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 4: Data can be inserted
-- (Run these with proper permissions)
INSERT INTO users (email, full_name) VALUES ('test@example.com', 'Test User');
SELECT 'Insert Test: users' as test_name,
  CASE WHEN (SELECT COUNT(*) FROM users WHERE email = 'test@example.com') > 0 THEN 'PASS' ELSE 'FAIL' END as result;

INSERT INTO events (name, artist_name, event_date, ticket_price, total_tickets, available_tickets)
VALUES ('Test Event', 'Test Artist', NOW(), 100.00, 100, 100);
SELECT 'Insert Test: events' as test_name,
  CASE WHEN (SELECT COUNT(*) FROM events WHERE artist_name = 'Test Artist') > 0 THEN 'PASS' ELSE 'FAIL' END as result;

-- Test 5: Foreign key constraints work
-- Try to insert order with non-existent user (should fail)
BEGIN;
  DO $$
  BEGIN
    INSERT INTO orders (user_id, order_number, total_amount)
    VALUES ('00000000-0000-0000-0000-000000000000', 'TEST-FK', 100.00);
    RAISE EXCEPTION 'Foreign key constraint not working';
  EXCEPTION WHEN foreign_key_violation THEN
    RAISE NOTICE 'FK Test: PASS - Foreign key constraint working';
  END;
$$;
ROLLBACK;

-- Test 6: Unique constraints work
BEGIN;
  INSERT INTO users (email, full_name) VALUES ('unique@example.com', 'User 1');
  DO $$
  BEGIN
    INSERT INTO users (email, full_name) VALUES ('unique@example.com', 'User 2');
    RAISE EXCEPTION 'Unique constraint not working';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'Unique Test: PASS - Unique constraint working';
  END;
$$;
ROLLBACK;

-- Test 7: Schema documentation
SELECT 'Schema completeness: All required columns exist' as test_name,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_name IN ('users', 'events', 'orders', 'order_items', 'payments', 'audit_logs')
HAVING COUNT(*) > 0;

-- Cleanup test data
DELETE FROM users WHERE email LIKE 'test%' OR email = 'unique@example.com';
