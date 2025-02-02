import React from 'react';
import { Clock, Star, Video, MessageSquare, Calendar, Users, Sparkles, BookOpen } from 'lucide-react';

const Counseling = () => {
  const mentors = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Animation Director & Story Artist",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      rate: 85,
      rating: 4.9,
      reviews: 127,
      expertise: ["Character Design", "Storyboarding", "Animation Direction"],
      availability: "Next available: Today",
      background: "Former Pixar, DreamWorks",
      languages: ["English", "Mandarin"]
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      title: "VFX Supervisor & Technical Director",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      rate: 120,
      rating: 5.0,
      reviews: 89,
      expertise: ["VFX Pipeline", "Technical Direction", "Production Workflow"],
      availability: "Next available: Tomorrow",
      background: "Marvel Studios, ILM",
      languages: ["English", "Spanish"]
    },
    {
      id: 3,
      name: "Aisha Patel",
      title: "Screenwriter & Story Consultant",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      rate: 95,
      rating: 4.8,
      reviews: 156,
      expertise: ["Script Development", "Story Structure", "Character Arc"],
      availability: "Next available: Today",
      background: "Netflix, HBO",
      languages: ["English", "Hindi"]
    },
    {
      id: 4,
      name: "David Kim",
      title: "Game Design & Narrative Director",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      rate: 110,
      rating: 4.9,
      reviews: 94,
      expertise: ["Game Design", "Narrative Design", "Player Experience"],
      availability: "Next available: Thursday",
      background: "Naughty Dog, Bungie",
      languages: ["English", "Korean"]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-8 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-4">Creative Project Counseling</h1>
          <p className="text-gray-300 text-lg mb-6">
            Get unstuck with personalized 1-on-1 guidance from industry experts. Whether you're facing creative blocks, technical challenges, or need strategic direction, our mentors are here to help.
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-purple-600/20 px-4 py-2 rounded-lg">
              <Video size={20} className="text-purple-400" />
              <span>Live Video Sessions</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-600/20 px-4 py-2 rounded-lg">
              <MessageSquare size={20} className="text-purple-400" />
              <span>Chat Support</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-600/20 px-4 py-2 rounded-lg">
              <BookOpen size={20} className="text-purple-400" />
              <span>Resource Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-2 gap-6">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="bg-[#1E1E2A] rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex gap-6">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{mentor.name}</h3>
                      <p className="text-gray-400 mb-2">{mentor.title}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">{mentor.rating}</span>
                      <span className="text-gray-400">({mentor.reviews})</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{mentor.background}</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.languages.map((lang) => (
                      <span key={lang} className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill) => (
                    <span key={skill} className="text-sm bg-[#2A2A3A] px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-green-400">
                    <Clock size={16} />
                    <span>{mentor.availability}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-purple-400" />
                    <span>1-on-1 Sessions</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700/50 p-6 flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">${mentor.rate}</div>
                <div className="text-sm text-gray-400">per hour</div>
              </div>
              <div className="flex gap-3">
                <button className="bg-[#2A2A3A] hover:bg-[#3A3A4A] px-4 py-2 rounded-lg flex items-center gap-2">
                  <Calendar size={18} />
                  View Schedule
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2">
                  <Sparkles size={18} />
                  Book Session
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Counseling;