'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { COMPANY_DATA } from '@/data/company';
import MagneticButton from './MagneticButton';
import {
  ChevronDown,
  Headphones,
  ShieldCheck,
  Clock,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { locale, isRtl } = useLanguage();
  const isAr = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [openId, setOpenId] = useState<number | null>(1);

  const faqItems = [
    {
      id: 1,
      category: isAr ? 'طلب الرحلات' : 'Booking Rides',
      question: isAr
        ? 'كيف أطلب رحلتي الأولى مع كوا بكل سهولة؟'
        : 'How do I easily book my first ride with KOWA?',
      answer: isAr
        ? 'كل اللي عليك فتح التطبيق، وتحديد وجهتك على الخريطة، واختيار فئة السيارة المناسبة لك (إيكو، كومفورت، أو رجال أعمال)، ثم النقر على "تأكيد الطلب". سيتولى أقرب كابتن معتمد قبول الرحلة والوصول إليك خلال دقائق معدودة.'
        : 'Simply open the app, set your destination on the map, select your vehicle class (Eco, Comfort, or Business), and tap "Confirm Order". The nearest certified captain will accept and arrive in minutes.',
    },
    {
      id: 2,
      category: isAr ? 'الأسعار والشفافية' : 'Pricing & Lock',
      question: isAr
        ? 'هل أسعار الرحلات ثابتة ومضمونة قبل تأكيد الحجز؟'
        : 'Are trip fares fixed and guaranteed before confirming booking?',
      answer: isAr
        ? 'نعم، تضمن لك منصة كوا تسعيرة محددة ومحسوبة مسبقاً بدقة بدون أي زيادة أو رسوم خفية أثناء الرحلة، حتى في أوقات الذروة المزدحمة أو تقلبات الطقس. المبلغ الذي تراه عند التأكيد هو المبلغ الفعلي المستحق فقط.'
        : 'Yes, KOWA strictly guarantees a fixed upfront fare calculated before booking with zero hidden charges or peak-hour multipliers throughout your entire trip.',
    },
    {
      id: 3,
      category: isAr ? 'كباتن كوا' : 'KOWA Captains',
      question: isAr
        ? 'ما هي شروط ومزايا الانضمام ككابتن معتمد لدى كوا؟'
        : 'What are the requirements and benefits of becoming a KOWA captain?',
      answer: isAr
        ? 'يتطلب الانضمام وجود رخصة قيادة وهوية وطنية سارية، ورخصة سير لمركبة حديثة 2020+. وتتيح لك المنصة أرباحاً تُحوّل يومياً لحسابك البنكي، بأقل عمولة منصة في المملكة (15%)، وحرية كاملة في تحديد ساعات عملك وجدولك اليومي.'
        : 'Requirements include a valid Saudi driver license, national ID, and vehicle registration (2020+). You enjoy daily bank transfers, the lowest 15% platform commission, and total flexibility.',
    },
    {
      id: 4,
      category: isAr ? 'الأمان والموثوقية' : 'Safety & Privacy',
      question: isAr
        ? 'كيف نضمن أعلى مستويات الأمان والخصوصية لك ولعائلتك؟'
        : 'How do we guarantee peak safety and privacy for you and your family?',
      answer: isAr
        ? 'تتبع فوري ومباشر لجميع الرحلات 24/7 عبر غرفة عمليات ذكية، فحص دوري معتمد للمركبات، وسائقون سعوديون نخبة خضعوا لتدريب أمني وحسن ضيافة، مع إمكانية مشاركة مسار الرحلة الحية مع أفراد عائلتك بكل طمأنينة.'
        : '24/7 real-time GPS tracking via smart control rooms, certified inspections, vetted Saudi captains trained in hospitality, and instant live route sharing with family members.',
    },
  ];

  const toggleFaq = (id: number) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="py-16 lg:py-24 bg-white dark:bg-[#0A0F1D] border-t border-neutral-200 dark:border-line relative overflow-hidden transition-colors duration-200"
    >
      {/* Subtle Ambient Background Glows with breathing animation */}
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
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-black uppercase text-brand dark:text-brand-lime tracking-widest bg-brand/5 dark:bg-brand-lime/10 px-3.5 py-1.5 rounded-full border border-brand/10 dark:border-brand-lime/20 inline-flex items-center gap-2 mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isAr ? 'الأسئلة الشائعة • إجابات فورية' : 'FAQ • Instant Answers'}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-ink leading-tight tracking-tight">
            {isAr ? (
              <>
                إجابات واضحة لجميع{' '}
                <span className="relative inline-block text-brand dark:text-brand-lime">
                  استفساراتك
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
              </>
            ) : (
              <>
                Clear Answers to All Your{' '}
                <span className="text-brand dark:text-brand-lime">Questions</span>
              </>
            )}
          </h2>
          <p className="text-neutral-600 dark:text-ink-muted text-sm sm:text-base leading-relaxed mt-4">
            {isAr
              ? 'كل ما تحتاج لمعرفته عن خدمات كوا، معايير الأمان، وضمانات الجودة والتسعيرة العادلة.'
              : 'Everything you need to know about KOWA services, safety protocols, upfront fixed fares, and captain onboarding.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* FAQ Accordion Side (col-span-7) with Staggered Entrance */}
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
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-black uppercase text-brand dark:text-brand-lime tracking-wider px-2 py-0.5 rounded-md bg-brand/5 dark:bg-brand-lime/10">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-ink leading-snug group-hover:text-brand dark:group-hover:text-brand-lime transition-colors">
                        {item.question}
                      </h3>
                    </div>

                    {/* Modern Rotating Chevron */}
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

                  {/* Smooth Animated Answer Block */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${item.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-neutral-600 dark:text-ink-muted leading-relaxed border-t border-neutral-200/50 dark:border-line/60 mt-1">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Customer Trust & Support Showcase Card (col-span-5) */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="bg-gradient-to-br from-brand via-brand-dark to-neutral-900 dark:from-[#1F0F8C] dark:via-[#140959] dark:to-[#070B14] rounded-3xl p-8 sm:p-10 text-white shadow-elevated relative overflow-hidden flex flex-col justify-between">
              {/* Subtle background glow */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-lime/15 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-lime/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="relative z-10">
                {/* Header Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-lime text-neutral-900 text-xs font-black mb-6 shadow-sm">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>{isAr ? 'مركز المساعدة المباشر 24/7' : '24/7 Live Support'}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white mb-3 leading-snug">
                  {isAr
                    ? 'هل لديك استفسار آخر لم تجده هنا؟'
                    : 'Have Another Question Not Listed?'}
                </h3>

                <p className="text-neutral-300 text-sm leading-relaxed mb-8">
                  {isAr
                    ? 'فريق خدمة عملاء كوا متواجد على مدار الساعة لخدمتك والإجابة على استفساراتك حول الرحلات أو الحسابات أو الانضمام ككابتن.'
                    : 'Our dedicated customer service team is on standby 24/7 to assist with trips, enterprise bookings, or driver onboarding.'}
                </p>

                {/* 3 Trust Metrics */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/15 dark:border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-brand-lime/20 flex items-center justify-center text-brand-lime shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {isAr ? 'أقل من دقيقتين' : 'Under 2 Minutes'}
                      </p>
                      <p className="text-[11px] text-neutral-300">
                        {isAr ? 'متوسط سرعة الرد المباشر' : 'Average response speed'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/15 dark:border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-brand-lime/20 flex items-center justify-center text-brand-lime shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {isAr ? '100% كادر محلي متخصص' : '100% Dedicated Support'}
                      </p>
                      <p className="text-[11px] text-neutral-300">
                        {isAr ? 'فريق دعم ومتابعة رحلات على مدار الساعة' : '24/7 trip monitoring team'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons wrapped in MagneticButton */}
              <div className="relative z-10 pt-4 border-t border-white/15 flex flex-col sm:flex-row gap-3">
                <MagneticButton strength={0.25} href="#contact" className="flex-1">
                  <span className="w-full py-3 px-4 rounded-xl bg-brand-lime text-neutral-900 font-bold text-xs hover:bg-brand-accent-hover transition flex items-center justify-center gap-2 shadow-sm whitespace-nowrap cursor-pointer">
                    <span>{isAr ? 'تواصل مع الدعم الفني' : 'Contact Support'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </span>
                </MagneticButton>

                <MagneticButton strength={0.25} href={COMPANY_DATA.contact.whatsappLink} target="_blank" rel="noopener noreferrer">
                  <span className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer">
                    <MessageCircle className="w-3.5 h-3.5 text-brand-lime" />
                    <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                  </span>
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
