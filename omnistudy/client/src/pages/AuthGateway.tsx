import React, { useState } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AuthGateway: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/signup';
            const payload = isLogin ? { username, password } : { username, password, displayName };
            const { data } = await API.post(endpoint, payload);
            login(data.token, data.user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-insta-dark p-4">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tighter mb-8">OmniStudy</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full p-3 bg-gray-50 dark:bg-insta-dark border border-gray-200 dark:border-insta-border rounded-sm outline-none focus:border-gray-400"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Display Name"
                            className="w-full p-3 bg-gray-50 dark:bg-insta-dark border border-gray-200 dark:border-insta-border rounded-sm outline-none focus:border-gray-400"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    )}
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 bg-gray-50 dark:bg-insta-dark border border-gray-200 dark:border-insta-border rounded-sm outline-none focus:border-gray-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                </form>
                <div className="text-center pt-4">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-blue-500 font-semibold"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthGateway;
