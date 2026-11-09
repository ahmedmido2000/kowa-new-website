'use client';

import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

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
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
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

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`relative will-change-transform ${isFullWidth ? 'w-full block' : 'inline-block'}`}
    >
      {children}
    </motion.div>
  );

  // If explicit 'div' requested or neither href nor onClick is passed, render a div wrapper
  if (as === 'div' || (!href && !onClick && as !== 'button')) {
    return (
      <div className={className} role={role} aria-label={ariaLabel}>
        {content}
      </div>
    );
  }

  // If href is present or 'a' requested
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

  // Fallback to button only when onClick is explicitly provided and as !== 'div'
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
