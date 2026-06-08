import React, { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext<any>(undefined);
export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark'); root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light') }}>{children}</ThemeContext.Provider>;
};
export const useTheme = () => useContext(ThemeContext);
