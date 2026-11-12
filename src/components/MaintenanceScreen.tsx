'use client';

import React from 'react';
import Image from 'next/image';
import { Phone, Wrench, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import { ThemeToggle } from './ThemeToggle';
import {
  normalizeTelHref,
  normalizeWhatsappHref,
  resolveBackendLogoUrl,
} from '@/lib/cms-helpers';

export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { featureFlags, site, platform } = useWebsiteConfig();
  const { locale, isRtl, toggleLocale, pick, allowSwitch } = useLanguage();

  if (!featureFlags.maintenanceMode) {
    return <>{children}</>;
  }

  const logoSrc = resolveBackendLogoUrl(platform, site?.company?.headerLogoUrl);

  const companyName = pick(site?.company?.name, 'KOWA');
  const message = pick(
    featureFlags.maintenanceMessage,
    isRtl
      ? 'نقوم حالياً بأعمال تطوير وتحديث مجدولة لتحسين تجربتك. سنعود للخدمة خلال وقت قصير.'
      : 'We are currently performing scheduled improvements to serve you better. We will be back shortly.'
  );

  const hotline = platform?.hotline || site?.company?.hotline || '';
  const hotlineDisplay = platform?.hotlineDisplay || site?.company?.hotlineDisplay || hotline;
  const hotlineHref = normalizeTelHref(hotline);
  const whatsappHref = normalizeWhatsappHref(platform?.whatsapp, site?.socials || []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas text-ink px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl bg-card border border-line p-8 sm:p-10 shadow-elevated text-center space-y-6">
        <div className="flex items-center justify-between gap-3">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={companyName}
              width={120}
              height={40}
              unoptimized
              className="h-10 w-auto object-contain rounded-xl"
            />
          ) : (
            <span className="text-lg font-black text-ink">{companyName}</span>
          )}
          <div className="flex items-center gap-2">
            {featureFlags.enableThemeToggle && <ThemeToggle />}
            {allowSwitch && (
              <button
                type="button"
                onClick={toggleLocale}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line bg-elevated text-ink text-xs font-bold hover:border-brand transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-brand dark:text-brand-lime" />
                <span>{locale === 'ar' ? 'EN' : 'عربي'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="mx-auto w-16 h-16 rounded-2xl bg-brand/10 dark:bg-primary-solid/20 text-brand dark:text-brand-lime flex items-center justify-center">
          <Wrench className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex px-3 py-1 rounded-full bg-brand/10 dark:bg-brand-lime/20 text-brand dark:text-brand-lime text-xs font-extrabold">
            {isRtl ? 'وضع الصيانة المؤقت' : 'Scheduled Maintenance'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-ink">{companyName}</h1>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>

        {(hotlineHref || whatsappHref) && (
          <div className="pt-4 border-t border-line flex flex-wrap items-center justify-center gap-3">
            {hotlineHref && (
              <a
                href={hotlineHref}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark dark:bg-primary-solid text-white text-xs font-bold transition-colors"
                dir="ltr"
              >
                <Phone className="w-4 h-4" />
                <span>{hotlineDisplay}</span>
              </a>
            )}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                <span>{isRtl ? 'تواصل عبر واتساب' : 'WhatsApp Support'}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
