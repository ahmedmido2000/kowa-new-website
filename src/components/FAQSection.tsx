'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export const FAQSection: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const [openId, setOpenId] = useState<number | null>(1);

  const faqItems = [
    {
      id: 1,
      question: isAr
        ? 'كيف أطلب رحلتي الأولى مع كوا بكل سهولة؟'
        : 'How do I easily book my first ride with KOWA?',
      answer: isAr
        ? 'كل اللي عليك فتح التطبيق، وتحديد وجهتك على الخريطة، واختيار فئة السيارة المناسبة لك، ثم النقر على "تأكيد الطلب". سيتولى أقرب كابتن قبول الرحلة فوراً.'
        : 'Simply open the app, set your destination on the map, select your preferred vehicle class, and tap "Confirm Order". The nearest certified captain will accept right away.',
    },
    {
      id: 2,
      question: isAr
        ? 'هل أسعار الرحلات ثابتة ومضمونة قبل تأكيد الحجز؟'
        : 'Are trip fares fixed and guaranteed before confirming booking?',
      answer: isAr
        ? 'نعم، تضمن لك منصة كوا تسعيرة محددة ومحسوبة مسبقاً بدقة بدون أي زيادة أو رسوم خفية أثناء الرحلة، حتى في أوقات الذروة واشتداد حركة السير.'
        : 'Yes, KOWA strictly guarantees a fixed, calculated upfront price with zero hidden charges or surge multipliers throughout your journey.',
    },
    {
      id: 3,
      question: isAr
        ? 'ما هي شروط ومزايا الانضمام ككابتن معتمد لدى كوا؟'
        : 'What are the requirements and benefits of becoming a KOWA captain?',
      answer: isAr
        ? 'يتطلب الانضمام وجود رخصة قيادة وهوية وطنية سارية، ورخصة سير لمركبة حديثة. وتتيح لك المنصة أرباحاً تُحوّل يومياً لحسابك البنكي، بأقل عمولة 15%، وحرية كاملة في تحديد ساعات عملك.'
        : 'Registration requires a valid Saudi driver license, national ID, and modern vehicle registration. You enjoy daily direct bank deposits, the lowest 15% platform commission, and complete schedule freedom.',
    },
    {
      id: 4,
      question: isAr
        ? 'كيف نضمن أعلى مستويات الأمان والخصوصية لك ولعائلتك؟'
        : 'How do we guarantee peak safety and privacy for you and your family?',
      answer: isAr
        ? 'تتبع فوري ومباشر لجميع الرحلات 24/7، فحص دوري معتمد للمركبات، وسائقون سعوديون نخبة خضعوا لتدريب أمني وحسن ضيافة، مع إمكانية مشاركة مسار الرحلة الحية مع أفراد عائلتك بكل طمأنينة.'
        : '24/7 live route GPS tracking, rigorous vehicle inspections, vetted Saudi captains trained in hospitality, and instant trip coordinate sharing with family for total peace of mind.',
    },
  ];

  const toggleFaq = (id: number) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative w-full py-20 lg:py-28 px-4 sm:px-8 lg:px-12 bg-gradient-to-r from-[#ECEAFF]/50 via-white to-white dark:from-[#0C1222] dark:via-[#0A0F1D] dark:to-[#0A0F1D] border-t border-neutral-200 dark:border-line transition-colors duration-200"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* FAQ Accordion Side */}
          <div className="lg:col-span-7 flex flex-col items-start text-right rtl:text-right ltr:text-left order-1">
            <span className="text-xs font-black uppercase text-brand dark:text-brand-lime tracking-widest bg-brand/5 dark:bg-brand-lime/10 px-3 py-1 rounded-full border border-brand/10 dark:border-brand-lime/20 mb-3">
              {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-ink leading-tight tracking-tight mb-2">
              {isAr ? 'إجابات واضحة لجميع استفساراتك' : 'Clear Answers to All Your Inquiries'}
            </h2>
            <p className="text-sm sm:text-base font-semibold text-neutral-600 dark:text-ink-muted leading-relaxed max-w-xl mb-8">
              {isAr
                ? 'كل ما تحتاج لمعرفته عن خدمات كوا، معايير الأمان، وضمانات الجودة.'
                : 'Everything you need to know about KOWA services, safety protocols, and quality standards.'}
            </p>

            {/* Accordion Items List */}
            <div className="w-full space-y-4">
              {faqItems.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <div
                    key={item.id}
                    className="bg-[#F8F7FD] dark:bg-[#10182C] border border-[#E5E2F6] dark:border-line rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:border-brand/40 dark:hover:border-primary-token/40 shadow-subtle"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                      className="w-full flex items-center justify-between gap-4 text-right rtl:text-right ltr:text-left focus:outline-none group cursor-pointer"
                    >
                      <h3 className="text-base font-bold text-neutral-900 dark:text-ink flex-1 leading-snug">
                        {item.question}
                      </h3>

                      {/* Plus / Minus Circle Icon Container */}
                      <div className="w-8 h-8 min-w-[32px] rounded-full bg-white dark:bg-[#17223C] border border-neutral-200/60 dark:border-line flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-sm shrink-0">
                        <span className="text-lg font-bold text-brand dark:text-brand-lime leading-none select-none">
                          {isOpen ? '−' : '+'}
                        </span>
                      </div>
                    </button>

                    {/* Answer Paragraph */}
                    {isOpen && (
                      <div id={`faq-answer-${item.id}`} className="pt-4 border-t border-neutral-200/50 dark:border-line/60 mt-3 animate-fade-in">
                        <p className="text-sm text-neutral-700 dark:text-ink-muted leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Left Side: Phone Mockup Graphic */}
          <div className="lg:col-span-5 flex justify-center items-center order-2">
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px]">
              <Image
                src="/faq-phone.webp"
                alt="تطبيق كوا على الجوال - الأسئلة الشائعة"
                width={480}
                height={600}
                className="w-full h-auto object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
