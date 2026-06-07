import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AppContext';
import { Check, X, UserPlus, Video } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const RequestCenter: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await axios.get(`${API_URL}/requests/${user.id}`);
    setRequests(res.data);
  };

  const handleAction = async (requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    await axios.put(`${API_URL}/requests/${requestId}`, { status });
    fetchRequests();
    if (status === 'ACCEPTED') {
        // Ideally we would notify the user to check their DMs or redirect
    }
  };

  const friendRequests = requests.filter(r => r.type === 'FRIEND');
  const meetingRequests = requests.filter(r => r.type === 'MEETING');

  return (
    <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white pt-4 pb-16">
      <div className="max-w-lg mx-auto">
        <header className="p-4 border-b border-slate-100 dark:border-insta-border mb-4 text-center">
            <h1 className="text-xl font-bold">Requests</h1>
        </header>

        <section className="mb-8">
            <h2 className="px-4 text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center">
                <UserPlus size={16} className="mr-2" /> Friend Requests
            </h2>
            <div className="divide-y divide-slate-100 dark:divide-insta-border">
            {friendRequests.map(r => (
                <div key={r.id} className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <img src={r.fromUser.avatar} className="w-12 h-12 rounded-full border shadow-sm" alt="" />
                    <div className="ml-4">
                    <p className="text-sm font-bold">{r.fromUser.username}</p>
                    <p className="text-xs text-slate-500">wants to be friends</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => handleAction(r.id, 'ACCEPTED')} className="bg-blue-500 text-white p-1.5 rounded-md hover:bg-blue-600"><Check size={18} /></button>
                    <button onClick={() => handleAction(r.id, 'REJECTED')} className="border border-slate-200 dark:border-insta-border p-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-insta-dark"><X size={18} /></button>
                </div>
                </div>
            ))}
            {friendRequests.length === 0 && <p className="p-4 text-sm text-slate-400">No pending friend requests.</p>}
            </div>
        </section>

        <section>
            <h2 className="px-4 text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center">
                <Video size={16} className="mr-2" /> Meeting Requests
            </h2>
            <div className="divide-y divide-slate-100 dark:divide-insta-border">
            {meetingRequests.map(r => (
                <div key={r.id} className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <img src={r.fromUser.avatar} className="w-12 h-12 rounded-full border shadow-sm" alt="" />
                    <div className="ml-4">
                    <p className="text-sm font-bold">{r.fromUser.username}</p>
                    <p className="text-xs text-slate-500">invited you to a meeting</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => handleAction(r.id, 'ACCEPTED')} className="bg-blue-500 text-white p-1.5 rounded-md hover:bg-blue-600"><Check size={18} /></button>
                    <button onClick={() => handleAction(r.id, 'REJECTED')} className="border border-slate-200 dark:border-insta-border p-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-insta-dark"><X size={18} /></button>
                </div>
                </div>
            ))}
            {meetingRequests.length === 0 && <p className="p-4 text-sm text-slate-400">No pending meeting requests.</p>}
            </div>
        </section>
      </div>
    </div>
  );
};

export default RequestCenter;
