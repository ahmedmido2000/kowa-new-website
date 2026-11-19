import type {
  ContactSubmissionRequest,
  ContactSubmissionResponse,
  EstimateFareRequest,
  EstimateFareResponse,
  FareCalculatorCategoriesResponse,
  LocalizedText,
  Locale,
  SmsAppLinkRequest,
  SmsAppLinkResponse,
  WebsiteConfigData,
  WebsiteSectionEnvelope,
} from '@/types/website-cms';

const CLIENT_API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.kowa.sa'
).replace(/\/+$/, '');

export function getClientApiBaseUrl(): string {
  return CLIENT_API_BASE;
}

export class WebsiteApiError extends Error {
  status: number;
  code?: string;
  messages?: string[];
  localizedMessage?: LocalizedText;

  constructor(options: {
    message: string;
    status: number;
    code?: string;
    messages?: string[];
    localizedMessage?: LocalizedText;
  }) {
    super(options.message);
    this.name = 'WebsiteApiError';
    this.status = options.status;
    this.code = options.code;
    this.messages = options.messages;
    this.localizedMessage = options.localizedMessage;
  }

  getDisplayMessage(locale: Locale): string {
    if (this.localizedMessage) {
      const text =
        this.localizedMessage[locale]?.trim() ||
        this.localizedMessage.ar ||
        this.localizedMessage.en;
      if (text) return text;
    }
    if (this.messages && this.messages.length > 0) {
      return this.messages.join(' • ');
    }
    return this.message;
  }
}

function parseFetchError(error: unknown, fallbackMessage: string, status = 0, payload?: Record<string, unknown> | null): WebsiteApiError {
  const code = typeof payload?.code === 'string' ? payload.code : undefined;
  const rawMessage = payload?.message;

  if (Array.isArray(rawMessage)) {
    const messages = rawMessage.filter((item): item is string => typeof item === 'string');
    return new WebsiteApiError({
      message: messages[0] || fallbackMessage,
      status,
      code,
      messages,
    });
  }

  if (rawMessage && typeof rawMessage === 'object' && ('ar' in rawMessage || 'en' in rawMessage)) {
    const msgObj = rawMessage as Partial<LocalizedText>;
    const localizedMessage: LocalizedText = {
      ar: typeof msgObj.ar === 'string' ? msgObj.ar : '',
      en: typeof msgObj.en === 'string' ? msgObj.en : '',
    };
    return new WebsiteApiError({
      message: localizedMessage.en || localizedMessage.ar || fallbackMessage,
      status,
      code,
      localizedMessage,
    });
  }

  if (typeof rawMessage === 'string' && rawMessage.trim()) {
    return new WebsiteApiError({
      message: rawMessage,
      status,
      code,
    });
  }

  return new WebsiteApiError({
    message: error instanceof Error ? error.message : fallbackMessage,
    status,
    code,
  });
}

export function isRequestAbortedError(error: unknown): boolean {
  if (error instanceof Error && (error.name === 'AbortError' || error.name === 'CanceledError')) {
    return true;
  }
  return false;
}

interface RequestOptions {
  method?: string;
  params?: Record<string, string | number | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
}

async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let url = `${CLIENT_API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  if (options.params) {
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(options.params)) {
      if (v !== undefined && v !== null) {
        search.set(k, String(v));
      }
    }
    const query = search.toString();
    if (query) {
      url += (url.includes('?') ? '&' : '?') + query;
    }
  }

  const timeoutMs = options.timeout ?? 15000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const combinedSignal = options.signal
    ? (typeof AbortSignal.any === 'function'
        ? AbortSignal.any([options.signal, controller.signal])
        : options.signal)
    : controller.signal;

  try {
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: combinedSignal,
    });

    clearTimeout(timeoutId);

    const isJson = res.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await res.json() : null;

    if (!res.ok) {
      throw parseFetchError(
        new Error(`HTTP error ${res.status}`),
        `Request failed with status ${res.status}`,
        res.status,
        data
      );
    }

    return (data?.data !== undefined ? data.data : data) as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (isRequestAbortedError(error)) {
      throw error;
    }
    if (error instanceof WebsiteApiError) {
      throw error;
    }
    throw parseFetchError(error, 'Network request failed');
  }
}

export async function fetchClientWebsiteConfig(): Promise<WebsiteConfigData | null> {
  try {
    return await requestJson<WebsiteConfigData>('/website/config', {
      params: {
        locale: 'all',
        _t: Date.now(),
      },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
      timeout: 10000,
    });
  } catch {
    return null;
  }
}

export async function fetchClientWebsiteSection<T = unknown>(
  key: string
): Promise<WebsiteSectionEnvelope<T> | null> {
  try {
    return await requestJson<WebsiteSectionEnvelope<T>>(
      `/website/sections/${encodeURIComponent(key)}`,
      {
        params: {
          locale: 'all',
          _t: Date.now(),
        },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
        timeout: 10000,
      }
    );
  } catch {
    return null;
  }
}

export async function submitContactInquiry(
  payload: ContactSubmissionRequest
): Promise<ContactSubmissionResponse> {
  return await requestJson<ContactSubmissionResponse>('/website/contact', {
    method: 'POST',
    body: payload,
    timeout: 15000,
  });
}

export async function requestAppLinkSms(
  payload: SmsAppLinkRequest
): Promise<SmsAppLinkResponse> {
  return await requestJson<SmsAppLinkResponse>('/website/app-link/sms', {
    method: 'POST',
    body: payload,
    timeout: 15000,
  });
}

export async function fetchFareCalculatorCategories(
  params: {
    pickupLatitude: number;
    pickupLongitude: number;
    locale?: Locale | 'all';
  },
  signal?: AbortSignal
): Promise<FareCalculatorCategoriesResponse> {
  return await requestJson<FareCalculatorCategoriesResponse>(
    '/website/fare-calculator/categories',
    {
      params: {
        pickupLatitude: Number(params.pickupLatitude),
        pickupLongitude: Number(params.pickupLongitude),
        locale: params.locale ?? 'all',
      },
      signal,
      timeout: 15000,
    }
  );
}

export async function estimateWebsiteTripFare(
  payload: EstimateFareRequest,
  signal?: AbortSignal
): Promise<EstimateFareResponse> {
  const body: EstimateFareRequest = {
    pickup: {
      latitude: Number(payload.pickup.latitude),
      longitude: Number(payload.pickup.longitude),
    },
    destination: {
      latitude: Number(payload.destination.latitude),
      longitude: Number(payload.destination.longitude),
    },
    deliveryCategoryId: payload.deliveryCategoryId,
  };
  return await requestJson<EstimateFareResponse>(
    '/website/trips/estimate-fare',
    {
      method: 'POST',
      body,
      signal,
      timeout: 15000,
    }
  );
}
