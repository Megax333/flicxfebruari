import { supabase } from '../lib/supabase';
import type { ThoughtPost } from '../types/thoughts';

// Get the Supabase URL from environment variables or use the default
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wdbcwawakmyijhbwbdkt.supabase.co';

/**
 * Generate a reliable avatar URL using the same approach as the sidebar
 * @param avatarUrl The avatar URL from the database
 * @param name Fallback user name
 * @param userId Fallback user ID
 * @returns A reliable avatar URL
 */
const getAvatarUrl = (avatarUrl: string | null, name: string | null, userId: string): string => {
  // If we have a valid avatar URL in the database, use it directly
  if (avatarUrl && avatarUrl.startsWith('http')) {
    return avatarUrl;
  }
  
  // If we have a storage path, convert it to a public URL
  if (avatarUrl && (avatarUrl.startsWith('avatars/') || !avatarUrl.startsWith('http'))) {
    try {
      // Use the Supabase storage API to get the public URL
      const { data } = supabase.storage
        .from('user-content')
        .getPublicUrl(avatarUrl);
        
      if (data?.publicUrl) {
        console.log('Using Supabase storage URL:', data.publicUrl);
        return data.publicUrl;
      }
    } catch (error) {
      console.error('Error getting public URL from Supabase storage:', error);
    }
  }
  
  // Fallback to UI Avatars service
  const displayName = name || userId.substring(0, 2);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
};

/**
 * Convert a storage path to a public URL - FIXED VERSION
 * @param path The storage path
 * @returns The public URL or null
 */
const getPublicUrl = (path: string | null): string | null => {
  if (!path) return null;
  
  // If it's already a full URL, return it
  if (path.startsWith('http')) return path;
  
  // Handle storage paths
  if (path.startsWith('avatars/')) {
    try {
      // Try using the Supabase API first
      const { data } = supabase.storage
        .from('user-content')
        .getPublicUrl(path);
        
      if (data?.publicUrl) {
        console.log('Using Supabase API URL:', data.publicUrl);
        return data.publicUrl;
      }
    } catch (error) {
      console.error('Error getting public URL from Supabase API:', error);
    }
    
    // Fallback to manual URL construction
    console.log('Using manual URL construction for:', path);
    return `${SUPABASE_URL}/storage/v1/object/public/user-content/${path}`;
  }
  
  return path;
};

/**
 * Generate a fallback avatar URL using DiceBear
 * @param id The user ID or name to generate avatar for
 * @returns The fallback avatar URL
 */
const getFallbackAvatarUrl = (id: string): string => {
  // Use initials style which is more reliable than avatars
  const encodedId = encodeURIComponent(id);
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodedId}`;
};

// Function to fetch posts, optionally filtered by tribe
export async function fetchPosts(tribe?: string | null): Promise<ThoughtPost[]> {
  console.log('Fetching posts...', { tribe });
  
  try {
    let query = supabase
      .from('community_posts_with_authors')
      .select('*')
      .order('created_at', { ascending: false });

    if (tribe) {
      query = query.eq('tribe', tribe);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Failed to fetch posts');
    }

    if (!data) {
      console.log('No posts found');
      return [];
    }

    console.log('Posts fetched successfully:', data.length);

    // Transform the data to match our ThoughtPost type
    return data.map(post => {
      // Process avatar URL using the same approach as the sidebar
      const avatarUrl = getAvatarUrl(post.author_avatar, post.author_name, post.user_id);
      console.log('Processed avatar URL:', avatarUrl, 'Original:', post.author_avatar);
      
      return {
        id: post.id,
        type: post.post_type,
        author: {
          id: post.user_id,
          name: post.author_name || 'Anonymous User',
          handle: post.author_handle || 'anonymous',
          avatar: avatarUrl
        },
        content: post.content || '',
        timestamp: post.created_at || new Date().toISOString(),
        likes: post.likes || 0,
        comments: post.comments || 0,
        shares: post.shares || 0,
        media: post.media_url || null,
        audioUrl: post.audio_url || null,
        tribe: post.tribe || null
      };
    });
  } catch (error) {
    console.error('Error in fetchPosts:', error);
    throw error;
  }
}

// Function to create a new post
export async function createPost(
  content: string,
  tribe?: string,
  mediaUrl?: string,
  audioUrl?: string,
  postType?: string
): Promise<ThoughtPost | null> {
  console.log('Creating post...', { content, tribe, mediaUrl, audioUrl, postType });

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('User not authenticated');
      throw new Error('User not authenticated');
    }

    const { data: newPost, error: insertError } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        content,
        tribe,
        media_url: mediaUrl,
        audio_url: audioUrl,
        post_type: postType
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating post:', insertError);
      throw new Error('Failed to create post');
    }

    // Fetch the created post with author information
    const { data: postWithAuthor, error: fetchError } = await supabase
      .from('community_posts_with_authors')
      .select('*')
      .eq('id', newPost.id)
      .single();

    if (fetchError) {
      console.error('Error fetching created post:', fetchError);
      throw new Error('Failed to fetch created post');
    }

    // Process avatar URL using the same approach as the sidebar
    const avatarUrl = getAvatarUrl(
      postWithAuthor.author_avatar, 
      postWithAuthor.author_name, 
      postWithAuthor.user_id
    );
    
    console.log('Post created with avatar:', avatarUrl, 'Original:', postWithAuthor.author_avatar);

    // Return the post with author information
    return {
      id: postWithAuthor.id,
      type: postWithAuthor.post_type,
      author: {
        id: postWithAuthor.user_id,
        name: postWithAuthor.author_name || 'Anonymous User',
        handle: postWithAuthor.author_handle || 'anonymous',
        avatar: avatarUrl
      },
      content: postWithAuthor.content || '',
      timestamp: postWithAuthor.created_at || new Date().toISOString(),
      likes: postWithAuthor.likes || 0,
      comments: postWithAuthor.comments || 0,
      shares: postWithAuthor.shares || 0,
      media: postWithAuthor.media_url || null,
      audioUrl: postWithAuthor.audio_url || null,
      tribe: postWithAuthor.tribe || null
    };
  } catch (error) {
    console.error('Error in createPost:', error);
    throw error;
  }
}

// Function to like/unlike a post
export async function togglePostLike(postId: string, isLiked: boolean): Promise<void> {
  try {
    // Call the appropriate function based on whether we're liking or unliking
    const functionName = isLiked ? 'increment_post_likes' : 'decrement_post_likes';
    
    const { error } = await supabase.rpc(functionName, { post_id: postId });
    
    if (error) {
      console.error(`Error ${isLiked ? 'liking' : 'unliking'} post:`, error);
      throw new Error(`Failed to ${isLiked ? 'like' : 'unlike'} post`);
    }
    
    console.log(`Post ${isLiked ? 'liked' : 'unliked'} successfully`);
  } catch (error) {
    console.error('Error in togglePostLike:', error);
    throw error;
  }
}

// Function to get posts sorted by criteria
export async function getSortedPosts(
  tribe: string | null, 
  sortBy: 'hot' | 'new' | 'top'
): Promise<ThoughtPost[]> {
  try {
    // First, fetch all posts
    const posts = await fetchPosts(tribe);
    
    // Then sort based on criteria
    switch (sortBy) {
      case 'new':
        // Already sorted by created_at desc from the database
        return posts;
      case 'top':
        // Sort by likes count
        return [...posts].sort((a, b) => b.likes - a.likes);
      case 'hot':
        // Sort by a combination of recency and popularity
        return [...posts].sort((a, b) => {
          const aScore = calculateHotScore(a);
          const bScore = calculateHotScore(b);
          return bScore - aScore;
        });
      default:
        return posts;
    }
  } catch (error) {
    console.error('Error in getSortedPosts:', error);
    throw error;
  }
}

// Helper function to calculate a "hot" score based on likes and recency
function calculateHotScore(post: ThoughtPost): number {
  const hoursAge = (Date.now() - new Date(post.timestamp).getTime()) / (1000 * 60 * 60);
  return post.likes / Math.pow(hoursAge + 2, 1.5); // Simple algorithm similar to Reddit's
}
