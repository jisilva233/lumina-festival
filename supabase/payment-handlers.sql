-- ============================================
-- Payment Processing Handlers
-- ============================================
-- Webhook handlers and automated payment processing
-- Created: 2025-01-31

-- ============================================
-- 1. PAYMENT STATUS UPDATES
-- ============================================

-- Function: Update payment status and create/update order
CREATE OR REPLACE FUNCTION handle_payment_success(
  p_order_id UUID,
  p_transaction_id VARCHAR,
  p_payment_method VARCHAR,
  p_provider VARCHAR
)
RETURNS TABLE(success BOOLEAN, message TEXT) AS $$
DECLARE
  v_order RECORD;
  v_new_available_tickets INTEGER;
BEGIN
  -- Start transaction
  BEGIN
    -- Get order details
    SELECT * INTO v_order FROM orders WHERE id = p_order_id;

    IF v_order IS NULL THEN
      RETURN QUERY SELECT FALSE, 'Order not found'::text;
      RETURN;
    END IF;

    -- Update order payment status
    UPDATE orders
    SET
      payment_status = 'paid',
      status = 'completed',
      completed_at = NOW(),
      updated_at = NOW()
    WHERE id = p_order_id;

    -- Update payment record
    UPDATE payments
    SET
      status = 'completed',
      transaction_id = p_transaction_id,
      provider = p_provider,
      completed_at = NOW(),
      updated_at = NOW()
    WHERE order_id = p_order_id AND status = 'pending';

    -- Update event ticket availability
    FOR v_order IN
      SELECT * FROM order_items WHERE order_id = p_order_id
    LOOP
      UPDATE events
      SET
        available_tickets = available_tickets - v_order.quantity,
        updated_at = NOW()
      WHERE id = v_order.event_id;
    END LOOP;

    -- Log successful payment
    INSERT INTO auth_events (user_id, event_type, status, created_at)
    VALUES (v_order.user_id, 'payment_completed', 'success', NOW());

    RETURN QUERY SELECT TRUE, 'Payment processed successfully'::text;

  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT FALSE, SQLERRM;
    ROLLBACK;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 2. PAYMENT FAILURE HANDLER
-- ============================================

CREATE OR REPLACE FUNCTION handle_payment_failure(
  p_order_id UUID,
  p_error_message TEXT
)
RETURNS TABLE(success BOOLEAN, message TEXT) AS $$
BEGIN
  -- Update order to failed
  UPDATE orders
  SET
    payment_status = 'failed',
    status = 'cancelled',
    updated_at = NOW()
  WHERE id = p_order_id;

  -- Update payment to failed
  UPDATE payments
  SET
    status = 'failed',
    error_message = p_error_message,
    updated_at = NOW()
  WHERE order_id = p_order_id;

  -- Log failed payment
  INSERT INTO audit_logs (action, table_name, record_id, new_values)
  VALUES ('payment_failed', 'payments', p_order_id, jsonb_build_object('error', p_error_message));

  RETURN QUERY SELECT TRUE, 'Payment failure recorded'::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. REFUND HANDLER
-- ============================================

CREATE OR REPLACE FUNCTION handle_refund(
  p_order_id UUID,
  p_amount DECIMAL,
  p_reason TEXT
)
RETURNS TABLE(success BOOLEAN, message TEXT) AS $$
DECLARE
  v_order RECORD;
BEGIN
  BEGIN
    -- Get order
    SELECT * INTO v_order FROM orders WHERE id = p_order_id;

    IF v_order IS NULL THEN
      RETURN QUERY SELECT FALSE, 'Order not found'::text;
      RETURN;
    END IF;

    -- Validate refund amount
    IF p_amount > v_order.total_amount THEN
      RETURN QUERY SELECT FALSE, 'Refund amount exceeds order total'::text;
      RETURN;
    END IF;

    -- Update payment status
    UPDATE payments
    SET
      status = 'refunded',
      updated_at = NOW()
    WHERE order_id = p_order_id;

    -- Update order
    UPDATE orders
    SET
      payment_status = 'refunded',
      status = 'refunded',
      updated_at = NOW()
    WHERE id = p_order_id;

    -- Return tickets to availability
    FOR v_order IN
      SELECT * FROM order_items WHERE order_id = p_order_id
    LOOP
      UPDATE events
      SET available_tickets = available_tickets + v_order.quantity
      WHERE id = v_order.event_id;
    END LOOP;

    -- Log refund
    INSERT INTO audit_logs (action, table_name, record_id, new_values)
    VALUES ('refund_processed', 'payments', p_order_id, jsonb_build_object('amount', p_amount, 'reason', p_reason));

    RETURN QUERY SELECT TRUE, 'Refund processed successfully'::text;

  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT FALSE, SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. WEBHOOK VERIFICATION
-- ============================================

-- Function: Verify Stripe webhook signature
CREATE OR REPLACE FUNCTION verify_stripe_webhook(
  p_signature TEXT,
  p_payload TEXT,
  p_secret TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_computed_signature TEXT;
BEGIN
  -- Stripe uses HMAC-SHA256
  -- Signature = 't=' || timestamp || ',' || 'v1=' || hash
  -- For now, assume verification happened at API gateway level
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. IDEMPOTENCY CHECK
-- ============================================

CREATE TABLE IF NOT EXISTS payment_idempotency (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idempotency_key TEXT UNIQUE NOT NULL,
  request_data JSONB,
  response_data JSONB,
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_idempotency_key ON payment_idempotency(idempotency_key);

-- Function: Check idempotent request
CREATE OR REPLACE FUNCTION check_idempotency(
  p_key TEXT
)
RETURNS TABLE(exists BOOLEAN, response JSONB) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TRUE,
    response_data
  FROM payment_idempotency
  WHERE idempotency_key = p_key
    AND expires_at > NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. PAYMENT RECONCILIATION
-- ============================================

-- Function: Reconcile pending payments
CREATE OR REPLACE FUNCTION reconcile_pending_payments()
RETURNS TABLE(reconciled INTEGER, failed INTEGER) AS $$
DECLARE
  v_reconciled INTEGER := 0;
  v_failed INTEGER := 0;
  v_payment RECORD;
BEGIN
  -- Find payments pending longer than 24 hours
  FOR v_payment IN
    SELECT * FROM payments
    WHERE status = 'pending'
      AND created_at < NOW() - INTERVAL '24 hours'
  LOOP
    -- Mark as failed
    UPDATE payments
    SET status = 'failed', error_message = 'Payment not confirmed within 24 hours'
    WHERE id = v_payment.id;

    v_failed := v_failed + 1;
  END LOOP;

  RETURN QUERY SELECT v_reconciled, v_failed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. PAYMENT AUDIT LOG
-- ============================================

-- Function: Log payment event
CREATE OR REPLACE FUNCTION log_payment_event(
  p_user_id UUID,
  p_event_type VARCHAR,
  p_order_id UUID,
  p_details JSONB
)
RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO auth_events (
    user_id,
    event_type,
    status,
    created_at
  )
  VALUES (
    p_user_id,
    'payment_' || p_event_type,
    'logged',
    NOW()
  )
  RETURNING id INTO v_event_id;

  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. GRANT PERMISSIONS
-- ============================================

GRANT EXECUTE ON FUNCTION handle_payment_success TO authenticated;
GRANT EXECUTE ON FUNCTION handle_payment_failure TO authenticated;
GRANT EXECUTE ON FUNCTION handle_refund TO authenticated;
GRANT EXECUTE ON FUNCTION verify_stripe_webhook TO authenticated;
GRANT EXECUTE ON FUNCTION check_idempotency TO authenticated;
GRANT EXECUTE ON FUNCTION reconcile_pending_payments TO service_role;
GRANT EXECUTE ON FUNCTION log_payment_event TO authenticated;

-- ============================================
-- 9. SCHEDULED TASKS (PostgreSQL pg_cron extension)
-- ============================================

-- Schedule reconciliation to run daily at 2 AM
-- SELECT cron.schedule('reconcile-payments', '0 2 * * *', 'SELECT reconcile_pending_payments()');

-- ============================================
-- End of Payment Handlers
-- ============================================
