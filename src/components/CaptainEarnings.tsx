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
      <section className="py-16 lg:py-24 bg-neutral-900 dark:bg-[#070B14] text-white relative overflow-hidden transition-colors duration-200" id="captain-earnings">
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

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-brand-lime font-black text-xl mb-1 font-en">
                    <Percent className="w-5 h-5 text-brand-lime" />
                    <span>{isAr ? 'عمولة 15% فقط' : '15% Lowest Fee'}</span>
                  </div>
                  <div className="text-xs text-neutral-300">
                    {isAr ? 'أدنى نسبة اقتطاع مقارنة بجميع التطبيقات' : 'The lowest platform fee in Saudi Arabia'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-brand-lime font-black text-xl mb-1 font-en">
                    <Banknote className="w-5 h-5 text-brand-lime" />
                    <span>{isAr ? 'إيداع يومي فوري' : 'Daily Payouts'}</span>
                  </div>
                  <div className="text-xs text-neutral-300">
                    {isAr ? 'تحويل أرباحك لحسابك البنكي دون تأخير' : 'Instant earnings direct deposit to your IBAN'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <button
                  type="button"
                  onClick={handleJoinClick}
                  className="py-4 px-8 rounded-2xl bg-brand-lime text-neutral-950 font-black text-sm hover:bg-yellow-300 transition flex items-center gap-2 shadow-lime-glow cursor-pointer"
                >
                  <span>{isAr ? 'سجل ككابتن الآن' : 'Apply as Captain Now'}</span>
                  {isRtl ? (
                    <ArrowLeft className="w-4 h-4 text-neutral-950" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-neutral-950" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition border border-white/10 flex items-center gap-2 cursor-pointer"
                >
                  <Headphones className="w-4 h-4 text-neutral-300" />
                  <span>{isAr ? 'معايير القبول والسيارات' : 'Requirements & Eligibility'}</span>
                </button>
              </div>

              {joinedToast && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {isAr
                      ? 'تم تحويلك لبوابة تسجيل الكباتن الرسمية في كوا. أهلاً بك!'
                      : 'Redirecting to KOWA Captain onboarding portal. Welcome aboard!'}
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Calculator Console */}
            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-neutral-800/80 dark:bg-[#10182C] border border-neutral-700/60 dark:border-line shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-700/50 dark:border-line">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-brand-lime" />
                    <span className="font-bold text-sm text-neutral-200">
                      {isAr ? 'حاسبة الدخل الصافي التقديري' : 'Net Earnings Calculator'}
                    </span>
                  </div>
                  <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-brand-lime font-bold">
                    {isAr ? 'بناءً على مشاوير الرياض' : 'Riyadh Benchmarks'}
                  </span>
                </div>

                {/* Slider 1: Hours per day */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-300 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-brand-lime" />
                      <span>{isAr ? 'ساعات القيادة يومياً:' : 'Daily driving hours:'}</span>
                    </span>
                    <span className="text-base text-brand-lime font-en">{hours} {isAr ? 'ساعات' : 'hrs'}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    step="1"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full accent-brand-lime cursor-pointer bg-neutral-700 h-2 rounded-lg"
                    aria-label="Hours slider"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>2 {isAr ? 'ساعات' : 'hrs'}</span>
                    <span>6 {isAr ? 'ساعات' : 'hrs'}</span>
                    <span>12 {isAr ? 'ساعة' : 'hrs'}</span>
                  </div>
                </div>

                {/* Slider 2: Days per week */}
                <div className="mb-8">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-300 mb-2">
                    <span>{isAr ? 'أيام العمل أسبوعياً:' : 'Working days per week:'}</span>
                    <span className="text-base text-brand-lime font-en">{days} {isAr ? 'أيام' : 'days'}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    step="1"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full accent-brand-lime cursor-pointer bg-neutral-700 h-2 rounded-lg"
                    aria-label="Days slider"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>1 {isAr ? 'يوم' : 'day'}</span>
                    <span>5 {isAr ? 'أيام' : 'days'}</span>
                    <span>7 {isAr ? 'أيام' : 'days'}</span>
                  </div>
                </div>

                {/* Results Card */}
                <div className="p-5 rounded-2xl bg-neutral-900/90 dark:bg-[#0A0F1D] border border-neutral-700/40 dark:border-line">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="border-l border-neutral-700/60 rtl:border-l rtl:border-r-0 ltr:border-r ltr:border-l-0">
                      <span className="text-[11px] text-neutral-400 font-bold block mb-1">
                        {isAr ? 'الدخل الأسبوعي التقديري' : 'Est. Weekly Net'}
                      </span>
                      <span className="text-2xl font-black text-white font-en">
                        {weekly.toLocaleString()}{' '}
                        <span className="text-xs text-brand-lime font-sans">{isAr ? 'ر.س' : 'SAR'}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-neutral-400 font-bold block mb-1">
                        {isAr ? 'الدخل الشهري التقديري' : 'Est. Monthly Net'}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-brand-lime font-en">
                        {monthly.toLocaleString()}{' '}
                        <span className="text-xs text-white font-sans">{isAr ? 'ر.س' : 'SAR'}</span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] text-neutral-400 text-center">
                    {isAr
                      ? '* الحساب تقديري صافي بعد استقطاع تكلفة الوقود وعمولة المنصة 15%، ويتفاوت بحسب الحوافز وساعات الذروة.'
                      : '* Net estimates account for fuel expenses and the 15% platform fee; actual earnings may vary with incentives.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Captain Qualification Modal */}
      <CaptainModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
