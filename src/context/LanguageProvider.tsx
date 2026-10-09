'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { translations, arToEnMap, Language } from '@/translations';

export { translations };
export type { Language };

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (value: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // English by default for demo presentation; restored from localStorage on mount
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('methqal-language');
      if (saved === 'ar' || saved === 'en') {
        setLanguageState(saved);
        document.documentElement.lang = saved;
        document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dataset.language = saved;
      } else {
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
        document.documentElement.dataset.language = 'en';
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      window.localStorage.setItem('methqal-language', newLang);
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dataset.language = newLang;
      // Trigger a window event so external components can react immediately if needed
      window.dispatchEvent(new CustomEvent('methqal:language-change', { detail: newLang }));
    } catch {
      // ignore
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  }, [language, setLanguage]);

  const t = useCallback((val: string): string => {
    if (!val || typeof val !== 'string') return '';
    const trimmed = val.trim();

    if (language === 'en') {
      // 1. Direct translation key match in English dictionary
      if (translations.en[trimmed] !== undefined) return translations.en[trimmed];
      if (translations.en[val] !== undefined) return translations.en[val];

      // 2. Recover from Arabic UI string using reverse dictionary
      if (arToEnMap[trimmed] !== undefined) return arToEnMap[trimmed];
      if (arToEnMap[val] !== undefined) return arToEnMap[val];

      // 3. If English mode, do not leak Arabic strings if they match an Arabic translation key
      if (/[\u0600-\u06FF]/.test(trimmed)) {
        if (translations.ar[trimmed] && arToEnMap[translations.ar[trimmed]]) {
          return arToEnMap[translations.ar[trimmed]];
        }
      }

      // Return the string (e.g. dynamic student name or English text)
      return val;
    }

    // language === 'ar'
    // 1. Direct translation key match in Arabic dictionary
    if (translations.ar[trimmed] !== undefined) return translations.ar[trimmed];
    if (translations.ar[val] !== undefined) return translations.ar[val];

    // 2. If already Arabic text, return as-is
    if (/[\u0600-\u06FF]/.test(val)) return val;

    // 3. Return key
    return translations.ar[trimmed] ?? translations.ar[val] ?? val;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    toggleLanguage,
    t,
  }), [language, setLanguage, toggleLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
