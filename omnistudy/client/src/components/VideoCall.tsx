import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff } from 'lucide-react';
import { Socket } from 'socket.io-client';

interface VideoCallProps {
    socket: Socket;
    targetId: string;
    onClose: () => void;
    userId: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ socket, targetId, onClose, userId }) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        const initCall = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });

            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('webrtc_signal', { targetId, senderId: userId, signal: { type: 'candidate', candidate: event.candidate } });
                }
            };

            pc.ontrack = (event) => {
                setRemoteStream(event.streams[0]);
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
            };

            pcRef.current = pc;

            socket.on('webrtc_signal', async (data) => {
                if (data.senderId !== targetId) return;

                if (data.signal.type === 'offer') {
                    await pc.setRemoteDescription(new RTCSessionDescription(data.signal));
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    socket.emit('webrtc_signal', { targetId, senderId: userId, signal: answer });
                } else if (data.signal.type === 'answer') {
                    await pc.setRemoteDescription(new RTCSessionDescription(data.signal));
                } else if (data.signal.type === 'candidate') {
                    await pc.addIceCandidate(new RTCIceCandidate(data.signal.candidate));
                }
            });

            // Start call
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('webrtc_signal', { targetId, senderId: userId, signal: offer });
        };

        initCall();

        return () => {
            localStream?.getTracks().forEach(t => t.stop());
            pcRef.current?.close();
            socket.off('webrtc_signal');
        };
    }, [targetId]);

    const toggleMute = () => {
        localStream?.getAudioTracks().forEach(t => t.enabled = isMuted);
        setIsMuted(!isMuted);
    };

    const toggleVideo = () => {
        localStream?.getVideoTracks().forEach(t => t.enabled = isVideoOff);
        setIsVideoOff(!isVideoOff);
    };

    const shareScreen = async () => {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = pcRef.current?.getSenders().find(s => s.track?.kind === 'video');
        if (sender) sender.replaceTrack(videoTrack);

        videoTrack.onended = () => {
            const originalTrack = localStream?.getVideoTracks()[0];
            if (originalTrack) sender?.replaceTrack(originalTrack);
        };
    };

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-2xl aspect-video bg-zinc-900 rounded-xl overflow-hidden">
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <video ref={localVideoRef} autoPlay playsInline muted className="absolute bottom-4 right-4 w-32 md:w-48 aspect-video bg-black border border-white/20 rounded-lg object-cover" />

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-4">
                    <button onClick={toggleMute} className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'}`}>
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <button onClick={toggleVideo} className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'}`}>
                        {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                    </button>
                    <button onClick={shareScreen} className="p-4 rounded-full bg-white/20 hover:bg-white/30">
                        <Monitor size={24} />
                    </button>
                    <button onClick={onClose} className="p-4 rounded-full bg-red-500 hover:bg-red-600">
                        <PhoneOff size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
