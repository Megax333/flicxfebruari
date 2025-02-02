/*
  # Notification System and Balance Updates

  1. Functions
    - get_unread_notifications_count: Count unread notifications
    - handle_ad_watch: Updated ad watch reward function

  2. Security
    - Additional RLS policies for notifications
    - Balance update policies
*/

-- Create function to get unread notifications count
CREATE OR REPLACE FUNCTION get_unread_notifications_count(p_user_id uuid)
RETURNS integer AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM notifications
  WHERE user_id = p_user_id
  AND read = false;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate ad watch function with better parameter names
DROP FUNCTION IF EXISTS award_ad_watch(uuid, numeric);
DROP FUNCTION IF EXISTS handle_ad_watch(uuid, numeric);

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
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (
    target_user_id,
    'Ad Reward!',
    format('You earned %s XCE for watching an ad!', reward_amount),
    'ad_reward'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure RLS is enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'notifications'
  ) THEN
    RAISE NOTICE 'Notifications table does not exist yet. Skipping RLS setup.';
    RETURN;
  END IF;

  -- Add missing RLS policies only if table exists
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'notifications'
  ) THEN
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
    DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
    DROP POLICY IF EXISTS "System can create notifications" ON notifications;

    -- Recreate policies
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
  END IF;

  -- Add balance update policies if table exists
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'user_balances'
  ) THEN
    DROP POLICY IF EXISTS "System can update balances" ON user_balances;
    
    CREATE POLICY "System can update balances"
      ON user_balances FOR UPDATE
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;