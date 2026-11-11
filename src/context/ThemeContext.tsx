'use client';

import React, { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  allowToggle: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
  allowToggle: true,
});

const THEME_EVENT = 'kowa:theme-change';

function subscribeThemeStore(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(THEME_EVENT, callback);
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(THEME_EVENT, callback);
    media.removeEventListener('change', callback);
  };
}

function getStoredThemeSnapshot(): Theme | null {
  try {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || saved === 'light' ? saved : null;
  } catch {
    return null;
  }
}

function getSystemDarkSnapshot(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, featureFlags } = useWebsiteConfig();
  const defaultTheme = settings.defaultTheme || 'light';
  const allowToggle = featureFlags.enableThemeToggle;

  const storedTheme = useSyncExternalStore<Theme | null>(
    subscribeThemeStore,
    getStoredThemeSnapshot,
    () => null
  );

  const systemPrefersDark = useSyncExternalStore<boolean>(
    subscribeThemeStore,
    getSystemDarkSnapshot,
    () => false
  );

  const fallbackTheme: Theme =
    defaultTheme === 'dark'
      ? 'dark'
      : defaultTheme === 'light'
        ? 'light'
        : systemPrefersDark
          ? 'dark'
          : 'light';

  const theme: Theme = allowToggle && storedTheme ? storedTheme : fallbackTheme;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (!allowToggle) return;
      try {
        localStorage.setItem('theme', newTheme);
        window.dispatchEvent(new Event(THEME_EVENT));
      } catch {
        // Graceful fallback
      }
    },
    [allowToggle]
  );

  const toggleTheme = useCallback(() => {
    if (!allowToggle) return;
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [allowToggle, setTheme, theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, allowToggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
