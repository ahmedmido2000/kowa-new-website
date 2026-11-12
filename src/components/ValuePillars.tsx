'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import TiltCard from './TiltCard';
import { CmsIcon } from './CmsIcon';

const BADGE_STYLE_MAP: Record<string, string> = {
  lime: 'bg-brand dark:bg-white text-white dark:text-brand font-black',
  emerald: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300',
  neutral: 'bg-neutral-200 dark:bg-[#1C2A4A] text-neutral-800 dark:text-neutral-200',
};

export const ValuePillars: React.FC = () => {
  const { pick } = useLanguage();
  const { sections } = useWebsiteConfig();
  const data = sections.value_pillars;

  if (!data) return null;

  const pillars = (data.pillars || []).filter((p) => p.isEnabled !== false);

  return (
    <section
      className="py-16 lg:py-24 bg-white dark:bg-[#0A0F1D] transition-colors duration-200 overflow-hidden"
      id="value-pillars"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-black uppercase text-brand dark:text-brand-lime tracking-widest bg-brand/5 dark:bg-brand-lime/10 px-3 py-1 rounded-full border border-brand/10 dark:border-brand-lime/20 inline-block mb-3">
            {pick(data.badge)}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-ink mt-2 mb-4">
            {pick(data.headline)}
          </h2>
          <p className="text-neutral-600 dark:text-ink-muted text-sm sm:text-base leading-relaxed">
            {pick(data.subtitle)}
          </p>
        </motion.div>

        {pillars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => {
              const badgeClass = BADGE_STYLE_MAP[pillar.badgeStyle] || BADGE_STYLE_MAP.neutral;

              return (
                <motion.div
                  key={pillar.id || idx}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TiltCard
                    maxTilt={6}
                    glare={true}
                    className="h-full p-8 rounded-3xl bg-neutral-50/70 dark:bg-[#10182C] border border-neutral-200 dark:border-line hover:border-brand/30 dark:hover:border-primary-token/40 shadow-subtle hover:shadow-elevated transition-colors duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-brand dark:bg-primary-solid text-white flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#2563EB] dark:group-hover:bg-white dark:group-hover:text-brand transition-all duration-300 shadow-sm">
                        <CmsIcon name={pillar.icon} className="w-7 h-7" />
                      </div>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-ink">
                          {pick(pillar.title)}
                        </h3>
                        {pick(pillar.badge) ? (
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${badgeClass}`}
                          >
                            {pick(pillar.badge)}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-ink-muted leading-relaxed mb-6">
                        {pick(pillar.description)}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-neutral-200/60 dark:border-line flex items-center gap-2 text-xs font-bold text-brand dark:text-brand-lime">
                      <CmsIcon
                        name={pillar.featureIcon}
                        className="w-4 h-4 text-brand dark:text-brand-lime shrink-0"
                      />
                      <span>{pick(pillar.featureText)}</span>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};
