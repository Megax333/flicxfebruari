import React, { useState } from 'react';
import { Mic, Plus, Users, Loader2 } from 'lucide-react';
import AudioRoomModal from './AudioRoomModal';
import { useAudioRoom } from '../context/AudioRoomContext';

const AudioRooms = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const { rooms, activeRoom, isLoading, joinRoom, createRoom } = useAudioRoom();

  const handleCreateRoom = async () => {
    if (!newRoomTitle.trim()) return;
    
    try {
      await createRoom(newRoomTitle.trim());
      setShowCreateModal(false);
      setNewRoomTitle('');
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      await joinRoom(roomId);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-purple-400">Audio Rooms</h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full"
        >
          <Plus size={20} />
          Create Room
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 size={32} className="animate-spin text-purple-500" />
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-[#1E1E2A] rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">No Audio Rooms Available</h3>
          <p className="text-gray-400 mb-6">Be the first to create an audio room!</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Create Room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-[#1E1E2A] rounded-xl p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{room.title}</h3>
                  <p className="text-gray-400 text-sm">Hosted by {room.hostName}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users size={16} />
                  {room.participants.length} participants
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                {room.participants.slice(0, 4).map((participant) => (
                  <div key={participant.id} className="relative">
                    <img
                      src={participant.avatar || "https://via.placeholder.com/150"}
                      alt={participant.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {participant.isSpeaking && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 p-1 rounded-full animate-pulse" />
                    )}
                  </div>
                ))}
                {room.participants.length > 4 && (
                  <div className="w-16 h-16 rounded-full bg-purple-700/50 flex items-center justify-center">
                    <span>+{room.participants.length - 4}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <button 
                  onClick={() => handleJoinRoom(room.id)}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <Mic size={18} />
                  <span>Join Room</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowCreateModal(false)} />
          
          <div className="relative bg-[#1E1E2A] rounded-xl w-[500px] p-6">
            <h2 className="text-xl font-bold mb-4">Create Audio Room</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Room Title</label>
              <input
                type="text"
                value={newRoomTitle}
                onChange={(e) => setNewRoomTitle(e.target.value)}
                placeholder="Enter room title..."
                className="w-full bg-[#2A2A3A] border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                disabled={!newRoomTitle.trim()}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}
      
      {activeRoom && <AudioRoomModal />}
    </div>
  );
};

export default AudioRooms;