import React from 'react';
import { X, Shield, Crown, Star, Diamond, Sparkles } from 'lucide-react';
import CoinIcon from './CoinIcon';

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
  type: 'daily' | 'weekly' | 'achievement';
  completed: boolean;
}

interface Tier {
  name: string;
  icon: React.ReactNode;
  color: string;
  requiredXP: number;
}

const tiers: Tier[] = [
  { 
    name: 'Bronze', 
    icon: (
      <div className="relative">
        <Shield className="text-indigo-400" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Star size={10} className="text-indigo-300" />
        </div>
      </div>
    ),
    color: 'from-indigo-400 to-indigo-300',
    requiredXP: 0 
  },
  { 
    name: 'Silver', 
    icon: (
      <div className="relative">
        <Crown className="text-purple-400" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Star size={10} className="text-purple-300 animate-pulse" />
        </div>
      </div>
    ),
    color: 'from-purple-400 to-purple-300', 
    requiredXP: 1000 
  },
  { 
    name: 'Sapphire', 
    icon: (
      <div className="relative">
        <Star className="text-blue-400" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={10} className="text-blue-300 animate-pulse" />
        </div>
      </div>
    ),
    color: 'from-blue-500 to-blue-400', 
    requiredXP: 5000 
  },
  { 
    name: 'Ruby', 
    icon: (
      <div className="relative">
        <Crown className="text-rose-400" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Diamond size={10} className="text-rose-300 animate-pulse" />
        </div>
      </div>
    ),
    color: 'from-rose-400 to-rose-300', 
    requiredXP: 10000 
  },
  { 
    name: 'Diamond', 
    icon: (
      <div className="relative">
        <Diamond className="text-cyan-400" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={10} className="text-cyan-300 animate-pulse" />
        </div>
      </div>
    ),
    color: 'from-cyan-400 to-cyan-300', 
    requiredXP: 25000 
  }
];

const missions: Mission[] = [
  {
    id: '1',
    title: 'Welcome to Celflicks',
    description: 'Complete your profile and earn your first reward!',
    reward: 0.5,
    progress: 0,
    total: 1,
    type: 'achievement',
    completed: false
  },
  {
    id: '2',
    title: 'Community Builder',
    description: 'Invite 5 friends to join Celflicks',
    reward: 1.5,
    progress: 2,
    total: 5,
    type: 'achievement',
    completed: false
  },
  {
    id: '3',
    title: 'Series Explorer',
    description: 'Watch Episode 1 of 3 different series',
    reward: 0.75,
    progress: 1,
    total: 3,
    type: 'weekly',
    completed: false
  },
  {
    id: '4',
    title: 'Social Butterfly',
    description: 'Follow 10 creators',
    reward: 0.5,
    progress: 3,
    total: 10,
    type: 'achievement',
    completed: false
  },
  {
    id: '5',
    title: 'Daily Viewer',
    description: 'Watch 3 episodes today',
    reward: 0.25,
    progress: 1,
    total: 3,
    type: 'daily',
    completed: false
  }
];

interface MissionBoardProps {
  onClose: () => void;
}

const MissionBoard = ({ onClose }: MissionBoardProps) => {
  const userXP = 2500; // This would come from the user's profile
  const currentTier = tiers.reduce((prev, curr) => 
    userXP >= curr.requiredXP ? curr : prev
  );
  
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  const progress = nextTier 
    ? ((userXP - currentTier.requiredXP) / (nextTier.requiredXP - currentTier.requiredXP)) * 100
    : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#1E1E2A] w-[800px] max-h-[90vh] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Mission Board</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Tier Progress */}
        <div className="p-4 bg-[#12121A] border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">Current Progress</h3>
            <span className="text-sm text-gray-400">{userXP} XP Total</span>
          </div>
          
          <div className="relative h-3 bg-[#2A2A3A] rounded-full overflow-hidden mb-2">
            {/* Tier Progress Segments */}
            {tiers.map((tier, index) => {
              const nextTierXP = tiers[index + 1]?.requiredXP || tier.requiredXP;
              const segmentWidth = ((nextTierXP - tier.requiredXP) / tiers[tiers.length - 1].requiredXP) * 100;
              const isCurrent = userXP >= tier.requiredXP && (!tiers[index + 1] || userXP < tiers[index + 1].requiredXP);
              
              return (
                <div
                  key={tier.name}
                  className={`absolute h-full transition-all ${isCurrent ? `bg-gradient-to-r ${tier.color}` : 'bg-[#3A3A4A]'}`}
                  style={{
                    left: `${(tier.requiredXP / tiers[tiers.length - 1].requiredXP) * 100}%`,
                    width: `${segmentWidth}%`
                  }}
                />
              );
            })}
            
            {/* Current Progress Indicator */}
            <div
              className="absolute h-full bg-gradient-to-r from-purple-600 to-blue-600"
              style={{
                width: `${(userXP / tiers[tiers.length - 1].requiredXP) * 100}%`
              }}
            />
          </div>
          
          {/* Tier Markers */}
          <div className="flex justify-between">
            {tiers.map((tier) => {
              const isUnlocked = userXP >= tier.requiredXP;
              return (
                <div
                  key={tier.name}
                  className={`flex flex-col items-center ${isUnlocked ? 'text-white' : 'text-gray-500'}`}
                >
                  <div className={`p-1 rounded-lg ${isUnlocked ? `bg-gradient-to-br ${tier.color}` : 'bg-[#2A2A3A]'}`}>
                    {tier.icon}
                  </div>
                  <span className="text-xs mt-1">{tier.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission List */}
        <div className="p-4 space-y-3 max-h-[calc(90vh-200px)] overflow-y-auto">
          {missions.map((mission) => (
            <div 
              key={mission.id}
              className="bg-[#12121A] p-3 rounded-xl hover:bg-[#2A2A3A] transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{mission.title}</h4>
                <div className="flex items-center gap-2">
                  <CoinIcon size={16} />
                  <span>{mission.reward}</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-3">{mission.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="h-2 bg-[#2A2A3A] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
                      style={{ width: `${(mission.progress / mission.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">
                      {mission.progress} / {mission.total}
                    </span>
                    <span className="text-xs text-gray-400">{mission.type}</span>
                  </div>
                </div>
                {mission.progress >= mission.total && !mission.completed && (
                  <button className="bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded-full text-sm">
                    Claim
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MissionBoard;