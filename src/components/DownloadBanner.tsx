'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
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

  return (
    <section
      className="py-16 lg:py-20 bg-neutral-50 dark:bg-[#0A0F1D] border-t border-neutral-200 dark:border-line transition-colors duration-200 overflow-hidden"
      id="download-banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-br from-brand via-brand-dark to-neutral-900 dark:from-[#1F0F8C] dark:via-[#140959] dark:to-[#070B14] rounded-3xl p-8 sm:p-12 text-white shadow-elevated relative overflow-hidden"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.16, 0.08] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-12 -bottom-12 w-64 h-64 border-8 border-white/20 rounded-full pointer-events-none"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div
              className={`${
                hasQr ? 'lg:col-span-7' : 'lg:col-span-12'
              } text-right rtl:text-right ltr:text-left`}
            >
              {badgeTagline || promoDisplay ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-brand text-xs font-black mb-3 shadow-sm flex-wrap">
                  {badgeTagline ? <span>{badgeTagline}</span> : null}
                  {badgeTagline && promoDisplay ? <span>•</span> : null}
                  {promoDisplay ? <span>{promoDisplay}</span> : null}
                </div>
              ) : null}

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 leading-tight">
                {pick(data.headline)}
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                {pick(data.subtitle)}
              </p>

              {featureFlags.enableSmsAppLink ? (
                <>
                  <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 max-w-lg mb-4">
                    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
                      <div className="flex items-center gap-2 flex-1 px-3">
                        <span className="text-xs font-bold text-neutral-300 font-en" dir="ltr">
                          {countryCode}
                        </span>
                        <input
                          className="w-full bg-transparent border-0 p-0 text-sm font-bold text-white placeholder-neutral-400 focus:outline-none focus:ring-0"
                          dir="ltr"
                          placeholder={data.smsForm?.placeholder || '5XXXXXXXX'}
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <MagneticButton strength={0.25} as="div">
                        <button
                          className="px-4 py-2.5 rounded-xl bg-white text-brand font-bold text-xs hover:bg-[#EFF6FF] transition whitespace-nowrap cursor-pointer shadow-sm disabled:opacity-60 inline-flex items-center gap-1.5"
                          type="submit"
                          disabled={smsLoading}
                        >
                          {smsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                          <span>{pick(data.smsForm?.buttonLabel)}</span>
                        </button>
                      </MagneticButton>
                    </form>
                  </div>

                  {smsSent ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2 max-w-lg"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                      <span>{pick(data.smsForm?.successMessage)}</span>
                    </motion.div>
                  ) : null}

                  {smsError ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-3 bg-rose-500/20 border border-rose-400/40 rounded-xl text-xs text-rose-100 flex items-start gap-2 max-w-lg"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                      <span>{smsError}</span>
                    </motion.div>
                  ) : null}
                </>
              ) : null}

              <div className="flex flex-wrap items-center gap-3 mt-2">
                {iosUrl ? (
                  <MagneticButton
                    strength={0.2}
                    href={iosUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
                          {pick(data.storeBadges?.appStoreCaption)}
                        </span>
                        <span className="text-sm font-black font-en text-neutral-900 leading-tight">
                          App Store
                        </span>
                      </div>
                    </span>
                  </MagneticButton>
                ) : (
                  <div
                    aria-disabled="true"
                    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/15 border border-white/20 text-white/80 opacity-85"
                  >
                    <Image
                      src="/apple.svg"
                      alt="App Store"
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain opacity-80"
                    />
                    <div className="flex flex-col text-right rtl:text-right ltr:text-left leading-none">
                      <span className="text-[10px] text-white/70 font-medium leading-tight">
                        {pick(data.storeBadges?.appStoreCaption)}
                      </span>
                      <span className="text-sm font-black font-en leading-tight">
                        App Store · {isAr ? 'قريباً' : 'Soon'}
                      </span>
                    </div>
                  </div>
                )}

                {androidUrl ? (
                  <MagneticButton
                    strength={0.2}
                    href={androidUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
                          {pick(data.storeBadges?.googlePlayCaption)}
                        </span>
                        <span className="text-sm font-black font-en text-neutral-900 leading-tight">
                          Google Play
                        </span>
                      </div>
                    </span>
                  </MagneticButton>
                ) : (
                  <div
                    aria-disabled="true"
                    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/15 border border-white/20 text-white/80 opacity-85"
                  >
                    <Image
                      src="/google-play.svg"
                      alt="Google Play"
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain opacity-80"
                    />
                    <div className="flex flex-col text-right rtl:text-right ltr:text-left leading-none">
                      <span className="text-[10px] text-white/70 font-medium leading-tight">
                        {pick(data.storeBadges?.googlePlayCaption)}
                      </span>
                      <span className="text-sm font-black font-en leading-tight">
                        Google Play · {isAr ? 'قريباً' : 'Soon'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {hasQr ? (
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="bg-white dark:bg-[#10182C] p-6 rounded-3xl text-neutral-900 dark:text-ink text-center shadow-2xl max-w-xs border border-neutral-200 dark:border-line transition-colors duration-200"
                >
                  <div className="w-40 h-40 bg-white mx-auto rounded-2xl p-2 flex items-center justify-center mb-3 border border-neutral-200">
                    <QrCodeDisplay
                      qrImageUrl={qrImageUrl}
                      qrTargetUrl={qrTargetUrl}
                      alt={pick(data.qrBox?.title)}
                      size={140}
                    />
                  </div>
                  <div className="text-xs font-bold text-neutral-800 dark:text-ink">
                    {pick(data.qrBox?.title)}
                  </div>
                  <div className="text-[11px] text-neutral-400 dark:text-ink-subtle">
                    {pick(data.qrBox?.subtitle)}
                  </div>
                </motion.div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
