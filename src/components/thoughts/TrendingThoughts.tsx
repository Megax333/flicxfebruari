import React from 'react';
import { BrainCircuit, ChevronRight } from 'lucide-react';
import { trendingThoughts } from '../../data/thoughtsData';

const TrendingThoughts = () => {
  return (
    <div className="bg-[#1E1E2A] rounded-xl overflow-hidden sticky top-20">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-purple-400" />
          <h2 className="font-bold text-lg">Trending Thoughts</h2>
        </div>
      </div>
      <div className="divide-y divide-white/10">
        {trendingThoughts.map((thought) => (
          <button
            key={thought.id}
            className="w-full p-4 hover:bg-white/5 transition-colors text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Trending in {thought.category}</p>
                <h3 className="font-bold mt-1">#{thought.topic}</h3>
                <p className="text-sm text-gray-400 mt-1">{thought.thoughts} thoughts</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingThoughts;