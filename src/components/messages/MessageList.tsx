import React, { useEffect, useState } from 'react';
import { Reply, MoreHorizontal } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useMessageStore } from '../../stores/messageStore';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

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
  const [currentUserProfile, setCurrentUserProfile] = useState<{
    username: string;
    avatar_url: string | null;
  } | null>(null);
  
  // Filter messages for this conversation
  const conversationMessages = messages.filter(
    msg => 
      (msg.sender_id === user?.id && msg.receiver_id === contact.id) || 
      (msg.sender_id === contact.id && msg.receiver_id === user?.id)
  ).sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  useEffect(() => {
    loadMessages(contact.id);
  }, [contact.id, loadMessages]);

  // Fetch current user's profile from profiles table
  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }
        
        setCurrentUserProfile(data);
      } catch (err) {
        console.error('Error in fetchCurrentUserProfile:', err);
      }
    };
    
    fetchCurrentUserProfile();
  }, [user?.id]);

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
          const isCurrentUser = message.sender_id === user?.id;
          
          // Determine the correct avatar and username
          let avatar, username;
          
          if (isCurrentUser) {
            // Current user is the sender - use profile from profiles table
            avatar = currentUserProfile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserProfile?.username || 'User')}&background=random`;
            username = currentUserProfile?.username || 'You';
          } else {
            // Contact is the sender
            avatar = contact.avatar;
            username = contact.name;
          }

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
                      <span className={cn(
                        "font-medium hover:underline cursor-pointer",
                        isCurrentUser ? "text-green-400" : "text-blue-400"
                      )}>
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

                    <div className="absolute right-0 top-0 opacity-0 group-hover/message:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-white/10 rounded">
                        <Reply size={16} className="text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-white/10 rounded">
                        <MoreHorizontal size={16} className="text-gray-400" />
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