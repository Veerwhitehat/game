import React, { useState } from 'react';
import { useAuth } from '../context/AppContext';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/auth/login`, { username, password });
        login(res.data);
      } else {
        const res = await axios.post(`${API_URL}/auth/signup`, { username, displayName, password });
        login(res.data);
      }
    } catch (err: any) {
      if (err.response?.data?.message === "Username taken") {
        setError("Username taken");
      } else {
        setError(err.response?.data?.message || "An error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black p-4">
      <div className="w-full max-w-sm border border-slate-200 dark:border-insta-border p-8 bg-white dark:bg-black rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-8 font-serif italic">OmniStudy</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="p-2 border border-slate-200 dark:border-insta-border bg-slate-50 dark:bg-insta-dark rounded-sm focus:outline-none focus:border-slate-400 text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              type="text"
              placeholder="Display Name"
              className="p-2 border border-slate-200 dark:border-insta-border bg-slate-50 dark:bg-insta-dark rounded-sm focus:outline-none focus:border-slate-400 text-sm"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          )}
          <input
            type="password"
            placeholder="Password"
            className="p-2 border border-slate-200 dark:border-insta-border bg-slate-50 dark:bg-insta-dark rounded-sm focus:outline-none focus:border-slate-400 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-1.5 rounded-sm hover:bg-blue-600 transition-colors text-sm"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
        </form>
        <div className="mt-8 text-center text-sm border-t border-slate-200 dark:border-insta-border pt-4">
          <p className="text-slate-600 dark:text-insta-grey">
            {isLogin ? "Don't have an account?" : "Have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 font-semibold"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
