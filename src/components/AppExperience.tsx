'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import { CmsIcon } from './CmsIcon';
import { isSafeHref } from '@/lib/cms-helpers';

export const AppExperience: React.FC = () => {
  const { isRtl, pick } = useLanguage();
  const { sections } = useWebsiteConfig();

  const data = sections.app_experience;
  if (!data) return null;

  const features = (data.features || []).filter((f) => f.isEnabled !== false);
  const demo = data.phoneMockupDemo;
  const mapUrl = demo?.mapImage?.url && isSafeHref(demo.mapImage.url) ? demo.mapImage.url.trim() : '';

  return (
    <section
      className="py-16 lg:py-24 bg-white dark:bg-[#0A0F1D] overflow-hidden transition-colors duration-200"
      id="app-preview"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center order-2 lg:order-1"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[300px] sm:w-[320px] rounded-[48px] p-3 bg-neutral-900 shadow-2xl border-4 border-neutral-800 relative will-change-transform"
            >
              <div className="rounded-[38px] overflow-hidden bg-neutral-950 aspect-[393/852] border border-neutral-700/50 relative">
                {mapUrl ? (
                  <Image
                    alt={pick(
                      demo?.mapImage?.alt,
                      isRtl ? 'معاينة تطبيق كوا' : 'KOWA app preview'
                    )}
                    src={mapUrl}
                    fill
                    unoptimized
                    className="object-cover object-top"
                    sizes="320px"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="w-full h-full bg-gradient-to-br from-[#0F172A] via-[#1A1354] to-[#111827] flex items-center justify-center"
                  >
                    <Smartphone className="w-12 h-12 text-white/80" />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          <div className="lg:col-span-7 order-1 lg:order-2 text-right rtl:text-right ltr:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-black uppercase text-brand dark:text-brand-lime tracking-widest bg-brand/5 dark:bg-brand-lime/10 px-3 py-1 rounded-full border border-brand/10 dark:border-brand-lime/20">
                {pick(data.badge)}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-ink mt-3 mb-4">
                {pick(data.headline)}
              </h2>
              <p className="text-neutral-600 dark:text-ink-muted text-sm sm:text-base leading-relaxed mb-8">
                {pick(data.subtitle)}
              </p>
            </motion.div>

            <div className="space-y-4">
              {features.map((feat, idx) => (
                <motion.div
                  key={feat.id || idx}
                  initial={{ opacity: 0, x: isRtl ? 25 : -25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: isRtl ? -6 : 6, transition: { duration: 0.2 } }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50/40 dark:bg-[#10182C]/40 hover:bg-neutral-50 dark:hover:bg-[#10182C] transition-all border border-neutral-200/50 dark:border-line/50 hover:border-brand/30 dark:hover:border-primary-token/40 group cursor-default"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 dark:bg-primary-token/20 text-brand dark:text-brand-lime flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-brand dark:group-hover:bg-primary-solid group-hover:text-white transition-all duration-300">
                    <CmsIcon name={feat.icon} className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-ink mb-1 group-hover:text-brand dark:group-hover:text-brand-lime transition-colors">
                      {pick(feat.title)}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-ink-muted leading-relaxed">
                      {pick(feat.description)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
