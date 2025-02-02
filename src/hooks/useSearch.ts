import { useState } from 'react';

const defaultRecentSearches = [
  'Neo-Tokyo Chronicles',
  'Quantum Legends',
  'Animation tutorials'
];

const defaultTrendingSearches = [
  { text: 'Digital Horizons Episode 5' },
  { text: 'Creative Process Series' },
  { text: 'Behind the Scenes: VFX' }
];

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [recentSearches] = useState(defaultRecentSearches);
  const [trendingSearches] = useState(defaultTrendingSearches);

  const addRecentSearch = (search: string) => {
    // Implementation for adding recent searches can be added here if needed
    console.log('Adding recent search:', search);
  };

  return {
    query,
    setQuery,
    recentSearches,
    addRecentSearch,
    trendingSearches
  };
};