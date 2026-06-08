import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const { token, user } = useAuth();
  const { theme } = useTheme();

  const fetch = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts', { headers: { Authorization: `Bearer ${token}` } });
      setPosts(res.data);
      if (selectedPost) {
        const updated = res.data.find((p: any) => p.id === selectedPost.id);
        if (updated) setSelectedPost(updated);
      }
    } catch (err) {}
  };

  useEffect(() => { fetch(); }, [token]);

  const like = async (id: string) => {
    try {
      await axios.post(`http://localhost:5000/api/posts/${id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetch();
    } catch (err) {}
  };

  const submitComment = async (e: any) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/posts/${selectedPost.id}/comment`, { text: commentText }, { headers: { Authorization: `Bearer ${token}` } });
      setCommentText('');
      fetch();
    } catch (err) {}
  };

  return (
    <div className={`max-w-xl mx-auto pb-16 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
      <header className={`sticky top-0 z-40 flex items-center justify-between px-4 h-12 border-b ${theme === 'dark' ? 'bg-insta-dark border-insta-border' : 'bg-white border-gray-200'}`}>
        <h1 className="text-xl font-bold italic">OmniStudy</h1>
      </header>
      <div className="divide-y divide-insta-border">
        {posts.map(p => (
          <div key={p.id} className="py-4">
            <div className="flex items-center px-4 mb-3 space-x-3">
              <Link to={`/profile/${p.username}`} className="w-8 h-8 rounded-full bg-gray-400 overflow-hidden" />
              <Link to={`/profile/${p.username}`} className="font-semibold text-sm">{p.username}</Link>
            </div>
            <div className={`aspect-square w-full flex items-center justify-center p-8 border-y ${theme === 'dark' ? 'bg-zinc-900 border-insta-border' : 'bg-gray-50'}`}>
              <div className="text-center"><h2 className="font-bold">{p.title}</h2><p className="text-sm opacity-80">{p.content}</p></div>
            </div>
            <div className="px-4 py-3 flex space-x-4">
              <button onClick={() => like(p.id)} className="transition-transform active:scale-125">
                <Heart size={26} className={p.likes.includes(user?.id) ? 'fill-red-500 text-red-500' : ''} />
              </button>
              <button onClick={() => setSelectedPost(p)}>
                <MessageCircle size={26} />
              </button>
            </div>
            <div className="px-4">
              <p className="text-sm font-bold">{p.likes.length} likes</p>
              <p className="text-sm"><span className="font-bold mr-2">{p.username}</span>{p.title}</p>
              <button onClick={() => setSelectedPost(p)} className="text-insta-grey text-sm mt-1">View all {p.comments.length} comments</button>
            </div>
          </div>
        ))}
      </div>

      {/* Comment Sheet */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-end">
          <div className={`w-full max-h-[80vh] flex flex-col rounded-t-3xl ${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
            <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto my-3" />
            <div className="flex justify-between items-center px-6 py-2 border-b border-insta-border">
              <span className="font-bold">Comments</span>
              <button onClick={() => setSelectedPost(null)}><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedPost.comments.map((c: any) => (
                <div key={c.id} className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-400" />
                  <div>
                    <p className="text-sm">
                      <span className="font-bold mr-2">User</span>
                      {c.text}
                    </p>
                    <p className="text-xs text-insta-grey mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {selectedPost.comments.length === 0 && <p className="text-center text-insta-grey py-10">No comments yet.</p>}
            </div>
            <form onSubmit={submitComment} className="p-4 border-t border-insta-border flex items-center space-x-4">
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent border-none outline-none"
              />
              <button type="submit" className="text-insta-accent font-bold"><Send size={24}/></button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import { X } from 'lucide-react';
