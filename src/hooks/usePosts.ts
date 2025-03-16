import { useState, useEffect } from 'react';
import { ThoughtPost } from '../types/thoughts';
import * as postsService from '../services/postsService';

type SortOption = 'hot' | 'new' | 'top';

export const usePosts = (tribe: string | null) => {
  const [posts, setPosts] = useState<ThoughtPost[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('hot');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the postsService to get sorted posts
        const fetchedPosts = await postsService.getSortedPosts(tribe, sortBy);
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [tribe, sortBy]);

  return { posts, sortBy, setSortBy, loading, error };
};