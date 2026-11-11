import type {
  FooterLegalLink,
  LocalizedText,
  Locale,
  WebsitePlatformConfig,
  WebsiteSocialChannel,
} from '@/types/website-cms';

export function pickText(
  value: LocalizedText | string | null | undefined,
  locale: Locale,
  fallback = ''
): string {
  if (!value) return fallback;
  if (typeof value === 'string') return value || fallback;
  const primary = value[locale]?.trim();
  if (primary) return value[locale];
  const secondaryLocale: Locale = locale === 'ar' ? 'en' : 'ar';
  const secondary = value[secondaryLocale]?.trim();
  if (secondary) return value[secondaryLocale];
  return fallback;
}

export function applyTemplateVars(
  template: string,
  vars: Record<string, string | number | undefined | null>
): string {
  return Object.entries(vars).reduce((acc, [key, val]) => {
    const safeVal = val == null ? '' : String(val);
    return acc.replaceAll(`{{${key}}}`, safeVal);
  }, template);
}

const LEGAL_KEY_BY_LEGACY_CONTENT_KEY: Record<string, string> = {
  terms_and_conditions: 'legal_terms',
  privacy_policy: 'legal_privacy',
  passenger_rights: 'legal_passenger_rights',
  legal_terms: 'legal_terms',
  legal_privacy: 'legal_privacy',
  legal_passenger_rights: 'legal_passenger_rights',
};

const LEGAL_KEY_BY_ID: Record<string, string> = {
  terms: 'legal_terms',
  privacy: 'legal_privacy',
  'passenger-rights': 'legal_passenger_rights',
  passenger_rights: 'legal_passenger_rights',
};

const ROUTE_BY_LEGAL_KEY: Record<string, string> = {
  legal_terms: '/legal/terms',
  legal_privacy: '/legal/privacy',
  legal_passenger_rights: '/legal/passenger-rights',
};

export type LegalSlug = 'terms' | 'privacy' | 'passenger-rights';

const BLOCK_KEY_BY_SLUG: Record<string, string> = {
  terms: 'legal_terms',
  privacy: 'legal_privacy',
  'passenger-rights': 'legal_passenger_rights',
};

export function resolveLegalBlockKey(slug: string): string | null {
  return BLOCK_KEY_BY_SLUG[slug] ?? null;
}

export function resolveLegalRouteFromLink(
  link: Pick<FooterLegalLink, 'id' | 'href' | 'contentKey'>
): string {
  const mappedKey =
    (link.contentKey ? LEGAL_KEY_BY_LEGACY_CONTENT_KEY[link.contentKey] : undefined) ||
    LEGAL_KEY_BY_ID[link.id];

  if (mappedKey && ROUTE_BY_LEGAL_KEY[mappedKey]) {
    if (!link.href || link.href === '#hero' || link.href === '#') {
      return ROUTE_BY_LEGAL_KEY[mappedKey];
    }
  }

  return isSafeHref(link.href) ? link.href : '#hero';
}

export function isSafeHref(href: string | null | undefined): boolean {
  if (!href) return false;
  const trimmed = href.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) return true;
  try {
    const parsed = new URL(trimmed);
    return (
      parsed.protocol === 'https:' ||
      parsed.protocol === 'http:' ||
      parsed.protocol === 'mailto:' ||
      parsed.protocol === 'tel:'
    );
  } catch {
    return false;
  }
}

export function hexToRgbTriplet(hex: string | null | undefined): string | null {
  if (!hex) return null;
  const clean = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export function normalizeWhatsappHref(
  platformWhatsapp: string | null | undefined,
  socials: WebsiteSocialChannel[] = []
): string | null {
  const cleaned = (platformWhatsapp || '').trim();
  if (cleaned) {
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      return isSafeHref(cleaned) ? cleaned : null;
    }
    const digits = cleaned.replace(/[^\d]/g, '');
    if (digits) return `https://wa.me/${digits}`;
  }
  const socialWa = socials.find((s) => s.id === 'whatsapp' && s.isEnabled && isSafeHref(s.href));
  return socialWa ? socialWa.href : null;
}

export function normalizeTelHref(phone: string | null | undefined): string | null {
  const cleaned = (phone || '').trim();
  if (!cleaned) return null;
  const normalized = cleaned.replace(/[^\d+]/g, '');
  return normalized ? `tel:${normalized}` : null;
}

/**
 * Resolves the site/header logo URL strictly from backend platform/company settings without static fallbacks.
 */
export function resolveBackendLogoUrl(
  platform: Pick<WebsitePlatformConfig, 'headerLogoUrl' | 'siteLogoUrl'> | null | undefined,
  companyHeaderLogoUrl?: string | null
): string | null {
  const candidates = [platform?.headerLogoUrl, companyHeaderLogoUrl, platform?.siteLogoUrl];
  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (trimmed && isSafeHref(trimmed)) {
      return trimmed;
    }
  }
  return null;
}
