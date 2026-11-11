'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import MagneticButton from './MagneticButton';
import { isSafeHref } from '@/lib/cms-helpers';

export const FleetCategories: React.FC = () => {
  const { isRtl, pick } = useLanguage();
  const { sections } = useWebsiteConfig();
  const data = sections.fleet_categories;

  const categories = useMemo(
    () => (data?.categories || []).filter((cat) => cat.isEnabled !== false),
    [data?.categories]
  );

  const [selectedId, setSelectedId] = useState<string>('');

  const defaultActiveCategoryId = data?.defaultActiveCategoryId;

  const activeCategory = useMemo(() => {
    if (selectedId) {
      const exact = categories.find((c) => c.id === selectedId);
      if (exact) return exact;
    }
    if (defaultActiveCategoryId) {
      const configured = categories.find((c) => c.id === defaultActiveCategoryId);
      if (configured) return configured;
    }
    return categories[0] || null;
  }, [categories, selectedId, defaultActiveCategoryId]);

  if (!data || !activeCategory) return null;

  const rawModelYear = data.modelYearBadge;
  const modelYearBadge =
    rawModelYear && 'text' in rawModelYear
      ? rawModelYear.isEnabled !== false
        ? pick(rawModelYear.text)
        : ''
      : pick(rawModelYear);
  const inspectionBadge = pick(data.inspectionBadge);
  const imgUrl =
    activeCategory.image?.url && isSafeHref(activeCategory.image.url)
      ? activeCategory.image.url
      : '/hero-bg-kowa.jpg';

  return (
    <section
      className="py-16 lg:py-24 bg-neutral-50 dark:bg-[#0A0F1D] border-y border-neutral-200 dark:border-line transition-colors duration-200 overflow-hidden"
      id="categories"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="max-w-xl text-right rtl:text-right ltr:text-left">
            <span className="text-xs font-black uppercase text-brand dark:text-brand-lime tracking-widest bg-brand/10 dark:bg-brand-lime/10 px-3 py-1 rounded-full border border-brand/15 dark:border-brand-lime/20">
              {pick(data.badge)}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-ink mt-3 mb-2">
              {pick(data.headline)}
            </h2>
            <p className="text-neutral-600 dark:text-ink-muted text-sm sm:text-base">
              {pick(data.subtitle)}
            </p>
          </div>

          <div className="inline-flex flex-wrap p-1.5 bg-white dark:bg-[#10182C] border border-neutral-200 dark:border-line rounded-2xl shadow-subtle shrink-0">
            {categories.map((cat) => {
              const isActive = activeCategory.id === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedId(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-brand dark:bg-primary-solid text-white shadow-md'
                      : 'bg-transparent text-neutral-600 dark:text-ink-muted hover:text-neutral-900 dark:hover:text-ink hover:bg-neutral-100 dark:hover:bg-[#17223C]'
                  }`}
                >
                  {pick(cat.tabLabel)}
                </button>
              );
            })}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white dark:bg-[#10182C] rounded-3xl p-6 sm:p-10 border border-neutral-200 dark:border-line shadow-elevated transition-colors duration-200"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="category-details">
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-brand/10 dark:bg-brand-lime/10 text-brand dark:text-brand-lime text-xs font-black">
                      {pick(activeCategory.badge)}
                    </span>
                    <span className="text-xs text-neutral-400 dark:text-ink-subtle font-bold">
                      {pick(activeCategory.vehicles)}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-ink mb-4">
                    {pick(activeCategory.title)}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-ink-muted leading-relaxed mb-6">
                    {pick(activeCategory.desc)}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                    <div className="bg-neutral-50 dark:bg-[#17223C] p-3 rounded-2xl border border-neutral-200/80 dark:border-line">
                      <div className="flex items-center gap-1.5 text-neutral-400 dark:text-ink-subtle text-[11px] font-bold mb-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{pick(data.labels?.capacity)}</span>
                      </div>
                      <div className="text-sm font-black text-neutral-900 dark:text-ink">
                        {pick(activeCategory.capacity)}
                      </div>
                    </div>

                    <div className="bg-neutral-50 dark:bg-[#17223C] p-3 rounded-2xl border border-neutral-200/80 dark:border-line">
                      <div className="flex items-center gap-1.5 text-neutral-400 dark:text-ink-subtle text-[11px] font-bold mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{pick(data.labels?.avgArrival)}</span>
                      </div>
                      <div className="text-sm font-black text-neutral-900 dark:text-ink">
                        {pick(activeCategory.eta)}
                      </div>
                    </div>

                    <div className="bg-neutral-50 dark:bg-[#17223C] p-3 rounded-2xl border border-neutral-200/80 dark:border-line col-span-2 sm:col-span-1">
                      <div className="flex items-center gap-1.5 text-neutral-400 dark:text-ink-subtle text-[11px] font-bold mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{pick(data.labels?.features)}</span>
                      </div>
                      <div className="text-sm font-black text-brand dark:text-brand-lime">
                        {pick(activeCategory.feature)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 dark:border-line flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <span className="text-xs text-neutral-400 dark:text-ink-subtle block font-bold">
                      {pick(data.labels?.startingFrom)}
                    </span>
                    <span className="text-2xl font-black text-neutral-900 dark:text-ink">
                      {pick(activeCategory.startingPrice)}
                    </span>
                  </div>
                  <MagneticButton strength={0.25} href="#fare-calculator">
                    <span className="py-3 px-6 rounded-2xl bg-neutral-900 dark:bg-card hover:bg-neutral-800 dark:hover:bg-elevated border border-neutral-700 dark:border-line text-white font-bold text-sm flex items-center gap-2 transition cursor-pointer">
                      <span>{pick(data.labels?.cta)}</span>
                      {isRtl ? (
                        <ArrowLeft className="w-4 h-4 text-brand-lime" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-brand-lime" />
                      )}
                    </span>
                  </MagneticButton>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl overflow-hidden bg-neutral-100 dark:bg-[#17223C] relative group aspect-[16/10] border border-neutral-200 dark:border-line">
                  <Image
                    alt={pick(activeCategory.image?.alt, pick(activeCategory.title))}
                    src={imgUrl}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white text-xs font-bold gap-2">
                    {inspectionBadge ? (
                      <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                        <ShieldCheck className="w-4 h-4 text-brand-lime" />
                        <span>{inspectionBadge}</span>
                      </div>
                    ) : null}
                    {modelYearBadge ? (
                      <span
                        dir="ltr"
                        className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 font-en"
                      >
                        {modelYearBadge}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
