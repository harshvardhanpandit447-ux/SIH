import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth, type UserRole } from './context/AuthContext';
import { PerformanceProvider } from './context/PerformanceContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeSections } from './components/HomeSections';
import { AuthPages } from './components/AuthPages';
import { FarmerDashboard } from './components/FarmerDashboard';
import { FPODashboard } from './components/FPODashboard';
import { BuyerDashboard } from './components/BuyerDashboard';
import { AdminDashboard } from './components/AdminDashboard';

const MainLayout: React.FC = () => {
  const { quickDemoLogin } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickDemo = async (role: UserRole) => {
    await quickDemoLogin(role);
    if (role === 'FARMER') setCurrentView('farmer_dashboard');
    else if (role === 'FPO') setCurrentView('fpo_dashboard');
    else if (role === 'BUYER') setCurrentView('buyer_dashboard');
    else if (role === 'ADMIN') setCurrentView('admin_dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <AuthPages
            initialMode="login"
            onSuccess={role => {
              if (role === 'FARMER') setCurrentView('farmer_dashboard');
              else if (role === 'FPO') setCurrentView('fpo_dashboard');
              else if (role === 'BUYER') setCurrentView('buyer_dashboard');
              else if (role === 'ADMIN') setCurrentView('admin_dashboard');
            }}
            onCancel={() => setCurrentView('home')}
          />
        );
      case 'register':
        return (
          <AuthPages
            initialMode="register"
            onSuccess={role => {
              if (role === 'FARMER') setCurrentView('farmer_dashboard');
              else if (role === 'FPO') setCurrentView('fpo_dashboard');
              else if (role === 'BUYER') setCurrentView('buyer_dashboard');
              else if (role === 'ADMIN') setCurrentView('admin_dashboard');
            }}
            onCancel={() => setCurrentView('home')}
          />
        );
      case 'farmer_dashboard':
        return <FarmerDashboard />;
      case 'fpo_dashboard':
        return <FPODashboard />;
      case 'buyer_dashboard':
        return <BuyerDashboard />;
      case 'admin_dashboard':
        return <AdminDashboard />;
      case 'home':
      default:
        return <HomeSections onNavigate={handleNavigate} onQuickDemo={handleQuickDemo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-agro-bg text-agro-text font-sans pb-16 md:pb-0">
      <Navbar onNavigate={handleNavigate} currentView={currentView} />
      <main className="flex-1">
        {renderView()}
      </main>
      <MobileBottomNav onNavigate={handleNavigate} currentView={currentView} />
    </div>
  );
};

export function App() {
  return (
    <PerformanceProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </LanguageProvider>
    </PerformanceProvider>
  );
}

export default App;
