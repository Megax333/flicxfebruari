/*
  # User Balance and Notification System

  1. New Tables
    - user_balances: Stores user XCE balances
    - transactions: Records all balance changes
    - notifications: Stores user notifications

  2. Functions
    - create_notification: Creates user notifications
    - initialize_user_balance: Sets up new user balances
    - handle_ad_watch: Handles ad watch rewards

  3. Security
    - RLS policies for all tables
    - Security definer functions for system operations
*/

-- Create user_balances table
CREATE TABLE IF NOT EXISTS user_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  balance numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT positive_balance CHECK (balance >= 0)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- User balances policies
CREATE POLICY "Users can view own balance"
  ON user_balances FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can update balances"
  ON user_balances FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Transaction policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create transactions"
  ON transactions FOR INSERT
  WITH CHECK (true);

-- Notification policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Create notification function
CREATE OR REPLACE FUNCTION create_notification(
  target_user_id uuid,
  notification_title text,
  notification_message text,
  notification_type text
) RETURNS void AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (target_user_id, notification_title, notification_message, notification_type);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create balance initialization function
CREATE OR REPLACE FUNCTION initialize_user_balance(
  target_user_id uuid,
  initial_amount numeric DEFAULT 5
) RETURNS void AS $$
BEGIN
  -- Create initial balance
  INSERT INTO user_balances (user_id, balance)
  VALUES (target_user_id, initial_amount);

  -- Record welcome bonus transaction
  INSERT INTO transactions (user_id, amount, type, description)
  VALUES (
    target_user_id,
    initial_amount,
    'welcome_bonus',
    'Welcome bonus for new user'
  );

  -- Create welcome notification
  PERFORM create_notification(
    target_user_id,
    'Welcome Bonus!',
    format('You received %s XCE as a welcome bonus!', initial_amount),
    'welcome_bonus'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create ad watch reward function
CREATE OR REPLACE FUNCTION handle_ad_watch(
  target_user_id uuid,
  reward_amount numeric DEFAULT 0.05
) RETURNS void AS $$
BEGIN
  -- Update user balance
  UPDATE user_balances
  SET 
    balance = balance + reward_amount,
    updated_at = now()
  WHERE user_id = target_user_id;

  -- Record transaction
  INSERT INTO transactions (user_id, amount, type, description)
  VALUES (
    target_user_id,
    reward_amount,
    'ad_watch',
    'Reward for watching advertisement'
  );

  -- Create notification
  PERFORM create_notification(
    target_user_id,
    'Ad Reward!',
    format('You earned %s XCE for watching an ad!', reward_amount),
    'ad_reward'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger function for new users
CREATE OR REPLACE FUNCTION handle_new_user_balance()
RETURNS trigger AS $$
BEGIN
  -- Initialize user balance with welcome bonus
  PERFORM initialize_user_balance(new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create new trigger for user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_balance();

-- Initialize existing users
DO $$
BEGIN
  -- Initialize balances for existing users who don't have one
  INSERT INTO user_balances (user_id, balance)
  SELECT id, 5
  FROM auth.users u
  WHERE NOT EXISTS (
    SELECT 1 FROM user_balances b WHERE b.user_id = u.id
  );

  -- Create welcome transactions for these users
  INSERT INTO transactions (user_id, amount, type, description)
  SELECT id, 5, 'welcome_bonus', 'Welcome bonus for new user'
  FROM auth.users u
  WHERE NOT EXISTS (
    SELECT 1 FROM transactions t 
    WHERE t.user_id = u.id 
    AND t.type = 'welcome_bonus'
  );

  -- Create welcome notifications for these users
  INSERT INTO notifications (user_id, title, message, type)
  SELECT 
    id,
    'Welcome Bonus!',
    'You received 5 XCE as a welcome bonus!',
    'welcome_bonus'
  FROM auth.users u
  WHERE NOT EXISTS (
    SELECT 1 FROM notifications n 
    WHERE n.user_id = u.id 
    AND n.type = 'welcome_bonus'
  );
END;
$$;