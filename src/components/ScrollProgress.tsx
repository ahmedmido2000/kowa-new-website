'use client';

import React, { useEffect, useRef } from 'react';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';

export default function ScrollProgress() {
  const { featureFlags } = useWebsiteConfig();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!featureFlags.enableScrollProgress) return;
    const el = barRef.current;
    if (!el) return;

    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
        el.style.transform = `scaleX(${progress})`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [featureFlags.enableScrollProgress]);

  if (!featureFlags.enableScrollProgress) {
    return null;
  }

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed top-0 inset-x-0 h-[3.5px] bg-gradient-to-r from-brand via-[#2563EB] to-white z-[100] origin-right shadow-[0_0_12px_rgba(37,99,235,0.65)] pointer-events-none will-change-transform"
      style={{ transform: 'scaleX(0)' }}
    />
  );
}
