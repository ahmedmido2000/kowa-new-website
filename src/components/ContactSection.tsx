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
          ? 'يرجى كتابة رسالة توضيحية (5 حروف على الأقل).'
          : 'Please write a message (at least 5 characters).',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || (isAr ? 'حدث خطأ أثناء الإرسال' : 'Error sending message'));
      }

      setStatus({
        type: 'success',
        message:
          data.message ||
          (isAr
            ? 'تم إرسال رسالتك بنجاح! سيتواصل معك فريق خدمة عملاء كوا قريباً.'
            : 'Your message has been sent successfully! Our support team will get in touch soon.'),
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
    <section className="py-16 lg:py-24 bg-neutral-50/60 border-t border-neutral-200" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase text-brand tracking-widest bg-brand/5 px-3 py-1 rounded-full border border-brand/10">
            {isAr ? 'معلومات التواصل المعتمدة' : 'Official Contact Information'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 mt-3 mb-4">
            {isAr ? 'فريقنا في خدمتك دائماً على مدار الساعة' : 'Our Team is Always at Your Service 24/7'}
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
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
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-subtle flex items-start gap-4 transition hover:border-brand/40">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-brand" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-400 block mb-0.5">
                  {isAr ? 'المقر الرئيسي للمنصة' : 'Headquarters Location'}
                </span>
                <span className="text-sm font-black text-neutral-900 block">
                  {isAr ? COMPANY_DATA.address.ar : COMPANY_DATA.address.en}
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  {isAr ? COMPANY_DATA.name.fullAr : COMPANY_DATA.name.fullEn}
                </span>
              </div>
            </div>

            {/* 2. Official Email */}
            <a
              href={`mailto:${COMPANY_DATA.contact.email}`}
              className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-subtle flex items-start gap-4 transition hover:border-brand/40 group block"
            >
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6 text-brand" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-400 block mb-0.5">
                  {isAr ? 'البريد الإلكتروني للدعم الرسمي' : 'Official Support Email'}
                </span>
                <span className="text-sm font-black text-brand font-en block">
                  {COMPANY_DATA.contact.email}
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  {isAr ? 'رد فوري خلال أقل من 24 ساعة' : 'Average response within 24 hours'}
                </span>
              </div>
            </a>

            {/* 3. WhatsApp Direct Chat */}
            <a
              href={COMPANY_DATA.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-subtle flex items-start gap-4 transition hover:border-emerald-400 group block"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-400">
                    {isAr ? 'خدمة عملاء واتساب المباشرة' : 'Direct WhatsApp Concierge'}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full">
                    {isAr ? 'فوري' : 'Live'}
                  </span>
                </div>
                <span className="text-sm font-black text-neutral-900 font-en block">
                  {COMPANY_DATA.contact.whatsapp}
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  {isAr ? 'محادثة سريعة مع مسؤولي خدمة الركاب' : 'Direct chat with passenger care agents'}
                </span>
              </div>
            </a>

            {/* 4. Unified Phone Hotline */}
            <a
              href={`tel:${COMPANY_DATA.contact.hotline}`}
              className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-subtle flex items-start gap-4 transition hover:border-brand/40 group block"
            >
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6 text-brand" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-400 block mb-0.5">
                  {isAr ? 'الرقم الموحد المجاني' : 'Toll-Free Hotline'}
                </span>
                <span className="text-sm font-black text-brand font-en block">
                  {COMPANY_DATA.contact.hotlineDisplay}
                </span>
                <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isAr ? 'متاح طوال أيام الأسبوع 24/7' : 'Available 24/7 throughout the week'}</span>
                </span>
              </div>
            </a>

            {/* Social Media Follow Box */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-subtle">
              <span className="text-xs font-bold text-neutral-700 block mb-3">
                {isAr ? 'قنواتنا الرسمية على وسائل التواصل:' : 'Follow KOWA on Social Media:'}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {COMPANY_DATA.socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-neutral-200 hover:border-brand hover:bg-neutral-50 flex items-center justify-center gap-1.5 transition text-xs font-bold text-neutral-700"
                  >
                    <span>{s.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact & Inquiries Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-elevated">
            <h3 className="text-xl font-black text-neutral-900 mb-2 text-right rtl:text-right ltr:text-left">
              {isAr ? 'أرسل رسالة مباشرة إلى فريقنا' : 'Send a Message Directly to Our Team'}
            </h3>
            <p className="text-xs text-neutral-500 mb-6 text-right rtl:text-right ltr:text-left">
              {isAr
                ? 'املأ النموذج أدناه وسيقوم ممثل خدمة العملاء أو إدارة الأسطول بالتواصل معك فوراً.'
                : 'Fill out the form below and our customer support or fleet management will respond promptly.'}
            </p>

            {status && (
              <div
                className={`p-4 rounded-xl text-xs font-bold mb-6 flex items-start gap-2.5 ${
                  status.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-right rtl:text-right ltr:text-left">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  {isAr ? 'الاسم الكامل' : 'Full Name'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'أدخل اسمك الكريم' : 'Your Full Name'}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    {isAr ? 'رقم الجوال' : 'Phone Number'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="05XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand focus:bg-white transition text-right rtl:text-right ltr:text-left"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand focus:bg-white transition text-right rtl:text-right ltr:text-left"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  {isAr ? 'موضوع الاستفسار' : 'Subject of Inquiry'}
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-bold text-neutral-900 focus:outline-none focus:border-brand focus:bg-white transition"
                >
                  <option value={isAr ? 'استفسار عام' : 'General Inquiry'}>
                    {isAr ? 'استفسار عام عن الخدمة' : 'General Service Inquiry'}
                  </option>
                  <option value={isAr ? 'انضمام ككابتن' : 'Captain Registration'}>
                    {isAr ? 'الانضمام ككابتن معتمد' : 'Join as a Certified Captain'}
                  </option>
                  <option value={isAr ? 'خدمات الأعمال والشركات' : 'Corporate Mobility'}>
                    {isAr ? 'خدمات الأعمال والشركات والوفود' : 'Corporate & VIP Delegation Travel'}
                  </option>
                  <option value={isAr ? 'الدعم الفني والملاحظات' : 'Technical Support'}>
                    {isAr ? 'الدعم الفني والشكاوى والملاحظات' : 'Technical Support & Feedback'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  {isAr ? 'تفاصيل الرسالة أو الاستفسار' : 'Message Details'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={isAr ? 'اكتب استفسارك أو ملاحظتك هنا بوضوح...' : 'Write your inquiry or question here...'}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand focus:bg-white transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-black text-xs shadow-brand-glow transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>{isAr ? 'جاري إرسال الرسالة...' : 'Sending message...'}</span>
                ) : (
                  <>
                    <span>{isAr ? 'إرسال الرسالة إلى فريق الدعم' : 'Send Message to Support'}</span>
                    <Send className="w-3.5 h-3.5 text-brand-lime" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
