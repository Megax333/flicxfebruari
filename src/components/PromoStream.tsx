import React from 'react';
import { Plus } from 'lucide-react';

const PromoStream = () => {
  return (
    <div className="min-h-[600px] bg-[#1E1E2A] rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="bg-purple-600/20 p-4 rounded-full inline-block mb-4">
          <Plus size={32} className="text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Create Promo Stream</h3>
        <p className="text-gray-400 mb-6">Start promoting your content to reach a wider audience</p>
        <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default PromoStream;