import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
export default () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const submit = async (e: any) => { e.preventDefault(); try { const res = await axios.post('http://localhost:5000/api/auth/login', { username, password }); login(res.data.token, res.data.user); navigate('/'); } catch (err: any) { alert(err.response?.data?.message || 'Error'); } };
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen px-4 ${theme === 'dark' ? 'bg-insta-dark text-white' : 'bg-white text-black'}`}>
      <h1 className="text-4xl font-bold mb-8 italic">OmniStudy</h1>
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className={`w-full p-3 border rounded-sm ${theme === 'dark' ? 'bg-insta-dark border-insta-border' : 'bg-gray-50'}`} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className={`w-full p-3 border rounded-sm ${theme === 'dark' ? 'bg-insta-dark border-insta-border' : 'bg-gray-50'}`} />
        <button className="w-full py-2 bg-insta-accent text-white font-semibold rounded-md">Log In</button>
      </form>
      <p className="mt-8">Don't have an account? <Link to="/signup" className="text-insta-accent">Sign up</Link></p>
    </div>
  );
};
