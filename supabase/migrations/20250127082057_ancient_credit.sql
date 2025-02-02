/*
  # PayPal Integration Schema

  1. New Tables
    - `paypal_orders` - Tracks PayPal order details
    - `paypal_webhooks` - Logs webhook events
  
  2. Functions
    - `create_paypal_order` - Creates new PayPal order
    - `process_paypal_webhook` - Handles webhook notifications
*/

-- Create PayPal orders table
CREATE TABLE IF NOT EXISTS paypal_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_order_id uuid REFERENCES payment_orders(id),
  paypal_order_id text NOT NULL,
  status text NOT NULL DEFAULT 'CREATED',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create PayPal webhooks table
CREATE TABLE IF NOT EXISTS paypal_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  resource_type text NOT NULL,
  resource_id text NOT NULL,
  resource_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE paypal_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE paypal_webhooks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own PayPal orders"
  ON paypal_orders FOR SELECT
  USING (
    payment_order_id IN (
      SELECT id FROM payment_orders WHERE user_id = auth.uid()
    )
  );

-- Function to process PayPal webhook
CREATE OR REPLACE FUNCTION process_paypal_webhook(
  webhook_data jsonb
) RETURNS void AS $$
DECLARE
  v_order_id text;
  v_event_type text;
  v_payment_order_id uuid;
BEGIN
  -- Extract data
  v_order_id := webhook_data->>'resource_id';
  v_event_type := webhook_data->>'event_type';
  
  -- Log webhook
  INSERT INTO paypal_webhooks (
    event_type,
    resource_type,
    resource_id,
    resource_data
  ) VALUES (
    v_event_type,
    webhook_data->>'resource_type',
    v_order_id,
    webhook_data->'resource'
  );

  -- Handle PAYMENT.CAPTURE.COMPLETED
  IF v_event_type = 'PAYMENT.CAPTURE.COMPLETED' THEN
    -- Get payment order ID
    SELECT payment_order_id INTO v_payment_order_id
    FROM paypal_orders
    WHERE paypal_order_id = v_order_id;

    IF FOUND THEN
      -- Complete the payment
      PERFORM complete_payment_order(v_payment_order_id, v_order_id);
      
      -- Update PayPal order status
      UPDATE paypal_orders
      SET 
        status = 'COMPLETED',
        updated_at = now()
      WHERE paypal_order_id = v_order_id;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;