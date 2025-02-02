/*
  # Add PayPal payment support
  
  1. New Tables
    - `payment_orders` - Tracks payment orders and their status
    - `xce_packages` - Defines available XCE purchase packages
  
  2. Functions
    - `create_payment_order` - Creates a new payment order
    - `complete_payment_order` - Processes completed payments
    
  3. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Create payment packages table
CREATE TABLE IF NOT EXISTS xce_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  xce_amount numeric NOT NULL,
  price_usd numeric NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create payment orders table
CREATE TABLE IF NOT EXISTS payment_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id uuid REFERENCES xce_packages(id),
  amount_usd numeric NOT NULL,
  xce_amount numeric NOT NULL,
  paypal_order_id text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE xce_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active packages"
  ON xce_packages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view own payment orders"
  ON payment_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create payment orders"
  ON payment_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to create payment order
CREATE OR REPLACE FUNCTION create_payment_order(
  p_user_id uuid,
  p_package_id uuid,
  p_paypal_order_id text
) RETURNS uuid AS $$
DECLARE
  v_package xce_packages;
  v_order_id uuid;
BEGIN
  -- Get package details
  SELECT * INTO v_package
  FROM xce_packages
  WHERE id = p_package_id AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid package';
  END IF;

  -- Create order
  INSERT INTO payment_orders (
    user_id,
    package_id,
    amount_usd,
    xce_amount,
    paypal_order_id,
    status
  ) VALUES (
    p_user_id,
    p_package_id,
    v_package.price_usd,
    v_package.xce_amount,
    p_paypal_order_id,
    'pending'
  ) RETURNING id INTO v_order_id;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete payment
CREATE OR REPLACE FUNCTION complete_payment_order(
  p_order_id uuid,
  p_paypal_order_id text
) RETURNS void AS $$
DECLARE
  v_order payment_orders;
BEGIN
  -- Get and lock order
  SELECT * INTO v_order
  FROM payment_orders
  WHERE id = p_order_id
  AND paypal_order_id = p_paypal_order_id
  AND status = 'pending'
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or already processed order';
  END IF;

  -- Update order status
  UPDATE payment_orders
  SET 
    status = 'completed',
    updated_at = now()
  WHERE id = p_order_id;

  -- Add XCE to user balance
  UPDATE user_balances
  SET 
    balance = balance + v_order.xce_amount,
    updated_at = now()
  WHERE user_id = v_order.user_id;

  -- Create transaction record
  INSERT INTO transactions (
    user_id,
    amount,
    type,
    description
  ) VALUES (
    v_order.user_id,
    v_order.xce_amount,
    'purchase',
    format('Purchased %s XCE for $%s', v_order.xce_amount, v_order.amount_usd)
  );

  -- Create notification
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type
  ) VALUES (
    v_order.user_id,
    'Purchase Complete!',
    format('Successfully purchased %s XCE!', v_order.xce_amount),
    'purchase'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default packages
INSERT INTO xce_packages (name, xce_amount, price_usd, description) VALUES
  ('Starter Pack', 500, 5, 'Perfect for getting started'),
  ('Popular Pack', 1100, 10, 'Most popular choice - 10% bonus XCE!'),
  ('Premium Pack', 2500, 20, 'Best value - 25% bonus XCE!'),
  ('Ultimate Pack', 6000, 45, 'For serious creators - 33% bonus XCE!');