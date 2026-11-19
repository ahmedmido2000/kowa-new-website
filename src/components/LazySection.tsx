'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  fallbackHeight?: number | string;
  rootMargin?: string;
  id?: string;
}

type ObserverCallback = (isIntersecting: boolean) => void;

let sharedObserver: IntersectionObserver | null = null;
const observerCallbacks = new Map<Element, ObserverCallback>();

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cb = observerCallbacks.get(entry.target);
            if (cb) {
              cb(true);
              observerCallbacks.delete(entry.target);
              sharedObserver?.unobserve(entry.target);
            }
          }
        }
      },
      { rootMargin: '150px' }
    );
  }
  return sharedObserver;
}

export const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallbackHeight = '300px',
  id,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = getSharedObserver();
    if (!observer) {
      setIsVisible(true);
      return;
    }

    observerCallbacks.set(el, (isIntersecting) => {
      if (isIntersecting) {
        setIsVisible(true);
      }
    });
    observer.observe(el);

    return () => {
      observerCallbacks.delete(el);
      observer.unobserve(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      style={!isVisible ? { minHeight: fallbackHeight } : undefined}
    >
      {isVisible ? children : null}
    </div>
  );
};
