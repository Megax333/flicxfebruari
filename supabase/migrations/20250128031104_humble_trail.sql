/*
  # Fix Authentication System

  1. Changes
    - Add unique constraint for usernames
    - Add better error handling for profile creation
    - Add retry mechanism for profile creation
    - Add proper cleanup for failed signups
    
  2. Security
    - Add RLS policies for profile management
    - Add validation for usernames
    - Add proper error handling
*/

-- Add unique constraint for usernames if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_username_unique'
  ) THEN
    ALTER TABLE profiles 
      ADD CONSTRAINT profiles_username_unique 
      UNIQUE (username);
  END IF;
END $$;

-- Create function to safely create profile with retries
CREATE OR REPLACE FUNCTION create_profile_safely(
  user_id uuid,
  username text,
  avatar_url text DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  max_retries constant int := 3;
  current_try int := 0;
  success boolean := false;
BEGIN
  -- Validate username
  IF NOT username ~ '^[a-zA-Z0-9_-]{3,20}$' THEN
    RAISE EXCEPTION 'Invalid username format';
  END IF;

  -- Check if username is taken
  IF EXISTS (
    SELECT 1 FROM profiles
    WHERE LOWER(username) = LOWER(create_profile_safely.username)
  ) THEN
    RAISE EXCEPTION 'Username already taken';
  END IF;

  -- Try to create profile with retries
  WHILE current_try < max_retries AND NOT success LOOP
    BEGIN
      INSERT INTO profiles (
        id,
        username,
        avatar_url,
        created_at,
        updated_at
      )
      VALUES (
        user_id,
        username,
        COALESCE(
          avatar_url,
          'https://ui-avatars.com/api/?name=' || url_encode(username) || '&background=random'
        ),
        now(),
        now()
      );

      success := true;
    EXCEPTION 
      WHEN unique_violation THEN
        -- Only retry on unique violations
        current_try := current_try + 1;
        IF current_try < max_retries THEN
          -- Wait with exponential backoff
          PERFORM pg_sleep(power(2, current_try));
          CONTINUE;
        END IF;
        RAISE;
      WHEN OTHERS THEN
        -- Don't retry on other errors
        RAISE;
    END;
  END LOOP;

  IF NOT success THEN
    RAISE EXCEPTION 'Failed to create profile after % attempts', max_retries;
  END IF;

  -- Initialize other user data
  INSERT INTO user_balances (user_id, balance)
  VALUES (user_id, 5);

  INSERT INTO transactions (
    user_id,
    amount,
    type,
    description
  )
  VALUES (
    user_id,
    5,
    'welcome_bonus',
    'Welcome bonus for new user'
  );

  INSERT INTO notifications (
    user_id,
    title,
    message,
    type
  )
  VALUES (
    user_id,
    'Welcome to Celflicks!',
    'Thanks for joining! You''ve received 5 XCE as a welcome bonus.',
    'welcome_bonus'
  );

  RETURN true;
END;
$$;

-- Improved user handler function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  username text;
  avatar_url text;
BEGIN
  -- Extract data from metadata
  username := new.raw_user_meta_data->>'username';
  avatar_url := new.raw_user_meta_data->>'avatar_url';

  -- Validate required data
  IF username IS NULL THEN
    RAISE EXCEPTION 'Username is required';
  END IF;

  -- Create profile and initialize user data
  PERFORM create_profile_safely(new.id, username, avatar_url);

  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Log error for debugging
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    -- Clean up auth user on failure
    DELETE FROM auth.users WHERE id = new.id;
    -- Re-raise the error
    RAISE;
END;
$$;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower ON profiles (LOWER(username));
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles (created_at);

-- Update RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);