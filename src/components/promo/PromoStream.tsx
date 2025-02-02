import React from 'react';
import PromoHeader from './PromoHeader';
import PromoGrid from './PromoGrid';
import PromoSidebar from './PromoSidebar';
import PromoCreate from './PromoCreate';
import { usePromo } from '../../hooks/usePromo';

const PromoStream = () => {
  const { isCreating, setIsCreating } = usePromo();

  return (
    <div className="min-h-screen">
      <PromoHeader onCreateClick={() => setIsCreating(true)} />
      
      <div>
        <PromoGrid />
      </div>

      {isCreating && <PromoCreate onClose={() => setIsCreating(false)} />}
    </div>
  );
};

export default PromoStream;