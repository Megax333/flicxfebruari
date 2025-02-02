import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
}

interface FeaturedCreatorsStore {
  creators: Creator[];
  loading: boolean;
  error: string | null;
  lastUpdate: number;
  initializeCreators: () => Promise<void>;
  updateCreator: (id: string, updates: Partial<Creator>) => Promise<void>;
}

export const useFeaturedCreatorsStore = create<FeaturedCreatorsStore>((set, get) => ({
  creators: [],
  loading: false,
  error: null,
  lastUpdate: Date.now(),

  initializeCreators: async () => {
    set({ loading: true, error: null });

    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('username', 'admin')
        .order('username')
        .limit(9);

      if (error) throw error;

      const creators = profiles.map(profile => ({
        id: profile.id,
        name: profile.username || '',
        username: profile.username || '',
        avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&background=random`,
        bio: profile.bio || ''
      }));

      set({ 
        creators, 
        loading: false, 
        error: null,
        lastUpdate: Date.now()
      });
    } catch (err) {
      console.error('Error loading creators:', err);
      set({ 
        error: err.message || 'Failed to load creators', 
        loading: false 
      });
    }
  },

  updateCreator: async (id: string, updates: Partial<Creator>) => {
    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          avatar_url: updates.avatar,
          bio: updates.bio
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      set(state => ({
        creators: state.creators.map(creator =>
          creator.id === id ? { ...creator, ...updates } : creator
        ),
        lastUpdate: Date.now()
      }));
    } catch (err) {
      console.error('Error updating creator:', err);
      throw err;
    }
  }
}));