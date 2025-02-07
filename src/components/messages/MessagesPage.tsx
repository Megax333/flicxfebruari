import { useState, useEffect } from 'react';
import { Search, Settings, Phone, Video, Pin, Hash } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserDetailsPanel from './UserDetailsPanel';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import useMessageStore from '../../stores/messageStore';

interface Contact {
  id: string;
  username: string;
  avatar_url: string;
  bio?: string;
  status?: 'online' | 'offline' | 'idle' | 'dnd';
  last_message?: string;
  last_message_time?: string;
}

const MessagesPage = () => {
  const { user } = useAuth();
  const { username } = useParams();
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { subscribeToMessages, messages, loadMessages, setActiveConversation, unreadCounts, loadUnreadCount } = useMessageStore();

  // Subscribe to messages
  useEffect(() => {
    if (user?.id) {
      subscribeToMessages(user.id);
      loadUnreadCount(user.id);
    }
  }, [user?.id, subscribeToMessages, loadUnreadCount]);

  // Load conversations and contacts
  useEffect(() => {
    const loadConversations = async () => {
      if (!user?.id) return;

      try {
        if (contacts.length === 0) {
          setLoading(true);
        }
        
        // First, get all messages to find unique conversations
        const { data: messageData, error: messageError } = await supabase
          .from('messages')
          .select('sender_id, receiver_id')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (messageError) throw messageError;

        // Get unique user IDs from conversations
        const uniqueUserIds = new Set<string>();
        messageData?.forEach(msg => {
          const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          uniqueUserIds.add(otherId);
        });

        // Get profile information for conversation participants
        if (uniqueUserIds.size > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', Array.from(uniqueUserIds));

          if (profilesError) throw profilesError;

          const contactList = profiles.map((profile: any) => ({
            id: profile.id,
            username: profile.username,
            avatar_url: profile.avatar_url,
            bio: profile.bio,
            status: profile.status,
            unreadCount: unreadCounts[profile.id] || 0
          }));

          setContacts(contactList);

          // If username param exists, set the selected contact
          if (username && !selectedContact) {
            const contact = contactList.find(c => c.username === username);
            if (contact) {
              setSelectedContact(contact);
              setActiveConversation(contact.id);
              loadMessages(contact.id);
            }
          }
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user?.id, username, loadMessages, setActiveConversation, unreadCounts]);

  const handleContactSelect = async (contact: Contact) => {
    setSelectedContact(contact);
    setActiveConversation(contact.id);
    navigate(`/messages/${contact.username}`, { replace: true });
    await loadMessages(contact.id);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedContact || !user) return;

    try {
      const optimisticId = `${Date.now()}-${Math.random()}`; // Unique ID for optimistic message
      // Get current user's profile
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Optimistically add message to UI
      const optimisticMessage = {
        id: optimisticId,
        content,
        sender_id: user.id,
        receiver_id: selectedContact.id,
        created_at: new Date().toISOString(),
        read: false,
        sender: {
          id: user.id,
          username: userProfile?.username || user.email?.split('@')[0] || 'User',
          avatar_url: userProfile?.avatar_url || '/default-avatar.png'
        },
        receiver: {
          id: selectedContact.id,
          username: selectedContact.username,
          avatar_url: selectedContact.avatar_url || '/default-avatar.png'
        }
      };

      // Add optimistic message to state
      useMessageStore.setState(state => ({
        messages: {
          ...state.messages,
          [selectedContact.id]: [...(state.messages[selectedContact.id] || []), optimisticMessage]
        }
      }));

      // Actually send the message
      const result = await useMessageStore.getState().sendMessage({
        content,
        receiver_id: selectedContact.id
      });

      if (result.error) {
        // Remove optimistic message on error
        useMessageStore.setState(state => ({
          messages: {
            ...state.messages,
            [selectedContact.id]: state.messages[selectedContact.id]?.filter(m => m.id !== optimisticId) || []
          }
        }));
        console.error('Error sending message:', result.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen pt-16 overflow-hidden">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-[#1E1E2A] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#1E1E2A]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Messages</h2>
            <button className="p-2 hover:bg-[#1E1E2A] rounded-lg">
              <Settings size={20} />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages"
              className="w-full bg-[#1E1E2A] rounded-lg px-4 py-2 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && contacts.length === 0 ? (
            <div className="p-4 text-center text-gray-400">Loading conversations...</div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-4 text-center text-gray-400">No conversations found</div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleContactSelect(contact)}
                className={cn(
                  "p-4 hover:bg-[#1E1E2A] cursor-pointer",
                  selectedContact?.id === contact.id && "bg-[#1E1E2A]"
                )}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={contact.avatar_url || "/default-avatar.png"}
                    alt={contact.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{contact.username}</h3>
                    {unreadCounts[contact.id] > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {unreadCounts[contact.id]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedContact ? (
        <>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[#1E1E2A]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedContact.avatar_url || "/default-avatar.png"}
                    alt={selectedContact.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{selectedContact.username}</h3>
                    <p className="text-sm text-gray-400">
                      {selectedContact.status || 'Active now'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-[#1E1E2A] rounded-lg">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 hover:bg-[#1E1E2A] rounded-lg">
                    <Video size={20} />
                  </button>
                  <button className="p-2 hover:bg-[#1E1E2A] rounded-lg">
                    <Pin size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <MessageList
                messages={messages[selectedContact.id] || []}
                user={user}
              />
            </div>

            <div className="p-4 border-t border-[#1E1E2A]">
              <MessageInput onSendMessage={handleSendMessage} />
            </div>
          </div>

          {/* User Details Panel */}
          <UserDetailsPanel contact={selectedContact} />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Hash size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium mb-2">Your Messages</h3>
            <p className="text-gray-400">
              Send private messages to a friend or group
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;