import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface AudioRoomModalProps {
  room: {
    id: number;
    title: string;
    host: string;
    participants: Array<{
      id: number;
      name: string;
      isSpeaking: boolean;
      isMuted: boolean;
      avatar: string;
    }>;
    listeners: number;
  };
  onClose: () => void;
}

const AudioRoomModal = ({ room, onClose }: AudioRoomModalProps) => {
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAudioPermissionGranted, setIsAudioPermissionGranted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Your browser doesn\'t support audio input');
      return;
    }

    const requestAudioPermission = async () => {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        // Create audio context and analyser
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        const source = audioContextRef.current.createMediaStreamSource(audioStream);
        source.connect(analyserRef.current);
        
        setStream(audioStream);
        setIsAudioPermissionGranted(true);
        audioStream.getTracks().forEach(track => track.enabled = false);
        
        // Start visualization
        visualize();
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Unable to access microphone. Please check your permissions.');
      }
    };

    requestAudioPermission();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const visualize = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVisualization = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      
      // Update speaking state based on audio level
      const isSpeaking = average > 30;
      
      // Update participant speaking state
      const participant = room.participants.find(p => p.name === "You");
      if (participant) {
        participant.isSpeaking = isSpeaking && isMicEnabled;
      }

      animationFrameRef.current = requestAnimationFrame(updateVisualization);
    };

    updateVisualization();
  };

  const toggleMic = () => {
    if (!stream) return;
    
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !isMicEnabled;
      setIsMicEnabled(!isMicEnabled);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      
      <div className="relative bg-[#1E1E2A] rounded-xl w-[800px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{room.title}</h2>
              <p className="text-gray-400">Hosted by {room.host}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Participants Grid */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Participants</h3>
          <div className="grid grid-cols-4 gap-4">
            {room.participants.map((participant) => (
              <div key={participant.id} className="flex flex-col items-center">
                <div className="relative mb-2">
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-20 h-20 rounded-full"
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
                  {participant.id === 1 ? 'Host' : 'Participant'}
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
              disabled={!isAudioPermissionGranted}
              className={`p-4 rounded-full ${
                isMicEnabled 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-red-600 hover:bg-red-700'
              } ${!isAudioPermissionGranted && 'opacity-50 cursor-not-allowed'}`}
            >
              {isMicEnabled ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            <div>
              <div className="font-medium">Microphone {isMicEnabled ? 'On' : 'Off'}</div>
              <div className="text-sm text-gray-400">
                {isAudioPermissionGranted 
                  ? 'Click to toggle microphone' 
                  : 'Microphone access required'}
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
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