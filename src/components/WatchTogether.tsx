import React from 'react';
import { Play, Users, MessageCircle, Share2, Mic, Video, Volume2, Crown, Star, Gamepad, Film, Tv } from 'lucide-react';
import { cn } from '../utils/cn';
import WatchTogetherModal from './WatchTogetherModal';
import { useState } from 'react';

const WatchTogether = () => {
  const [activeSession, setActiveSession] = useState(null);

  const sessions = [
    {
      id: 1,
      title: "The Last Frontier - Episode 5",
      description: "Join us for the latest episode of this epic sci-fi series",
      host: "Alex Chen",
      category: "Sci-Fi",
      participants: [
        { id: 1, name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
        { id: 2, name: "Emma Wilson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }
      ],
      thumbnail: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=450&fit=crop",
      viewers: 234,
      isLive: true,
      startTime: "Live Now"
    },
    {
      id: 2,
      title: "Nature's Secrets - New Episode",
      description: "Explore the hidden wonders of our natural world",
      host: "Sarah Thompson",
      category: "Documentary",
      participants: [
        { id: 3, name: "Sarah Thompson", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
        { id: 4, name: "John Doe", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
        { id: 5, name: "Lisa Brown", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" }
      ],
      thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=450&fit=crop",
      viewers: 156,
      startTime: "Live Now"
    },
    {
      id: 3,
      title: "Quantum Legends Marathon",
      description: "Back-to-back episodes of the hit sci-fi series",
      host: "David Kim",
      category: "Sci-Fi",
      participants: [
        { id: 6, name: "David Kim", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }
      ],
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop",
      viewers: 342,
      startTime: "Starting in 10 minutes"
    },
    {
      id: 4,
      title: "Anime Night: Neo Tokyo",
      description: "Weekly anime watch party",
      host: "Yuki Tanaka",
      category: "Anime",
      participants: [
        { id: 7, name: "Yuki Tanaka", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" }
      ],
      thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=450&fit=crop",
      viewers: 189,
      startTime: "Starting in 30 minutes"
    },
    {
      id: 5,
      title: "Gaming Highlights",
      description: "Best gaming moments of the week",
      host: "Marcus Chen",
      category: "Gaming",
      participants: [
        { id: 8, name: "Marcus Chen", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" }
      ],
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop",
      viewers: 276,
      startTime: "Starting in 1 hour"
    },
    {
      id: 6,
      title: "Movie Classics Night",
      description: "Watching timeless classics together",
      host: "Emma Roberts",
      category: "Movies",
      participants: [
        { id: 9, name: "Emma Roberts", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" }
      ],
      thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=450&fit=crop",
      viewers: 145,
      startTime: "Starting in 2 hours"
    }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Sci-Fi': return <Star className="text-purple-400" />;
      case 'Gaming': return <Gamepad className="text-green-400" />;
      case 'Anime': return <Crown className="text-yellow-400" />;
      case 'Movies': return <Film className="text-blue-400" />;
      case 'Documentary': return <Tv className="text-red-400" />;
      default: return <Film className="text-gray-400" />;
    }
  };
  return (
    <div className="mt-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Watch Together</h2>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full">
          <Video size={20} />
          Host Session
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="group bg-[#1E1E2A] rounded-xl overflow-hidden hover:bg-[#2A2A3A] transition-all duration-300">
            <div className="relative">
              <img
                src={session.thumbnail}
                alt={session.title}
                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(session.category)}
                    <span className="text-xs font-medium">{session.category}</span>
                  </div>
                  {session.isLive && (
                    <span className="flex items-center gap-1 bg-red-500 px-2 py-0.5 rounded-full text-xs font-bold">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                      LIVE
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs">
                    <Users size={12} />
                    {session.viewers}
                  </span>
                </div>
                <h3 className="text-lg font-semibold leading-tight mb-1">{session.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-1">{session.description}</p>
              </div>
              <button 
                onClick={() => setActiveSession(session)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600/90 hover:bg-purple-600 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100"
              >
                <Play size={24} fill="white" />
              </button>
            </div>

            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={session.participants[0].avatar}
                  alt={session.host}
                  className="w-8 h-8 rounded-full ring-2 ring-purple-600"
                />
                <div>
                  <div className="text-sm font-medium">{session.host}</div>
                  <div className="text-xs text-gray-400">{session.startTime}</div>
                </div>
              </div>

              <div className="flex -space-x-2 mb-3">
                {session.participants.slice(1).map((participant) => (
                  <img
                    key={participant.id}
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-8 h-8 rounded-full border-2 border-[#1E1E2A] group-hover:border-[#2A2A3A]"
                    title={participant.name}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveSession(session)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Play size={16} />
                  Join Session
                </button>
                <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {activeSession && (
        <WatchTogetherModal
          session={activeSession}
          onClose={() => setActiveSession(null)}
        />
      )}
    </div>
  );
};

export default WatchTogether;