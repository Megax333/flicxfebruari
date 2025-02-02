import React from 'react';
import { useSearch } from '../../hooks/useSearch';

const TrendingSearches = () => {
  const { trendingSearches, setQuery } = useSearch();

  return (
    <div className="space-y-1">
      {trendingSearches.map((search, index) => (
        <button
          key={index}
          onClick={() => setQuery(search.text)}
          className="w-full flex items-center gap-3 px-2 py-2 hover:bg-white/5 rounded-lg text-left group"
        >
          <span className="text-sm text-purple-400 font-medium min-w-[8px]">
            {index + 1}
          </span>
          <span className="text-[15px] text-gray-300">{search.text}</span>
        </button>
      ))}
    </div>
  );
};

export default TrendingSearches;