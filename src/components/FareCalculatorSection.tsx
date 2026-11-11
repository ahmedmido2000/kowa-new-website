'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Clock,
  Info,
  LocateFixed,
  Lock,
  MapPin,
  Navigation,
  Route,
  ShieldCheck,
  Smartphone,
  Snowflake,
  Sparkles,
  Users,
  Wifi,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import type { FareCalculatorPreset } from '@/types/website-cms';
import { AppRedirectModal } from './AppRedirectModal';
import MagneticButton from './MagneticButton';
import { CmsIcon } from './CmsIcon';
import { isSafeHref } from '@/lib/cms-helpers';

export const FareCalculatorSection: React.FC = () => {
  const { locale, isRtl, pick } = useLanguage();
  const { sections, site } = useWebsiteConfig();
  const isAr = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const data = sections.fare_calculator;
  const fleetCategories = useMemo(
    () => (sections.fleet_categories?.categories || []).filter((c) => c.isEnabled !== false),
    [sections.fleet_categories]
  );

  const presets = useMemo(
    () => (data?.presets || []).filter((p) => p.isEnabled !== false),
    [data?.presets]
  );
  const vehicleClasses = useMemo(() => data?.vehicleClasses || [], [data?.vehicleClasses]);

  const [activePresetId, setActivePresetId] = useState<string>('');
  const [customPickup, setCustomPickup] = useState<string | null>(null);
  const [customDestination, setCustomDestination] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [isSwapped, setIsSwapped] = useState<boolean>(false);
  const [swapRotation, setSwapRotation] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const activePreset = useMemo(
    () => presets.find((p) => p.id === activePresetId) || presets[0] || null,
    [presets, activePresetId]
  );

  const resolvedVehicleId = useMemo(() => {
    if (selectedVehicleId && vehicleClasses.some((v) => v.id === selectedVehicleId)) {
      return selectedVehicleId;
    }
    const favorite = vehicleClasses.find((v) => v.isFavorite);
    return favorite?.id || vehicleClasses[0]?.id || '';
  }, [selectedVehicleId, vehicleClasses]);

  const selectedVehicle = useMemo(
    () => vehicleClasses.find((v) => v.id === resolvedVehicleId) || vehicleClasses[0] || null,
    [vehicleClasses, resolvedVehicleId]
  );

  const activeCategoryData = useMemo(
    () => fleetCategories.find((c) => c.id === resolvedVehicleId) || fleetCategories[0] || null,
    [fleetCategories, resolvedVehicleId]
  );

  if (!data) return null;

  const defaultPickup = activePreset
    ? pick(isSwapped ? activePreset.destination : activePreset.pickup)
    : '';
  const defaultDestination = activePreset
    ? pick(isSwapped ? activePreset.pickup : activePreset.destination)
    : '';

  const pickup = customPickup !== null ? customPickup : defaultPickup;
  const destination = customDestination !== null ? customDestination : defaultDestination;

  const trustStrip = (data.trustStrip || []).filter((item) => item.isEnabled !== false);
  const savingsBadgeText =
    data.savingsBadge && data.savingsBadge.isEnabled !== false
      ? pick(data.savingsBadge.text)
      : '';
  const favoriteBadgeText = pick(data.favoriteBadge, isAr ? 'المفضل' : 'Top');
  const demoNoticeText = pick(data.demoNotice);
  const tgaLicense = (site?.company?.tgaLicense || '').trim();

  const selectedVehicleName = selectedVehicle ? pick(selectedVehicle.name) : '';
  const selectedStartingPrice = activeCategoryData ? pick(activeCategoryData.startingPrice) : '';
  const startingFromLabel = pick(
    sections.fleet_categories?.labels?.startingFrom,
    isAr ? 'يبدأ المشوار من' : 'Starting from'
  );
  const categoryImgUrl =
    activeCategoryData?.image?.url && isSafeHref(activeCategoryData.image.url)
      ? activeCategoryData.image.url
      : '/hero-bg-kowa.jpg';

  const handleSelectPreset = (preset: FareCalculatorPreset) => {
    setActivePresetId(preset.id);
    setCustomPickup(null);
    setCustomDestination(null);
    setIsSwapped(false);
  };

  const handleSwapRoute = () => {
    setSwapRotation((prev) => prev + 180);
    if (customPickup !== null || customDestination !== null) {
      const prevPickup = pickup;
      const prevDest = destination;
      setCustomPickup(prevDest);
      setCustomDestination(prevPickup);
    } else {
      setIsSwapped((prev) => !prev);
    }
  };

  const handleLocateMe = () => {
    setCustomPickup(
      isAr ? 'موقعي الحالي (حي الصحافة، الرياض)' : 'Current Location (Al Sahafa, Riyadh)'
    );
  };

  return (
    <>
      <section
        id="fare-calculator"
        className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50/60 dark:from-[#0A0F1D] dark:via-[#0C1222] dark:to-[#0A0F1D] py-16 lg:py-24 border-b border-neutral-200 dark:border-line transition-colors duration-200"
      >
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-brand/5 dark:bg-brand/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-brand-lime/15 dark:bg-brand-lime/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-12 lg:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/5 dark:bg-brand-lime/10 border border-brand/15 dark:border-brand-lime/20 text-brand dark:text-brand-lime text-xs font-black tracking-wide mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
              <span>{pick(data.badge)}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-ink leading-tight mb-4">
              {pick(data.headline?.lead)}{' '}
              <span className="relative inline-block text-brand dark:text-brand-lime">
                {pick(data.headline?.highlight)}
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="7"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 7"
                >
                  <path
                    d="M0,5 Q50,0 100,5"
                    fill="none"
                    stroke="#D3D93C"
                    strokeLinecap="round"
                    strokeWidth="6"
                  />
                </svg>
              </span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-ink-muted leading-relaxed max-w-2xl mx-auto">
              {pick(data.subtitle)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[2rem] border border-neutral-200 dark:border-line bg-white dark:bg-[#0E1528] shadow-elevated overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 border-b lg:border-b-0 lg:border-l rtl:lg:border-l rtl:lg:border-r-0 ltr:lg:border-r ltr:lg:border-l-0 border-neutral-200 dark:border-line">
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-brand/10 dark:bg-brand-lime/15 text-brand dark:text-brand-lime flex items-center justify-center">
                        <Route className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-black text-neutral-900 dark:text-ink">
                        {pick(data.labels?.consoleHeader)}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 text-[11px] font-bold">
                      <Lock className="w-3 h-3" />
                      <span>{pick(data.labels?.surgeLock)}</span>
                    </span>
                  </div>

                  {presets.length > 0 ? (
                    <div>
                      <span className="block text-[11px] font-bold text-neutral-400 dark:text-ink-subtle mb-2">
                        {pick(data.labels?.presetsTitle)}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {presets.map((preset) => {
                          const isActive =
                            activePreset?.id === preset.id &&
                            customPickup === null &&
                            customDestination === null;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => handleSelectPreset(preset)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                isActive
                                  ? 'bg-brand dark:bg-brand-lime text-white dark:text-neutral-950 border-brand dark:border-brand-lime shadow-sm'
                                  : 'bg-neutral-50 dark:bg-[#141D35] text-neutral-600 dark:text-ink-muted border-neutral-200 dark:border-line hover:border-brand/40 dark:hover:border-brand-lime/40'
                              }`}
                            >
                              {pick(preset.label)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  <div className="relative rounded-2xl bg-neutral-50/90 dark:bg-[#141D35] border border-neutral-200 dark:border-line p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-8 h-8 rounded-xl bg-brand/10 dark:bg-primary-token/20 text-brand dark:text-brand-lime flex items-center justify-center">
                          <Navigation className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 text-right rtl:text-right ltr:text-left">
                        <label
                          htmlFor="calc-pickup"
                          className="block text-[10px] font-bold text-neutral-400 dark:text-ink-subtle uppercase tracking-wider"
                        >
                          {pick(data.labels?.pickupPoint)}
                        </label>
                        <input
                          id="calc-pickup"
                          type="text"
                          value={pickup}
                          onChange={(e) => setCustomPickup(e.target.value)}
                          className="w-full bg-transparent border-0 p-0 text-sm font-bold text-neutral-900 dark:text-ink focus:outline-none focus:ring-0 truncate"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleLocateMe}
                        title={isAr ? 'موقعي الحالي' : 'Use Current Location'}
                        className="p-2 rounded-xl bg-white dark:bg-[#10182C] border border-neutral-200 dark:border-line text-neutral-500 dark:text-ink-subtle hover:text-brand dark:hover:text-brand-lime transition cursor-pointer shrink-0"
                      >
                        <LocateFixed className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="relative flex items-center py-0.5">
                      <div className="w-8 flex justify-center shrink-0">
                        <div className="w-[2px] h-5 bg-gradient-to-b from-brand/40 to-brand-lime/80 rounded-full" />
                      </div>
                      <div className="flex-1 border-t border-neutral-200/80 dark:border-line" />
                      <motion.button
                        type="button"
                        onClick={handleSwapRoute}
                        animate={{ rotate: swapRotation }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        title={isAr ? 'تبديل نقطة الانطلاق والوجهة' : 'Swap Pickup & Destination'}
                        aria-label={isAr ? 'تبديل المسار' : 'Swap Route'}
                        className="mx-2 w-8 h-8 rounded-full bg-white dark:bg-[#10182C] border border-neutral-200 dark:border-line shadow-subtle flex items-center justify-center text-neutral-600 dark:text-ink-muted hover:text-brand dark:hover:text-brand-lime hover:border-brand/40 transition cursor-pointer shrink-0"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-lime text-neutral-950 flex items-center justify-center shrink-0 shadow-sm">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 text-right rtl:text-right ltr:text-left">
                        <label
                          htmlFor="calc-dest"
                          className="block text-[10px] font-bold text-neutral-400 dark:text-ink-subtle uppercase tracking-wider"
                        >
                          {pick(data.labels?.destination)}
                        </label>
                        <input
                          id="calc-dest"
                          type="text"
                          value={destination}
                          onChange={(e) => setCustomDestination(e.target.value)}
                          className="w-full bg-transparent border-0 p-0 text-sm font-bold text-neutral-900 dark:text-ink focus:outline-none focus:ring-0 truncate"
                        />
                      </div>
                      {activePreset ? (
                        <span className="text-[11px] bg-white dark:bg-[#10182C] text-neutral-700 dark:text-ink px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-line font-black font-en shrink-0">
                          {activePreset.km} KM
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {vehicleClasses.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <span className="text-[11px] font-bold text-neutral-400 dark:text-ink-subtle">
                          {pick(data.labels?.selectClass)}
                        </span>
                        {savingsBadgeText ? (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            {savingsBadgeText}
                          </span>
                        ) : null}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {vehicleClasses.map((v) => {
                          const isSelected = resolvedVehicleId === v.id;
                          const matchedCat = fleetCategories.find((c) => c.id === v.id);
                          const startingPrice = matchedCat ? pick(matchedCat.startingPrice) : '';
                          const etaLabel = matchedCat ? pick(matchedCat.eta) : '';

                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => setSelectedVehicleId(v.id)}
                              className={`relative p-3.5 rounded-2xl border-2 text-right rtl:text-right ltr:text-left transition-all cursor-pointer overflow-hidden ${
                                isSelected
                                  ? 'border-brand dark:border-brand-lime bg-brand/5 dark:bg-brand-lime/10 shadow-sm'
                                  : 'border-neutral-200 dark:border-line bg-white dark:bg-[#141D35] hover:border-brand/40 dark:hover:border-primary-token/40'
                              }`}
                            >
                              {isSelected ? (
                                <motion.div
                                  layoutId="selectedTierGlow"
                                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                  className="absolute inset-0 bg-brand/[0.03] dark:bg-brand-lime/[0.05] pointer-events-none"
                                />
                              ) : null}
                              <div className="relative z-10">
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span
                                    className={`text-[11px] font-black truncate ${
                                      isSelected
                                        ? 'text-brand dark:text-brand-lime'
                                        : 'text-neutral-700 dark:text-ink'
                                    }`}
                                  >
                                    {pick(v.name)}
                                  </span>
                                  {v.isFavorite && favoriteBadgeText ? (
                                    <span className="text-[9px] bg-brand dark:bg-brand-lime text-white dark:text-neutral-950 px-1.5 py-0.5 rounded font-black shrink-0">
                                      {favoriteBadgeText}
                                    </span>
                                  ) : null}
                                </div>

                                {startingPrice ? (
                                  <div className="text-sm sm:text-base font-black text-neutral-900 dark:text-ink">
                                    {startingPrice}
                                  </div>
                                ) : null}

                                {etaLabel ? (
                                  <div className="text-[10px] text-neutral-400 dark:text-ink-subtle mt-1 font-medium">
                                    ⚡ {etaLabel}
                                  </div>
                                ) : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {demoNoticeText ? (
                    <div className="flex items-start gap-2 rounded-xl bg-amber-50/80 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/40 px-3.5 py-2.5 text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed">
                      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{demoNoticeText}</span>
                    </div>
                  ) : null}
                </div>

                <div className="pt-5 border-t border-neutral-200/80 dark:border-line flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-right rtl:text-right ltr:text-left w-full sm:w-auto">
                    <span className="text-xs font-bold text-neutral-400 dark:text-ink-subtle block">
                      {pick(data.labels?.finalFare)}
                    </span>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      {selectedStartingPrice ? (
                        <>
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={resolvedVehicleId}
                              initial={{ opacity: 0.5, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.25 }}
                              className="text-2xl sm:text-3xl font-black text-brand dark:text-brand-lime"
                            >
                              {startingFromLabel} {selectedStartingPrice}
                            </motion.span>
                          </AnimatePresence>
                          <span className="text-[11px] text-neutral-400 dark:text-ink-subtle">
                            {pick(data.labels?.vatNote)}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-black text-brand dark:text-brand-lime">
                          {pick(data.labels?.surgeLock)}
                        </span>
                      )}
                    </div>
                  </div>

                  <MagneticButton strength={0.22} className="w-full sm:w-auto" as="div">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full sm:w-auto py-4 px-7 rounded-2xl bg-brand hover:bg-brand-dark dark:bg-brand-lime dark:hover:bg-[#e1e848] text-white dark:text-neutral-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-brand-glow dark:hover:shadow-lime-glow transition-all cursor-pointer group"
                    >
                      <Smartphone className="w-4 h-4 text-brand-lime dark:text-neutral-950" />
                      <span>{pick(data.labels?.cta)}</span>
                      <ArrowIcon
                        className={`w-4 h-4 text-brand-lime dark:text-neutral-950 transition-transform ${
                          isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                        }`}
                      />
                    </button>
                  </MagneticButton>
                </div>
              </div>

              <div className="lg:col-span-6 bg-gradient-to-br from-[#0E152B] via-[#130C47] to-[#080C18] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 relative overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(rgba(211, 217, 60, 0.35) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-brand/30 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-brand-lime/15 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-brand-lime animate-ping" />
                    <span>{pick(data.labels?.radarBadge)}</span>
                  </div>

                  {activePreset ? (
                    <div className="flex items-center gap-2 text-xs font-bold font-en">
                      <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-neutral-200 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-lime" />
                        <span>~{activePreset.etaMin} MIN</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-brand-lime text-neutral-950 font-black">
                        {activePreset.km} KM
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="relative z-10 rounded-3xl bg-[#070B16]/75 border border-white/10 p-5 sm:p-6 backdrop-blur-md overflow-hidden">
                  <div className="flex items-center justify-between gap-4 text-xs mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 ring-4 ring-indigo-500/20 shrink-0" />
                      <span className="text-neutral-300 font-bold truncate">{pickup}</span>
                    </div>
                    <div className="flex items-center gap-2 min-w-0 justify-end">
                      <span className="text-brand-lime font-bold truncate">{destination}</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-lime ring-4 ring-brand-lime/25 shrink-0" />
                    </div>
                  </div>

                  <div className="relative w-full h-36 sm:h-40 flex items-center justify-center">
                    <svg
                      viewBox="0 0 420 150"
                      className={`w-full h-full overflow-visible ${isRtl ? '-scale-x-100' : ''}`}
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="routePathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#818CF8" />
                          <stop offset="50%" stopColor="#634EEB" />
                          <stop offset="100%" stopColor="#D3D93C" />
                        </linearGradient>
                        <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      <path
                        d="M 36 112 C 130 22, 270 132, 384 38"
                        fill="none"
                        stroke="rgba(255,255,255,0.14)"
                        strokeWidth="3"
                        strokeDasharray="6 6"
                        strokeLinecap="round"
                      />

                      <path
                        d="M 36 112 C 130 22, 270 132, 384 38"
                        fill="none"
                        stroke="url(#routePathGrad)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="url(#routeGlow)"
                      />

                      <circle cx="36" cy="112" r="14" fill="rgba(129, 140, 248, 0.2)" />
                      <circle
                        cx="36"
                        cy="112"
                        r="6"
                        fill="#818CF8"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />

                      <circle cx="384" cy="38" r="16" fill="rgba(211, 217, 60, 0.22)" />
                      <circle
                        cx="384"
                        cy="38"
                        r="6"
                        fill="#D3D93C"
                        stroke="#0A0F1D"
                        strokeWidth="2"
                      />

                      <g filter="url(#routeGlow)">
                        <circle r="9" fill="#D3D93C" stroke="#0A0F1D" strokeWidth="2.5">
                          <animateMotion
                            dur="4.8s"
                            repeatCount="indefinite"
                            path="M 36 112 C 130 22, 270 132, 384 38"
                          />
                        </circle>
                        <circle r="3.5" fill="#0A0F1D">
                          <animateMotion
                            dur="4.8s"
                            repeatCount="indefinite"
                            path="M 36 112 C 130 22, 270 132, 384 38"
                          />
                        </circle>
                      </g>
                    </svg>
                  </div>

                  {activeCategoryData ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-[11px] text-neutral-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Snowflake className="w-3.5 h-3.5 text-brand-lime" />
                        {pick(activeCategoryData.feature)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-brand-lime" />
                        {pick(activeCategoryData.capacity)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Wifi className="w-3.5 h-3.5 text-brand-lime" />
                        {pick(activeCategoryData.badge)}
                      </span>
                    </div>
                  ) : null}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={resolvedVehicleId || 'default-class'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="relative z-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 flex items-center gap-4"
                  >
                    <div className="relative w-24 h-20 sm:w-28 sm:h-24 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-[#0A0F1D]">
                      <Image
                        src={categoryImgUrl}
                        alt={
                          activeCategoryData
                            ? pick(activeCategoryData.image?.alt, activeCategoryData.carName)
                            : selectedVehicleName
                        }
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="120px"
                      />
                    </div>

                    <div className="flex-1 min-w-0 text-right rtl:text-right ltr:text-left">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 bg-brand-lime text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{pick(data.labels?.previewBadge)}</span>
                        </span>
                        {selectedStartingPrice ? (
                          <span className="text-xs font-black text-brand-lime">
                            {selectedStartingPrice}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="text-sm sm:text-base font-black text-white truncate">
                        {activeCategoryData ? pick(activeCategoryData.title) : selectedVehicleName}
                      </h3>

                      {activeCategoryData ? (
                        <>
                          <p className="text-xs text-neutral-300 truncate mt-0.5 font-en">
                            {activeCategoryData.carName}
                          </p>
                          <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/10 text-[11px] text-neutral-300">
                            <span className="font-bold text-brand-lime">
                              ⚡ {pick(activeCategoryData.eta)}
                            </span>
                            <span className="text-neutral-300 truncate">
                              {pick(activeCategoryData.vehicles)}
                            </span>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {trustStrip.length > 0 || tgaLicense ? (
              <div className="bg-neutral-50 dark:bg-[#0A0F1D] border-t border-neutral-200 dark:border-line px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-600 dark:text-ink-muted">
                {trustStrip.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 font-bold">
                    <CmsIcon
                      name={item.icon}
                      className="w-4 h-4 text-brand dark:text-brand-lime shrink-0"
                    />
                    <span>{pick(item.text)}</span>
                  </div>
                ))}
                {tgaLicense ? (
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-en">TGA #{tgaLicense}</span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </motion.div>
        </div>
      </section>

      <AppRedirectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pickup={pickup}
        destination={destination}
        vehicleName={selectedVehicleName}
        startingPriceLabel={
          selectedStartingPrice ? `${startingFromLabel} ${selectedStartingPrice}` : undefined
        }
      />
    </>
  );
};
