import React, { useState } from 'react';
import { AuthProvider, ThemeProvider, useAuth } from './context/AppContext';
import Auth from './components/Auth';
import NavBar from './components/NavBar';
import HomeFeed from './components/HomeFeed';
import FriendsChat from './components/FriendsChat';
import RequestCenter from './components/RequestCenter';
import ContentStudio from './components/ContentStudio';
import PersonalNotepad from './components/PersonalNotepad';
import Profile from './components/Profile';
import PublicProfile from './components/PublicProfile';

const AppContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(1);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  if (!user) {
    return <Auth />;
  }

  const navigateToProfile = (username: string) => {
    setSelectedUser(username);
    setActiveTab(0); // 0 is for dynamic public profile
  }

  const renderTab = () => {
    if (selectedUser && activeTab === 0) {
        return <PublicProfile username={selectedUser} onBack={() => setActiveTab(1)} />;
    }
    switch (activeTab) {
      case 1: return <HomeFeed onUserClick={navigateToProfile} />;
      case 2: return <FriendsChat />;
      case 3: return <RequestCenter />;
      case 4: return <ContentStudio onPostSuccess={() => setActiveTab(1)} />;
      case 5: return <PersonalNotepad />;
      case 6: return <Profile />;
      default: return <HomeFeed onUserClick={navigateToProfile} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-black text-black dark:text-white pb-12 overflow-x-hidden">
      <main className="flex-1 overflow-y-auto">
        {renderTab()}
      </main>
      <NavBar activeTab={activeTab} setActiveTab={(tab) => {
          setSelectedUser(null);
          setActiveTab(tab);
      }} />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
