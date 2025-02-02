import React from 'react';
import { Users, Radio } from 'lucide-react';

const LiveSection = () => {
  const liveContent = [
    {
      id: 1,
      title: "Tech Talk Live",
      host: "Sarah Wilson",
      viewers: 1234,
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Gaming Hour",
      host: "Alex Chen",
      viewers: 856,
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop"
    }
  ];

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <Radio size={24} className="text-red-500" />
        <h2 className="text-2xl font-bold">Live Now</h2>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {liveContent.map((item) => (
          <div key={item.id} className="relative rounded-xl overflow-hidden group">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-red-500 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                LIVE
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Hosted by {item.host}</span>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{item.viewers}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiveSection;