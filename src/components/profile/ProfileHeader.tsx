import React from 'react';
import { Users, Link2, MapPin, Calendar } from 'lucide-react';
import type { Profile } from '../../types/profile';

interface ProfileHeaderProps {
  profile: Profile;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-64 bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
        {profile.coverImage && (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-6 pb-6">
        <div className="relative -mt-24">
          <div className="flex justify-between items-end mb-4">
            <div className="flex items-end">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-36 h-36 rounded-full border-4 border-[#0A0A0F]"
                />
                {profile.isVerified && (
                  <div className="absolute bottom-2 right-2 bg-purple-600 p-1.5 rounded-full">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <div className="ml-6 mb-4">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-gray-400">@{profile.handle}</p>
              </div>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full">
              Follow
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-lg">{profile.bio}</p>

            <div className="flex flex-wrap gap-6 text-gray-400">
              {profile.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
                >
                  <Link2 size={18} />
                  <span>{new URL(profile.website).hostname}</span>
                </a>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>Joined {new Date(profile.joinedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-6">
              <button className="flex items-center gap-2 hover:text-purple-400">
                <Users size={18} />
                <span className="font-bold">{profile.following.toLocaleString()}</span>
                <span className="text-gray-400">Following</span>
              </button>
              <button className="flex items-center gap-2 hover:text-purple-400">
                <Users size={18} />
                <span className="font-bold">{profile.followers.toLocaleString()}</span>
                <span className="text-gray-400">Followers</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;