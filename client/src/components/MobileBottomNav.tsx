import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth, type UserRole } from '../context/AuthContext';
import {
  Home,
  TrendingUp,
  Sparkles,
  Calculator,
  User,
  X,
  ChevronRight
} from 'lucide-react';

interface MobileBottomNavProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onNavigate, currentView }) => {
  const { language } = useLanguage();
  const { user, isAuthenticated, quickDemoLogin } = useAuth();
  const [roleSheetOpen, setRoleSheetOpen] = useState(false);

  const handleNavClick = (sectionId?: string, targetView?: string) => {
    if (targetView) {
      onNavigate(targetView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        if (sectionId) {
          const el = document.getElementById(sectionId);
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (sectionId) {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleQuickRole = async (role: UserRole) => {
    setRoleSheetOpen(false);
    await quickDemoLogin(role);
    if (role === 'FARMER') onNavigate('farmer_dashboard');
    else if (role === 'FPO') onNavigate('fpo_dashboard');
    else if (role === 'BUYER') onNavigate('buyer_dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Fixed Bottom Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 border-t border-emerald-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-none"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 6px)' }}
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-5 h-14 items-center px-1">
          {/* 1. Home */}
          <button
            onClick={() => handleNavClick(undefined, 'home')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              currentView === 'home' ? 'text-agro-primary font-bold' : 'text-gray-500 hover:text-agro-dark'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">
              {language === 'mr' ? 'मुख्य' : 'Home'}
            </span>
          </button>

          {/* 2. Rates (Mandi Prices) */}
          <button
            onClick={() => handleNavClick('market-intelligence')}
            className="flex flex-col items-center justify-center h-full text-gray-500 hover:text-agro-primary transition-colors"
          >
            <TrendingUp className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">
              {language === 'mr' ? 'बाजारभाव' : 'Rates'}
            </span>
          </button>

          {/* 3. AI Quality Scan */}
          <button
            onClick={() => handleNavClick('ai-quality-hub')}
            className="flex flex-col items-center justify-center h-full text-gray-500 hover:text-agro-primary transition-colors"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 mb-0.5 text-emerald-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] leading-tight">
              {language === 'mr' ? 'प्रतवारी' : 'Scan'}
            </span>
          </button>

          {/* 4. Net Return Calculator */}
          <button
            onClick={() => handleNavClick('net-realisation-calculator')}
            className="flex flex-col items-center justify-center h-full text-gray-500 hover:text-agro-primary transition-colors"
          >
            <Calculator className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">
              {language === 'mr' ? 'निव्वळ नफा' : 'Profit'}
            </span>
          </button>

          {/* 5. Role / Dashboard Portal */}
          <button
            onClick={() => {
              if (isAuthenticated && user) {
                if (user.role === 'FARMER') onNavigate('farmer_dashboard');
                else if (user.role === 'FPO') onNavigate('fpo_dashboard');
                else if (user.role === 'BUYER') onNavigate('buyer_dashboard');
              } else {
                setRoleSheetOpen(true);
              }
            }}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              currentView.includes('dashboard') ? 'text-agro-primary font-bold' : 'text-gray-500 hover:text-agro-dark'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-agro-primary border border-emerald-200 flex items-center justify-center mb-0.5">
              <User className="w-4 h-4" />
            </div>
            <span className="text-[10px] leading-tight font-medium">
              {isAuthenticated ? (language === 'mr' ? 'खाते' : 'Profile') : (language === 'mr' ? 'डेमो' : 'Demo')}
            </span>
          </button>
        </div>
      </nav>

      {/* Role Picker Bottom Sheet (Mobile 1-tap quick login for test & use) */}
      {roleSheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/60 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-t-3xl p-5 shadow-2xl border-t border-emerald-200 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-250"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-base text-agro-text">
                  {language === 'mr' ? '⚡ १-टॅप थेट डेमो लॉगिन' : '⚡ 1-Tap Quick Demo Login'}
                </h3>
                <p className="text-xs text-gray-500">
                  {language === 'mr' ? 'पुणे जिल्ह्यातील भूमिका निवडा' : 'Select role (Pune Agricultural Cluster)'}
                </p>
              </div>
              <button
                onClick={() => setRoleSheetOpen(false)}
                className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {/* Farmer Demo */}
              <button
                onClick={() => handleQuickRole('FARMER')}
                className="w-full text-left p-3.5 rounded-2xl bg-emerald-50/80 active:bg-emerald-100 border border-emerald-200 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-sm">
                    🌾
                  </div>
                  <div>
                    <div className="font-bold text-sm text-emerald-950">
                      {language === 'mr' ? 'शेतकरी पोर्टल (Farmer)' : 'Farmer Portal'}
                    </div>
                    <div className="text-xs text-emerald-700">
                      सोपानराव पाटील (ओतूर, जुन्नर, पुणे)
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-emerald-700" />
              </button>

              {/* FPO Demo */}
              <button
                onClick={() => handleQuickRole('FPO')}
                className="w-full text-left p-3.5 rounded-2xl bg-teal-50/80 active:bg-teal-100 border border-teal-200 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center text-lg shadow-sm">
                    🏢
                  </div>
                  <div>
                    <div className="font-bold text-sm text-teal-950">
                      {language === 'mr' ? 'FPO संस्था पोर्टल (Intermediary)' : 'FPO Aggregator Portal'}
                    </div>
                    <div className="text-xs text-teal-700">
                      शिवनेरी शेतकरी उत्पादक कंपनी (नारायणगाव)
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-teal-700" />
              </button>

              {/* Buyer Demo */}
              <button
                onClick={() => handleQuickRole('BUYER')}
                className="w-full text-left p-3.5 rounded-2xl bg-blue-50/80 active:bg-blue-100 border border-blue-200 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg shadow-sm">
                    🛒
                  </div>
                  <div>
                    <div className="font-bold text-sm text-blue-950">
                      {language === 'mr' ? 'अधिकृत खरेदीदार (Verified Buyer)' : 'Institutional Buyer'}
                    </div>
                    <div className="text-xs text-blue-700">
                      सह्याद्री फ्रेश होलसेल सप्लायर्स
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-700" />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => { setRoleSheetOpen(false); onNavigate('login'); }}
                className="text-xs font-bold text-agro-dark hover:underline"
              >
                {language === 'mr' ? 'मोबाईल नंबरने लॉगिन' : 'Login with Mobile OTP'}
              </button>
              <button
                onClick={() => { setRoleSheetOpen(false); onNavigate('register'); }}
                className="text-xs font-bold text-agro-primary hover:underline"
              >
                {language === 'mr' ? 'नवीन नोंदणी करा' : 'Register New Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
