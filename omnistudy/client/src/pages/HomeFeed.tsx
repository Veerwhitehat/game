import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import API from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

interface HomeFeedProps {
    onNavigateToProfile: (userId: string) => void;
}

const HomeFeed: React.FC<HomeFeedProps> = ({ onNavigateToProfile }) => {
    const [posts, setPosts] = useState<any[]>([]);
    const [showComments, setShowComments] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const { data } = await API.get('/posts');
        setPosts(data);
    };

    const handleLike = async (postId: string) => {
        const { data } = await API.post(`/posts/${postId}/like`);
        setPosts(posts.map(p => p.id === postId ? data : p));
    };

    const handleAddComment = async (postId: string) => {
        if (!commentText.trim()) return;
        const { data } = await API.post(`/posts/${postId}/comments`, { text: commentText });
        setPosts(posts.map(p => p.id === postId ? data : p));
        setCommentText('');
    };

    return (
        <div className="max-w-md mx-auto py-4 space-y-6">
            <div className="px-4 flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold tracking-tighter">OmniStudy</h1>
            </div>

            {posts.map(post => (
                <div key={post.id} className="border-b border-gray-100 dark:border-insta-border pb-4">
                    <div className="flex items-center px-4 mb-3">
                        <div
                            className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-3 cursor-pointer"
                            onClick={() => onNavigateToProfile(post.userId)}
                        >
                            {post.avatar ? <img src={post.avatar} alt="" /> : <div className="w-full h-full bg-slate-300" />}
                        </div>
                        <span
                            className="font-semibold text-sm cursor-pointer"
                            onClick={() => onNavigateToProfile(post.userId)}
                        >
                            {post.username}
                        </span>
                        <MoreHorizontal className="ml-auto text-gray-400" size={20} />
                    </div>

                    <div className="aspect-square bg-gray-50 dark:bg-zinc-900 flex items-center justify-center border-y border-gray-100 dark:border-insta-border">
                        {post.type === 'image' ? (
                            <img src={post.content} className="w-full h-full object-cover" alt="" />
                        ) : (
                            <div className="p-8 text-center italic text-gray-500">
                                {post.title}
                            </div>
                        )}
                    </div>

                    <div className="px-4 pt-3 flex space-x-4">
                        <button onClick={() => handleLike(post.id)}>
                            <Heart
                                size={24}
                                className={post.likes?.includes(post.userId) ? "fill-red-500 text-red-500" : ""}
                            />
                        </button>
                        <button onClick={() => setShowComments(post.id)}>
                            <MessageCircle size={24} />
                        </button>
                    </div>

                    <div className="px-4 pt-2">
                        <span className="text-sm font-semibold mr-2">{post.likes?.length || 0} likes</span>
                        <p className="text-sm pt-1">
                            <span className="font-semibold mr-2">{post.username}</span>
                            {post.title}
                        </p>
                        {post.comments?.length > 0 && (
                            <button
                                onClick={() => setShowComments(post.id)}
                                className="text-gray-400 text-sm mt-1"
                            >
                                View all {post.comments.length} comments
                            </button>
                        )}
                    </div>
                </div>
            ))}

            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        className="fixed inset-0 bg-white dark:bg-insta-dark z-[60] flex flex-col"
                    >
                        <div className="p-4 border-b border-gray-100 dark:border-insta-border flex items-center">
                            <button onClick={() => setShowComments(null)} className="text-sm font-semibold">Close</button>
                            <span className="flex-1 text-center font-semibold">Comments</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {posts.find(p => p.id === showComments)?.comments.map((c: any) => (
                                <div key={c.id} className="text-sm">
                                    <span className="font-semibold mr-2">{c.username}</span>
                                    {c.text}
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-100 dark:border-insta-border flex space-x-3">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="flex-1 text-sm outline-none bg-transparent"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button
                                onClick={() => handleAddComment(showComments)}
                                className="text-blue-500 font-semibold text-sm disabled:opacity-50"
                                disabled={!commentText.trim()}
                            >
                                Post
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HomeFeed;
