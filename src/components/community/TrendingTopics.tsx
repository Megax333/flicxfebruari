import React from 'react';
import { TrendingUp } from 'lucide-react';

const TrendingTopics = () => {
  const trends = [
    { tag: 'Animation', posts: '12.5K posts' },
    { tag: 'GameDev', posts: '8.2K posts' },
    { tag: 'CreativeProcess', posts: '6.4K posts' },
    { tag: 'DigitalArt', posts: '5.1K posts' },
    { tag: 'Storytelling', posts: '4.8K posts' }
  ];

  return (
    <div className="bg-[#1E1E2A] rounded-lg overflow-hidden mt-6">
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-purple-400" />
          <h3 className="font-medium text-sm">Trending in Community</h3>
        </div>
      </div>
      <div className="divide-y divide-white/10">
        {trends.map((trend, index) => (
          <button
            key={index}
            className="w-full p-3 text-left hover:bg-white/5 transition-colors"
          >
            <p className="font-medium text-sm">#{trend.tag}</p>
            <p className="text-xs text-gray-400">{trend.posts}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;