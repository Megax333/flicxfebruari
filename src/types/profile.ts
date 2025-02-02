import type { ThoughtPost } from './thoughts';

export interface Profile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  location?: string;
  website?: string;
  joinedAt: string;
  isVerified: boolean;
  followers: number;
  following: number;
  thoughts: ThoughtPost[];
  projects: Project[];
  highlights: Highlight[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  status: 'in-progress' | 'completed';
  progress: number;
  updatedAt: string;
}

export interface Highlight {
  id: string;
  title: string;
  description: string;
  media: string;
  type: 'image' | 'video';
  createdAt: string;
}