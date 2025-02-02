import { supabase } from '../lib/supabase';

// PayPal API configuration
const PAYPAL_API = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// Helper to generate access token
async function generateAccessToken() {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64');

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

// Create PayPal order
export async function createOrder(userId: string, packageId: string) {
  try {
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

    // Create payment order in our database
    const { data: paymentOrder, error: orderError } = await supabase
      .rpc('create_payment_order', {
        p_user_id: userId,
        p_package_id: packageId,
        p_paypal_order_id: order.id
      });

    if (orderError) throw orderError;

    // Create PayPal order record
    const { error: paypalError } = await supabase
      .from('paypal_orders')
      .insert([{
        payment_order_id: paymentOrder,
        paypal_order_id: order.id,
        status: 'CREATED'
      }]);

    if (paypalError) throw paypalError;

    return {
      orderID: order.id
    };
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
}

// Handle PayPal webhook
export async function handleWebhook(event: any) {
  try {
    // Verify webhook signature
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    const requestBody = event.body;
    const headers = event.headers;

    // Verify webhook authenticity (implement PayPal's verification logic)
    const isValid = await verifyWebhookSignature(webhookId, requestBody, headers);
    if (!isValid) {
      throw new Error('Invalid webhook signature');
    }

    // Process the webhook
    const { error } = await supabase.rpc('process_paypal_webhook', {
      webhook_data: requestBody
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    throw error;
  }
}

// Verify webhook signature
async function verifyWebhookSignature(webhookId: string, body: any, headers: any) {
  try {
    const accessToken = await generateAccessToken();

    const response = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        auth_algo: headers['paypal-auth-algo'],
        cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: webhookId,
        webhook_event: body
      }),
    });

    const verification = await response.json();
    return verification.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    throw error;
  }
}