'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';

export default function ScrollProgress() {
  const { featureFlags } = useWebsiteConfig();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (!featureFlags.enableScrollProgress) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 inset-x-0 h-[3.5px] bg-gradient-to-r from-brand via-[#3B1FB5] to-brand-lime z-[100] origin-right shadow-[0_0_12px_#D3D93C] pointer-events-none"
      style={{ scaleX }}
    />
  );
}
