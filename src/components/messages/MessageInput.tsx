import React, { useState, KeyboardEvent } from 'react';
import { Plus, Smile } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-start gap-2">
      <button className="p-2 hover:bg-[#2A2A3A] rounded-lg">
        <Plus size={20} />
      </button>
      
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="w-full bg-[#2A2A3A] rounded-lg px-4 py-2 resize-none min-h-[40px] max-h-[200px] focus:outline-none"
          rows={1}
        />
      </div>

      <button className="p-2 hover:bg-[#2A2A3A] rounded-lg">
        <Smile size={20} />
      </button>
    </div>
  );
};

export default MessageInput;