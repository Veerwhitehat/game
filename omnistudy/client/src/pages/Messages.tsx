import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { io } from 'socket.io-client';
import { Send, ChevronLeft } from 'lucide-react';

const Messages: React.FC = () => {
  const [friends, setFriends] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const { token, user } = useAuth();
  const { theme } = useTheme();
  const socketRef = useRef<any>(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/social/friends', { headers: { Authorization: `Bearer ${token}` } }).then(r => setFriends(r.data));
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('register', user.id);
    socketRef.current.on('receive_message', (m: any) => { if (selected && (m.fromId === selected.id || m.toId === selected.id)) setMessages(prev => [...prev, m]); });
    socketRef.current.on('message_sent', (m: any) => setMessages(prev => [...prev, m]));
    return () => socketRef.current.disconnect();
  }, [token, user, selected]);

  useEffect(() => {
    if (selected) axios.get(`http://localhost:5000/api/messages/${selected.id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => setMessages(r.data));
  }, [selected, token]);

  const send = (e: any) => { e.preventDefault(); if (text.trim() && selected) { socketRef.current.emit('send_message', { fromId: user.id, toId: selected.id, text }); setText(''); } };

  if (selected) return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-insta-dark text-white' : 'bg-white text-black'}`}>
      <header className={`flex items-center px-4 h-14 border-b ${theme === 'dark' ? 'border-insta-border' : 'border-gray-200'}`}>
        <button onClick={() => setSelected(null)} className="mr-4"><ChevronLeft size={28} /></button>
        <span className="font-semibold">{selected.displayName}</span>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(m => <div key={m.id} className={`flex ${m.fromId === user.id ? 'justify-end' : 'justify-start'}`}><div className={`px-4 py-2 rounded-2xl text-sm ${m.fromId === user.id ? 'bg-insta-accent text-white' : (theme === 'dark' ? 'bg-insta-border' : 'bg-gray-100')}`}>{m.text}</div></div>)}
      </div>
      <form onSubmit={send} className="p-4 border-t border-insta-border flex space-x-2">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Message..." className={`flex-1 p-2 rounded-full border px-4 ${theme === 'dark' ? 'bg-insta-dark border-insta-border' : 'bg-gray-50'}`} />
        <button type="submit" className="text-insta-accent font-semibold"><Send size={24} /></button>
      </form>
    </div>
  );

  return (
    <div className={`h-screen ${theme === 'dark' ? 'bg-insta-dark text-white' : 'bg-white text-black'}`}>
      <header className="flex items-center justify-center h-14 border-b border-insta-border"><h1 className="font-bold">{user.username}</h1></header>
      <div className="p-4"><h2 className="font-bold mb-4">Messages</h2>{friends.map(f => <div key={f.id} onClick={() => setSelected(f)} className="flex items-center space-x-4 mb-4 cursor-pointer"><div className="w-14 h-14 rounded-full bg-gray-400" /><div><p className="font-semibold">{f.displayName}</p></div></div>)}</div>
    </div>
  );
};

export default Messages;
