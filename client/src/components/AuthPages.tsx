import React, { useState } from 'react';
import { useAuth, type UserRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { tEntity } from '../utils/translationHelper';
import { Sprout, Lock, Phone, ArrowRight } from 'lucide-react';

interface AuthPagesProps {
  initialMode?: 'login' | 'register';
  onSuccess: (role: UserRole) => void;
  onCancel: () => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialMode = 'login', onSuccess, onCancel }) => {
  const { login, register, quickDemoLogin } = useAuth();
  const { language, t } = useLanguage();
  const isMr = language === 'mr';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration form state (strictly basic profile info)
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [state] = useState('Maharashtra');
  
  // Specific role fields
  const [registrationNumber, setRegistrationNumber] = useState(''); // for FPO
  const [taluka] = useState('Junnar');
  const [companyName, setCompanyName] = useState(''); // for Buyer
  const [gstin, setGstin] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login({ email: loginEmail, password: loginPassword });
    setLoading(false);
    if (res.success) {
      const savedUser = JSON.parse(localStorage.getItem('agrovision_user') || '{}');
      onSuccess(savedUser.role || 'FARMER');
    } else {
      setError(
        isMr
          ? 'लॉगिन अयशस्वी झाले. कृपया ईमेल/मोबाईल आणि पासवर्ड तपासा.'
          : (res.error || 'Authentication failed. Please check your credentials.')
      );
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload: any = {
      role: selectedRole,
      name,
      mobile,
      email,
      password,
      district,
      state
    };

    if (selectedRole === 'FARMER') {
      payload.village = village;
      payload.taluka = taluka;
    } else if (selectedRole === 'FPO') {
      payload.registrationNumber = registrationNumber;
      payload.taluka = taluka;
    } else if (selectedRole === 'BUYER') {
      payload.companyName = companyName;
      payload.gstin = gstin;
    }

    const res = await register(payload);
    setLoading(false);
    if (res.success) {
      onSuccess(selectedRole);
    } else {
      setError(isMr ? 'नोंदणी अयशस्वी झाली.' : (res.error || 'Registration failed'));
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setLoading(true);
    await quickDemoLogin(role);
    setLoading(false);
    onSuccess(role);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-agro-light shadow-xl">
        {/* Top Brand & Mode Toggle */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-agro-mint text-agro-primary mb-3">
            <Sprout className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-extrabold text-agro-text">
            {mode === 'login'
              ? (isMr ? 'ऍग्रो व्हिजन लॉगिन' : 'Log in to AGRO VISION')
              : (isMr ? 'नवीन खाते नोंदणी' : 'Create Account')}
          </h2>
          <p className="text-xs text-agro-text/70 mt-1">
            {isMr
              ? 'शेतकरी • शेतकरी उत्पादक कंपनी (FPO) • अधिकृत खरेदीदार'
              : 'Farmer • FPO Intermediary • Verified Buyer'}
          </p>
        </div>

        {/* Quick Demo Switcher Bar */}
        <div className="p-3 rounded-2xl bg-agro-bg border border-agro-light mb-6">
          <div className="text-[11px] font-bold text-agro-dark mb-2 text-center">
            ⚡ {isMr ? 'त्वरित १-क्लिक चाचणीसाठी निवडा:' : 'Quick 1-Click Demo Login:'}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('FARMER')}
              className="py-1.5 px-2 rounded-xl text-xs font-bold bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 transition-all shadow-sm flex flex-col items-center"
            >
              <span>🌾 {isMr ? 'शेतकरी' : 'Farmer'}</span>
              <span className="text-[9px] text-gray-400 font-normal">{tEntity('Sopanrao', language)}</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('FPO')}
              className="py-1.5 px-2 rounded-xl text-xs font-bold bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 transition-all shadow-sm flex flex-col items-center"
            >
              <span>🏢 {isMr ? 'FPO संस्था' : 'FPO'}</span>
              <span className="text-[9px] text-gray-400 font-normal">{tEntity('Shivneri', language)}</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('BUYER')}
              className="py-1.5 px-2 rounded-xl text-xs font-bold bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 transition-all shadow-sm flex flex-col items-center"
            >
              <span>🛒 {isMr ? 'खरेदीदार' : 'Buyer'}</span>
              <span className="text-[9px] text-gray-400 font-normal">{tEntity('Sahyadri', language)}</span>
            </button>
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold mb-4 border border-red-200">
            {error}
          </div>
        )}

        {/* Tab switch between Login and Register */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-agro-dark shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t('nav.login')}
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-agro-dark shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t('nav.register')}
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-agro-text mb-1">
                {isMr ? 'मोबाईल नंबर किंवा ईमेल' : 'Mobile Number or Email'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder={isMr ? 'उदा. ९८२२०१२३४५ किंवा farmer@agrovision.in' : 'e.g. 9822012345 or farmer@agrovision.in'}
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-agro-primary focus:ring-1 focus:ring-agro-primary text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-agro-text mb-1">
                {isMr ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-agro-primary focus:ring-1 focus:ring-agro-primary text-sm outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-agro-primary hover:bg-agro-dark text-white font-bold text-sm shadow-md shadow-agro-primary/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? t('common.loading') : (isMr ? 'लॉगिन करा' : t('nav.login'))}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Stakeholder Role Selection */}
            <div>
              <label className="block text-xs font-bold text-agro-text mb-1.5">
                {isMr ? 'नोंदणी प्रकार (भूमिका)' : 'Select Your Stakeholder Role'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: 'FARMER' as UserRole, label: isMr ? '🌾 शेतकरी' : '🌾 Farmer' },
                  { role: 'FPO' as UserRole, label: isMr ? '🏢 FPO' : '🏢 FPO' },
                  { role: 'BUYER' as UserRole, label: isMr ? '🛒 खरेदीदार' : '🛒 Buyer' }
                ].map(r => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setSelectedRole(r.role)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
                      selectedRole === r.role
                        ? 'bg-agro-mint border-agro-primary text-agro-dark shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Identity Details */}
            <div>
              <label className="block text-xs font-bold text-agro-text mb-1">
                {selectedRole === 'BUYER' ? (isMr ? 'संपर्क व्यक्तीचे नाव' : 'Contact Person Name') : (isMr ? 'पूर्ण नाव' : 'Full Name')}
              </label>
              <input
                type="text"
                required
                placeholder={isMr ? 'उदा. सोपानराव पाटील' : 'e.g. Sopanrao Patil'}
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-agro-primary"
              />
            </div>

            {selectedRole === 'BUYER' && (
              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">
                  {isMr ? 'कंपनी / आस्थापनेचे नाव' : 'Company / Business Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isMr ? 'उदा. सह्याद्री फ्रेश होलसेल प्रा. लि.' : 'e.g. Sahyadri Fresh Wholesale Pvt Ltd'}
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-agro-primary"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">
                  {isMr ? 'मोबाईल नंबर' : 'Mobile Number'}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="9822012345"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-agro-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">
                  {isMr ? 'ईमेल (पर्यायी)' : 'Email (Optional)'}
                </label>
                <input
                  type="email"
                  placeholder="user@agrovision.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-agro-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-agro-text mb-1">
                {isMr ? 'पासवर्ड' : 'Password'}
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-agro-primary"
              />
            </div>

            {selectedRole === 'FARMER' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-agro-text mb-1">
                    {isMr ? 'गाव' : 'Village'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isMr ? 'उदा. ओतूर' : 'e.g. Otur'}
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-agro-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-agro-text mb-1">
                    {isMr ? 'जिल्हा' : 'District'}
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-agro-primary"
                  />
                </div>
              </div>
            )}

            {selectedRole === 'FPO' && (
              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">
                  {isMr ? 'FPO नोंदणी / CIN क्रमांक' : 'FPO Registration / CIN Number'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. U01409PN2018PTC178942"
                  value={registrationNumber}
                  onChange={e => setRegistrationNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-agro-primary"
                />
              </div>
            )}

            {selectedRole === 'BUYER' && (
              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">GSTIN / PAN</label>
                <input
                  type="text"
                  required
                  placeholder="27AABCS1429B1Z8"
                  value={gstin}
                  onChange={e => setGstin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-agro-primary"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-agro-primary hover:bg-agro-dark text-white font-bold text-sm shadow-md shadow-agro-primary/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? t('common.loading') : (isMr ? 'नोंदणी पूर्ण करा' : t('nav.register'))}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-gray-500 hover:text-agro-dark font-medium"
          >
            ← {isMr ? 'मुख्यपृष्ठावर परत जा' : 'Back to Homepage'}
          </button>
        </div>
      </div>
    </div>
  );
};
