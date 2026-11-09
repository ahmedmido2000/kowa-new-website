'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Smartphone,
  MapPin,
  Car,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { locale, isRtl } = useLanguage();
  const isAr = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const stepsData = [
    {
      stepNumber: '01',
      icon: Smartphone,
      badge: isAr ? 'تحميل فوري' : 'Instant App',
      badgeColor: 'bg-brand/10 dark:bg-brand-lime/10 text-brand dark:text-brand-lime border border-brand/15 dark:border-brand-lime/20',
      title: isAr ? 'حمّل التطبيق في ثوانٍ' : 'Download the App in Seconds',
      description: isAr
        ? 'متوفر مجاناً على منصتي App Store و Google Play. تسجيل سريع وموثق برقم الجوال أو النفاذ الوطني في أقل من دقيقة.'
        : 'Available for free on the App Store and Google Play. Instant verified registration via mobile or Nafath in under a minute.',
      featureText: isAr ? 'متوافق مع iOS وأندرويد' : 'iOS & Android Ready',
      highlight: isAr ? 'App Store • Google Play' : 'App Store • Google Play',
    },
    {
      stepNumber: '02',
      icon: MapPin,
      badge: isAr ? 'تسعيرة عادلة' : 'Fixed Fare',
      badgeColor: 'bg-brand-lime text-neutral-900 font-black',
      title: isAr ? 'حدّد وجهتك واختر فئتك' : 'Set Destination & Vehicle Class',
      description: isAr
        ? 'اختر نوع المركبة وتأكد من السعر والمسار قبل الطلب. تسعيرة ثابتة 100% ومضمونة بدون أي زيادة ذروة أو رسوم خفية.'
        : 'Select your preferred vehicle class and confirm upfront fixed fares and exact route before booking—no surge multipliers.',
      featureText: isAr ? 'سعر مضمون ومثبت 100%' : '100% Guaranteed Lock',
      highlight: isAr ? 'إيكو • كومفورت • رجال أعمال' : 'Eco • Comfort • Business',
    },
    {
      stepNumber: '03',
      icon: Car,
      badge: isAr ? 'ضيافة نخبة' : 'Elite Ride',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40',
      title: isAr ? 'استمتع بأرقى تجربة تنقل' : 'Enjoy Premium Mobility',
      description: isAr
        ? 'سائق محترف ومركبة مكيفة ومجهزة تصلك فوراً. تتبع مسار رحلتك لحظة بلحظة واستمتع بضيافة سعودية معطرة مع أقصى درجات الأمان.'
        : 'An elite certified captain in a climate-controlled modern vehicle arrives in minutes with real-time GPS tracking and Saudi hospitality.',
      featureText: isAr ? 'كباتن معتمدون وسيارات 2023+' : 'Verified 2023+ Fleet',
      highlight: isAr ? 'تتبع فوري 24/7' : '24/7 Live Route Tracking',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-16 lg:py-24 bg-neutral-50/70 dark:bg-[#070B14] border-b border-neutral-200 dark:border-line relative overflow-hidden transition-colors duration-200"
    >
      {/* Subtle Ambient Background Glows matching our theme */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-brand/5 dark:bg-brand/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-lime/15 dark:bg-brand-lime/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase text-brand dark:text-brand-lime tracking-widest bg-brand/5 dark:bg-brand-lime/10 px-3.5 py-1.5 rounded-full border border-brand/10 dark:border-brand-lime/20 inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand dark:bg-brand-lime animate-pulse"></span>
            <span>{isAr ? 'خطوات سهلة وسريعة' : 'Easy & Instant Steps'}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-ink leading-tight tracking-tight">
            {isAr ? (
              <>
                ثلاث خطوات ذكية تفصلك عن{' '}
                <span className="relative inline-block text-brand dark:text-brand-lime">
                  وجهتك القادمة
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    height="7"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 7"
                  >
                    <path
                      d="M0 5 Q 50 0 100 5"
                      fill="none"
                      stroke="#D3D93C"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                  </svg>
                </span>
              </>
            ) : (
              <>
                Three Smart Steps to Your{' '}
                <span className="text-brand dark:text-brand-lime">
                  Next Destination
                </span>
              </>
            )}
          </h2>
          <p className="text-neutral-600 dark:text-ink-muted text-sm sm:text-base leading-relaxed mt-4">
            {isAr
              ? 'تجربة سلسة وفورية تبدأ من شاشة هاتفك وحتى وصولك آمناً ومستمتعاً، بدون أي تعقيد أو انتظار.'
              : 'A seamless, frictionless experience starting from your phone screen to your safe, comfortable arrival.'}
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="relative">
          {/* Subtle Desktop Connector Track behind cards */}
          <div className="hidden lg:block absolute top-16 left-24 right-24 h-0.5 bg-gradient-to-r from-brand/10 via-brand-lime/40 to-brand/10 dark:from-line dark:via-brand-lime/20 dark:to-line -z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {stepsData.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#10182C] rounded-3xl p-8 lg:p-9 border border-neutral-200 dark:border-line hover:border-brand/30 dark:hover:border-primary-token/40 hover:bg-white dark:hover:bg-[#17223C] hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group relative"
                >
                  <div>
                    {/* Top Header Row: Icon + Step Counter */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-brand dark:bg-primary-solid text-brand-lime flex items-center justify-center group-hover:scale-105 group-hover:bg-brand-lime group-hover:text-neutral-900 transition-all duration-200 shadow-sm">
                        <IconComponent className="w-7 h-7" />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${step.badgeColor}`}>
                          {step.badge}
                        </span>
                        <span className="text-xs font-black font-en px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-[#17223C] text-neutral-600 dark:text-ink-muted border border-neutral-200/80 dark:border-line">
                          {step.stepNumber}
                        </span>
                      </div>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-ink mb-3 group-hover:text-brand dark:group-hover:text-brand-lime transition-colors">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-sm text-neutral-600 dark:text-ink-muted leading-relaxed mb-6">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom Feature Pill & Highlight */}
                  <div className="pt-4 border-t border-neutral-200/60 dark:border-line flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-brand dark:text-brand-lime">
                      <CheckCircle2 className="w-4 h-4 text-brand dark:text-brand-lime shrink-0" />
                      <span>{step.featureText}</span>
                    </div>
                    <span className="text-[11px] text-neutral-400 dark:text-ink-subtle font-medium">
                      {step.highlight}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Action Footer Strip inside How It Works */}
        <div className="mt-12 bg-white dark:bg-[#10182C] rounded-2xl p-4 sm:p-6 border border-neutral-200 dark:border-line flex flex-col sm:flex-row items-center justify-between gap-4 shadow-subtle">
          <div className="flex items-center gap-3 text-center sm:text-right rtl:sm:text-right ltr:sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-brand-lime/20 dark:bg-brand-lime/10 flex items-center justify-center text-neutral-900 dark:text-brand-lime shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 dark:text-ink">
                {isAr ? 'جاهز للانطلاق بأول مشوار؟' : 'Ready for Your First Ride?'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-ink-muted">
                {isAr
                  ? 'استخدم كود KOWA20 للحصول على خصم 20% على أول ثلاث رحلات'
                  : 'Use promo code KOWA20 for 20% OFF on your first 3 rides'}
              </p>
            </div>
          </div>

          <a
            href="#download-banner"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand dark:bg-primary-solid text-white font-bold text-xs hover:bg-brand-dark dark:hover:bg-brand shadow-sm hover:shadow-brand-glow transition-all whitespace-nowrap shrink-0"
          >
            <span>{isAr ? 'تحميل التطبيق الآن' : 'Get the App Now'}</span>
            <ArrowIcon className="w-4 h-4 text-brand-lime" />
          </a>
        </div>
      </div>
    </section>
  );
};
