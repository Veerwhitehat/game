import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomeFeed from './pages/HomeFeed';
import Messages from './pages/Messages';
import Network from './pages/Network';
import Studio from './pages/Studio';
import Repository from './pages/Repository';
import Profile from './pages/Profile';

const AppContent = () => {
  const { user } = useAuth();
  if (!user) return <Routes><Route path="/login" element={<Login />} /><Route path="/signup" element={<Signup />} /><Route path="*" element={<Navigate to="/login" />} /></Routes>;
  return <div className="min-h-screen pb-16"><Routes><Route path="/" element={<HomeFeed />} /><Route path="/messages" element={<Messages />} /><Route path="/network" element={<Network />} /><Route path="/studio" element={<Studio />} /><Route path="/repository" element={<Repository />} /><Route path="/profile" element={<Profile />} /><Route path="/profile/:username" element={<Profile />} /><Route path="*" element={<Navigate to="/" />} /></Routes><Navbar /></div>;
};
export default () => <ThemeProvider><AuthProvider><AppContent /></AuthProvider></ThemeProvider>;
