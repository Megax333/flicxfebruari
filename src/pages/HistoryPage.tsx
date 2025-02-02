import React from 'react';
import { History } from 'lucide-react';

const HistoryPage = () => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-6">
        <History className="text-purple-400" size={24} />
        <h1 className="text-2xl font-bold">Watch History</h1>
      </div>
      {/* Add history implementation */}
    </div>
  );
};

export default HistoryPage;