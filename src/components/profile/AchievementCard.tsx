import React from 'react';
import { Award, Trophy, Star, Target, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'award' | 'milestone' | 'certification' | 'feature' | 'recognition';
}

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const getIcon = () => {
    switch (achievement.type) {
      case 'award': return <Trophy className="text-yellow-400" />;
      case 'milestone': return <Target className="text-green-400" />;
      case 'certification': return <Award className="text-blue-400" />;
      case 'feature': return <Star className="text-purple-400" />;
      case 'recognition': return <Zap className="text-orange-400" />;
    }
  };

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all" />
      
      <div className="relative bg-[#1E1E2A] border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition-all">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white/5 rounded-lg">
            {getIcon()}
          </div>
          
          <div>
            <h3 className="font-bold mb-1">{achievement.title}</h3>
            <p className="text-gray-400 text-sm">{achievement.description}</p>
            <span className="text-xs text-purple-400 mt-2 block">{achievement.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;