import React from 'react';
import { Home, Users, Bell, PlusSquare, FileText, User } from 'lucide-react';

interface NavBarProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

const NavBar: React.FC<NavBarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 1, icon: Home },
    { id: 2, icon: Users },
    { id: 3, icon: Bell },
    { id: 4, icon: PlusSquare },
    { id: 5, icon: FileText },
    { id: 6, icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-white dark:bg-black border-t border-slate-200 dark:border-insta-border flex items-center justify-around z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`transition-colors ${
              activeTab === tab.id ? 'text-black dark:text-white' : 'text-slate-400 dark:text-insta-grey'
            }`}
          >
            <Icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          </button>
        );
      })}
    </div>
  );
};

export default NavBar;
