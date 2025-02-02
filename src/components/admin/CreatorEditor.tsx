import React, { useState, useEffect } from 'react';
import { Upload, Save, X } from 'lucide-react';
import { useFeaturedCreatorsStore } from '../../stores/featuredCreatorsStore';

const CreatorEditor = () => {
  const { creators, loading, error, updateCreator, initializeCreators } = useFeaturedCreatorsStore();
  const [editingCreator, setEditingCreator] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, any>>({});

  useEffect(() => {
    // Initial load of creators
    initializeCreators();
  }, [initializeCreators]);

  const handleEdit = (creator) => {
    setEditingCreator(creator.id);
    setEditForm({
      avatar: creator.avatar,
      bio: creator.bio || ''
    });
  };

  const handleSave = async (creator) => {
    if (!editForm.avatar?.trim()) {
      console.error('Avatar URL is required');
      return;
    }

    try {
      await updateCreator(creator.id, {
        avatar: editForm.avatar.trim(),
        bio: editForm.bio?.trim() || ''
      });
      setEditingCreator(null);
      setEditForm({});
    } catch (err) {
      console.error('Error saving creator:', err);
    }
  };

  if (loading && creators.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 mb-4">
          <p>Error loading creators: {error}</p>
        </div>
        <button 
          onClick={() => initializeCreators()}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {creators.map((creator) => (
        <div
          key={creator.id}
          className="bg-[#1E1E2A] rounded-xl overflow-hidden hover:bg-[#2A2A3A] transition-all duration-300"
        >
          {editingCreator === creator.id ? (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Avatar URL</label>
                <input
                  type="text"
                  value={editForm.avatar || ''}
                  onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                  className="w-full bg-[#2A2A3A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Enter avatar URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  value={editForm.bio || ''}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full bg-[#2A2A3A] rounded-lg px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Enter bio"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setEditingCreator(null);
                    setEditForm({});
                  }}
                  className="px-4 py-2 rounded-lg hover:bg-white/5 flex items-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  onClick={() => handleSave(creator)}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="relative aspect-[3/2]">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleEdit(creator)}
                  className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-purple-600/80 backdrop-blur-sm"
                  title="Edit Creator"
                >
                  <Upload size={18} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{creator.name}</h3>
                <p className="text-sm text-gray-400">@{creator.username}</p>
                <p className="mt-2 text-sm text-gray-300">{creator.bio}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CreatorEditor;