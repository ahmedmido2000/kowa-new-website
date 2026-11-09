'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Users, ShieldCheck, Clock } from 'lucide-react';
import Counter from './Counter';

export const AnalyticsBar: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  const statistics = [
    {
      numeric: 12000,
      prefix: '+',
      suffix: '',
      label: isAr ? 'مستخدم مسجَّل' : 'Registered Users',
      subtext: isAr ? 'في مختلف مناطق المملكة' : 'Across the Kingdom',
      badge: isAr ? 'ثقة متنامية' : 'Growing Trust',
      icon: Users,
    },
    {
      numeric: 318,
      prefix: '+',
      suffix: '',
      label: isAr ? 'سائق نشط ومعتمد' : 'Active Verified Captains',
      subtext: isAr ? 'نخبة كباتن سعوديين' : 'Elite Saudi Captains',
      badge: isAr ? 'فحص أمني 100%' : '100% Vetted',
      icon: ShieldCheck,
    },
    {
      numeric: 12,
      prefix: '',
      suffix: isAr ? ' د' : ' min',
      label: isAr ? 'متوسط وقت الوصول' : 'Average Arrival Time',
      subtext: isAr ? 'دقة مواعيد وسرعة استجابة' : 'Punctual & Responsive',
      badge: isAr ? 'استجابة سريعة' : 'Fast Response',
      icon: Clock,
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-[#0A0F1D] border-b border-neutral-200 dark:border-line transition-colors duration-200 py-8 lg:py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statistics.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl bg-neutral-50/70 dark:bg-[#10182C] border border-neutral-200/80 dark:border-line hover:border-brand/30 dark:hover:border-primary-token/40 hover:shadow-subtle transition-all duration-300 flex items-center gap-5 group"
              >
                {/* Icon Container with subtle scale on hover */}
                <div className="w-14 h-14 rounded-2xl bg-brand/5 dark:bg-brand-lime/10 border border-brand/10 dark:border-brand-lime/20 text-brand dark:text-brand-lime flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-brand-lime group-hover:text-neutral-900 transition-all duration-200">
                  <IconComponent className="w-7 h-7" />
                </div>

                {/* Numbers with animated count-up and Labels */}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-ink font-en leading-none">
                      <Counter
                        to={stat.numeric}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        duration={2.0 + index * 0.3}
                      />
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
