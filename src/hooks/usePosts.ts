import { useState, useEffect } from 'react';
import { thoughtPosts } from '../data/thoughtsData';

type SortOption = 'hot' | 'new' | 'top';

export const usePosts = (tribe: string | null) => {
  const [posts, setPosts] = useState(thoughtPosts);
  const [sortBy, setSortBy] = useState<SortOption>('hot');

  useEffect(() => {
    let filteredPosts = [...thoughtPosts];
    
    // Filter by tribe if selected
    if (tribe) {
      filteredPosts = filteredPosts.filter(post => post.tribe === tribe);
    }

    // Sort posts based on selected option
    switch (sortBy) {
      case 'hot':
        filteredPosts.sort((a, b) => 
          (b.likes + b.comments) - (a.likes + a.comments)
        );
        break;
      case 'new':
        filteredPosts.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        break;
      case 'top':
        filteredPosts.sort((a, b) => b.likes - a.likes);
        break;
    }

    setPosts(filteredPosts);
  }, [tribe, sortBy]);

  return { posts, sortBy, setSortBy };
};