'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, Download, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import MagneticButton from './MagneticButton';
import { CmsIcon } from './CmsIcon';
import { isSafeHref, optimizeCloudinary } from '@/lib/cms-helpers';

const AMBIENT_EMBERS = [
  { id: 1, left: '12%', delay: 0, duration: 7.5, size: 3.5 },
  { id: 2, left: '28%', delay: 1.4, duration: 9, size: 2.5 },
  { id: 3, left: '46%', delay: 2.8, duration: 6.8, size: 4 },
  { id: 4, left: '68%', delay: 0.9, duration: 8.5, size: 2.5 },
  { id: 5, left: '84%', delay: 2.1, duration: 7.8, size: 3 },
  { id: 6, left: '55%', delay: 3.6, duration: 8.2, size: 2.5 },
];

export const HeroSection: React.FC = () => {
  const { isRtl, pick } = useLanguage();
  const { sections } = useWebsiteConfig();
  const data = sections.hero;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  if (!data) return null;

  const rawBg = data.backgroundImage?.url;
  const isCloudinary = typeof rawBg === 'string' && rawBg.includes('res.cloudinary.com');
  const isProd =
    typeof window !== 'undefined'
      ? window.location.hostname.includes('kowa.sa')
      : typeof process.env.NEXT_PUBLIC_SITE_URL === 'string' &&
        process.env.NEXT_PUBLIC_SITE_URL.includes('kowa.sa');
  const mobileBgUrl =
    isProd && isCloudinary
      ? optimizeCloudinary(rawBg, { width: 480, quality: 'auto:eco', crop: 'fit' })
      : '/hero-bg-kowa-mobile.webp';
  const desktopBgUrl =
    isProd && isCloudinary
      ? optimizeCloudinary(rawBg, { width: 1200, quality: 'auto:eco', crop: 'fit' })
      : '/hero-bg-kowa.webp';
  const bgAlt = pick(data.backgroundImage?.alt, 'KOWA Mobility');
  const mirrorBg = !isRtl && (data.mirrorBackgroundInLtr ?? true);
  const showAmbient = data.showAmbientParticles ?? true;
  const showOrbital = data.showOrbitalStreams ?? true;

  const kicker = pick(data.kicker);
  const headlineLead = pick(data.headline?.lead);
  const headlineHighlight = pick(data.headline?.highlight);
  const headlineTail = pick(data.headline?.tail);
  const subtitle = pick(data.subtitle);

  const primaryHref = isSafeHref(data.primaryCta?.href) ? data.primaryCta.href : '#fare-calculator';
  const primaryLabel = pick(data.primaryCta?.label);
  const secondaryHref = isSafeHref(data.secondaryCta?.href)
    ? data.secondaryCta.href
    : '#download-banner';
  const secondaryLabel = pick(data.secondaryCta?.label);

  const scrollCueHref = isSafeHref(data.scrollCue?.href) ? data.scrollCue.href : '#fare-calculator';
  const scrollCueLabel = pick(data.scrollCue?.label);

  const trustStats = (data.trustStats || []).filter((item) => item.isEnabled !== false);

  return (
    <section
      id="hero"
      className="relative min-h-[86vh] lg:min-h-[92vh] flex items-center pt-16 pb-20 sm:pt-20 sm:pb-24 overflow-hidden bg-[#0A0F1D] text-white border-b border-brand/30 dark:border-line select-none"
    >
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`relative w-full h-full scale-[1.06] ${mirrorBg ? '-scale-x-100' : ''}`}>
          <picture>
            <source media="(min-width: 641px)" srcSet={desktopBgUrl} />
            <img
              src={mobileBgUrl}
              alt={bgAlt}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center sm:object-[25%_center]"
            />
          </picture>
        </div>

        <div className="absolute inset-0 bg-[#0A0F1D]/45 lg:bg-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1D]/70 via-[#0A0F1D]/25 to-[#0A0F1D]/90" />
        <div
          className={`absolute inset-0 ${
            isRtl
              ? 'bg-gradient-to-l from-[#0A0F1D]/95 via-[#0A0F1D]/65 to-transparent'
              : 'bg-gradient-to-r from-[#0A0F1D]/95 via-[#0A0F1D]/65 to-transparent'
          }`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(15,59,130,0.45),transparent_65%)]" />
      </div>

      {showAmbient &&
        AMBIENT_EMBERS.map((ember) => (
          <div
            key={ember.id}
            aria-hidden="true"
            className="hidden sm:block ambient-ember absolute bottom-0 rounded-full bg-white pointer-events-none blur-[0.8px] shadow-[0_0_10px_rgba(255,255,255,0.85)] z-[1]"
            style={{
              left: ember.left,
              width: ember.size,
              height: ember.size,
              animationDuration: `${ember.duration}s`,
              animationDelay: `${ember.delay}s`,
            }}
          />
        ))}

      {showOrbital && (
        <svg
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="hidden sm:block absolute inset-0 w-full h-full opacity-45 pointer-events-none z-[2]"
        >
          <defs>
            <linearGradient id="kowaStreamGrad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#0F3B82" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#2563EB" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </linearGradient>
          </defs>

          <g fill="none" stroke="url(#kowaStreamGrad)" strokeLinecap="round">
            {/* Guide tracks */}
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

            {/* Kinetic stream 1: glow aura + core beam (Zero CPU rasterization) */}
            <path
              className="st"
              pathLength="1"
              d="M 135.9 449.8 C 158.7 509.1, 340.1 494.6, 541.2 417.4 C 742.3 340.2, 886.9 229.5, 864.1 170.2 C 841.3 110.9, 659.9 125.4, 458.8 202.6 C 257.7 279.8, 113.1 390.5, 135.9 449.8 Z"
              strokeWidth="7"
              opacity="0.25"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="st"
              pathLength="1"
              d="M 135.9 449.8 C 158.7 509.1, 340.1 494.6, 541.2 417.4 C 742.3 340.2, 886.9 229.5, 864.1 170.2 C 841.3 110.9, 659.9 125.4, 458.8 202.6 C 257.7 279.8, 113.1 390.5, 135.9 449.8 Z"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />

            {/* Kinetic stream 2: glow aura + core beam */}
            <path
              className="st st2"
              pathLength="1"
              d="M 70.6 474.8 C 105.2 565.1, 325.5 564.4, 562.7 473.4 C 799.9 382.3, 964.1 235.4, 929.4 145.2 C 894.8 54.9, 674.5 55.6, 437.3 146.6 C 200.1 237.7, 35.9 384.6, 70.6 474.8 Z"
              strokeWidth="6"
              opacity="0.25"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="st st2"
              pathLength="1"
              d="M 70.6 474.8 C 105.2 565.1, 325.5 564.4, 562.7 473.4 C 799.9 382.3, 964.1 235.4, 929.4 145.2 C 894.8 54.9, 674.5 55.6, 437.3 146.6 C 200.1 237.7, 35.9 384.6, 70.6 474.8 Z"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
      )}

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-right rtl:text-right ltr:text-left">
            {kicker ? (
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/15 border border-white/30 backdrop-blur-md shadow-sm cursor-default hover:scale-[1.03] transition-transform">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span className="text-white font-extrabold text-xs sm:text-sm tracking-wide">
                  {kicker}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
              </div>
            ) : null}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.25] tracking-tight">
              {headlineLead}
              {(headlineHighlight || headlineTail) ? (
                <span className="block mt-2">
                  {headlineHighlight ? (
                    <span className="text-white text-glow-lime">{headlineHighlight}</span>
                  ) : null}{' '}
                  {headlineTail}
                </span>
              ) : null}
            </h1>

            {subtitle ? (
              <p className="text-base sm:text-lg text-neutral-200/90 max-w-xl leading-relaxed font-medium">
                {subtitle}
              </p>
            ) : null}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto">
              {primaryLabel ? (
                <MagneticButton strength={0.25} href={primaryHref} className="w-full sm:w-auto">
                  <span className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 bg-white hover:bg-[#EFF6FF] text-brand px-7 py-4 rounded-2xl font-black text-sm sm:text-base shadow-lime-glow transition-all duration-300 cursor-pointer group">
                    <span>{primaryLabel}</span>
                    <ArrowIcon className="w-4 h-4 text-neutral-950 group-hover:scale-110 transition-transform" />
                  </span>
                </MagneticButton>
              ) : null}

              {secondaryLabel ? (
                <MagneticButton strength={0.2} href={secondaryHref} className="w-full sm:w-auto">
                  <span className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-sm sm:text-base text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 hover:border-white/70 transition-all duration-300 cursor-pointer">
                    <Download className="w-4 h-4 text-white" />
                    <span>{secondaryLabel}</span>
                  </span>
                </MagneticButton>
              ) : null}
            </div>

            {trustStats.length > 0 ? (
              <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-6 mt-2 border-t border-white/15 w-full max-w-xl">
                {trustStats.map((stat) => (
                  <div
                    key={stat.id}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center text-white shrink-0">
                      <CmsIcon name={stat.icon} className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-black text-white font-en">
                        {stat.value}
                      </div>
                      <div className="text-[11px] sm:text-xs text-neutral-300">
                        {pick(stat.label)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {scrollCueLabel ? (
        <a
          href={scrollCueHref}
          aria-label={scrollCueLabel}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 inline-flex flex-col items-center gap-1 text-xs font-bold text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          <span className="hidden sm:inline">{scrollCueLabel}</span>
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <ChevronDown className="w-4 h-4 text-white" />
          </div>
        </a>
      ) : null}
    </section>
  );
};
