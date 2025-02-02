import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string;
  followers_count: number;
  following_count: number;
}

export const useProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setProfile(data);

        // Check if current user is following this profile
        const { data: user } = await supabase.auth.getUser();
        if (user?.user?.id) {
          const { count } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('follower_id', user.user.id)
            .eq('following_id', userId);
          
          setIsFollowing(count === 1);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const toggleFollow = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) throw new Error('Not authenticated');
      if (!profile?.id) throw new Error('No profile to follow');

      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.user.id)
          .eq('following_id', profile.id);

        if (error) throw error;
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.user.id,
            following_id: profile.id
          });

        if (error) throw error;
      }

      setIsFollowing(!isFollowing);
      return true;
    } catch (err) {
      console.error('Error toggling follow:', err);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    isFollowing,
    toggleFollow
  };
};