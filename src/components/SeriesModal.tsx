import React, { useState, useEffect } from 'react';
import { X, Play, Star, Users, Calendar, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CustomVideoPlayer from './player/CustomVideoPlayer';

interface SeriesModalProps {
  movie: {
    id: string;
    title: string;
    description: string;
    preview: string;
    thumbnail: string;
    tags: string[];
  };
  onClose: () => void;
}

const SeriesModal = ({ movie, onClose }: SeriesModalProps) => {
  const [episodes, setEpisodes] = useState([]);
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [shouldPlayAd, setShouldPlayAd] = useState(true);

  useEffect(() => {
    const fetchEpisodes = async () => {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('movie_id', movie.id)
        .order('number');
      
      if (error) {
        console.error('Error fetching episodes:', error);
        return;
      }
      
      setEpisodes(data || []);
    };

    fetchEpisodes();
  }, [movie.id]);

  const handlePlayEpisode = (episode) => {
    setShouldPlayAd(true);
    setActiveEpisode(episode);
  };

  const handleNextEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.id === activeEpisode.id);
    if (currentIndex < episodes.length - 1) {
      setActiveEpisode(null); // First clear current episode
      setShouldPlayAd(true); // Reset ad flag
      // Use RAF to ensure state updates are processed
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setActiveEpisode(episodes[currentIndex + 1]); // Then set new episode
        });
      });
    }
  };

  const handlePreviousEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.id === activeEpisode.id);
    if (currentIndex > 0) {
      setShouldPlayAd(true);
      setActiveEpisode(episodes[currentIndex - 1]);
    }
  };

  const handleClosePlayer = () => {
    setActiveEpisode(null);
    setShouldPlayAd(true);
  };

  const hasNextEpisode = activeEpisode && 
    episodes.findIndex(ep => ep.id === activeEpisode.id) < episodes.length - 1;

  const hasPreviousEpisode = activeEpisode && 
    episodes.findIndex(ep => ep.id === activeEpisode.id) > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/90" onClick={onClose} />
      
      <div className="relative min-h-screen">
        {/* Close Button - Only show when video is not playing */}
        {!activeEpisode && (
          <button
            onClick={onClose}
            className="fixed top-4 right-4 z-50 p-2 bg-[#1E1E2A] rounded-full hover:bg-[#2A2A3A] transition-colors"
          >
            <X size={24} />
          </button>
        )}

        {/* Video Player */}
        {activeEpisode ? (
          <div className="fixed inset-0 z-50 bg-black">
            <CustomVideoPlayer
              videoUrl={activeEpisode.video_url}
              title={activeEpisode.title}
              playAd={shouldPlayAd}
              onAdEnd={() => setShouldPlayAd(false)}
              episodeNumber={activeEpisode.number}
              onClose={handleClosePlayer}
              onNextEpisode={handleNextEpisode}
              onPreviousEpisode={handlePreviousEpisode}
              hasNextEpisode={hasNextEpisode}
              hasPreviousEpisode={hasPreviousEpisode}
            />
          </div>
        ) : (
          <div className="relative h-[70vh]">
            <video
              src={movie.preview}
              controls
              className="w-full h-full object-cover"
              autoPlay
              loop
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/50 to-transparent">
              <div className="absolute bottom-12 left-12 right-12">
                <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                <p className="text-lg text-gray-300 max-w-3xl mb-8">
                  {movie.description}
                </p>
                {episodes.length > 0 && (
                  <button 
                    onClick={() => handlePlayEpisode(episodes[0])}
                    className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full flex items-center gap-2"
                  >
                    <Play size={20} fill="white" />
                    Play Episode 1
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Episodes List - Only show when video is not playing */}
        {!activeEpisode && (
          <div className="max-w-7xl mx-auto px-12 py-12">
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Episodes</h2>
              <div className="grid grid-cols-2 gap-4">
                {episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="bg-[#1E1E2A] rounded-xl p-4 hover:bg-[#2A2A3A] transition-colors cursor-pointer group"
                    onClick={() => handlePlayEpisode(episode)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Episode {episode.number}</span>
                      <span className="text-sm text-gray-400">{episode.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{episode.title}</h3>
                      <Play
                        size={20}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesModal;