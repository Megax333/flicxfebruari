import React, { useEffect } from 'react';
import { Reply, MoreHorizontal } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useMessageStore } from '../../stores/messageStore';
import { useAuth } from '../../context/AuthContext';

interface MessageListProps {
  contact: {
    id: string;
    name: string;
    avatar: string;
  };
}

const MessageList = ({ contact }: MessageListProps) => {
  const { user } = useAuth();
  const { messages, loadMessages } = useMessageStore();
  const conversationMessages = messages[contact.id] || [];

  useEffect(() => {
    loadMessages(contact.id);
  }, [contact.id, loadMessages]);

  return (
    <div className="flex-1 overflow-y-auto py-4 px-4 bg-[#1E1E2A]">
      {conversationMessages.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          Start a conversation with {contact.name}!
        </div>
      ) : (
        conversationMessages.map((message, index) => {
          const isFirstInGroup = index === 0 || 
            conversationMessages[index - 1]?.sender_id !== message.sender_id;
          const isSender = message.sender_id === user?.id;
          const avatar = isSender 
            ? message.profiles?.avatar_url 
            : message.receiver?.avatar_url || contact.avatar;
          const username = isSender
            ? message.profiles?.username
            : message.receiver?.username || contact.name;

          return (
            <div
              key={message.id}
              className={cn(
                "group hover:bg-[#2A2A3A] px-4 py-0.5 -mx-4",
                isFirstInGroup && "mt-4"
              )}
            >
              <div className="flex items-start gap-3">
                {isFirstInGroup && (
                  <img
                    src={avatar}
                    alt={username}
                    className="w-10 h-10 rounded-full mt-0.5"
                  />
                )}
                {!isFirstInGroup && <div className="w-10" />}

                <div className="flex-1 min-w-0">
                  {isFirstInGroup && (
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-medium text-[#5865f2] hover:underline cursor-pointer">
                        {username}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  )}

                  <div className="relative group/message">
                    <p className="text-sm text-gray-100 whitespace-pre-wrap">
                      {message.content}
                    </p>

                    {/* Message Actions */}
                    <div className="absolute -top-4 -right-2 opacity-0 group-hover/message:opacity-100 transition-opacity flex items-center gap-0.5 bg-[#1E1E2A] border border-white/10 rounded-md shadow-lg z-10">
                      <button className="p-2 hover:bg-white/10 rounded-l-md">
                        <Reply size={16} />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-r-md">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MessageList;