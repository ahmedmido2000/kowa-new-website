import axios from 'axios';
import { cacheLife, cacheTag } from 'next/cache';
import type { WebsiteConfigData, WebsiteSectionEnvelope } from '@/types/website-cms';

const SERVER_API_BASE = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://api.kowa.sa'
).replace(/\/+$/, '');

const serverApi = axios.create({
  baseURL: SERVER_API_BASE,
  adapter: 'fetch',
  timeout: 20000,
  headers: {
    Accept: 'application/json',
  },
});

async function getWithRetry<T>(url: string, validateStatus?: (status: number) => boolean) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await serverApi.get<{ data: T }>(url, {
        params: { locale: 'all' },
        ...(validateStatus ? { validateStatus } : {}),
      });
    } catch (error) {
      lastError = error;
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }
  throw lastError;
}

export async function getWebsiteConfigCached(): Promise<WebsiteConfigData> {
  'use cache';
  cacheLife('minutes');
  cacheTag('website-config');

  const response = await getWithRetry<WebsiteConfigData>('/website/config');
  return response.data.data;
}

export async function getWebsiteConfigSafe(): Promise<WebsiteConfigData | null> {
  try {
    return await getWebsiteConfigCached();
  } catch (error) {
    console.error('[WebsiteCMS] Failed to load /website/config:', error);
    return null;
  }
}

export async function getWebsiteSectionCached<T = unknown>(
  key: string
): Promise<WebsiteSectionEnvelope<T> | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(`website-section-${key}`);

  const response = await getWithRetry<WebsiteSectionEnvelope<T>>(
    `/website/sections/${encodeURIComponent(key)}`,
    (status) => status === 200 || status === 404
  );

  if (response.status === 404) {
    return null;
  }

  return response.data.data;
}

export async function getWebsiteSectionSafe<T = unknown>(
  key: string
): Promise<WebsiteSectionEnvelope<T> | null> {
  try {
    return await getWebsiteSectionCached<T>(key);
  } catch (error) {
    console.error(`[WebsiteCMS] Failed to load section "${key}":`, error);
    return null;
  }
}
