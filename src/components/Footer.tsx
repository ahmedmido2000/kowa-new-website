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
    <footer className="bg-white border-t border-neutral-200 pt-16 pb-12 text-neutral-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid: 5 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-200">
          {/* Col 1 & 2: Brand, Address & Contact Details */}
          <div className="lg:col-span-2 text-right rtl:text-right ltr:text-left">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#211583] flex items-center justify-center p-2.5 shadow-sm shadow-[#211583]/25 shrink-0">
                <Image
                  src="/kowa-ik@4x.png"
                  alt="KOWA Logo"
                  width={38}
                  height={30}
                  className="w-full h-full object-contain shrink-0"
                />
              </div>
              <div>
                <span className="text-xl font-black text-neutral-900 font-sans block">
                  {isAr ? COMPANY_DATA.name.ar : COMPANY_DATA.name.en}
                </span>
                <span className="text-[10px] text-neutral-400 font-bold uppercase block">
                  {isAr ? COMPANY_DATA.name.fullAr : COMPANY_DATA.name.fullEn}
                </span>
              </div>
            </div>
            <p className="text-neutral-500 leading-relaxed mb-6 max-w-sm">
              {isAr ? COMPANY_DATA.about.ar : COMPANY_DATA.about.en}
            </p>

            {/* Address & Direct Channels Card */}
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2.5 max-w-sm mb-5 text-right rtl:text-right ltr:text-left">
              <div className="flex items-center gap-2 text-neutral-800 font-semibold">
                <MapPin className="w-4 h-4 text-brand shrink-0" />
                <span>{isAr ? COMPANY_DATA.address.ar : COMPANY_DATA.address.en}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-800 font-semibold">
                <Mail className="w-4 h-4 text-brand shrink-0" />
                <a href={`mailto:${COMPANY_DATA.contact.email}`} className="hover:text-brand transition font-en">
                  {COMPANY_DATA.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-neutral-800 font-semibold">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <a
                  href={COMPANY_DATA.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 transition font-en"
                >
                  WhatsApp: {COMPANY_DATA.contact.whatsapp}
                </a>
              </div>
            </div>

            {/* TGA & ZATCA Badge Card */}
            <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center gap-3 max-w-sm mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
              <div className="text-right rtl:text-right ltr:text-left">
                <div className="font-bold text-neutral-800">
                  {isAr ? COMPANY_DATA.compliance.tgaLabelAr : COMPANY_DATA.compliance.tgaLabelEn}
                </div>
                <div className="text-[11px] text-neutral-400 font-en">
                  Lic. No: #{COMPANY_DATA.compliance.tgaLicense} • ZATCA E-Invoicing Compliant
                </div>
              </div>
            </div>

            {/* Hotline Callout */}
            <div className="flex items-center gap-2 text-neutral-800 font-bold">
              <Headphones className="w-4 h-4 text-brand shrink-0" />
              <span>{isAr ? 'الرقم الموحد للدعم على مدار الساعة:' : '24/7 Unified Support Line:'}</span>
              <a className="text-brand font-black font-en" dir="ltr" href={`tel:${COMPANY_DATA.contact.hotline}`}>
                {COMPANY_DATA.contact.hotlineDisplay}
              </a>
            </div>
          </div>

          {/* Col 3: Passenger Services */}
          <div className="text-right rtl:text-right ltr:text-left">
            <h4 className="font-black text-neutral-900 uppercase tracking-wider mb-4">
              {isAr ? 'خدمات المشاوير' : 'Passenger Rides'}
            </h4>
            <ul className="space-y-2.5 text-neutral-500 font-medium">
              <li>
                <a className="hover:text-brand transition" href="#hero">
                  {isAr ? 'مشاوير داخل المدينة الفورية' : 'Instant City Commutes'}
                </a>
              </li>
              <li>
                <a className="hover:text-brand transition" href="#categories">
                  {isAr ? 'استقبال صالات المطارات التنفيذية' : 'Executive Airport Meet & Greet'}
                </a>
              </li>
              <li>
                <a className="hover:text-brand transition" href="#categories">
                  {isAr ? 'رحلات مباشرة بين المدن' : 'Direct Intercity Trips'}
                </a>
              </li>
              <li>
                <a className="hover:text-brand transition" href="#hero">
                  {isAr ? 'خدمة سائق خاص بالساعة' : 'Hourly Private Chauffeur'}
                </a>
              </li>
              <li>
                <a className="hover:text-brand transition" href="#categories">
                  {isAr ? 'بزنس VIP ورجال الأعمال' : 'Business VIP & Diplomats'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate & Captains */}
          <div className="text-right rtl:text-right ltr:text-left">
            <h4 className="font-black text-neutral-900 uppercase tracking-wider mb-4">
              {isAr ? 'الأعمال والكباتن' : 'Business & Captains'}
            </h4>
            <ul className="space-y-2.5 text-neutral-500 font-medium">
              <li>
                <a className="hover:text-brand transition" href="#captain-earnings">
                  {isAr ? 'التسجيل ككابتن سعودي' : 'Register as a Captain'}
                </a>
              </li>
              <li>
                <a className="hover:text-brand transition" href="#captain-earnings">
                  {isAr ? 'حاسبة أرباح الكابتن اليومية' : 'Captain Daily Earnings Estimator'}
                </a>
              </li>
              <li>
                <a className="hover:text-brand transition" href="#contact">
                  {isAr ? 'حلول KOWA للشركات والوفود' : 'Corporate Mobility Programs'}
                </a>
              </li>
              <li>
                <a className="hover:text-brand transition" href="#contact">
                  {isAr ? 'إدارة حسابات منسوبي الشركات' : 'Employee Travel Accounts'}
                </a>
              </li>
              <li>
                <a className="hover:text-brand transition" href="#value-pillars">
                  {isAr ? 'ميثاق السلامة وجودة الأسطول' : 'Fleet Safety & Hygiene Charter'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Social Media & Follow */}
          <div className="text-right rtl:text-right ltr:text-left">
            <h4 className="font-black text-neutral-900 uppercase tracking-wider mb-4">
              {isAr ? 'تابعنا على المنصات' : 'Social Media'}
            </h4>
            <ul className="space-y-2.5 text-neutral-500 font-medium mb-6">
              {COMPANY_DATA.socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand transition flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 group-hover:bg-brand transition-colors" />
                    <span>{s.name}</span>
                    <span className="text-[10px] text-neutral-400 font-en rtl:mr-auto ltr:ml-auto">
                      {s.username}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-[11px] text-neutral-500 block leading-tight">
                {isAr
                  ? 'للاستفسارات والشكاوى ومتابعة الرحلات عبر منصة X وواتساب'
                  : 'Customer inquiries & trip tracking available on X and WhatsApp'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-neutral-400">
          <div>
            {isAr
              ? `جميع الحقوق محفوظة © ${COMPANY_DATA.currentYear} لمنصة كوا للتنقل الذكي (${COMPANY_DATA.name.fullAr}). المملكة العربية السعودية.`
              : `All rights reserved © ${COMPANY_DATA.currentYear} ${COMPANY_DATA.name.fullEn}. Kingdom of Saudi Arabia.`}
          </div>
          <div className="flex items-center gap-6 font-medium">
            <a className="hover:text-brand transition" href="#hero">
              {isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}
            </a>
            <a className="hover:text-brand transition" href="#hero">
              {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </a>
            <a className="hover:text-brand transition" href="#hero">
              {isAr ? 'حقوق الراكب' : 'Passenger Rights'}
            </a>
            <a className="hover:text-brand transition" href="#contact">
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
