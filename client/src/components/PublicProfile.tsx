import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Grid, UserPlus, Video } from 'lucide-react';
import { useAuth } from '../context/AppContext';

const API_URL = 'http://localhost:3001/api';

interface PublicProfileProps {
  username: string;
  onBack: () => void;
}

const PublicProfile: React.FC<PublicProfileProps> = ({ username, onBack }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [requestSent, setRequestSent] = useState<{type: string} | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
        const res = await axios.get(`${API_URL}/users/${username}/profile`);
        setProfile(res.data);
    } catch (e) {
        console.error(e);
    }
  };

  const sendRequest = async (type: 'FRIEND' | 'MEETING') => {
      try {
          await axios.post(`${API_URL}/requests`, {
              fromId: user.id,
              toId: profile.user.id,
              type
          });
          setRequestSent({ type });
          setTimeout(() => setRequestSent(null), 3000);
      } catch (e) {
          console.error(e);
      }
  }

  if (!profile) return <div className="p-4">Loading...</div>;

  const isOwnProfile = user.id === profile.user.id;

  return (
    <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white pt-4 px-4 pb-16">
      <div className="max-w-lg mx-auto">
        <header className="flex items-center mb-8">
            <button onClick={onBack} className="mr-4"><ArrowLeft size={24} /></button>
            <h1 className="text-xl font-bold">{username}</h1>
        </header>

        <div className="flex items-center mb-8">
            <img src={profile.user.avatar} className="w-20 h-20 rounded-full border border-slate-200" alt="avatar" />
            <div className="ml-8 flex-1">
            <h2 className="text-lg font-semibold">{profile.user.displayName}</h2>
            {!isOwnProfile && (
                <div className="flex space-x-2 mt-2">
                    <button
                        onClick={() => sendRequest('FRIEND')}
                        className="flex-1 flex items-center justify-center space-x-1 text-xs font-semibold bg-blue-500 text-white py-1.5 rounded-sm"
                    >
                        <UserPlus size={14} /> <span>Follow</span>
                    </button>
                    <button
                        onClick={() => sendRequest('MEETING')}
                        className="flex-1 flex items-center justify-center space-x-1 text-xs font-semibold bg-slate-100 dark:bg-insta-border py-1.5 rounded-sm"
                    >
                        <Video size={14} /> <span>Meet</span>
                    </button>
                </div>
            )}
            {requestSent && (
                <p className="text-[10px] text-green-500 mt-1 font-bold italic">{requestSent.type} request sent!</p>
            )}
            </div>
        </div>

        <div className="border-t border-slate-200 dark:border-insta-border flex justify-center py-2 mb-4">
            <div className="border-t border-black dark:border-white pt-2 flex items-center space-x-1">
            <Grid size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Posts</span>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-1">
            {profile.posts.map((post: any) => (
            <div key={post.id} className="aspect-square bg-slate-100 dark:bg-insta-border flex items-center justify-center p-2 text-center overflow-hidden">
                <span className="text-[10px] line-clamp-3">{post.title}</span>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
