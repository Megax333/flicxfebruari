-- Function to complete an XCE purchase and add credits to user's account
CREATE OR REPLACE FUNCTION complete_xce_purchase(
  p_user_id UUID,
  p_package_id TEXT,
  p_payment_id TEXT,
  p_amount INTEGER
)
RETURNS VOID AS $$
DECLARE
  v_transaction_id UUID;
BEGIN
  -- Start a transaction
  BEGIN
    -- Insert a record into the transactions table
    INSERT INTO transactions (
      user_id,
      amount,
      description,
      transaction_type,
      payment_id
    ) VALUES (
      p_user_id,
      p_amount,
      'XCE Purchase',
      'purchase',
      p_payment_id
    )
    RETURNING id INTO v_transaction_id;

    -- Update the user's balance
    UPDATE user_profiles
    SET xce_balance = xce_balance + p_amount
    WHERE user_id = p_user_id;

    -- Insert a record into the payment_orders table if it doesn't exist
    INSERT INTO payment_orders (
      user_id,
      package_id,
      payment_id,
      status,
      amount
    ) VALUES (
      p_user_id,
      p_package_id,
      p_payment_id,
      'completed',
      p_amount
    )
    ON CONFLICT (payment_id) 
    DO UPDATE SET
      status = 'completed',
      updated_at = NOW();

    -- If we get here, commit the transaction
    COMMIT;
  EXCEPTION
    WHEN OTHERS THEN
      -- If any error occurs, roll back the transaction
      ROLLBACK;
      RAISE EXCEPTION 'Error processing payment: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
