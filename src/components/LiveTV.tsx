import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Maximize2, Film, Gamepad, Tv, Globe, Sparkles } from 'lucide-react';
import TVGuide from './TVGuide';
import { supabase } from '../lib/supabase';

const LiveTV = () => {
  const [activeChannel, setActiveChannel] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [channels, setChannels] = useState([]);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetchChannels();
    fetchPrograms();
  }, []);

  const fetchChannels = async () => {
    try {
      const { data, error } = await supabase
        .from('tv_channels')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setChannels(data || []);
      // Set first channel as active if none selected
      if (!activeChannel && data?.length > 0) {
        setActiveChannel(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('tv_programs')
        .select('*')
        .order('start_time');
      
      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const getChannelIcon = (iconName) => {
    switch (iconName) {
      case 'film': return <Film size={20} className="text-purple-400" />;
      case 'globe': return <Globe size={20} className="text-blue-400" />;
      case 'sparkles': return <Sparkles size={20} className="text-yellow-400" />;
      default: return <Tv size={20} className="text-gray-400" />;
    }
  };

  const getCurrentProgram = (channelId) => {
    const now = new Date();
    return programs.find(program => 
      program.channel_id === channelId &&
      new Date(program.start_time) <= now &&
      new Date(program.end_time) >= now
    );
  };

  const getNextProgram = (channelId) => {
    const now = new Date();
    return programs.find(program => 
      program.channel_id === channelId &&
      new Date(program.start_time) > now
    );
  };

  const activeChannelData = channels.find(c => c.id === activeChannel);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = async () => {
    if (!videoRef.current) return;
    
    try {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          await videoRef.current.requestFullscreen();
        } else if (videoRef.current.webkitRequestFullscreen) {
          await videoRef.current.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="min-h-screen">
      <div>
        {/* Main Content */}
        <div className="space-y-6">
          {/* Video Player */}
          <div className="relative aspect-video overflow-hidden bg-[#0A0A0F] group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5" />
            
            {activeChannelData && (
              <video
                ref={videoRef}
                key={activeChannelData.id}
                src={activeChannelData.video_url}
                poster={activeChannelData.thumbnail}
                className="w-full h-full object-cover"
                autoPlay={true}
                muted={false}
                onClick={toggleFullscreen}
                loop
              />
            )}

            {/* Program Info */}
            {activeChannelData && (
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 backdrop-blur-sm p-4 rounded-xl">
                  <h2 className="text-2xl font-bold mb-1">{getCurrentProgram(activeChannelData.id)?.title || 'No Program'}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span>Up Next: {getNextProgram(activeChannelData.id)?.title || 'No Program'}</span>
                    <span>Category: {activeChannelData.category}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-purple-600/50 transition-colors">
                <Volume2 size={20} />
              </button>
              <button 
                onClick={toggleFullscreen}
                className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-purple-600/50 transition-colors"
              >
                <Maximize2 size={20} />
              </button>
            </div>
          </div>

          {/* Channel List */}
          <div className="grid grid-cols-5 gap-4">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`relative group overflow-hidden rounded-xl ${
                  activeChannel === channel.id
                    ? 'ring-2 ring-purple-600'
                    : 'hover:ring-2 hover:ring-purple-600/50 transition-all'
                }`}
              >
                <img
                  src={channel.thumbnail}
                  alt={channel.name}
                  className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center gap-2 mb-1">
                    {getChannelIcon(channel.icon)}
                    <span className="font-medium text-sm">{channel.name}</span>
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {getCurrentProgram(channel.id)?.title || 'No Program'}
                  </div>
                </div>
                {channel.is_live && (
                  <div className="absolute top-2 right-2 bg-red-500 px-2 py-0.5 rounded text-xs font-bold">
                    LIVE
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TV Guide */}
      <div className="mt-6">
        <TVGuide channels={channels} programs={programs} />
      </div>
    </div>
  );
};

export default LiveTV;