/*
  # Add balance retrieval function

  Add a secure function to get user balance that handles missing records
*/

-- Create function to safely get user balance
CREATE OR REPLACE FUNCTION get_user_balance(p_user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_balance numeric;
BEGIN
  -- Try to get existing balance
  SELECT balance INTO v_balance
  FROM user_balances
  WHERE user_id = p_user_id;

  -- If no balance exists, initialize one
  IF v_balance IS NULL THEN
    INSERT INTO user_balances (user_id, balance)
    VALUES (p_user_id, 5)
    RETURNING balance INTO v_balance;

    -- Record welcome bonus transaction
    INSERT INTO transactions (user_id, amount, type, description)
    VALUES (p_user_id, 5, 'welcome_bonus', 'Welcome bonus for new user');
  END IF;

  RETURN v_balance;
END;
$$;