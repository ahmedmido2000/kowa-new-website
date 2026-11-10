'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { CATEGORIES, HERO_VEHICLE_OPTIONS } from '@/data/translations';
import { COMPANY_DATA } from '@/data/company';
import { AppRedirectModal } from './AppRedirectModal';
import MagneticButton from './MagneticButton';
import {
  Lock,
  Navigation,
  MapPin,
  LocateFixed,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  CheckCircle,
  CreditCard,
  Star,
  ShieldCheck,
  Clock,
  Sparkles,
  Wifi,
  Snowflake,
  Users,
  Receipt,
  Route,
  Smartphone,
} from 'lucide-react';

interface RoutePreset {
  id: string;
  labelAr: string;
  labelEn: string;
  pickupAr: string;
  pickupEn: string;
  destAr: string;
  destEn: string;
  km: number;
  etaMin: number;
  priceMultiplier: number;
}

const ROUTE_PRESETS: RoutePreset[] = [
  {
    id: 'kafd-airport',
    labelAr: 'المركز المالي ← المطار',
    labelEn: 'KAFD ← Airport T5',
    pickupAr: 'الرياض - المركز المالي (KAFD)',
    pickupEn: 'Riyadh - King Abdullah Financial District (KAFD)',
    destAr: 'مطار الملك خالد الدولي (صالة 5)',
    destEn: 'King Khalid International Airport (Terminal 5)',
    km: 32,
    etaMin: 24,
    priceMultiplier: 1.0,
  },
  {
    id: 'olaya-dq',
    labelAr: 'العليا ← الحي الدبلوماسي',
    labelEn: 'Olaya ← Diplomatic Qtr',
    pickupAr: 'برج المملكة - طريق العروبة (العليا)',
    pickupEn: 'Kingdom Centre - Al Olaya District',
    destAr: 'حي السفارات - الحي الدبلوماسي',
    destEn: 'Diplomatic Quarter (DQ)',
    km: 14,
    etaMin: 15,
    priceMultiplier: 0.72,
  },
  {
    id: 'park-diriyah',
    labelAr: 'الرياض بارك ← الدرعية',
    labelEn: 'Riyadh Park ← Diriyah',
    pickupAr: 'الرياض بارك - الدائري الشمالي',
    pickupEn: 'Riyadh Park - Northern Ring Rd',
    destAr: 'مطل البجيري التاريخي - الدرعية',
    destEn: 'Al-Bujairi Heritage Park - Diriyah',
    km: 18,
    etaMin: 19,
    priceMultiplier: 0.82,
  },
];

const CAPTAIN_PROFILES: Record<
  string,
  {
    nameAr: string;
    nameEn: string;
    plateAr: string;
    plateEn: string;
    rating: string;
    tripsAr: string;
    tripsEn: string;
    arrivalMin: number;
  }
> = {
  eco: {
    nameAr: 'كابتن خالد الدوسري',
    nameEn: 'Captain Khalid Al-Dosari',
    plateAr: 'ر ي ض 2048',
    plateEn: 'RYD 2048',
    rating: '4.95',
    tripsAr: '+3,400 رحلة',
    tripsEn: '+3,400 rides',
    arrivalMin: 2,
  },
  comfort: {
    nameAr: 'كابتن فهد العتيبي',
    nameEn: 'Captain Fahad Al-Otaibi',
    plateAr: 'أ ب ج 4321',
    plateEn: 'ABC 4321',
    rating: '4.98',
    tripsAr: '+5,800 رحلة',
    tripsEn: '+5,800 rides',
    arrivalMin: 3,
  },
  business: {
    nameAr: 'كابتن سعود القحطاني',
    nameEn: 'Captain Saud Al-Qahtani',
    plateAr: 'ف خ م 9001',
    plateEn: 'VIP 9001',
    rating: '5.00',
    tripsAr: '+4,120 رحلة VIP',
    tripsEn: '+4,120 VIP rides',
    arrivalMin: 4,
  },
};

export const FareCalculatorSection: React.FC = () => {
  const { locale, isRtl } = useLanguage();
  const isAr = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [activePresetId, setActivePresetId] = useState<string>(ROUTE_PRESETS[0].id);
  const [customPickup, setCustomPickup] = useState<string | null>(null);
  const [customDestination, setCustomDestination] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(HERO_VEHICLE_OPTIONS[1].id);
  const [isSwapped, setIsSwapped] = useState<boolean>(false);
  const [swapRotation, setSwapRotation] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const activePreset = useMemo(
    () => ROUTE_PRESETS.find((r) => r.id === activePresetId) || ROUTE_PRESETS[0],
    [activePresetId]
  );

  const defaultPickup = isAr
    ? isSwapped
      ? activePreset.destAr
      : activePreset.pickupAr
    : isSwapped
    ? activePreset.destEn
    : activePreset.pickupEn;

  const defaultDestination = isAr
    ? isSwapped
      ? activePreset.pickupAr
      : activePreset.destAr
    : isSwapped
    ? activePreset.pickupEn
    : activePreset.destEn;

  const pickup = customPickup !== null ? customPickup : defaultPickup;
  const destination = customDestination !== null ? customDestination : defaultDestination;

  const selectedVehicle = useMemo(
    () => HERO_VEHICLE_OPTIONS.find((v) => v.id === selectedVehicleId) || HERO_VEHICLE_OPTIONS[1],
    [selectedVehicleId]
  );

  const activeCategoryData = useMemo(
    () => CATEGORIES.find((c) => c.id === selectedVehicleId) || CATEGORIES[1],
    [selectedVehicleId]
  );

  const captain = CAPTAIN_PROFILES[selectedVehicleId] || CAPTAIN_PROFILES.comfort;

  const computeScaledPrice = (basePriceStr: string): string => {
    const numeric = parseFloat(basePriceStr) * activePreset.priceMultiplier;
    return numeric.toFixed(2);
  };

  const finalPrice = computeScaledPrice(selectedVehicle.price);

  const handleSelectPreset = (preset: RoutePreset) => {
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
    setCustomPickup(isAr ? 'موقعي الحالي (حي الصحافة، الرياض)' : 'Current Location (Al Sahafa, Riyadh)');
  };

  return (
    <>
      <section
        id="fare-calculator"
        className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50/60 dark:from-[#0A0F1D] dark:via-[#0C1222] dark:to-[#0A0F1D] py-16 lg:py-24 border-b border-neutral-200 dark:border-line transition-colors duration-200"
      >
        {/* Ambient Soft Glows */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-brand/5 dark:bg-brand/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-brand-lime/15 dark:bg-brand-lime/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Balanced Centered Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-12 lg:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/5 dark:bg-brand-lime/10 border border-brand/15 dark:border-brand-lime/20 text-brand dark:text-brand-lime text-xs font-black tracking-wide mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
              <span>
                {isAr
                  ? 'حاسبة السعر التقديري ومعاينة المسار'
                  : 'Smart Fare Estimator & Route Preview'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-ink leading-tight mb-4">
              {isAr ? (
                <>
                  مشوارك القادم، بأعلى معايير الراحة وبأفضل{' '}
                  <span className="relative inline-block text-brand dark:text-brand-lime">
                    سعر ثابت
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
                </>
              ) : (
                <>
                  Your next journey, peak comfort with a guaranteed{' '}
                  <span className="relative inline-block text-brand dark:text-brand-lime">
                    fixed fare
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
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-ink-muted leading-relaxed max-w-2xl mx-auto">
              {isAr
                ? 'وداعاً للتسعير المفاجئ أوقات الذروة. جرّب مسارات الرياض الشائعة أو أدخل وجهتك لتقدير تكلفة رحلتك المضمونة قبل طلبها عبر تطبيق كوا.'
                : 'Say goodbye to rush-hour surge multipliers. Pick a popular Riyadh route or enter your destination to preview live telemetry and estimate your guaranteed fare before ordering in the KOWA app.'}
            </p>
          </motion.div>

          {/* Unified Bento Command Center Card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[2rem] border border-neutral-200 dark:border-line bg-white dark:bg-[#0E1528] shadow-elevated overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* PANEL A: Interactive Fare & Route Builder (6 cols) */}
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 border-b lg:border-b-0 lg:border-l rtl:lg:border-l rtl:lg:border-r-0 ltr:lg:border-r ltr:lg:border-l-0 border-neutral-200 dark:border-line">
                <div className="space-y-5">
                  {/* Console Header Row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-brand/10 dark:bg-brand-lime/15 text-brand dark:text-brand-lime flex items-center justify-center">
                        <Route className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-black text-neutral-900 dark:text-ink">
                        {isAr ? 'مُقدّر التكلفة ومعاينة المسار' : 'Route & Fare Estimator'}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 text-[11px] font-bold">
                      <Lock className="w-3 h-3" />
                      <span>{isAr ? 'تسعيرة محمية ضد الذروة' : 'Zero Surge Lock'}</span>
                    </span>
                  </div>

                  {/* Quick Route Presets Chips */}
                  <div>
                    <span className="block text-[11px] font-bold text-neutral-400 dark:text-ink-subtle mb-2">
                      {isAr ? 'وجهات سريعة شائعة في الرياض:' : 'Popular Riyadh Routes:'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {ROUTE_PRESETS.map((preset) => {
                        const isActive = activePresetId === preset.id && customPickup === null && customDestination === null;
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
                            {isAr ? preset.labelAr : preset.labelEn}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Connected GPS Route Timeline Box */}
                  <div className="relative rounded-2xl bg-neutral-50/90 dark:bg-[#141D35] border border-neutral-200 dark:border-line p-4 space-y-3">
                    {/* Origin Input */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-8 h-8 rounded-xl bg-brand/10 dark:bg-primary-token/20 text-brand dark:text-brand-lime flex items-center justify-center">
                          <Navigation className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 text-right rtl:text-right ltr:text-left">
                        <label htmlFor="calc-pickup" className="block text-[10px] font-bold text-neutral-400 dark:text-ink-subtle uppercase tracking-wider">
                          {isAr ? 'نقطة الانطلاق' : 'Pickup Point'}
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

                    {/* Timeline Divider + Swap Button */}
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

                    {/* Destination Input */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-lime text-neutral-950 flex items-center justify-center shrink-0 shadow-sm">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 text-right rtl:text-right ltr:text-left">
                        <label htmlFor="calc-dest" className="block text-[10px] font-bold text-neutral-400 dark:text-ink-subtle uppercase tracking-wider">
                          {isAr ? 'الوجهة المقصودة' : 'Destination'}
                        </label>
                        <input
                          id="calc-dest"
                          type="text"
                          value={destination}
                          onChange={(e) => setCustomDestination(e.target.value)}
                          className="w-full bg-transparent border-0 p-0 text-sm font-bold text-neutral-900 dark:text-ink focus:outline-none focus:ring-0 truncate"
                        />
                      </div>
                      <span className="text-[11px] bg-white dark:bg-[#10182C] text-neutral-700 dark:text-ink px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-line font-black font-en shrink-0">
                        {activePreset.km} KM
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Vehicle Class Cards */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-neutral-400 dark:text-ink-subtle">
                        {isAr ? 'اختر فئة المركبة المناسبة:' : 'Select Vehicle Class:'}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {isAr ? 'توفير ~18% عن تسعيرة الذروة' : 'Saving ~18% vs peak surge'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      {HERO_VEHICLE_OPTIONS.map((v) => {
                        const isSelected = selectedVehicleId === v.id;
                        const scaledPrice = computeScaledPrice(v.price);
                        const tierMeta = CAPTAIN_PROFILES[v.id] || CAPTAIN_PROFILES.comfort;
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
                            {isSelected && (
                              <motion.div
                                layoutId="selectedTierGlow"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                className="absolute inset-0 bg-brand/[0.03] dark:bg-brand-lime/[0.05] pointer-events-none"
                              />
                            )}
                            <div className="relative z-10">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span
                                  className={`text-[11px] font-black truncate ${
                                    isSelected
                                      ? 'text-brand dark:text-brand-lime'
                                      : 'text-neutral-700 dark:text-ink'
                                  }`}
                                >
                                  {isAr ? v.name.ar : v.name.en}
                                </span>
                                {v.isFavorite && (
                                  <span className="text-[9px] bg-brand dark:bg-brand-lime text-white dark:text-neutral-950 px-1.5 py-0.5 rounded font-black shrink-0">
                                    {isAr ? 'المفضل' : 'Top'}
                                  </span>
                                )}
                              </div>
                              <div className="text-base sm:text-lg font-black text-neutral-900 dark:text-ink font-en">
                                {scaledPrice}{' '}
                                <span className="text-[11px] font-sans font-bold text-neutral-500 dark:text-ink-muted">
                                  {isAr ? 'ر.س' : 'SAR'}
                                </span>
                              </div>
                              <div className="text-[10px] text-neutral-400 dark:text-ink-subtle mt-1 font-medium">
                                ⚡ {tierMeta.arrivalMin} {isAr ? 'دقائق' : 'min'}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Executive Action Bar */}
                <div className="pt-5 border-t border-neutral-200/80 dark:border-line flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-right rtl:text-right ltr:text-left w-full sm:w-auto">
                    <span className="text-xs font-bold text-neutral-400 dark:text-ink-subtle block">
                      {isAr ? 'التكلفة التقديرية الثابتة في التطبيق' : 'Estimated App Fixed Fare'}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <motion.span
                        key={finalPrice}
                        initial={{ opacity: 0.5, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-3xl font-black text-brand dark:text-brand-lime font-en"
                      >
                        {finalPrice}
                      </motion.span>
                      <span className="text-sm font-bold text-neutral-700 dark:text-ink-muted">
                        {isAr ? 'ر.س' : 'SAR'}
                      </span>
                      <span className="text-[11px] text-neutral-400 dark:text-ink-subtle">
                        {isAr ? '(شامل الضريبة)' : '(Incl. VAT)'}
                      </span>
                    </div>
                  </div>

                  <MagneticButton strength={0.22} className="w-full sm:w-auto" as="div">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full sm:w-auto py-4 px-7 rounded-2xl bg-brand hover:bg-brand-dark dark:bg-brand-lime dark:hover:bg-[#e1e848] text-white dark:text-neutral-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-brand-glow dark:hover:shadow-lime-glow transition-all cursor-pointer group"
                    >
                      <Smartphone className="w-4 h-4 text-brand-lime dark:text-neutral-950" />
                      <span>{isAr ? 'اطلب رحلتك عبر التطبيق' : 'Request via KOWA App'}</span>
                      <ArrowIcon
                        className={`w-4 h-4 text-brand-lime dark:text-neutral-950 transition-transform ${
                          isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                        }`}
                      />
                    </button>
                  </MagneticButton>
                </div>
              </div>

              {/* PANEL B: Live Telemetry Radar & Executive Vehicle Showcase (6 cols) */}
              <div className="lg:col-span-6 bg-gradient-to-br from-[#0E152B] via-[#130C47] to-[#080C18] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 relative overflow-hidden">
                {/* Architectural Radar Coordinate Grid */}
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

                {/* Top Live Telemetry HUD */}
                <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-brand-lime animate-ping" />
                    <span>{isAr ? 'معاينة المسار والتوقيت التقديري' : 'Live App Route Preview'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold font-en">
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-neutral-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-lime" />
                      <span>~{activePreset.etaMin} MIN</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-brand-lime text-neutral-950 font-black">
                      {activePreset.km} KM
                    </span>
                  </div>
                </div>

                {/* Middle Interactive Vector Route Visualization */}
                <div className="relative z-10 rounded-3xl bg-[#070B16]/75 border border-white/10 p-5 sm:p-6 backdrop-blur-md overflow-hidden">
                  {/* Route Labels Row */}
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

                  {/* Animated SVG Flight/Drive Bezier Route */}
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

                      {/* Dashed Guide Path */}
                      <path
                        d="M 36 112 C 130 22, 270 132, 384 38"
                        fill="none"
                        stroke="rgba(255,255,255,0.14)"
                        strokeWidth="3"
                        strokeDasharray="6 6"
                        strokeLinecap="round"
                      />

                      {/* Glowing Active Gradient Path */}
                      <path
                        d="M 36 112 C 130 22, 270 132, 384 38"
                        fill="none"
                        stroke="url(#routePathGrad)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="url(#routeGlow)"
                      />

                      {/* Pickup Pulse Node */}
                      <circle cx="36" cy="112" r="14" fill="rgba(129, 140, 248, 0.2)" />
                      <circle cx="36" cy="112" r="6" fill="#818CF8" stroke="#FFFFFF" strokeWidth="2" />

                      {/* Destination Pulse Node */}
                      <circle cx="384" cy="38" r="16" fill="rgba(211, 217, 60, 0.22)" />
                      <circle cx="384" cy="38" r="6" fill="#D3D93C" stroke="#0A0F1D" strokeWidth="2" />

                      {/* Moving Live Vehicle Dot traveling seamlessly along SVG curve */}
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

                  {/* Quick Hospitality Specs Chips */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-[11px] text-neutral-300">
                    <span className="inline-flex items-center gap-1.5">
                      <Snowflake className="w-3.5 h-3.5 text-brand-lime" />
                      {isAr ? 'تكييف مثالي 19°C' : 'Climate 19°C'}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-brand-lime" />
                      {isAr ? activeCategoryData.capacity.ar : activeCategoryData.capacity.en}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-brand-lime" />
                      {isAr ? 'شاحن سريع وضيافة' : 'Fast USB & Water'}
                    </span>
                  </div>
                </div>

                {/* Bottom Dynamic Captain & Vehicle Preview Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedVehicleId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="relative z-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 flex items-center gap-4"
                  >
                    {/* Crisp Framed Vehicle Thumbnail */}
                    <div className="relative w-24 h-20 sm:w-28 sm:h-24 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-[#0A0F1D]">
                      <Image
                        src={activeCategoryData.image}
                        alt={activeCategoryData.carName}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    </div>

                    {/* Captain & Model Info */}
                    <div className="flex-1 min-w-0 text-right rtl:text-right ltr:text-left">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 bg-brand-lime text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{isAr ? 'معاينة فئة التطبيق' : 'App Class Preview'}</span>
                        </span>
                        <span className="text-xs font-black font-en text-amber-400 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {captain.rating}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-black text-white truncate">
                        {isAr ? captain.nameAr : captain.nameEn}
                      </h3>

                      <p className="text-xs text-neutral-300 truncate mt-0.5">
                        {activeCategoryData.carName}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/10 text-[11px] text-neutral-300">
                        <span className="font-bold text-brand-lime">
                          ⚡ {isAr ? `متوسط الوصول بالتطبيق: ${captain.arrivalMin} دقائق` : `App Avg ETA: ${captain.arrivalMin} min`}
                        </span>
                        <span className="font-en text-neutral-400">
                          {isAr ? captain.plateAr : captain.plateEn}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Compliance & Payment Proof Strip */}
            <div className="bg-neutral-50 dark:bg-[#0A0F1D] border-t border-neutral-200 dark:border-line px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-600 dark:text-ink-muted">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  {isAr ? 'لا رسوم إلغاء خلال أول 3 دقائق' : 'Free cancellation within 3 mins'}
                </span>
              </div>
              <div className="flex items-center gap-2 font-bold">
                <CreditCard className="w-4 h-4 text-brand dark:text-brand-lime shrink-0" />
                <span>mada • Apple Pay • Visa • Mastercard</span>
              </div>
              <div className="flex items-center gap-2 font-bold">
                <Receipt className="w-4 h-4 text-brand dark:text-brand-lime shrink-0" />
                <span>{isAr ? 'فواتير ضريبية فورية ZATCA' : 'Automated ZATCA E-Invoices'}</span>
              </div>
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-en">TGA #{COMPANY_DATA.compliance.tgaLicense}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* App Redirect Modal directing users to KOWA Mobile App */}
      <AppRedirectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pickup={pickup}
        destination={destination}
        vehicleName={isAr ? selectedVehicle.name.ar : selectedVehicle.name.en}
        price={finalPrice}
      />
    </>
  );
};
