import React, { useState } from 'react';
import { Upload, Save, X, Trash2, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { useMovieStore } from '../../stores/movieStore';

const MovieEditor = ({ movie, index, totalMovies }) => {
  const updateMovie = useMovieStore((state) => state.updateMovie);
  const removeMovie = useMovieStore((state) => state.removeMovie);
  const reorderMovies = useMovieStore((state) => state.reorderMovies);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: movie.id,
    order: movie.order,
    title: movie.title || '',
    description: movie.description || '',
    thumbnail: movie.thumbnail || '',
    preview: movie.preview || '',
    tags: movie.tags || []
  });

  
  const [imageUrl, setImageUrl] = useState(movie.thumbnail || '');
  
  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        thumbnail: imageUrl.trim()
      }));
    }
  };

  const handleSave = () => {
    updateMovie({
      ...formData,
      order: movie.order // Preserve original order
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-[#12121A] rounded-xl overflow-hidden">
        <div className="relative aspect-[2/3]">
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {index > 0 && (
              <button
                onClick={() => reorderMovies(index, index - 1)}
                className="p-2 bg-black/80 backdrop-blur-sm rounded-lg hover:bg-purple-600 transition-colors"
              >
                <ChevronUp size={20} />
              </button>
            )}
            {index < totalMovies - 1 && (
              <button
                onClick={() => reorderMovies(index, index + 1)}
                className="p-2 bg-black/80 backdrop-blur-sm rounded-lg hover:bg-purple-600 transition-colors"
              >
                <ChevronDown size={20} />
              </button>
            )}
          </div>
          <img
            src={movie.thumbnail}
            alt={movie.title || 'Movie thumbnail'}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium mb-2">{movie.title}</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-[#2A2A3A] hover:bg-[#3A3A4A] px-4 py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Settings size={18} />
            Edit Movie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#12121A] rounded-xl overflow-hidden">
      <div className="relative aspect-[2/3]">
        <img
          src={formData.thumbnail}
          alt={formData.title || 'Movie thumbnail'}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 w-4/5">
            <div className="flex w-full gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={handleImageUrlChange}
                placeholder="Paste image URL here..."
                className="flex-1 bg-[#2A2A3A] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                onClick={handleImageUrlSubmit}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Upload size={18} />
                Set Image
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          <div className="text-sm text-gray-400 mb-2">Movie Details</div>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full bg-[#2A2A3A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Movie title"
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full bg-[#2A2A3A] rounded-lg px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Movie description"
          />
          <div className="flex justify-between">
            <button
              onClick={() => removeMovie(movie.id)}
              className="px-4 py-2 rounded-lg text-red-400 hover:bg-red-400/10 flex items-center gap-2"
            >
              <Trash2 size={20} />
              Delete
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg hover:bg-white/5 flex items-center gap-2"
              >
                <X size={20} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Save size={20} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieEditor;