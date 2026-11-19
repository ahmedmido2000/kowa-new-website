'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useSmoothScroll } from './SmoothScrollProvider';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';

export default function BackToTop() {
  const { featureFlags } = useWebsiteConfig();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { scrollTo } = useSmoothScroll();
  const { isRtl } = useLanguage();

  useEffect(() => {
    if (!featureFlags.enableBackToTop) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          const shouldShow = currentScroll > 350;
          setIsVisible(shouldShow);
          if (shouldShow) {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalScroll > 0) {
              setScrollProgress((currentScroll / totalScroll) * 100);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [featureFlags.enableBackToTop]);

  if (!featureFlags.enableBackToTop) {
    return null;
  }

  const scrollToTop = () => {
    scrollTo(0, { duration: 1.2 });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label={isRtl ? 'الرجوع للأعلى' : 'Back to top'}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={`fixed bottom-6 ${
        isRtl ? 'right-6' : 'left-6'
      } z-40 w-12 h-12 rounded-full bg-white dark:bg-[#10182C] border border-neutral-200 dark:border-line text-neutral-900 dark:text-ink flex items-center justify-center shadow-elevated hover:border-brand dark:hover:border-white transition-all duration-300 group cursor-pointer ${
        isVisible
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-75 translate-y-5 pointer-events-none'
      }`}
    >
      {/* Circular progress SVG */}
      <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5">
        <circle
          cx="22"
          cy="22"
          r="20"
          stroke="currentColor"
          className="text-neutral-200 dark:text-line"
          strokeWidth="2.5"
          fill="transparent"
        />
        <circle
          cx="22"
          cy="22"
          r="20"
          stroke="#2563EB"
          strokeWidth="2.5"
          strokeDasharray={125.6}
          strokeDashoffset={125.6 - (125.6 * scrollProgress) / 100}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-75"
        />
      </svg>

      <ArrowUp className="w-5 h-5 text-neutral-700 dark:text-ink group-hover:-translate-y-0.5 transition-transform relative z-10" />
    </button>
  );
}
