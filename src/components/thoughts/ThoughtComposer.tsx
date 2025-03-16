import React, { useState } from 'react';
import { Image, Mic, Film, Sparkles, Loader2 } from 'lucide-react';
import * as postsService from '../../services/postsService';
import { useViewStore } from '../../stores/viewStore';

interface ThoughtComposerProps {
  onClose?: () => void;
}

const ThoughtComposer = ({ onClose }: ThoughtComposerProps) => {
  const [thought, setThought] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedTribe } = useViewStore();

  const handleSubmit = async () => {
    if (!thought.trim()) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Create the post using the postsService
      await postsService.createPost(
        thought,
        selectedTribe || undefined,
        undefined, // mediaUrl
        undefined, // audioUrl
        'Text Thought' // postType
      );
      
      // Clear the form and close the composer
      setThought('');
      if (onClose) onClose();
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
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
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-4">
              <button 
                className="text-gray-400 hover:text-purple-400 transition-colors"
                disabled={isSubmitting}
              >
                <Image size={20} />
              </button>
              <button 
                className={`${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'} hover:text-purple-400 transition-colors`}
                onClick={() => setIsRecording(!isRecording)}
                disabled={isSubmitting}
              >
                <Mic size={20} />
              </button>
              <button 
                className="text-gray-400 hover:text-purple-400 transition-colors"
                disabled={isSubmitting}
              >
                <Film size={20} />
              </button>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !thought.trim()}
              className={`px-6 py-2 rounded-full flex items-center gap-2 transition-colors ${
                isSubmitting || !thought.trim() 
                  ? 'bg-purple-600/50 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Share Thought
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThoughtComposer;