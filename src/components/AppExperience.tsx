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
    <section className="py-16 lg:py-24 bg-white overflow-hidden" id="app-preview">
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
              <div className="rounded-[38px] overflow-hidden bg-white text-neutral-900 flex flex-col h-[600px] border border-neutral-700/50 relative">
                {/* Map Graphic Area */}
                <div className="h-[280px] bg-neutral-100 relative overflow-hidden">
                  <Image
                    alt="City route navigation map"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa7awEUXACTWPSIgg2bVgq7LLt9hFTwCEDRj-SSa4BA1lFqPS5DaSLXVpkhouQVVPAzJD_gMvb4mtK-lu7CLlJDEKkhOU_uLxi0nevMAEb994gBZqF2WXztPUf6ji6MBwsTt54yRxrN9MjletZL2dCBxe0uAU8wqAWJ48RdIXv5Qsp1xtFR_AJ9A761-uZ-SVM-VidyhHuY707bXY8G9MX-q1KUvR_KUjzE_pWfbCZ"
                    fill
                    className="object-cover filter contrast-125 opacity-70"
                    sizes="330px"
                  />
                  <div className="absolute inset-0 bg-brand/10 pointer-events-none"></div>

                  {/* Route Path SVG */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 280">
                    <path
                      d="M60 210 Q 150 140 240 80"
                      fill="none"
                      stroke="#1F0F8C"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                      strokeWidth="4"
                    ></path>
                  </svg>

                  {/* Vehicle Pin */}
                  <div className="absolute top-[135px] left-[145px] -translate-x-1/2 -translate-y-1/2 bg-brand text-brand-lime p-2 rounded-full shadow-lg border-2 border-white animate-bounce">
                    <Car className="w-4 h-4" />
                  </div>

                  {/* Destination Pin */}
                  <div className="absolute top-[75px] left-[235px] -translate-x-1/2 -translate-y-1/2 bg-neutral-900 text-white p-1.5 rounded-full shadow-md border-2 border-white">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>

                  {/* Live ETA Chip in Map */}
                  <div className="absolute top-12 left-4 right-4 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-neutral-200 shadow-md flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>{isAr ? 'في الطريق إليك • دقيقتان' : 'En route • 2 mins'}</span>
                    </div>
                    <span className="font-en font-black text-brand text-xs">LEXUS ES • 4912</span>
                  </div>
                </div>

                {/* Interactive Ride Status Sheet */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-white text-right rtl:text-right ltr:text-left">
                  {/* Driver Profile Card */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-brand/10 text-brand font-black flex items-center justify-center text-sm border border-brand/20">
                        س ع
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900">
                          {isAr ? 'الكابتن سلطان الشمري' : 'Captain Sultan Al-Shammari'}
                        </div>
                        <div className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                          <span>★ 4.99</span>
                          <span className="text-neutral-400 font-normal">
                            {isAr ? '(1,840 رحلة)' : '(1,840 rides)'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <a
                        href="tel:8005692"
                        className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700"
                        title={isAr ? 'اتصال بالكابتن' : 'Call Captain'}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => alert(isAr ? 'محادثة سريعة مع الكابتن سلطان' : 'Chat with Captain')}
                        className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700"
                        title={isAr ? 'مراسلة الكابتن' : 'Message Captain'}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Payment Method Details */}
                  <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/70 text-xs">
                    <div className="flex items-center justify-between mb-1 font-bold">
                      <span className="text-neutral-500">
                        {isAr ? 'طريقة الدفع المعتمدة:' : 'Selected Payment:'}
                      </span>
                      <span className="text-neutral-900 flex items-center gap-1 font-en font-black">
                        Apple Pay
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{isAr ? 'فاتورة ZATCA الضريبية:' : 'ZATCA Tax Invoice:'}</span>
                      <span className="text-emerald-700 font-bold">
                        {isAr ? 'تُرسل فورا للإيميل' : 'Auto sent to email'}
                      </span>
                    </div>
                  </div>

                  {/* Fixed Fare Summary */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-bold">
                        {isAr ? 'المبلغ الثابت المحسوب' : 'Locked Fixed Fare'}
                      </span>
                      <span className="text-lg font-black text-brand font-en">
                        28.00 <span className="text-xs font-sans">{isAr ? 'ر.س' : 'SAR'}</span>
                      </span>
                    </div>
                    <button
                      onClick={handleShare}
                      className="px-4 py-2 rounded-xl bg-brand text-white text-xs font-bold flex items-center gap-1 shadow-sm hover:bg-brand-dark transition"
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
            <span className="text-xs font-black uppercase text-brand tracking-widest bg-brand/5 px-3 py-1 rounded-full border border-brand/10">
              {isAr ? 'التكنولوجيا والراحة' : 'Technology & Comfort'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 mt-3 mb-4">
              {isAr
                ? 'تجربة رقمية مصممة للسرعة والأمان المالي المطلق'
                : 'A Digital Mobility Platform Engineered for Speed and Financial Peace'}
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8">
              {isAr
                ? 'صُمم تطبيق كوا وفق أحدث معايير التكنولوجيا الفن تك والنقل الذكي. حجز في 3 خطوات، ودفع آمن بدون لمس، وتتبع لحظي لمسار أحبائك مع ميزة مشاركة الرحلة المباشرة.'
                : 'Built with the highest fintech standards and smart transportation protocols: 3-step booking, contactless frictionless payments, and real-time live route sharing.'}
            </p>

            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-neutral-50 transition border border-transparent hover:border-neutral-200">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <Wallet className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-900 mb-1">
                    {isAr
                      ? 'دفع فوري بلمسة واحدة عبر مدى و Apple Pay'
                      : 'Instant One-Touch Payment via mada & Apple Pay'}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                    {isAr
                      ? 'لا داعي لحمل النقد أو البحث عن صراف. ربط سريع لبطاقات مدى، فيزا، ماستركارد، مع تشفير مصرفي عالي الحماية ومعتمد من البنك المركزي السعودي (ساما).'
                      : 'No cash needed. Effortless integration with mada, Visa, Mastercard, backed by banking-grade encryption certified according to SAMA guidelines.'}
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-neutral-50 transition border border-transparent hover:border-neutral-200">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <Receipt className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-900 mb-1">
                    {isAr
                      ? 'فاتورة ضريبية رسمية مؤتمتة فور انتهاء المشوار'
                      : 'Automated ZATCA Tax Invoices Issued Upon Trip Completion'}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                    {isAr
                      ? 'تصلك فاتورة تفصيلية معتمدة من هيئة الزكاة والضريبة والجمارك (ZATCA) متضمنة رمز الاستجابة السريعة (QR) على بريدك الإلكتروني والواتساب مباشرة، مثالية لاسترداد مصاريف الشركات.'
                      : 'Receive official electronic invoices certified by ZATCA complete with QR code via email & WhatsApp—perfect for corporate expense accounting.'}
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-neutral-50 transition border border-transparent hover:border-neutral-200">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-900 mb-1">
                    {isAr
                      ? 'زر أمان مباشر ومشاركة المسار العائلي 24/7'
                      : '24/7 Live Family Trip Sharing & Direct Emergency SOS'}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
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
