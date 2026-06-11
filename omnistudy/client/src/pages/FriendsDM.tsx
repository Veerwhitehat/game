import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { ChevronLeft, Send, Video } from 'lucide-react';
import VideoCall from '../components/VideoCall';

const FriendsDM: React.FC = () => {
    const { user } = useAuth();
    const [friends, setFriends] = useState<any[]>([]);
    const [selectedFriend, setSelectedFriend] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [isCalling, setIsCalling] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // In a real app, we'd fetch friends. For now, let's fetch all users except self
        const fetchFriends = async () => {
            // This is a placeholder since we don't have a friends list yet
            // Let's assume we can see other users
            const { data } = await API.get('/posts'); // Hack to get some usernames
            const uniqueUsers = Array.from(new Set(data.map((p: any) => p.userId)))
                .filter(id => id !== user?.id)
                .map(id => data.find((p: any) => p.userId === id));
            setFriends(uniqueUsers);
        };
        fetchFriends();

        socketRef.current = io('/', { path: '/socket.io' }); // Assume proxy handled by vite or just use absolute if needed
        socketRef.current.emit('join', user?.id);

        socketRef.current.on('receive_message', (msg) => {
            if (selectedFriend && (msg.senderId === selectedFriend.userId || msg.receiverId === selectedFriend.userId)) {
                setMessages(prev => [...prev, msg]);
            }
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [user, selectedFriend]);

    const sendMessage = () => {
        if (!inputText.trim() || !selectedFriend) return;
        const msgData = {
            senderId: user?.id,
            receiverId: selectedFriend.userId,
            text: inputText
        };
        socketRef.current?.emit('send_message', msgData);
        setMessages(prev => [...prev, { ...msgData, createdAt: new Date().toISOString() }]);
        setInputText('');
    };

    if (selectedFriend) {
        return (
            <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-100 dark:border-insta-border flex items-center">
                    <button onClick={() => setSelectedFriend(null)} className="mr-4">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                    <span className="font-semibold">{selectedFriend.username}</span>
                    <button onClick={() => setIsCalling(true)} className="ml-auto">
                        <Video size={24} />
                    </button>
                </div>
                {isCalling && (
                    <VideoCall
                        socket={socketRef.current!}
                        targetId={selectedFriend.userId}
                        userId={user!.id}
                        onClose={() => setIsCalling(false)}
                    />
                )}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                                m.senderId === user?.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-zinc-800'
                            }`}>
                                {m.text}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 flex space-x-2">
                    <input
                        type="text"
                        placeholder="Message..."
                        className="flex-1 bg-gray-50 dark:bg-zinc-900 rounded-full px-4 py-2 text-sm outline-none border border-gray-200 dark:border-insta-border"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button onClick={sendMessage} className="text-blue-500 font-semibold px-2">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-6">Messages</h1>
            <div className="space-y-4">
                {friends.map((friend, i) => (
                    <div
                        key={i}
                        className="flex items-center space-x-4 cursor-pointer"
                        onClick={() => setSelectedFriend(friend)}
                    >
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-gray-200"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-insta-dark rounded-full"></div>
                        </div>
                        <div className="flex-1">
                            <h2 className="font-semibold text-sm">{friend.username}</h2>
                            <p className="text-xs text-gray-400">Active now</p>
                        </div>
                    </div>
                ))}
                {friends.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-10">No messages yet. Find friends to start chatting!</p>
                )}
            </div>
        </div>
    );
};

export default FriendsDM;
