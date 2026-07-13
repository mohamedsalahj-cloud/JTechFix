'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Language } from '@/lib/translations';
import { t } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  // Initialize language from localStorage
  useEffect(() => {
    const saved = localStorage?.getItem('tayara-language') as Language | null;
    if (saved && ['en', 'ar', 'fr'].includes(saved)) {
      setLanguageState(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
    } else {
      // Detect browser language
      const browserLang = navigator.language?.split('-')[0];
      if (browserLang === 'ar' || browserLang === 'fr') {
        setLanguageState(browserLang as Language);
        document.documentElement.lang = browserLang;
        document.documentElement.dir = browserLang === 'ar' ? 'rtl' : 'ltr';
      }
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage?.setItem('tayara-language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const translate = (key: string) => t(key, language);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translate,
    dir,
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
