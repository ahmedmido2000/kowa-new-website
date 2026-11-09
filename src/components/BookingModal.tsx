'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { X, CheckCircle, ShieldCheck, MapPin, Navigation, Car } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      // Auto close after 3 seconds
      setTimeout(() => {
        setConfirmed(false);
        onClose();
      }, 2500);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmed ? (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
                <Car className="w-5 h-5 text-brand" />
              </div>
              <div>
                <h3 className="text-lg font-black text-neutral-900">
                  {isAr ? 'تأكيد حجز المشوار الفوري' : 'Instant Ride Confirmation'}
                </h3>
                <span className="text-xs text-neutral-500 font-semibold">
                  {isAr ? 'كوا • ضمان السعر الثابت 100%' : 'KOWA • 100% Fixed Fare Guarantee'}
                </span>
              </div>
            </div>

            <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 mb-5">
              <div className="flex items-start gap-3">
                <Navigation className="w-4 h-4 text-brand shrink-0 mt-1" />
                <div className="text-xs">
                  <span className="text-neutral-400 block font-bold">{isAr ? 'الانطلاق' : 'Pickup'}</span>
                  <span className="font-bold text-neutral-800">{pickup}</span>
                </div>
              </div>
              <div className="border-t border-neutral-200/60 pt-2 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-lime text-neutral-900 shrink-0 mt-1" />
                <div className="text-xs">
                  <span className="text-neutral-400 block font-bold">{isAr ? 'الوجهة' : 'Destination'}</span>
                  <span className="font-bold text-neutral-800">{destination}</span>
                </div>
              </div>
              <div className="border-t border-neutral-200/60 pt-2 flex items-center justify-between text-xs font-bold">
                <span className="text-neutral-500">{isAr ? 'الفئة المختارة:' : 'Selected Class:'}</span>
                <span className="text-brand font-black">{vehicleName}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-brand/5 border border-brand/20 flex items-center justify-between mb-5">
              <div>
                <span className="text-xs text-neutral-500 font-bold block">
                  {isAr ? 'المبلغ المستحق الثابت' : 'Total Fixed Fare'}
                </span>
                <span className="text-[11px] text-neutral-400">{isAr ? 'شامل الضريبة 15%' : 'Incl. 15% VAT'}</span>
              </div>
              <div className="text-2xl font-black text-brand font-en">
                {price} <span className="text-sm font-sans font-bold text-neutral-700">{isAr ? 'ر.س' : 'SAR'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isAr
                  ? 'لا يتم فرض أي رسوم إلغاء خلال أول 3 دقائق من الطلب'
                  : 'Zero cancellation fees during the first 3 minutes'}
              </span>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full py-3.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-black text-sm shadow-brand-glow transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-brand-lime" />
              <span>{isAr ? 'تأكيد وإرسال أقرب كابتن' : 'Confirm & Dispatch Captain'}</span>
            </button>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-neutral-900">
              {isAr ? 'تم طلب مشوارك بنجاح!' : 'Ride Requested Successfully!'}
            </h4>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
              {isAr
                ? 'كابتن فهد العتيبي (كامري 2024) في الطريق إليك الآن. يصل خلال دقيقتين.'
                : 'Captain Fahad Al-Otaibi (Camry 2024) is en route to you now. ETA: 2 mins.'}
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-bold font-en">
              Ref: #KW-84920
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
