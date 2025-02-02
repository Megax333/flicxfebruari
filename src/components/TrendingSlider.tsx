import React from 'react';
import { Play } from 'lucide-react';

const TrendingSlider = () => {
  const trending = [
    {
      id: 1,
      title: "Cosmic Journeys",
      views: "2.1M",
      thumbnail: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Lost Cities",
      views: "1.8M",
      thumbnail: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Ancient Mysteries",
      views: "1.5M",
      thumbnail: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=250&fit=crop"
    }
  ];

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
      {trending.map((item) => (
        <div
          key={item.id}
          className="relative flex-shrink-0 w-[400px] rounded-xl overflow-hidden group"
        >
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{item.title}</h3>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{item.views} views</span>
                <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full flex items-center gap-2">
                  <Play size={16} fill="white" />
                  Watch Now
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingSlider;