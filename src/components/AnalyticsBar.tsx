'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Users, ShieldCheck, Clock } from 'lucide-react';

export const AnalyticsBar: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  const statistics = [
    {
      value: '+12,000',
      label: isAr ? 'مستخدم مسجَّل' : 'Registered Users',
      subtext: isAr ? 'في مختلف مناطق المملكة' : 'Across the Kingdom',
      icon: Users,
    },
    {
      value: '+318',
      label: isAr ? 'سائق نشط ومعتمد' : 'Active Verified Captains',
      subtext: isAr ? 'نخبة كباتن سعوديين' : 'Elite Saudi Captains',
      icon: ShieldCheck,
    },
    {
      value: isAr ? '12 د' : '12 min',
      label: isAr ? 'متوسط وقت الوصول' : 'Average Arrival Time',
      subtext: isAr ? 'دقة مواعيد وسرعة استجابة' : 'Punctual & Responsive',
      icon: Clock,
    },
  ];

  return (
    <div className="w-full bg-[#140959] dark:bg-[#070B14] border-y border-[#1F0F8C]/40 dark:border-line text-white shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/10 dark:divide-line">
          {statistics.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="py-6 sm:py-8 px-6 flex items-center justify-center gap-4 text-center md:text-right rtl:md:text-right ltr:md:text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/15 dark:border-line flex items-center justify-center text-brand-lime shrink-0">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-white font-en leading-none mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-brand-lime">
                    {stat.label}
                  </div>
                  <div className="text-xs text-neutral-300 dark:text-ink-subtle">
                    {stat.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
