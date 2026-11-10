'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { COMPANY_DATA } from '@/data/company';
import { ShieldCheck, Headphones, MapPin, Mail, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  return (
    <footer className="bg-white dark:bg-[#0A0F1D] border-t border-neutral-200 dark:border-line pt-16 pb-12 text-neutral-600 dark:text-ink-muted text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid: 5 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-200 dark:border-line">
          {/* Col 1 & 2: Brand, Address & Contact Details */}
          <div className="lg:col-span-2 text-right rtl:text-right ltr:text-left">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#211583] dark:bg-[#1F0F8C] flex items-center justify-center p-2.5 shadow-sm shadow-[#211583]/25 shrink-0">
                <Image
                  src="/kowa-ik@4x.png"
                  alt="KOWA Logo"
                  width={38}
                  height={30}
                  className="w-full h-full object-contain shrink-0"
                />
              </div>
              <div>
                <span className="text-xl font-black text-neutral-900 dark:text-ink font-sans block">
                  {isAr ? COMPANY_DATA.name.ar : COMPANY_DATA.name.en}
                </span>
                <span className="text-[10px] text-neutral-400 dark:text-ink-subtle font-bold uppercase block">
                  {isAr ? COMPANY_DATA.name.fullAr : COMPANY_DATA.name.fullEn}
                </span>
              </div>
            </div>
            <p className="text-neutral-500 dark:text-ink-muted leading-relaxed mb-6 max-w-sm">
              {isAr ? COMPANY_DATA.about.ar : COMPANY_DATA.about.en}
            </p>

            {/* Address & Direct Channels Card */}
            <div className="p-4 bg-neutral-50 dark:bg-[#10182C] border border-neutral-200 dark:border-line rounded-2xl space-y-2.5 max-w-sm mb-5 text-right rtl:text-right ltr:text-left">
              <div className="flex items-center gap-2 text-neutral-800 dark:text-ink font-semibold">
                <MapPin className="w-4 h-4 text-brand dark:text-primary-token shrink-0" />
                <span>{isAr ? COMPANY_DATA.address.ar : COMPANY_DATA.address.en}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-800 dark:text-ink font-semibold">
                <Mail className="w-4 h-4 text-brand dark:text-primary-token shrink-0" />
                <a href={`mailto:${COMPANY_DATA.contact.email}`} className="hover:text-brand dark:hover:text-brand-lime transition font-en">
                  {COMPANY_DATA.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-neutral-800 dark:text-ink font-semibold">
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <a
                  href={COMPANY_DATA.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 dark:hover:text-emerald-300 transition font-en"
                >
                  WhatsApp: {COMPANY_DATA.contact.whatsapp}
                </a>
              </div>
            </div>

            {/* TGA & ZATCA Badge Card */}
            <div className="p-3.5 bg-neutral-50 dark:bg-[#10182C] border border-neutral-200 dark:border-line rounded-2xl flex items-center gap-3 max-w-sm mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="text-right rtl:text-right ltr:text-left">
                <div className="font-bold text-neutral-800 dark:text-ink">
                  {isAr ? COMPANY_DATA.compliance.tgaLabelAr : COMPANY_DATA.compliance.tgaLabelEn}
                </div>
                <div className="text-[11px] text-neutral-400 dark:text-ink-subtle font-en">
                  Lic. No: #{COMPANY_DATA.compliance.tgaLicense} • ZATCA E-Invoicing Compliant
                </div>
              </div>
            </div>

            {/* Hotline Callout */}
            <div className="flex items-center gap-2 text-neutral-800 dark:text-ink font-bold">
              <Headphones className="w-4 h-4 text-brand dark:text-primary-token shrink-0" />
              <span>{isAr ? 'الرقم الموحد للدعم على مدار الساعة:' : '24/7 Unified Support Line:'}</span>
              <a className="text-brand dark:text-brand-lime font-black font-en" dir="ltr" href={`tel:${COMPANY_DATA.contact.hotline}`}>
                {COMPANY_DATA.contact.hotlineDisplay}
              </a>
            </div>
          </div>

          {/* Col 3: Passenger Services */}
          <div className="text-right rtl:text-right ltr:text-left">
            <h4 className="font-black text-neutral-900 dark:text-ink uppercase tracking-wider mb-4">
              {isAr ? 'خدمات المشاوير' : 'Passenger Rides'}
            </h4>
            <ul className="space-y-2.5 text-neutral-500 dark:text-ink-muted font-medium">
              <li>
                <a className="hover:text-brand dark:hover:text-brand-lime transition" href="#fare-calculator">
                  {isAr ? 'مشاوير داخل المدينة الفورية' : 'Instant City Commutes'}
                </a>
              </li>
              <li>
                <a className="hover:text-brand dark:hover:text-brand-lime transition" href="#categories">
                  {isAr ? 'استقبال صالات المطارات التنفيذية' : 'Executive Airport Meet & Greet'}
                </a>
              </li>
              <li>
                <a className="hover:text-brand dark:hover:text-brand-lime transition" href="#categories">
                  {isAr ? 'رحلات مباشرة بين المدن' : 'Direct Intercity Trips'}
                </a>
              </li>
              <li>
                <a className="hover:text-brand dark:hover:text-brand-lime transition" href="#fare-calculator">
                  {isAr ? 'خدمة سائق خاص بالساعة' : 'Hourly Private Chauffeur'}
                </a>
              </li>
              <li>
                <a className="hover:text-brand dark:hover:text-brand-lime transition" href="#categories">
                  {isAr ? 'بزنس VIP ورجال الأعمال' : 'Business VIP & Diplomats'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate & Captains */}
          <div className="text-right rtl:text-right ltr:text-left">
            <h4 className="font-black text-neutral-900 dark:text-ink uppercase tracking-wider mb-4">
              {isAr ? 'الأعمال والكباتن' : 'Business & Captains'}
            </h4>
            <ul className="space-y-2.5 text-neutral-500 dark:text-ink-muted font-medium">
              <li>
                <a className="hover:text-brand dark:hover:text-brand-lime transition" href="#captain-earnings">
                  {isAr ? 'التسجيل ككابتن سعودي' : 'Register as a Captain'}
                </a>
              </li>
              <li>
                <a className="hover:text-brand dark:hover:text-brand-lime transition" href="#captain-earnings">
                  {isAr ? 'حاسبة أرباح الكابتن اليومية' : 'Captain Daily Earnings Estimator'}
                </a>
              </li>
              <li>
                <a className="hover:text-brand dark:hover:text-brand-lime transition" href="#contact">
                  {isAr ? 'حلول KOWA للشركات والوفود' : 'Corporate Mobility Programs'}
                </a>
              </li>
              <li>
                <a className="hover:text-brand dark:hover:text-brand-lime transition" href="#contact">
                  {isAr ? 'إدارة حسابات منسوبي الشركات' : 'Employee Travel Accounts'}
                </a>
              </li>
              <li>
                <a className="hover:text-brand dark:hover:text-brand-lime transition" href="#value-pillars">
                  {isAr ? 'ميثاق السلامة وجودة الأسطول' : 'Fleet Safety & Hygiene Charter'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Social Media & Follow */}
          <div className="text-right rtl:text-right ltr:text-left">
            <h4 className="font-black text-neutral-900 dark:text-ink uppercase tracking-wider mb-4">
              {isAr ? 'تابعنا على المنصات' : 'Social Media'}
            </h4>
            <ul className="space-y-2.5 text-neutral-500 dark:text-ink-muted font-medium mb-6">
              {COMPANY_DATA.socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand dark:hover:text-brand-lime transition flex items-center gap-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600 group-hover:bg-brand dark:group-hover:bg-brand-lime transition-colors" />
                    <span>{s.name}</span>
                    <span className="text-[10px] text-neutral-400 dark:text-ink-subtle font-en rtl:mr-auto ltr:ml-auto">
                      {s.username}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="p-3 bg-neutral-50 dark:bg-[#10182C] rounded-xl border border-neutral-200 dark:border-line">
              <span className="text-[11px] text-neutral-500 dark:text-ink-muted block leading-tight">
                {isAr
                  ? 'للاستفسارات والشكاوى ومتابعة الرحلات عبر منصة X وواتساب'
                  : 'Customer inquiries & trip tracking available on X and WhatsApp'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-neutral-400 dark:text-ink-subtle">
          <div>
            {isAr
              ? `جميع الحقوق محفوظة © ${COMPANY_DATA.currentYear} لمنصة كوا للتنقل الذكي (${COMPANY_DATA.name.fullAr}). المملكة العربية السعودية.`
              : `All rights reserved © ${COMPANY_DATA.currentYear} ${COMPANY_DATA.name.fullEn}. Kingdom of Saudi Arabia.`}
          </div>
          <div className="flex items-center gap-6 font-medium">
            <a className="hover:text-brand dark:hover:text-brand-lime transition" href="#hero">
              {isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}
            </a>
            <a className="hover:text-brand dark:hover:text-brand-lime transition" href="#hero">
              {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </a>
            <a className="hover:text-brand dark:hover:text-brand-lime transition" href="#hero">
              {isAr ? 'حقوق الراكب' : 'Passenger Rights'}
            </a>
            <a className="hover:text-brand dark:hover:text-brand-lime transition" href="#contact">
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
