import React, { useState } from 'react';
import { GakuenProvider, useGakuen } from './context/GakuenContext';
import AuthPortal from './components/AuthPortal';
import FacultyConsole from './components/FacultyConsole';
import StudentPortal from './components/StudentPortal';
import WeeklyTermHub from './components/WeeklyTermHub';
import FacultyEvaluationMatrix from './components/FacultyEvaluationMatrix';
import { LayoutDashboard, Book, ClipboardList, LogOut } from 'lucide-react';

const AppContent: React.FC = () => {
  const { userRole } = useGakuen();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<'DASHBOARD' | 'TERM_HUB' | 'EVALUATION'>('DASHBOARD');

  if (!isLoggedIn) {
    return <AuthPortal onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gakuen-navy flex flex-col md:flex-row overflow-hidden">
      <nav className="w-full md:w-20 bg-gakuen-charcoal border-r border-gakuen-white border-opacity-10 flex md:flex-col items-center py-6 px-4 md:px-0 gap-8 z-[50]">
        <div className="text-gakuen-crimson font-black text-2xl tracking-tighter mb-4 hidden md:block">NG</div>

        <button
          onClick={() => setActiveView('DASHBOARD')}
          className={`p-3 transition-all ${activeView === 'DASHBOARD' ? 'text-gakuen-gold bg-gakuen-white/5' : 'text-gray-500 hover:text-white'}`}
          title="Dashboard"
        >
          <LayoutDashboard size={24} />
        </button>

        <button
          onClick={() => setActiveView('TERM_HUB')}
          className={`p-3 transition-all ${activeView === 'TERM_HUB' ? 'text-gakuen-gold bg-gakuen-white/5' : 'text-gray-500 hover:text-white'}`}
          title="Weekly Hub"
        >
          <Book size={24} />
        </button>

        {userRole === 'Instructor' && (
          <button
            onClick={() => setActiveView('EVALUATION')}
            className={`p-3 transition-all ${activeView === 'EVALUATION' ? 'text-gakuen-gold bg-gakuen-white/5' : 'text-gray-500 hover:text-white'}`}
            title="Evaluation Board"
          >
            <ClipboardList size={24} />
          </button>
        )}

        <div className="md:mt-auto flex md:flex-col gap-6 items-center">
            <button
              onClick={() => setIsLoggedIn(false)}
              className="text-gray-500 hover:text-gakuen-crimson transition-colors"
              title="Logout"
            >
              <LogOut size={24} />
            </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        {activeView === 'DASHBOARD' && (
          userRole === 'Instructor' ? <FacultyConsole /> : <StudentPortal />
        )}

        {activeView === 'TERM_HUB' && (
          <div className="p-6 max-w-7xl mx-auto">
            <WeeklyTermHub />
          </div>
        )}

        {activeView === 'EVALUATION' && userRole === 'Instructor' && (
          <FacultyEvaluationMatrix />
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GakuenProvider>
      <AppContent />
    </GakuenProvider>
  );
};

export default App;
