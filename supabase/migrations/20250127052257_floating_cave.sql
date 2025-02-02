/*
  # Add XCE currency system

  1. New Tables
    - `user_balances`
      - `user_id` (uuid, primary key)
      - `balance` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid)
      - `amount` (numeric)
      - `type` (text)
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for user access
    - Add function for handling transactions
*/

-- Create user_balances table
CREATE TABLE IF NOT EXISTS user_balances (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance numeric NOT NULL DEFAULT 0 CHECK (balance >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  type text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_balances
CREATE POLICY "Users can view their own balance"
  ON user_balances FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only system can insert balances"
  ON user_balances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only system can insert transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user balance initialization
CREATE OR REPLACE FUNCTION initialize_user_balance()
RETURNS trigger AS $$
BEGIN
  -- Create initial balance record with 5 XCE
  INSERT INTO user_balances (user_id, balance)
  VALUES (NEW.id, 5);

  -- Record the welcome bonus transaction
  INSERT INTO transactions (user_id, amount, type, description)
  VALUES (NEW.id, 5, 'welcome_bonus', 'Welcome bonus for new user');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user balance initialization
DROP TRIGGER IF EXISTS on_auth_user_created_balance ON auth.users;
CREATE TRIGGER on_auth_user_created_balance
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION initialize_user_balance();

-- Update award_ad_watch function to handle XCE rewards
CREATE OR REPLACE FUNCTION award_ad_watch(user_id uuid, amount numeric DEFAULT 0.05)
RETURNS void AS $$
BEGIN
  -- Update user balance
  UPDATE user_balances
  SET 
    balance = balance + amount,
    updated_at = now()
  WHERE user_id = award_ad_watch.user_id;

  -- Record the transaction
  INSERT INTO transactions (user_id, amount, type, description)
  VALUES (
    award_ad_watch.user_id,
    amount,
    'ad_watch',
    'Reward for watching advertisement'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;