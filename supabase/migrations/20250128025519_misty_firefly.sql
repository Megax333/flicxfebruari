/*
  # Add authentication helper functions

  1. New Functions
    - `check_username_available` - Checks if a username is available
    - `handle_new_user` - Updated user creation handler with better error handling

  2. Changes
    - Drop and recreate user creation trigger with improved error handling
    - Add username format validation
*/

-- Function to check if a username is available
CREATE OR REPLACE FUNCTION check_username_available(p_username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate username format
  IF NOT p_username ~ '^[a-zA-Z0-9_-]{3,20}$' THEN
    RAISE EXCEPTION 'Invalid username format';
  END IF;

  -- Check if username exists
  RETURN NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE LOWER(username) = LOWER(p_username)
  );
END;
$$;

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved user handler function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  username text;
  avatar_url text;
BEGIN
  -- Get username from metadata
  username := new.raw_user_meta_data->>'username';
  
  -- Validate username
  IF username IS NULL OR NOT username ~ '^[a-zA-Z0-9_-]{3,20}$' THEN
    RAISE EXCEPTION 'Invalid username format';
  END IF;

  -- Get avatar URL or generate one
  avatar_url := COALESCE(
    new.raw_user_meta_data->>'avatar_url',
    'https://ui-avatars.com/api/?name=' || url_encode(username) || '&background=random'
  );

  -- Create profile with validated data
  INSERT INTO public.profiles (
    id,
    username,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    username,
    avatar_url,
    now(),
    now()
  );

  -- Initialize user balance
  INSERT INTO public.user_balances (user_id, balance)
  VALUES (new.id, 5);

  -- Record welcome bonus transaction
  INSERT INTO public.transactions (
    user_id,
    amount,
    type,
    description
  )
  VALUES (
    new.id,
    5,
    'welcome_bonus',
    'Welcome bonus for new user'
  );

  -- Create welcome notification
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    type
  )
  VALUES (
    new.id,
    'Welcome to Celflicks!',
    'Thanks for joining! You''ve received 5 XCE as a welcome bonus.',
    'welcome_bonus'
  );

  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Log error details
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    -- Re-raise the error
    RAISE;
END;
$$;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower ON profiles (LOWER(username));

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION check_username_available(text) TO authenticated;
GRANT EXECUTE ON FUNCTION check_username_available(text) TO anon;