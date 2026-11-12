'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import Counter from './Counter';
import { CmsIcon } from './CmsIcon';

export const AnalyticsBar: React.FC = () => {
  const { pick } = useLanguage();
  const { sections } = useWebsiteConfig();
  const data = sections.analytics_bar;

  const items = (data?.items || []).filter((stat) => {
    if (
      stat.isEnabled === false ||
      stat.numeric === null ||
      stat.numeric === undefined ||
      String(stat.numeric).trim() === ''
    ) {
      return false;
    }
    const parsed = Number(stat.numeric);
    return Number.isFinite(parsed);
  });

  if (!data || items.length === 0) return null;

  return (
    <section className="w-full bg-white dark:bg-[#0A0F1D] border-b border-neutral-200 dark:border-line transition-colors duration-200 py-8 lg:py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 ${
            items.length === 2 ? 'md:grid-cols-2' : items.length >= 3 ? 'md:grid-cols-3' : ''
          } gap-6`}
        >
          {items.map((stat, index) => {
            const label = pick(stat.label);
            const subtext = pick(stat.subtext);
            const badge = pick(stat.badge);
            const suffix = pick(stat.suffix);

            return (
              <motion.div
                key={stat.id || index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl bg-neutral-50/70 dark:bg-[#10182C] border border-neutral-200/80 dark:border-line hover:border-brand/30 dark:hover:border-primary-token/40 hover:shadow-subtle transition-all duration-300 flex items-center gap-5 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand/5 dark:bg-brand-lime/10 border border-brand/10 dark:border-brand-lime/20 text-brand dark:text-brand-lime flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-brand dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-brand transition-all duration-200">
                  <CmsIcon name={stat.icon} className="w-7 h-7" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-ink font-en leading-none">
                      <Counter
                        to={Number(stat.numeric)}
                        prefix={stat.prefix || ''}
                        suffix={suffix}
                        duration={2.0 + index * 0.3}
                      />
                    </span>
                    {badge ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-brand/5 dark:bg-brand-lime/10 text-brand dark:text-brand-lime border border-brand/10 dark:border-brand-lime/20">
                        {badge}
                      </span>
                    ) : null}
                  </div>

                  <div className="text-sm font-bold text-neutral-800 dark:text-ink">{label}</div>
                  {subtext ? (
                    <div className="text-xs text-neutral-500 dark:text-ink-muted">{subtext}</div>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
