import React from 'react';
import { Crown, Shield, Bot, Star } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  role?: 'admin' | 'mod' | 'bot' | 'vip';
  activity?: string;
}

interface UserGroup {
  name: string;
  users: User[];
}

const UserList = () => {
  const userGroups: UserGroup[] = [
    {
      name: 'Staff',
      users: [
        {
          id: '1',
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
          status: 'online',
          role: 'admin',
          activity: 'Working on animations'
        }
      ]
    },
    {
      name: 'Online',
      users: [
        {
          id: '2',
          name: 'CelflicksBot',
          avatar: 'https://images.unsplash.com/photo-1675426513962-63c6022a8626?w=100&h=100&fit=crop',
          status: 'online',
          role: 'bot'
        },
        {
          id: '3',
          name: 'Marcus Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
          status: 'idle',
          role: 'mod'
        },
        {
          id: '4',
          name: 'Emma Wilson',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
          status: 'dnd',
          role: 'vip',
          activity: 'Playing Cyberpunk 2077'
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return <Crown size={14} className="text-yellow-400" />;
      case 'mod':
        return <Shield size={14} className="text-blue-400" />;
      case 'bot':
        return <Bot size={14} className="text-purple-400" />;
      case 'vip':
        return <Star size={14} className="text-green-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      {userGroups.map((group) => (
        <div key={group.name} className="mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            {group.name} — {group.users.length}
          </h3>
          
          <div className="space-y-1">
            {group.users.map((user) => (
              <button
                key={user.id}
                className="w-full flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg group"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#12121A] ${getStatusColor(user.status)}`} />
                </div>
                
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-1">
                    <span className="font-medium truncate">{user.name}</span>
                    {user.role && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {getRoleBadge(user.role)}
                      </div>
                    )}
                  </div>
                  {user.activity && (
                    <p className="text-xs text-gray-400 truncate">
                      {user.activity}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;