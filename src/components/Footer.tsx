'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Headphones, Mail, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import {
  applyTemplateVars,
  isSafeHref,
  normalizeTelHref,
  normalizeWhatsappHref,
  resolveBackendLogoUrl,
  resolveLegalRouteFromLink,
} from '@/lib/cms-helpers';

interface FooterProps {
  hashBasePath?: string;
}

export const Footer: React.FC<FooterProps> = ({ hashBasePath = '' }) => {
  const { pick } = useLanguage();
  const { sections, site, platform } = useWebsiteConfig();

  const data = sections.footer;
  if (!data) return null;

  const toHref = (href: string | undefined, fallback = '#hero') => {
    const raw = (href || '').trim();
    const safe = isSafeHref(raw) ? raw : fallback;
    if (safe.startsWith('#') && hashBasePath) {
      return `${hashBasePath}${safe}`;
    }
    return safe;
  };

  const logoSrc = resolveBackendLogoUrl(platform, site?.company?.headerLogoUrl);

  const companyName = pick(site?.company?.name, 'KOWA');
  const fullCompanyName = pick(site?.company?.fullName);
  const aboutText = pick(site?.company?.about);
  const addressText = pick(platform?.address);
  const supportEmail = (platform?.supportEmail || '').trim();
  const whatsappHref = normalizeWhatsappHref(platform?.whatsapp, site?.socials || []);
  const whatsappDisplay =
    (platform?.whatsapp || '').trim() ||
    site?.socials?.find((s) => s.id === 'whatsapp')?.username ||
    '';

  const hotline = (platform?.hotline || site?.company?.hotline || '').trim();
  const hotlineDisplay = (
    platform?.hotlineDisplay ||
    site?.company?.hotlineDisplay ||
    hotline
  ).trim();
  const hotlineHref = normalizeTelHref(hotline);

  const tgaLabel = pick(site?.company?.tgaLabel);
  const tgaLicense = (site?.company?.tgaLicense || '').trim();
  const zatcaLabel = pick(site?.company?.zatcaLabel);

  const servicesLinks = (data.servicesColumn?.links || []).filter((l) => l.isEnabled !== false);
  const businessLinks = (data.businessColumn?.links || []).filter((l) => l.isEnabled !== false);
  const socials = (site?.socials || []).filter((s) => s.isEnabled !== false && isSafeHref(s.href));
  const legalLinks = (data.legalLinks || []).filter((l) => l.isEnabled !== false);

  const currentYear = 2026;
  const copyrightText = applyTemplateVars(pick(site?.company?.copyright), {
    year: currentYear,
    fullCompanyName,
  });

  const hasChannelsCard = Boolean(addressText || supportEmail || whatsappHref);

  return (
    <footer className="bg-white dark:bg-[#0A0F1D] border-t border-neutral-200 dark:border-line pt-16 pb-12 text-neutral-600 dark:text-ink-muted text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-200 dark:border-line">
          <div className="lg:col-span-2 text-right rtl:text-right ltr:text-left">
            <div className="flex items-center gap-3.5 mb-4">
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt={companyName}
                  width={48}
                  height={48}
                  unoptimized
                  className="h-12 w-auto max-w-[180px] object-contain rounded-xl shrink-0"
                />
              ) : null}
              <div>
                <span className="text-xl font-black text-neutral-900 dark:text-ink font-sans block">
                  {companyName}
                </span>
                {fullCompanyName ? (
                  <span className="text-[10px] text-neutral-400 dark:text-ink-subtle font-bold uppercase block">
                    {fullCompanyName}
                  </span>
                ) : null}
              </div>
            </div>

            {aboutText ? (
              <p className="text-neutral-500 dark:text-ink-muted leading-relaxed mb-6 max-w-sm">
                {aboutText}
              </p>
            ) : null}

            {hasChannelsCard ? (
              <div className="p-4 bg-neutral-50 dark:bg-[#10182C] border border-neutral-200 dark:border-line rounded-2xl space-y-2.5 max-w-sm mb-5 text-right rtl:text-right ltr:text-left">
                {addressText ? (
                  <div className="flex items-center gap-2 text-neutral-800 dark:text-ink font-semibold">
                    <MapPin className="w-4 h-4 text-brand dark:text-primary-token shrink-0" />
                    <span>{addressText}</span>
                  </div>
                ) : null}
                {supportEmail ? (
                  <div className="flex items-center gap-2 text-neutral-800 dark:text-ink font-semibold">
                    <Mail className="w-4 h-4 text-brand dark:text-primary-token shrink-0" />
                    <a
                      href={`mailto:${supportEmail}`}
                      className="hover:text-brand dark:hover:text-brand-lime transition font-en"
                    >
                      {supportEmail}
                    </a>
                  </div>
                ) : null}
                {whatsappHref ? (
                  <div className="flex items-center gap-2 text-neutral-800 dark:text-ink font-semibold">
                    <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-700 dark:hover:text-emerald-300 transition font-en"
                    >
                      WhatsApp{whatsappDisplay ? `: ${whatsappDisplay}` : ''}
                    </a>
                  </div>
                ) : null}
              </div>
            ) : null}

            {tgaLabel || zatcaLabel ? (
              <div className="p-3.5 bg-neutral-50 dark:bg-[#10182C] border border-neutral-200 dark:border-line rounded-2xl flex items-center gap-3 max-w-sm mb-4">
                <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-right rtl:text-right ltr:text-left">
                  {tgaLabel ? (
                    <div className="font-bold text-neutral-800 dark:text-ink">{tgaLabel}</div>
                  ) : null}
                  <div className="text-[11px] text-neutral-400 dark:text-ink-subtle">
                    {tgaLicense ? `TGA #${tgaLicense}` : ''}
                    {tgaLicense && zatcaLabel ? ' • ' : ''}
                    {zatcaLabel}
                  </div>
                </div>
              </div>
            ) : null}

            {hotlineHref && hotlineDisplay ? (
              <div className="flex items-center gap-2 text-neutral-800 dark:text-ink font-bold">
                <Headphones className="w-4 h-4 text-brand dark:text-primary-token shrink-0" />
                <span>{pick(data.hotlineLabel)}</span>
                <a
                  className="text-brand dark:text-brand-lime font-black font-en"
                  dir="ltr"
                  href={hotlineHref}
                >
                  {hotlineDisplay}
                </a>
              </div>
            ) : null}
          </div>

          {data.servicesColumn ? (
            <div className="text-right rtl:text-right ltr:text-left">
              <h4 className="font-black text-neutral-900 dark:text-ink uppercase tracking-wider mb-4">
                {pick(data.servicesColumn.title)}
              </h4>
              <ul className="space-y-2.5 text-neutral-500 dark:text-ink-muted font-medium">
                {servicesLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      className="hover:text-brand dark:hover:text-brand-lime transition"
                      href={toHref(link.href)}
                    >
                      {pick(link.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {data.businessColumn ? (
            <div className="text-right rtl:text-right ltr:text-left">
              <h4 className="font-black text-neutral-900 dark:text-ink uppercase tracking-wider mb-4">
                {pick(data.businessColumn.title)}
              </h4>
              <ul className="space-y-2.5 text-neutral-500 dark:text-ink-muted font-medium">
                {businessLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      className="hover:text-brand dark:hover:text-brand-lime transition"
                      href={toHref(link.href)}
                    >
                      {pick(link.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="text-right rtl:text-right ltr:text-left">
            <h4 className="font-black text-neutral-900 dark:text-ink uppercase tracking-wider mb-4">
              {pick(data.socialColumnTitle)}
            </h4>
            {socials.length > 0 ? (
              <ul className="space-y-2.5 text-neutral-500 dark:text-ink-muted font-medium mb-6">
                {socials.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand dark:hover:text-brand-lime transition flex items-center gap-2 group cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600 group-hover:bg-brand dark:group-hover:bg-brand-lime transition-colors" />
                      <span>{s.name}</span>
                      <span
                        dir="ltr"
                        className="text-[10px] text-neutral-400 dark:text-ink-subtle font-en rtl:mr-auto ltr:ml-auto"
                      >
                        {s.username}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {pick(data.socialNote) ? (
              <div className="p-3 bg-neutral-50 dark:bg-[#10182C] rounded-xl border border-neutral-200 dark:border-line">
                <span className="text-[11px] text-neutral-500 dark:text-ink-muted block leading-tight">
                  {pick(data.socialNote)}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-neutral-400 dark:text-ink-subtle">
          <div>{copyrightText}</div>
          {legalLinks.length > 0 ? (
            <div className="flex flex-wrap items-center gap-6 font-medium">
              {legalLinks.map((link) => {
                const resolvedHref = resolveLegalRouteFromLink(link);
                const label = pick(link.label);

                if (resolvedHref.startsWith('/legal/')) {
                  return (
                    <Link
                      key={link.id}
                      href={resolvedHref}
                      className="hover:text-brand dark:hover:text-brand-lime transition"
                    >
                      {label}
                    </Link>
                  );
                }

                return (
                  <a
                    key={link.id}
                    href={toHref(resolvedHref)}
                    className="hover:text-brand dark:hover:text-brand-lime transition"
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
};
