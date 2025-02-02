import React from 'react';
import ThoughtTimeline from '../components/thoughts/ThoughtTimeline';
import TrendingThoughts from '../components/thoughts/TrendingThoughts';
import ThoughtComposer from '../components/thoughts/ThoughtComposer';

const ThoughtWorldPage = () => {
  return (
    <div className="min-h-screen grid grid-cols-[1fr,600px,320px] gap-6 pt-20">
      <div className="pl-6" /> {/* Spacer */}
      
      {/* Main Timeline */}
      <div>
        <ThoughtComposer />
        <div className="border-x border-white/10">
          <ThoughtTimeline />
        </div>
      </div>

      {/* Trending Thoughts */}
      <div className="pr-6">
        <TrendingThoughts />
      </div>
    </div>
  );
};

export default ThoughtWorldPage;