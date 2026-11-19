'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { toggleTheme } = useTheme();
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative w-10 h-10 rounded-xl border border-neutral-200 dark:border-line bg-neutral-50 dark:bg-card hover:bg-neutral-100 dark:hover:bg-elevated text-neutral-600 dark:text-ink-muted hover:text-neutral-900 dark:hover:text-ink flex items-center justify-center transition-all duration-200 cursor-pointer shadow-subtle shrink-0 ${className}`}
      aria-label={isAr ? 'تبديل المظهر الداكن والمضيء' : 'Toggle dark and light mode'}
      title={isAr ? 'تبديل المظهر الداكن والمضيء' : 'Toggle dark and light mode'}
    >
      <Sun className="w-4 h-4 text-sky-300 transition-transform duration-300 rotate-0 scale-100 hidden dark:block" />
      <Moon className="w-4 h-4 text-neutral-700 transition-transform duration-300 rotate-0 scale-100 block dark:hidden" />
    </button>
  );
};
