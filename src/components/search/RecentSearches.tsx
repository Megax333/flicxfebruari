import React from 'react';
import { Search } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';

const RecentSearches = () => {
  const { recentSearches, setQuery } = useSearch();

  return (
    <div className="space-y-1">
      {recentSearches.map((search, index) => (
        <button
          key={index}
          onClick={() => setQuery(search)}
          className="w-full flex items-center gap-3 px-2 py-2 hover:bg-white/5 rounded-lg text-left group"
        >
          <Search size={16} className="text-gray-500 group-hover:text-gray-400" />
          <span className="text-[15px] text-gray-300">{search}</span>
        </button>
      ))}
    </div>
  );
};

export default RecentSearches;