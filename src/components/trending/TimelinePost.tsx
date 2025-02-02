import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, BarChart2 } from 'lucide-react';
import { formatTimeAgo } from '../../utils/dateUtils';
import type { Post } from '../../types/trending';

interface TimelinePostProps {
  post: Post;
}

const TimelinePost = ({ post }: TimelinePostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <div className="p-6 hover:bg-white/5 transition-colors">
      <div className="flex gap-4">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-bold hover:underline cursor-pointer">
                {post.author.name}
              </span>
              <span className="text-gray-400 ml-2">@{post.author.handle}</span>
              <span className="text-gray-400 mx-2">·</span>
              <span className="text-gray-400 hover:underline cursor-pointer">
                {formatTimeAgo(post.timestamp)}
              </span>
            </div>
            {post.projectUpdate && (
              <span className="px-2 py-1 rounded text-xs bg-purple-600/20 text-purple-400">
                Project Update
              </span>
            )}
          </div>

          <p className="mt-2 text-gray-100 whitespace-pre-wrap">{post.content}</p>

          {post.media && (
            <div className="mt-3 rounded-xl overflow-hidden">
              <img
                src={post.media}
                alt="Post media"
                className="w-full h-auto"
              />
            </div>
          )}

          {post.projectProgress && (
            <div className="mt-4 bg-[#2A2A3A] p-4 rounded-xl">
              <div className="flex justify-between text-sm mb-2">
                <span>Project Progress</span>
                <span className="font-bold">{post.projectProgress}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all"
                  style={{ width: `${post.projectProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-gray-400">
            <button
              onClick={handleLike}
              className={`group flex items-center gap-2 transition-colors ${
                isLiked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
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
            <button className="group flex items-center gap-2 hover:text-purple-500">
              <BarChart2 className="w-5 h-5" />
              <span>{post.views}</span>
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

export default TimelinePost;