-- Fix setup_user_profile function by waiting for the auth.users row to be available
DROP FUNCTION IF EXISTS public.setup_user_profile(uuid, text);

CREATE OR REPLACE FUNCTION public.setup_user_profile(
    user_id uuid,
    username text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    final_username text;
    counter integer := 0;
    wait_max integer := 30;
    unique_max integer := 10;
    attempt integer := 0;
BEGIN
    -- Wait for the auth.users row to be available
    WHILE attempt < wait_max LOOP
        PERFORM 1 FROM auth.users WHERE id = user_id;
        IF FOUND THEN
            EXIT;
        END IF;
        attempt := attempt + 1;
        PERFORM pg_sleep(1);
    END LOOP;
    
    IF attempt = wait_max THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'User record not found in auth.users after waiting for ' || wait_max || ' seconds. Please try again later.'
        );
    END IF;
    
    -- Generate a unique username
    final_username := username;
    counter := 0;
    WHILE counter < unique_max AND EXISTS (
        SELECT 1 FROM profiles WHERE username = final_username
    ) LOOP
        counter := counter + 1;
        final_username := username || counter::text;
    END LOOP;

    IF counter >= unique_max THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Could not generate unique username after ' || unique_max || ' attempts'
        );
    END IF;

    BEGIN
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
