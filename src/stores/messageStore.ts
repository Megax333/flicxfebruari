import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface MessageWithProfile extends Message {
  profiles?: {
    id: string;
    username: string;
    avatar_url: string;
  };
  receiver?: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

interface MessageStore {
  messages: Record<string, MessageWithProfile[]>;
  loading: boolean;
  error: string | null;
  unreadCount: number;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  loadMessages: (contactId: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  subscribeToMessages: (userId: string) => void;
  unsubscribeFromMessages: () => void;
  loadUnreadCount: (userId: string) => Promise<void>;
}

export const useMessageStore = create<MessageStore>((set, get) => {
  let subscription: any = null;

  return {
    messages: {},
    loading: false,
    error: null,
    unreadCount: 0,

    sendMessage: async (receiverId: string, content: string) => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user?.user?.id) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('messages')
          .insert([{
            sender_id: user.user.id,
            receiver_id: receiverId,
            content,
            read: false
          }])
          .select()
          .single();

        if (error) throw error;

        // Update local messages
        set(state => ({
          messages: {
            ...state.messages,
            [receiverId]: [...(state.messages[receiverId] || []), data]
          }
        }));
      } catch (err) {
        console.error('Error sending message:', err);
        set({ error: err.message });
      }
    },

    loadMessages: async (contactId: string) => {
      set({ loading: true, error: null });
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user?.user?.id) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
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
          .or(`and(sender_id.eq.${user.user.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${user.user.id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Mark messages as read
        const unreadMessages = data?.filter(msg => 
          msg.receiver_id === user.user.id && !msg.read
        ) || [];

        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ read: true })
            .in('id', unreadMessages.map(msg => msg.id));

          await get().loadUnreadCount(user.user.id);
        }

        set(state => ({
          messages: {
            ...state.messages,
            [contactId]: data || []
          }
        }));
      } catch (err) {
        console.error('Error loading messages:', err);
        set({ error: err.message });
      } finally {
        set({ loading: false });
      }
    },

    loadUnreadCount: async (userId: string) => {
      try {
        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', userId)
          .eq('read', false);

        if (error) throw error;
        set({ unreadCount: count || 0 });
      } catch (err) {
        console.error('Error loading unread count:', err);
      }
    },

    markAsRead: async (messageId: string) => {
      try {
        const { error } = await supabase
          .from('messages')
          .update({ read: true })
          .eq('id', messageId);

        if (error) throw error;

        // Update unread count
        const { data: user } = await supabase.auth.getUser();
        if (user?.user?.id) {
          await get().loadUnreadCount(user.user.id);
        }
      } catch (err) {
        console.error('Error marking message as read:', err);
        set({ error: err.message });
      }
    },

    subscribeToMessages: (userId: string) => {
      if (subscription) return;

      // Load initial unread count
      get().loadUnreadCount(userId);

      subscription = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${userId}`
          },
          async (payload) => {
            const newMessage = payload.new as Message;
            const senderId = newMessage.sender_id;

            // Update messages for this conversation
            set(state => ({
              messages: {
                ...state.messages,
                [senderId]: [...(state.messages[senderId] || []), newMessage]
              }
            }));

            // Update unread count
            await get().loadUnreadCount(userId);
          }
        )
        .subscribe();
    },

    unsubscribeFromMessages: () => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
    }
  };
});