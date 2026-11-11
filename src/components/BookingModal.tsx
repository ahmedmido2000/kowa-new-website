'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { X, CheckCircle, ShieldCheck, MapPin, Navigation, Car } from 'lucide-react';
import { useModalScrollLock } from './SmoothScrollProvider';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pickup: string;
  destination: string;
  vehicleName: string;
  price: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  pickup,
  destination,
  vehicleName,
  price,
}) => {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const [confirmed, setConfirmed] = useState(false);

  useModalScrollLock(isOpen);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      // Auto close after 2.5 seconds
      setTimeout(() => {
        setConfirmed(false);
        onClose();
      }, 2500);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        data-lenis-prevent
        className="bg-white dark:bg-[#10182C] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 dark:border-line relative max-h-[90vh] overflow-x-hidden overflow-y-auto overscroll-contain transition-colors duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#17223C] text-neutral-400 dark:text-ink-subtle hover:text-neutral-700 dark:hover:text-ink transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmed ? (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-brand/10 dark:bg-primary-token/20 text-brand dark:text-primary-token flex items-center justify-center">
                <Car className="w-5 h-5 text-brand dark:text-primary-token" />
              </div>
              <div>
                <h3 className="text-lg font-black text-neutral-900 dark:text-ink">
                  {isAr ? 'تأكيد حجز المشوار الفوري' : 'Instant Ride Confirmation'}
                </h3>
                <span className="text-xs text-neutral-500 dark:text-ink-muted font-semibold">
                  {isAr ? 'كوا • ضمان السعر الثابت 100%' : 'KOWA • 100% Fixed Fare Guarantee'}
                </span>
              </div>
            </div>

            <div className="space-y-3 bg-neutral-50 dark:bg-[#17223C] p-4 rounded-2xl border border-neutral-200/80 dark:border-line mb-5">
              <div className="flex items-start gap-3">
                <Navigation className="w-4 h-4 text-brand dark:text-primary-token shrink-0 mt-1" />
                <div className="text-right rtl:text-right ltr:text-left">
                  <span className="text-[11px] font-bold text-neutral-400 dark:text-ink-subtle block">
                    {isAr ? 'نقطة الانطلاق:' : 'Pickup:'}
                  </span>
                  <span className="text-xs font-bold text-neutral-900 dark:text-ink block">{pickup}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-neutral-200/60 dark:border-line">
                <MapPin className="w-4 h-4 text-brand-lime shrink-0 mt-1" />
                <div className="text-right rtl:text-right ltr:text-left">
                  <span className="text-[11px] font-bold text-neutral-400 dark:text-ink-subtle block">
                    {isAr ? 'الوجهة المقصودة:' : 'Destination:'}
                  </span>
                  <span className="text-xs font-bold text-neutral-900 dark:text-ink block">{destination}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 dark:border-line text-xs font-bold">
                <span className="text-neutral-500 dark:text-ink-subtle">{isAr ? 'فئة المركبة المختارة:' : 'Class:'}</span>
                <span className="text-brand dark:text-brand-lime">{vehicleName}</span>
              </div>
            </div>

            {/* Price Preview */}
            <div className="p-4 bg-brand/5 dark:bg-brand-lime/10 border border-brand/10 dark:border-brand-lime/20 rounded-2xl flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-bold text-neutral-500 dark:text-ink-subtle block">
                  {isAr ? 'التسعيرة الإجمالية النهائية' : 'Total Fixed Fare'}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isAr ? 'لا تزيد عند الذروة' : 'Zero Surge'}</span>
                </span>
              </div>
              <div className="text-2xl font-black text-brand dark:text-brand-lime font-en">
                {price} <span className="text-xs font-sans text-neutral-700 dark:text-ink-muted">{isAr ? 'ر.س' : 'SAR'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-neutral-200 dark:border-line text-neutral-700 dark:text-ink font-bold text-sm hover:bg-neutral-50 dark:hover:bg-[#17223C] transition cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-3 px-4 rounded-xl bg-brand hover:bg-brand-dark dark:bg-primary-solid dark:hover:bg-brand text-white font-bold text-sm shadow-md hover:shadow-brand-glow transition cursor-pointer"
              >
                {isAr ? 'تأكيد الحجز الفوري' : 'Confirm Ride'}
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-neutral-900 dark:text-ink mb-2">
              {isAr ? 'تم تأكيد طلبك بنجاح!' : 'Ride Confirmed!'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-ink-muted leading-relaxed max-w-xs mx-auto mb-4">
              {isAr
                ? 'كابتنك المعتمد تم توجيهه إليك، وستصلك رسالة SMS فورة برابط التتبع المباشر.'
                : 'Your elite captain is en route. Live GPS tracking link dispatched via SMS.'}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-[#17223C] text-neutral-700 dark:text-ink text-xs font-bold font-en">
              <span>TRIP ID: #KW-89240</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
