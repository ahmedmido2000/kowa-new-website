'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-[#0A0F1D] overflow-hidden transition-colors duration-200" id="app-preview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Interactive Mobile Mockup */}
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
            {/* Smartphone Outer Chassis */}
            <div className="w-[300px] sm:w-[330px] rounded-[48px] p-3.5 bg-neutral-900 shadow-2xl border-4 border-neutral-800 relative">
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
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-brand dark:border-primary-solid">
                        <Image
                          alt="Saudi Captain Profile"
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-black text-neutral-900 dark:text-ink flex items-center gap-1">
                          <span>{isAr ? 'أحمد السبيعي' : 'Ahmed Al-Subaie'}</span>
                          <span className="text-amber-500 font-en text-[11px]">★ 5.0</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 dark:text-ink-subtle block font-sans">
                          {isAr ? 'كامري أبيض 2024 • أ ح ك 9982' : 'White Camry 2024 • AHK 9982'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full bg-white dark:bg-[#10182C] border border-neutral-200 dark:border-line flex items-center justify-center text-neutral-700 dark:text-ink hover:text-brand"
                        title={isAr ? 'اتصال مباشر' : 'Call'}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full bg-brand dark:bg-primary-solid text-white flex items-center justify-center hover:bg-brand-dark"
                        title={isAr ? 'محادثة عبر التطبيق' : 'Chat'}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Payment Method Details */}
                  <div className="bg-neutral-50 dark:bg-[#17223C] p-2.5 rounded-xl border border-neutral-200/70 dark:border-line text-xs">
                    <div className="flex items-center justify-between mb-1 font-bold">
                      <span className="text-neutral-500 dark:text-ink-subtle">
                        {isAr ? 'طريقة الدفع المعتمدة:' : 'Selected Payment:'}
                      </span>
                      <span className="text-neutral-900 dark:text-ink flex items-center gap-1 font-en font-black">
                        Apple Pay
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 dark:text-ink-subtle">
                      <span>{isAr ? 'فاتورة ZATCA الضريبية:' : 'ZATCA Tax Invoice:'}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {isAr ? 'تُرسل فورا للإيميل' : 'Auto sent to email'}
                      </span>
                    </div>
                  </div>

                  {/* Fixed Fare Summary */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[10px] text-neutral-400 dark:text-ink-subtle block font-bold">
                        {isAr ? 'المبلغ الثابت المحسوب' : 'Locked Fixed Fare'}
                      </span>
                      <span className="text-lg font-black text-brand dark:text-brand-lime font-en">
                        28.00 <span className="text-xs font-sans">{isAr ? 'ر.س' : 'SAR'}</span>
                      </span>
                    </div>
                    <button
                      onClick={handleShare}
                      className="px-4 py-2 rounded-xl bg-brand dark:bg-primary-solid text-white text-xs font-bold flex items-center gap-1 shadow-sm hover:bg-brand-dark dark:hover:bg-brand transition cursor-pointer"
                    >
                      <span>
                        {copiedShare
                          ? isAr
                            ? 'تم النسخ!'
                            : 'Link Copied!'
                          : isAr
                          ? 'مشاركة المسار'
                          : 'Share Trip'}
                      </span>
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fintech & Mobility Features List */}
          <div className="lg:col-span-7 order-1 lg:order-2 text-right rtl:text-right ltr:text-left">
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

            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-neutral-50 dark:hover:bg-[#10182C] transition border border-transparent hover:border-neutral-200 dark:hover:border-line">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 dark:bg-primary-token/20 text-brand dark:text-primary-token flex items-center justify-center shrink-0">
                  <Wallet className="w-6 h-6 text-brand dark:text-primary-token" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-900 dark:text-ink mb-1">
                    {isAr
                      ? 'دفع فوري بلمسة واحدة عبر مدى و Apple Pay'
                      : 'Instant One-Touch Payment via mada & Apple Pay'}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-ink-muted leading-relaxed">
                    {isAr
                      ? 'لا داعي لحمل النقد أو البحث عن صراف. ربط سريع لبطاقات مدى، فيزا، ماستركارد، مع تشفير مصرفي عالي الحماية ومعتمد من البنك المركزي السعودي (ساما).'
                      : 'No cash needed. Effortless integration with mada, Visa, Mastercard, backed by banking-grade encryption certified according to SAMA guidelines.'}
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-neutral-50 dark:hover:bg-[#10182C] transition border border-transparent hover:border-neutral-200 dark:hover:border-line">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 dark:bg-primary-token/20 text-brand dark:text-primary-token flex items-center justify-center shrink-0">
                  <Receipt className="w-6 h-6 text-brand dark:text-primary-token" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-900 dark:text-ink mb-1">
                    {isAr
                      ? 'فاتورة ضريبية رسمية مؤتمتة فور انتهاء المشوار'
                      : 'Automated ZATCA Tax Invoices Issued Upon Trip Completion'}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-ink-muted leading-relaxed">
                    {isAr
                      ? 'تصلك فاتورة تفصيلية معتمدة من هيئة الزكاة والضريبة والجمارك (ZATCA) متضمنة رمز الاستجابة السريعة (QR) على بريدك الإلكتروني والواتساب مباشرة، مثالية لاسترداد مصاريف الشركات.'
                      : 'Receive official electronic invoices certified by ZATCA complete with QR code via email & WhatsApp—perfect for corporate expense accounting.'}
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-neutral-50 dark:hover:bg-[#10182C] transition border border-transparent hover:border-neutral-200 dark:hover:border-line">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 dark:bg-primary-token/20 text-brand dark:text-primary-token flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-brand dark:text-primary-token" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-900 dark:text-ink mb-1">
                    {isAr
                      ? 'زر أمان مباشر ومشاركة المسار العائلي 24/7'
                      : '24/7 Live Family Trip Sharing & Direct Emergency SOS'}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-ink-muted leading-relaxed">
                    {isAr
                      ? 'شارك مسار رحلتك فوراً مع أفراد عائلتك لمتابعة موقع المركبة في الوقت الفعلي حتى نقطة الوصول، مع زر طوارئ متصل مباشرة بغرفة عمليات كوا المركزية.'
                      : 'Instantly share trip coordinates with family members for peace of mind, backed by a dedicated SOS hotline linked to the central operations control room.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
