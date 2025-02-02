import React from 'react';
import { Plus, TrendingUp, Coins } from 'lucide-react';
import CoinIcon from '../CoinIcon';

interface PromoHeaderProps {
  onCreateClick: () => void;
}

const PromoHeader = ({ onCreateClick }: PromoHeaderProps) => {
  return (
    <div className="bg-[#1E1E2A] rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Promo Stream</h1>
          <p className="text-gray-400">Boost your social media engagement with XCE rewards</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#2A2A3A] px-4 py-2 rounded-xl">
            <TrendingUp className="text-purple-400" size={20} />
            <div>
              <div className="text-sm text-gray-400">Active Promos</div>
              <div className="font-bold">1,234</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#2A2A3A] px-4 py-2 rounded-xl">
            <CoinIcon size={20} />
            <div>
              <div className="text-sm text-gray-400">Total Rewards</div>
              <div className="font-bold">50,000 XCE</div>
            </div>
          </div>
          <button
            onClick={onCreateClick}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus size={20} />
            Create Promo
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoHeader;