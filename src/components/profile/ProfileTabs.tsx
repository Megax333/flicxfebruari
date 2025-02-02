import React, { useState } from 'react';
import { BrainCircuit, Film, Sparkles, Bookmark } from 'lucide-react';
import ThoughtPost from '../thoughts/ThoughtPost';
import type { Profile } from '../../types/profile';

interface ProfileTabsProps {
  profile: Profile;
}

const ProfileTabs = ({ profile }: ProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState('thoughts');

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('thoughts')}
          className={`px-6 py-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'thoughts'
              ? 'border-purple-600 text-purple-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <BrainCircuit size={20} />
          Thoughts
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-6 py-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'projects'
              ? 'border-purple-600 text-purple-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Film size={20} />
          Projects
        </button>
        <button
          onClick={() => setActiveTab('highlights')}
          className={`px-6 py-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'highlights'
              ? 'border-purple-600 text-purple-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Sparkles size={20} />
          Highlights
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-6 py-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'saved'
              ? 'border-purple-600 text-purple-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Bookmark size={20} />
          Saved
        </button>
      </div>

      <div className="py-6">
        {activeTab === 'thoughts' && (
          <div className="space-y-6">
            {profile.thoughts.map((thought) => (
              <ThoughtPost key={thought.id} post={thought} />
            ))}
          </div>
        )}
        {/* Add other tab content */}
      </div>
    </div>
  );
};

export default ProfileTabs;