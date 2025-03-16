import React, { useState, useEffect } from 'react';
import { Search, Plus, Settings, Phone, Video, Pin, Hash } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserDetailsPanel from './UserDetailsPanel';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { useMessageStore } from '../../stores/messageStore';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'idle' | 'dnd';
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
  typing?: boolean;
}

const MessagesPage = () => {
  const { user } = useAuth();
  const { username } = useParams();
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { subscribeToMessages, unsubscribeFromMessages, messages } = useMessageStore();

  // Subscribe to messages
  useEffect(() => {
    if (user?.id) {
      subscribeToMessages(user.id);
      return () => unsubscribeFromMessages();
    }
  }, [user?.id, subscribeToMessages, unsubscribeFromMessages]);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      if (!user?.id) return;

      try {
        const { data: messageData, error: messageError } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            sender_id,
            receiver_id,
            profiles!messages_sender_id_fkey (
              id,
              username,
              avatar_url
            ),
            receiver:profiles!messages_receiver_id_fkey (
              id,
              username,
              avatar_url
            )
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (messageError) throw messageError;

        const contactMap = new Map<string, Contact>();
        
        messageData?.forEach(msg => {
          // Determine if the other user is the sender or receiver
          const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          const otherUserProfile = msg.sender_id === user.id ? msg.receiver : msg.profiles;
          
          if (!otherUserProfile || !otherUserId) return;

          if (!contactMap.has(otherUserId)) {
            contactMap.set(otherUserId, {
              id: otherUserId,
              name: otherUserProfile.username,
              avatar: otherUserProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUserProfile.username)}&background=random`,
              status: 'online',
              lastMessage: msg.content,
              timestamp: msg.created_at
            });
          }
        });

        setContacts(Array.from(contactMap.values()));
      } catch (err) {
        console.error('Error loading conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user?.id]);

  // Load initial contact from URL
  useEffect(() => {
    const loadInitialContact = async () => {
      try {
        if (username) {
          await loadContact(username);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading initial contact:', err);
        setLoading(false);
      }
    };

    loadInitialContact();
  }, [username]);

  const loadContact = async (username: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;

      const contact: Contact = {
        id: profile.id,
        name: profile.username,
        avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&background=random`,
        status: 'online'
      };

      setContacts(prev => {
        const exists = prev.find(c => c.id === contact.id);
        if (!exists) {
          return [...prev, contact];
        }
        return prev;
      });
      
      setSelectedContact(contact);
    } catch (err) {
      console.error('Error loading contact:', err);
      navigate('/messages');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Sign in to access messages</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen pt-16 flex bg-[#1E1E2A]">
      {/* Contacts Sidebar */}
      <div className="w-60 bg-[#1E1E2A] flex flex-col border-r border-white/10">
        {/* Search Bar */}
        <div className="p-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find or start a conversation"
              className="w-full bg-[#0A0A0F] text-sm rounded px-2 py-1 focus:outline-none"
            />
            <Search size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Direct Messages Header */}
        <div className="px-2 py-3">
          <button className="w-full flex items-center justify-between px-2 py-1 rounded hover:bg-white/5">
            <span className="text-xs font-semibold text-gray-400 uppercase">Direct Messages</span>
            <Plus size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto space-y-0.5 px-2">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={cn(
                "w-full flex items-center gap-3 px-2 py-1.5 rounded-md group",
                selectedContact?.id === contact.id 
                  ? "bg-white/10" 
                  : "hover:bg-white/5"
              )}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1E1E2A]",
                  getStatusColor(contact.status)
                )} />
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "font-medium truncate",
                    contact.unread ? "text-white" : "text-gray-300"
                  )}>{contact.name}</span>
                </div>
                {contact.typing ? (
                  <p className="text-xs text-emerald-400">typing...</p>
                ) : contact.lastMessage && (
                  <p className={cn(
                    "text-xs truncate",
                    contact.unread ? "text-gray-100" : "text-gray-400"
                  )}>{contact.lastMessage}</p>
                )}
              </div>

              {contact.unread && (
                <span className="w-2 h-2 rounded-full bg-white" />
              )}
            </button>
          ))}
        </div>

        {/* User Settings */}
        <div className="p-2 bg-[#12121A] flex items-center gap-2">
          <div className="relative">
            <img
              src={user?.user_metadata?.avatar_url || "https://ui-avatars.com/api/?background=random"}
              alt="Your avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#12121A] bg-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.user_metadata?.username || 'User'}</div>
            <div className="text-xs text-gray-400">Online</div>
          </div>
          <button className="p-1 hover:bg-white/10 rounded">
            <Settings size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      {selectedContact ? (
        <div className="flex flex-1">
          <div className="flex-1 flex flex-col bg-[#1E1E2A]">
            {/* Chat Header */}
            <div className="h-12 px-4 flex items-center justify-between bg-[#1E1E2A] border-b border-white/10">
              <div className="flex items-center gap-2">
                <Hash size={24} className="text-gray-400" />
                <h2 className="font-medium">{selectedContact.name}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg">
                  <Phone size={20} className="text-gray-400" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg">
                  <Video size={20} className="text-gray-400" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg">
                  <Pin size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
            {/* Messages */}
            <MessageList contact={selectedContact} />
            <MessageInput contact={selectedContact} />
          </div>
          
          {/* User Details Panel */}
          <UserDetailsPanel contact={selectedContact} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#1E1E2A] text-gray-400">
          <div className="text-center">
            <h3 className="text-xl font-medium mb-2">Welcome to Messages!</h3>
            <p className="text-sm">Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;