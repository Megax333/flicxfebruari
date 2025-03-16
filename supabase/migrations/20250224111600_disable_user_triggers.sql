-- Disable all triggers on auth.users table
ALTER TABLE auth.users DISABLE TRIGGER ALL;

-- Drop existing trigger functions that might be causing issues
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_profile_for_user() CASCADE;

-- Ensure our setup_user_profile function exists and is working
CREATE OR REPLACE FUNCTION public.setup_user_profile(
    user_id uuid,
    username text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    final_username text;
    counter integer := 0;
BEGIN
    -- Start with the provided username
    final_username := username;
    
    -- Keep trying until we find a unique username
    WHILE EXISTS (SELECT 1 FROM profiles WHERE profiles.username = final_username) LOOP
        counter := counter + 1;
        final_username := username || counter::text;
    END LOOP;

    -- Insert the profile with the unique username
    INSERT INTO profiles (id, username, balance)
    VALUES (user_id, final_username, 0)
    ON CONFLICT (id) DO UPDATE
    SET username = EXCLUDED.username;
END;
$$;
