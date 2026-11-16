'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type {
  WebsiteConfigData,
  WebsiteFeatureFlags,
  WebsitePlatformConfig,
  WebsiteSectionKey,
  WebsiteSectionsMap,
  WebsiteSiteConfig,
  WebsiteSiteSettings,
  WebsiteThemeTokens,
} from '@/types/website-cms';
import { fetchClientWebsiteConfig } from '@/lib/website-api';

export const DEFAULT_FEATURE_FLAGS: WebsiteFeatureFlags = {
  enableLanguageSwitch: true,
  enableThemeToggle: true,
  enableSmoothScroll: true,
  enableScrollProgress: true,
  enableBackToTop: true,
  enable3DTiltCards: true,
  enableMagneticButtons: true,
  enableSmsAppLink: true,
  maintenanceMode: false,
  maintenanceMessage: { ar: '', en: '' },
};

export const DEFAULT_THEME_TOKENS: WebsiteThemeTokens = {
  brandPrimary: '#1F0F8C',
  brandDark: '#140959',
  brandLimeAccent: '#38BDF8',
  darkCanvas: '#0A0F1D',
  darkCard: '#10182C',
  darkElevated: '#17223C',
  darkPrimarySolid: '#634EEB',
};

export const DEFAULT_SITE_SETTINGS: WebsiteSiteSettings = {
  defaultLocale: 'ar',
  defaultTheme: 'light',
  featureFlags: DEFAULT_FEATURE_FLAGS,
  themeTokens: DEFAULT_THEME_TOKENS,
};

interface WebsiteConfigContextValue {
  config: WebsiteConfigData | null;
  sections: WebsiteSectionsMap;
  site: WebsiteSiteConfig | null;
  platform: WebsitePlatformConfig | null;
  settings: WebsiteSiteSettings;
  featureFlags: WebsiteFeatureFlags;
  isSectionEnabled: (key: WebsiteSectionKey | string) => boolean;
  orderedSectionKeys: string[];
  refreshConfig: () => Promise<void>;
}

const WebsiteConfigContext = createContext<WebsiteConfigContextValue>({
  config: null,
  sections: {},
  site: null,
  platform: null,
  settings: DEFAULT_SITE_SETTINGS,
  featureFlags: DEFAULT_FEATURE_FLAGS,
  isSectionEnabled: () => false,
  orderedSectionKeys: [],
  refreshConfig: async () => {},
});

export function WebsiteConfigProvider({
  initialConfig,
  children,
}: {
  initialConfig: WebsiteConfigData | null;
  children: React.ReactNode;
}) {
  const [clientOverrideConfig, setClientOverrideConfig] = useState<WebsiteConfigData | null>(null);
  const config = clientOverrideConfig ?? initialConfig;

  useEffect(() => {
    let active = true;
    let isFetching = false;

    const syncFreshConfig = async () => {
      if (isFetching || !active) return;
      isFetching = true;
      try {
        const fresh = await fetchClientWebsiteConfig();
        if (!active || !fresh) return;

        setClientOverrideConfig((prev) => {
          const current = prev ?? initialConfig;
          if (current && JSON.stringify(current) === JSON.stringify(fresh)) {
            return prev;
          }
          return fresh;
        });
      } catch {
        // ignore network error
      } finally {
        isFetching = false;
      }
    };

    // Immediate sync on mount to catch any changes since prerender
    syncFreshConfig();

    // Re-sync immediately when window receives focus (e.g. user switches from admin dashboard tab)
    const handleFocus = () => {
      syncFreshConfig();
    };

    // Re-sync when document becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncFreshConfig();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Periodic live sync while tab is visible (every 10 seconds)
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        syncFreshConfig();
      }
    }, 10000);

    return () => {
      active = false;
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [initialConfig]);

  const refreshConfig = async () => {
    const fresh = await fetchClientWebsiteConfig();
    if (fresh) {
      setClientOverrideConfig(fresh);
    }
  };

  const value = useMemo<WebsiteConfigContextValue>(() => {
    const settings: WebsiteSiteSettings = {
      defaultLocale: config?.site?.settings?.defaultLocale || 'ar',
      defaultTheme: config?.site?.settings?.defaultTheme || 'light',
      featureFlags: {
        ...DEFAULT_FEATURE_FLAGS,
        ...(config?.site?.settings?.featureFlags || {}),
      },
      themeTokens: {
        ...DEFAULT_THEME_TOKENS,
        ...(config?.site?.settings?.themeTokens || {}),
      },
    };

    const sections = config?.sections || {};
    const orderList = config?.sectionsOrder || [];

    const orderedSectionKeys = [...orderList]
      .filter((item) => item.isEnabled && Boolean(sections[item.key as keyof WebsiteSectionsMap]))
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => item.key);

    const isSectionEnabled = (key: WebsiteSectionKey | string) => {
      const orderItem = orderList.find((item) => item.key === key);
      if (orderItem) {
        return orderItem.isEnabled && Boolean(sections[key as keyof WebsiteSectionsMap]);
      }
      return Boolean(sections[key as keyof WebsiteSectionsMap]);
    };

    return {
      config,
      sections,
      site: config?.site || null,
      platform: config?.platform || null,
      settings,
      featureFlags: settings.featureFlags,
      isSectionEnabled,
      orderedSectionKeys,
      refreshConfig,
    };
  }, [config]);

  return (
    <WebsiteConfigContext.Provider value={value}>{children}</WebsiteConfigContext.Provider>
  );
}

export function useWebsiteConfig() {
  return useContext(WebsiteConfigContext);
}
