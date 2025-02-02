import React, { useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const TVGuide = ({ channels, programs }) => {
  const [selectedDay, setSelectedDay] = useState('Today');
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  
  const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const visibleHours = Array.from({ length: 6 }, (_, i) => (currentHour + i) % 24);

  const scrollLeft = () => {
    setCurrentHour((prev) => Math.max(0, prev - 1));
  };

  const scrollRight = () => {
    setCurrentHour((prev) => Math.min(18, prev + 1));
  };

  const getChannelPrograms = (channelId) => {
    return programs.filter(program => program.channel_id === channelId);
  };

  return (
    <div className="bg-[#1E1E2A] rounded-xl overflow-hidden border border-purple-600/20">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#1E1E2A] z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">TV Guide</h2>
          <div className="flex gap-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedDay === day
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#2A2A3A] text-gray-400 hover:bg-[#3A3A4A]'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar size={16} />
            <span className="text-sm">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              disabled={currentHour === 0}
              className="p-1 hover:bg-white/10 rounded-full disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollRight}
              disabled={currentHour >= 18}
              className="p-1 hover:bg-white/10 rounded-full disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Time Header */}
      <div className="flex border-b border-white/10">
        <div className="w-48 flex-shrink-0 p-4 border-r border-white/10">
          <Clock size={16} className="text-gray-400" />
        </div>
        {visibleHours.map((hour) => (
          <div
            key={hour}
            className="w-48 flex-shrink-0 p-4 text-sm text-gray-400 border-r border-white/10"
          >
            {`${hour.toString().padStart(2, '0')}:00`}
          </div>
        ))}
      </div>

      {/* Channel Rows */}
      {channels.map((channel) => {
        const channelPrograms = getChannelPrograms(channel.id);
        return (
          <div key={channel.id} className="flex border-b border-white/10 group hover:bg-white/5">
            {/* Channel Info */}
            <div className="w-48 flex-shrink-0 p-4 border-r border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                  {channel.icon}
                </div>
                <div>
                  <div className="font-medium">{channel.name}</div>
                  <div className="text-sm text-gray-400">{channel.category}</div>
                </div>
              </div>
            </div>

            {/* Programs */}
            <div className="flex-1 relative h-20">
              {channelPrograms.map((program) => {
                const start = new Date(program.start_time);
                const end = new Date(program.end_time);
                const startHour = start.getHours();
                const duration = (end - start) / (1000 * 60 * 60); // Duration in hours
                const width = duration * 192; // Each hour is 192px wide
                const left = (startHour - currentHour) * 192;

                if (startHour >= currentHour && startHour < currentHour + 6) {
                  return (
                    <div
                      key={program.id}
                      className="absolute inset-y-0 bg-purple-600/20 border-l-4 border-purple-600"
                      style={{
                        left: `${left}px`,
                        width: `${width}px`
                      }}
                    >
                      <div className="p-3">
                        <div className="font-medium">{program.title}</div>
                        <div className="text-sm text-gray-400">
                          {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {' - '}
                          {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TVGuide;