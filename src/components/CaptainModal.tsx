'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { X, CheckCircle, Car, Award, FileCheck } from 'lucide-react';

interface CaptainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaptainModal: React.FC<CaptainModalProps> = ({ isOpen, onClose }) => {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#10182C] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-line relative max-h-[90vh] overflow-y-auto transition-colors duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#17223C] text-neutral-400 dark:text-ink-subtle hover:text-neutral-700 dark:hover:text-ink transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand dark:bg-primary-solid text-brand-lime flex items-center justify-center shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-neutral-900 dark:text-ink">
              {isAr ? 'شروط التسجيل ومعايير المركبات' : 'Captain & Vehicle Criteria'}
            </h3>
            <span className="text-xs text-neutral-500 dark:text-ink-muted font-semibold">
              {isAr ? 'وفق اللائحة المعتمدة من الهيئة العامة للنقل (TGA)' : 'In compliance with TGA Saudi Transport regulations'}
            </span>
          </div>
        </div>

        <div className="space-y-6 text-right rtl:text-right ltr:text-left">
          {/* Section 1: Captain Criteria */}
          <div>
            <h4 className="text-sm font-black text-brand dark:text-brand-lime mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-brand dark:text-brand-lime" />
              <span>{isAr ? 'شروط الكابتن المعتمد:' : 'Captain Requirements:'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-ink-muted">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{isAr ? 'أن يكون المتقدم سعودي الجنسية (حصر التوجيه للسعوديين)' : 'Saudi National (mandatory regulatory requirement)'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{isAr ? 'رخصة قيادة سارية المفعول وهوية وطنية صالحة' : 'Valid Saudi driver license & national ID'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{isAr ? 'العمر لا يقل عن 20 عاماً ولا يتجاوز 65 عاماً' : 'Age between 20 and 65 years old'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{isAr ? 'خلو السجل الأمني من أي سوابق جنائية' : 'Clean criminal and security record'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{isAr ? 'اجتياز الفحص الطبي وتحليل السموم المعتمد' : 'Passed certified medical and drug screenings'}</span>
              </li>
            </ul>
          </div>

          {/* Section 2: Vehicle Standards */}
          <div className="pt-4 border-t border-neutral-100 dark:border-line">
            <h4 className="text-sm font-black text-brand dark:text-brand-lime mb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-brand dark:text-brand-lime" />
              <span>{isAr ? 'معايير قبول المركبات:' : 'Vehicle Standards:'}</span>
            </h4>
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#17223C] border border-neutral-200/80 dark:border-line space-y-2 text-xs text-neutral-600 dark:text-ink-muted">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-800 dark:text-ink">{isAr ? 'سنة الصنع الأدنى:' : 'Minimum Model Year:'}</span>
                <span className="font-bold text-brand dark:text-brand-lime font-en">2020 أو أحدث</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-800 dark:text-ink">{isAr ? 'التأمين المعتمد:' : 'Insurance:'}</span>
                <span>{isAr ? 'تأمين شامل أو ضد الغير ساري' : 'Valid Comprehensive or TPL'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-800 dark:text-ink">{isAr ? 'الفحص الدوري:' : 'Periodic Inspection (MVPI):'}</span>
                <span>{isAr ? 'شهادة فحص دوري سارية' : 'Valid periodic inspection certificate'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-800 dark:text-ink">{isAr ? 'حالة التكييف والنظافة:' : 'AC & Cleanliness:'}</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">{isAr ? 'تكييف ممتاز ونظافة فائقة' : 'Impeccable AC & cleanliness'}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-xl bg-brand hover:bg-brand-dark dark:bg-primary-solid dark:hover:bg-brand text-white font-bold text-sm shadow-md hover:shadow-brand-glow transition cursor-pointer"
            >
              {isAr ? 'فهمت الشروط، الذهاب لنموذج التسجيل' : 'Understood, Proceed to Registration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
