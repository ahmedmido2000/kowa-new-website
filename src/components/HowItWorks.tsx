'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  const stepsData = [
    {
      number: isAr ? '١' : '1',
      icon: '/step-icon-1.svg',
      title: isAr ? 'حمّل التطبيق في ثوانٍ' : 'Download the App in Seconds',
      description: isAr
        ? 'متوفر مجاناً على منصتي App Store و Google Play'
        : 'Available free on both App Store and Google Play.',
    },
    {
      number: isAr ? '٢' : '2',
      icon: '/step-icon-2.svg',
      title: isAr ? 'حدّد وجهتك واختر فئتك' : 'Set Destination & Class',
      description: isAr
        ? 'اختر نوع المركبة وتأكد من السعر والمسار قبل الطلب'
        : 'Select your vehicle class and review fixed fare and route upfront.',
    },
    {
      number: isAr ? '٣' : '3',
      icon: '/step-icon-3.svg',
      title: isAr ? 'استمتع بأرقى تجربة تنقل' : 'Enjoy Premium Mobility',
      description: isAr
        ? 'سائق محترف ومركبة مكيفة ومجهزة تصلك فوراً'
        : 'An elite captain in a climate-controlled, equipped vehicle arrives in minutes.',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative w-full py-20 lg:py-28 px-4 sm:px-8 lg:px-12 overflow-hidden bg-gradient-to-b from-[#190B74] via-[#1F0F8C]/90 to-[#F8FAFD] dark:from-[#060913] dark:via-[#0A0F1D] dark:to-[#0A0F1D] border-b border-neutral-200 dark:border-line transition-colors duration-200"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center relative z-10">
        {/* Row 1: Header Area with Left & Right City Illustrations */}
        <div className="relative w-full min-h-[180px] lg:min-h-[220px] flex items-center justify-center mb-6">
          {/* Right Image Illustration (City Skyline) */}
          <div className="hidden lg:block absolute -right-6 bottom-0 max-w-[340px] xl:max-w-[420px] pointer-events-none opacity-90 dark:opacity-60">
            <Image
              src="/steps-1.png"
              alt="خطوات التنقل الذكي مع كوا"
              width={420}
              height={260}
              className="w-full h-auto object-contain object-bottom"
            />
          </div>

          {/* Left Image Illustration (3D Pin with road & car) */}
          <div className="hidden lg:block absolute -left-6 bottom-0 max-w-[320px] xl:max-w-[380px] pointer-events-none opacity-90 dark:opacity-60">
            <Image
              src="/steps-2.webp"
              alt="اختر وجهتك بسهولة مع كوا"
              width={380}
              height={240}
              className="w-full h-auto object-contain object-bottom"
            />
          </div>

          {/* Center Text Block */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto px-4 py-4">
            <span className="text-xs font-black uppercase text-brand-lime tracking-widest bg-brand-lime/10 px-3 py-1 rounded-full border border-brand-lime/20 inline-block mb-3">
              {isAr ? 'كيف يعمل كوا' : 'How It Works'}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              {isAr ? 'ثلاث خطوات ذكية تفصلك عن وجهتك' : 'Three Smart Steps to Your Destination'}
            </h2>
            <p className="text-sm sm:text-base font-semibold text-neutral-200 dark:text-ink-muted leading-relaxed mt-3 max-w-lg">
              {isAr
                ? 'تجربة سلسة وفورية تبدأ من شاشة هاتفك وحتى وصولك آمناً ومستمتعاً.'
                : 'A seamless, frictionless experience starting from your screen to your safe, delightful arrival.'}
            </p>
          </div>
        </div>

        {/* Row 2: 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full z-10 relative">
          {stepsData.map((step, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#10182C] rounded-3xl p-8 lg:p-10 flex flex-col items-center text-center space-y-3 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 border border-neutral-200/80 dark:border-line shadow-subtle group"
            >
              {/* Icon Box Container with Arabic Number Circle */}
              <div className="relative mb-2">
                {/* Icon Box */}
                <div className="w-16 h-16 bg-[#1F0F8C]/10 dark:bg-primary-token/20 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Image
                    src={step.icon}
                    alt={step.title}
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>

                {/* Number Badge */}
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#F5A623] dark:bg-brand-lime rounded-full flex items-center justify-center shadow-md">
                  <span className="text-xs font-black text-neutral-950 leading-none">
                    {step.number}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-neutral-900 dark:text-ink pt-1">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-ink-muted leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
