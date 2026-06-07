import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp } from 'lucide-react';
import { useAuth } from '../context/AppContext';

interface VideoCallProps {
  friend: any;
  onEnd: () => void;
  socket: Socket;
}

const VideoCall: React.FC<VideoCallProps> = ({ friend, onEnd, socket }) => {
  const { user } = useAuth();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const servers = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  useEffect(() => {
    const startCall = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      peerConnection.current = new RTCPeerConnection(servers);

      stream.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('webrtc-signal', { to: friend.id, from: user.id, signal: { type: 'candidate', candidate: event.candidate } });
        }
      };

      // Create offer if we initiated
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit('webrtc-signal', { to: friend.id, from: user.id, signal: { type: 'offer', offer } });
    };

    startCall();

    socket.on('webrtc-signal', async ({ from, signal }) => {
        if (from !== friend.id) return;

        if (signal.type === 'offer') {
            await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(signal.offer));
            const answer = await peerConnection.current?.createAnswer();
            await peerConnection.current?.setLocalDescription(answer);
            socket.emit('webrtc-signal', { to: friend.id, from: user.id, signal: { type: 'answer', answer } });
        } else if (signal.type === 'answer') {
            await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(signal.answer));
        } else if (signal.type === 'candidate') {
            await peerConnection.current?.addIceCandidate(new RTCIceCandidate(signal.candidate));
        }
    });

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      peerConnection.current?.close();
      socket.off('webrtc-signal');
    };
  }, []);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks()[0].enabled = isVideoOff;
      setIsVideoOff(!isVideoOff);
    }
  };

  const shareScreen = async () => {
      try {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = peerConnection.current?.getSenders().find(s => s.track?.kind === 'video');
          if (sender) sender.replaceTrack(videoTrack);
          if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;

          videoTrack.onended = () => {
              if (sender && localStream) sender.replaceTrack(localStream.getVideoTracks()[0]);
              if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
          }
      } catch (e) {
          console.error("Error sharing screen", e);
      }
  }

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
      <div className="relative w-full h-full max-w-4xl max-h-[80vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 w-32 h-48 bg-black rounded-lg border-2 border-white/20 overflow-hidden shadow-lg">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-6">
            <button onClick={toggleMute} className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-white/10 backdrop-blur-md'} text-white transition-all`}>
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <button onClick={toggleVideo} className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-white/10 backdrop-blur-md'} text-white transition-all`}>
                {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
            </button>
            <button onClick={shareScreen} className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white transition-all">
                <MonitorUp size={24} />
            </button>
            <button onClick={onEnd} className="p-4 rounded-full bg-red-600 text-white transition-all">
                <PhoneOff size={24} />
            </button>
        </div>

        <div className="absolute top-8 left-8 text-white">
            <p className="text-lg font-bold">{friend.username}</p>
            <p className="text-sm opacity-60">Call in progress...</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
