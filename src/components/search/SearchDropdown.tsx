import React from 'react';
import { Search, Clock, TrendingUp } from 'lucide-react';
import RecentSearches from './RecentSearches';
import TrendingSearches from './TrendingSearches';

const SearchDropdown = () => {
  return (
    <div className="absolute w-full bg-[#12121A]/90 backdrop-blur-sm rounded-b-[24px] shadow-[0_8px_20px_rgba(147,51,234,0.3)] border-t border-white/5">
      <div className="px-4 py-3">
        <h3 className="text-sm text-gray-400 flex items-center gap-2 mb-2">
          <Clock size={14} />
          Recent Searches
        </h3>
        <RecentSearches />
      </div>

      <div className="px-4 py-3 border-t border-white/10">
        <h3 className="text-sm text-gray-400 flex items-center gap-2 mb-2">
          <TrendingUp size={14} />
          Trending Searches
        </h3>
        <TrendingSearches />
      </div>
    </div>
  );
}

export default SearchDropdown;