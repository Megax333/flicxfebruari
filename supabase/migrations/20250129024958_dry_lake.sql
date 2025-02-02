-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved user handler function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  username text;
  avatar_url text;
BEGIN
  -- Get username from metadata with validation
  username := NULLIF(TRIM(new.raw_user_meta_data->>'username'), '');
  IF username IS NULL THEN
    RAISE EXCEPTION 'Username is required';
  END IF;

  -- Validate username format
  IF NOT username ~ '^[a-zA-Z0-9_-]{3,20}$' THEN
    RAISE EXCEPTION 'Invalid username format';
  END IF;

  -- Check for duplicate username
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE LOWER(profiles.username) = LOWER(username)
  ) THEN
    RAISE EXCEPTION 'Username already exists';
  END IF;

  -- Get or generate avatar URL
  avatar_url := COALESCE(
    NULLIF(TRIM(new.raw_user_meta_data->>'avatar_url'), ''),
    'https://ui-avatars.com/api/?name=' || url_encode(username) || '&background=random'
  );

  -- Create profile
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
  INSERT INTO public.user_balances (
    user_id,
    balance,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    5.0,
    now(),
    now()
  );

  -- Record welcome bonus transaction
  INSERT INTO public.transactions (
    user_id,
    amount,
    type,
    description,
    created_at
  )
  VALUES (
    new.id,
    5.0,
    'welcome_bonus',
    'Welcome bonus for new user',
    now()
  );

  -- Create welcome notification
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    type,
    created_at
  )
  VALUES (
    new.id,
    'Welcome to Celflicks!',
    'Thanks for joining! You''ve received 5 XCE as a welcome bonus.',
    'welcome_bonus',
    now()
  );

  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Log error details
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    -- Clean up partial data if any was created
    DELETE FROM public.profiles WHERE id = new.id;
    DELETE FROM public.user_balances WHERE user_id = new.id;
    DELETE FROM public.transactions WHERE user_id = new.id;
    DELETE FROM public.notifications WHERE user_id = new.id;
    -- Re-raise the error
    RAISE;
END;
$$;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower ON profiles (LOWER(username));
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles (created_at);

-- Ensure RLS policies are correct
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

-- Add constraint for username uniqueness if not exists
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