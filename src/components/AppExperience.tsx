'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import {
  Wallet,
  Receipt,
  ShieldCheck,
  Phone,
  MessageSquare,
  Share2,
  Car,
  MapPin,
} from 'lucide-react';

export const AppExperience: React.FC = () => {
  const { locale, isRtl } = useLanguage();
  const isAr = locale === 'ar';
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const fintechFeatures = [
    {
      icon: Wallet,
      title: isAr
        ? 'دفع فوري بلمسة واحدة عبر مدى و Apple Pay'
        : 'Instant One-Touch Payment via mada & Apple Pay',
      desc: isAr
        ? 'لا داعي لحمل النقد أو البحث عن صراف. ربط سريع لبطاقات مدى، فيزا، ماستركارد، مع تشفير مصرفي عالي الحماية ومعتمد من البنك المركزي السعودي (ساما).'
        : 'No cash needed. Effortless integration with mada, Visa, Mastercard, backed by banking-grade encryption certified according to SAMA guidelines.',
    },
    {
      icon: Receipt,
      title: isAr
        ? 'فاتورة ضريبية رسمية مؤتمتة فور انتهاء المشوار'
        : 'Automated ZATCA Tax Invoices Issued Upon Trip Completion',
      desc: isAr
        ? 'تصلك فاتورة تفصيلية معتمدة من هيئة الزكاة والضريبة والجمارك (ZATCA) متضمنة رمز الاستجابة السريعة (QR) على بريدك الإلكتروني والواتساب مباشرة، مثالية لاسترداد مصاريف الشركات.'
        : 'Receive official electronic invoices certified by ZATCA complete with QR code via email & WhatsApp—perfect for corporate expense accounting.',
    },
    {
      icon: ShieldCheck,
      title: isAr
        ? 'زر أمان مباشر ومشاركة المسار العائلي 24/7'
        : '24/7 Live Family Trip Sharing & Direct Emergency SOS',
      desc: isAr
        ? 'شارك مسار رحلتك فوراً مع أفراد عائلتك لمتابعة موقع المركبة في الوقت الفعلي حتى نقطة الوصول، مع زر طوارئ متصل مباشرة بغرفة عمليات كوا المركزية.'
        : 'Instantly share trip coordinates with family members for peace of mind, backed by a dedicated SOS hotline linked to the central operations control room.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-[#0A0F1D] overflow-hidden transition-colors duration-200" id="app-preview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Interactive Mobile Mockup with Floating Levitation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center order-2 lg:order-1"
          >
            {/* Smartphone Outer Chassis with smooth floating drift */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[300px] sm:w-[330px] rounded-[48px] p-3.5 bg-neutral-900 shadow-2xl border-4 border-neutral-800 relative will-change-transform"
            >
              {/* Dynamic Island Speaker Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-neutral-950 rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 ml-4"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-950"></div>
              </div>

              {/* Screen Canvas */}
              <div className="rounded-[38px] overflow-hidden bg-white dark:bg-[#10182C] text-neutral-900 dark:text-ink flex flex-col h-[600px] border border-neutral-700/50 relative">
                {/* Map Graphic Area */}
                <div className="h-[280px] bg-neutral-100 dark:bg-[#17223C] relative overflow-hidden">
                  <Image
                    alt="City route navigation map"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa7awEUXACTWPSIgg2bVgq7LLt9hFTwCEDRj-SSa4BA1lFqPS5DaSLXVpkhouQVVPAzJD_gMvb4mtK-lu7CLlJDEKkhOU_uLxi0nevMAEb994gBZqF2WXztPUf6ji6MBwsTt54yRxrN9MjletZL2dCBxe0uAU8wqAWJ48RdIXv5Qsp1xtFR_AJ9A761-uZ-SVM-VidyhHuY707bXY8G9MX-q1KUvR_KUjzE_pWfbCZ"
                    fill
                    className="object-cover filter contrast-125 opacity-70 dark:opacity-50"
                    sizes="330px"
                  />
                  <div className="absolute inset-0 bg-brand/10 dark:bg-brand/20 pointer-events-none"></div>

                  {/* Route Path SVG */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 280">
                    <path
                      d="M60 210 Q 150 140 240 80"
                      fill="none"
                      stroke="#1F0F8C"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                      strokeWidth="5"
                    />
                    <path
                      d="M60 210 Q 150 140 240 80"
                      fill="none"
                      stroke="#D3D93C"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                    {/* Destination Marker */}
                    <circle cx="240" cy="80" fill="#1F0F8C" r="8" />
                    <circle cx="240" cy="80" fill="#D3D93C" r="4" />
                    {/* Car Marker */}
                    <circle cx="145" cy="140" fill="#1F0F8C" r="14" />
                    <circle cx="145" cy="140" fill="#FFFFFF" r="5" />
                  </svg>

                  {/* Live Floating Status Overlay */}
                  <div className="absolute top-12 left-4 right-4 bg-white/90 dark:bg-[#10182C]/90 backdrop-blur-md p-2.5 rounded-2xl shadow-sm border border-neutral-200/60 dark:border-line flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-1.5 text-brand dark:text-brand-lime">
                      <Car className="w-4 h-4" />
                      <span>{isAr ? 'الكابتن يقترب' : 'Captain approaching'}</span>
                    </div>
                    <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md font-en font-black">
                      3 MIN
                    </span>
                  </div>

                  {/* Destination Pin Tag */}
                  <div className="absolute top-12 right-24 bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                    <MapPin className="w-3 h-3 text-brand-lime" />
                    <span>{isAr ? 'KAFD الوجهة' : 'Destination KAFD'}</span>
                  </div>
                </div>

                {/* Bottom App Interaction Drawer */}
                <div className="p-4 bg-white dark:bg-[#10182C] flex-1 flex flex-col justify-between text-right rtl:text-right ltr:text-left transition-colors duration-200">
                  {/* Captain Card */}
                  <div className="flex items-center justify-between bg-neutral-50 dark:bg-[#17223C] p-3 rounded-2xl border border-neutral-200/80 dark:border-line">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-brand-lime text-neutral-950 flex items-center justify-center font-bold text-sm">
                        ف.ع
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-ink">
                          {isAr ? 'كابتن فهد العتيبي' : 'Captain Fahad'}
                        </div>
                        <div className="text-[10px] text-neutral-400 dark:text-ink-subtle">
                          {isAr ? 'كامري 2024 • أ ب ج 4321' : 'Camry 2024 • ABC 4321'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <a
                        href="tel:920000000"
                        className="w-8 h-8 rounded-xl bg-white dark:bg-[#10182C] border border-neutral-200 dark:border-line flex items-center justify-center text-brand dark:text-brand-lime shadow-sm hover:scale-105 transition"
                        title={isAr ? 'اتصال بالكابتن' : 'Call Captain'}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href="#chat"
                        className="w-8 h-8 rounded-xl bg-white dark:bg-[#10182C] border border-neutral-200 dark:border-line flex items-center justify-center text-brand dark:text-brand-lime shadow-sm hover:scale-105 transition"
                        title={isAr ? 'محادثة الكابتن' : 'Chat with Captain'}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Trip Details Card */}
                  <div className="py-2 space-y-2 border-y border-neutral-100 dark:border-line text-xs">
                    <div className="flex justify-between items-center text-neutral-500 dark:text-ink-muted">
                      <span>{isAr ? 'طريقة الدفع' : 'Payment Method'}</span>
                      <span className="font-bold text-neutral-900 dark:text-ink flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Apple Pay
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500 dark:text-ink-muted">{isAr ? 'السعر الثابت' : 'Fixed Fare'}</span>
                      <span className="font-bold text-brand dark:text-brand-lime font-en text-sm">
                        28.00 SAR
                      </span>
                    </div>
                  </div>

                  {/* Live Route Share Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleShare}
                      className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 dark:bg-card hover:bg-neutral-800 dark:hover:bg-elevated text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm border border-neutral-700 dark:border-line"
                      type="button"
                    >
                      <span>
                        {copiedShare
                          ? isAr
                            ? 'تم نسخ رابط التتبع بنجاح!'
                            : 'Tracking Link Copied!'
                          : isAr
                          ? 'مشاركة مسار الرحلة الحية'
                          : 'Share Live Trip Coordinates'}
                      </span>
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Fintech & Mobility Features List with Staggered Entrance */}
          <div className="lg:col-span-7 order-1 lg:order-2 text-right rtl:text-right ltr:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-black uppercase text-brand dark:text-brand-lime tracking-widest bg-brand/5 dark:bg-brand-lime/10 px-3 py-1 rounded-full border border-brand/10 dark:border-brand-lime/20">
                {isAr ? 'التكنولوجيا والراحة' : 'Technology & Comfort'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-ink mt-3 mb-4">
                {isAr
                  ? 'تجربة رقمية مصممة للسرعة والأمان المالي المطلق'
                  : 'A Digital Mobility Platform Engineered for Speed and Financial Peace'}
              </h2>
              <p className="text-neutral-600 dark:text-ink-muted text-sm sm:text-base leading-relaxed mb-8">
                {isAr
                  ? 'صُمم تطبيق كوا وفق أحدث معايير التكنولوجيا الفن تك والنقل الذكي. حجز في 3 خطوات، ودفع آمن بدون لمس، وتتبع لحظي لمسار أحبائك مع ميزة مشاركة الرحلة المباشرة.'
                  : 'Built with the highest fintech standards and smart transportation protocols: 3-step booking, contactless frictionless payments, and real-time live route sharing.'}
              </p>
            </motion.div>

            <div className="space-y-4">
              {fintechFeatures.map((feat, idx) => {
                const IconComponent = feat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: isRtl ? 25 : -25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ x: isRtl ? -6 : 6, transition: { duration: 0.2 } }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50/40 dark:bg-[#10182C]/40 hover:bg-neutral-50 dark:hover:bg-[#10182C] transition-all border border-neutral-200/50 dark:border-line/50 hover:border-brand/30 dark:hover:border-primary-token/40 group cursor-default"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-brand/10 dark:bg-primary-token/20 text-brand dark:text-brand-lime flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-brand dark:group-hover:bg-primary-solid group-hover:text-brand-lime transition-all duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-ink mb-1 group-hover:text-brand dark:group-hover:text-brand-lime transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-500 dark:text-ink-muted leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
