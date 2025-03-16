-- Revert previous trigger disabling
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_create;
ALTER TABLE auth.users ENABLE TRIGGER USER;

-- Drop existing trigger and function to recreate with fixes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create a more robust function with proper error handling and race condition prevention
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  profile_exists boolean;
  retry_count integer := 0;
  max_retries constant integer := 3;
BEGIN
  -- Check if profile already exists to prevent unique constraint violations
  WHILE retry_count < max_retries LOOP
    BEGIN
      SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = NEW.id
      ) INTO profile_exists;

      IF NOT profile_exists THEN
        -- Insert with proper error handling and default values
        INSERT INTO public.profiles (
          id,
          username,
          avatar_url,
          balance,
          created_at,
          updated_at
        )
        VALUES (
          NEW.id,
          COALESCE((NEW.raw_user_meta_data->>'username')::text, 'user_' || substr(NEW.id::text, 1, 8)),
          COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            'https://ui-avatars.com/api/?background=random&name=' || 
            COALESCE((NEW.raw_user_meta_data->>'username')::text, 'user_' || substr(NEW.id::text, 1, 8))
          ),
          0.0,  -- Initial balance
          NOW(),
          NOW()
        );

        -- Exit loop if successful
        EXIT;
      ELSE
        -- Profile already exists, no need to create
        EXIT;
      END IF;

    EXCEPTION WHEN unique_violation THEN
      -- Handle race condition by retrying
      retry_count := retry_count + 1;
      IF retry_count = max_retries THEN
        RAISE EXCEPTION 'Failed to create profile after % attempts', max_retries;
      END IF;
      -- Small delay before retry to reduce contention
      PERFORM pg_sleep(0.1);
    WHEN OTHERS THEN
      -- Log other errors but don't prevent user creation
      RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
      EXIT;
    END;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger with proper timing
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.raw_user_meta_data IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Ensure proper permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- Ensure proper permissions on profiles table
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Create or update policies for profiles table
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  DROP POLICY IF EXISTS "System can create user profiles" ON public.profiles;

  -- Create new policies with proper checks
  CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

  CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

  CREATE POLICY "System can create user profiles"
    ON public.profiles
    FOR INSERT
    WITH CHECK (true);  -- Allow system to create profiles via trigger
END
$$;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create index to improve performance
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(id);

-- Add constraint to ensure non-negative balance
DO $$ 
BEGIN
  ALTER TABLE public.profiles ADD CONSTRAINT check_non_negative_balance 
    CHECK (balance >= 0);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
