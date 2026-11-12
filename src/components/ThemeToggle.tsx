'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-10 h-10 rounded-xl border border-neutral-200 dark:border-line bg-neutral-100/60 dark:bg-card shrink-0 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative w-10 h-10 rounded-xl border border-neutral-200 dark:border-line bg-neutral-50 dark:bg-card hover:bg-neutral-100 dark:hover:bg-elevated text-neutral-600 dark:text-ink-muted hover:text-neutral-900 dark:hover:text-ink flex items-center justify-center transition-all duration-200 cursor-pointer shadow-subtle shrink-0 ${className}`}
      aria-label={
        isDark
          ? isAr
            ? 'التحويل إلى الوضع المضيء'
            : 'Switch to light mode'
          : isAr
          ? 'التحويل إلى الوضع الداكن'
          : 'Switch to dark mode'
      }
      title={
        isDark
          ? isAr
            ? 'التحويل إلى الوضع المضيء'
            : 'Switch to light mode'
          : isAr
          ? 'التحويل إلى الوضع الداكن'
          : 'Switch to dark mode'
      }
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-sky-300 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="w-4 h-4 text-neutral-700 transition-transform duration-300 rotate-0 scale-100" />
      )}
    </button>
  );
};
