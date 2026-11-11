'use client';

import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const enabled = featureFlags.enableMagneticButtons;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (clientX - centerX) * strength;
    const deltaY = (clientY - centerY) * strength;

    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const isFullWidth = className.includes('w-full');

  const content = enabled ? (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`relative will-change-transform ${isFullWidth ? 'w-full block' : 'inline-block'}`}
    >
      {children}
    </motion.div>
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
