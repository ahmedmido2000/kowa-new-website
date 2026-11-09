'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle2 } from 'lucide-react';
import MagneticButton from './MagneticButton';

export const DownloadBanner: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  const [phone, setPhone] = useState('');
  const [smsSent, setSmsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSmsSent(true);
    setTimeout(() => {
      setPhone('');
    }, 4000);
  };

  return (
    <section className="py-16 lg:py-20 bg-neutral-50 dark:bg-[#0A0F1D] border-t border-neutral-200 dark:border-line transition-colors duration-200 overflow-hidden" id="download-banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-br from-brand via-brand-dark to-neutral-900 dark:from-[#1F0F8C] dark:via-[#140959] dark:to-[#070B14] rounded-3xl p-8 sm:p-12 text-white shadow-elevated relative overflow-hidden"
        >
          {/* Ambient Breathing Glow */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.16, 0.08] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-12 -bottom-12 w-64 h-64 border-8 border-brand-lime/20 rounded-full pointer-events-none"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 text-right rtl:text-right ltr:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-lime text-neutral-900 text-xs font-black mb-3 shadow-sm">
                <span>{isAr ? 'تنقل أذكى.. أسرع.. وأكثر راحة' : 'Smarter, Faster, Peak Comfort'}</span>
                <span>•</span>
                <span>{isAr ? 'خصم 20% كود KOWA20' : '20% OFF Code KOWA20'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 leading-tight">
                {isAr
                  ? 'جاهز لتجربة تنقل استثنائية لم تعهدها من قبل؟'
                  : 'Ready for an Exceptional Mobility Experience?'}
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
                {isAr
                  ? 'انضم إلى آلاف المستخدمين الذين يثقون في كوا يومياً في شتى أنحاء المملكة. سجّل في 30 ثانية باستخدام النفاذ الوطني أو رقم الجوال واستمتع بتسعيرة ثابتة 100%.'
                  : 'Join thousands of daily commuters trusting KOWA across the Kingdom. Sign up in 30 seconds with Nafath or mobile number and enjoy 100% fixed fares.'}
              </p>

              {/* Instant SMS Download Link Sender */}
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 max-w-lg mb-6">
                <form className="flex items-center gap-2" onSubmit={handleSubmit}>
                  <div className="flex items-center gap-2 flex-1 px-3">
                    <span className="text-xs font-bold text-neutral-300 font-en">+966</span>
                    <input
                      className="w-full bg-transparent border-0 p-0 text-sm font-bold text-white placeholder-neutral-400 focus:outline-none focus:ring-0"
                      dir="ltr"
                      pattern="5[0-9]{8}"
                      placeholder="5XXXXXXXX"
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <MagneticButton strength={0.25}>
                    <button
                      className="px-4 py-2.5 rounded-xl bg-brand-lime text-neutral-900 font-bold text-xs hover:bg-brand-accent-hover transition whitespace-nowrap cursor-pointer shadow-sm"
                      type="submit"
                    >
                      {isAr ? 'إرسال الرابط SMS' : 'Send SMS Link'}
                    </button>
                  </MagneticButton>
                </form>
              </div>

              {smsSent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2 max-w-lg"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-lime shrink-0" />
                  <span>
                    {isAr
                      ? 'تم إرسال رابط تحميل كوا بنجاح عبر رسالة نصية SMS إلى هاتفك!'
                      : 'KOWA app download link has been sent via SMS to your phone!'}
                  </span>
                </motion.div>
              )}

              {/* Store Badges using Company Vector Assets */}
              <div className="flex flex-wrap items-center gap-3">
                <MagneticButton strength={0.2} href="https://apple.com" target="_blank" rel="noopener noreferrer">
                  <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 shadow-md transition-all duration-200 cursor-pointer">
                    <Image
                      src="/apple.svg"
                      alt="App Store"
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain"
                    />
                    <div className="flex flex-col text-right rtl:text-right ltr:text-left leading-none">
                      <span className="text-[10px] text-neutral-500 font-medium leading-tight">
                        {isAr ? 'حمله من' : 'Download on'}
                      </span>
                      <span className="text-sm font-black font-en text-neutral-900 leading-tight">
                        App Store
                      </span>
                    </div>
                  </span>
                </MagneticButton>

                <MagneticButton strength={0.2} href="https://google.com" target="_blank" rel="noopener noreferrer">
                  <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 shadow-md transition-all duration-200 cursor-pointer">
                    <Image
                      src="/google-play.svg"
                      alt="Google Play"
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain"
                    />
                    <div className="flex flex-col text-right rtl:text-right ltr:text-left leading-none">
                      <span className="text-[10px] text-neutral-500 font-medium leading-tight">
                        {isAr ? 'احصل عليه من' : 'Get it on'}
                      </span>
                      <span className="text-sm font-black font-en text-neutral-900 leading-tight">
                        Google Play
                      </span>
                    </div>
                  </span>
                </MagneticButton>
              </div>
            </div>

            {/* QR Code Download Box with Float Animation */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-white dark:bg-[#10182C] p-6 rounded-3xl text-neutral-900 dark:text-ink text-center shadow-2xl max-w-xs border border-neutral-200 dark:border-line transition-colors duration-200"
              >
                <div className="w-40 h-40 bg-neutral-900 dark:bg-[#070B14] mx-auto rounded-2xl p-3 flex items-center justify-center mb-3 border border-transparent dark:border-line">
                  <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 100 100">
                    <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M22,22 h6 v6 h-6 z M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M72,22 h6 v6 h-6 z M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M22,72 h6 v6 h-6 z M50,10 h5 v15 h-5 z M50,30 h8 v8 h-8 z M60,50 h10 v5 h-10 z M80,50 h10 v10 h-10 z M50,60 h10 v20 h-10 z M70,70 h20 v20 h-20 z M65,85 h10 v5 h-10 z"></path>
                  </svg>
                </div>
                <div className="text-xs font-bold text-neutral-800 dark:text-ink">
                  {isAr ? 'امسح الكود بكاميرا الجوال' : 'Scan with your Phone Camera'}
                </div>
                <div className="text-[11px] text-neutral-400 dark:text-ink-subtle">
                  {isAr ? 'لتحميل التطبيق مباشرة على أي هاتف' : 'To download the app directly on any device'}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
