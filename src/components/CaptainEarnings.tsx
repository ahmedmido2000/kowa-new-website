'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CaptainModal } from './CaptainModal';
import {
  Banknote,
  Percent,
  Clock,
  Headphones,
  Calculator,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export const CaptainEarnings: React.FC = () => {
  const { locale, isRtl } = useLanguage();
  const isAr = locale === 'ar';

  const [hours, setHours] = useState(6);
  const [days, setDays] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [joinedToast, setJoinedToast] = useState(false);

  // Fair formula: ~48 SAR net earnings per hour after fuel & platform commission
  const hourlyNetRate = 48;
  const weekly = hours * days * hourlyNetRate;
  const monthly = Math.round(weekly * 4.3);

  const handleJoinClick = () => {
    setJoinedToast(true);
    setTimeout(() => setJoinedToast(false), 3000);
  };

  return (
    <>
      <section className="py-16 lg:py-24 bg-neutral-900 text-white relative overflow-hidden" id="captain-earnings">
        {/* Ambient Accent Glow */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand/30 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-brand-lime/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Value Proposition */}
            <div className="lg:col-span-6 text-right rtl:text-right ltr:text-left">
              <span className="text-xs font-black uppercase text-brand-lime tracking-widest bg-brand-lime/10 px-3 py-1 rounded-full border border-brand-lime/20 inline-block mb-3">
                {isAr ? 'كباتن المملكة' : 'Captains of Saudi Arabia'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-4 leading-tight">
                {isAr
                  ? 'قد بأمان مع كوا وحقق دخلاً شهرياً مرناً ومجزياً'
                  : 'Drive with KOWA & Unlock Flexible, High-Yield Monthly Earnings'}
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8">
                {isAr
                  ? 'كن سيد وقتك. انضم إلى الآلاف من الكباتن السعوديين واستمتع بأقل عمولة منصة في المملكة، مع ميزة التحويل المالي اليومي المباشر لحسابك البنكي دون تأخير.'
                  : 'Be your own boss. Join thousands of elite Saudi captains with the lowest take-rate commission in KSA and instant daily direct deposits to your bank account.'}
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold mb-8">
                <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <Banknote className="w-5 h-5 text-brand-lime shrink-0" />
                  <span>{isAr ? 'سحب أرباح يومي فوري 100%' : '100% Instant Daily Payouts'}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <Percent className="w-5 h-5 text-brand-lime shrink-0" />
                  <span>{isAr ? 'أقل نسبة عمولة منصة بالسوق' : 'Lowest Platform Take Rate'}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <Clock className="w-5 h-5 text-brand-lime shrink-0" />
                  <span>{isAr ? 'ساعات عمل مرنة بالكامل' : '100% Flexible Driving Schedule'}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <Headphones className="w-5 h-5 text-brand-lime shrink-0" />
                  <span>{isAr ? 'دعم فني خاص بالكباتن 24/7' : '24/7 Dedicated Captain Support'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleJoinClick}
                  className="px-6 py-3.5 rounded-xl bg-brand-lime hover:bg-brand-accent-hover text-neutral-900 font-black text-sm transition shadow-lime-glow flex items-center gap-2"
                >
                  <span>{isAr ? 'انضم لأسطول كوا الآن' : 'Join KOWA Fleet Now'}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition border border-white/10"
                  type="button"
                >
                  {isAr ? 'شروط التسجيل ونوع المركبات' : 'Requirements & Vehicle Criteria'}
                </button>
              </div>

              {joinedToast && (
                <div className="mt-4 p-3 bg-emerald-900/60 border border-emerald-500 rounded-xl text-xs text-emerald-200 flex items-center gap-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isAr
                      ? 'مرحباً بك! تم توجيهك لتحميل تطبيق كابتن كوا وبدء التسجيل الفوري.'
                      : 'Welcome! Download the KOWA Captain app to complete onboarding.'}
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Income Estimator Card */}
            <div className="lg:col-span-6 bg-white text-neutral-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
                <div className="text-right rtl:text-right ltr:text-left">
                  <h3 className="text-lg font-black text-neutral-900">
                    {isAr ? 'حاسبة الدخل التقديري للأرباح' : 'Captain Income Estimator'}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {isAr
                      ? 'حرك المؤشرات لاحتساب صافي الأرباح المتوقعة'
                      : 'Adjust the sliders to estimate your net monthly earnings'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center font-bold">
                  <Calculator className="w-5 h-5 text-brand" />
                </div>
              </div>

              {/* Slider 1: Hours / Day */}
              <div className="mb-6 text-right rtl:text-right ltr:text-left">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-neutral-600">
                    {isAr ? 'ساعات القيادة اليومية:' : 'Daily Driving Hours:'}
                  </span>
                  <span className="text-base font-black text-brand font-en">
                    {hours} {isAr ? 'ساعات' : 'hrs'}
                  </span>
                </div>
                <input
                  className="w-full h-2.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-brand"
                  max="12"
                  min="2"
                  step="1"
                  type="range"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-sans">
                  <span>{isAr ? 'ساعتان (دوام جزئي)' : '2 hrs (Part-time)'}</span>
                  <span>{isAr ? '12 ساعة (دوام كامل)' : '12 hrs (Full-time)'}</span>
                </div>
              </div>

              {/* Slider 2: Days / Week */}
              <div className="mb-6 text-right rtl:text-right ltr:text-left">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-neutral-600">
                    {isAr ? 'أيام العمل في الأسبوع:' : 'Weekly Working Days:'}
                  </span>
                  <span className="text-base font-black text-brand font-en">
                    {days} {isAr ? 'أيام' : 'days'}
                  </span>
                </div>
                <input
                  className="w-full h-2.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-brand"
                  max="7"
                  min="1"
                  step="1"
                  type="range"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-sans">
                  <span>{isAr ? 'يوم واحد' : '1 Day'}</span>
                  <span>{isAr ? '7 أيام' : '7 Days'}</span>
                </div>
              </div>

              {/* Calculated Display Output Box */}
              <div className="p-6 rounded-2xl bg-brand/5 border border-brand/20 text-center mb-6">
                <span className="text-xs font-bold text-neutral-600 block mb-1">
                  {isAr ? 'صافي الدخل الشهري المتوقع للكابتن' : 'Estimated Net Monthly Income'}
                </span>
                <div className="text-3xl sm:text-4xl font-black text-brand tracking-tight flex items-baseline justify-center gap-1.5 font-en">
                  <span>{monthly.toLocaleString('en-US')}</span>
                  <span className="text-sm font-sans font-bold text-neutral-800">
                    {isAr ? 'ريال سعودي' : 'SAR'}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  {isAr
                    ? 'محسوب بعد اقتطاع مصاريف الوقود وعمولة المنصة التقديرية'
                    : 'Calculated after estimated fuel costs and nominal platform fee'}
                </span>
              </div>

              <button
                onClick={handleJoinClick}
                className="w-full py-4 rounded-xl bg-brand hover:bg-brand-dark text-white font-black text-sm transition shadow-brand-glow"
                type="button"
              >
                {isAr ? 'انضم لأسطول كوا الآن وابدأ في دقائق' : 'Join KOWA Fleet and Start in Minutes'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Captain Criteria Modal */}
      <CaptainModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
