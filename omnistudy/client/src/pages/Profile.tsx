import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Grid, LogOut, Moon, Sun } from 'lucide-react';
import API from '../utils/api';

interface ProfileProps {
    onThemeToggle: () => void;
    isDarkMode: boolean;
    userId: string;
}

const Profile: React.FC<ProfileProps> = ({ onThemeToggle, isDarkMode, userId }) => {
    const { user, logout, updateUser } = useAuth();
    const [profileUser, setProfileUser] = useState<any>(null);
    const [userPosts, setUserPosts] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editDisplayName, setEditDisplayName] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const isOwnProfile = userId === user?.id;

    useEffect(() => {
        const fetchProfileData = async () => {
            const { data: userData } = await API.get(`/users/${userId}`);
            setProfileUser(userData);
            setEditDisplayName(userData.displayName);

            const { data: postsData } = await API.get('/posts');
            setUserPosts(postsData.filter((p: any) => p.userId === userId));
        };
        fetchProfileData();
    }, [userId]);

    const handleUpdateProfile = async () => {
        const formData = new FormData();
        formData.append('displayName', editDisplayName);
        if (avatarFile) formData.append('avatar', avatarFile);

        const { data } = await API.put('/profile', formData);
        setProfileUser(data);
        updateUser(data);
        setIsEditing(false);
    };

    return (
        <div className="p-4">
            <header className="flex justify-between items-center mb-6">
                <h1 className="font-bold">{profileUser?.username}</h1>
                <div className="flex space-x-4">
                    <button onClick={onThemeToggle}>
                        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                    <button onClick={logout}>
                        <LogOut size={24} />
                    </button>
                </div>
            </header>

            <div className="flex items-center space-x-8 mb-8">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden border border-gray-100 dark:border-insta-border">
                    {profileUser?.avatar ? <img src={profileUser.avatar} alt="" /> : null}
                </div>
                <div className="flex space-x-6 text-center">
                    <div>
                        <div className="font-bold">{userPosts.length}</div>
                        <div className="text-xs text-gray-500">Posts</div>
                    </div>
                    <div>
                        <div className="font-bold">0</div>
                        <div className="text-xs text-gray-500">Friends</div>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                {isEditing ? (
                    <div className="space-y-4">
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-insta-border rounded text-sm outline-none"
                            value={editDisplayName}
                            onChange={(e) => setEditDisplayName(e.target.value)}
                        />
                        <input
                            type="file"
                            className="text-xs"
                            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                        />
                        <div className="flex space-x-2">
                            <button
                                onClick={handleUpdateProfile}
                                className="flex-1 bg-blue-500 text-white py-1.5 rounded-md text-xs font-semibold"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 bg-gray-100 dark:bg-zinc-800 py-1.5 rounded-md text-xs font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="font-semibold text-sm">{profileUser?.displayName}</h2>
                        <p className="text-xs text-gray-500">Academic Explorer</p>
                        {isOwnProfile && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full mt-4 bg-gray-100 dark:bg-zinc-800 py-1.5 rounded-md text-xs font-semibold"
                            >
                                Edit Profile
                            </button>
                        )}
                    </>
                )}
            </div>

            <div className="border-t border-gray-100 dark:border-insta-border pt-2">
                <div className="flex justify-center mb-4">
                    <Grid size={24} />
                </div>
                <div className="grid grid-cols-3 gap-0.5">
                    {userPosts.map(post => (
                        <div key={post.id} className="aspect-square bg-gray-100 dark:bg-zinc-900">
                            {post.type === 'image' ? (
                                <img src={post.content} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-2 text-[8px] text-center italic">
                                    {post.title}
                                </div>
                            )}
                        </div>
                    ))}
                    {userPosts.length === 0 && (
                        <div className="col-span-3 py-10 text-center text-gray-400 text-sm italic">
                            No posts yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
