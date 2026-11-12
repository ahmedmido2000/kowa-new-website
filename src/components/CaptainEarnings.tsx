'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calculator, Clock, Headphones, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import { useSmoothScroll } from './SmoothScrollProvider';
import { CaptainModal } from './CaptainModal';
import MagneticButton from './MagneticButton';
import { CmsIcon } from './CmsIcon';

export const CaptainEarnings: React.FC = () => {
  const { locale, isRtl, pick } = useLanguage();
  const { sections } = useWebsiteConfig();
  const { scrollTo } = useSmoothScroll();
  const isAr = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const data = sections.captain_earnings;
  const calc = data?.calculator;

  const minHours = calc?.hoursSlider?.min ?? 1;
  const maxHours = calc?.hoursSlider?.max ?? 12;
  const defaultHours = calc?.hoursSlider?.default ?? 6;

  const minDays = calc?.daysSlider?.min ?? 1;
  const maxDays = calc?.daysSlider?.max ?? 7;
  const defaultDays = calc?.daysSlider?.default ?? 5;

  const [hours, setHours] = useState<number>(defaultHours);
  const [days, setDays] = useState<number>(defaultDays);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!data || !calc) return null;

  const clampedHours = Math.min(maxHours, Math.max(minHours, hours));
  const clampedDays = Math.min(maxDays, Math.max(minDays, days));
  const totalWeeklyHours = clampedHours * clampedDays;

  const hasApprovedRate =
    typeof calc.hourlyNetRate === 'number' && Number.isFinite(calc.hourlyNetRate) && calc.hourlyNetRate > 0;

  const weekly = hasApprovedRate ? Math.round(totalWeeklyHours * calc.hourlyNetRate!) : null;
  const monthly =
    weekly !== null ? Math.round(weekly * (calc.weeklyToMonthlyMultiplier || 4.3)) : null;

  const highlights = (data.highlights || []).filter((h) => h.isEnabled !== false);

  const handleJoinClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kowa:captain-inquiry', { detail: { subjectId: 'captain' } }));
    }
    scrollTo('#contact');
  };

  return (
    <>
      <section
        className="py-16 lg:py-24 bg-neutral-900 dark:bg-[#070B14] text-white relative overflow-hidden transition-colors duration-200"
        id="captain-earnings"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand/30 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/15 blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 text-right rtl:text-right ltr:text-left"
            >
              <span className="text-xs font-black uppercase text-white tracking-widest bg-white/15 px-3 py-1 rounded-full border border-white/25 inline-block mb-3">
                {pick(data.badge)}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-4 leading-tight">
                {pick(data.headline)}
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8">
                {pick(data.subtitle)}
              </p>

              {highlights.length > 0 ? (
                <div
                  className={`grid grid-cols-1 ${
                    highlights.length >= 2 ? 'sm:grid-cols-2' : ''
                  } gap-4 mb-8`}
                >
                  {highlights.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/35 transition"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0">
                        <CmsIcon name={item.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block">
                          {pick(item.title)}
                        </span>
                        <span className="text-xs text-neutral-400">{pick(item.description)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="flex items-center gap-4 flex-wrap">
                <MagneticButton strength={0.25} onClick={handleJoinClick}>
                  <span className="py-4 px-8 rounded-2xl bg-white text-brand font-black text-sm hover:bg-[#EFF6FF] transition flex items-center gap-2 shadow-lime-glow cursor-pointer group">
                    <span>{pick(data.primaryCta?.label)}</span>
                    <ArrowIcon className="w-4 h-4 text-brand group-hover:scale-110 transition-transform" />
                  </span>
                </MagneticButton>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition border border-white/10 flex items-center gap-2 cursor-pointer"
                >
                  <Headphones className="w-4 h-4 text-neutral-300" />
                  <span>{pick(data.criteriaCta?.label)}</span>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-neutral-800/80 dark:bg-[#10182C] border border-neutral-700/60 dark:border-line shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-700/50 dark:border-line gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-white" />
                    <span className="font-bold text-sm text-neutral-200">{pick(calc.title)}</span>
                  </div>
                  {pick(calc.benchmarkBadge) ? (
                    <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full text-white font-bold">
                      {pick(calc.benchmarkBadge)}
                    </span>
                  ) : null}
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-300 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-sky-300" />
                      <span>{pick(calc.hoursLabel)}</span>
                    </span>
                    <span className="text-base text-white font-en">
                      {clampedHours} {isAr ? 'ساعات' : 'hrs'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={minHours}
                    max={maxHours}
                    step="1"
                    value={clampedHours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer bg-neutral-700 h-2 rounded-lg"
                    aria-label="Hours slider"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-en">
                    <span>
                      {minHours} {isAr ? 'س' : 'h'}
                    </span>
                    <span>
                      {Math.round((minHours + maxHours) / 2)} {isAr ? 'س' : 'h'}
                    </span>
                    <span>
                      {maxHours} {isAr ? 'س' : 'h'}
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-300 mb-2">
                    <span>{pick(calc.daysLabel)}</span>
                    <span className="text-base text-white font-en">
                      {clampedDays} {isAr ? 'أيام' : 'days'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={minDays}
                    max={maxDays}
                    step="1"
                    value={clampedDays}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer bg-neutral-700 h-2 rounded-lg"
                    aria-label="Days slider"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-en">
                    <span>
                      {minDays} {isAr ? 'يوم' : 'd'}
                    </span>
                    <span>
                      {Math.round((minDays + maxDays) / 2)} {isAr ? 'أيام' : 'd'}
                    </span>
                    <span>
                      {maxDays} {isAr ? 'أيام' : 'd'}
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900/90 dark:bg-[#0A0F1D] border border-neutral-700/40 dark:border-line space-y-4">
                  {hasApprovedRate && weekly !== null && monthly !== null ? (
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="border-l border-neutral-700/60 rtl:border-l rtl:border-r-0 ltr:border-r ltr:border-l-0">
                        <span className="text-[11px] text-neutral-400 font-bold block mb-1">
                          {pick(calc.weeklyLabel)}
                        </span>
                        <motion.span
                          key={weekly}
                          initial={{ opacity: 0.6, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-2xl font-black text-white font-en inline-block"
                        >
                          {weekly.toLocaleString('en-US')}{' '}
                          <span className="text-xs text-sky-300 font-sans">
                            {isAr ? 'ر.س' : 'SAR'}
                          </span>
                        </motion.span>
                      </div>
                      <div>
                        <span className="text-[11px] text-neutral-400 font-bold block mb-1">
                          {pick(calc.monthlyLabel)}
                        </span>
                        <motion.span
                          key={monthly}
                          initial={{ opacity: 0.6, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-2xl sm:text-3xl font-black text-white font-en inline-block"
                        >
                          {monthly.toLocaleString('en-US')}{' '}
                          <span className="text-xs text-sky-300 font-sans">
                            {isAr ? 'ر.س' : 'SAR'}
                          </span>
                        </motion.span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-2 py-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {isAr
                            ? `جدول القيادة المختار: ${totalWeeklyHours} ساعة أسبوعياً`
                            : `Selected Schedule: ${totalWeeklyHours} hrs / week`}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-neutral-200 leading-relaxed">
                        {isAr
                          ? 'معدلات العائد قيد الاعتماد الرسمي من الإدارة وستظهر التقديرات هنا فور نشرها.'
                          : 'Earnings benchmark rates are pending official approval and will display here once configured.'}
                      </p>
                    </div>
                  )}

                  {pick(calc.demoNotice) ? (
                    <div className="flex items-start gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-[11px] text-neutral-300 leading-relaxed">
                      <Info className="w-3.5 h-3.5 text-sky-300 shrink-0 mt-0.5" />
                      <span>{pick(calc.demoNotice)}</span>
                    </div>
                  ) : null}

                  {pick(calc.disclaimer) ? (
                    <div className="pt-2 border-t border-neutral-800 text-[10px] text-neutral-400 text-center">
                      {pick(calc.disclaimer)}
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <CaptainModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
