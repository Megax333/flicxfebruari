import React from 'react';
import { ChevronLeft, ChevronRight, Users, Clock, DollarSign, Sparkles } from 'lucide-react';
import CoinIcon from './CoinIcon';
import { useState } from 'react';

const Fundraisers = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemsPerPage = 1;

  const projects = [
    {
      id: 1,
      title: "Neo-Tokyo Chronicles",
      creator: "Studio Quantum",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=800&fit=crop",
      description: "A groundbreaking anime series blending cyberpunk with traditional Japanese mythology.",
      raised: 85000,
      goal: 150000,
      backers: 1234,
      daysLeft: 15,
      category: "Animation"
    },
    {
      id: 2,
      title: "Echoes of Eternity",
      creator: "Digital Dreamworks",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1614729939124-032d0bd5d11b?w=800&h=400&fit=crop",
      description: "An epic fantasy series exploring parallel universes and time manipulation.",
      raised: 45000,
      goal: 100000,
      backers: 876,
      daysLeft: 21,
      category: "Series"
    },
    {
      id: 3,
      title: "Quantum Legends",
      creator: "Future Films",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&h=400&fit=crop",
      description: "A sci-fi anthology series about quantum computing and its impact on humanity.",
      raised: 25000,
      goal: 75000,
      backers: 543,
      daysLeft: 30,
      category: "Sci-Fi"
    },
    {
      id: 4,
      title: "Digital Odyssey",
      creator: "Tech Tales",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop",
      description: "Interactive documentary series exploring the future of technology.",
      raised: 15000,
      goal: 50000,
      backers: 321,
      daysLeft: 45,
      category: "Documentary"
    },
    {
      id: 5,
      title: "Neon Dreams",
      creator: "Cyber Studios",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop",
      description: "A revolutionary VR series set in a futuristic cyberpunk world.",
      raised: 95000,
      goal: 120000,
      backers: 1876,
      daysLeft: 10,
      category: "VR"
    },
    {
      id: 6,
      title: "Cosmic Tales",
      creator: "Star Studios",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=800&h=400&fit=crop",
      description: "An interstellar adventure series exploring unknown galaxies.",
      raised: 65000,
      goal: 200000,
      backers: 987,
      daysLeft: 25,
      category: "Space"
    }
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => 
      prev + itemsPerPage >= projects.length ? 0 : prev + itemsPerPage
    );
  };

  const prevSlide = () => {
    setActiveIndex((prev) => 
      prev - itemsPerPage < 0 ? projects.length - itemsPerPage : prev - itemsPerPage
    );
  };

  const visibleProjects = projects.slice(activeIndex, activeIndex + itemsPerPage);

  return (
    <div className="min-h-screen">
      {/* Navigation Arrows */}
      <div className="fixed top-1/2 -translate-y-1/2 left-8 z-10">
        <button
          onClick={prevSlide}
          className="p-4 bg-black/50 hover:bg-purple-600/80 rounded-full backdrop-blur-sm transition-all transform hover:scale-110 border border-white/10 shadow-lg flex items-center justify-center w-14 h-14 ml-12"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
      <div className="fixed top-1/2 -translate-y-1/2 right-8 z-10">
        <button
          onClick={nextSlide}
          className="p-4 bg-black/50 hover:bg-purple-600/80 rounded-full backdrop-blur-sm transition-all transform hover:scale-110 border border-white/10 shadow-lg flex items-center justify-center w-14 h-14"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      {/* Main Carousel */}
      <div className="relative min-h-[calc(100vh-6rem)]">
        {visibleProjects.map((project) => (
          <div 
            key={project.id}
            className="flex items-center justify-center px-24 pt-4"
          >
            <div className="relative w-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-black/75" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex items-center justify-center">
                <div className="max-w-3xl relative z-10">
                  <div className="flex items-center gap-4 mb-4 mt-8">
                    <img
                      src={project.avatar}
                      alt={project.creator}
                      className="w-20 h-20 rounded-full border-2 border-white/20"
                    />
                    <div>
                      <h2 className="text-3xl font-bold">{project.title}</h2>
                      <p className="text-xl text-gray-300">by {project.creator}</p>
                    </div>
                  </div>

                  <p className="text-lg text-gray-300 mb-6 max-w-2xl">
                    {project.description}
                  </p>

                  {/* Project Video */}
                  <div className="mb-6 rounded-xl overflow-hidden">
                    <video
                      src="https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
                      className="w-full aspect-video"
                      controls
                    />
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between text-lg mb-3">
                        <span className="text-gray-300">Raised</span>
                        <span className="font-bold">${project.raised.toLocaleString()} / ${project.goal.toLocaleString()}</span>
                      </div>
                      <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${(project.raised / project.goal) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-8 text-lg">
                      <div className="flex items-center gap-2">
                        <Users size={24} className="text-purple-400" />
                        <span>{project.backers.toLocaleString()} backers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={24} className="text-purple-400" />
                        <span>{project.daysLeft} days left</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-8">
                    <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full flex items-center gap-2 text-lg font-medium transition-colors">
                      <DollarSign size={24} />
                      Back This Project
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 px-8 py-3 rounded-full text-lg font-medium transition-colors">
                      Learn More
                    </button>
                  </div>


                  {/* Additional Project Details */}
                  <div className="bg-black/30 rounded-xl p-6 mb-8 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-4">About This Project</h3>
                    <p className="text-gray-300 mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="text-gray-300">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fundraisers;