'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import MagneticButton from './MagneticButton';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Download,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';

const AMBIENT_EMBERS = [
  { id: 1, left: '12%', delay: 0, duration: 7.5, size: 3.5 },
  { id: 2, left: '28%', delay: 1.4, duration: 9, size: 2.5 },
  { id: 3, left: '46%', delay: 2.8, duration: 6.8, size: 4 },
  { id: 4, left: '68%', delay: 0.9, duration: 8.5, size: 2.5 },
  { id: 5, left: '84%', delay: 2.1, duration: 7.8, size: 3 },
  { id: 6, left: '55%', delay: 3.6, duration: 8.2, size: 2.5 },
];

export const HeroSection: React.FC = () => {
  const { locale, isRtl } = useLanguage();
  const isAr = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Subtle interactive mouse-tracking parallax on Hero background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 140, mass: 0.1 };
  const bgX = useSpring(mouseX, springConfig);
  const bgY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === 'undefined') return;
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const factorX = (clientX - centerX) / centerX;
    const factorY = (clientY - centerY) / centerY;
    mouseX.set(factorX * -18);
    mouseY.set(factorY * -12);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[86vh] lg:min-h-[92vh] flex items-center pt-16 pb-20 sm:pt-20 sm:pb-24 overflow-hidden bg-[#0A0F1D] text-white border-b border-brand/30 dark:border-line select-none"
    >
      {/* Bespoke KOWA Branded Background Image with Smooth Parallax */}
      <motion.div
        style={{ x: bgX, y: bgY, scale: 1.06 }}
        className="absolute inset-0 z-0 will-change-transform pointer-events-none"
      >
        <div className={`relative w-full h-full ${!isRtl ? '-scale-x-100' : ''}`}>
          <Image
            src="/hero-bg-kowa.jpg"
            alt={
              isAr
                ? 'سيارة كوا التنفيذية الفاخرة على طريق الرياض ليلاً'
                : 'KOWA luxury executive vehicle gliding through Riyadh at night'
            }
            fill
            priority
            className="object-cover object-center sm:object-[25%_center]"
            sizes="100vw"
          />
        </div>

        {/* Multi-layer Atmospheric Overlays matching KOWA Midnight Navy & Indigo palette */}
        <div className="absolute inset-0 bg-[#0A0F1D]/45 lg:bg-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1D]/70 via-[#0A0F1D]/25 to-[#0A0F1D]/90" />
        <div
          className={`absolute inset-0 ${
            isRtl
              ? 'bg-gradient-to-l from-[#0A0F1D]/95 via-[#0A0F1D]/65 to-transparent'
              : 'bg-gradient-to-r from-[#0A0F1D]/95 via-[#0A0F1D]/65 to-transparent'
          }`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(31,15,140,0.42),transparent_65%)]" />
      </motion.div>

      {/* Subtle Floating Electric-Lime Atmospheric Embers */}
      {AMBIENT_EMBERS.map((ember) => (
        <motion.div
          key={ember.id}
          initial={{ y: '100%', opacity: 0, x: 0 }}
          animate={{
            y: '-30%',
            opacity: [0, 0.55, 0.75, 0],
            x: [0, 12, -12, 0],
          }}
          transition={{
            duration: ember.duration,
            repeat: Infinity,
            delay: ember.delay,
            ease: 'easeInOut',
          }}
          style={{
            left: ember.left,
            width: ember.size,
            height: ember.size,
          }}
          aria-hidden="true"
          className="absolute bottom-0 rounded-full bg-brand-lime pointer-events-none blur-[0.8px] shadow-[0_0_10px_#D3D93C] z-[1]"
        />
      ))}

      {/* Subtle Orbital Kinetic Energy Streams in KOWA Brand Colors */}
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full opacity-45 pointer-events-none z-[2]"
      >
        <defs>
          <linearGradient id="kowaStreamGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#1F0F8C" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#634EEB" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D3D93C" stopOpacity="1" />
          </linearGradient>
          <filter id="kowaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g fill="none" stroke="url(#kowaStreamGrad)" strokeLinecap="round">
          <path
            d="M 135.9 449.8 C 158.7 509.1, 340.1 494.6, 541.2 417.4 C 742.3 340.2, 886.9 229.5, 864.1 170.2 C 841.3 110.9, 659.9 125.4, 458.8 202.6 C 257.7 279.8, 113.1 390.5, 135.9 449.8 Z"
            strokeWidth="1.2"
            opacity="0.16"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 70.6 474.8 C 105.2 565.1, 325.5 564.4, 562.7 473.4 C 799.9 382.3, 964.1 235.4, 929.4 145.2 C 894.8 54.9, 674.5 55.6, 437.3 146.6 C 200.1 237.7, 35.9 384.6, 70.6 474.8 Z"
            strokeWidth="1.2"
            opacity="0.14"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="st"
            pathLength="1"
            d="M 135.9 449.8 C 158.7 509.1, 340.1 494.6, 541.2 417.4 C 742.3 340.2, 886.9 229.5, 864.1 170.2 C 841.3 110.9, 659.9 125.4, 458.8 202.6 C 257.7 279.8, 113.1 390.5, 135.9 449.8 Z"
            strokeWidth="3.5"
            filter="url(#kowaGlow)"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="st st2"
            pathLength="1"
            d="M 70.6 474.8 C 105.2 565.1, 325.5 564.4, 562.7 473.4 C 799.9 382.3, 964.1 235.4, 929.4 145.2 C 894.8 54.9, 674.5 55.6, 437.3 146.6 C 200.1 237.7, 35.9 384.6, 70.6 474.8 Z"
            strokeWidth="3"
            filter="url(#kowaGlow)"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>

      {/* Main Hero Content aligned cleanly inside dark negative space */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start gap-6 text-right rtl:text-right ltr:text-left"
          >
            {/* Brand Pill Badge */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand/30 border border-brand-lime/40 backdrop-blur-md shadow-sm cursor-default"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-brand-lime animate-ping" />
              <span className="text-brand-lime font-extrabold text-xs sm:text-sm tracking-wide">
                {isAr
                  ? 'المنصة الوطنية الرائدة للتنقل الذكي الفاخر بالمملكة'
                  : 'Saudi Arabia’s Leading Smart Luxury Mobility Platform'}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-brand-lime shrink-0" />
            </motion.div>

            {/* Cinematic Main H1 Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.25] tracking-tight"
            >
              {isAr ? (
                <>
                  ارتقِ بتجربة تنقلك..
                  <span className="block mt-2">
                    <span className="text-brand-lime text-glow-lime">فخامة استثنائية</span>{' '}
                    تليق بك
                  </span>
                </>
              ) : (
                <>
                  Elevate Every Journey..
                  <span className="block mt-2">
                    <span className="text-brand-lime text-glow-lime">Exceptional Luxury</span>{' '}
                    Made for You
                  </span>
                </>
              )}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-neutral-200/90 max-w-xl leading-relaxed font-medium"
            >
              {isAr
                ? 'أعد تعريف تنقلك اليومي في المملكة بسيارات فاخرة 2023+، كباتن سعوديين نخبة، وتتبع مسار فوري بدقة فائقة مع تسعيرة ثابتة 100% دون أي مفاجآت.'
                : 'Redefine your daily mobility across the Kingdom with modern 2023+ executive vehicles, verified Saudi captains, live GPS tracking, and 100% guaranteed upfront fares.'}
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto"
            >
              <MagneticButton strength={0.25} href="#fare-calculator" className="w-full sm:w-auto">
                <span className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 bg-brand-lime hover:bg-[#e1e848] text-neutral-950 px-7 py-4 rounded-2xl font-black text-sm sm:text-base shadow-lime-glow transition-all duration-300 cursor-pointer group">
                  <span>
                    {isAr ? 'احسب سعيرتك واحجز الآن' : 'Calculate Fare & Book Now'}
                  </span>
                  <ArrowIcon className="w-4 h-4 text-neutral-950 group-hover:scale-110 transition-transform" />
                </span>
              </MagneticButton>

              <MagneticButton strength={0.2} href="#download-banner" className="w-full sm:w-auto">
                <span className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-sm sm:text-base text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 hover:border-brand-lime/60 transition-all duration-300 cursor-pointer">
                  <Download className="w-4 h-4 text-brand-lime" />
                  <span>{isAr ? 'حمّل التطبيق مجاناً' : 'Download Free App'}</span>
                </span>
              </MagneticButton>
            </motion.div>

            {/* Glassmorphic Trust Highlights */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 mt-2 border-t border-white/15 w-full max-w-xl"
            >
              <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-brand/40 border border-brand-lime/30 flex items-center justify-center text-brand-lime shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-white font-en">+12,000</div>
                  <div className="text-[11px] sm:text-xs text-neutral-300">
                    {isAr ? 'عميل نشط' : 'Active Riders'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-brand/40 border border-brand-lime/30 flex items-center justify-center text-brand-lime shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-white font-en">100%</div>
                  <div className="text-[11px] sm:text-xs text-neutral-300">
                    {isAr ? 'تسعيرة ثابتة' : 'Fixed Fares'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-brand/40 border border-brand-lime/30 flex items-center justify-center text-brand-lime shrink-0">
                  <Star className="w-4 h-4 fill-brand-lime" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-white font-en">4.98</div>
                  <div className="text-[11px] sm:text-xs text-neutral-300">
                    {isAr ? 'تقييم الخدمة' : 'Avg Rating'}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Scroll Down Indicator pointing cleanly to next section (FareCalculatorSection) */}
      <motion.a
        href="#fare-calculator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 1, duration: 0.6 },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        aria-label={isAr ? 'انتقل لحاسبة التسعيرة' : 'Scroll to Fare Calculator'}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 inline-flex flex-col items-center gap-1 text-xs font-bold text-neutral-300 hover:text-brand-lime transition-colors cursor-pointer"
      >
        <span className="hidden sm:inline">
          {isAr ? 'احسب سعيرتك الآن' : 'Explore Instant Fare'}
        </span>
        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
          <ChevronDown className="w-4 h-4 text-brand-lime" />
        </div>
      </motion.a>
    </section>
  );
};
