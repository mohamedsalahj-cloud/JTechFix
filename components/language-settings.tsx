'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';

/**
 * Language Settings Component
 * Ensures proper RTL/LTR and language attribute handling across the entire app
 */
export function LanguageSettings() {
  const { language, dir } = useLanguage();

  useEffect(() => {
    // Apply language to HTML element
    document.documentElement.lang = language;
    
    // Apply text direction to HTML element
    document.documentElement.dir = dir;
    
    // Apply direction to body for consistency
    document.body.dir = dir;

    // Update page title based on language
    const appName = language === 'ar' 
      ? 'سوق تونس بي' 
      : language === 'fr'
      ? 'Marché Tunisie Pi'
      : 'Tunisia Pi Market';
    document.title = `${appName}`;

    // Apply text direction class for Tailwind
    if (dir === 'rtl') {
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }
  }, [language, dir]);

  return null;
}
