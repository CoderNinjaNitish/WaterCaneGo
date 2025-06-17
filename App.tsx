import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RequestProvider } from './contexts/RequestContext';
import Home from './components/Home';
import UserAuth from './components/UserAuth';
import TransporterAuth from './components/TransporterAuth';
import UserDashboard from './components/UserDashboard';
import TransporterDashboard from './components/TransporterDashboard';

type View = 'home' | 'user-auth' | 'transporter-auth';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const { currentUser } = useAuth();

  // If user is logged in, show appropriate dashboard
  if (currentUser) {
    return currentUser.role === 'user' ? <UserDashboard /> : <TransporterDashboard />;
  }

  // Show authentication screens or home based on current view
  switch (currentView) {
    case 'user-auth':
      return <UserAuth onBack={() => setCurrentView('home')} />;
    case 'transporter-auth':
      return <TransporterAuth onBack={() => setCurrentView('home')} />;
    default:
      return (
        <Home
          onUserLogin={() => setCurrentView('user-auth')}
          onTransporterLogin={() => setCurrentView('transporter-auth')}
        />
      );
  }
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RequestProvider>
        <AppContent />
      </RequestProvider>
    </AuthProvider>
  );
};

export default App;