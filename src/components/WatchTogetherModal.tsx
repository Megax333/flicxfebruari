import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff, Volume2, VolumeX, MessageCircle, Users, Share2 } from 'lucide-react';

interface WatchTogetherModalProps {
  session: {
    id: number;
    title: string;
    description: string;
    host: string;
    participants: Array<{
      id: number;
      name: string;
      avatar: string;
    }>;
    thumbnail: string;
    viewers: number;
  };
  onClose: () => void;
}

const WatchTogetherModal = ({ session, onClose }: WatchTogetherModalProps) => {
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAudioPermissionGranted, setIsAudioPermissionGranted] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, user: session.host, message: 'Welcome everyone!' },
    { id: 2, user: session.participants[0]?.name, message: 'Hey! Excited to watch together!' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Your browser doesn\'t support audio input');
      return;
    }

    const requestAudioPermission = async () => {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(audioStream);
        setIsAudioPermissionGranted(true);
        audioStream.getTracks().forEach(track => track.enabled = false);
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
    };
  }, []);

  const toggleMic = () => {
    if (!stream) return;
    
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !isMicEnabled;
      setIsMicEnabled(!isMicEnabled);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages(prev => [...prev, {
      id: Date.now(),
      user: 'You',
      message: newMessage.trim()
    }]);
    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />
      
      <div className="relative bg-[#1E1E2A] w-[90vw] h-[90vh] rounded-xl overflow-hidden flex">
        {/* Main Video Area */}
        <div className="flex-1 relative">
          <video
            src="https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
            className="w-full h-full object-contain bg-black"
            autoPlay
            controls
            muted={isVideoMuted}
          />
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleMic}
                  disabled={!isAudioPermissionGranted}
                  className={`p-2 rounded-full ${
                    isMicEnabled 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isMicEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
                <button
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className="p-2 rounded-full hover:bg-white/20"
                >
                  {isVideoMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-sm">
                  <Users size={16} />
                  {session.viewers} watching
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 border-l border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-semibold">Live Chat</h3>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col">
                <span className="text-sm font-medium">{msg.user}</span>
                <p className="text-sm text-gray-300">{msg.message}</p>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 bg-[#2A2A3A] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="submit"
                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full"
              >
                <MessageCircle size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WatchTogetherModal;