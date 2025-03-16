import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { RealtimeChannel } from '@supabase/realtime-js';

// Types
export interface Participant {
  id: string;
  name: string;
  avatar: string;
  isSpeaking: boolean;
  isMuted: boolean;
}

export interface AudioRoom {
  id: string;
  title: string;
  hostId: string;
  hostName: string;
  participants: Participant[];
  createdAt: string;
}

interface AudioRoomContextType {
  rooms: AudioRoom[];
  activeRoom: AudioRoom | null;
  isLoading: boolean;
  isMicEnabled: boolean;
  createRoom: (title: string) => Promise<string>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => void;
  toggleMic: () => void;
  localStream: MediaStream | null;
}

const AudioRoomContext = createContext<AudioRoomContextType | undefined>(undefined);

export const useAudioRoom = () => {
  const context = useContext(AudioRoomContext);
  if (!context) {
    throw new Error('useAudioRoom must be used within an AudioRoomProvider');
  }
  return context;
};

export const AudioRoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<AudioRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<AudioRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  
  // Refs
  const peerRef = useRef<Peer | null>(null);
  const roomChannelRef = useRef<RealtimeChannel | null>(null);
  const audioConnectionsRef = useRef<Map<string, MediaConnection>>(new Map());
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number>();
  
  // Initialize and fetch rooms
  useEffect(() => {
    fetchRooms();
    
    // Subscribe to room updates
    const roomsChannel = supabase.channel('public:audio_rooms');
    
    roomsChannel
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'audio_rooms' 
      }, (payload) => {
        fetchRooms();
      })
      .subscribe();
      
    return () => {
      roomsChannel.unsubscribe();
    };
  }, []);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (activeRoom) {
        leaveRoom();
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Fetch all rooms
  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching rooms...');
      
      // Get all rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('audio_rooms')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (roomsError) {
        console.error('Error fetching rooms:', roomsError);
        throw roomsError;
      }
      
      console.log('Rooms data:', roomsData);
      
      // Get host profiles for all rooms
      const hostIds = roomsData.map(room => room.host_id);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('user_id, username, avatar_url')
        .in('user_id', hostIds);
        
      if (profilesError) {
        console.error('Error fetching host profiles:', profilesError);
        // Continue anyway with default names
      }
      
      console.log('Profiles data:', profilesData);
      
      // Create a map of host IDs to profile data for easy lookup
      const profilesMap = new Map();
      if (profilesData) {
        profilesData.forEach(profile => {
          profilesMap.set(profile.user_id, profile);
        });
      }
      
      // Format rooms with host information
      const formattedRooms: AudioRoom[] = roomsData.map(room => {
        const hostProfile = profilesMap.get(room.host_id);
        return {
          id: room.id,
          title: room.title,
          hostId: room.host_id,
          hostName: hostProfile?.username || 'Unknown Host',
          participants: [], // Will be populated from realtime channel
          createdAt: room.created_at
        };
      });
      
      console.log('Formatted rooms:', formattedRooms);
      setRooms(formattedRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a new room
  const createRoom = async (title: string) => {
    if (!user) throw new Error('User must be logged in to create a room');
    
    try {
      console.log('Creating room with title:', title);
      
      // Create room in database
      const { data: roomData, error: roomError } = await supabase
        .from('audio_rooms')
        .insert([
          {
            title,
            host_id: user.id
          }
        ])
        .select('*')
        .single();
      
      if (roomError) {
        console.error('Error creating room:', roomError);
        alert(`Error creating room: ${roomError.message}`);
        throw roomError;
      }
      
      console.log('Room created:', roomData);
      
      // Join the newly created room
      await joinRoom(roomData.id);
      
      return roomData;
    } catch (error) {
      console.error('Error in createRoom:', error);
      alert(`Error creating room: ${error.message}`);
      throw error;
    }
  };
  
  // Join a room
  const joinRoom = async (roomId: string) => {
    if (!user) throw new Error('User must be logged in to join a room');
    
    try {
      console.log('Joining room:', roomId);
      
      // Get room details
      const { data: roomData, error: roomError } = await supabase
        .from('audio_rooms')
        .select('*')
        .eq('id', roomId)
        .single();
        
      if (roomError) {
        console.error('Error fetching room details:', roomError);
        alert(`Error fetching room details: ${roomError.message}`);
        throw roomError;
      }
      
      console.log('Room details:', roomData);
      
      // Get host profile information
      const { data: hostProfile, error: hostProfileError } = await supabase
        .from('user_profiles')
        .select('username, avatar_url')
        .eq('user_id', roomData.host_id)
        .single();
        
      if (hostProfileError) {
        console.error('Error fetching host profile:', hostProfileError);
        // Continue anyway, we'll use a fallback name
      }
      
      const hostName = hostProfile?.username || 'Unknown Host';
      console.log('Host name:', hostName);
      
      // Initialize WebRTC
      await initializeWebRTC();
      
      // Join room in database
      const { error: joinError } = await supabase
        .from('audio_room_participants')
        .upsert({
          room_id: roomId,
          user_id: user.id,
          joined_at: new Date().toISOString()
        });
        
      if (joinError) throw joinError;
      
      // Subscribe to room channel for participant updates
      const roomChannel = supabase.channel(`room:${roomId}`, {
        config: {
          presence: {
            key: user.id,
          },
        },
      });
      
      roomChannel
        .on('presence', { event: 'sync' }, () => {
          console.log('Presence sync event received');
          const state = roomChannel.presenceState();
          console.log('Presence state:', state);
          updateParticipantsFromPresence(state, roomId);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('Presence join event received:', key, newPresences);
          // Connect to new peer if it's not us
          if (key !== user.id && peerRef.current) {
            newPresences.forEach((presence: any) => {
              console.log('Connecting to peer:', presence.peer_id);
              connectToPeer(presence.peer_id);
            });
          }
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('Presence leave event received:', key, leftPresences);
          // Update participants list
          const state = roomChannel.presenceState();
          updateParticipantsFromPresence(state, roomId);
        })
        .subscribe(async (status) => {
          console.log('Room channel subscription status:', status);
          if (status === 'SUBSCRIBED') {
            // Get current user profile
            const { data: profileData } = await supabase
              .from('user_profiles')
              .select('username, avatar_url')
              .eq('user_id', user.id)
              .single();
              
            console.log('Current user profile:', profileData);
            
            // Set presence data with our peer ID
            await roomChannel.track({
              user_id: user.id,
              peer_id: peerRef.current?.id,
              username: profileData?.username || user.email || 'Anonymous',
              avatar_url: profileData?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
              is_muted: !isMicEnabled
            });
            
            console.log('Tracked presence data');
          }
        });
      
      roomChannelRef.current = roomChannel;
      
      // Set active room
      setActiveRoom({
        id: roomData.id,
        title: roomData.title,
        hostId: roomData.host_id,
        hostName: hostName,
        participants: [], // Will be updated by presence
        createdAt: roomData.created_at
      });
      
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  };
  
  // Leave the current room
  const leaveRoom = () => {
    if (!activeRoom || !user) return;
    
    // Disconnect from all peers
    audioConnectionsRef.current.forEach(connection => {
      connection.close();
    });
    audioConnectionsRef.current.clear();
    
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    // Leave room in database
    supabase
      .from('audio_room_participants')
      .delete()
      .eq('room_id', activeRoom.id)
      .eq('user_id', user.id)
      .then(() => {
        console.log('Left room in database');
      })
      .catch(error => {
        console.error('Error leaving room in database:', error);
      });
    
    // Unsubscribe from room channel
    if (roomChannelRef.current) {
      roomChannelRef.current.unsubscribe();
      roomChannelRef.current = null;
    }
    
    // Destroy peer connection
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    
    // Reset state
    setActiveRoom(null);
    setIsMicEnabled(false);
  };
  
  // Toggle microphone
  const toggleMic = () => {
    if (!localStream) return;
    
    console.log('Toggling microphone');
    
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      const newMicState = !isMicEnabled;
      audioTrack.enabled = newMicState;
      setIsMicEnabled(newMicState);
      
      console.log('Microphone state:', newMicState ? 'enabled' : 'disabled');
      
      // Update presence data
      if (roomChannelRef.current) {
        // Get current user profile
        supabase
          .from('user_profiles')
          .select('username, avatar_url')
          .eq('user_id', user?.id)
          .single()
          .then(({ data: profileData }) => {
            roomChannelRef.current?.track({
              user_id: user?.id,
              peer_id: peerRef.current?.id,
              username: profileData?.username || user?.email || 'Anonymous',
              avatar_url: profileData?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`,
              is_muted: !newMicState
            });
            
            console.log('Updated presence with new mic state');
          });
      }
      
      // Update local participant in active room
      setActiveRoom(prev => {
        if (!prev || !user) return prev;
        
        const updatedParticipants = prev.participants.map(p => {
          if (p.id === user.id) {
            return { ...p, isMuted: !newMicState };
          }
          return p;
        });
        
        return {
          ...prev,
          participants: updatedParticipants
        };
      });
    }
  };
  
  // Initialize WebRTC
  const initializeWebRTC = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });
      
      setLocalStream(stream);
      
      // Set up audio analysis
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      // Start audio visualization
      startVisualization();
      
      // All tracks start disabled (muted)
      stream.getAudioTracks().forEach(track => {
        track.enabled = false;
      });
      
      // Initialize PeerJS
      const peer = new Peer({
        debug: 2
      });
      
      peer.on('open', (id) => {
        console.log('My peer ID is:', id);
        peerRef.current = peer;
      });
      
      peer.on('call', (call) => {
        // Answer incoming call
        call.answer(stream);
        
        // Handle incoming audio
        call.on('stream', (remoteStream) => {
          // Create audio element for remote stream
          const audio = new Audio();
          audio.srcObject = remoteStream;
          audio.autoplay = true;
          
          // Store connection
          audioConnectionsRef.current.set(call.peer, call);
        });
        
        call.on('close', () => {
          audioConnectionsRef.current.delete(call.peer);
        });
      });
      
      peer.on('error', (err) => {
        console.error('PeerJS error:', err);
      });
      
      peerRef.current = peer;
      
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      throw error;
    }
  };
  
  // Connect to a peer
  const connectToPeer = (peerId: string) => {
    if (!peerRef.current || !localStream) return;
    
    // Don't connect to ourselves or if already connected
    if (peerId === peerRef.current.id || audioConnectionsRef.current.has(peerId)) {
      return;
    }
    
    // Call the peer
    const call = peerRef.current.call(peerId, localStream);
    
    call.on('stream', (remoteStream) => {
      // Create audio element for remote stream
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.autoplay = true;
      
      // Store connection
      audioConnectionsRef.current.set(peerId, call);
    });
    
    call.on('close', () => {
      audioConnectionsRef.current.delete(peerId);
    });
  };
  
  // Update participants from presence state
  const updateParticipantsFromPresence = (state: any, roomId: string) => {
    if (!activeRoom || activeRoom.id !== roomId) return;
    
    console.log('Updating participants from presence state:', state);
    
    const participants: Participant[] = [];
    
    // Add ourselves first if we're not in the list yet
    if (user) {
      const userPresence = Object.entries(state).find(([key]) => key === user.id);
      if (!userPresence) {
        participants.push({
          id: user.id,
          name: user.email || 'Me',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
          isSpeaking: false,
          isMuted: !isMicEnabled
        });
      }
    }
    
    // Add all participants from presence state
    Object.entries(state).forEach(([key, presences]: [string, any]) => {
      if (presences && presences.length > 0) {
        const presence = presences[0];
        participants.push({
          id: presence.user_id,
          name: presence.username || 'Anonymous',
          avatar: presence.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${presence.user_id}`,
          isSpeaking: false, // Will be updated by audio analysis
          isMuted: presence.is_muted
        });
      }
    });
    
    console.log('Updated participants:', participants);
    
    setActiveRoom(prev => {
      if (!prev) return null;
      return {
        ...prev,
        participants
      };
    });
  };
  
  // Start audio visualization
  const startVisualization = () => {
    if (!analyserRef.current || !user) return;
    
    console.log('Starting audio visualization');
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateVisualization = () => {
      if (!analyserRef.current || !activeRoom) {
        animationFrameRef.current = requestAnimationFrame(updateVisualization);
        return;
      }
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      
      // Update speaking state based on audio level
      const isSpeaking = average > 30 && isMicEnabled;
      
      // Log audio level periodically (every ~2 seconds)
      if (Math.random() < 0.01) {
        console.log('Audio level:', average, 'Speaking:', isSpeaking);
      }
      
      // Update participant speaking state
      setActiveRoom(prev => {
        if (!prev) return null;
        
        const updatedParticipants = prev.participants.map(p => {
          if (p.id === user.id) {
            return { ...p, isSpeaking };
          }
          return p;
        });
        
        return {
          ...prev,
          participants: updatedParticipants
        };
      });
      
      animationFrameRef.current = requestAnimationFrame(updateVisualization);
    };
    
    updateVisualization();
  };
  
  return (
    <AudioRoomContext.Provider
      value={{
        rooms,
        activeRoom,
        isLoading,
        isMicEnabled,
        createRoom,
        joinRoom,
        leaveRoom,
        toggleMic,
        localStream
      }}
    >
      {children}
    </AudioRoomContext.Provider>
  );
};
