'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}

export default function TiltCard({
  children,
  className = '',
  maxTilt = 7,
  glare = true,
}: TiltCardProps) {
  const { featureFlags } = useWebsiteConfig();
  const cardRef = useRef<HTMLDivElement>(null);
  const [canTilt, setCanTilt] = useState(false);

  const rotateXMotion = useMotionValue(0);
  const rotateYMotion = useMotionValue(0);
  const glareXMotion = useMotionValue(50);
  const glareYMotion = useMotionValue(50);
  const glareOpacityMotion = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 180, mass: 0.1 };
  const rotateX = useSpring(rotateXMotion, springConfig);
  const rotateY = useSpring(rotateYMotion, springConfig);
  const glareOpacity = useSpring(glareOpacityMotion, { damping: 25, stiffness: 200 });

  useEffect(() => {
    const hoverQuery = window.matchMedia('(hover: hover)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateCapability = () => {
      setCanTilt(featureFlags.enable3DTiltCards && hoverQuery.matches && !motionQuery.matches);
    };

    updateCapability();
    hoverQuery.addEventListener('change', updateCapability);
    motionQuery.addEventListener('change', updateCapability);

    return () => {
      hoverQuery.removeEventListener('change', updateCapability);
      motionQuery.removeEventListener('change', updateCapability);
    };
  }, [featureFlags.enable3DTiltCards]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -maxTilt;
    const tiltY = ((x - centerX) / centerX) * maxTilt;

    rotateXMotion.set(tiltX);
    rotateYMotion.set(tiltY);

    if (glare) {
      glareXMotion.set((x / rect.width) * 100);
      glareYMotion.set((y / rect.height) * 100);
      glareOpacityMotion.set(1);
    }
  };

  const handleMouseLeave = () => {
    if (!canTilt) return;
    rotateXMotion.set(0);
    rotateYMotion.set(0);
    glareOpacityMotion.set(0);
  };

  if (!canTilt) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}

      {/* Dynamic Specular Glare Reflection */}
      {glare && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300"
          style={{
            opacity: glareOpacity,
            background: `radial-gradient(circle 320px at ${glareXMotion.get()}% ${glareYMotion.get()}%, rgba(56, 189, 248, 0.14), transparent 70%)`,
          }}
        />
      )}
    </motion.div>
  );
}
