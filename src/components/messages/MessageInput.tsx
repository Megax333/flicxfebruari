import React, { useState } from 'react';
import { Plus, Gift, Smile } from 'lucide-react';
import { useMessageStore } from '../../stores/messageStore';

interface MessageInputProps {
  contact: {
    id: string;
    name: string;
  };
}

const MessageInput = ({ contact }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const sendMessage = useMessageStore(state => state.sendMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      await sendMessage(contact.id, message.trim());
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="px-4 py-4 bg-[#1E1E2A] border-t border-white/10">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          className="p-2 hover:bg-white/10 rounded-lg"
        >
          <Plus size={20} className="text-gray-400" />
        </button>
        <button
          type="button"
          className="p-2 hover:bg-white/10 rounded-lg"
        >
          <Gift size={20} className="text-gray-400" />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message @${contact.name}`}
            className="w-full bg-[#2A2A3A] rounded-md px-4 py-2.5 focus:outline-none text-gray-200"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
          >
            <Smile size={20} className="text-gray-400" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessageInput;