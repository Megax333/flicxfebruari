import React from 'react';
import { Users, TrendingUp, Info, Share2 } from 'lucide-react';
import { tribes } from '../../data/tribesData';

interface TribeInfoProps {
  tribeId: string;
}

const TribeInfo = ({ tribeId }: TribeInfoProps) => {
  const tribe = tribes.find(t => t.id === tribeId);
  if (!tribe) return null;

  return (
    <div className="bg-[#1E1E2A] rounded-xl overflow-hidden sticky top-20">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-bold mb-2">About r/{tribe.name}</h3>
        <p className="text-sm text-gray-400">{tribe.description}</p>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Members</span>
          <span className="font-medium">{(tribe.members/1000).toFixed(1)}k</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Online</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-medium">{tribe.online}</span>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <button className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium">
            Join Community
          </button>
          
          <button className="w-full bg-[#2A2A3A] hover:bg-[#3A3A4A] px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <h4 className="font-medium mb-3 text-sm">Trending in r/{tribe.name}</h4>
        <div className="space-y-2">
          {tribe.trending?.map((topic, i) => (
            <button
              key={i}
              className="w-full text-left hover:bg-white/5 p-2 rounded-lg"
            >
              <div className="text-sm font-medium">#{topic.tag}</div>
              <div className="text-xs text-gray-400">{topic.posts} posts</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TribeInfo;