'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useSmoothScroll } from './SmoothScrollProvider';
import { useLanguage } from '@/context/LanguageContext';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { scrollTo } = useSmoothScroll();
  const { isRtl } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }
      setIsVisible(currentScroll > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollTo(0, { duration: 1.2 });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          aria-label={isRtl ? 'الرجوع للأعلى' : 'Back to top'}
          className={`fixed bottom-6 ${
            isRtl ? 'right-6' : 'left-6'
          } z-40 w-12 h-12 rounded-full bg-white dark:bg-[#10182C] border border-neutral-200 dark:border-line text-neutral-900 dark:text-ink flex items-center justify-center shadow-elevated hover:border-brand-lime transition-colors group cursor-pointer`}
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
              stroke="#D3D93C"
              strokeWidth="2.5"
              strokeDasharray={125.6}
              strokeDashoffset={125.6 - (125.6 * scrollProgress) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-75"
            />
          </svg>
          <ArrowUp className="w-5 h-5 text-neutral-600 dark:text-ink-muted group-hover:text-brand dark:group-hover:text-brand-lime transition-colors" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
