import React, { useState } from 'react';
import { Play, Save, X } from 'lucide-react';

const PreviewEditor = ({ movie, onSave }) => {
  const [previewUrl, setPreviewUrl] = useState(movie.preview);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave({ ...movie, preview: previewUrl });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-[#12121A] rounded-xl overflow-hidden">
        <div className="relative aspect-video">
          <video
            src={movie.preview}
            className="w-full h-full object-cover"
            muted
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Play size={18} />
              Change Preview
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium mb-1">{movie.title}</h3>
          <p className="text-sm text-gray-400">Preview Video</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#12121A] rounded-xl overflow-hidden">
      <div className="relative aspect-video">
        <video
          src={previewUrl}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="w-4/5">
            <input
              type="text"
              value={previewUrl}
              onChange={(e) => setPreviewUrl(e.target.value)}
              placeholder="Enter preview video URL..."
              className="w-full bg-[#2A2A3A] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg hover:bg-white/5 flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium mb-1">{movie.title}</h3>
        <p className="text-sm text-gray-400">Preview Video</p>
      </div>
    </div>
  );
};

export default PreviewEditor;