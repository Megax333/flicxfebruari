-- Create PayPal configuration table
CREATE TABLE IF NOT EXISTS paypal_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL,
  client_secret text NOT NULL,
  webhook_id text NOT NULL,
  is_sandbox boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE paypal_config ENABLE ROW LEVEL SECURITY;

-- Only allow admins to view/modify PayPal config
CREATE POLICY "Only admins can access PayPal config"
  ON paypal_config
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND username = 'admin'
    )
  );

-- Function to securely update PayPal config
CREATE OR REPLACE FUNCTION update_paypal_config(
  p_client_id text,
  p_client_secret text,
  p_webhook_id text,
  p_is_sandbox boolean DEFAULT true
) RETURNS void AS $$
BEGIN
  -- Delete existing config
  DELETE FROM paypal_config;
  
  -- Insert new config
  INSERT INTO paypal_config (
    client_id,
    client_secret,
    webhook_id,
    is_sandbox
  ) VALUES (
    p_client_id,
    p_client_secret,
    p_webhook_id,
    p_is_sandbox
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;