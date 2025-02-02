import React, { useState } from 'react';
import { Image, Mic, Film, Sparkles } from 'lucide-react';

interface ThoughtComposerProps {
  onClose?: () => void;
}

const ThoughtComposer = ({ onClose }: ThoughtComposerProps) => {
  const [thought, setThought] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = () => {
    // Handle submission logic here
    if (onClose) onClose();
  };

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <textarea
            placeholder="Share your thoughts..."
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            className="w-full bg-transparent resize-none outline-none placeholder:text-gray-500 min-h-[120px]"
            autoFocus
          />
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-4">
              <button className="text-gray-400 hover:text-purple-400 transition-colors">
                <Image size={20} />
              </button>
              <button 
                className={`${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'} hover:text-purple-400 transition-colors`}
                onClick={() => setIsRecording(!isRecording)}
              >
                <Mic size={20} />
              </button>
              <button className="text-gray-400 hover:text-purple-400 transition-colors">
                <Film size={20} />
              </button>
            </div>
            <button 
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full flex items-center gap-2 transition-colors"
            >
              <Sparkles size={18} />
              Share Thought
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThoughtComposer;