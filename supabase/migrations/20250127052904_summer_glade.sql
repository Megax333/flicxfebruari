/*
  # Fix RLS policies for INSERT operations

  1. Drop and recreate INSERT policies with WITH CHECK
  2. Fix system function policies
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "System functions can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Only system can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert ad impressions" ON ad_impressions;

-- Recreate INSERT policies with WITH CHECK
CREATE POLICY "System functions can insert transactions"
  ON transactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can insert ad impressions"
  ON ad_impressions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add missing RLS policies for balance updates
DROP POLICY IF EXISTS "System functions can update balances" ON user_balances;
CREATE POLICY "System functions can update balances"
  ON user_balances FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Initialize balances for existing users who don't have one
DO $$
BEGIN
  INSERT INTO user_balances (user_id, balance)
  SELECT id, 5
  FROM auth.users u
  WHERE NOT EXISTS (
    SELECT 1 FROM user_balances b WHERE b.user_id = u.id
  );

  -- Record welcome bonus transactions for these users
  INSERT INTO transactions (user_id, amount, type, description)
  SELECT id, 5, 'welcome_bonus', 'Welcome bonus for new user'
  FROM auth.users u
  WHERE NOT EXISTS (
    SELECT 1 FROM transactions t 
    WHERE t.user_id = u.id 
    AND t.type = 'welcome_bonus'
  );
END;
$$;