import React from 'react';
import ContentGrid from '../components/ContentGrid';

const DiscoverPage = () => {
  return (
    <div className="p-4">
      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl mb-8">
        Go Premium
      </button>
      <ContentGrid />
    </div>
  );
};

export default DiscoverPage;