import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Plus, Save, Trash2 } from 'lucide-react';
export default () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { token } = useAuth();
  const { theme } = useTheme();
  const fetch = async () => { const r = await axios.get('http://localhost:5000/api/notes', { headers: { Authorization: `Bearer ${token}` } }); setNotes(r.data); };
  useEffect(() => { fetch(); }, [token]);
  const save = async () => { await axios.post('http://localhost:5000/api/notes', { id: selected?.id, title, content }, { headers: { Authorization: `Bearer ${token}` } }); fetch(); setSelected(null); };
  if (selected || selected === null && title) return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-insta-dark text-white' : 'bg-white text-black'}`}>
      <header className="flex justify-between p-4 border-b border-insta-border"><button onClick={() => { setSelected(null); setTitle(''); }}>Back</button><button onClick={save}><Save/></button></header>
      <div className="p-6 flex-1 flex flex-col space-y-4"><input value={title} onChange={e => setTitle(e.target.value)} className="bg-transparent text-2xl font-bold border-none" /><textarea value={content} onChange={e => setContent(e.target.value)} className="bg-transparent flex-1 border-none text-lg" /></div>
    </div>
  );
  return (
    <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-insta-dark text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center mb-8"><h1 className="text-2xl font-bold">Notes</h1><button onClick={() => { setSelected(null); setTitle('New'); setContent(''); }}><Plus/></button></div>
      <div className="grid grid-cols-2 gap-4">{notes.map(n => <div key={n.id} onClick={() => { setSelected(n); setTitle(n.title); setContent(n.content); }} className="p-4 border border-insta-border rounded"><h3>{n.title}</h3></div>)}</div>
    </div>
  );
};
