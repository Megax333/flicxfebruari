import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
  sender: {
    id: string;
    username: string;
    avatar_url: string;
  };
  receiver: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

interface UnreadCount {
  sender_id: string;
  count: number;
}

interface MessageStore {
  messages: Record<string, Message[]>;
  activeConversation: string | null;
  unreadCounts: Record<string, number>;
  currentSubscription: (() => void) | null;
  setActiveConversation: (userId: string | null) => void;
  loadMessages: (userId: string) => Promise<void>;
  sendMessage: (message: { content: string; receiver_id: string }) => Promise<{ error: Error | null }>;
  subscribeToMessages: (userId: string) => void;
  loadUnreadCount: (userId: string) => Promise<void>;
}

const useMessageStore = create<MessageStore>((set, get) => ({
  messages: {},
  activeConversation: null,
  unreadCounts: {},
  currentSubscription: null,

  setActiveConversation: (userId) => {
    set({ activeConversation: userId });
  },

  loadMessages: async (userId) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) return;

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(id, username, avatar_url),
          receiver:profiles!receiver_id(id, username, avatar_url)
        `)
        .or(`and(sender_id.eq.${userData.user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${userData.user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        set((state) => ({
          messages: {
            ...state.messages,
            [userId]: data
          }
        }));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  },

  sendMessage: async (message) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        return { error: new Error('Not authenticated') };
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            content: message.content,
            sender_id: userData.user.id,
            receiver_id: message.receiver_id,
            read: false
          }
        ])
        .select(`
          *,
          sender:profiles!sender_id(id, username, avatar_url),
          receiver:profiles!receiver_id(id, username, avatar_url)
        `)
        .single();

      if (error) return { error };

      // Don't update state here - let the subscription handle it
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  loadUnreadCount: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          sender_id,
          count: count(*)::int
        `, { count: 'exact' })
        .eq('receiver_id', userId)
        .eq('read', false) as { data: UnreadCount[] | null; error: Error | null };

      if (error) throw error;

      if (data) {
        const counts = data.reduce<Record<string, number>>((acc: Record<string, number>, { sender_id, count }: UnreadCount) => {
          acc[sender_id] = count;
          return acc;
        }, {});

        set({ unreadCounts: counts });
      }
    } catch (error) {
      console.error('Error loading unread counts:', error);
    }
  },

  subscribeToMessages: (userId: string) => {
    // Clean up existing subscription if any
    const currentSub = get().currentSubscription;
    if (currentSub) {
      currentSub();
    }

    const subscription = supabase
      .channel(`messages:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${userId},receiver_id.eq.${userId})`
        },
        async (payload) => {
          const newMessage = payload.new as Message;

          // Get the conversation ID (other user's ID)
          const conversationId = userId === newMessage.sender_id ? newMessage.receiver_id : newMessage.sender_id;
          
          // Fetch complete message with profiles
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              sender:profiles!sender_id(id, username, avatar_url),
              receiver:profiles!receiver_id(id, username, avatar_url)
            `)
            .eq('id', newMessage.id)
            .single();

          if (!data) return;

          set((state) => {
            const currentMessages = state.messages[conversationId] || [];
            
            // Remove any optimistic messages with the same content
            const filteredMessages = currentMessages.filter(m => 
              !(m.id.includes('-') && m.content === data.content && m.sender_id === data.sender_id)
            );
            
            return {
              messages: {
                ...state.messages,
                [conversationId]: [...filteredMessages, data]
              },
              unreadCounts: data.sender_id !== userId ? {
                ...state.unreadCounts,
                [conversationId]: (state.unreadCounts[conversationId] || 0) + 1
              } : state.unreadCounts
            };
          });
        }
      )
      .subscribe();

    // Store subscription cleanup function
    set({ currentSubscription: () => subscription.unsubscribe() });
  }
}));

export default useMessageStore;