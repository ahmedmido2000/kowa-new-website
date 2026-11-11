'use client';

import React, { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react';
import type { Locale, LocalizedText } from '@/types/website-cms';
import { pickText } from '@/lib/cms-helpers';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  isRtl: boolean;
  allowSwitch: boolean;
  pick: (value: LocalizedText | string | null | undefined, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'ar',
  setLocale: () => {},
  toggleLocale: () => {},
  isRtl: true,
  allowSwitch: true,
  pick: (value, fallback = '') => pickText(value, 'ar', fallback),
});

const LOCALE_EVENT = 'kowa:locale-change';

function subscribeLocaleStore(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(LOCALE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(LOCALE_EVENT, callback);
  };
}

function getLocaleSnapshot(): Locale | null {
  try {
    const saved = localStorage.getItem('kowa_locale');
    return saved === 'ar' || saved === 'en' ? saved : null;
  } catch {
    return null;
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, featureFlags } = useWebsiteConfig();
  const defaultLocale: Locale = settings.defaultLocale === 'en' ? 'en' : 'ar';
  const allowSwitch = featureFlags.enableLanguageSwitch;

  const storedLocale = useSyncExternalStore<Locale | null>(
    subscribeLocaleStore,
    getLocaleSnapshot,
    () => null
  );

  const locale: Locale = allowSwitch && storedLocale ? storedLocale : defaultLocale;

  useEffect(() => {
    document.documentElement.setAttribute('lang', locale);
    document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  }, [locale]);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (!allowSwitch) return;
      try {
        localStorage.setItem('kowa_locale', newLocale);
        window.dispatchEvent(new Event(LOCALE_EVENT));
      } catch {
        // Ignore storage write failures
      }
    },
    [allowSwitch]
  );

  const toggleLocale = useCallback(() => {
    if (!allowSwitch) return;
    setLocale(locale === 'ar' ? 'en' : 'ar');
  }, [allowSwitch, locale, setLocale]);

  const pick = useCallback(
    (value: LocalizedText | string | null | undefined, fallback = '') =>
      pickText(value, locale, fallback),
    [locale]
  );

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, toggleLocale, isRtl: locale === 'ar', allowSwitch, pick }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
