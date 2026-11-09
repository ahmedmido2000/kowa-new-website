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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand text-brand-lime flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-neutral-900">
              {isAr ? 'شروط التسجيل ومعايير المركبات' : 'Captain & Vehicle Criteria'}
            </h3>
            <span className="text-xs text-neutral-500 font-semibold">
              {isAr ? 'وفق اللائحة المعتمدة من الهيئة العامة للنقل (TGA)' : 'In compliance with TGA Saudi Transport regulations'}
            </span>
          </div>
        </div>

        <div className="space-y-6 text-right">
          {/* Section 1: Captain Criteria */}
          <div>
            <h4 className="text-sm font-black text-brand mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-brand" />
              <span>{isAr ? 'شروط الكابتن المعتمد:' : 'Captain Requirements:'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isAr ? 'أن يكون المتقدم سعودي الجنسية (حصر التوجيه للسعوديين)' : 'Saudi National (mandatory regulatory requirement)'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isAr ? 'رخصة قيادة سارية المفعول وهوية وطنية صالحة' : 'Valid Saudi driver license & national ID'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isAr ? 'سجل قيادة سليم وخالٍ من السوابق الجنائية والتحليل الطبي المعتمد' : 'Clean driving record, security clearance & medical check'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isAr ? 'العمر لا يقل عن 20 عاماً ولا يتجاوز 65 عاماً' : 'Age between 20 and 65 years'}</span>
              </li>
            </ul>
          </div>

          {/* Section 2: Vehicle Criteria */}
          <div className="pt-4 border-t border-neutral-100">
            <h4 className="text-sm font-black text-brand mb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-brand" />
              <span>{isAr ? 'شروط وقبول نوع المركبة:' : 'Vehicle Acceptance Standards:'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isAr ? 'موديل سنة الصنع 2020 فما فوق لجميع الفئات' : 'Model year 2020 or newer for all categories'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isAr ? 'استمارة مركبة وفحص دوري وتأمين سارٍ (شامل أو ضد الغير)' : 'Valid vehicle registration, MVPI inspection & valid insurance'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isAr ? 'تكييف عالي الكفاءة ونظافة فائقة داخلية وخارجية' : 'High performance AC & pristine interior/exterior hygiene'}</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-brand-surface border border-brand/10 text-xs text-neutral-700">
            <div className="font-bold mb-1 text-brand">
              {isAr ? '⚡ تفعيل الحساب الفوري خلال 24 ساعة:' : '⚡ Account Activation within 24 Hours:'}
            </div>
            <p>
              {isAr
                ? 'ارفع صور الوثائق مباشرة عبر تطبيق كابتن كوا، وسيتم مراجعة الطلب وربطه بمنصة وصل فوراً.'
                : 'Upload your documents directly in the KOWA Captain app for instant validation and Wasl portal verification.'}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-brand hover:bg-brand-dark text-white font-black text-xs shadow-sm transition"
          >
            {isAr ? 'فهمت الشروط، المتابعة للتسجيل' : 'Understood, Proceed to Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};
