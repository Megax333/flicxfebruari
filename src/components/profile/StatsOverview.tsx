import React from 'react';
import { Users, Star, Trophy, Film } from 'lucide-react';

interface Stats {
  followers: number;
  following: number;
  achievements: number;
  contributions: number;
}

interface StatsOverviewProps {
  stats: Stats;
}

const StatsOverview = ({ stats }: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[
        { icon: <Users className="text-purple-400" />, label: 'Followers', value: stats.followers },
        { icon: <Star className="text-blue-400" />, label: 'Following', value: stats.following },
        { icon: <Trophy className="text-yellow-400" />, label: 'Achievements', value: stats.achievements },
        { icon: <Film className="text-green-400" />, label: 'Contributions', value: stats.contributions }
      ].map((stat, index) => (
        <div key={index} className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all" />
          
          <div className="relative bg-[#1E1E2A] border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex flex-col items-center">
              {stat.icon}
              <div className="mt-2 text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;