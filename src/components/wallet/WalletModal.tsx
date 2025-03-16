import React from 'react';
import { X, Wallet, ArrowUpRight, CreditCard, History, Info } from 'lucide-react';
import CoinIcon from '../CoinIcon';
import { useBalance } from '../../hooks/useBalance';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface XCEPackage {
  id: string;
  name: string;
  xce_amount: number;
  price_usd: number;
  description: string;
}

interface WalletModalProps {
  onClose: () => void;
}

const WalletModal = ({ onClose }: WalletModalProps) => {
  const { balance, transactions, loading } = useBalance();
  const { user } = useAuth();
  const [packages, setPackages] = useState<XCEPackage[]>([]);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Map package amounts to IDs
  const packageMap = {
    5: 'starter',
    10: 'popular', 
    20: 'premium'
  };

  useEffect(() => {
    const loadPackages = async () => {
      const { data, error } = await supabase
        .from('xce_packages')
        .select('*')
        .order('price_usd');

      if (error) {
        console.error('Error loading packages:', error);
        return;
      }

      setPackages(data);
    };

    loadPackages();
  }, []);

  const handlePurchase = (packageId: string) => {
    if (!user) return;
    
    // Navigate to the payment page with the package ID
    navigate(`/payment?packageId=${packageId}`);
    onClose(); // Close the modal
  };

  const purchaseOptions = [
    { amount: 5, xce: 500 },
    { amount: 10, xce: 1100 },
    { amount: 20, xce: 2500 }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-y-auto">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#1E1E2A] w-[700px] max-h-[90vh] rounded-2xl overflow-hidden my-auto">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]" />
        
        <div className="relative">
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <Wallet className="text-purple-400" size={24} />
              <h2 className="text-xl font-bold">Your Wallet</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-[1fr,280px] divide-x divide-white/10">
            {/* Main Content */}
            <div className="p-6">
              {/* Balance Card */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-[40px] blur-[100px]" />
                <div className="bg-[#2A2A3A] rounded-2xl p-8 relative overflow-hidden group border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                  <div className="relative">
                    <div className="text-sm text-gray-400 mb-3">Available Balance</div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="relative">
                        <CoinIcon size={48} />
                        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-md" />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            {loading ? (
                              <div className="h-8 w-24 bg-purple-600/20 animate-pulse rounded" />
                            ) : (
                              balance.toLocaleString()
                            )}
                          </span>
                          <span className="text-lg text-gray-400">XCE</span>
                        </div>
                        <div className="text-sm text-gray-400">≈ ${(balance / 100).toFixed(2)} USD</div>
                      </div>
                    </div>
                  
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-2.5 rounded-xl transition-colors">
                        <CreditCard size={18} className="text-white" />
                        <span>Add Funds</span>
                      </button>
                      <button className="flex items-center gap-2 bg-[#3A3A4A] hover:bg-[#4A4A5A] px-6 py-2.5 rounded-xl transition-colors">
                        <History size={18} />
                        History
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="space-y-1">
                <h3 className="text-sm text-gray-400 mb-2">Recent Transactions</h3>
                <div className="max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                  {loading ? (
                    <div className="space-y-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-10 bg-[#2A2A3A] animate-pulse rounded-lg" />
                      ))}
                    </div>
                  ) : transactions.length > 0 ? (
                    <div className="space-y-1">
                      {transactions.map((tx) => (
                        <div key={tx.id} className="bg-[#2A2A3A] py-2 px-3 rounded-lg flex items-center justify-between group hover:bg-[#3A3A4A] transition-colors text-sm">
                          <div className="overflow-hidden">
                            <div className="font-medium truncate max-w-[200px]">{tx.description}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className={`font-medium whitespace-nowrap ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount} XCE
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-3 text-sm">
                      No transactions yet
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Purchase Options */}
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">Purchase XCE</h3>
              <div className="space-y-3">
                {purchaseOptions.map(({ amount, xce }) => (
                  <button
                    onClick={() => {
                      const pkg = packages.find(p => p.price_usd === amount);
                      if (pkg) {
                        handlePurchase(pkg.id);
                      } else {
                        setPaymentError('Package not found');
                      }
                    }}
                    key={amount}
                    className="w-full bg-[#2A2A3A] hover:bg-[#3A3A4A] p-4 rounded-xl transition-all group relative overflow-hidden border border-white/5 hover:border-purple-500/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-all" />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span className="text-xl font-bold">${amount}</span>
                        </div>
                        {paymentError && (
                          <div className="text-red-400 text-xs flex items-center gap-1">
                            <Info size={12} />
                            {paymentError}
                          </div>
                        )}
                        <div className="h-6 w-px bg-white/10" />
                        <div className="flex items-center gap-1">
                          <CoinIcon size={16} />
                          <span>{xce.toLocaleString()}</span>
                        </div>
                      </div>
                      <ArrowUpRight 
                        size={18}
                        className="text-gray-400 group-hover:text-white transition-colors"
                      />
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-[#2A2A3A] rounded-xl">
                <div className="text-sm text-gray-400 mb-2">Exchange Rate</div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">$1</span>
                  <span className="text-gray-400">=</span>
                  <CoinIcon size={16} />
                  <span className="font-bold">100 XCE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;