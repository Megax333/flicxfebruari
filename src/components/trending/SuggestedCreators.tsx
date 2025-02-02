import React from 'react';
import { suggestedCreators } from '../../data/trendingData';
import { Users } from 'lucide-react';
import CoinIcon from '../CoinIcon';

const SuggestedCreators = () => {
  return (
    <div className="bg-[#1E1E2A] rounded-xl overflow-hidden sticky top-20">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Users className="text-purple-400" />
          <h2 className="font-bold text-lg">Suggested Creators</h2>
        </div>
      </div>
      <div className="divide-y divide-white/10">
        {suggestedCreators.map((creator) => (
          <div key={creator.id} className="p-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold">{creator.name}</h3>
                <p className="text-sm text-gray-400">@{creator.handle}</p>
              </div>
              <button className="group relative flex items-center gap-1.5 bg-[#2A2A3A] hover:bg-[#3A3A4A] px-4 py-1.5 rounded-full transition-all">
                <CoinIcon size={16} />
                <span className="text-sm">Follow</span>
              </button>
            </div>
            <p className="text-sm text-gray-300 mt-2">{creator.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedCreators;