import React from 'react';
import { X, Mic, MicOff, Volume2 } from 'lucide-react';
import { useAudioRoom } from '../context/AudioRoomContext';

const AudioRoomModal = () => {
  const { activeRoom, isMicEnabled, toggleMic, leaveRoom } = useAudioRoom();

  if (!activeRoom) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={leaveRoom} />
      
      <div className="relative bg-[#1E1E2A] rounded-xl w-[800px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{activeRoom.title}</h2>
              <p className="text-gray-400">Hosted by {activeRoom.hostName}</p>
            </div>
            <button
              onClick={leaveRoom}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Participants Grid */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Participants ({activeRoom.participants.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {activeRoom.participants.map((participant) => (
              <div key={participant.id} className="flex flex-col items-center">
                <div className="relative mb-2">
                  <img
                    src={participant.avatar || "https://via.placeholder.com/150"}
                    alt={participant.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  {participant.isSpeaking && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 p-1.5 rounded-full animate-pulse">
                      <Volume2 size={14} />
                    </div>
                  )}
                  {participant.isMuted && (
                    <div className="absolute -bottom-1 -right-1 bg-red-500 p-1.5 rounded-full">
                      <MicOff size={14} />
                    </div>
                  )}
                </div>
                <span className="font-medium text-sm">{participant.name}</span>
                <span className="text-xs text-gray-400">
                  {participant.id === activeRoom.hostId ? 'Host' : 'Participant'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMic}
              className={`p-4 rounded-full ${
                isMicEnabled 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isMicEnabled ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            <div>
              <div className="font-medium">Microphone {isMicEnabled ? 'On' : 'Off'}</div>
              <div className="text-sm text-gray-400">
                Click to toggle microphone
              </div>
            </div>
          </div>
          
          <button
            onClick={leaveRoom}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full"
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioRoomModal;