'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { CATEGORIES } from '@/data/translations';
import { Users, Clock, Sparkles, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export const FleetCategories: React.FC = () => {
  const { locale, isRtl } = useLanguage();
  const isAr = locale === 'ar';
  const [activeTab, setActiveTab] = useState<'eco' | 'comfort' | 'business' | 'family'>('comfort');

  const currentCategory = CATEGORIES.find((cat) => cat.id === activeTab) || CATEGORIES[1];

  return (
    <section className="py-16 lg:py-24 bg-neutral-50 border-y border-neutral-200" id="categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl text-right rtl:text-right ltr:text-left">
            <span className="text-xs font-black uppercase text-brand tracking-widest bg-brand/10 px-3 py-1 rounded-full">
              {isAr ? 'الفئات والأسطول' : 'Fleet & Categories'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 mt-3 mb-2">
              {isAr ? 'اختر الفئة التي تناسب مشوارك بدقة' : 'Select the Tailored Class for Your Ride'}
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base">
              {isAr
                ? 'خيارات مرنة ومحددة تلبي مشاويرك السريعة، مشاوير الاجتماعات الفاخرة، أو رحلات العائلة والمطارات.'
                : 'Flexible tailored options for your quick errands, corporate executive transfers, or spacious family airport departures.'}
            </p>
          </div>

          {/* Tab Controls */}
          <div className="inline-flex p-1.5 bg-white border border-neutral-200 rounded-2xl shadow-subtle shrink-0">
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id as 'eco' | 'comfort' | 'business' | 'family')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-brand text-white shadow-md'
                      : 'bg-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {isAr ? cat.title.ar.split(' ')[1] || cat.title.ar : cat.id.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Showcase Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-elevated">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="category-details">
            {/* Details Column */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-black">
                    {isAr ? currentCategory.badge.ar : currentCategory.badge.en}
                  </span>
                  <span className="text-xs text-neutral-400 font-bold">
                    {isAr ? currentCategory.vehicles.ar : currentCategory.vehicles.en}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
                  {isAr ? currentCategory.title.ar : currentCategory.title.en}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                  {isAr ? currentCategory.desc.ar : currentCategory.desc.en}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200/80">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] font-bold mb-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{isAr ? 'السعة' : 'Capacity'}</span>
                    </div>
                    <div className="text-sm font-black text-neutral-900">
                      {isAr ? currentCategory.capacity.ar : currentCategory.capacity.en}
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200/80">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] font-bold mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{isAr ? 'وقت الوصول' : 'Average ETA'}</span>
                    </div>
                    <div className="text-sm font-black text-brand">
                      {isAr ? currentCategory.eta.ar : currentCategory.eta.en}
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200/80 col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] font-bold mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAr ? 'المزايا' : 'Features'}</span>
                    </div>
                    <div className="text-sm font-black text-neutral-900">
                      {isAr ? currentCategory.feature.ar : currentCategory.feature.en}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown & Trigger */}
              <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-right rtl:text-right ltr:text-left w-full sm:w-auto">
                  <span className="text-xs text-neutral-400 block font-bold">
                    {isAr ? 'تسعيرة فتح العداد الثابتة' : 'Fixed Starting Fare'}
                  </span>
                  <div className="text-2xl font-black text-brand">
                    {isAr ? currentCategory.price.ar : currentCategory.price.en}{' '}
                    <span className="text-xs font-normal text-neutral-400 font-sans">
                      {isAr ? 'تبدأ من' : 'starts from'}
                    </span>
                  </div>
                </div>
                <a
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand hover:bg-brand-dark text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition"
                  href="#hero"
                >
                  <span>{isAr ? 'احجز هذه الفئة الآن' : 'Book This Category'}</span>
                  {isRtl ? (
                    <ArrowLeft className="w-4 h-4 text-brand-lime" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-brand-lime" />
                  )}
                </a>
              </div>
            </div>

            {/* Vehicle Media Column */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden bg-neutral-100 relative group aspect-[16/10] border border-neutral-200 shadow-md">
                <Image
                  alt={currentCategory.carName}
                  src={currentCategory.image}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white text-xs font-bold">
                  <span className="bg-brand/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                    {currentCategory.carName}
                  </span>
                  <span className="bg-brand-lime text-neutral-900 px-2.5 py-1 rounded-lg font-black flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{isAr ? 'معتمدة رسمياً' : 'TGA Certified'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
