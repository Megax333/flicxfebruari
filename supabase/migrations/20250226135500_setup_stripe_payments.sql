-- Drop PayPal related tables and functions
DROP TABLE IF EXISTS paypal_orders;
DROP TABLE IF EXISTS paypal_webhooks;
DROP TABLE IF EXISTS paypal_config;
DROP FUNCTION IF EXISTS process_paypal_webhook;
DROP FUNCTION IF EXISTS update_paypal_config;

-- Create Stripe configuration table
CREATE TABLE IF NOT EXISTS stripe_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publishable_key TEXT NOT NULL,
    webhook_secret TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payment transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    status TEXT NOT NULL,
    xce_amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user wallet table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_wallets (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    xce_balance INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE stripe_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to stripe config for all authenticated users"
ON stripe_config FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow users to view their own transactions"
ON payment_transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to view their own wallet"
ON user_wallets FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Function to update user's XCE balance
CREATE OR REPLACE FUNCTION update_user_xce_balance(
    p_user_id UUID,
    p_xce_amount INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO user_wallets (user_id, xce_balance)
    VALUES (p_user_id, p_xce_amount)
    ON CONFLICT (user_id)
    DO UPDATE SET
        xce_balance = user_wallets.xce_balance + p_xce_amount,
        updated_at = now();
END;
$$;

-- Function to process Stripe webhook
CREATE OR REPLACE FUNCTION process_stripe_webhook(
    payment_intent_id TEXT,
    event_type TEXT,
    event_data JSONB
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_transaction payment_transactions;
BEGIN
    -- Get the transaction
    SELECT * INTO v_transaction
    FROM payment_transactions
    WHERE stripe_payment_intent_id = payment_intent_id;

    IF event_type = 'payment_intent.succeeded' THEN
        -- Update transaction status
        UPDATE payment_transactions
        SET status = 'completed',
            updated_at = now()
        WHERE stripe_payment_intent_id = payment_intent_id;

        -- Add XCE to user's wallet
        PERFORM update_user_xce_balance(
            v_transaction.user_id,
            v_transaction.xce_amount
        );
    ELSIF event_type = 'payment_intent.payment_failed' THEN
        UPDATE payment_transactions
        SET status = 'failed',
            updated_at = now()
        WHERE stripe_payment_intent_id = payment_intent_id;
    END IF;
END;
$$;
