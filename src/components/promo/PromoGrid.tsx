import React from 'react';
import { useEffect, useRef, useState } from 'react';
import PromoCard from './PromoCard';
import { usePromos } from '../../hooks/usePromos';
import { Loader } from 'lucide-react';

const PromoGrid = () => {
  const { promos, loadMore, hasMore, isLoading } = usePromos();
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {promos.map((promo) => (
          <PromoCard key={promo.id} promo={promo} />
        ))}
      </div>
      
      <div ref={loader} className="flex justify-center py-8">
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader className="animate-spin" size={20} />
            <span>Loading more offers...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoGrid;