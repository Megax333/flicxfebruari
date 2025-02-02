import React from 'react';
import TimelinePost from './TimelinePost';
import { timelinePosts } from '../../data/trendingData';

const TrendingTimeline = () => {
  return (
    <div className="divide-y divide-white/10">
      {timelinePosts.map((post) => (
        <TimelinePost key={post.id} post={post} />
      ))}
    </div>
  );
}

export default TrendingTimeline;