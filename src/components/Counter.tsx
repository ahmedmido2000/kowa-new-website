'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function Counter({
  from = 0,
  to,
  duration = 2.2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: CounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: '-40px' });
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1] as const,
      onUpdate(value) {
        setDisplayValue(decimals > 0 ? parseFloat(value.toFixed(decimals)) : Math.round(value));
      },
    });
    return () => controls.stop();
  }, [isInView, from, to, duration, decimals]);

  const formattedNumber =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : displayValue.toLocaleString('en-US');

  return (
    <span ref={nodeRef} className={className} suppressHydrationWarning>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}
