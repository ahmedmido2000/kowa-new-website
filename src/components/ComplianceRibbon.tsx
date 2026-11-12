'use client';

import React from 'react';
import { Phone, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import { normalizeTelHref } from '@/lib/cms-helpers';

export const ComplianceRibbon: React.FC = () => {
  const { pick } = useLanguage();
  const { sections, site, platform } = useWebsiteConfig();
  const data = sections.compliance_ribbon;

  if (!data) return null;

  const showZatca = data.showZatcaText ?? true;
  const showHotline = data.showHotline ?? true;
  const showGuarantee = data.showPriceGuarantee ?? true;

  const tgaText = pick(site?.company?.tgaLabel);
  const zatcaText = pick(site?.company?.zatcaLabel);
  const hotline = (platform?.hotline || site?.company?.hotline || '').trim();
  const hotlineDisplay = (
    platform?.hotlineDisplay ||
    site?.company?.hotlineDisplay ||
    hotline
  ).trim();
  const hotlineHref = normalizeTelHref(hotline);
  const guaranteeText = pick(data.priceGuarantee);

  return (
    <div className="bg-neutral-900 dark:bg-[#070B14] text-white text-xs py-2 px-4 border-b border-neutral-800 dark:border-line transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-white animate-pulse" />
          {tgaText ? (
            <span className="font-medium text-neutral-300 dark:text-ink-muted">{tgaText}</span>
          ) : null}
          {showZatca && zatcaText ? (
            <>
              {tgaText ? (
                <span className="text-neutral-600 dark:text-line-strong hidden sm:inline">•</span>
              ) : null}
              <span className="hidden sm:inline text-neutral-300 dark:text-ink-muted">
                {zatcaText}
              </span>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-5 text-neutral-300 dark:text-ink-muted">
          {showHotline && hotlineHref && hotlineDisplay ? (
            <a
              className="hover:text-brand-lime transition flex items-center gap-1.5 font-bold font-en text-[13px]"
              href={hotlineHref}
            >
              <Phone className="w-3.5 h-3.5 text-brand-lime" />
              <span dir="ltr">{hotlineDisplay}</span>
            </a>
          ) : null}

          {showHotline && hotlineHref && showGuarantee && guaranteeText ? (
            <span className="text-neutral-700 dark:text-line">|</span>
          ) : null}

          {showGuarantee && guaranteeText ? (
            <div className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{guaranteeText}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
