import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../locales/en.json';
import mrTranslations from '../locales/mr.json';

type Language = 'en' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (keyPath: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('agrovision_lang') as Language;
    return saved === 'mr' ? 'mr' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('agrovision_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'mr' : 'en'));
  };

  const t = (keyPath: string, fallback?: string): string => {
    const dictionary = language === 'mr' ? mrTranslations : enTranslations;
    const keys = keyPath.split('.');
    
    let current: any = dictionary;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English dictionary if key missing in Marathi
        let engFallback: any = enTranslations;
        for (const fKey of keys) {
          if (engFallback && typeof engFallback === 'object' && fKey in engFallback) {
            engFallback = engFallback[fKey];
          } else {
            return fallback || keyPath;
          }
        }
        return typeof engFallback === 'string' ? engFallback : (fallback || keyPath);
      }
    }
    return typeof current === 'string' ? current : (fallback || keyPath);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
