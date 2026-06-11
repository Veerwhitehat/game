import React, { useState, useEffect } from 'react';
import { Home, MessageCircle, Users, PlusSquare, Book, User, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import HomeFeed from '../pages/HomeFeed';
import FriendsDM from '../pages/FriendsDM';
import NetworkHub from '../pages/NetworkHub';
import ContentStudio from '../pages/ContentStudio';
import Notepad from '../pages/Notepad';
import Profile from '../pages/Profile';

const MainLayout: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const { user, updateUser } = useAuth();
    const [darkMode, setDarkMode] = useState(user?.theme === 'dark');

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleTheme = () => {
        const newTheme = darkMode ? 'light' : 'dark';
        setDarkMode(!darkMode);
        if (user) {
            updateUser({ ...user, theme: newTheme });
        }
    };

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const navigateToProfile = (userId: string) => {
        setSelectedUserId(userId);
        setActiveTab(5); // Profile tab
    };

    const tabs = [
        { icon: Home, component: (props: any) => <HomeFeed {...props} onNavigateToProfile={navigateToProfile} /> },
        { icon: MessageCircle, component: FriendsDM },
        { icon: Users, component: NetworkHub },
        { icon: PlusSquare, component: ContentStudio },
        { icon: Book, component: Notepad },
        { icon: User, component: (props: any) => <Profile {...props} userId={selectedUserId || user?.id} /> },
    ];

    const ActiveComponent = tabs[activeTab].component;

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-insta-dark text-black dark:text-white transition-colors duration-200">
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-16">
                <ActiveComponent onThemeToggle={toggleTheme} isDarkMode={darkMode} />
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-insta-dark border-t border-gray-200 dark:border-insta-border flex items-center justify-around px-2 z-50">
                {tabs.map((tab, index) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`p-2 transition-transform active:scale-90 ${
                                activeTab === index ? 'text-black dark:text-white' : 'text-gray-400'
                            }`}
                        >
                            <Icon size={24} strokeWidth={activeTab === index ? 2.5 : 2} />
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default MainLayout;
