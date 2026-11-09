'use client';

import React, { useRef, useState } from 'react';
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
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [, setIsHovered] = useState(false);

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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className="inline-block relative will-change-transform"
    >
      {children}
    </motion.div>
  );

  if (href) {
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
