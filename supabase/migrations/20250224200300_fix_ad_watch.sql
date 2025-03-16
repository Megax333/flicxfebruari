-- Drop and recreate the handle_ad_watch function with proper parameter names
DROP FUNCTION IF EXISTS public.handle_ad_watch(uuid, numeric);

CREATE OR REPLACE FUNCTION public.handle_ad_watch(
    target_user_id uuid,
    reward_amount numeric DEFAULT 0.05
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_balance numeric;
BEGIN
    -- Check if user has a balance record
    SELECT balance INTO current_balance
    FROM user_balances
    WHERE user_id = target_user_id;

    IF current_balance IS NULL THEN
        -- Create balance record if it doesn't exist
        INSERT INTO user_balances (user_id, balance)
        VALUES (target_user_id, reward_amount);
    ELSE
        -- Update existing balance
        UPDATE user_balances
        SET 
            balance = balance + reward_amount,
            updated_at = now()
        WHERE user_id = target_user_id;
    END IF;

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

    -- Return updated balance
    SELECT balance INTO current_balance
    FROM user_balances
    WHERE user_id = target_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'balance', current_balance,
        'reward_amount', reward_amount
    );
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error in handle_ad_watch: %', SQLERRM;
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;
