import React, { useEffect } from 'react';
import CoinIcon from './CoinIcon';
import UserAvatar from './UserAvatar';
import UserName from './UserName';
import { useFeaturedCreatorsStore } from '../stores/featuredCreatorsStore';

const Creators = () => {
  const { creators, initializeCreators, loading } = useFeaturedCreatorsStore();

  useEffect(() => {
    initializeCreators();
  }, [initializeCreators]);

  if (loading) {
    return (
      <section>
        <div className="grid grid-cols-9 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex flex-col items-center animate-pulse">
              <div className="w-16 h-16 rounded-full bg-purple-600/20 mb-2" />
              <div className="w-20 h-4 bg-purple-600/20 rounded mb-2" />
              <div className="w-24 h-8 bg-purple-600/20 rounded-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-9 gap-6">
        {creators.map((creator) => (
          <div
            key={creator.id}
            className="flex flex-col items-center"
          >
            <UserAvatar
              src={creator.avatar}
              alt={creator.name}
              handle={creator.username}
              size="xl"
              className="mb-2"
            />
            <UserName
              name={creator.name}
              handle={creator.username}
              showHandle={false}
              className="text-sm font-medium text-center mb-2"
            />
            <button className="group relative flex items-center gap-1.5 bg-[#1E1E2A] hover:bg-[#2A2A3A] px-4 py-1.5 rounded-full transition-all">
              <div className="relative">
                <CoinIcon size={16} />
                <div className="absolute inset-0 bg-[#00E0FF]/20 rounded-full blur-sm animate-pulse"></div>
              </div>
              <span className="text-sm">Follow</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Creators;