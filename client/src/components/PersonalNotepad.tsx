import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AppContext';
import { Plus, Save, FileText, Edit2, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const API_URL = 'http://localhost:3001/api';

const PersonalNotepad: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await axios.get(`${API_URL}/notes/${user.id}`);
    setNotes(res.data);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    await axios.post(`${API_URL}/notes`, {
      userId: user.id,
      title,
      content
    });
    setTitle('');
    setContent('');
    setIsCreating(false);
    setIsPreview(false);
    fetchNotes();
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white pt-4 h-full flex flex-col pb-16">
      <div className="max-w-lg mx-auto w-full flex flex-col flex-1 px-4">
        <header className="p-4 border-b border-slate-100 dark:border-insta-border flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">My Notepad</h1>
            <div className="flex items-center space-x-4">
                {isCreating && (
                    <button onClick={() => setIsPreview(!isPreview)} className="text-slate-500">
                        {isPreview ? <Edit2 size={20} /> : <Eye size={20} />}
                    </button>
                )}
                {!isCreating ? (
                    <button onClick={() => setIsCreating(true)} className="text-blue-500">
                        <Plus size={24} />
                    </button>
                ) : (
                    <button onClick={handleSave} className="text-blue-500 font-bold">
                        Save
                    </button>
                )}
            </div>
        </header>

        <div className="flex-1">
            {!isCreating ? (
                <div className="grid grid-cols-2 gap-4">
                    {notes.map(n => (
                        <div key={n.id} className="p-4 border border-slate-200 dark:border-insta-border rounded-lg bg-slate-50 dark:bg-insta-dark shadow-sm">
                            <FileText size={20} className="mb-2 text-slate-400" />
                            <h3 className="font-bold text-sm mb-1">{n.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-3">{n.content}</p>
                        </div>
                    ))}
                    {notes.length === 0 && (
                        <div className="col-span-2 text-center py-20 text-slate-400">
                            <p>No notes yet. Create your first one with Markdown support!</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col h-full min-h-[60vh]">
                    <input
                        type="text"
                        placeholder="Note title..."
                        className="w-full text-lg font-semibold bg-transparent border-b border-slate-100 dark:border-insta-border pb-2 outline-none mb-4"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {isPreview ? (
                        <div className="flex-1 prose dark:prose-invert max-w-none text-sm">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                    ) : (
                        <textarea
                            placeholder="Start typing (Markdown supported)..."
                            className="flex-1 w-full bg-transparent outline-none text-sm resize-none font-mono"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    )}
                    <button
                        onClick={() => {setIsCreating(false); setIsPreview(false);}}
                        className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-left"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PersonalNotepad;
