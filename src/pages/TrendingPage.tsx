import React from 'react';
import TrendingTimeline from '../components/trending/TrendingTimeline';
import TrendingTopics from '../components/trending/TrendingTopics';
import SuggestedCreators from '../components/trending/SuggestedCreators';

const TrendingPage = () => {
  return (
    <div className="min-h-screen grid grid-cols-[1fr,600px,1fr] gap-6">
      {/* Left Sidebar */}
      <div className="pl-6">
        <TrendingTopics />
      </div>

      {/* Main Timeline */}
      <div className="border-x border-white/10">
        <TrendingTimeline />
      </div>

      {/* Right Sidebar */}
      <div className="pr-6">
        <SuggestedCreators />
      </div>
    </div>
  );
};

export default TrendingPage;