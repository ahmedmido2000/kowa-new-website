'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe, Download, Menu, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import MagneticButton from '@/components/MagneticButton';
import { isSafeHref, resolveBackendLogoUrl } from '@/lib/cms-helpers';

interface HeaderProps {
  hashBasePath?: string;
}

export const Header: React.FC<HeaderProps> = ({ hashBasePath = '' }) => {
  const { locale, toggleLocale, allowSwitch, pick } = useLanguage();
  const { sections, site, platform, featureFlags } = useWebsiteConfig();
  const isAr = locale === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const data = sections.header;
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

  const brandTitle = pick(data.brandTitle, 'كـوا');
  const brandBadge = pick(data.brandBadge, 'KOWA');
  const brandTagline = pick(data.brandTagline, 'Smart Mobility & Fair Value');
  const navLinks = (data.navLinks || []).filter((item) => item.isEnabled !== false);
  const ctaHref = toHref(data.cta?.href, '#download-banner');
  const ctaLabel = pick(data.cta?.label, isAr ? 'تحميل التطبيق' : 'Get the App');
  const ctaMobileLabel = pick(data.cta?.mobileLabel, ctaLabel);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 bg-white/95 dark:bg-[#0C1222]/95 backdrop-blur-md border-b border-neutral-200 dark:border-line transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 lg:gap-8 flex-nowrap">
        <a className="flex items-center gap-3 group shrink-0 flex-nowrap" href={toHref('#hero')}>
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={brandBadge || 'KOWA Logo'}
              width={44}
              height={44}
              unoptimized
              className="h-10 sm:h-11 w-auto max-w-[160px] object-contain rounded-xl group-hover:scale-105 transition-transform duration-200 shrink-0"
              priority
            />
          ) : null}
          <div className="hidden sm:flex flex-col whitespace-nowrap shrink-0">
            <div className="flex items-center gap-1.5 flex-nowrap">
              <span className="text-2xl font-black tracking-tight text-neutral-900 dark:text-ink font-sans">
                {brandTitle}
              </span>
              {brandBadge ? (
                <span className="text-xs font-black tracking-wider text-brand dark:text-sky-300 font-en px-1.5 py-0.5 rounded bg-brand/5 dark:bg-sky-400/10 border border-brand/10 dark:border-sky-400/20">
                  {brandBadge}
                </span>
              ) : null}
            </div>
            {brandTagline ? (
              <span className="text-[10px] font-bold text-neutral-400 dark:text-ink-subtle tracking-wider uppercase">
                {brandTagline}
              </span>
            ) : null}
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 flex-nowrap whitespace-nowrap shrink-0">
          {navLinks.map((link, index) => {
            const label = pick(link.label);
            const badgeText =
              link.badge && link.badge.isEnabled !== false ? pick(link.badge.text) : '';
            const href = toHref(link.href);

            return (
              <a
                key={link.id || index}
                className={`${
                  index === 0
                    ? 'text-neutral-900 dark:text-ink font-bold'
                    : 'text-neutral-600 dark:text-ink-muted font-semibold'
                } text-sm hover:text-brand dark:hover:text-white transition flex items-center gap-1.5 flex-nowrap whitespace-nowrap shrink-0`}
                href={href}
              >
                <span>{label}</span>
                {badgeText ? (
                  <span className="bg-brand/10 dark:bg-white text-brand dark:text-brand border border-brand/20 dark:border-transparent text-[10px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                    {badgeText}
                  </span>
                ) : null}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-nowrap whitespace-nowrap">
          {featureFlags.enableThemeToggle ? <ThemeToggle /> : null}

          {allowSwitch ? (
            <button
              onClick={toggleLocale}
              className="inline-flex items-center gap-1.5 text-xs font-bold font-en text-neutral-600 dark:text-ink-muted hover:text-neutral-900 dark:hover:text-ink px-3 py-2 h-10 rounded-xl border border-neutral-200 dark:border-line bg-neutral-50 dark:bg-card hover:bg-neutral-100 dark:hover:bg-elevated transition shadow-subtle whitespace-nowrap shrink-0 cursor-pointer"
              type="button"
              title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Globe className="w-4 h-4 text-neutral-500 dark:text-ink-subtle shrink-0" />
              <span className="whitespace-nowrap">{isAr ? 'EN' : 'العربية'}</span>
            </button>
          ) : null}

          <div className="hidden sm:block">
            <MagneticButton strength={0.25} href={ctaHref}>
              <span className="inline-flex items-center justify-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl bg-brand dark:bg-primary-solid text-white hover:bg-brand-dark dark:hover:bg-brand shadow-sm hover:shadow-brand-glow transition-all duration-200 whitespace-nowrap cursor-pointer">
                <span className="whitespace-nowrap">{ctaLabel}</span>
                <Download className="w-4 h-4 text-white shrink-0" />
              </span>
            </MagneticButton>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-neutral-600 dark:text-ink-muted hover:text-neutral-900 dark:hover:text-ink hover:bg-neutral-100 dark:hover:bg-elevated transition shrink-0 cursor-pointer"
            aria-label="Toggle Navigation Menu"
            type="button"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="lg:hidden bg-white dark:bg-card border-b border-neutral-200 dark:border-line px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link, index) => {
              const label = pick(link.label);
              const badgeText =
                link.badge && link.badge.isEnabled !== false ? pick(link.badge.text) : '';
              const href = toHref(link.href);

              return (
                <a
                  key={link.id || index}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${
                    index === 0
                      ? 'text-neutral-900 dark:text-ink font-bold'
                      : 'text-neutral-600 dark:text-ink-muted font-semibold'
                  } text-sm p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-elevated flex items-center justify-between transition`}
                  href={href}
                >
                  <span>{label}</span>
                  {badgeText ? (
                    <span className="bg-brand/10 dark:bg-white text-brand dark:text-brand border border-brand/20 dark:border-transparent text-[10px] font-black px-2 py-0.5 rounded-full">
                      {badgeText}
                    </span>
                  ) : null}
                </a>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-neutral-100 dark:border-line flex flex-col gap-2.5">
            <a
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 px-4 rounded-xl bg-brand text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-brand-dark transition"
              href={ctaHref}
            >
              <span>{ctaMobileLabel}</span>
              <Download className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      ) : null}
    </motion.header>
  );
};
