import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Check, X, Video } from 'lucide-react';
export default () => {
  const [fr, setFr] = useState<any[]>([]);
  const [mr, setMr] = useState<any[]>([]);
  const { token, user } = useAuth();
  const { theme } = useTheme();
  const fetch = async () => {
    const resFr = await axios.get('http://localhost:5000/api/social/friend-requests', { headers: { Authorization: `Bearer ${token}` } });
    const resMr = await axios.get('http://localhost:5000/api/social/meeting-requests', { headers: { Authorization: `Bearer ${token}` } });
    setFr(resFr.data); setMr(resMr.data);
  };
  useEffect(() => { fetch(); }, [token]);
  const respond = async (type: string, id: string, status: string) => { await axios.put(`http://localhost:5000/api/social/${type}-requests/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } }); fetch(); };
  return (
    <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-insta-dark text-white' : 'bg-white text-black'}`}>
      <h1 className="text-2xl font-bold mb-6">Network</h1>
      <h2 className="text-xs font-bold text-insta-grey uppercase mb-4 tracking-widest">Friend Requests</h2>
      {fr.map(r => <div key={r.id} className="flex justify-between items-center mb-4"><p>{r.otherUser.displayName}</p>{r.status === 'PENDING' && r.toId === user.id && <div><button onClick={() => respond('friend', r.id, 'ACCEPTED')} className="bg-insta-accent px-4 py-1 rounded text-white mr-2">Accept</button><button onClick={() => respond('friend', r.id, 'REJECTED')}>Reject</button></div>}</div>)}
      <h2 className="text-xs font-bold text-insta-grey uppercase mt-8 mb-4 tracking-widest">Meeting Requests</h2>
      {mr.map(r => <div key={r.id} className="flex justify-between items-center mb-4"><p>{r.otherUser.displayName}</p>{r.status === 'PENDING' && r.toId === user.id && <div><button onClick={() => respond('meeting', r.id, 'ACCEPTED')} className="text-green-500 mr-2"><Check/></button><button onClick={() => respond('meeting', r.id, 'REJECTED')} className="text-red-500"><X/></button></div>}{r.status === 'ACCEPTED' && <Video className="text-insta-accent" />}</div>)}
    </div>
  );
};
