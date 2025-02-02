import React, { useState } from 'react';
import { Book, BookOpen, Bookmark, ChevronDown, Search, Filter, BookOpenCheck, Sparkles } from 'lucide-react';

const Library = () => {
  const [activeSection, setActiveSection] = useState('comics');

  const books = [
    {
      id: 1,
      title: "The Quantum Codex",
      author: "Dr. Elena Santos",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      category: "Science",
      rating: 4.8
    },
    {
      id: 2,
      title: "Digital Renaissance",
      author: "Marcus Chen",
      cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
      category: "History",
      rating: 4.9
    },
    {
      id: 3,
      title: "Nebula Dreams",
      author: "Aurora Night",
      cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
      category: "Science Fiction",
      rating: 4.7
    }
  ];

  const comics = [
    { id: 1, title: "Cyber Samurai", author: "Kai Yoshida", cover: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=300&h=400&fit=crop", issue: "#1", rating: 4.9 },
    { id: 2, title: "Neo Tokyo Tales", author: "Yuki Tanaka", cover: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=300&h=400&fit=crop", issue: "#5", rating: 4.8 },
    { id: 3, title: "Digital Dreams", author: "Alex Chen", cover: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=400&fit=crop", issue: "#1", rating: 4.7 },
    { id: 4, title: "Quantum Knights", author: "Sarah Lee", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop", issue: "#3", rating: 4.9 },
    { id: 5, title: "Future Pulse", author: "Mike Zhang", cover: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=300&h=400&fit=crop", issue: "#2", rating: 4.6 },
    { id: 6, title: "Neon Shadows", author: "Emma Wilson", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop", issue: "#4", rating: 4.8 },
    { id: 7, title: "Ghost Protocol", author: "James Chen", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop", issue: "#1", rating: 4.7 },
    { id: 8, title: "Cyber Legacy", author: "Diana Kim", cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop", issue: "#2", rating: 4.9 },
    { id: 9, title: "Neural Storm", author: "Ryan Park", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop", issue: "#3", rating: 4.8 },
    { id: 10, title: "Data Hunters", author: "Lisa Wong", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop", issue: "#1", rating: 4.7 }
  ];

  return (
    <div className="min-h-screen">
      {/* Compact Library Header */}
      <div className="bg-[#1E1E2A] rounded-xl p-4 mb-4 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-50"></div>
        <div className="relative flex items-center gap-8">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Digital Library & Comics Hub
            </h1>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveSection('comics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                  activeSection === 'comics'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <BookOpen size={16} className="text-purple-400" />
                Comics
              </button>
              <button
                onClick={() => setActiveSection('books')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                  activeSection === 'books'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <Book size={16} className="text-blue-400" />
                Books
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search the library..."
                className="w-full bg-[#2A2A3A] text-gray-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <button className="bg-[#2A2A3A] px-4 rounded-lg flex items-center gap-2 hover:bg-[#3A3A4A]">
              <Filter size={18} />
              Filters
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-purple-400" size={24} />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Featured {activeSection === 'books' ? 'Books' : 'Comics'}
          </h2>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {(activeSection === 'books' ? books : comics).map((item) => (
            <div key={item.id} className="group relative">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#2A2A3A] border border-white/10 group-hover:border-purple-500/50 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-300 mb-3">by {item.author}</p>
                    {'issue' in item && (
                      <span className="bg-purple-600 px-2 py-1 rounded text-sm">
                        Issue {item.issue}
                      </span>
                    )}
                    {'category' in item && (
                      <span className="bg-blue-600 px-2 py-1 rounded text-sm">
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-purple-600 transition-colors">
                <Bookmark size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reading Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1E1E2A] p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-600/20 p-3 rounded-xl">
              <BookOpenCheck size={24} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">247</h3>
              <p className="text-gray-400">Books Read</p>
            </div>
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div className="h-full w-3/4 bg-purple-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;