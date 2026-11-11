'use client';

import React from 'react';
import { Award, Car, CheckCircle, FileCheck, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import { useSmoothScroll, useModalScrollLock } from './SmoothScrollProvider';

interface CaptainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaptainModal: React.FC<CaptainModalProps> = ({ isOpen, onClose }) => {
  const { pick } = useLanguage();
  const { sections } = useWebsiteConfig();
  const { scrollTo } = useSmoothScroll();

  const modal = sections.captain_earnings?.criteriaModal;
  useModalScrollLock(Boolean(isOpen && modal));

  if (!isOpen || !modal) return null;

  const captainRequirements = (modal.captainRequirements || []).filter(
    (item) => item.isEnabled !== false
  );
  const vehicleStandards = (modal.vehicleStandards || []).filter(
    (item) => item.isEnabled !== false && Boolean(pick(item.value).trim())
  );

  const handleProceedToForm = () => {
    onClose();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kowa:captain-inquiry', { detail: { subjectId: 'captain' } }));
    }
    scrollTo('#contact');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        data-lenis-prevent
        className="bg-white dark:bg-[#10182C] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-line relative max-h-[90vh] overflow-x-hidden overflow-y-auto overscroll-contain transition-colors duration-200"
      >
        <button
          type="button"
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
              {pick(modal.title)}
            </h3>
            <span className="text-xs text-neutral-500 dark:text-ink-muted font-semibold">
              {pick(modal.subtitle)}
            </span>
          </div>
        </div>

        <div className="space-y-6 text-right rtl:text-right ltr:text-left">
          {captainRequirements.length > 0 ? (
            <div>
              <h4 className="text-sm font-black text-brand dark:text-brand-lime mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand dark:text-brand-lime" />
                <span>{pick(modal.captainRequirementsTitle)}</span>
              </h4>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-ink-muted">
                {captainRequirements.map((req) => (
                  <li key={req.id} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{pick(req.text)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {vehicleStandards.length > 0 ? (
            <div className="pt-4 border-t border-neutral-100 dark:border-line">
              <h4 className="text-sm font-black text-brand dark:text-brand-lime mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-brand dark:text-brand-lime" />
                <span>{pick(modal.vehicleStandardsTitle)}</span>
              </h4>
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#17223C] border border-neutral-200/80 dark:border-line space-y-2 text-xs text-neutral-600 dark:text-ink-muted">
                {vehicleStandards.map((std) => (
                  <div key={std.id} className="flex items-center justify-between gap-2">
                    <span className="font-bold text-neutral-800 dark:text-ink">
                      {pick(std.label)}
                    </span>
                    <span
                      className={
                        std.isHighlighted
                          ? 'text-emerald-700 dark:text-emerald-400 font-bold text-end'
                          : 'text-end'
                      }
                    >
                      {pick(std.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleProceedToForm}
              className="w-full py-3.5 px-6 rounded-xl bg-brand hover:bg-brand-dark dark:bg-primary-solid dark:hover:bg-brand text-white font-bold text-sm shadow-md hover:shadow-brand-glow transition cursor-pointer"
            >
              {pick(modal.ctaLabel)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
