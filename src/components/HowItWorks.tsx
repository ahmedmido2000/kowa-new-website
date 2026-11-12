'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import TiltCard from './TiltCard';
import MagneticButton from './MagneticButton';
import { CmsIcon } from './CmsIcon';
import { isSafeHref } from '@/lib/cms-helpers';

export const HowItWorks: React.FC = () => {
  const { isRtl, pick } = useLanguage();
  const { sections } = useWebsiteConfig();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const data = sections.how_it_works;
  if (!data) return null;

  const steps = (data.steps || []).filter((s) => s.isEnabled !== false);
  const footerPromo = data.footerPromo;
  const promoText =
    footerPromo?.promo && footerPromo.promo.isEnabled !== false
      ? pick(footerPromo.promo.text)
      : '';

  const getBadgeStyle = (index: number) => {
    if (index === 1) return 'bg-brand dark:bg-white text-white dark:text-brand font-black';
    if (index === 2) {
      return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40';
    }
    return 'bg-brand/10 dark:bg-brand-lime/10 text-brand dark:text-brand-lime border border-brand/15 dark:border-brand-lime/20';
  };

  return (
    <section
      id="how-it-works"
      className="py-16 lg:py-24 bg-neutral-50/70 dark:bg-[#070B14] border-b border-neutral-200 dark:border-line relative overflow-hidden transition-colors duration-200"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 right-1/4 w-96 h-96 bg-brand/10 dark:bg-brand/20 rounded-full blur-3xl pointer-events-none -z-10"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-10 left-10 w-96 h-96 bg-brand-lime/20 dark:bg-brand-lime/10 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-black uppercase text-brand dark:text-brand-lime tracking-widest bg-brand/5 dark:bg-brand-lime/10 px-3.5 py-1.5 rounded-full border border-brand/10 dark:border-brand-lime/20 inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand dark:bg-brand-lime animate-pulse" />
            <span>{pick(data.badge)}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-ink leading-tight tracking-tight">
            {pick(data.headline?.lead)}{' '}
            <span className="relative inline-block text-brand dark:text-brand-lime">
              {pick(data.headline?.highlight)}
              <svg
                className="absolute -bottom-1 left-0 w-full"
                height="7"
                preserveAspectRatio="none"
                viewBox="0 0 100 7"
              >
                <path
                  d="M0 5 Q 50 0 100 5"
                  fill="none"
                  stroke="#2563EB"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
            </span>
          </h2>
          <p className="text-neutral-600 dark:text-ink-muted text-sm sm:text-base leading-relaxed mt-4">
            {pick(data.subtitle)}
          </p>
        </motion.div>

        {steps.length > 0 ? (
          <div className="relative">
            <div className="hidden lg:block absolute top-16 left-24 right-24 h-0.5 bg-gradient-to-r from-brand/10 via-brand-lime/40 to-brand/10 dark:from-line dark:via-brand-lime/20 dark:to-line -z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.id || idx}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TiltCard
                    maxTilt={6}
                    glare={true}
                    className="h-full bg-white dark:bg-[#10182C] rounded-3xl p-8 lg:p-9 border border-neutral-200 dark:border-line hover:border-brand/30 dark:hover:border-primary-token/40 shadow-subtle hover:shadow-elevated transition-colors duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-brand dark:bg-primary-solid text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-[#2563EB] dark:group-hover:bg-white dark:group-hover:text-brand transition-all duration-300 shadow-sm">
                          <CmsIcon name={step.icon} className="w-7 h-7" />
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-black px-2.5 py-1 rounded-full ${getBadgeStyle(idx)}`}
                          >
                            {pick(step.badge)}
                          </span>
                          <span className="text-xs font-black font-en px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-[#17223C] text-neutral-600 dark:text-ink-muted border border-neutral-200/80 dark:border-line">
                            {step.stepNumber}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-neutral-900 dark:text-ink mb-3 group-hover:text-brand dark:group-hover:text-brand-lime transition-colors">
                        {pick(step.title)}
                      </h3>

                      <p className="text-sm text-neutral-600 dark:text-ink-muted leading-relaxed mb-6">
                        {pick(step.description)}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-200/60 dark:border-line flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-brand dark:text-brand-lime">
                        <CheckCircle2 className="w-4 h-4 text-brand dark:text-brand-lime shrink-0" />
                        <span>{pick(step.featureText)}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 dark:text-ink-subtle font-medium">
                        {pick(step.highlight)}
                      </span>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        ) : null}

        {footerPromo ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-white dark:bg-[#10182C] rounded-2xl p-4 sm:p-6 border border-neutral-200 dark:border-line flex flex-col sm:flex-row items-center justify-between gap-4 shadow-subtle"
          >
            <div className="flex items-center gap-3 text-center sm:text-right rtl:sm:text-right ltr:sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-brand/10 dark:bg-brand-lime/10 flex items-center justify-center text-brand dark:text-brand-lime shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900 dark:text-ink">
                  {pick(footerPromo.title)}
                </p>
                {promoText ? (
                  <p className="text-xs text-neutral-500 dark:text-ink-muted">{promoText}</p>
                ) : null}
              </div>
            </div>

            <MagneticButton
              strength={0.25}
              href={isSafeHref(footerPromo.ctaHref) ? footerPromo.ctaHref : '#download-banner'}
            >
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand dark:bg-primary-solid text-white font-bold text-xs hover:bg-brand-dark dark:hover:bg-brand shadow-sm hover:shadow-brand-glow transition-all whitespace-nowrap">
                <span>{pick(footerPromo.ctaLabel)}</span>
                <ArrowIcon className="w-4 h-4 text-white" />
              </span>
            </MagneticButton>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
};
