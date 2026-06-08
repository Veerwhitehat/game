import React, { createContext, useContext, useState } from 'react';
const AuthContext = createContext<any>(undefined);
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState(localStorage.getItem('token'));
  const login = (token: string, user: any) => { setToken(token); setUser(user); localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user)); };
  const logout = () => { setToken(null); setUser(null); localStorage.removeItem('token'); localStorage.removeItem('user'); };
  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
