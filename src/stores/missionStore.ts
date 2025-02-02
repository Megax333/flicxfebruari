import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LucideIcon } from 'lucide-react';
import { Hexagon, Pentagon, Octagon, Circle, Diamond } from 'lucide-react';

interface Tier {
  name: string;
  createIcon: () => JSX.Element;
  color: string;
  requiredXP: number;
}

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

interface MissionStore {
  userXP: number;
  missions: Mission[];
  currentTier: Tier | null;
  tiers: Tier[];
  progress: number;
  updateXP: (xp: number) => void;
  completeMission: (missionId: string) => void;
}

const createTierIcon = (Icon: LucideIcon, color: string, pulseEffect = false) => () => ({
  type: 'div',
  props: {
    className: 'relative',
    children: [
      {
        type: Icon,
        props: {
          className: `text-${color}`,
          'aria-hidden': true
        }
      },
      {
        type: 'div',
        props: {
          className: 'absolute inset-0 flex items-center justify-center',
          children: [
            {
              type: 'div',
              props: {
                className: `w-1.5 h-1.5 bg-${color} rounded-full${pulseEffect ? ' animate-pulse' : ''}`
              }
            }
          ]
        }
      }
    ]
  }
});

const tiers: Tier[] = [
  { 
    name: 'Bronze', 
    createIcon: createTierIcon(Hexagon, 'amber-600', false),
    color: 'from-amber-600 to-amber-400',
    requiredXP: 0 
  },
  { 
    name: 'Silver', 
    createIcon: createTierIcon(Pentagon, 'gray-400', false),
    color: 'from-gray-400 to-gray-300', 
    requiredXP: 1000 
  },
  { 
    name: 'Sapphire', 
    createIcon: createTierIcon(Octagon, 'blue-500', true),
    color: 'from-blue-500 to-blue-400', 
    requiredXP: 5000 
  },
  { 
    name: 'Ruby', 
    createIcon: createTierIcon(Circle, 'red-500', true),
    color: 'from-red-500 to-red-400', 
    requiredXP: 10000 
  },
  { 
    name: 'Diamond', 
    createIcon: createTierIcon(Diamond, 'sky-400', true),
    color: 'from-sky-400 to-sky-300', 
    requiredXP: 25000 
  }
];

export const useMissionStore = create<MissionStore>()(
  persist(
    (set, get) => ({
      userXP: 2500,
      missions: [],
      tiers,
      currentTier: null,
      progress: 0,

      updateXP: (xp) => {
        set((state) => {
          const newXP = state.userXP + xp;
          const currentTier = state.tiers.reduce((prev, curr) => 
            newXP >= curr.requiredXP ? curr : prev
          );
          
          const nextTier = state.tiers[state.tiers.indexOf(currentTier) + 1];
          const progress = nextTier 
            ? ((newXP - currentTier.requiredXP) / (nextTier.requiredXP - currentTier.requiredXP)) * 100
            : 100;

          return {
            userXP: newXP,
            currentTier,
            progress
          };
        });
      },

      completeMission: (missionId) => {
        set((state) => ({
          missions: state.missions.map(mission => 
            mission.id === missionId
              ? { ...mission, completed: true }
              : mission
          )
        }));
      }
    }),
    {
      name: 'mission-store',
      onRehydrateStorage: () => (state) => {
        // Calculate current tier on rehydration
        if (state) {
          const currentTier = tiers.reduce((prev, curr) => 
            state.userXP >= curr.requiredXP ? curr : prev
          );
          
          const nextTier = tiers[tiers.indexOf(currentTier) + 1];
          const progress = nextTier 
            ? ((state.userXP - currentTier.requiredXP) / (nextTier.requiredXP - currentTier.requiredXP)) * 100
            : 100;

          state.currentTier = currentTier;
          state.progress = progress;
        }
      }
    }
  )
);