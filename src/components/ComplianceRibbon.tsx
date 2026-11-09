'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { COMPANY_DATA } from '@/data/company';
import { Phone, CheckCircle } from 'lucide-react';

export const ComplianceRibbon: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  return (
    <div className="bg-neutral-900 text-white text-xs py-2 px-4 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-brand-lime animate-pulse"></span>
          <span className="font-medium text-neutral-300">
            {isAr ? COMPANY_DATA.compliance.tgaLabelAr : COMPANY_DATA.compliance.tgaLabelEn}
          </span>
          <span className="text-neutral-600 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-neutral-300">
            {isAr ? COMPANY_DATA.compliance.zatcaAr : COMPANY_DATA.compliance.zatcaEn}
          </span>
        </div>
        <div className="flex items-center gap-5 text-neutral-300">
          <a
            className="hover:text-brand-lime transition flex items-center gap-1.5 font-bold font-en text-[13px]"
            href={`tel:${COMPANY_DATA.contact.hotline}`}
          >
            <Phone className="w-3.5 h-3.5 text-brand-lime" />
            <span>{COMPANY_DATA.contact.hotlineDisplay}</span>
          </a>
          <span className="text-neutral-700">|</span>
          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isAr ? 'تثبيت السعر الفوري 100%' : '100% Instant Price Guarantee'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
