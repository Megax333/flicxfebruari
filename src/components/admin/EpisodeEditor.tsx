import React, { useState } from 'react';
import { Plus, Save, X, Film } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const EpisodeEditor = ({ movies }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newEpisode, setNewEpisode] = useState({
    number: '',
    title: '',
    videoUrl: '',
    duration: ''
  });

  const fetchEpisodes = async (movieId) => {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('movie_id', movieId)
      .order('number');
    
    if (error) {
      console.error('Error fetching episodes:', error);
      return;
    }
    
    setEpisodes(data || []);
  };

  const handleSave = async () => {
    if (!selectedMovie || !newEpisode.number || !newEpisode.title || !newEpisode.videoUrl || !newEpisode.duration) {
      setError('Please fill in all fields');
      console.error('Missing required fields');
      return;
    }

    setLoading(true);
    setError(null);

    console.log('Saving episode:', {
      movie_id: selectedMovie,
      number: parseInt(newEpisode.number),
      title: newEpisode.title,
      video_url: newEpisode.videoUrl,
      duration: newEpisode.duration
    });

    const { data, error } = await supabase
      .from('episodes')
      .insert([{
        movie_id: selectedMovie,
        number: parseInt(newEpisode.number),
        title: newEpisode.title,
        video_url: newEpisode.videoUrl,
        duration: newEpisode.duration
      }])
      .select()
      .single();

    if (error) {
      setError(error.message);
      console.error('Error saving episode:', error);
      setLoading(false);
      return;
    }

    console.log('Episode saved successfully:', data);

    setEpisodes(prev => [...prev, data]);
    setNewEpisode({
      number: '',
      title: '',
      videoUrl: '',
      duration: ''
    });
    
    setLoading(false);
  };

  const handleMovieSelect = (movieId) => {
    setSelectedMovie(movieId);
    setError(null);
    fetchEpisodes(movieId);
  };

  return (
    <div className="space-y-6">
      {/* Movie Selection */}
      <div className="bg-[#2A2A3A] rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Select Series</h3>
        <div className="grid grid-cols-4 gap-4">
          {movies.map((movie) => (
            <button
              key={movie.id}
              onClick={() => handleMovieSelect(movie.id)}
              className={`relative group overflow-hidden rounded-xl ${
                selectedMovie === movie.id
                  ? 'ring-2 ring-purple-600'
                  : 'hover:ring-2 hover:ring-purple-600/50'
              }`}
            >
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <h4 className="text-sm font-medium truncate">{movie.title}</h4>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Episode Form */}
      {selectedMovie && (
        <div className="bg-[#2A2A3A] rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Add New Episode</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Episode Number</label>
                <input
                  type="number"
                  value={newEpisode.number}
                  onChange={(e) => setNewEpisode(prev => ({ ...prev, number: e.target.value }))}
                  className="w-full bg-[#1E1E2A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="text"
                  value={newEpisode.duration}
                  onChange={(e) => setNewEpisode(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full bg-[#1E1E2A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="45m"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Episode Title</label>
              <input
                type="text"
                value={newEpisode.title}
                onChange={(e) => setNewEpisode(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-[#1E1E2A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter episode title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Video URL</label>
              <input
                type="text"
                value={newEpisode.videoUrl}
                onChange={(e) => setNewEpisode(prev => ({ ...prev, videoUrl: e.target.value }))}
                className="w-full bg-[#1E1E2A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="https://example.com/video.mp4"
              />
            </div>

            <div className="flex justify-end gap-2">
              {error && <p className="text-red-500 text-sm mr-auto">{error}</p>}
              <button
                onClick={() => setNewEpisode({
                  number: '',
                  title: '',
                  videoUrl: '',
                  duration: ''
                })}
                className="px-4 py-2 rounded-lg hover:bg-white/5 flex items-center gap-2"
              >
                <X size={18} />
                Clear
              </button>
              <button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2"
                disabled={loading || !selectedMovie}
              >
                <Save size={18} />
                Save Episode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Episodes List */}
      {selectedMovie && (
        <div className="bg-[#2A2A3A] rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Episodes List</h3>
          <div className="space-y-2">
            {episodes.map((episode) => (
              <div key={episode.id} className="bg-[#1E1E2A] p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-600/20 p-2 rounded-lg">
                    <Film size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">Episode {episode.number}: {episode.title}</div>
                    <div className="text-sm text-gray-400">{episode.duration}</div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodeEditor;