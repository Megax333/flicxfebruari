import React from 'react';
import { Play, Plus } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative mt-16 rounded-2xl overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1400&h=600&fit=crop"
        alt="Featured Content"
        className="w-full h-[500px] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent flex items-center">
        <div className="ml-12 max-w-xl">
          <h1 className="text-5xl font-bold mb-4">The Last Frontier</h1>
          <p className="text-lg text-gray-300 mb-6">
            Experience the untold story of humanity's greatest adventure. Join our heroes as they venture into the unknown.
          </p>
          <div className="flex gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full flex items-center gap-2">
              <Play size={20} fill="white" />
              Play Now
            </button>
            <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full flex items-center gap-2">
              <Plus size={20} />
              Add to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;