import type { WebsiteConfigData, WebsiteSectionEnvelope } from '@/types/website-cms';

const SERVER_API_BASE = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://api.kowa.sa'
).replace(/\/+$/, '');

export async function getWebsiteConfigSafe(): Promise<WebsiteConfigData | null> {
  try {
    const res = await fetch(`${SERVER_API_BASE}/website/config?locale=all`, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 60, tags: ['website-config'] },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.warn(`[WebsiteCMS] Server API returned status ${res.status}`);
      return null;
    }
    const json = await res.json();
    return json?.data ?? null;
  } catch (error) {
    console.error('[WebsiteCMS] Failed to load /website/config:', error);
    return null;
  }
}

export async function getWebsiteSectionSafe<T = unknown>(
  key: string
): Promise<WebsiteSectionEnvelope<T> | null> {
  try {
    const res = await fetch(
      `${SERVER_API_BASE}/website/sections/${encodeURIComponent(key)}?locale=all`,
      {
        headers: {
          Accept: 'application/json',
        },
        next: { revalidate: 60, tags: [`website-section-${key}`] },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch (error) {
    console.error(`[WebsiteCMS] Failed to load section ${key}:`, error);
    return null;
  }
}
