'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { CATEGORIES } from '@/data/translations';
import { Users, Clock, Sparkles, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import MagneticButton from './MagneticButton';

export const FleetCategories: React.FC = () => {
  const { locale, isRtl } = useLanguage();
  const isAr = locale === 'ar';
  const [activeTab, setActiveTab] = useState<'eco' | 'comfort' | 'business' | 'family'>('comfort');

  const currentCategory = CATEGORIES.find((cat) => cat.id === activeTab) || CATEGORIES[1];

  return (
    <section className="py-16 lg:py-24 bg-neutral-50 dark:bg-[#0A0F1D] border-y border-neutral-200 dark:border-line transition-colors duration-200 overflow-hidden" id="categories">
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
              {isAr ? 'الفئات والأسطول' : 'Fleet & Categories'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-ink mt-3 mb-2">
              {isAr ? 'اختر الفئة التي تناسب مشوارك بدقة' : 'Select the Tailored Class for Your Ride'}
            </h2>
            <p className="text-neutral-600 dark:text-ink-muted text-sm sm:text-base">
              {isAr
                ? 'خيارات مرنة ومحددة تلبي مشاويرك السريعة، مشاوير الاجتماعات الفاخرة، أو رحلات العائلة والمطارات.'
                : 'Flexible tailored options for your quick errands, corporate executive transfers, or spacious family airport departures.'}
            </p>
          </div>

          {/* Tab Controls with animated selection pill */}
          <div className="inline-flex p-1.5 bg-white dark:bg-[#10182C] border border-neutral-200 dark:border-line rounded-2xl shadow-subtle shrink-0">
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id as 'eco' | 'comfort' | 'business' | 'family')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-brand dark:bg-primary-solid text-white shadow-md'
                      : 'bg-transparent text-neutral-600 dark:text-ink-muted hover:text-neutral-900 dark:hover:text-ink hover:bg-neutral-100 dark:hover:bg-[#17223C]'
                  }`}
                >
                  {isAr ? cat.title.ar.split(' ')[1] || cat.title.ar : cat.id.toUpperCase()}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content Showcase Card with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white dark:bg-[#10182C] rounded-3xl p-6 sm:p-10 border border-neutral-200 dark:border-line shadow-elevated transition-colors duration-200"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="category-details">
              {/* Details Column */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-brand/10 dark:bg-brand-lime/10 text-brand dark:text-brand-lime text-xs font-black">
                      {isAr ? currentCategory.badge.ar : currentCategory.badge.en}
                    </span>
                    <span className="text-xs text-neutral-400 dark:text-ink-subtle font-bold">
                      {isAr ? currentCategory.vehicles.ar : currentCategory.vehicles.en}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-ink mb-4">
                    {isAr ? currentCategory.title.ar : currentCategory.title.en}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-ink-muted leading-relaxed mb-6">
                    {isAr ? currentCategory.desc.ar : currentCategory.desc.en}
                  </p>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                    <div className="bg-neutral-50 dark:bg-[#17223C] p-3 rounded-2xl border border-neutral-200/80 dark:border-line">
                      <div className="flex items-center gap-1.5 text-neutral-400 dark:text-ink-subtle text-[11px] font-bold mb-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{isAr ? 'السعة' : 'Capacity'}</span>
                      </div>
                      <div className="text-sm font-black text-neutral-900 dark:text-ink">
                        {isAr ? currentCategory.capacity.ar : currentCategory.capacity.en}
                      </div>
                    </div>

                    <div className="bg-neutral-50 dark:bg-[#17223C] p-3 rounded-2xl border border-neutral-200/80 dark:border-line">
                      <div className="flex items-center gap-1.5 text-neutral-400 dark:text-ink-subtle text-[11px] font-bold mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{isAr ? 'متوسط الوصول' : 'Avg Arrival'}</span>
                      </div>
                      <div className="text-sm font-black text-neutral-900 dark:text-ink">
                        {isAr ? '3 - 5 دقائق' : '3 - 5 mins'}
                      </div>
                    </div>

                    <div className="bg-neutral-50 dark:bg-[#17223C] p-3 rounded-2xl border border-neutral-200/80 dark:border-line col-span-2 sm:col-span-1">
                      <div className="flex items-center gap-1.5 text-neutral-400 dark:text-ink-subtle text-[11px] font-bold mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isAr ? 'الميزات' : 'Features'}</span>
                      </div>
                      <div className="text-sm font-black text-brand dark:text-brand-lime">
                        {isAr ? 'مكيفة 100% وشاحن' : 'AC & Fast USB'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action Row */}
                <div className="pt-6 border-t border-neutral-100 dark:border-line flex items-center justify-between">
                  <div>
                    <span className="text-xs text-neutral-400 dark:text-ink-subtle block font-bold">
                      {isAr ? 'يبدأ المشوار من' : 'Starting from'}
                    </span>
                    <span className="text-2xl font-black text-neutral-900 dark:text-ink font-en">
                      {isAr ? currentCategory.price.ar : currentCategory.price.en}
                    </span>
                  </div>
                  <MagneticButton strength={0.25} href="#fare-calculator">
                    <span className="py-3 px-6 rounded-2xl bg-neutral-900 dark:bg-card hover:bg-neutral-800 dark:hover:bg-elevated border border-neutral-700 dark:border-line text-white font-bold text-sm flex items-center gap-2 transition cursor-pointer">
                      <span>{isAr ? 'احسب تسعيرة هذه الفئة' : 'Estimate This Class'}</span>
                      {isRtl ? (
                        <ArrowLeft className="w-4 h-4 text-brand-lime" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-brand-lime" />
                      )}
                    </span>
                  </MagneticButton>
                </div>
              </div>

              {/* Vehicle Image Frame with Glass Spec Chip */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl overflow-hidden bg-neutral-100 dark:bg-[#17223C] relative group aspect-[16/10] border border-neutral-200 dark:border-line">
                  <Image
                    alt={isAr ? currentCategory.title.ar : currentCategory.title.en}
                    src={currentCategory.image}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white text-xs font-bold">
                    <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                      <ShieldCheck className="w-4 h-4 text-brand-lime" />
                      <span>{isAr ? 'فحص جودة أسبوعي معتمد' : 'Certified Weekly Inspection'}</span>
                    </div>
                    <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 font-en">
                      2024 MODEL
                    </span>
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
