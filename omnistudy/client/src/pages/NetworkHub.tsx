import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { Check, X } from 'lucide-react';

const NetworkHub: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const { data } = await API.get('/requests');
        setRequests(data);
    };

    const handleAction = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
        const { data } = await API.put(`/requests/${id}`, { status });
        setRequests(requests.filter(r => r.id !== id));

        if (status === 'ACCEPTED' && data.type === 'meeting') {
            // Automatically start chat logic would go here
            // For now, let's just alert
            alert("Meeting request accepted! Head over to Messages to start your call.");
        }
    };

    const friendRequests = requests.filter(r => r.type === 'friend' && r.status === 'PENDING');
    const meetingRequests = requests.filter(r => r.type === 'meeting' && r.status === 'PENDING');

    return (
        <div className="p-4 space-y-8">
            <h1 className="text-xl font-bold">Network Hub</h1>

            <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Friend Requests</h2>
                <div className="space-y-4">
                    {friendRequests.map(req => (
                        <div key={req.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                <span className="text-sm font-semibold">User {req.senderId}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleAction(req.id, 'ACCEPTED')}
                                    className="bg-blue-500 text-white px-4 py-1 rounded text-xs font-semibold"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleAction(req.id, 'REJECTED')}
                                    className="bg-gray-100 dark:bg-zinc-800 px-4 py-1 rounded text-xs font-semibold"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                    {friendRequests.length === 0 && <p className="text-sm text-gray-400 italic">No pending friend requests</p>}
                </div>
            </section>

            <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Meeting Requests</h2>
                <div className="space-y-4">
                    {meetingRequests.map(req => (
                        <div key={req.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                <span className="text-sm font-semibold">User {req.senderId}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleAction(req.id, 'ACCEPTED')}
                                    className="text-blue-500 font-semibold text-xs"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleAction(req.id, 'REJECTED')}
                                    className="text-red-500 font-semibold text-xs"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                    {meetingRequests.length === 0 && <p className="text-sm text-gray-400 italic">No pending meeting requests</p>}
                </div>
            </section>
        </div>
    );
};

export default NetworkHub;
