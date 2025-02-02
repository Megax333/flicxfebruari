import React from 'react';
import { useProfile } from '../context/ProfileContext';

interface UserNameProps {
  name: string;
  handle: string;
  showHandle?: boolean;
  className?: string;
}

const UserName = ({ name, handle, showHandle = true, className = '' }: UserNameProps) => {
  const { showProfile } = useProfile();
  
  return (
    <button 
      onClick={() => showProfile(handle)}
      className={`group text-left ${className}`}
    >
      <span className="font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
        {name}
      </span>
      {showHandle && (
        <span className="text-gray-400 ml-2">@{handle}</span>
      )}
    </button>
  );
};

export default UserName;