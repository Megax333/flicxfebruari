import { useState } from 'react';

export const usePromo = () => {
  const [isCreating, setIsCreating] = useState(false);

  return {
    isCreating,
    setIsCreating,
  };
};