import React, { useState, useEffect } from 'react';
import { Film, Clock, Upload, Save, X, Plus, Trash2, Calendar, Globe, Sparkles, Tv } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const LiveTVEditor = () => {
  const [channels, setChannels] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [editingChannel, setEditingChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [channelForm, setChannelForm] = useState({
    name: '',
    category: '',
    icon: 'film',
    thumbnail: '',
    videoUrl: '',
    isLive: false
  });

  const [programForm, setProgramForm] = useState({
    channelId: '',
    title: '',
    startTime: '',
    endTime: '',
    description: ''
  });

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
    } catch (err) {
      console.error('Error fetching channels:', err);
      setError(err.message);
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
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError(err.message);
    }
  };

  const handleSaveChannel = async () => {
    setLoading(true);
    try {
      const channelData = {
        name: channelForm.name,
        category: channelForm.category,
        icon: channelForm.icon,
        thumbnail: channelForm.thumbnail,
        video_url: channelForm.videoUrl,
        is_live: channelForm.isLive
      };

      let result;
      if (editingChannel) {
        const { data, error } = await supabase
          .from('tv_channels')
          .update(channelData)
          .eq('id', editingChannel.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        
        setChannels(prev => prev.map(ch => ch.id === editingChannel.id ? result : ch));
      } else {
        const { data, error } = await supabase
          .from('tv_channels')
          .insert([channelData])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        
        setChannels(prev => [...prev, result]);
      }

      setEditingChannel(null);
      setChannelForm({
        name: '',
        category: '',
        icon: 'film',
        thumbnail: '',
        videoUrl: '',
        isLive: false
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChannel = (channel) => {
    setEditingChannel(channel);
    setChannelForm({
      name: channel.name,
      category: channel.category,
      icon: channel.icon,
      thumbnail: channel.thumbnail,
      videoUrl: channel.video_url,
      isLive: channel.is_live
    });
  };

  const handleDeleteChannel = async (id) => {
    if (!window.confirm('Are you sure you want to delete this channel?')) return;
    
    try {
      const { error } = await supabase
        .from('tv_channels')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setChannels(prev => prev.filter(channel => channel.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const iconOptions = [
    { value: 'film', label: 'Film', icon: <Film size={20} className="text-purple-400" /> },
    { value: 'globe', label: 'Globe', icon: <Globe size={20} className="text-blue-400" /> },
    { value: 'sparkles', label: 'Sparkles', icon: <Sparkles size={20} className="text-yellow-400" /> },
    { value: 'tv', label: 'TV', icon: <Tv size={20} className="text-green-400" /> }
  ];

  return (
    <div className="space-y-8">
      {/* Channel Form */}
      <div className="bg-[#1E1E2A] rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">
          {editingChannel ? 'Edit Channel' : 'Add New Channel'}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Channel Name</label>
            <input
              type="text"
              value={channelForm.name}
              onChange={(e) => setChannelForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-[#2A2A3A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter channel name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={channelForm.category}
              onChange={(e) => setChannelForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-[#2A2A3A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter category"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Icon</label>
            <select
              value={channelForm.icon}
              onChange={(e) => setChannelForm(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full bg-[#2A2A3A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {iconOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
            <input
              type="text"
              value={channelForm.thumbnail}
              onChange={(e) => setChannelForm(prev => ({ ...prev, thumbnail: e.target.value }))}
              className="w-full bg-[#2A2A3A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter thumbnail URL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Video URL</label>
            <input
              type="text"
              value={channelForm.videoUrl}
              onChange={(e) => setChannelForm(prev => ({ ...prev, videoUrl: e.target.value }))}
              className="w-full bg-[#2A2A3A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter video URL"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={channelForm.isLive}
                onChange={(e) => setChannelForm(prev => ({ ...prev, isLive: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span>Live Channel</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => {
              setEditingChannel(null);
              setChannelForm({
                name: '',
                category: '',
                icon: 'film',
                thumbnail: '',
                videoUrl: '',
                isLive: false
              });
            }}
            className="px-4 py-2 rounded-lg hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChannel}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Channel'}
          </button>
        </div>
      </div>

      {/* Channels Grid */}
      <div>
        <h3 className="text-lg font-bold mb-4">Channel List</h3>
        <div className="grid grid-cols-3 gap-6">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="bg-[#1E1E2A] rounded-xl overflow-hidden group"
            >
              <div className="relative aspect-video">
                <img
                  src={channel.thumbnail}
                  alt={channel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleEditChannel(channel)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Upload size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteChannel(channel.id)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {iconOptions.find(opt => opt.value === channel.icon)?.icon}
                  <h3 className="font-medium">{channel.name}</h3>
                </div>
                <p className="text-sm text-gray-400">{channel.category}</p>
                {channel.is_live && (
                  <span className="inline-flex items-center gap-1 text-xs bg-red-500 px-2 py-0.5 rounded-full mt-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTVEditor;