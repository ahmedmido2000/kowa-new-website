'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
  Send,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import { useSmoothScroll, useModalScrollLock } from './SmoothScrollProvider';
import { QrCodeDisplay } from './QrCodeDisplay';
import { isSafeHref } from '@/lib/cms-helpers';
import { requestAppLinkSms, WebsiteApiError } from '@/lib/website-api';

interface AppRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  pickup: string;
  destination: string;
  vehicleName: string;
  startingPriceLabel?: string;
}

export const AppRedirectModal: React.FC<AppRedirectModalProps> = ({
  isOpen,
  onClose,
  pickup,
  destination,
  vehicleName,
  startingPriceLabel,
}) => {
  const { locale, pick } = useLanguage();
  const { sections, platform, featureFlags } = useWebsiteConfig();
  const { scrollTo } = useSmoothScroll();
  const isAr = locale === 'ar';

  const [copiedCode, setCopiedCode] = useState(false);
  const [showSmsForm, setShowSmsForm] = useState(false);
  const [smsPhone, setSmsPhone] = useState('');
  const [smsLoading, setSmsLoading] = useState(false);
  const [smsSuccess, setSmsSuccess] = useState(false);
  const [smsError, setSmsError] = useState<string | null>(null);

  useModalScrollLock(isOpen);

  if (!isOpen) return null;

  const fareCalc = sections.fare_calculator;
  const modalData = fareCalc?.appRedirectModal;
  const bannerData = sections.download_banner;

  const title = pick(
    modalData?.title,
    isAr ? 'أكمل طلبك عبر تطبيق كوا' : 'Request Your Ride in the KOWA App'
  );
  const subtitle = pick(
    modalData?.subtitle,
    isAr
      ? 'تتم طلبات الرحلات وتتبع الكابتن والدفع الآمن داخل التطبيق الرسمي فقط'
      : 'Ride dispatch, live captain GPS & payments happen inside the official mobile app'
  );
  const isDynamicMode = Boolean(fareCalc?.dynamic?.enabled);
  const demoNotice = isDynamicMode
    ? pick(fareCalc?.dynamic?.labels?.disclaimer)
    : pick(fareCalc?.demoNotice);

  const rawPromo = modalData?.promo;
  const promo =
    rawPromo &&
    rawPromo.isEnabled !== false &&
    (Boolean(pick(rawPromo.text).trim()) || Boolean(rawPromo.code?.trim()))
      ? rawPromo
      : null;

  const iosUrl =
    platform?.iosAppUrl && isSafeHref(platform.iosAppUrl) ? platform.iosAppUrl.trim() : '';
  const androidUrl =
    platform?.androidAppUrl && isSafeHref(platform.androidAppUrl)
      ? platform.androidAppUrl.trim()
      : '';

  const appStoreCaption = pick(
    bannerData?.storeBadges?.appStoreCaption,
    isAr ? 'حمله من' : 'Download on'
  );
  const googlePlayCaption = pick(
    bannerData?.storeBadges?.googlePlayCaption,
    isAr ? 'احصل عليه من' : 'Get it on'
  );

  const qrImageUrl = modalData?.qrImageUrl?.trim() || '';
  const qrTargetUrl = modalData?.qrTargetUrl?.trim() || '';
  const hasQr = Boolean((qrImageUrl && isSafeHref(qrImageUrl)) || (qrTargetUrl && isSafeHref(qrTargetUrl)));
  const scanLabel = pick(modalData?.scanLabel, isAr ? 'امسح الكود بجوالك' : 'Scan QR with Camera');
  const smsButtonLabel = pick(
    modalData?.smsFallbackButton,
    isAr ? 'إرسال رابط تحميل التطبيق برسالة SMS لجوالك' : 'Send App Download Link via SMS'
  );

  const countryCode = bannerData?.smsForm?.countryCode || '+966';

  const handleCopyPromo = () => {
    if (!promo?.code) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(promo.code).catch(() => {});
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSmsTrigger = () => {
    if (featureFlags.enableSmsAppLink) {
      setShowSmsForm((prev) => !prev);
      setSmsError(null);
    } else {
      onClose();
      scrollTo('#download-banner');
    }
  };

  const handleSmsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = smsPhone.trim();
    if (!cleaned || smsLoading) return;

    setSmsLoading(true);
    setSmsError(null);
    setSmsSuccess(false);

    try {
      const normalized =
        cleaned.startsWith('+') || cleaned.startsWith('0') ? cleaned : `${countryCode}${cleaned}`;
      const res = await requestAppLinkSms({ phone: normalized, locale });
      if (res.sent) {
        setSmsSuccess(true);
        setSmsPhone('');
      }
    } catch (err) {
      if (err instanceof WebsiteApiError) {
        setSmsError(err.getDisplayMessage(locale));
      } else {
        setSmsError(
          isAr
            ? 'تعذر إرسال رابط التطبيق حالياً. يرجى المحاولة لاحقاً.'
            : 'Could not send app link right now. Please try again later.'
        );
      }
    } finally {
      setSmsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/65 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        data-lenis-prevent
        className="bg-white dark:bg-[#10182C] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 dark:border-line relative transition-colors duration-200 max-h-[92vh] overflow-x-hidden overflow-y-auto overscroll-contain"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-5 rtl:right-auto ltr:right-5 ltr:left-auto p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#17223C] text-neutral-400 dark:text-ink-subtle hover:text-neutral-700 dark:hover:text-ink transition cursor-pointer"
          aria-label={isAr ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-brand dark:bg-primary-solid text-brand-lime flex items-center justify-center shrink-0 shadow-sm">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="text-right rtl:text-right ltr:text-left">
            <h3 className="text-lg font-black text-neutral-900 dark:text-ink">{title}</h3>
            <p className="text-xs text-neutral-500 dark:text-ink-muted font-medium">{subtitle}</p>
          </div>
        </div>

        {pickup || destination || vehicleName || startingPriceLabel ? (
          <div className="space-y-3 bg-neutral-50 dark:bg-[#17223C] p-4 rounded-2xl border border-neutral-200/80 dark:border-line mb-4">
            {pickup ? (
              <div className="flex items-start gap-2.5">
                <Navigation className="w-4 h-4 text-brand dark:text-brand-lime shrink-0 mt-0.5" />
                <div className="text-right rtl:text-right ltr:text-left flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-neutral-400 dark:text-ink-subtle block">
                    {pick(fareCalc?.labels?.pickupPoint, isAr ? 'نقطة الانطلاق' : 'Pickup Point')}
                  </span>
                  <span className="text-xs font-bold text-neutral-900 dark:text-ink block truncate">
                    {pickup}
                  </span>
                </div>
              </div>
            ) : null}

            {destination ? (
              <div
                className={`flex items-start gap-2.5 ${
                  pickup ? 'pt-2.5 border-t border-neutral-200/60 dark:border-line' : ''
                }`}
              >
                <MapPin className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                <div className="text-right rtl:text-right ltr:text-left flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-neutral-400 dark:text-ink-subtle block">
                    {pick(fareCalc?.labels?.destination, isAr ? 'الوجهة المقصودة' : 'Destination')}
                  </span>
                  <span className="text-xs font-bold text-neutral-900 dark:text-ink block truncate">
                    {destination}
                  </span>
                </div>
              </div>
            ) : null}

            {vehicleName || startingPriceLabel ? (
              <div
                className={`flex items-center justify-between gap-3 ${
                  pickup || destination
                    ? 'pt-2.5 border-t border-neutral-200/60 dark:border-line'
                    : ''
                }`}
              >
                {vehicleName ? (
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 dark:text-ink-subtle block">
                      {pick(fareCalc?.labels?.previewBadge, isAr ? 'معاينة فئة التطبيق' : 'App Class Preview')}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{vehicleName}</span>
                    </div>
                  </div>
                ) : (
                  <div />
                )}
                {startingPriceLabel ? (
                  <div className="text-sm sm:text-base font-black text-brand dark:text-brand-lime text-end">
                    {startingPriceLabel}
                  </div>
                ) : !isDynamicMode ? (
                  <span className="text-xs font-bold text-neutral-500 dark:text-ink-muted">
                    {pick(fareCalc?.labels?.surgeLock)}
                  </span>
                ) : null}
              </div>
            ) : null}

            {demoNotice ? (
              <p className="text-[11px] text-neutral-500 dark:text-ink-subtle pt-2 border-t border-neutral-200/60 dark:border-line leading-relaxed">
                {demoNotice}
              </p>
            ) : null}
          </div>
        ) : demoNotice ? (
          <div className="rounded-2xl bg-neutral-50 dark:bg-[#17223C] p-3.5 border border-neutral-200/80 dark:border-line mb-4">
            <p className="text-[11px] text-neutral-500 dark:text-ink-subtle leading-relaxed">
              {demoNotice}
            </p>
          </div>
        ) : null}

        {promo ? (
          <div className="p-3 rounded-2xl bg-brand/5 dark:bg-brand-lime/10 border border-brand/15 dark:border-brand-lime/25 flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-brand dark:text-brand-lime shrink-0" />
              <span className="font-bold text-neutral-800 dark:text-ink">{pick(promo.text)}</span>
            </div>
            {promo.code?.trim() ? (
              <button
                type="button"
                onClick={handleCopyPromo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand dark:bg-brand-lime text-white dark:text-neutral-950 font-black font-en text-xs shadow-sm hover:opacity-90 transition cursor-pointer shrink-0"
              >
                <span>{promo.code}</span>
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            ) : null}
          </div>
        ) : null}

        <div className={`grid grid-cols-1 ${hasQr ? 'sm:grid-cols-12' : ''} gap-4 items-center mb-5`}>
          <div className={`${hasQr ? 'sm:col-span-7' : ''} flex flex-col gap-2.5`}>
            {iosUrl ? (
              <a
                href={iosUrl}
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
                  <span className="text-[10px] text-neutral-500 block mb-0.5">{appStoreCaption}</span>
                  <span className="text-sm font-black font-en text-neutral-900 block">App Store</span>
                </div>
              </a>
            ) : (
              <div
                aria-disabled="true"
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-[#17223C]/60 text-neutral-500 dark:text-ink-subtle border border-neutral-200 dark:border-line opacity-80"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/apple.svg"
                    alt="App Store"
                    width={22}
                    height={22}
                    className="w-5 h-5 object-contain opacity-60"
                  />
                  <div className="text-right rtl:text-right ltr:text-left leading-none">
                    <span className="text-[10px] block mb-0.5">{appStoreCaption}</span>
                    <span className="text-sm font-black font-en block">App Store</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-line text-neutral-600 dark:text-ink-muted">
                  {isAr ? 'قريباً' : 'Soon'}
                </span>
              </div>
            )}

            {androidUrl ? (
              <a
                href={androidUrl}
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
                    {googlePlayCaption}
                  </span>
                  <span className="text-sm font-black font-en block">Google Play</span>
                </div>
              </a>
            ) : (
              <div
                aria-disabled="true"
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-[#17223C]/60 text-neutral-500 dark:text-ink-subtle border border-neutral-200 dark:border-line opacity-80"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/google-play.svg"
                    alt="Google Play"
                    width={22}
                    height={22}
                    className="w-5 h-5 object-contain opacity-60"
                  />
                  <div className="text-right rtl:text-right ltr:text-left leading-none">
                    <span className="text-[10px] block mb-0.5">{googlePlayCaption}</span>
                    <span className="text-sm font-black font-en block">Google Play</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-line text-neutral-600 dark:text-ink-muted">
                  {isAr ? 'قريباً' : 'Soon'}
                </span>
              </div>
            )}
          </div>

          {hasQr ? (
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#0A0F1D] border border-neutral-200 dark:border-line text-center">
              <div className="w-24 h-24 bg-white rounded-xl p-1.5 flex items-center justify-center mb-1.5 border border-neutral-200">
                <QrCodeDisplay
                  qrImageUrl={qrImageUrl}
                  qrTargetUrl={qrTargetUrl}
                  alt={scanLabel}
                  size={84}
                />
              </div>
              <span className="text-[10px] font-bold text-neutral-600 dark:text-ink-muted">
                {scanLabel}
              </span>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleSmsTrigger}
          className="w-full py-3 px-4 rounded-xl bg-brand/5 dark:bg-white/5 hover:bg-brand/10 dark:hover:bg-white/10 text-brand dark:text-brand-lime font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-brand/15 dark:border-line"
        >
          <Download className="w-4 h-4" />
          <span>{smsButtonLabel}</span>
        </button>

        {showSmsForm && featureFlags.enableSmsAppLink ? (
          <div className="mt-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#17223C] border border-neutral-200 dark:border-line space-y-2.5">
            {smsSuccess ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {pick(
                    bannerData?.smsForm?.successMessage,
                    isAr
                      ? 'تم إرسال رابط تحميل كوا بنجاح عبر رسالة نصية SMS إلى هاتفك!'
                      : 'KOWA app download link has been sent via SMS!'
                  )}
                </span>
              </div>
            ) : (
              <form onSubmit={handleSmsSubmit} className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1 bg-white dark:bg-[#10182C] border border-neutral-200 dark:border-line rounded-xl px-3 py-2">
                  <span className="text-xs font-black font-en text-neutral-500" dir="ltr">
                    {countryCode}
                  </span>
                  <input
                    type="tel"
                    required
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                    placeholder={bannerData?.smsForm?.placeholder || '5XXXXXXXX'}
                    className="w-full bg-transparent text-xs font-en text-ink focus:outline-none"
                    dir="ltr"
                  />
                </div>
                <button
                  type="submit"
                  disabled={smsLoading}
                  className="px-3.5 py-2 rounded-xl bg-brand dark:bg-brand-lime text-white dark:text-neutral-950 font-black text-xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {smsLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {pick(
                      bannerData?.smsForm?.buttonLabel,
                      isAr ? 'إرسال الرابط' : 'Send'
                    )}
                  </span>
                </button>
              </form>
            )}

            {smsError ? (
              <div className="flex items-start gap-2 text-xs font-bold text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{smsError}</span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
