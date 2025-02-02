import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';

const MissionIcon = ({ className = '' }: { className?: string }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="relative cursor-pointer">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-blue-600/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      {/* Icon Container */}
      <button className="relative p-2 bg-[#2A2A3A] rounded-lg transition-all duration-300 group hover:bg-[#3A3A4A]">
        <div className="relative">
          {/* Open Book Icon */}
          <BookOpen 
            className={`${className} text-white transition-colors group-hover:text-white`} 
            size={20}
          />
        </div>
      </button>
    </div>
  );
};

export default MissionIcon;