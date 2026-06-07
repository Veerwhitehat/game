import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AppContext';
import { Upload, FileSearch, CheckCircle, File } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

interface ContentStudioProps {
  onPostSuccess: () => void;
}

const ContentStudio: React.FC<ContentStudioProps> = ({ onPostSuccess }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'upload' | 'import' | null>(null);
  const [userNotes, setUserNotes] = useState<any[]>([]);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === 'import') {
      fetchNotes();
    }
  }, [mode]);

  const fetchNotes = async () => {
    const res = await axios.get(`${API_URL}/notes/${user.id}`);
    setUserNotes(res.data);
  };

  const handlePublish = async () => {
    if (!title.trim()) return;

    let postContent = '';
    let postType = 'internal';

    if (mode === 'upload') {
        if (selectedFile) {
            postContent = selectedFile.name;
            postType = 'file';
        } else {
            postContent = content;
            postType = 'text';
        }
    } else if (mode === 'import' && selectedNote) {
        postContent = selectedNote.content;
        postType = 'internal';
    }

    if (!postContent) return;

    await axios.post(`${API_URL}/posts`, {
      userId: user.id,
      title,
      content: postContent,
      type: postType
    });
    onPostSuccess();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setSelectedFile(e.target.files[0]);
      }
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white pt-4 h-full flex flex-col pb-16">
      <div className="max-w-lg mx-auto w-full flex flex-col flex-1 px-4">
        <header className="p-4 border-b border-slate-100 dark:border-insta-border flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">New Post</h1>
            <button
                onClick={handlePublish}
                disabled={!title || (mode === 'upload' && !content && !selectedFile) || (mode === 'import' && !selectedNote)}
                className="text-blue-500 font-bold disabled:opacity-50"
            >
                Publish
            </button>
        </header>

        <div className="flex-1">
            <input
                type="text"
                placeholder="Post title..."
                className="w-full text-lg font-semibold bg-transparent border-b border-slate-100 dark:border-insta-border pb-2 outline-none mb-6"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            {!mode && (
            <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                    onClick={() => setMode('upload')}
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-insta-border rounded-xl hover:bg-slate-50 dark:hover:bg-insta-dark transition-all"
                >
                <Upload size={32} className="mb-2 text-blue-500" />
                <span className="text-sm font-semibold">Upload from Device</span>
                </button>
                <button
                    onClick={() => setMode('import')}
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-insta-border rounded-xl hover:bg-slate-50 dark:hover:bg-insta-dark transition-all"
                >
                <FileSearch size={32} className="mb-2 text-green-500" />
                <span className="text-sm font-semibold">Import Internal Note</span>
                </button>
            </div>
            )}

            {mode === 'upload' && (
                <div className="space-y-4">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-slate-200 dark:border-insta-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-insta-dark"
                    >
                        {selectedFile ? (
                            <div className="flex items-center space-x-2">
                                <File className="text-blue-500" />
                                <span className="text-sm font-bold">{selectedFile.name}</span>
                            </div>
                        ) : (
                            <>
                                <Upload className="text-slate-400 mb-2" />
                                <span className="text-xs text-slate-500">Click to select a file</span>
                            </>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" onChange={onFileChange} />
                    </div>
                    <p className="text-center text-xs text-slate-400">OR</p>
                    <textarea
                        placeholder="Paste text content..."
                        className="w-full h-48 bg-slate-50 dark:bg-insta-dark p-4 rounded-lg outline-none text-sm resize-none border border-slate-100 dark:border-insta-border"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
            )}

            {mode === 'import' && (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase">Select a note</p>
                    {userNotes.map(n => (
                        <button
                            key={n.id}
                            onClick={() => setSelectedNote(n)}
                            className={`w-full p-4 border rounded-lg text-left flex justify-between items-center transition-colors ${
                                selectedNote?.id === n.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-insta-border hover:bg-slate-50 dark:hover:bg-insta-dark'
                            }`}
                        >
                            <span className="font-semibold text-sm">{n.title}</span>
                            {selectedNote?.id === n.id && <CheckCircle size={16} className="text-blue-500" />}
                        </button>
                    ))}
                    {userNotes.length === 0 && <p className="text-sm text-slate-400">No internal notes found.</p>}
                </div>
            )}

            {mode && (
                <button
                    onClick={() => {setMode(null); setSelectedNote(null); setSelectedFile(null); setContent('');}}
                    className="mt-6 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors"
                >
                    ← Back to options
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ContentStudio;
