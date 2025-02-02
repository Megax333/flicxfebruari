import React, { useState, useEffect } from 'react';
import { Play, Upload, Trash2, BarChart2, Eye, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdManager = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAd, setNewAd] = useState({
    title: '',
    video_url: '',
    reward_amount: 0.05,
    is_active: true
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select(`
          *,
          ad_impressions (
            count
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('ads')
        .insert([newAd]);

      if (error) throw error;

      setNewAd({
        title: '',
        video_url: '',
        reward_amount: 0.05,
        is_active: true
      });
      
      fetchAds();
    } catch (error) {
      console.error('Error adding ad:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('ads')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchAds();
    } catch (error) {
      console.error('Error toggling ad status:', error);
      setError(error.message);
    }
  };

  const deleteAd = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;

    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchAds();
    } catch (error) {
      console.error('Error deleting ad:', error);
      setError(error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Ad Form */}
      <div className="bg-[#1E1E2A] rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Add New Advertisement</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={newAd.title}
              onChange={(e) => setNewAd(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-[#2A2A3A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Video URL</label>
            <input
              type="url"
              value={newAd.video_url}
              onChange={(e) => setNewAd(prev => ({ ...prev, video_url: e.target.value }))}
              className="w-full bg-[#2A2A3A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reward Amount (XCE)</label>
            <input
              type="number"
              step="0.01"
              value={newAd.reward_amount}
              onChange={(e) => setNewAd(prev => ({ ...prev, reward_amount: parseFloat(e.target.value) }))}
              className="w-full bg-[#2A2A3A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newAd.is_active}
              onChange={(e) => setNewAd(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded border-gray-400 text-purple-600 focus:ring-purple-500"
            />
            <label className="text-sm">Active</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Upload size={18} />
            Add Advertisement
          </button>
        </form>
      </div>

      {/* Ads List */}
      <div className="bg-[#1E1E2A] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="font-bold">Advertisements</h3>
        </div>

        <div className="divide-y divide-white/10">
          {ads.map((ad) => (
            <div key={ad.id} className="p-4 hover:bg-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 bg-[#2A2A3A] rounded-lg overflow-hidden relative group">
                    <video
                      src={ad.video_url}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={24} />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium">{ad.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{ad.ad_impressions?.[0]?.count || 0} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{new Date(ad.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAdStatus(ad.id, ad.is_active)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      ad.is_active
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {ad.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => deleteAd(ad.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdManager;