import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthGateway from './pages/AuthGateway';
import MainLayout from './components/MainLayout';

const AppContent: React.FC = () => {
    const { token } = useAuth();
    return token ? <MainLayout /> : <AuthGateway />;
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
