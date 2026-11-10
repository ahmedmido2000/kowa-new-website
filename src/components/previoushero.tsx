'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { HERO_VEHICLE_OPTIONS } from '@/data/translations';
import { BookingModal } from './BookingModal';
import MagneticButton from './MagneticButton';
import {
  Lock,
  Navigation,
  MapPin,
  LocateFixed,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Star,
  ShieldCheck,
  Send,
} from 'lucide-react';

/**
 * Preserved snapshot of the previous hero/fare-calculator section design prior to redesign.
 */
export const PreviousHero: React.FC = () => {
  const { locale, isRtl } = useLanguage();
  const isAr = locale === 'ar';

  const [pickup, setPickup] = useState(
    isAr ? 'الرياض - المركز المالي (KAFD)' : 'Riyadh - King Abdullah Financial District (KAFD)'
  );
  const [destination, setDestination] = useState(
    isAr ? 'مطار الملك خالد الدولي (صالة 5)' : 'King Khalid International Airport (Terminal 5)'
  );
  const [selectedVehicle, setSelectedVehicle] = useState(HERO_VEHICLE_OPTIONS[1]); // Comfort
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Subtle interactive mouse-tracking parallax
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
    mouseX.set(factorX * -15);
    mouseY.set(factorY * -10);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleLocateMe = () => {
    setPickup(isAr ? 'موقعي الحالي (حي الصحافة، الرياض)' : 'Current Location (Al Sahafa, Riyadh)');
  };

  return (
    <>
      <section
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50/50 dark:from-[#0A0F1D] dark:via-[#0C1222] dark:to-[#0A0F1D] py-16 lg:py-24 border-b border-neutral-200 dark:border-line transition-colors duration-200"
        id="previous-hero"
      >
        {/* Subtle Ambient Background Accents with Parallax Drift */}
        <motion.div
          style={{ x: bgX, y: bgY }}
          className="absolute top-0 right-1/4 w-96 h-96 bg-brand/5 dark:bg-brand/15 rounded-full blur-3xl pointer-events-none -z-10"
        />
        <motion.div
          style={{ x: bgY, y: bgX }}
          className="absolute bottom-10 left-10 w-80 h-80 bg-brand-lime/20 dark:bg-brand-lime/10 rounded-full blur-3xl pointer-events-none -z-10"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Value Pitch & Dual-Action Booking Card */}
            <motion.div
              initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col gap-6"
            >
              {/* Category Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/5 dark:bg-brand-lime/10 border border-brand/15 dark:border-brand-lime/20 text-brand dark:text-brand-lime text-xs font-bold w-fit">
                <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse"></span>
                <span>
                  {isAr
                    ? 'حجز وتقدير السعر الفوري المباشر'
                    : 'Instant Fare Calculator & Direct Booking'}
                </span>
              </div>

              {/* Section Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-ink leading-tight">
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
                          strokeWidth="7"
                        ></path>
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
                          strokeWidth="7"
                        ></path>
                      </svg>
                    </span>
                  </>
                )}
              </h2>

              <p className="text-base sm:text-lg text-neutral-600 dark:text-ink-muted leading-relaxed font-normal">
                {isAr
                  ? 'وداعاً للتسعير المفاجئ والمضاعف أوقات الذروة. احسب تسعيرتك العادلة الآن، واحصل على سيارة حديثة مكيفة وكابتن سعودي محترف بضغطة زر واحدة.'
                  : 'Say goodbye to surge multipliers and rush-hour surprises. Lock your fair upfront price now and enjoy a modern, climate-controlled ride with an elite Saudi captain.'}
              </p>

              {/* Floating Dual-Action Booking Console */}
              <div className="bg-white dark:bg-[#10182C] rounded-3xl p-6 shadow-elevated border border-neutral-200 dark:border-line mt-2 transition-colors duration-200">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-neutral-100 dark:border-line">
                  <span className="text-xs font-bold text-neutral-500 dark:text-ink-subtle uppercase tracking-wider">
                    {isAr ? 'حاسبة التسعيرة الفورية المباشرة' : 'Instant Fare Calculator'}
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 text-xs font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isAr ? 'سعر ثابت بدون مفاجآت' : 'Zero Surge Guarantee'}</span>
                  </div>
                </div>

                {/* Booking Inputs */}
                <div className="space-y-3 mb-5">
                  {/* Pickup */}
                  <div className="flex items-center gap-3 p-3.5 bg-neutral-50 dark:bg-[#17223C] hover:bg-neutral-100/80 dark:hover:bg-[#1C2A4A] border border-neutral-200 dark:border-line rounded-2xl transition">
                    <div className="w-8 h-8 rounded-xl bg-brand/10 dark:bg-primary-token/20 text-brand dark:text-primary-token flex items-center justify-center shrink-0">
                      <Navigation className="w-4 h-4 text-brand dark:text-primary-token" />
                    </div>
                    <div className="flex-1 text-right rtl:text-right ltr:text-left">
                      <label htmlFor="prev-hero-pickup" className="block text-[11px] font-bold text-neutral-400 dark:text-ink-subtle">
                        {isAr ? 'نقطة الانطلاق' : 'Pickup Location'}
                      </label>
                      <input
                        className="w-full bg-transparent border-0 p-0 text-sm font-bold text-neutral-900 dark:text-ink focus:outline-none focus:ring-0 truncate"
                        id="prev-hero-pickup"
                        type="text"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={handleLocateMe}
                      className="text-neutral-400 dark:text-ink-subtle hover:text-brand dark:hover:text-brand-lime transition p-1 cursor-pointer"
                      title={isAr ? 'موقعي الحالي' : 'Use Current Location'}
                      type="button"
                    >
                      <LocateFixed className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Destination */}
                  <div className="flex items-center gap-3 p-3.5 bg-neutral-50 dark:bg-[#17223C] hover:bg-neutral-100/80 dark:hover:bg-[#1C2A4A] border border-neutral-200 dark:border-line rounded-2xl transition">
                    <div className="w-8 h-8 rounded-xl bg-brand-lime/30 text-neutral-900 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-neutral-900" />
                    </div>
                    <div className="flex-1 text-right rtl:text-right ltr:text-left">
                      <label htmlFor="prev-hero-dest" className="block text-[11px] font-bold text-neutral-400 dark:text-ink-subtle">
                        {isAr ? 'الوجهة المقصودة' : 'Destination'}
                      </label>
                      <input
                        className="w-full bg-transparent border-0 p-0 text-sm font-bold text-neutral-900 dark:text-ink focus:outline-none focus:ring-0 truncate"
                        id="prev-hero-dest"
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                    </div>
                    <span className="text-xs bg-white dark:bg-[#10182C] text-neutral-700 dark:text-ink px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-line font-bold font-en">
                      32 KM
                    </span>
                  </div>
                </div>

                {/* Fleet Selection Chips */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {HERO_VEHICLE_OPTIONS.map((v) => {
                    const isSelected = selectedVehicle.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVehicle(v)}
                        className={`p-3 rounded-2xl border-2 text-right rtl:text-right ltr:text-left transition cursor-pointer ${
                          isSelected
                            ? 'border-brand dark:border-brand-lime bg-brand/5 dark:bg-brand-lime/10'
                            : 'border-neutral-200 dark:border-line hover:border-brand/40 dark:hover:border-primary-token/40 bg-white dark:bg-[#17223C]'
                        }`}
                      >
                        <div
                          className={`text-[11px] font-bold flex items-center justify-between ${
                            isSelected
                              ? 'text-brand dark:text-brand-lime'
                              : 'text-neutral-500 dark:text-ink-subtle'
                          }`}
                        >
                          <span>{isAr ? v.name.ar : v.name.en}</span>
                          {v.isFavorite && (
                            <span className="text-[10px] bg-brand dark:bg-brand-lime text-white dark:text-neutral-950 px-1.5 py-0.2 rounded font-semibold">
                              {isAr ? 'المفضل' : 'Popular'}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-black text-brand dark:text-brand-lime mt-0.5 font-en">
                          {v.price} <span className="font-sans text-xs">{isAr ? 'ر.س' : 'SAR'}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Guaranteed Fare Action Bar */}
                <div className="pt-4 border-t border-neutral-100 dark:border-line flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-right rtl:text-right ltr:text-left w-full sm:w-auto">
                    <div className="text-xs text-neutral-400 dark:text-ink-subtle font-bold">
                      {isAr ? 'السعر النهائي المضمون' : 'Guaranteed Final Fare'}
                    </div>
                    <div className="text-2xl font-black text-brand dark:text-brand-lime font-en flex items-baseline gap-1">
                      <span>{selectedVehicle.price}</span>
                      <span className="text-sm font-sans font-bold text-neutral-700 dark:text-ink-muted">
                        {isAr ? 'ر.س' : 'SAR'}
                      </span>
                      <span className="text-[11px] font-sans font-normal text-neutral-400 dark:text-ink-subtle mr-2 rtl:mr-2 ltr:ml-2">
                        {isAr ? '(شامل الضريبة)' : '(Incl. VAT)'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <MagneticButton strength={0.2} className="w-full sm:w-auto" as="div">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-brand hover:bg-brand-dark dark:bg-primary-solid dark:hover:bg-brand text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-brand-glow transition-all cursor-pointer group"
                      >
                        <span>{isAr ? 'طلب فوري الآن' : 'Request Instantly'}</span>
                        {isRtl ? (
                          <ArrowLeft className="w-4 h-4 text-brand-lime group-hover:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-brand-lime group-hover:translate-x-1 transition-transform" />
                        )}
                      </button>
                    </MagneticButton>
                  </div>
                </div>
              </div>

              {/* Micro Proof Counters */}
              <div className="flex items-center gap-6 pt-2 text-xs text-neutral-500 dark:text-ink-subtle">
                <div className="flex items-center gap-1.5 font-bold text-neutral-700 dark:text-ink-muted">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    {isAr ? 'لا رسوم إلغاء خلال أول 3 دقائق' : 'No cancellation fee within 3 mins'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-neutral-700 dark:text-ink-muted">
                  <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>mada • Apple Pay • Visa</span>
                </div>
              </div>
            </motion.div>

            {/* Visual Container Frame with Floating Badges and Parallax Entrance */}
            <motion.div
              initial={{ opacity: 0, x: isRtl ? -35 : 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-line bg-white dark:bg-[#10182C]">
                <div className="relative w-full h-[460px] sm:h-[500px]">
                  <Image
                    alt="Saudi executive arriving in modern luxury vehicle"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_XaJz4g4XhR21mlxqohGYsoIB-lhAHLeQOEXQtIdz5XoxedSudqDwWXvuDiHW3ROZ08FLPJwWcEx6xV9etX6K4VSKrXv91h_MofY1BqNrbM8Fzt2m17qChONLPUBa4v9s_ZORg7mO0tvUUGSzlTd-T2e14wpigR6kWaMC54L93AMi8DTkFNYfW0Xgwrz3ikCnOOHmPjvkXwl92QRyNp_rv4H_Wxu82PQCKNRyGvLN"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Gradient Overlay for Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/30 to-transparent pointer-events-none"></div>

                {/* Driver & Fleet Pill at Bottom */}
                <div className="absolute bottom-6 right-6 left-6 flex items-center justify-between text-white flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-brand-lime font-black">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{isAr ? 'كابتن فهد العتيبي' : 'Captain Fahad Al-Otaibi'}</span>
                        <span className="bg-brand-lime text-neutral-950 text-[10px] font-black px-1.5 py-0.5 rounded">
                          {isAr ? 'نخبة كوا' : 'KOWA Elite'}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-300 font-sans">
                        {isAr
                          ? 'تويوتا كامري جراندي 2024 • معقمة ومجهزة'
                          : 'Toyota Camry Grande 2024 • Sanitized & Equipped'}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl text-xs font-black font-en text-white">
                    LEAP 2025 PARTNER
                  </div>
                </div>
              </div>

              {/* Floating Pill 1: Arrival Time */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 right-6 rtl:right-6 rtl:left-auto ltr:left-6 ltr:right-auto bg-white/95 dark:bg-[#10182C]/95 backdrop-blur-md border border-neutral-200 dark:border-line shadow-float rounded-2xl p-3.5 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-lime/30 text-neutral-900 flex items-center justify-center font-bold">
                  <Send className="w-5 h-5 text-neutral-900" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-neutral-400 dark:text-ink-subtle">
                    {isAr ? 'كابتنك في الطريق' : 'Captain En Route'}
                  </div>
                  <div className="text-sm font-black text-neutral-900 dark:text-ink">
                    {isAr ? 'وصل خلال دقيقتين ⚡' : 'Arrives in 2 mins ⚡'}
                  </div>
                </div>
              </motion.div>

              {/* Floating Pill 2: Passenger Rating */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-5 left-6 rtl:left-6 rtl:right-auto ltr:right-6 ltr:left-auto bg-white/95 dark:bg-[#10182C]/95 backdrop-blur-md border border-neutral-200 dark:border-line shadow-float rounded-2xl p-3.5 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-brand dark:bg-primary-solid text-brand-lime flex items-center justify-center font-bold">
                  <Star className="w-5 h-5 fill-brand-lime" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-neutral-400 dark:text-ink-subtle">
                    {isAr ? 'تقييم الخدمة المباشر' : 'Live Passenger Rating'}
                  </div>
                  <div className="text-sm font-black text-neutral-900 dark:text-ink flex items-center gap-1 font-en">
                    <span>4.98</span>
                    <span className="text-amber-500">★★★★★</span>
                    <span className="text-xs font-normal text-neutral-400 dark:text-ink-subtle font-sans">
                      {isAr ? '(+140 ألف مشوار)' : '(+140k rides)'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking Confirmation Dialog */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pickup={pickup}
        destination={destination}
        vehicleName={isAr ? selectedVehicle.name.ar : selectedVehicle.name.en}
        price={selectedVehicle.price}
      />
    </>
  );
};

export default PreviousHero;
