-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create updated function with better uniqueness handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  username_attempt text;
  counter integer := 0;
  max_attempts constant integer := 5;
  base_username text;
BEGIN
  -- Get base username from metadata or generate one
  base_username := COALESCE(
    (NEW.raw_user_meta_data->>'username')::text,
    'user_' || substr(NEW.id::text, 1, 8)
  );

  -- Try to insert with incrementing suffix until success or max attempts reached
  WHILE counter < max_attempts LOOP
    BEGIN
      -- First attempt uses the base username, subsequent attempts add a number
      username_attempt := CASE 
        WHEN counter = 0 THEN base_username
        ELSE base_username || '_' || counter
      END;

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
        username_attempt,
        COALESCE(
          NEW.raw_user_meta_data->>'avatar_url',
          'https://ui-avatars.com/api/?background=random&name=' || username_attempt
        ),
        0.0,
        NOW(),
        NOW()
      );

      -- If we get here, the insert succeeded
      RETURN NEW;

    EXCEPTION 
      WHEN unique_violation THEN
        counter := counter + 1;
        -- Continue to next attempt
      WHEN OTHERS THEN
        -- Log other errors but don't prevent user creation
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
    END;
  END LOOP;

  -- If we get here, we failed to create a unique username
  RAISE WARNING 'Failed to create unique username after % attempts', max_attempts;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Ensure proper permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- Update profile policies
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

  -- Create updated policies
  CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

  CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
END
$$;
