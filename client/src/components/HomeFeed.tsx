import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AppContext';

const API_URL = 'http://localhost:3001/api';

interface HomeFeedProps {
  onUserClick: (username: string) => void;
}

const HomeFeed: React.FC<HomeFeedProps> = ({ onUserClick }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [animatingLike, setAnimatingLike] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get(`${API_URL}/posts`);
    setPosts(res.data);
  };

  const handleLike = async (postId: string) => {
    setAnimatingLike(postId);
    await axios.post(`${API_URL}/posts/${postId}/like`, { userId: user.id });
    fetchPosts();
    setTimeout(() => setAnimatingLike(null), 450);
  };

  const handleComment = async (postId: string) => {
    if (!commentText.trim()) return;
    await axios.post(`${API_URL}/posts/${postId}/comment`, { userId: user.id, text: commentText });
    setCommentText('');
    fetchPosts();
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <header className="fixed top-0 left-0 right-0 h-12 bg-white dark:bg-black border-b border-slate-200 dark:border-insta-border flex items-center px-4 z-40">
        <h1 className="font-serif italic text-xl font-bold">OmniStudy</h1>
      </header>
      <div className="mt-12 w-full max-w-lg pb-16">
        {posts.length === 0 && (
            <div className="p-8 text-center text-slate-500">
                <p>No posts yet. Be the first to share a note!</p>
            </div>
        )}
        {posts.map((post) => (
          <div key={post.id} className="mb-8 border-b border-slate-100 dark:border-insta-border pb-4 last:border-0">
            <div className="flex items-center p-3">
              <button onClick={() => onUserClick(post.user.username)} className="flex items-center">
                <img src={post.user?.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" />
                <span className="ml-3 font-semibold text-sm">{post.user?.username}</span>
              </button>
            </div>
            <div
                onDoubleClick={() => handleLike(post.id)}
                className="bg-slate-50 dark:bg-insta-dark border-y border-slate-100 dark:border-insta-border aspect-square flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
            >
                <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                <p className="text-sm text-slate-600 dark:text-insta-grey overflow-hidden line-clamp-6">{post.content}</p>
                {post.type === 'file' && <div className="mt-4 text-xs font-mono bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">ATTACHED_DOC.pdf</div>}

                {animatingLike === post.id && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Heart size={80} className="text-white fill-white animate-ping opacity-75" />
                    </div>
                )}
            </div>
            <div className="p-3">
              <div className="flex items-center space-x-4 mb-2">
                <button onClick={() => handleLike(post.id)} className="transition-transform active:scale-125 duration-150">
                  <Heart size={24} className={post.likes.includes(user.id) ? 'fill-red-500 text-red-500' : 'text-black dark:text-white'} />
                </button>
                <button onClick={() => setShowComments(post.id)}>
                  <MessageCircle size={24} />
                </button>
              </div>
              <p className="text-sm font-semibold mb-1">{post.likes.length} likes</p>
              <p className="text-sm">
                <span className="font-semibold mr-2">{post.user?.username}</span>
                {post.title}
              </p>
              <button
                onClick={() => setShowComments(post.id)}
                className="text-slate-400 dark:text-insta-grey text-sm mt-1"
              >
                View all {post.comments.length} comments
              </button>
            </div>
          </div>
        ))}
      </div>

      {showComments && (
        <div className="fixed inset-0 bg-white dark:bg-black z-50 flex flex-col p-4">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-insta-border pb-2">
            <button onClick={() => setShowComments(null)} className="text-sm font-semibold">Cancel</button>
            <span className="font-semibold">Comments</span>
            <div className="w-8"></div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4">
            {posts.find(p => p.id === showComments)?.comments.map((c: any) => (
              <div key={c.id} className="flex items-start space-x-3">
                <div className="font-semibold text-sm">{c.username}</div>
                <div className="text-sm">{c.text}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center border-t border-slate-100 dark:border-insta-border pt-4">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 text-sm bg-transparent outline-none"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
                onClick={() => handleComment(showComments)}
                className="text-blue-500 font-semibold text-sm ml-2 disabled:opacity-50"
                disabled={!commentText.trim()}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeFeed;
