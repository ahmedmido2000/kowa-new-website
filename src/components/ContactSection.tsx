'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import MagneticButton from './MagneticButton';
import { submitContactInquiry, WebsiteApiError } from '@/lib/website-api';
import { isSafeHref, normalizeTelHref, normalizeWhatsappHref } from '@/lib/cms-helpers';

export const ContactSection: React.FC = () => {
  const { locale, isRtl, pick } = useLanguage();
  const { sections, site, platform } = useWebsiteConfig();
  const isAr = locale === 'ar';

  const data = sections.contact;
  const subjects = useMemo(
    () => (data?.form?.subjects || []).filter((s) => s.isEnabled !== false),
    [data?.form?.subjects]
  );

  const defaultSubjectId = subjects[0]?.id || 'general';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subjectId: defaultSubjectId,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    message: string;
    ticketId?: string;
  } | null>(null);

  useEffect(() => {
    const handleCaptainInquiry = (ev: Event) => {
      const customEv = ev as CustomEvent<{ subjectId?: string }>;
      const targetId = customEv.detail?.subjectId || 'captain';
      const matched = subjects.find((s) => s.id === targetId);
      if (matched) {
        setFormData((prev) => ({ ...prev, subjectId: matched.id }));
      }
    };
    window.addEventListener('kowa:captain-inquiry', handleCaptainInquiry);
    return () => window.removeEventListener('kowa:captain-inquiry', handleCaptainInquiry);
  }, [subjects]);

  if (!data) return null;

  const addressText = (
    pick(platform?.address) || pick(data.form?.placeholders?.location)
  ).trim();
  const headquartersSubtext = (
    pick(data.cards?.headerquarterNote) ||
    pick(data.cards?.headquartersNote) ||
    pick(site?.company?.fullName)
  ).trim();
  const supportEmail = (platform?.supportEmail || '').trim();
  const whatsappHref = normalizeWhatsappHref(platform?.whatsapp, site?.socials || []);
  const whatsappDisplay =
    (platform?.whatsapp || '').trim() ||
    site?.socials?.find((s) => s.id === 'whatsapp')?.username ||
    '';
  const hotline = (platform?.hotline || site?.company?.hotline || '').trim();
  const hotlineDisplay = (
    platform?.hotlineDisplay ||
    site?.company?.hotlineDisplay ||
    hotline
  ).trim();
  const hotlineHref = normalizeTelHref(hotline);
  const socials = (site?.socials || []).filter((s) => s.isEnabled !== false && isSafeHref(s.href));

  const activeSubjectId = subjects.some((s) => s.id === formData.subjectId)
    ? formData.subjectId
    : defaultSubjectId;
  const activeSubjectObj = subjects.find((s) => s.id === activeSubjectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const nameTrimmed = formData.fullName.trim();
    const phoneTrimmed = formData.phone.trim();
    const emailTrimmed = formData.email.trim();
    const messageTrimmed = formData.message.trim();

    if (nameTrimmed.length < 2 || nameTrimmed.length > 100) {
      setStatus({
        type: 'error',
        message: isAr
          ? 'يرجى كتابة الاسم الكامل (حرفين إلى 100 حرف).'
          : 'Please enter your full name (2 to 100 characters).',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed) || emailTrimmed.length > 254) {
      setStatus({
        type: 'error',
        message: isAr ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.',
      });
      return;
    }

    const phoneDigitsCount = (phoneTrimmed.match(/[\d٠-٩۰-۹]/g) || []).length;
    const hasInvalidPhoneChars = /[^\d٠-٩۰-۹\s+\-()]/.test(phoneTrimmed);
    if (hasInvalidPhoneChars || phoneDigitsCount < 8 || phoneDigitsCount > 24) {
      setStatus({
        type: 'error',
        message: isAr
          ? 'يرجى إدخال رقم جوال صحيح (8 إلى 24 رقماً).'
          : 'Please enter a valid phone number (8 to 24 digits).',
      });
      return;
    }

    if (messageTrimmed.length < 5 || messageTrimmed.length > 2000) {
      setStatus({
        type: 'error',
        message: isAr
          ? 'يرجى كتابة نص الرسالة (5 إلى 2000 حرف).'
          : 'Please write your message (5 to 2000 characters).',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContactInquiry({
        name: nameTrimmed,
        phone: phoneTrimmed,
        email: emailTrimmed,
        subjectId: activeSubjectObj?.id || activeSubjectId,
        subject: activeSubjectObj ? pick(activeSubjectObj.label) : undefined,
        message: messageTrimmed,
        locale,
      });

      setStatus({
        type: 'success',
        message: pick(
          data.form?.successMessage,
          isAr
            ? 'تم استلام رسالتك بنجاح! سيقوم فريق خدمة عملاء كوا بالرد عليك بأسرع وقت.'
            : 'Your inquiry has been submitted! KOWA customer support will contact you shortly.'
        ),
        ticketId: result.ticketId,
      });

      setFormData({
        fullName: '',
        phone: '',
        email: '',
        subjectId: defaultSubjectId,
        message: '',
      });
    } catch (err: unknown) {
      if (err instanceof WebsiteApiError) {
        setStatus({
          type: 'error',
          message: err.getDisplayMessage(locale),
        });
      } else {
        setStatus({
          type: 'error',
          message: isAr
            ? 'فشل الاتصال بالخادم، يرجى المحاولة مرة أخرى.'
            : 'Network error, please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="py-16 lg:py-24 bg-neutral-50/60 dark:bg-[#0A0F1D] border-t border-neutral-200 dark:border-line transition-colors duration-200 overflow-hidden"
      id="contact"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-black uppercase text-brand dark:text-brand-lime tracking-widest bg-brand/5 dark:bg-brand-lime/10 px-3 py-1 rounded-full border border-brand/10 dark:border-brand-lime/20">
            {pick(data.badge)}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-ink mt-3 mb-4">
            {pick(data.headline)}
          </h2>
          <p className="text-neutral-600 dark:text-ink-muted text-sm sm:text-base leading-relaxed">
            {pick(data.subtitle)}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-4 text-right rtl:text-right ltr:text-left"
          >
            {addressText ? (
              <div className="bg-white dark:bg-[#10182C] p-5 rounded-2xl border border-neutral-200/80 dark:border-line shadow-subtle flex items-start gap-4 transition hover:border-brand/40 dark:hover:border-primary-token/40">
                <div className="w-12 h-12 rounded-xl bg-brand/10 dark:bg-primary-token/20 text-brand dark:text-primary-token flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-brand dark:text-primary-token" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-400 dark:text-ink-subtle block mb-0.5">
                    {pick(data.cards?.headquartersLabel)}
                  </span>
                  <span className="text-sm font-black text-neutral-900 dark:text-ink block">
                    {addressText}
                  </span>
                  {headquartersSubtext ? (
                    <span className="text-xs text-neutral-500 dark:text-ink-muted font-medium">
                      {headquartersSubtext}
                    </span>
                  ) : null}
                </div>
              </div>
            ) : null}

            {supportEmail ? (
              <a
                href={`mailto:${supportEmail}`}
                className="bg-white dark:bg-[#10182C] p-5 rounded-2xl border border-neutral-200/80 dark:border-line shadow-subtle flex items-start gap-4 transition hover:border-brand/40 dark:hover:border-primary-token/40 group block cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-brand/10 dark:bg-primary-token/20 text-brand dark:text-primary-token flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-6 h-6 text-brand dark:text-primary-token" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-400 dark:text-ink-subtle block mb-0.5">
                    {pick(data.cards?.emailLabel)}
                  </span>
                  <span className="text-sm font-black text-brand dark:text-brand-lime font-en block">
                    <span dir="ltr" className="inline-block">
                      {supportEmail}
                    </span>
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-ink-muted font-medium">
                    {pick(data.cards?.emailNote)}
                  </span>
                </div>
              </a>
            ) : null}

            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-[#10182C] p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-subtle flex items-start gap-4 transition hover:border-emerald-400 group block cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-400 dark:text-ink-subtle">
                      {pick(data.cards?.whatsappLabel)}
                    </span>
                    {pick(data.cards?.whatsappLiveBadge) ? (
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.2 rounded-full">
                        {pick(data.cards?.whatsappLiveBadge)}
                      </span>
                    ) : null}
                  </div>
                  {whatsappDisplay ? (
                    <span className="text-sm font-black text-neutral-900 dark:text-ink font-en block" dir="ltr">
                      {whatsappDisplay}
                    </span>
                  ) : null}
                  <span className="text-xs text-neutral-500 dark:text-ink-muted font-medium">
                    {pick(data.cards?.whatsappNote)}
                  </span>
                </div>
              </a>
            ) : null}

            {hotlineHref && hotlineDisplay ? (
              <a
                href={hotlineHref}
                className="bg-white dark:bg-[#10182C] p-5 rounded-2xl border border-neutral-200/80 dark:border-line shadow-subtle flex items-start gap-4 transition hover:border-brand/40 dark:hover:border-primary-token/40 group block cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-brand/10 dark:bg-primary-token/20 text-brand dark:text-primary-token flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6 text-brand dark:text-primary-token" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-400 dark:text-ink-subtle block mb-0.5">
                    {pick(data.cards?.hotlineLabel)}
                  </span>
                  <span className="text-sm font-black text-brand dark:text-brand-lime font-en block">
                    <span dir="ltr" className="inline-block">
                      {hotlineDisplay}
                    </span>
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-ink-muted font-medium">
                    {pick(data.cards?.hotlineNote)}
                  </span>
                </div>
              </a>
            ) : null}

            {pick(data.workingHours?.title) || pick(data.workingHours?.text) ? (
              <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-[#17223C] border border-neutral-200 dark:border-line text-xs flex items-center gap-3">
                <Clock className="w-5 h-5 text-neutral-500 dark:text-ink-subtle shrink-0" />
                <div className="text-neutral-600 dark:text-ink-muted">
                  <span className="font-bold text-neutral-900 dark:text-ink block">
                    {pick(data.workingHours?.title)}
                  </span>
                  <span>{pick(data.workingHours?.text)}</span>
                </div>
              </div>
            ) : null}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-white dark:bg-[#10182C] rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-line shadow-elevated transition-colors duration-200"
          >
            <h3 className="text-xl font-black text-neutral-900 dark:text-ink mb-2 text-right rtl:text-right ltr:text-left">
              {pick(data.form?.title)}
            </h3>
            <p className="text-neutral-500 dark:text-ink-muted text-xs sm:text-sm mb-6 text-right rtl:text-right ltr:text-left">
              {pick(data.form?.subtitle)}
            </p>

            {status ? (
              <div
                className={`p-4 rounded-2xl mb-6 text-xs flex items-start gap-3 ${
                  status.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-bold leading-relaxed">{status.message}</p>
                  {status.ticketId ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 font-black font-en text-[11px]">
                      <span>{isAr ? 'رقم التذكرة المرجعي:' : 'Ticket Reference:'}</span>
                      <span>{status.ticketId}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-right rtl:text-right ltr:text-left">
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-bold text-neutral-700 dark:text-ink mb-1.5"
                  >
                    {pick(data.form?.labels?.fullName)}
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={pick(data.form?.placeholders?.fullName)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-line bg-neutral-50 dark:bg-[#17223C] text-sm text-neutral-900 dark:text-ink placeholder-neutral-400 dark:placeholder-ink-subtle focus:outline-none focus:border-brand dark:focus:border-primary-token focus:bg-white dark:focus:bg-[#10182C] transition"
                  />
                </div>

                <div className="text-right rtl:text-right ltr:text-left">
                  <label
                    htmlFor="contactPhone"
                    className="block text-xs font-bold text-neutral-700 dark:text-ink mb-1.5"
                  >
                    {pick(data.form?.labels?.phone)}
                  </label>
                  <input
                    id="contactPhone"
                    type="tel"
                    required
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={pick(data.form?.placeholders?.phone, '+966 5X XXX XXXX')}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-line bg-neutral-50 dark:bg-[#17223C] text-sm text-neutral-900 dark:text-ink placeholder-neutral-400 dark:placeholder-ink-subtle focus:outline-none focus:border-brand dark:focus:border-primary-token focus:bg-white dark:focus:bg-[#10182C] transition text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-right rtl:text-right ltr:text-left">
                  <label
                    htmlFor="contactEmail"
                    className="block text-xs font-bold text-neutral-700 dark:text-ink mb-1.5"
                  >
                    {pick(data.form?.labels?.email)}
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    required
                    dir="ltr"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={pick(data.form?.placeholders?.email, 'name@example.com')}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-line bg-neutral-50 dark:bg-[#17223C] text-sm text-neutral-900 dark:text-ink placeholder-neutral-400 dark:placeholder-ink-subtle focus:outline-none focus:border-brand dark:focus:border-primary-token focus:bg-white dark:focus:bg-[#10182C] transition font-en text-left"
                  />
                </div>

                {subjects.length > 0 ? (
                  <div className="text-right rtl:text-right ltr:text-left">
                    <label
                      htmlFor="contactSubject"
                      className="block text-xs font-bold text-neutral-700 dark:text-ink mb-1.5"
                    >
                      {pick(data.form?.labels?.subject)}
                    </label>
                    <select
                      id="contactSubject"
                      value={activeSubjectId}
                      onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-line bg-neutral-50 dark:bg-[#17223C] text-sm text-neutral-900 dark:text-ink focus:outline-none focus:border-brand dark:focus:border-primary-token focus:bg-white dark:focus:bg-[#10182C] transition cursor-pointer"
                    >
                      {subjects.map((subj) => (
                        <option key={subj.id} value={subj.id}>
                          {pick(subj.label)}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </div>

              <div className="text-right rtl:text-right ltr:text-left">
                <label
                  htmlFor="contactMsg"
                  className="block text-xs font-bold text-neutral-700 dark:text-ink mb-1.5"
                >
                  {pick(data.form?.labels?.message)}
                </label>
                <textarea
                  id="contactMsg"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={pick(data.form?.placeholders?.message)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-line bg-neutral-50 dark:bg-[#17223C] text-sm text-neutral-900 dark:text-ink placeholder-neutral-400 dark:placeholder-ink-subtle focus:outline-none focus:border-brand dark:focus:border-primary-token focus:bg-white dark:focus:bg-[#10182C] transition resize-none"
                />
              </div>

              <MagneticButton strength={0.2} className="w-full" as="div">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-brand hover:bg-brand-dark dark:bg-primary-solid dark:hover:bg-brand text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-brand-glow transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>
                    {isSubmitting
                      ? pick(data.form?.submittingLabel)
                      : pick(data.form?.submitLabel)}
                  </span>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </MagneticButton>
            </form>
          </motion.div>
        </div>

        {socials.length > 0 ? (
          <div className="mt-14 pt-10 border-t border-neutral-200 dark:border-line">
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-neutral-400 dark:text-ink-subtle uppercase tracking-wider">
                {pick(data.socialTitle)}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white dark:bg-[#10182C] rounded-2xl border border-neutral-200/80 dark:border-line hover:border-brand/40 dark:hover:border-primary-token/40 shadow-subtle flex flex-col items-center justify-center text-center transition group hover:-translate-y-0.5"
                >
                  <span className="text-xs font-black text-neutral-900 dark:text-ink group-hover:text-brand dark:group-hover:text-brand-lime transition-colors">
                    {s.name}
                  </span>
                  <span className="text-[11px] text-neutral-400 dark:text-ink-subtle font-en tracking-tight">
                    {s.username}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};
