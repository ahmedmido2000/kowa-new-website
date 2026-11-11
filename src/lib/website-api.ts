import axios from 'axios';
import type {
  ContactSubmissionRequest,
  ContactSubmissionResponse,
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

const clientApi = axios.create({
  baseURL: CLIENT_API_BASE,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

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

function parseAxiosError(error: unknown, fallbackMessage: string): WebsiteApiError {
  if (!axios.isAxiosError(error)) {
    return new WebsiteApiError({
      message: error instanceof Error ? error.message : fallbackMessage,
      status: 0,
    });
  }

  const status = error.response?.status ?? 0;
  const payload =
    error.response?.data && typeof error.response.data === 'object'
      ? (error.response.data as Record<string, unknown>)
      : null;

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
    message: error.message || fallbackMessage,
    status,
    code,
  });
}

export async function fetchClientWebsiteConfig(): Promise<WebsiteConfigData | null> {
  try {
    const response = await clientApi.get<{ data: WebsiteConfigData }>('/website/config', {
      params: { locale: 'all' },
    });
    return response.data.data;
  } catch {
    return null;
  }
}

export async function fetchClientWebsiteSection<T = unknown>(
  key: string
): Promise<WebsiteSectionEnvelope<T> | null> {
  try {
    const response = await clientApi.get<{ data: WebsiteSectionEnvelope<T> }>(
      `/website/sections/${encodeURIComponent(key)}`,
      {
        params: { locale: 'all' },
      }
    );
    return response.data.data;
  } catch {
    return null;
  }
}

export async function submitContactInquiry(
  payload: ContactSubmissionRequest
): Promise<ContactSubmissionResponse> {
  try {
    const response = await clientApi.post<{ data: ContactSubmissionResponse }>(
      '/website/contact',
      payload
    );
    return response.data.data;
  } catch (error) {
    throw parseAxiosError(error, 'Contact submission failed');
  }
}

export async function requestAppLinkSms(
  payload: SmsAppLinkRequest
): Promise<SmsAppLinkResponse> {
  try {
    const response = await clientApi.post<{ data: SmsAppLinkResponse }>(
      '/website/app-link/sms',
      payload
    );
    return response.data.data;
  } catch (error) {
    throw parseAxiosError(error, 'SMS app link request failed');
  }
}
