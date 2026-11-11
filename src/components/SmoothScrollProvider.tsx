'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';

interface SmoothScrollContextType {
  getLenis: () => Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: Record<string, unknown>) => void;
  acquireScrollLock: () => () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  getLenis: () => null,
  scrollTo: () => {},
  acquireScrollLock: () => () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/**
 * Locks background page scroll (both Lenis and native document scroll) while a modal is open,
 * while allowing `data-lenis-prevent` scroll containers inside the modal to scroll natively.
 */
export function useModalScrollLock(isLocked: boolean) {
  const { acquireScrollLock } = useSmoothScroll();

  useEffect(() => {
    if (!isLocked) return;
    return acquireScrollLock();
  }, [isLocked, acquireScrollLock]);
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { featureFlags } = useWebsiteConfig();
  const lenisRef = useRef<Lenis | null>(null);
  const lockCountRef = useRef(0);
  const prevStylesRef = useRef<{
    htmlOverflow: string;
    bodyOverflow: string;
    htmlPaddingInlineEnd: string;
  } | null>(null);
  const enableSmoothScroll = featureFlags.enableSmoothScroll;

  const acquireScrollLock = useCallback(() => {
    if (typeof window === 'undefined') return () => {};

    if (lockCountRef.current === 0) {
      const html = document.documentElement;
      const body = document.body;
      const scrollbarWidth = window.innerWidth - html.clientWidth;

      prevStylesRef.current = {
        htmlOverflow: html.style.overflow,
        bodyOverflow: body.style.overflow,
        htmlPaddingInlineEnd: html.style.paddingInlineEnd,
      };

      if (scrollbarWidth > 0) {
        html.style.paddingInlineEnd = `${scrollbarWidth}px`;
      }
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      lenisRef.current?.stop();
    }

    lockCountRef.current += 1;
    let released = false;

    return () => {
      if (released) return;
      released = true;
      lockCountRef.current = Math.max(0, lockCountRef.current - 1);

      if (lockCountRef.current === 0 && typeof document !== 'undefined') {
        const html = document.documentElement;
        const body = document.body;
        const prev = prevStylesRef.current;
        if (prev) {
          html.style.overflow = prev.htmlOverflow;
          body.style.overflow = prev.bodyOverflow;
          html.style.paddingInlineEnd = prev.htmlPaddingInlineEnd;
          prevStylesRef.current = null;
        }
        lenisRef.current?.start();
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!enableSmoothScroll) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.05 : 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
      allowNestedScroll: true,
      wheelMultiplier: 1.25,
      touchMultiplier: 1.35,
      infinite: false,
    });

    lenisRef.current = lenis;

    if (lockCountRef.current > 0) {
      lenis.stop();
    }

    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, {
            offset: -80,
            duration: 0.9,
            easing: (t) => 1 - Math.pow(1 - t, 3),
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enableSmoothScroll]);

  const scrollTo = useCallback(
    (target: string | number | HTMLElement, options?: Record<string, unknown>) => {
      const performScroll = () => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target, {
            offset: -80,
            duration: 0.9,
            force: true,
            ...options,
          });
        } else if (typeof window !== 'undefined') {
          if (typeof target === 'number') {
            window.scrollTo({ top: target, behavior: enableSmoothScroll ? 'smooth' : 'auto' });
          } else if (typeof target === 'string') {
            const el = document.querySelector(target);
            if (el) el.scrollIntoView({ behavior: enableSmoothScroll ? 'smooth' : 'auto' });
          } else if (target instanceof HTMLElement) {
            target.scrollIntoView({ behavior: enableSmoothScroll ? 'smooth' : 'auto' });
          }
        }
      };

      // Defer one tick after a modal closes so body overflow and Lenis are unlocked first.
      if (lockCountRef.current > 0 && typeof window !== 'undefined') {
        requestAnimationFrame(() => requestAnimationFrame(performScroll));
        return;
      }

      performScroll();
    },
    [enableSmoothScroll]
  );

  return (
    <SmoothScrollContext.Provider
      value={{ getLenis: () => lenisRef.current, scrollTo, acquireScrollLock }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}
