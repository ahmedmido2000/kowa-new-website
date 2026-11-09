'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { COMPANY_DATA } from '@/data/company';
import {
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: isAr ? 'استفسار عام' : 'General Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setStatus({
        type: 'error',
        message: isAr
          ? 'يرجى كتابة الاسم الكامل (حرفين على الأقل).'
          : 'Please enter your full name (at least 2 characters).',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setStatus({
        type: 'error',
        message: isAr ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.',
      });
      return;
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      setStatus({
        type: 'error',
        message: isAr
          ? 'يرجى إدخال رقم جوال صحيح (8 أرقام على الأقل).'
          : 'Please enter a valid phone number (at least 8 digits).',
      });
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      setStatus({
        type: 'error',
        message: isAr
          ? 'يرجى كتابة نص الرسالة (5 أحرف على الأقل).'
          : 'Please write your message (at least 5 characters).',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isAr ? 'حدث خطأ أثناء إرسال الرسالة' : 'Failed to send message'));
      }

      setStatus({
        type: 'success',
        message: isAr
          ? 'تم استلام رسالتك بنجاح! سيقوم فريق خدمة عملاء كوا بالرد عليك خلال دقائق.'
          : 'Your inquiry has been submitted! KOWA customer support will contact you shortly.',
      });

      setFormData({
        fullName: '',
        phone: '',
        email: '',
        subject: isAr ? 'استفسار عام' : 'General Inquiry',
        message: '',
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : isAr ? 'فشل الاتصال بالخادم، يرجى المحاولة مرة أخرى.' : 'Network error, please try again.';
      setStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-neutral-50/60 dark:bg-[#0A0F1D] border-t border-neutral-200 dark:border-line transition-colors duration-200" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase text-brand dark:text-brand-lime tracking-widest bg-brand/5 dark:bg-brand-lime/10 px-3 py-1 rounded-full border border-brand/10 dark:border-brand-lime/20">
            {isAr ? 'معلومات التواصل المعتمدة' : 'Official Contact Information'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-ink mt-3 mb-4">
            {isAr ? 'فريقنا في خدمتك دائماً على مدار الساعة' : 'Our Team is Always at Your Service 24/7'}
          </h2>
          <p className="text-neutral-600 dark:text-ink-muted text-sm sm:text-base leading-relaxed">
            {isAr
              ? 'نسعد بالإجابة عن استفساراتك واستقبال مقترحاتك وطلبات انضمام الكباتن والشركات لتقديم تجربة تنقل استثنائية تفوق توقعاتك.'
              : 'We look forward to addressing your inquiries, corporate partner requests, and captain onboarding queries.'}
          </p>
        </div>

        {/* Content Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details & Info Badges */}
          <div className="lg:col-span-5 space-y-4 text-right rtl:text-right ltr:text-left">
            {/* 1. Main Headquarters */}
            <div className="bg-white dark:bg-[#10182C] p-5 rounded-2xl border border-neutral-200/80 dark:border-line shadow-subtle flex items-start gap-4 transition hover:border-brand/40 dark:hover:border-primary-token/40">
              <div className="w-12 h-12 rounded-xl bg-brand/10 dark:bg-primary-token/20 text-brand dark:text-primary-token flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-brand dark:text-primary-token" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-400 dark:text-ink-subtle block mb-0.5">
                  {isAr ? 'المقر الرئيسي للمنصة' : 'Headquarters Location'}
                </span>
                <span className="text-sm font-black text-neutral-900 dark:text-ink block">
                  {isAr ? COMPANY_DATA.address.ar : COMPANY_DATA.address.en}
                </span>
                <span className="text-xs text-neutral-500 dark:text-ink-muted font-medium">
                  {isAr ? COMPANY_DATA.name.fullAr : COMPANY_DATA.name.fullEn}
                </span>
              </div>
            </div>

            {/* 2. Official Email */}
            <a
              href={`mailto:${COMPANY_DATA.contact.email}`}
              className="bg-white dark:bg-[#10182C] p-5 rounded-2xl border border-neutral-200/80 dark:border-line shadow-subtle flex items-start gap-4 transition hover:border-brand/40 dark:hover:border-primary-token/40 group block cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-brand/10 dark:bg-primary-token/20 text-brand dark:text-primary-token flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6 text-brand dark:text-primary-token" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-400 dark:text-ink-subtle block mb-0.5">
                  {isAr ? 'البريد الإلكتروني للدعم الرسمي' : 'Official Support Email'}
                </span>
                <span className="text-sm font-black text-brand dark:text-brand-lime font-en block">
                  {COMPANY_DATA.contact.email}
                </span>
                <span className="text-xs text-neutral-500 dark:text-ink-muted font-medium">
                  {isAr ? 'رد فوري خلال أقل من 24 ساعة' : 'Average response within 24 hours'}
                </span>
              </div>
            </a>

            {/* 3. WhatsApp Direct Chat */}
            <a
              href={COMPANY_DATA.contact.whatsappLink}
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
                    {isAr ? 'خدمة عملاء واتساب المباشرة' : 'Direct WhatsApp Concierge'}
                  </span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.2 rounded-full">
                    {isAr ? 'فوري' : 'Live'}
                  </span>
                </div>
                <span className="text-sm font-black text-neutral-900 dark:text-ink font-en block">
                  {COMPANY_DATA.contact.whatsapp}
                </span>
                <span className="text-xs text-neutral-500 dark:text-ink-muted font-medium">
                  {isAr ? 'محادثة سريعة مع مسؤولي خدمة الركاب' : 'Direct chat with passenger care agents'}
                </span>
              </div>
            </a>

            {/* 4. Unified Phone Hotline */}
            <a
              href={`tel:${COMPANY_DATA.contact.hotline}`}
              className="bg-white dark:bg-[#10182C] p-5 rounded-2xl border border-neutral-200/80 dark:border-line shadow-subtle flex items-start gap-4 transition hover:border-brand/40 dark:hover:border-primary-token/40 group block cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-brand/10 dark:bg-primary-token/20 text-brand dark:text-primary-token flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6 text-brand dark:text-primary-token" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-400 dark:text-ink-subtle block mb-0.5">
                  {isAr ? 'الرقم الموحد المجاني' : 'Toll-Free Unified Hotline'}
                </span>
                <span className="text-sm font-black text-brand dark:text-brand-lime font-en block">
                  {COMPANY_DATA.contact.hotlineDisplay}
                </span>
                <span className="text-xs text-neutral-500 dark:text-ink-muted font-medium">
                  {isAr ? 'متاح 24 ساعة طوال أيام الأسبوع' : 'Available 24/7 across the Kingdom'}
                </span>
              </div>
            </a>

            {/* 5. Working Hours Card */}
            <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-[#17223C] border border-neutral-200 dark:border-line text-xs flex items-center gap-3">
              <Clock className="w-5 h-5 text-neutral-500 dark:text-ink-subtle shrink-0" />
              <div className="text-neutral-600 dark:text-ink-muted">
                <span className="font-bold text-neutral-900 dark:text-ink block">
                  {isAr ? 'أوقات العمل الميداني وغرفة العمليات:' : 'Operations Control Room:'}
                </span>
                <span>{isAr ? 'خدمة الركاب والرحلات متوفرة 24/7 دون انقطاع' : '24/7 uninterrupted fleet operations'}</span>
              </div>
            </div>
          </div>

          {/* Direct Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#10182C] rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-line shadow-elevated transition-colors duration-200">
            <h3 className="text-xl font-black text-neutral-900 dark:text-ink mb-2 text-right rtl:text-right ltr:text-left">
              {isAr ? 'أرسل لنا استفسارك أو طلبك' : 'Send us a Direct Message'}
            </h3>
            <p className="text-neutral-500 dark:text-ink-muted text-xs sm:text-sm mb-6 text-right rtl:text-right ltr:text-left">
              {isAr
                ? 'سيصل طلبك مباشرة إلى القسم المختص وسيتواصل معك أحد ممثلي كوا بأسرع وقت.'
                : 'Your inquiry will be routed immediately to our specialized department.'}
            </p>

            {status && (
              <div
                className={`p-4 rounded-2xl mb-6 text-xs flex items-center gap-3 ${
                  status.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="text-right rtl:text-right ltr:text-left">
                  <label htmlFor="fullName" className="block text-xs font-bold text-neutral-700 dark:text-ink mb-1.5">
                    {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={isAr ? 'مثال: محمد بن سعد' : 'e.g. Mohammed Al-Saad'}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-line bg-neutral-50 dark:bg-[#17223C] text-sm text-neutral-900 dark:text-ink placeholder-neutral-400 dark:placeholder-ink-subtle focus:outline-none focus:border-brand dark:focus:border-primary-token focus:bg-white dark:focus:bg-[#10182C] transition"
                  />
                </div>

                {/* Phone */}
                <div className="text-right rtl:text-right ltr:text-left">
                  <label htmlFor="contactPhone" className="block text-xs font-bold text-neutral-700 dark:text-ink mb-1.5">
                    {isAr ? 'رقم الجوال *' : 'Phone Number *'}
                  </label>
                  <input
                    id="contactPhone"
                    type="tel"
                    required
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966 5X XXX XXXX"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-line bg-neutral-50 dark:bg-[#17223C] text-sm text-neutral-900 dark:text-ink placeholder-neutral-400 dark:placeholder-ink-subtle focus:outline-none focus:border-brand dark:focus:border-primary-token focus:bg-white dark:focus:bg-[#10182C] transition text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="text-right rtl:text-right ltr:text-left">
                  <label htmlFor="contactEmail" className="block text-xs font-bold text-neutral-700 dark:text-ink mb-1.5">
                    {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-line bg-neutral-50 dark:bg-[#17223C] text-sm text-neutral-900 dark:text-ink placeholder-neutral-400 dark:placeholder-ink-subtle focus:outline-none focus:border-brand dark:focus:border-primary-token focus:bg-white dark:focus:bg-[#10182C] transition font-en"
                  />
                </div>

                {/* Subject Selector */}
                <div className="text-right rtl:text-right ltr:text-left">
                  <label htmlFor="contactSubject" className="block text-xs font-bold text-neutral-700 dark:text-ink mb-1.5">
                    {isAr ? 'نوع الاستفسار' : 'Inquiry Subject'}
                  </label>
                  <select
                    id="contactSubject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-line bg-neutral-50 dark:bg-[#17223C] text-sm text-neutral-900 dark:text-ink focus:outline-none focus:border-brand dark:focus:border-primary-token focus:bg-white dark:focus:bg-[#10182C] transition cursor-pointer"
                  >
                    <option value={isAr ? 'استفسار عام' : 'General Inquiry'}>
                      {isAr ? 'استفسار عام' : 'General Inquiry'}
                    </option>
                    <option value={isAr ? 'انضمام كابتن' : 'Captain Onboarding'}>
                      {isAr ? 'انضمام كابتن' : 'Captain Onboarding'}
                    </option>
                    <option value={isAr ? 'حسابات شركات ووفود' : 'Corporate Mobility'}>
                      {isAr ? 'حسابات شركات ووفود' : 'Corporate Mobility'}
                    </option>
                    <option value={isAr ? 'شكوى أو مقترح' : 'Feedback & Complaints'}>
                      {isAr ? 'شكوى أو مقترح' : 'Feedback & Complaints'}
                    </option>
                  </select>
                </div>
              </div>

              {/* Message Area */}
              <div className="text-right rtl:text-right ltr:text-left">
                <label htmlFor="contactMsg" className="block text-xs font-bold text-neutral-700 dark:text-ink mb-1.5">
                  {isAr ? 'تفاصيل الرسالة *' : 'Message Details *'}
                </label>
                <textarea
                  id="contactMsg"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={
                    isAr
                      ? 'اكتب رسالتك أو استفسارك هنا، وسنسعد بخدمتك...'
                      : 'Write your message or inquiry here...'
                  }
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-line bg-neutral-50 dark:bg-[#17223C] text-sm text-neutral-900 dark:text-ink placeholder-neutral-400 dark:placeholder-ink-subtle focus:outline-none focus:border-brand dark:focus:border-primary-token focus:bg-white dark:focus:bg-[#10182C] transition resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-brand hover:bg-brand-dark dark:bg-primary-solid dark:hover:bg-brand text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-brand-glow transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>
                  {isSubmitting
                    ? isAr
                      ? 'جارٍ الإرسال...'
                      : 'Sending...'
                    : isAr
                    ? 'إرسال الرسالة الآن'
                    : 'Submit Message Now'}
                </span>
                <Send className="w-4 h-4 text-brand-lime" />
              </button>
            </form>
          </div>
        </div>

        {/* Official Social Media Channels Grid */}
        <div className="mt-14 pt-10 border-t border-neutral-200 dark:border-line">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-neutral-400 dark:text-ink-subtle uppercase tracking-wider">
              {isAr ? 'قنوات كوا الرسمية المعتمدة على شبكات التواصل' : 'Official KOWA Social Media Channels'}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {COMPANY_DATA.socials.map((s) => (
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
      </div>
    </section>
  );
};
