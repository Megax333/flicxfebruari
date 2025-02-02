import React from 'react';
import { X } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import ProfilePage from '../pages/ProfilePage';

const TempProfileModal = () => {
  const { activeProfile, hideProfile } = useProfile();

  if (!activeProfile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={hideProfile} />
      <div className="relative w-[1000px] h-screen bg-[#1E1E2A] rounded-xl overflow-hidden shadow-xl">
        <button
          onClick={hideProfile}
          className="absolute top-4 right-4 z-50 p-2 bg-[#2A2A3A] hover:bg-[#3A3A4A] rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        <div className="h-full overflow-y-auto">
          <ProfilePage />
        </div>
      </div>
    </div>
  );
};

export default TempProfileModal;