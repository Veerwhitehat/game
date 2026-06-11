import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { FileText, Plus, Save } from 'lucide-react';

const ContentStudio: React.FC = () => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'text' | 'image' | 'document'>('text');
    const [file, setFile] = useState<File | null>(null);
    const [internalNotes, setInternalNotes] = useState<any[]>([]);
    const [selectedNoteId, setSelectedNoteId] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const { data } = await API.get('/notes');
        setInternalNotes(data);
    };

    const handlePublish = async () => {
        if (!title) return setMessage('Please provide a title');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', type);

        if (type !== 'text') {
            if (file) {
                formData.append('file', file);
            } else if (selectedNoteId) {
                const note = internalNotes.find(n => n.id === selectedNoteId);
                formData.append('content', note.content);
            } else {
                return setMessage('Please select a file or internal note');
            }
        }

        try {
            await API.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage('Published successfully!');
            setTitle('');
            setFile(null);
            setSelectedNoteId('');
        } catch (err) {
            setMessage('Failed to publish');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-xl font-bold">New Post</h1>
                <button
                    onClick={handlePublish}
                    className="text-blue-500 font-semibold"
                >
                    Publish
                </button>
            </div>

            <div className="space-y-6">
                <input
                    type="text"
                    placeholder="Name of Note / Post Title"
                    className="w-full text-lg outline-none border-b border-gray-100 dark:border-insta-border bg-transparent py-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="flex space-x-4">
                    <button
                        onClick={() => setType('image')}
                        className={`px-4 py-2 rounded-full text-xs font-semibold ${type === 'image' ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-100 dark:bg-zinc-800'}`}
                    >
                        Upload Image
                    </button>
                    <button
                        onClick={() => setType('text')}
                        className={`px-4 py-2 rounded-full text-xs font-semibold ${type === 'text' ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-100 dark:bg-zinc-800'}`}
                    >
                        Import Note
                    </button>
                </div>

                {type === 'image' ? (
                    <div className="border-2 border-dashed border-gray-200 dark:border-insta-border rounded-lg p-10 text-center">
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                            <Plus size={32} className="text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">{file ? file.name : 'Select from Device'}</span>
                        </label>
                    </div>
                ) : (
                    <select
                        className="w-full p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-insta-border rounded-md text-sm outline-none"
                        value={selectedNoteId}
                        onChange={(e) => setSelectedNoteId(e.target.value)}
                    >
                        <option value="">Select Internal Note</option>
                        {internalNotes.map(note => (
                            <option key={note.id} value={note.id}>{note.title}</option>
                        ))}
                    </select>
                )}

                {message && <p className="text-center text-sm text-blue-500">{message}</p>}
            </div>
        </div>
    );
};

export default ContentStudio;
