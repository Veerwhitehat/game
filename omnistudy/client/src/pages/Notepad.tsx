import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { Plus, ChevronLeft, Save } from 'lucide-react';

const Notepad: React.FC = () => {
    const [notes, setNotes] = useState<any[]>([]);
    const [activeNote, setActiveNote] = useState<any | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const { data } = await API.get('/notes');
        setNotes(data);
    };

    const handleCreate = async () => {
        const { data } = await API.post('/notes', { title: 'New Note', content: '' });
        setNotes([...notes, data]);
        setActiveNote(data);
        setTitle(data.title);
        setContent(data.content);
    };

    const handleSave = async () => {
        if (!activeNote) return;
        const { data } = await API.put(`/notes/${activeNote.id}`, { title, content });
        setNotes(notes.map(n => n.id === activeNote.id ? data : n));
        setActiveNote(data);
    };

    if (activeNote) {
        return (
            <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-100 dark:border-insta-border flex items-center justify-between">
                    <button onClick={() => setActiveNote(null)}>
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={handleSave} className="text-blue-500 font-semibold">
                        Save
                    </button>
                </div>
                <input
                    className="p-4 text-2xl font-bold outline-none bg-transparent"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="flex-1 p-4 text-sm outline-none bg-transparent resize-none"
                    placeholder="Start typing..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Personal Repository</h1>
                <button onClick={handleCreate} className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-full">
                    <Plus size={20} />
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {notes.map(note => (
                    <div
                        key={note.id}
                        onClick={() => {
                            setActiveNote(note);
                            setTitle(note.title);
                            setContent(note.content);
                        }}
                        className="p-4 border border-gray-100 dark:border-insta-border rounded-lg aspect-square flex flex-col justify-between cursor-pointer active:scale-95 transition-transform"
                    >
                        <h3 className="font-semibold text-sm line-clamp-2">{note.title}</h3>
                        <span className="text-[10px] text-gray-400">{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notepad;
