'use client';

import React, { useRef, useState, useCallback } from 'react';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  strength?: number;
  role?: string;
  'aria-label'?: string;
  as?: 'div' | 'button' | 'a';
}

export default function MagneticButton({
  children,
  className = '',
  href,
  target,
  rel,
  onClick,
  strength = 0.35,
  role,
  'aria-label': ariaLabel,
  as,
}: MagneticButtonProps) {
  const { featureFlags } = useWebsiteConfig();
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const enabled = featureFlags.enableMagneticButtons;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled || !ref.current) return;
      const { clientX, clientY } = e;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (clientX - centerX) * strength;
      const deltaY = (clientY - centerY) * strength;
      setOffset({ x: deltaX, y: deltaY });
      setIsHovered(true);
    },
    [enabled, strength]
  );

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const isFullWidth = className.includes('w-full');

  const content = enabled ? (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: isHovered
          ? 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)'
          : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      className={`relative will-change-transform ${isFullWidth ? 'w-full block' : 'inline-block'}`}
    >
      {children}
    </div>
  ) : (
    <div className={`relative ${isFullWidth ? 'w-full block' : 'inline-block'}`}>{children}</div>
  );

  if (as === 'div' || (!href && !onClick && as !== 'button')) {
    return (
      <div className={className} role={role} aria-label={ariaLabel}>
        {content}
      </div>
    );
  }

  if (href || as === 'a') {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={className}
        role={role}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={className}
      role={role}
      aria-label={ariaLabel}
      type="button"
    >
      {content}
    </button>
  );
}
