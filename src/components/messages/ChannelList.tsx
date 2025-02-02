import React from 'react';
import { Hash, Lock, Volume2, Plus } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement';
  private?: boolean;
  unread?: boolean;
  mentions?: number;
}

interface ChannelGroup {
  name: string;
  channels: Channel[];
}

const ChannelList = ({ 
  selectedChannel,
  onSelectChannel
}: { 
  selectedChannel: string;
  onSelectChannel: (channel: string) => void;
}) => {
  const channelGroups: ChannelGroup[] = [
    {
      name: 'Information',
      channels: [
        { id: 'announcements', name: 'announcements', type: 'announcement' },
        { id: 'rules', name: 'rules', type: 'text' }
      ]
    },
    {
      name: 'General',
      channels: [
        { id: 'general', name: 'general', type: 'text', unread: true },
        { id: 'introductions', name: 'introductions', type: 'text' },
        { id: 'off-topic', name: 'off-topic', type: 'text', mentions: 2 }
      ]
    },
    {
      name: 'Creative',
      channels: [
        { id: 'showcase', name: 'showcase', type: 'text' },
        { id: 'feedback', name: 'feedback', type: 'text', private: true },
        { id: 'resources', name: 'resources', type: 'text' }
      ]
    },
    {
      name: 'Voice',
      channels: [
        { id: 'lounge', name: 'Lounge', type: 'voice' },
        { id: 'gaming', name: 'Gaming', type: 'voice' },
        { id: 'music', name: 'Music', type: 'voice' }
      ]
    }
  ];

  const getChannelIcon = (type: string, isPrivate?: boolean) => {
    if (isPrivate) return <Lock size={16} className="text-gray-400" />;
    switch (type) {
      case 'voice':
        return <Volume2 size={16} className="text-gray-400" />;
      default:
        return <Hash size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto py-4">
      {channelGroups.map((group) => (
        <div key={group.name} className="mb-6">
          <div className="px-4 flex items-center justify-between group">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {group.name}
            </h3>
            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all">
              <Plus size={12} className="text-gray-400" />
            </button>
          </div>
          
          <div className="mt-1 space-y-0.5">
            {group.channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onSelectChannel(channel.id)}
                className={`w-full flex items-center gap-1.5 px-4 py-1.5 hover:bg-white/5 group ${
                  selectedChannel === channel.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {getChannelIcon(channel.type, channel.private)}
                <span className="flex-1 truncate text-sm text-left">
                  {channel.name}
                </span>
                {channel.mentions && (
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {channel.mentions}
                  </span>
                )}
                {channel.unread && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChannelList;