'use client';

import { Languages } from 'lucide-react';
import { useLanguage } from '@/context/LanguageProvider';

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        aria-label={language === 'ar' ? 'التبديل إلى English' : 'Switch to Arabic'}
        title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border-light bg-bg-card px-2.5 text-xs font-black text-text-primary transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
      >
        <Languages className="h-4 w-4 text-primary" />
        <span className="font-bold">{language === 'ar' ? 'ع' : 'EN'}</span>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Language Switcher"
      className="inline-flex items-center rounded-full border border-border-light bg-bg-card p-1 text-xs font-black shadow-sm"
    >
      <button
        type="button"
        onClick={() => setLanguage('ar')}
        aria-pressed={language === 'ar'}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all text-xs font-bold ${
          language === 'ar'
            ? 'bg-primary text-white shadow-sm font-black'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        العربية
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all text-xs font-bold ${
          language === 'en'
            ? 'bg-primary text-white shadow-sm font-black'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        English
      </button>
    </div>
  );
}
