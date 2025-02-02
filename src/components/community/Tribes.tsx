import React from 'react';
import { Sparkles, Palette, Music, Heart, Brain, Code, Camera, Globe, Users, TrendingUp } from 'lucide-react';
import TribesIcon from './TribesIcon';
import { cn } from '../../utils/cn';

interface Tribe {
  id: string;
  name: string;
  icon: React.ReactNode;
  members: number;
  online: number;
  color: string;
  description: string;
}

const tribes: Tribe[] = [
  { 
    id: 'animation',
    name: 'Animation',
    icon: <Palette size={14} />,
    members: 25600,
    online: 1234,
    color: 'from-purple-500 to-pink-500',
    description: 'A community for animation artists and enthusiasts'
  },
  // ... Add similar expanded data for other tribes
];

interface TribesProps {
  onTribeSelect: (tribeId: string) => void;
  selectedTribe: string | null;
}

const Tribes = ({ onTribeSelect, selectedTribe }: TribesProps) => {
  return (
    <div className="bg-[#1E1E2A] rounded-xl overflow-hidden sticky top-20">
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <TribesIcon className="w-4 h-4 text-purple-400" />
          <h3 className="font-medium text-sm">Popular Tribes</h3>
        </div>
      </div>
      
      <div className="divide-y divide-white/10">
        <button
          onClick={() => onTribeSelect(null)}
          className={`w-full px-3 py-2 flex items-center gap-1.5 text-xs transition-colors ${
            !selectedTribe ? 'bg-purple-600' : 'hover:bg-white/5'
          }`}
        >
          <Sparkles size={14} />
          <span>All Tribes</span>
        </button>

        {tribes.map(tribe => (
          <button
            key={tribe.id}
            onClick={() => onTribeSelect(tribe.id)}
            className={cn(
              "w-full px-3 py-2.5 flex flex-col items-start gap-1 transition-all text-left",
              selectedTribe === tribe.id
                ? "bg-gradient-to-r " + tribe.color
                : "hover:bg-white/5"
            )}
          >
            <div className="flex items-center gap-2 text-sm">
              {tribe.icon}
              <span className="font-medium">r/{tribe.name}</span>
            </div>
            
            <div className="text-xs text-gray-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {(tribe.members/1000).toFixed(1)}k
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  {tribe.online} online
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tribes;