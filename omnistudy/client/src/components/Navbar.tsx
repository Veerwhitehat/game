import React from 'react';
import { Home, MessageCircle, Users, PlusSquare, FileText, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
const Navbar = () => {
  const { theme } = useTheme();
  const items = [{ icon: Home, path: '/' }, { icon: MessageCircle, path: '/messages' }, { icon: Users, path: '/network' }, { icon: PlusSquare, path: '/studio' }, { icon: FileText, path: '/repository' }, { icon: User, path: '/profile' }];
  return (
    <nav className={`fixed bottom-0 left-0 right-0 h-16 border-t flex items-center justify-around px-2 z-50 ${theme === 'dark' ? 'bg-insta-dark border-insta-border' : 'bg-white border-gray-200'}`}>
      {items.map(i => (
        <NavLink key={i.path} to={i.path} className={({ isActive }) => `p-2 ${isActive ? (theme === 'dark' ? 'text-white' : 'text-black') : 'text-insta-grey'}`}><i.icon size={26}/></NavLink>
      ))}
    </nav>
  );
};
export default Navbar;
