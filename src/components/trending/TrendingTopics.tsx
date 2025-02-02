import React from 'react';
import { trendingTopics } from '../../data/trendingData';
import { TrendingUp, ChevronRight } from 'lucide-react';

const TrendingTopics = () => {
  return (
    <div className="bg-[#1E1E2A] rounded-xl overflow-hidden sticky top-20">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-purple-400" />
          <h2 className="font-bold text-lg">Trending Topics</h2>
        </div>
      </div>
      <div className="divide-y divide-white/10">
        {trendingTopics.map((topic) => (
          <button
            key={topic.id}
            className="w-full p-4 hover:bg-white/5 transition-colors text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Trending in {topic.category}</p>
                <h3 className="font-bold mt-1">#{topic.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{topic.posts} posts</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;