import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AppContext';
import { ArrowLeft, Send, Video } from 'lucide-react';
import VideoCall from './VideoCall';

const API_URL = 'http://localhost:3001/api';
const SOCKET_URL = 'http://localhost:3001';

const FriendsChat: React.FC = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [inCall, setInCall] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    fetchFriends();
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('join', user.id);

    socketRef.current.on('receive-message', (msg) => {
        if (selectedFriend && (msg.senderId === selectedFriend.id || msg.senderId === user.id)) {
            setMessages(prev => [...prev, msg]);
        }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [selectedFriend]);

  const fetchFriends = async () => {
    const res = await axios.get(`${API_URL}/friends/${user.id}`);
    setFriends(res.data);
  };

  const sendMessage = () => {
    if (!inputText.trim() || !selectedFriend) return;
    const msg = {
      senderId: user.id,
      receiverId: selectedFriend.id,
      text: inputText,
      timestamp: new Date().toISOString()
    };
    socketRef.current?.emit('send-message', msg);
    setMessages(prev => [...prev, msg]);
    setInputText('');
  };

  if (inCall && selectedFriend) {
      return <VideoCall friend={selectedFriend} onEnd={() => setInCall(false)} socket={socketRef.current!} />;
  }

  if (selectedFriend) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-black fixed inset-0 z-50 pb-12">
        <header className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-insta-border">
          <div className="flex items-center">
            <button onClick={() => setSelectedFriend(null)} className="mr-4"><ArrowLeft size={24} /></button>
            <img src={selectedFriend.avatar} className="w-8 h-8 rounded-full mr-3" alt="" />
            <span className="font-semibold">{selectedFriend.username}</span>
          </div>
          <button onClick={() => setInCall(true)} className="text-blue-500"><Video size={24} /></button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                m.senderId === user.id ? 'bg-blue-500 text-white rounded-br-none' : 'bg-slate-100 dark:bg-insta-border text-black dark:text-white rounded-bl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 flex items-center border-t border-slate-100 dark:border-insta-border">
          <input
            type="text"
            className="flex-1 bg-slate-50 dark:bg-insta-dark border border-slate-200 dark:border-insta-border rounded-full px-4 py-2 text-sm outline-none"
            placeholder="Message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="ml-2 text-blue-500 font-semibold px-2"><Send size={20} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto w-full pt-4">
      <header className="p-4 border-b border-slate-100 dark:border-insta-border mb-2">
        <h1 className="text-xl font-bold">Messages</h1>
      </header>
      <div className="space-y-1">
        {friends.map(f => (
          <button
            key={f.id}
            onClick={() => setSelectedFriend(f)}
            className="w-full flex items-center p-4 hover:bg-slate-50 dark:hover:bg-insta-dark transition-colors"
          >
            <div className="relative">
              <img src={f.avatar} className="w-14 h-14 rounded-full border border-slate-200" alt="" />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-black rounded-full"></div>
            </div>
            <div className="ml-4 text-left">
              <p className="font-semibold">{f.username}</p>
              <p className="text-sm text-slate-500 dark:text-insta-grey">Active now</p>
            </div>
          </button>
        ))}
        {friends.length === 0 && (
            <div className="p-8 text-center text-slate-500">
                <p>No friends yet. Visit someone's profile to send a request!</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default FriendsChat;
