import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutList, MessageCircle, ArrowBigUp, Share2, Filter, Zap, Clock, Crown, Bookmark, MoreHorizontal, Loader2 } from 'lucide-react';
import ThoughtPost from '../thoughts/ThoughtPost';
import { cn } from '../../utils/cn';
import { usePosts } from '../../hooks/usePosts';

const InnovativeTimeline = ({ tribe = null }) => {
  const [view, setView] = useState('grid');
  const [focusedPost, setFocusedPost] = useState(null);
  const [hoveredPost, setHoveredPost] = useState(null);
  const { posts, sortBy, setSortBy, loading, error } = usePosts(tribe);

  const sortOptions = [
    { id: 'hot', label: 'Hot', icon: <Zap className="text-purple-400" /> },
    { id: 'new', label: 'New', icon: <Clock className="text-blue-400" /> },
    { id: 'top', label: 'Top', icon: <Crown className="text-yellow-400" /> }
  ];

  return (
    <div className="relative">
      <div className="sticky top-16 z-10 bg-[#0A0A0F] py-3 px-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {tribe ? `r/${tribe}` : 'Your Feed'}
          </h2>
          <div className="flex items-center gap-2">
            {sortOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 transition-all",
                  sortBy === option.id 
                    ? "bg-[#1E1E2A] text-white border border-purple-500/50" 
                    : "text-gray-400 hover:text-white"
                )}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={40} className="text-purple-500 animate-spin mb-4" />
          <p className="text-gray-400">Loading posts...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 max-w-md">
            <h3 className="text-red-400 font-medium mb-2">Error Loading Posts</h3>
            <p className="text-gray-300">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-6 max-w-md text-center">
            <h3 className="text-blue-400 font-medium mb-2">No Posts Found</h3>
            <p className="text-gray-300">
              {tribe 
                ? `There are no posts in r/${tribe} yet. Be the first to post!` 
                : 'There are no posts in your feed yet. Try following some tribes or users!'}
            </p>
          </div>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="divide-y divide-white/10">
          {posts.map(post => (
            <motion.article
              key={post.id}
              layoutId={post.id}
              className={cn(
                "hover:bg-[#1E1E2A] transition-all duration-500 cursor-pointer",
                "relative group"
              )}
              onClick={() => setFocusedPost(post)}
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button className="p-1.5 rounded-full hover:bg-white/10">
                  <Bookmark size={16} className="text-gray-400 hover:text-purple-400" />
                </button>
                <button className="p-1.5 rounded-full hover:bg-white/10">
                  <MoreHorizontal size={16} className="text-gray-400 hover:text-purple-400" />
                </button>
              </div>
              <ThoughtPost post={post} />
            </motion.article>
          ))}
        </div>
      )}

      <AnimatePresence>
        {focusedPost && (
          <motion.div
            layoutId={focusedPost.id}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setFocusedPost(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="relative bg-[#1E1E2A]/90 backdrop-blur-xl rounded-xl w-[800px] max-h-[90vh] overflow-y-auto border border-white/10"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ThoughtPost post={focusedPost} expanded />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InnovativeTimeline;