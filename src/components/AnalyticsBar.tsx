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
      badge: isAr ? 'ثقة متنامية' : 'Growing Trust',
      icon: Users,
    },
    {
      value: '+318',
      label: isAr ? 'سائق نشط ومعتمد' : 'Active Verified Captains',
      subtext: isAr ? 'نخبة كباتن سعوديين' : 'Elite Saudi Captains',
      badge: isAr ? 'فحص أمني 100%' : '100% Vetted',
      icon: ShieldCheck,
    },
    {
      value: isAr ? '12 د' : '12 min',
      label: isAr ? 'متوسط وقت الوصول' : 'Average Arrival Time',
      subtext: isAr ? 'دقة مواعيد وسرعة استجابة' : 'Punctual & Responsive',
      badge: isAr ? 'استجابة سريعة' : 'Fast Response',
      icon: Clock,
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-[#0A0F1D] border-b border-neutral-200 dark:border-line transition-colors duration-200 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statistics.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-neutral-50/70 dark:bg-[#10182C] border border-neutral-200/80 dark:border-line hover:border-brand/30 dark:hover:border-primary-token/40 hover:shadow-subtle transition-all duration-300 flex items-center gap-5 group"
              >
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-brand/5 dark:bg-brand-lime/10 border border-brand/10 dark:border-brand-lime/20 text-brand dark:text-brand-lime flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <IconComponent className="w-7 h-7" />
                </div>

                {/* Numbers and Labels */}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-ink font-en leading-none">
                      {stat.value}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-brand/5 dark:bg-brand-lime/10 text-brand dark:text-brand-lime border border-brand/10 dark:border-brand-lime/20">
                      {stat.badge}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-neutral-800 dark:text-ink">
                    {stat.label}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-ink-muted">
                    {stat.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
