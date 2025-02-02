import React from 'react';
import ThoughtPost from './ThoughtPost';
import { thoughtPosts } from '../../data/thoughtsData';

const ThoughtTimeline = () => {
  return (
    <div>
      {thoughtPosts.map((post) => (
        <ThoughtPost key={post.id} post={post} />
      ))}
    </div>
  );
};

export default ThoughtTimeline;