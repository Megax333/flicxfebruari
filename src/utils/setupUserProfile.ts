import { supabase } from '../lib/supabaseClient';

export const setupUserProfile = async (
  userId: string,
  username: string,
  avatarUrl?: string
) => {
  try {
    const { error } = await supabase.rpc('setup_user_profile', {
      user_id: userId,
      username: username,
      avatar_url: avatarUrl
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error setting up user profile:', error);
    return { success: false, error };
  }
};
