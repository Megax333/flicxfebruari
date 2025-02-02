import React, { useState } from 'react';
import { Mic, Plus, Users } from 'lucide-react';
import AudioRoomModal from './AudioRoomModal';

const AudioRooms = () => {
  const [activeRoom, setActiveRoom] = useState(null);

  // Default rooms for demonstration
  const defaultRooms = [
    {
      id: 1,
      title: "Stranger Things S4 Discussion",
      host: "Sarah Wilson",
      participants: [
        { id: 1, name: "Sarah Wilson", isSpeaking: true, isMuted: false, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }
      ],
      listeners: 0
    }
  ];

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-purple-400">Audio Rooms</h2>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full">
          <Plus size={20} />
          Create Room
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {defaultRooms.map((room) => (
          <div key={room.id} className="bg-[#1E1E2A] rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">{room.title}</h3>
                <p className="text-gray-400 text-sm">Hosted by {room.host}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users size={16} />
                {room.listeners} listening
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              {room.participants.map((participant) => (
                <div key={participant.id}>
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button 
                onClick={() => setActiveRoom(room)}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full flex items-center gap-2"
              >
                <Mic size={18} />
                <span>Join Room</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {activeRoom && (
        <AudioRoomModal
          room={activeRoom}
          onClose={() => setActiveRoom(null)}
        />
      )}
    </div>
  );
};

export default AudioRooms;