import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth, type UserRole } from '../context/AuthContext';
import { usePerformance } from '../context/PerformanceContext';
import { 
  Sprout, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown, 
  CheckCircle2,
  Zap
} from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout, quickDemoLogin } = useAuth();
  const { isLiteMode, toggleLiteMode } = usePerformance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const handleDemoSwitch = async (role: UserRole) => {
    setDemoDropdownOpen(false);
    setMobileMenuOpen(false);
    await quickDemoLogin(role);
    if (role === 'FARMER') onNavigate('farmer_dashboard');
    else if (role === 'FPO') onNavigate('fpo_dashboard');
    else if (role === 'BUYER') onNavigate('buyer_dashboard');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 border-b border-agro-light/80 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-agro-primary to-agro-bright flex items-center justify-center text-white shadow-md shadow-agro-primary/25 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-agro-text">AGRO</span>
                <span className="text-2xl font-black tracking-tight text-agro-primary">VISION</span>
              </div>
              <p className="text-[10px] font-semibold text-agro-dark/70 tracking-wider uppercase">
                {language === 'mr' ? 'स्मार्ट शेती • अधिक नफा' : 'Smart Farming • Better Returns'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentView === 'home' ? 'text-agro-primary bg-agro-mint' : 'text-agro-text/80 hover:text-agro-primary hover:bg-agro-mint/60'
              }`}
            >
              {t('nav.home')}
            </button>
            <a
              href="#how-it-works"
              onClick={() => currentView !== 'home' && onNavigate('home')}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-agro-text/80 hover:text-agro-primary hover:bg-agro-mint/60 transition-colors"
            >
              {t('nav.howItWorks')}
            </a>
            <a
              href="#problem-solution"
              onClick={() => currentView !== 'home' && onNavigate('home')}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-agro-text/80 hover:text-agro-primary hover:bg-agro-mint/60 transition-colors"
            >
              {t('nav.features')}
            </a>
            <a
              href="#market-intelligence"
              onClick={() => currentView !== 'home' && onNavigate('home')}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-agro-text/80 hover:text-agro-primary hover:bg-agro-mint/60 transition-colors"
            >
              {t('nav.marketIntelligence')}
            </a>
          </div>

          {/* Right Side Actions: Language Switcher, Lite Mode, & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Lite Mode Toggle (Desktop) */}
            <button
              onClick={toggleLiteMode}
              title={isLiteMode ? 'Lite Mode Active (Saves RAM & CPU)' : 'Full Visual Effects Active'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                isLiteMode
                  ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${isLiteMode ? 'text-amber-600 fill-amber-500' : 'text-gray-400'}`} />
              <span>{isLiteMode ? (language === 'mr' ? 'जलद मोड चालू' : 'Lite Mode ON') : (language === 'mr' ? 'फुल मोड' : 'Standard')}</span>
            </button>
            {/* Bilingual Switcher */}
            <div className="flex items-center bg-agro-mint border border-agro-light rounded-full p-1 shadow-sm">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-agro-primary text-white shadow-sm'
                    : 'text-agro-text/70 hover:text-agro-dark'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('mr')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  language === 'mr'
                    ? 'bg-agro-primary text-white shadow-sm font-devanagari'
                    : 'text-agro-text/70 hover:text-agro-dark font-devanagari'
                }`}
              >
                मराठी
              </button>
            </div>

            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-agro-dark border border-agro-bright/40 hover:bg-emerald-100 transition-colors"
              >
                <span>⚡ {t('nav.demoLogin')}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-agro-light rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-agro-dark/60 uppercase tracking-wider">
                    {language === 'mr' ? 'भूमिका निवडा (पुणे हब)' : 'Select Role (Pune Hub)'}
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('FARMER')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-agro-mint flex items-center justify-between text-agro-text"
                  >
                    <div>
                      <div className="font-bold text-emerald-800">🌾 {language === 'mr' ? 'शेतकरी' : 'Farmer'}</div>
                      <div className="text-xs text-gray-500">Sopanrao Patil (Otur, Pune)</div>
                    </div>
                    {user?.role === 'FARMER' && <CheckCircle2 className="w-4 h-4 text-agro-primary" />}
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('FPO')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-agro-mint flex items-center justify-between text-agro-text"
                  >
                    <div>
                      <div className="font-bold text-emerald-800">🏢 {language === 'mr' ? 'FPO कंपनी' : 'FPO Intermediary'}</div>
                      <div className="text-xs text-gray-500">Shivneri FPC (Narayangaon)</div>
                    </div>
                    {user?.role === 'FPO' && <CheckCircle2 className="w-4 h-4 text-agro-primary" />}
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('BUYER')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-agro-mint flex items-center justify-between text-agro-text"
                  >
                    <div>
                      <div className="font-bold text-emerald-800">🛒 {language === 'mr' ? 'अधिकृत खरेदीदार' : 'Verified Buyer'}</div>
                      <div className="text-xs text-gray-500">Sahyadri Fresh Wholesale</div>
                    </div>
                    {user?.role === 'BUYER' && <CheckCircle2 className="w-4 h-4 text-agro-primary" />}
                  </button>
                </div>
              )}
            </div>

            {/* Authenticated User Status vs Login/Register */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (user.role === 'FARMER') onNavigate('farmer_dashboard');
                    else if (user.role === 'FPO') onNavigate('fpo_dashboard');
                    else if (user.role === 'BUYER') onNavigate('buyer_dashboard');
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-agro-primary text-white font-semibold text-sm hover:bg-agro-dark transition-all shadow-sm shadow-agro-primary/30"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t('nav.dashboard')} ({user.role})</span>
                </button>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 rounded-xl font-semibold text-sm text-agro-dark hover:bg-agro-mint transition-colors"
                >
                  {t('nav.login')}
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 rounded-xl font-bold text-sm bg-agro-primary text-white hover:bg-agro-dark shadow-sm shadow-agro-primary/25 transition-all"
                >
                  {t('nav.register')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu & Quick Controls */}
          <div className="flex items-center gap-1.5 md:hidden">
            {/* Quick Lite Mode Switch on Mobile */}
            <button
              onClick={toggleLiteMode}
              title="Toggle Lite Mode (Saves RAM & Battery)"
              className={`px-2 py-1 text-xs font-bold rounded-lg border flex items-center gap-1 transition-all ${
                isLiteMode
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white border-gray-300 text-gray-600'
              }`}
            >
              <Zap className={`w-3 h-3 ${isLiteMode ? 'fill-amber-600 text-amber-600' : 'text-gray-400'}`} />
              <span>{isLiteMode ? '⚡ Lite' : 'Full'}</span>
            </button>

            {/* Bilingual Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
              className="px-2 py-1 text-xs font-bold rounded-lg bg-agro-mint border border-agro-light text-agro-dark"
            >
              {language === 'en' ? 'मराठी' : 'EN'}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-agro-text hover:bg-agro-mint transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-agro-light bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in fade-in duration-150">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="text-left py-2 px-2 rounded-lg font-semibold text-agro-text hover:bg-agro-mint/60"
            >
              {t('nav.home')}
            </button>
            <a
              href="#market-intelligence"
              onClick={() => { if (currentView !== 'home') onNavigate('home'); setMobileMenuOpen(false); }}
              className="text-left py-2 px-2 rounded-lg font-semibold text-agro-text hover:bg-agro-mint/60"
            >
              📈 {t('nav.marketIntelligence')} (पुणे भाव)
            </a>
            <a
              href="#how-it-works"
              onClick={() => { if (currentView !== 'home') onNavigate('home'); setMobileMenuOpen(false); }}
              className="text-left py-2 px-2 rounded-lg font-semibold text-agro-text hover:bg-agro-mint/60"
            >
              🌾 {t('nav.howItWorks')}
            </a>
            <button
              onClick={() => {
                if (user?.role === 'FARMER') onNavigate('farmer_dashboard');
                else if (user?.role === 'FPO') onNavigate('fpo_dashboard');
                else if (user?.role === 'BUYER') onNavigate('buyer_dashboard');
                else onNavigate('login');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-2 rounded-lg font-semibold text-agro-primary hover:bg-agro-mint/60"
            >
              {isAuthenticated ? `📊 ${t('nav.dashboard')} (${user?.role})` : `🔐 ${t('nav.login')}`}
            </button>
          </div>

          {/* Quick Lite Mode Info on Mobile */}
          <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>{language === 'mr' ? 'कमी रॅम / बॅटरी बचत मोड' : 'Low RAM & Battery Saver'}</span>
            </div>
            <button
              onClick={toggleLiteMode}
              className="px-2 py-0.5 rounded-md bg-amber-600 text-white font-bold text-[11px]"
            >
              {isLiteMode ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="text-xs font-bold text-agro-dark/70 mb-2">⚡ {t('nav.demoLogin')}:</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDemoSwitch('FARMER')}
                className="py-2.5 px-2 text-xs font-bold bg-emerald-50 active:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-center"
              >
                🌾 शेतकरी
              </button>
              <button
                onClick={() => handleDemoSwitch('FPO')}
                className="py-2.5 px-2 text-xs font-bold bg-emerald-50 active:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-center"
              >
                🏢 FPO
              </button>
              <button
                onClick={() => handleDemoSwitch('BUYER')}
                className="py-2.5 px-2 text-xs font-bold bg-emerald-50 active:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-center"
              >
                🛒 खरेदीदार
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
