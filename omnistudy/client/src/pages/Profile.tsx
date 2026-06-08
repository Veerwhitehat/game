import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default () => {
  const [profile, setProfile] = useState<any>(null);
  const { token, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { username } = useParams();
  const targetUsername = username || user?.username;

  useEffect(() => {
    if (targetUsername) {
      axios.get(`http://localhost:5000/api/profile/${targetUsername}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => setProfile(r.data));
    }
  }, [targetUsername, token]);

  if (!profile) return null;
  const isOwnProfile = profile.user.username === user?.username;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-insta-dark text-white' : 'bg-white text-black'}`}>
      <header className="flex justify-between items-center p-4 border-b border-insta-border">
        <h1 className="font-bold">{profile.user.username}</h1>
        <div className="flex space-x-4">
          <button onClick={toggleTheme}>{theme === 'dark' ? <Sun/> : <Moon/>}</button>
          {isOwnProfile && <button onClick={logout}><LogOut/></button>}
        </div>
      </header>
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gray-400 mr-8" />
          <div className="flex-1">
            <h2 className="text-xl">{profile.user.username}</h2>
            <p className="font-bold">{profile.user.displayName}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {profile.posts.map((p: any) => (
            <div key={p.id} className="aspect-square bg-zinc-900 border border-insta-border flex items-center justify-center p-1 text-center">
              <p className="text-[10px]">{p.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
