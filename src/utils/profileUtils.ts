import type { Profile } from '../types/profile';

const profiles: Profile[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    handle: 'sarahchen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop',
    bio: 'Animation Director & Story Artist | Creating worlds at Celflicks',
    location: 'Los Angeles, CA',
    website: 'https://sarahchen.art',
    joinedAt: '2023-01-15',
    isVerified: true,
    followers: 12500,
    following: 891,
    thoughts: [], // Populate with actual thoughts
    projects: [], // Populate with actual projects
    highlights: [] // Populate with actual highlights
  }
  // Add more profiles
];

export const getUserProfile = (handle: string): Profile | undefined => {
  return profiles.find(profile => profile.handle === handle);
};