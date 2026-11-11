'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Headphones,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import MagneticButton from './MagneticButton';
import { CmsIcon } from './CmsIcon';
import { isSafeHref, normalizeWhatsappHref } from '@/lib/cms-helpers';

export const FAQSection: React.FC = () => {
  const { isRtl, pick } = useLanguage();
  const { sections, platform, site } = useWebsiteConfig();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const data = sections.faq;

  const faqItems = useMemo(
    () => (data?.items || []).filter((item) => item.isEnabled !== false),
    [data?.items]
  );

  const defaultOpenId = useMemo(() => {
    const def = faqItems.find((item) => item.isDefaultOpen);
    return def?.id ?? faqItems[0]?.id ?? null;
  }, [faqItems]);

  const [selectedOpenId, setSelectedOpenId] = useState<string | null | undefined>(undefined);
  const openId = selectedOpenId === undefined ? defaultOpenId : selectedOpenId;

  if (!data) return null;

  const metrics = (data.supportCard?.metrics || []).filter((m) => m.isEnabled !== false);
  const whatsappHref = normalizeWhatsappHref(platform?.whatsapp, site?.socials || []);
  const primaryHref = isSafeHref(data.supportCard?.primaryCta?.href)
    ? data.supportCard.primaryCta.href
    : '#contact';

  const toggleFaq = (id: string) => {
    setSelectedOpenId((prev) => {
      const current = prev === undefined ? defaultOpenId : prev;
      return current === id ? null : id;
    });
  };

  return (
    <section
      id="faq"
      className="py-16 lg:py-24 bg-white dark:bg-[#0A0F1D] border-t border-neutral-200 dark:border-line relative overflow-hidden transition-colors duration-200"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-1/4 w-96 h-96 bg-brand/5 dark:bg-brand/15 rounded-full blur-3xl pointer-events-none -z-10"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-10 left-10 w-80 h-80 bg-brand-lime/10 dark:bg-brand-lime/5 rounded-full blur-3xl pointer-events-none -z-10"
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
            <HelpCircle className="w-3.5 h-3.5" />
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
                  stroke="#D3D93C"
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = openId === item.id;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-neutral-50/90 dark:bg-[#141E34] border-brand/30 dark:border-primary-token/50 shadow-elevated'
                      : 'bg-neutral-50/50 dark:bg-[#10182C] border-neutral-200 dark:border-line hover:border-brand/20 dark:hover:border-primary-token/30 shadow-subtle'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                    className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-right rtl:text-right ltr:text-left focus:outline-none group cursor-pointer"
                  >
                    <div className="flex-1">
                      {pick(item.category) ? (
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-black uppercase text-brand dark:text-brand-lime tracking-wider px-2 py-0.5 rounded-md bg-brand/5 dark:bg-brand-lime/10">
                            {pick(item.category)}
                          </span>
                        </div>
                      ) : null}
                      <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-ink leading-snug group-hover:text-brand dark:group-hover:text-brand-lime transition-colors">
                        {pick(item.question)}
                      </h3>
                    </div>

                    <div
                      className={`w-9 h-9 min-w-[36px] rounded-xl border flex items-center justify-center transition-all duration-300 shrink-0 ${
                        isOpen
                          ? 'bg-brand dark:bg-primary-solid text-brand-lime border-brand dark:border-primary-solid shadow-sm rotate-180'
                          : 'bg-white dark:bg-[#17223C] text-neutral-500 dark:text-ink-muted border-neutral-200 dark:border-line group-hover:border-brand/30'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen ? (
                      <motion.div
                        id={`faq-answer-${item.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-neutral-600 dark:text-ink-muted leading-relaxed border-t border-neutral-200/50 dark:border-line/60 mt-1">
                          {pick(item.answer)}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {data.supportCard ? (
            <motion.div
              initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="bg-gradient-to-br from-brand via-brand-dark to-neutral-900 dark:from-[#1F0F8C] dark:via-[#140959] dark:to-[#070B14] rounded-3xl p-8 sm:p-10 text-white shadow-elevated relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-lime/15 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-lime/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-lime text-neutral-900 text-xs font-black mb-6 shadow-sm">
                    <Headphones className="w-3.5 h-3.5" />
                    <span>{pick(data.supportCard.badge)}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3 leading-snug">
                    {pick(data.supportCard.title)}
                  </h3>

                  <p className="text-neutral-300 text-sm leading-relaxed mb-8">
                    {pick(data.supportCard.subtitle)}
                  </p>

                  {metrics.length > 0 ? (
                    <div className="space-y-3 mb-8">
                      {metrics.map((metric) => (
                        <div
                          key={metric.id}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/15 dark:border-white/10"
                        >
                          <div className="w-8 h-8 rounded-lg bg-brand-lime/20 flex items-center justify-center text-brand-lime shrink-0">
                            <CmsIcon name={metric.icon} className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{pick(metric.value)}</p>
                            <p className="text-[11px] text-neutral-300">{pick(metric.label)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="relative z-10 pt-4 border-t border-white/15 flex flex-col sm:flex-row gap-3">
                  <MagneticButton strength={0.25} href={primaryHref} className="flex-1">
                    <span className="w-full py-3 px-4 rounded-xl bg-brand-lime text-neutral-900 font-bold text-xs hover:bg-brand-accent-hover transition flex items-center justify-center gap-2 shadow-sm whitespace-nowrap cursor-pointer">
                      <span>{pick(data.supportCard.primaryCta?.label)}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </span>
                  </MagneticButton>

                  {whatsappHref ? (
                    <MagneticButton
                      strength={0.25}
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer">
                        <MessageCircle className="w-3.5 h-3.5 text-brand-lime" />
                        <span>{pick(data.supportCard.whatsappLabel)}</span>
                      </span>
                    </MagneticButton>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
