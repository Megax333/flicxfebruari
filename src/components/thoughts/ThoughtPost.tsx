import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, ArrowBigUp, Play, Pause } from 'lucide-react';
import { formatTimeAgo } from '../../utils/dateUtils';
import type { ThoughtPost as ThoughtPostType } from '../../types/thoughts';
import { useViewStore } from '../../stores/viewStore';
import { cn } from '../../utils/cn';

interface ThoughtPostProps {
  post: ThoughtPostType;
  expanded?: boolean;
}

const ThoughtPost = ({ post, expanded = false }: ThoughtPostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const { setSelectedTribe } = useViewStore();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const navigateToProfile = () => {
    window.location.href = `/${post.author.handle}`;
  };

  return (
    <div className={cn(
      "p-6 transition-colors",
      !expanded && "hover:bg-white/5"
    )}>
      <div className="flex gap-4">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-600/20"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <span 
                className="font-bold hover:underline cursor-pointer"
                onClick={navigateToProfile}
              >
                {post.author.name}
              </span>
              <span className="text-gray-400 ml-2">@{post.author.handle}</span>
              <span className="text-gray-400 mx-2">·</span>
              <span className="text-gray-400 hover:underline cursor-pointer">
                {formatTimeAgo(post.timestamp)}
              </span>
            </div>
            {post.type && (
              <span className="px-2 py-1 rounded text-xs bg-purple-600/20 text-purple-400">
                {post.type}
              </span>
            )}
          </div>

          <p className="mt-2 text-gray-100 whitespace-pre-wrap">{post.content}</p>

          {post.media && (
            <div className="mt-3 rounded-xl overflow-hidden relative group">
              <img
                src={post.media}
                alt="Post media"
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}

          {post.audioUrl && (
            <div className="mt-3 bg-[#2A2A3A] p-4 rounded-xl flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-purple-600 p-3 rounded-full hover:bg-purple-700 transition-colors"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <div className="flex-1">
                <div className="h-1 bg-gray-700 rounded-full">
                  <div className="h-full w-0 bg-purple-600 rounded-full" />
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-gray-400">
            <button
              onClick={handleLike}
              className={`group flex items-center gap-2 transition-colors ${
                isLiked ? 'text-purple-500' : 'hover:text-purple-500'
              }`}
            >
              <ArrowBigUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>
            <button className="group flex items-center gap-2 hover:text-blue-500">
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments}</span>
            </button>
            <button className="group flex items-center gap-2 hover:text-green-500">
              <Share2 className="w-5 h-5" />
              <span>{post.shares}</span>
            </button>
            <button className="hover:text-yellow-500">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThoughtPost;