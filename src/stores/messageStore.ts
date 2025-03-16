import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  read: boolean;
  profiles?: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  receiver?: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

interface MessageStore {
  messages: Message[];
  unreadCounts: Record<string, number>;
  messageSubscription: RealtimeChannel | null;
  loadMessages: (contactId: string) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<Message | null>;
  markMessagesAsRead: (senderId: string) => Promise<void>;
  subscribeToMessages: (userId: string) => void;
  unsubscribeFromMessages: () => void;
  getTotalUnreadCount: () => number;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  messages: [],
  unreadCounts: {},
  messageSubscription: null,

  getTotalUnreadCount: () => {
    const { unreadCounts } = get();
    return Object.values(unreadCounts).reduce((total, count) => total + count, 0);
  },

  loadMessages: async (contactId: string) => {
    try {
      // Get the current user first
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        console.error('Error getting current user:', userError);
        return;
      }
      
      const currentUserId = userData.user.id;

      const { data: messages, error } = await supabase
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
        .or(`and(sender_id.eq.${contactId},receiver_id.eq.${currentUserId}),and(sender_id.eq.${currentUserId},receiver_id.eq.${contactId})`)
        .order('created_at');

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      set((state) => ({
        messages: [...state.messages.filter(msg => 
          !(msg.sender_id === contactId && msg.receiver_id === currentUserId) && 
          !(msg.sender_id === currentUserId && msg.receiver_id === contactId)
        ), ...messages]
      }));
    } catch (error) {
      console.error('Error in loadMessages:', error);
    }
  },

  sendMessage: async (receiverId: string, content: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const newMessage = {
        sender_id: user.id,
        receiver_id: receiverId,
        content,
        read: false,
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
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
        .single();

      if (error) {
        console.error('Error sending message:', error);
        return null;
      }

      // Add the new message to the store
      set((state) => ({
        messages: [...state.messages, data]
      }));

      return data;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return null;
    }
  },

  markMessagesAsRead: async (senderId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', senderId)
        .eq('receiver_id', user.id)
        .eq('read', false);

      if (error) {
        console.error('Error marking messages as read:', error);
        return;
      }

      // Update the messages in the store
      set((state) => ({
        messages: state.messages.map(msg => 
          msg.sender_id === senderId && msg.receiver_id === user.id && !msg.read
            ? { ...msg, read: true }
            : msg
        ),
        unreadCounts: {
          ...state.unreadCounts,
          [senderId]: 0
        }
      }));
    } catch (error) {
      console.error('Error in markMessagesAsRead:', error);
    }
  },

  subscribeToMessages: (userId: string) => {
    try {
      // First, load initial unread counts
      const loadUnreadCounts = async () => {
        try {
          // Using raw SQL query instead of the group method that's not in TypeScript definitions
          const { data, error } = await supabase
            .rpc('get_unread_message_counts', { p_user_id: userId });
          
          if (error) {
            console.error('Error loading unread counts:', error);
            return;
          }
          
          const unreadCounts: Record<string, number> = {};
          if (data) {
            data.forEach((item: { sender_id: string; count: string }) => {
              unreadCounts[item.sender_id] = parseInt(item.count);
            });
          }
          
          set({ unreadCounts });
        } catch (err) {
          console.error('Error in loadUnreadCounts:', err);
        }
      };
      
      loadUnreadCounts();

      const subscription = supabase
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
            // Fetch the complete message with profiles
            const { data: message, error } = await supabase
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
              .eq('id', payload.new.id)
              .single();

            if (error) {
              console.error('Error fetching new message:', error);
              return;
            }

            // Update messages and unread counts
            set((state) => {
              const senderId = message.sender_id;
              const currentUnreadCount = state.unreadCounts[senderId] || 0;
              
              return {
                messages: [...state.messages, message],
                unreadCounts: {
                  ...state.unreadCounts,
                  [senderId]: currentUnreadCount + 1
                }
              };
            });
          }
        )
        .subscribe();

      set({ messageSubscription: subscription });
    } catch (error) {
      console.error('Error in subscribeToMessages:', error);
    }
  },

  unsubscribeFromMessages: () => {
    const { messageSubscription } = get();
    if (messageSubscription) {
      messageSubscription.unsubscribe();
      set({ messageSubscription: null });
    }
  }
}));