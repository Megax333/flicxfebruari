import React from 'react';
import { useProfile } from '../context/ProfileContext';

interface UserAvatarProps {
  src: string;
  alt: string;
  handle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const UserAvatar = ({ src, alt, handle, size = 'md', className = '' }: UserAvatarProps) => {
  const { showProfile } = useProfile();
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-20 h-20'
  };

  return (
    <button 
      onClick={() => handle && showProfile(handle)}
      className={`relative group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-transparent group-hover:border-purple-500 transition-all z-10 relative`}
      />
    </button>
  );
};

export default UserAvatar;