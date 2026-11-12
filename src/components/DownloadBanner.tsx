'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, Smartphone, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import MagneticButton from './MagneticButton';
import { QrCodeDisplay } from './QrCodeDisplay';
import { isSafeHref } from '@/lib/cms-helpers';
import { requestAppLinkSms, WebsiteApiError } from '@/lib/website-api';

export const DownloadBanner: React.FC = () => {
  const { locale, pick } = useLanguage();
  const { sections, platform, featureFlags } = useWebsiteConfig();
  const isAr = locale === 'ar';

  const [phone, setPhone] = useState('');
  const [smsLoading, setSmsLoading] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [smsError, setSmsError] = useState<string | null>(null);

  const data = sections.download_banner;
  if (!data) return null;

  const badgeTagline = pick(data.badge?.tagline);
  const rawPromo = data.badge?.promo;
  const promoEnabled = Boolean(rawPromo && rawPromo.isEnabled !== false);
  const promoText = promoEnabled ? pick(rawPromo?.text).trim() : '';
  const promoCode = promoEnabled ? rawPromo?.code?.trim() || '' : '';
  const promoDisplay =
    promoText && promoCode && !promoText.includes(promoCode)
      ? `${promoText} (${promoCode})`
      : promoText || promoCode;

  const iosUrl =
    platform?.iosAppUrl && isSafeHref(platform.iosAppUrl) ? platform.iosAppUrl.trim() : '';
  const androidUrl =
    platform?.androidAppUrl && isSafeHref(platform.androidAppUrl)
      ? platform.androidAppUrl.trim()
      : '';

  const qrImageUrl = data.qrBox?.qrImageUrl?.trim() || '';
  const qrTargetUrl = data.qrBox?.qrTargetUrl?.trim() || '';
  const hasQr = Boolean(
    (qrImageUrl && isSafeHref(qrImageUrl)) || (qrTargetUrl && isSafeHref(qrTargetUrl))
  );

  const countryCode = data.smsForm?.countryCode || '+966';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.trim();
    if (!cleaned || smsLoading) return;

    setSmsLoading(true);
    setSmsSent(false);
    setSmsError(null);

    try {
      const normalized =
        cleaned.startsWith('+') || cleaned.startsWith('0') ? cleaned : `${countryCode}${cleaned}`;
      const res = await requestAppLinkSms({ phone: normalized, locale });
      if (res.sent) {
        setSmsSent(true);
        setPhone('');
      }
    } catch (err: unknown) {
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

  const storeItems = [
    {
      key: 'ios',
      name: 'App Store',
      caption: pick(data.storeBadges?.appStoreCaption),
      href: iosUrl,
      iconSrc: '/apple.svg',
      invertOnDark: true,
    },
    {
      key: 'android',
      name: 'Google Play',
      caption: pick(data.storeBadges?.googlePlayCaption),
      href: androidUrl,
      iconSrc: '/google-play.svg',
      invertOnDark: false,
    },
  ];

  const showTopDockContent = Boolean(hasQr || featureFlags.enableSmsAppLink);

  return (
    <section
      className="py-16 lg:py-24 bg-neutral-50 dark:bg-[#0A0F1D] border-t border-neutral-200 dark:border-line transition-colors duration-200 overflow-hidden"
      id="download-banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#180C76] via-[#1F0F8C] to-[#091233] dark:from-[#180C76] dark:via-[#110852] dark:to-[#060A18] p-6 sm:p-10 lg:p-14 text-white shadow-[0_32px_70px_-20px_rgba(31,15,140,0.48)] border border-white/15"
        >
          {/* Subtle atmospheric glow & geometric accents */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.85) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#3B82F6]/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 right-1/4 w-96 h-96 rounded-full bg-white/[0.06] blur-3xl"
          />
          <motion.div
            aria-hidden="true"
            animate={{ scale: [1, 1.12, 1], opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute -right-16 -bottom-16 w-72 h-72 border border-white/20 rounded-full"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Editorial Value Column */}
            <div className="lg:col-span-6 text-right rtl:text-right ltr:text-left">
              {(badgeTagline || promoDisplay) ? (
                <div className="flex flex-wrap items-center gap-2.5 mb-5">
                  {badgeTagline ? (
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/[0.11] backdrop-blur-md border border-white/20 text-blue-50 text-xs font-semibold">
                      {badgeTagline}
                    </span>
                  ) : null}
                  {promoDisplay ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-brand text-xs font-bold shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>{promoDisplay}</span>
                    </span>
                  ) : null}
                </div>
              ) : null}

              <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-white mb-4 leading-[1.26] tracking-tight">
                {pick(data.headline)}
              </h2>
              <p className="text-blue-100/80 text-sm sm:text-base lg:text-[1.05rem] leading-relaxed max-w-xl">
                {pick(data.subtitle)}
              </p>
            </div>

            {/* Elevated Glass Action Dock */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-white/[0.08] backdrop-blur-xl border border-white/20 p-5 sm:p-7 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.4)] space-y-4">
                {hasQr ? (
                  <div className="rounded-2xl bg-white/95 dark:bg-[#10182C] p-4 border border-white/30 dark:border-line shadow-md flex items-center gap-4 text-neutral-900 dark:text-ink transition-colors duration-200">
                    <div className="w-24 h-24 shrink-0 bg-white rounded-xl p-1.5 flex items-center justify-center border border-neutral-200">
                      <QrCodeDisplay
                        qrImageUrl={qrImageUrl}
                        qrTargetUrl={qrTargetUrl}
                        alt={pick(data.qrBox?.title)}
                        size={84}
                      />
                    </div>
                    <div className="min-w-0 text-right rtl:text-right ltr:text-left">
                      <div className="text-sm font-bold text-neutral-900 dark:text-ink mb-1">
                        {pick(data.qrBox?.title)}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-ink-subtle leading-relaxed">
                        {pick(data.qrBox?.subtitle)}
                      </div>
                    </div>
                  </div>
                ) : null}

                {featureFlags.enableSmsAppLink ? (
                  <div>
                    <form
                      onSubmit={handleSubmit}
                      className="rounded-2xl bg-[#070C24]/70 border border-white/15 focus-within:border-white/50 p-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition-colors"
                    >
                      <div
                        className="flex items-center gap-2.5 flex-1 px-3 py-2 sm:py-0 min-w-0"
                        dir="ltr"
                      >
                        <Smartphone className="w-4 h-4 text-blue-200/70 shrink-0" />
                        <span className="text-xs font-bold text-blue-100 font-en bg-white/[0.09] px-2.5 py-1 rounded-lg shrink-0">
                          {countryCode}
                        </span>
                        <input
                          className="w-full min-w-0 bg-transparent border-0 p-0 text-sm font-semibold text-white placeholder-white/45 focus:outline-none focus:ring-0 font-en"
                          dir="ltr"
                          aria-label={data.smsForm?.placeholder || '5XXXXXXXX'}
                          placeholder={data.smsForm?.placeholder || '5XXXXXXXX'}
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      <MagneticButton strength={0.2} as="div" className="w-full sm:w-auto shrink-0">
                        <button
                          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white text-brand font-bold text-xs sm:text-sm hover:bg-[#EFF6FF] transition-colors whitespace-nowrap cursor-pointer shadow-md disabled:opacity-60 inline-flex items-center justify-center gap-2"
                          type="submit"
                          disabled={smsLoading}
                        >
                          {smsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          <span>{pick(data.smsForm?.buttonLabel)}</span>
                        </button>
                      </MagneticButton>
                    </form>

                    {smsSent ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs text-emerald-100 flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                        <span>{pick(data.smsForm?.successMessage)}</span>
                      </motion.div>
                    ) : null}

                    {smsError ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-rose-500/20 border border-rose-400/40 rounded-xl text-xs text-rose-100 flex items-start gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                        <span>{smsError}</span>
                      </motion.div>
                    ) : null}
                  </div>
                ) : null}

                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${
                    showTopDockContent ? 'pt-4 border-t border-white/15' : ''
                  }`}
                >
                  {storeItems.map((store) =>
                    store.href ? (
                      <MagneticButton
                        key={store.key}
                        strength={0.18}
                        href={store.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <span className="w-full inline-flex items-center justify-center sm:justify-start gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-[#EFF6FF] text-neutral-900 shadow-md transition-all duration-200 cursor-pointer">
                          <Image
                            src={store.iconSrc}
                            alt={store.name}
                            width={24}
                            height={24}
                            className="w-6 h-6 object-contain shrink-0"
                          />
                          <div className="flex flex-col text-right rtl:text-right ltr:text-left leading-none">
                            <span className="text-[11px] text-neutral-500 font-medium leading-tight mb-0.5">
                              {store.caption}
                            </span>
                            <span className="text-sm font-bold font-en text-neutral-900 leading-tight">
                              {store.name}
                            </span>
                          </div>
                        </span>
                      </MagneticButton>
                    ) : (
                      <div
                        key={store.key}
                        aria-disabled="true"
                        className="w-full inline-flex items-center justify-center sm:justify-start gap-3 px-4 py-3 rounded-2xl bg-white/[0.1] border border-white/20 text-white"
                      >
                        <Image
                          src={store.iconSrc}
                          alt={store.name}
                          width={24}
                          height={24}
                          className={`w-6 h-6 object-contain shrink-0 ${
                            store.invertOnDark ? 'brightness-0 invert' : ''
                          }`}
                        />
                        <div className="flex flex-col text-right rtl:text-right ltr:text-left leading-none">
                          <span className="text-[11px] text-blue-100/75 font-medium leading-tight mb-0.5">
                            {store.caption}
                          </span>
                          <span className="text-sm font-bold font-en text-white leading-tight">
                            {store.name} · {isAr ? 'قريباً' : 'Soon'}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
