import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { X, Upload } from 'lucide-react';

export default () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const { token } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/notes', { headers: { Authorization: `Bearer ${token}` } }).then(r => setNotes(r.data));
  }, [token]);

  const publish = async () => {
    await axios.post('http://localhost:5000/api/posts', { title, content, type: 'internal_note' }, { headers: { Authorization: `Bearer ${token}` } });
    navigate('/');
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setTitle(file.name);
      setContent(`Uploaded file: ${file.name} (${file.type})`);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-insta-dark text-white' : 'bg-white text-black'}`}>
      <header className="flex justify-between p-4 border-b border-insta-border">
        <button onClick={() => navigate(-1)}>Cancel</button>
        <h1 className="font-bold">New Post</h1>
        <button onClick={publish} className="text-insta-accent font-semibold">Publish</button>
      </header>
      <div className="p-4 flex-1 flex flex-col space-y-4">
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="bg-transparent text-lg font-bold border-none outline-none" />
        <textarea placeholder="Write your study content here..." value={content} onChange={e => setContent(e.target.value)} className="bg-transparent flex-1 border-none outline-none resize-none" />

        <div className="flex flex-col space-y-2">
          <label className="flex items-center space-x-2 p-4 border border-insta-border rounded cursor-pointer active:bg-zinc-900">
            <Upload size={20} />
            <span>Upload from Device</span>
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
          <button onClick={() => setShow(true)} className="flex items-center space-x-2 p-4 border border-insta-border rounded text-left active:bg-zinc-900">
            <span>Import Internal Notes</span>
          </button>
        </div>
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className={`w-full p-6 rounded-t-2xl ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold">Select Note</h2>
              <button onClick={() => setShow(false)}><X/></button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {notes.map(n => <div key={n.id} onClick={() => { setTitle(n.title); setContent(n.content); setShow(false); }} className="p-3 border-b border-insta-border cursor-pointer hover:bg-insta-accent/10">{n.title}</div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
