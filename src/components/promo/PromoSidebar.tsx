import React from 'react';
import { TrendingUp, History } from 'lucide-react';
import CoinIcon from '../CoinIcon';

const PromoSidebar = () => {
  const topPromos = [
    {
      id: '1',
      platform: 'twitter',
      interactions: 1234,
      reward: 100
    },
    {
      id: '2',
      platform: 'youtube',
      interactions: 856,
      reward: 75
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#1E1E2A] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-purple-400" />
            <h2 className="font-bold">Top Performing</h2>
          </div>
        </div>
        <div className="divide-y divide-white/10">
          {topPromos.map((promo) => (
            <div key={promo.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">{promo.platform}</span>
                <div className="flex items-center gap-1">
                  <CoinIcon size={14} />
                  <span className="text-sm">{promo.reward}</span>
                </div>
              </div>
              <div className="text-sm">{promo.interactions} interactions</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1E1E2A] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <History className="text-purple-400" />
            <h2 className="font-bold">Your Activity</h2>
          </div>
        </div>
        <div className="p-4">
          <div className="text-center text-sm text-gray-400">
            No recent activity
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoSidebar;