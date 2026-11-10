'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useSmoothScroll } from './SmoothScrollProvider';
import {
  X,
  Smartphone,
  ShieldCheck,
  MapPin,
  Navigation,
  Copy,
  Check,
  Sparkles,
  Download,
} from 'lucide-react';

interface AppRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  pickup: string;
  destination: string;
  vehicleName: string;
  price: string;
}

export const AppRedirectModal: React.FC<AppRedirectModalProps> = ({
  isOpen,
  onClose,
  pickup,
  destination,
  vehicleName,
  price,
}) => {
  const { locale } = useLanguage();
  const { scrollTo } = useSmoothScroll();
  const isAr = locale === 'ar';
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleCopyPromo = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('KOWA20').catch(() => {});
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleGoToDownload = () => {
    onClose();
    scrollTo('#download-banner');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/65 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#10182C] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 dark:border-line relative overflow-hidden transition-colors duration-200 max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-5 rtl:right-auto ltr:right-5 ltr:left-auto p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#17223C] text-neutral-400 dark:text-ink-subtle hover:text-neutral-700 dark:hover:text-ink transition cursor-pointer"
          aria-label={isAr ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-brand dark:bg-primary-solid text-brand-lime flex items-center justify-center shrink-0 shadow-sm">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="text-right rtl:text-right ltr:text-left">
            <h3 className="text-lg font-black text-neutral-900 dark:text-ink">
              {isAr ? 'أكمل طلبك عبر تطبيق كوا' : 'Request Your Ride in the KOWA App'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-ink-muted font-medium">
              {isAr
                ? 'تتم طلبات الرحلات وتتبع الكابتن والدفع الآمن داخل التطبيق الرسمي فقط'
                : 'Ride dispatch, live captain GPS & payments happen inside the official mobile app'}
            </p>
          </div>
        </div>

        {/* Route & Fare Estimate Summary Card */}
        <div className="space-y-3 bg-neutral-50 dark:bg-[#17223C] p-4 rounded-2xl border border-neutral-200/80 dark:border-line mb-4">
          <div className="flex items-start gap-2.5">
            <Navigation className="w-4 h-4 text-brand dark:text-brand-lime shrink-0 mt-0.5" />
            <div className="text-right rtl:text-right ltr:text-left flex-1 min-w-0">
              <span className="text-[10px] font-bold text-neutral-400 dark:text-ink-subtle block">
                {isAr ? 'نقطة الانطلاق المقدرة' : 'Estimated Pickup'}
              </span>
              <span className="text-xs font-bold text-neutral-900 dark:text-ink block truncate">
                {pickup}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-2.5 border-t border-neutral-200/60 dark:border-line">
            <MapPin className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
            <div className="text-right rtl:text-right ltr:text-left flex-1 min-w-0">
              <span className="text-[10px] font-bold text-neutral-400 dark:text-ink-subtle block">
                {isAr ? 'الوجهة المقدرة' : 'Estimated Destination'}
              </span>
              <span className="text-xs font-bold text-neutral-900 dark:text-ink block truncate">
                {destination}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-neutral-200/60 dark:border-line">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 dark:text-ink-subtle block">
                {isAr ? 'التكلفة التقديرية في التطبيق' : 'Estimated App Fixed Fare'}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{vehicleName}</span>
              </div>
            </div>
            <div className="text-xl font-black text-brand dark:text-brand-lime font-en">
              {price}{' '}
              <span className="text-xs font-sans font-bold text-neutral-600 dark:text-ink-muted">
                {isAr ? 'ر.س' : 'SAR'}
              </span>
            </div>
          </div>
        </div>

        {/* Promo Code Helper Pill */}
        <div className="p-3 rounded-2xl bg-brand/5 dark:bg-brand-lime/10 border border-brand/15 dark:border-brand-lime/25 flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-brand dark:text-brand-lime shrink-0" />
            <span className="font-bold text-neutral-800 dark:text-ink">
              {isAr ? 'خصم 20% لأول 3 رحلات في التطبيق:' : '20% OFF first 3 app rides:'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyPromo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand dark:bg-brand-lime text-white dark:text-neutral-950 font-black font-en text-xs shadow-sm hover:opacity-90 transition cursor-pointer shrink-0"
          >
            <span>KOWA20</span>
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* App Store Badges & QR Download Block */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mb-5">
          <div className="sm:col-span-7 flex flex-col gap-2.5">
            <a
              href="https://apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 transition shadow-sm"
            >
              <Image
                src="/apple.svg"
                alt="App Store"
                width={22}
                height={22}
                className="w-5 h-5 object-contain"
              />
              <div className="text-right rtl:text-right ltr:text-left leading-none">
                <span className="text-[10px] text-neutral-500 block mb-0.5">
                  {isAr ? 'حمّل التطبيق من' : 'Download on the'}
                </span>
                <span className="text-sm font-black font-en text-neutral-900 block">App Store</span>
              </div>
            </a>

            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-[#17223C] text-neutral-900 dark:text-ink border border-neutral-200 dark:border-line hover:border-brand/40 transition shadow-sm"
            >
              <Image
                src="/google-play.svg"
                alt="Google Play"
                width={22}
                height={22}
                className="w-5 h-5 object-contain"
              />
              <div className="text-right rtl:text-right ltr:text-left leading-none">
                <span className="text-[10px] text-neutral-500 dark:text-ink-subtle block mb-0.5">
                  {isAr ? 'احصل عليه من' : 'Get it on'}
                </span>
                <span className="text-sm font-black font-en block">Google Play</span>
              </div>
            </a>
          </div>

          <div className="sm:col-span-5 flex flex-col items-center justify-center p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#0A0F1D] border border-neutral-200 dark:border-line text-center">
            <div className="w-24 h-24 bg-neutral-900 dark:bg-[#17223C] rounded-xl p-2 flex items-center justify-center mb-1.5">
              <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 100 100">
                <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M22,22 h6 v6 h-6 z M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M72,22 h6 v6 h-6 z M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M22,72 h6 v6 h-6 z M50,10 h5 v15 h-5 z M50,30 h8 v8 h-8 z M60,50 h10 v5 h-10 z M80,50 h10 v10 h-10 z M50,60 h10 v20 h-10 z M70,70 h20 v20 h-20 z M65,85 h10 v5 h-10 z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-neutral-600 dark:text-ink-muted">
              {isAr ? 'امسح الكود بجوالك' : 'Scan QR with Camera'}
            </span>
          </div>
        </div>

        {/* Footer Action to SMS Sender */}
        <button
          type="button"
          onClick={handleGoToDownload}
          className="w-full py-3 px-4 rounded-xl bg-brand/5 dark:bg-white/5 hover:bg-brand/10 dark:hover:bg-white/10 text-brand dark:text-brand-lime font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-brand/15 dark:border-line"
        >
          <Download className="w-3.5 h-3.5" />
          <span>
            {isAr
              ? 'إرسال رابط تحميل التطبيق برسالة SMS لجوالك'
              : 'Send App Download Link via SMS'}
          </span>
        </button>
      </div>
    </div>
  );
};
