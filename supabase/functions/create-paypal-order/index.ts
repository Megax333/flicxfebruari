import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const PAYPAL_API = Deno.env.get('PAYPAL_SANDBOX') === 'true'
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function generateAccessToken() {
  try {
    // Get PayPal credentials from database
    const { data: config, error: configError } = await supabase
      .from('paypal_config')
      .select('*')
      .single();

    if (configError) throw configError;

    const auth = btoa(`${config.client_id}:${config.client_secret}`);
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to generate PayPal access token:', error);
    throw error;
  }
}

serve(async (req) => {
  try {
    const { orderId, packageId, userId } = await req.json();

    // Get package details
    const { data: pkg, error: pkgError } = await supabase
      .from('xce_packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (pkgError) throw pkgError;

    // Generate access token
    const accessToken = await generateAccessToken();

    // Create PayPal order
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: pkg.price_usd.toString(),
            },
            description: `${pkg.xce_amount} XCE Credits`,
          },
        ],
      }),
    });

    const order = await response.json();
    if (order.error) throw order.error;

    // Create PayPal order record
    const { error: paypalError } = await supabase
      .from('paypal_orders')
      .insert([{
        payment_order_id: orderId,
        paypal_order_id: order.id,
        status: 'CREATED'
      }]);

    if (paypalError) throw paypalError;

    return new Response(
      JSON.stringify({ orderID: order.id }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});