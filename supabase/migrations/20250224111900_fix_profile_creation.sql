-- Drop any existing version of our function
DROP FUNCTION IF EXISTS public.setup_user_profile(uuid, text);

-- Create a more robust version of our profile setup function
CREATE OR REPLACE FUNCTION public.setup_user_profile(
    user_id uuid,
    username text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    final_username text;
    counter integer := 0;
    max_attempts integer := 10;
    result jsonb;
BEGIN
    -- Start with the provided username
    final_username := username;
    
    -- Keep trying until we find a unique username or hit max attempts
    WHILE counter < max_attempts AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.username = final_username
    ) LOOP
        counter := counter + 1;
        final_username := username || counter::text;
    END LOOP;

    -- Check if we found a unique username
    IF counter >= max_attempts THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Could not generate unique username after ' || max_attempts || ' attempts'
        );
    END IF;

    BEGIN
        -- Try to insert the new profile
        INSERT INTO profiles (id, username, balance)
        VALUES (user_id, final_username, 0)
        ON CONFLICT (id) DO UPDATE
        SET username = EXCLUDED.username;

        RETURN jsonb_build_object(
            'success', true,
            'username', final_username
        );
    EXCEPTION WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
    END;
END;
$$;
