import { supabase } from '../lib/supabase';

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface XCEPackage {
  id: string;
  name: string;
  xceAmount: number;
  priceUSD: number;
  description: string;
}

// Predefined XCE packages
export const XCE_PACKAGES: XCEPackage[] = [
  {
    id: 'basic',
    name: 'Basic Pack',
    xceAmount: 100,
    priceUSD: 4.99,
    description: '100 XCE Credits'
  },
  {
    id: 'standard',
    name: 'Standard Pack',
    xceAmount: 500,
    priceUSD: 19.99,
    description: '500 XCE Credits + 50 Bonus'
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    xceAmount: 1200,
    priceUSD: 39.99,
    description: '1000 XCE Credits + 200 Bonus'
  }
];

export async function createPaymentIntent(packageId: string): Promise<PaymentIntent> {
  try {
    console.log('Creating payment intent for package:', packageId);
    const selectedPackage = XCE_PACKAGES.find(pkg => pkg.id === packageId);
    if (!selectedPackage) {
      throw new Error('Invalid package selected');
    }

    console.log('Selected package:', selectedPackage);
    console.log('Calling Supabase Edge Function...');
    
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: {
        amount: selectedPackage.priceUSD * 100, // Convert to cents
        currency: 'usd',
        xceAmount: selectedPackage.xceAmount
      }
    });

    if (error) {
      console.error('Edge Function error:', error);
      throw error;
    }
    
    console.log('Payment intent created:', data);
    return data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function getWalletBalance(): Promise<number> {
  try {
    console.log('Fetching wallet balance...');
    const { data, error } = await supabase
      .from('user_wallets')
      .select('xce_balance')
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }
    
    console.log('Wallet balance:', data?.xce_balance);
    return data?.xce_balance || 0;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
}

export async function getTransactionHistory() {
  try {
    console.log('Fetching transaction history...');
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }
    
    console.log('Transaction history:', data);
    return data;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
}
