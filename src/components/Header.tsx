'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Globe, Download, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { locale, toggleLocale } = useLanguage();
  const isAr = locale === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0C1222]/95 backdrop-blur-md border-b border-neutral-200 dark:border-line transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 lg:gap-8 flex-nowrap">
        {/* Brand Link with Logo and Brand Navy Background */}
        <a className="flex items-center gap-3 group shrink-0 flex-nowrap" href="#hero">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#211583] dark:bg-[#1F0F8C] flex items-center justify-center p-2 shadow-sm shadow-[#211583]/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <Image
              src="/kowa-ik@4x.png"
              alt="KOWA Logo"
              width={36}
              height={28}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          {/* Brand Text: Hidden on mobile screens, visible on sm and up */}
          <div className="hidden sm:flex flex-col whitespace-nowrap shrink-0">
            <div className="flex items-center gap-1.5 flex-nowrap">
              <span className="text-2xl font-black tracking-tight text-neutral-900 dark:text-ink font-sans">
                كـوا
              </span>
              <span className="text-xs font-black tracking-wider text-brand dark:text-brand-lime font-en px-1.5 py-0.5 rounded bg-brand/5 dark:bg-brand-lime/10 border border-brand/10 dark:border-brand-lime/20">
                KOWA
              </span>
            </div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-ink-subtle tracking-wider uppercase">
              Smart Mobility &amp; Fair Value
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links (Nowrap) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 flex-nowrap whitespace-nowrap shrink-0">
          <a
            className="text-neutral-900 dark:text-ink font-bold text-sm hover:text-brand dark:hover:text-brand-lime transition whitespace-nowrap shrink-0"
            href="#hero"
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </a>
          <a
            className="text-neutral-600 dark:text-ink-muted font-semibold text-sm hover:text-brand dark:hover:text-brand-lime transition whitespace-nowrap shrink-0"
            href="#how-it-works"
          >
            {isAr ? 'كيف تعمل' : 'How It Works'}
          </a>
          <a
            className="text-neutral-600 dark:text-ink-muted font-semibold text-sm hover:text-brand dark:hover:text-brand-lime transition whitespace-nowrap shrink-0"
            href="#categories"
          >
            {isAr ? 'فئات الأسطول' : 'Fleet Categories'}
          </a>
          <a
            className="text-neutral-600 dark:text-ink-muted font-semibold text-sm hover:text-brand dark:hover:text-brand-lime transition flex items-center gap-1.5 flex-nowrap whitespace-nowrap shrink-0"
            href="#captain-earnings"
          >
            <span>{isAr ? 'انضم ككابتن' : 'Drive with Us'}</span>
            <span className="bg-brand-lime text-neutral-900 text-[10px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
              {isAr ? 'أرباح 9,500+' : 'Earn 9.5K+'}
            </span>
          </a>
          <a
            className="text-neutral-600 dark:text-ink-muted font-semibold text-sm hover:text-brand dark:hover:text-brand-lime transition whitespace-nowrap shrink-0"
            href="#faq"
          >
            {isAr ? 'الأسئلة الشائعة' : 'FAQ'}
          </a>
          <a
            className="text-neutral-600 dark:text-ink-muted font-semibold text-sm hover:text-brand dark:hover:text-brand-lime transition whitespace-nowrap shrink-0"
            href="#contact"
          >
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </a>
        </nav>

        {/* Action Buttons (Nowrap) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-nowrap whitespace-nowrap">
          {/* Dual Mode Theme Toggle */}
          <ThemeToggle />

          {/* Language Switch */}
          <button
            onClick={toggleLocale}
            className="inline-flex items-center gap-1.5 text-xs font-bold font-en text-neutral-600 dark:text-ink-muted hover:text-neutral-900 dark:hover:text-ink px-3 py-2 h-10 rounded-xl border border-neutral-200 dark:border-line bg-neutral-50 dark:bg-card hover:bg-neutral-100 dark:hover:bg-elevated transition shadow-subtle whitespace-nowrap shrink-0 cursor-pointer"
            type="button"
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-4 h-4 text-neutral-500 dark:text-ink-subtle shrink-0" />
            <span className="whitespace-nowrap">{isAr ? 'EN' : 'العربية'}</span>
          </button>

          {/* App CTA (Hidden on mobile, placed inside collapsed drawer) */}
          <a
            className="hidden sm:inline-flex items-center justify-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl bg-brand dark:bg-primary-solid text-white hover:bg-brand-dark dark:hover:bg-brand shadow-sm hover:shadow-brand-glow transition-all duration-200 whitespace-nowrap shrink-0"
            href="#download-banner"
          >
            <span className="whitespace-nowrap">{isAr ? 'تحميل التطبيق' : 'Get the App'}</span>
            <Download className="w-4 h-4 text-brand-lime shrink-0" />
          </a>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-neutral-600 dark:text-ink-muted hover:text-neutral-900 dark:hover:text-ink hover:bg-neutral-100 dark:hover:bg-elevated transition shrink-0 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-card border-b border-neutral-200 dark:border-line px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-1">
            <a
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-900 dark:text-ink font-bold text-sm p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-elevated transition"
              href="#hero"
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </a>
            <a
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-600 dark:text-ink-muted font-semibold text-sm p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-elevated transition"
              href="#how-it-works"
            >
              {isAr ? 'كيف تعمل' : 'How It Works'}
            </a>
            <a
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-600 dark:text-ink-muted font-semibold text-sm p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-elevated transition"
              href="#categories"
            >
              {isAr ? 'فئات الأسطول' : 'Fleet Categories'}
            </a>
            <a
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-600 dark:text-ink-muted font-semibold text-sm p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-elevated flex items-center justify-between transition"
              href="#captain-earnings"
            >
              <span>{isAr ? 'انضم ككابتن' : 'Drive with Us'}</span>
              <span className="bg-brand-lime text-neutral-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                {isAr ? 'أرباح 9,500+' : 'Earn 9.5K+'}
              </span>
            </a>
            <a
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-600 dark:text-ink-muted font-semibold text-sm p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-elevated transition"
              href="#faq"
            >
              {isAr ? 'الأسئلة الشائعة' : 'FAQ'}
            </a>
            <a
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-600 dark:text-ink-muted font-semibold text-sm p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-elevated transition"
              href="#contact"
            >
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </a>
          </nav>

          {/* App Install Button inside collapsed list for mobile */}
          <div className="pt-3 border-t border-neutral-100 dark:border-line flex flex-col gap-2.5">
            <a
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 px-4 rounded-xl bg-brand text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-brand-dark transition"
              href="#download-banner"
            >
              <span>{isAr ? 'تحميل التطبيق الآن' : 'Download the App Now'}</span>
              <Download className="w-4 h-4 text-brand-lime" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
