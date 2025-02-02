import React from 'react';
import { Users, Globe, Calendar, Mail, Link as LinkIcon, MoreHorizontal } from 'lucide-react';
import { cn } from '../../utils/cn';

interface UserDetailsPanelProps {
  contact: {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'idle' | 'dnd';
  };
}

const UserDetailsPanel = ({ contact }: UserDetailsPanelProps) => {
  const userDetails = {
    bio: "Animation Director & Story Artist | Creating worlds at Celflicks",
    location: "Los Angeles, CA",
    website: "https://sarahchen.art",
    email: "sarah@celflicks.com",
    joinedDate: "January 2023",
    followers: 12500,
    following: 891,
    mutualServers: 3,
    recentActivity: [
      { type: 'project', name: 'Neo-Tokyo Chronicles', time: '2 hours ago' },
      { type: 'post', name: 'Animation Update', time: '5 hours ago' },
      { type: 'stream', name: 'Character Design Session', time: '1 day ago' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-60 bg-[#1E1E2A] border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 text-center border-b border-white/10">
        <div className="relative inline-block">
          <img
            src={contact.avatar}
            alt={contact.name}
            className="w-20 h-20 rounded-full mx-auto"
          />
          <div className={cn(
            "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#1E1E2A]",
            getStatusColor(contact.status)
          )} />
        </div>
        <h3 className="font-bold mt-2">{contact.name}</h3>
        <button className="mt-1 text-gray-400 hover:text-white">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* User Info */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Bio */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">About Me</h4>
            <p className="text-sm">{userDetails.bio}</p>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Globe size={14} className="text-gray-400" />
              <span>{userDetails.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <LinkIcon size={14} className="text-gray-400" />
              <a href={userDetails.website} className="text-blue-400 hover:underline">
                {new URL(userDetails.website).hostname}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail size={14} className="text-gray-400" />
              <span>{userDetails.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={14} className="text-gray-400" />
              <span>Joined {userDetails.joinedDate}</span>
            </div>
          </div>

          {/* Stats */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Stats</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#2A2A3A] p-2 rounded-lg">
                <div className="text-sm font-semibold">{userDetails.followers.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div className="bg-[#2A2A3A] p-2 rounded-lg">
                <div className="text-sm font-semibold">{userDetails.following.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Following</div>
              </div>
            </div>
          </div>

          {/* Mutual Servers */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">
              <div className="flex items-center gap-2">
                <Users size={14} />
                <span>{userDetails.mutualServers} Mutual Servers</span>
              </div>
            </h4>
            <div className="space-y-2">
              {/* Add mutual servers here */}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Recent Activity</h4>
            <div className="space-y-2">
              {userDetails.recentActivity.map((activity, index) => (
                <div key={index} className="bg-[#2A2A3A] p-2 rounded-lg">
                  <div className="text-sm">{activity.name}</div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPanel;