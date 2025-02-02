import React, { useState } from 'react';
import { Send, Gift, Smile } from 'lucide-react';

const LiveChat = () => {
  const [message, setMessage] = useState('');

  const messages = [
    {
      id: 1,
      user: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop',
      message: 'The quantum computing segment was mind-blowing! 🤯',
      timestamp: '2m ago'
    },
    {
      id: 2,
      user: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop',
      message: 'Can\'t wait for the AI discussion coming up next!',
      timestamp: '1m ago'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
      message: 'The future is here! 🚀',
      timestamp: 'Just now'
    }
  ];

  return (
    <div className="bg-[#1E1E2A] rounded-xl h-[500px] flex flex-col border border-purple-600/20">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-semibold">Live Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <img
              src={msg.avatar}
              alt={msg.user}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{msg.user}</span>
                <span className="text-xs text-gray-400">{msg.timestamp}</span>
              </div>
              <p className="text-sm text-gray-300">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send a message..."
              className="w-full bg-[#2A2A3A] text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button className="text-gray-400 hover:text-white">
                <Gift size={18} />
              </button>
              <button className="text-gray-400 hover:text-white">
                <Smile size={18} />
              </button>
            </div>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 p-2 rounded-full">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;