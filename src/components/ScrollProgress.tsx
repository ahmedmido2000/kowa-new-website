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
      className="fixed top-0 inset-x-0 h-[3.5px] bg-gradient-to-r from-brand via-[#2563EB] to-white z-[100] origin-right shadow-[0_0_12px_rgba(37,99,235,0.65)] pointer-events-none"
      style={{ scaleX }}
    />
  );
}
