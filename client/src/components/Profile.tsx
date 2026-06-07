import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth, useTheme } from '../context/AppContext';
import { LogOut, Grid, Square, Moon, Sun } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [posts, setPosts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user.displayName);
  const [newAvatar, setNewAvatar] = useState(user.avatar);

  useEffect(() => {
    fetchUserPosts();
  }, [user.id]);

  const fetchUserPosts = async () => {
    const res = await axios.get(`${API_URL}/users/${user.username}/profile`);
    setPosts(res.data.posts);
  };

  const handleUpdate = async () => {
    const res = await axios.put(`${API_URL}/users/${user.id}`, {
      displayName: newDisplayName,
      avatar: newAvatar
    });
    updateUser(res.data);
    setIsEditing(false);
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white pt-8 px-4 pb-16">
      <div className="max-w-lg mx-auto">
        <header className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold">{user.username}</h1>
            <div className="flex space-x-4">
            <button onClick={toggleDarkMode}>
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button onClick={logout}>
                <LogOut size={24} />
            </button>
            </div>
        </header>

        <div className="flex items-center mb-8">
            <img src={user.avatar} className="w-20 h-20 rounded-full border border-slate-200" alt="avatar" />
            <div className="ml-8">
            <h2 className="text-lg font-semibold">{user.displayName}</h2>
            <button
                onClick={() => setIsEditing(true)}
                className="mt-2 text-xs font-semibold bg-slate-100 dark:bg-insta-border px-4 py-1.5 rounded-sm"
            >
                Edit Profile
            </button>
            </div>
        </div>

        <div className="flex justify-around border-t border-slate-200 dark:border-insta-border py-4 mb-2">
            <div className="text-center">
            <span className="block font-bold">{posts.length}</span>
            <span className="text-xs text-slate-500">posts</span>
            </div>
            <div className="text-center">
            <span className="block font-bold">0</span>
            <span className="text-xs text-slate-500">followers</span>
            </div>
            <div className="text-center">
            <span className="block font-bold">0</span>
            <span className="text-xs text-slate-500">following</span>
            </div>
        </div>

        <div className="border-t border-slate-200 dark:border-insta-border flex justify-center py-2 space-x-12 mb-4">
            <div className="border-t border-black dark:border-white pt-2 flex items-center space-x-1">
            <Grid size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Posts</span>
            </div>
            <div className="text-slate-400 flex items-center space-x-1 pt-2">
            <Square size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Tagged</span>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-1">
            {posts.map(post => (
            <div key={post.id} className="aspect-square bg-slate-100 dark:bg-insta-border flex items-center justify-center p-2 text-center overflow-hidden">
                <span className="text-[10px] line-clamp-3">{post.title}</span>
            </div>
            ))}
        </div>

        {isEditing && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-black w-full max-w-sm rounded-lg p-6 border border-insta-border">
                <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Display Name</label>
                        <input
                            className="w-full p-2 border border-slate-200 dark:border-insta-border bg-transparent rounded"
                            value={newDisplayName}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Avatar URL</label>
                        <input
                            className="w-full p-2 border border-slate-200 dark:border-insta-border bg-transparent rounded"
                            value={newAvatar}
                            onChange={(e) => setNewAvatar(e.target.value)}
                        />
                    </div>
                    <div className="flex space-x-2 pt-4">
                        <button onClick={handleUpdate} className="flex-1 bg-blue-500 text-white py-2 rounded text-sm font-bold">Save</button>
                        <button onClick={() => setIsEditing(false)} className="flex-1 border border-slate-200 dark:border-insta-border py-2 rounded text-sm font-bold">Cancel</button>
                    </div>
                </div>
            </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
