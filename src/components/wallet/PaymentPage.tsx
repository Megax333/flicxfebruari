import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import CoinIcon from '../CoinIcon';
import { ArrowLeft } from 'lucide-react';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packageDetails, setPackageDetails] = useState<{
    id: string;
    name: string;
    xce_amount: number;
    price_usd: number;
  } | null>(null);

  // Get package ID from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const packageId = searchParams.get('packageId');

  useEffect(() => {
    const fetchPackageDetails = async () => {
      if (!packageId) {
        setError('No package selected');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('xce_packages')
          .select('*')
          .eq('id', packageId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Package not found');

        setPackageDetails(data);
      } catch (err) {
        console.error('Error fetching package:', err);
        setError('Could not load package details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackageDetails();
  }, [packageId]);

  const handlePaymentSuccess = async (orderId: string) => {
    if (!user || !packageDetails) return;
    
    try {
      setIsProcessing(true);
      
      // Record the successful payment in your database
      const { error } = await supabase.rpc('complete_xce_purchase', {
        p_user_id: user.id,
        p_package_id: packageDetails.id,
        p_payment_id: orderId,
        p_amount: packageDetails.xce_amount
      });

      if (error) {
        console.error('Supabase RPC error:', error);
        
        if (error.message.includes('function "complete_xce_purchase" does not exist')) {
          setError('The payment system is not fully configured. Please contact support with error: "Missing SQL function".');
        } else {
          setError(`Error processing payment: ${error.message}`);
        }
        return;
      }

      // Redirect back to the home page with success message
      navigate('/?status=success');
    } catch (err) {
      console.error('Error processing payment:', err);
      setError('Payment was received but there was an error adding XCE to your account. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121218] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !packageDetails) {
    return (
      <div className="min-h-screen bg-[#121218] flex flex-col items-center justify-center p-6">
        <div className="bg-[#1E1E2A] p-8 rounded-2xl max-w-md w-full">
          <h2 className="text-xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error || 'Package not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-[#2A2A3A] hover:bg-[#3A3A4A] px-6 py-3 rounded-xl transition-colors w-full justify-center"
          >
            <ArrowLeft size={18} />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121218] flex flex-col items-center justify-center p-6">
      <div className="bg-[#1E1E2A] p-8 rounded-2xl max-w-md w-full relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
        
        <div className="relative">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </button>

          <h2 className="text-2xl font-bold mb-6">Complete Your Purchase</h2>
          
          <div className="bg-[#2A2A3A] p-6 rounded-xl mb-8 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Package</span>
              <span className="font-medium">{packageDetails.name}</span>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Price</span>
              <span className="font-medium">${packageDetails.price_usd.toFixed(2)} USD</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">You'll receive</span>
              <div className="flex items-center gap-2">
                <CoinIcon size={18} />
                <span className="font-medium">{packageDetails.xce_amount.toLocaleString()} XCE</span>
              </div>
            </div>
          </div>
          
          {isProcessing ? (
            <div className="flex items-center justify-center p-6">
              <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mr-3"></div>
              <span>Processing payment...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <PayPalButtons
                style={{ 
                  layout: 'vertical',
                  color: 'gold', // Using gold for better visibility
                  shape: 'pill',
                  label: 'pay',
                  tagline: false,
                  height: 45
                }}
                fundingSource={undefined}
                createOrder={(_data, actions) => {
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          value: packageDetails.price_usd.toString(),
                          currency_code: 'USD'
                        },
                        description: `${packageDetails.xce_amount} XCE Credits for Celflicks`
                      },
                    ],
                  });
                }}
                onApprove={(_data, actions) => {
                  return actions.order!.capture().then((_details) => {
                    handlePaymentSuccess(_data.orderID);
                  });
                }}
                onError={(err) => {
                  console.error('PayPal error:', err);
                  setError('There was an error processing your payment. Please try again.');
                }}
              />
              
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
