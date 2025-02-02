import React from 'react';
import { Bookmark } from 'lucide-react';

const SavedPage = () => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-6">
        <Bookmark className="text-purple-400" size={24} />
        <h1 className="text-2xl font-bold">Saved Content</h1>
      </div>
      {/* Add saved content implementation */}
    </div>
  );
};

export default SavedPage;