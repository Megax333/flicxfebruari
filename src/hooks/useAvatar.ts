import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Get the Supabase URL from environment variables or use the default
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wdbcwawakmyijhbwbdkt.supabase.co';

/**
 * Custom hook for handling avatar URLs with proper fallbacks
 * @param userId The user ID to get avatar for
 * @param initialAvatarUrl Optional initial avatar URL
 * @returns An object with the avatar URL and loading state
 */
export const useAvatar = (userId: string, initialAvatarUrl?: string | null) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl || null);
  const [isLoading, setIsLoading] = useState(!initialAvatarUrl);
  const [error, setError] = useState<Error | null>(null);

  // Generate a fallback avatar URL using DiceBear
  const getFallbackAvatarUrl = (id: string) => {
    return `https://api.dicebear.com/7.x/avatars/svg?seed=${id}`;
  };

  // Convert a storage path to a public URL
  const getPublicUrl = (path: string) => {
    if (!path) return null;
    
    // If it's already a full URL, return it
    if (path.startsWith('http')) return path;
    
    // Handle storage paths - try multiple formats
    if (path.startsWith('avatars/')) {
      // Log for debugging
      console.log('Converting storage path to URL:', path);
      
      // Try direct URL construction first
      const directUrl = `${SUPABASE_URL}/storage/v1/object/public/user-content/${path}`;
      console.log('Constructed direct URL:', directUrl);
      
      // Also try the Supabase API method for comparison
      try {
        const { data } = supabase.storage.from('user-content').getPublicUrl(path);
        console.log('Supabase API URL:', data?.publicUrl);
        
        // Return the API URL if available
        if (data?.publicUrl) return data.publicUrl;
      } catch (err) {
        console.error('Error getting public URL via API:', err);
      }
      
      return directUrl;
    }
    
    return path;
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        console.log('useAvatar hook called with:', { userId, initialAvatarUrl });
        
        // If we already have a valid URL that starts with http, use it
        if (initialAvatarUrl && initialAvatarUrl.startsWith('http')) {
          console.log('Using direct HTTP URL:', initialAvatarUrl);
          setAvatarUrl(initialAvatarUrl);
          setIsLoading(false);
          return;
        }

        // If it's a storage path, convert it
        if (initialAvatarUrl && initialAvatarUrl.startsWith('avatars/')) {
          console.log('Converting storage path:', initialAvatarUrl);
          const publicUrl = getPublicUrl(initialAvatarUrl);
          if (publicUrl) {
            console.log('Converted to public URL:', publicUrl);
            setAvatarUrl(publicUrl);
            setIsLoading(false);
            return;
          }
        }

        // If we don't have a valid URL, fetch directly from user_profiles
        console.log('Fetching avatar from user_profiles for user:', userId);
        const { data, error } = await supabase
          .from('user_profiles')
          .select('avatar_url')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('Error fetching avatar:', error);
          setAvatarUrl(getFallbackAvatarUrl(userId));
        } else if (data && data.avatar_url) {
          console.log('Found avatar_url in database:', data.avatar_url);
          const publicUrl = getPublicUrl(data.avatar_url);
          console.log('Converted to public URL:', publicUrl);
          setAvatarUrl(publicUrl || getFallbackAvatarUrl(userId));
        } else {
          console.log('No avatar found, using fallback for user:', userId);
          // Fallback to generated avatar
          setAvatarUrl(getFallbackAvatarUrl(userId));
        }
      } catch (err) {
        console.error('Error in useAvatar hook:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setAvatarUrl(getFallbackAvatarUrl(userId));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvatar();
  }, [userId, initialAvatarUrl]);

  return { 
    avatarUrl, 
    isLoading, 
    error, 
    fallbackUrl: getFallbackAvatarUrl(userId) 
  };
};
