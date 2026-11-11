'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, FileText, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import type { LegalBlockContent } from '@/types/website-cms';
import { fetchClientWebsiteSection } from '@/lib/website-api';
import { resolveLegalBlockKey } from '@/lib/cms-helpers';
import { ComplianceRibbon } from './ComplianceRibbon';
import { Header } from './Header';
import { Footer } from './Footer';

interface LegalBlockEnvelope {
  key: string;
  content: LegalBlockContent;
  updatedAt: string | null;
}

interface LegalPageViewProps {
  slug: string;
  block: LegalBlockEnvelope | null;
}

export function LegalPageView({ slug, block: initialBlock }: LegalPageViewProps) {
  const { locale, isRtl, pick } = useLanguage();
  const { isSectionEnabled } = useWebsiteConfig();
  const [liveBlock, setLiveBlock] = useState<LegalBlockEnvelope | null | undefined>(undefined);

  useEffect(() => {
    const blockKey = resolveLegalBlockKey(slug);
    if (!blockKey) return;

    let active = true;
    fetchClientWebsiteSection<LegalBlockContent>(blockKey).then((fresh) => {
      if (!active) return;
      if (fresh) {
        if (JSON.stringify(fresh) !== JSON.stringify(initialBlock)) {
          setLiveBlock(fresh);
        }
      } else {
        setLiveBlock(null);
      }
    });

    return () => {
      active = false;
    };
  }, [slug, initialBlock]);

  const block = liveBlock !== undefined ? liveBlock : initialBlock;
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const fallbackTitles: Record<string, { ar: string; en: string }> = {
    terms: { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
    privacy: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
    'passenger-rights': { ar: 'حقوق الراكب', en: 'Passenger Rights' },
  };

  const pageTitle = block
    ? pick(block.content?.title, pick(fallbackTitles[slug], slug))
    : pick(fallbackTitles[slug], slug);

  const bodyText = block ? pick(block.content?.content, '') : '';

  const formattedUpdated =
    block?.updatedAt
      ? new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(new Date(block.updatedAt))
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink transition-colors duration-200">
      {isSectionEnabled('compliance_ribbon') && <ComplianceRibbon />}
      {isSectionEnabled('header') && <Header hashBasePath="/" />}

      <main className="flex-1 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand dark:text-brand-lime hover:opacity-80 transition-opacity"
            >
              <BackIcon className="w-4 h-4" />
              <span>{isRtl ? 'العودة إلى الصفحة الرئيسية' : 'Back to Homepage'}</span>
            </Link>
          </div>

          {block && bodyText.trim() ? (
            <article className="rounded-3xl bg-card border border-line p-6 sm:p-10 lg:p-12 shadow-elevated space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-line">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-brand/10 dark:bg-primary-solid/20 text-brand dark:text-brand-lime flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-ink">{pageTitle}</h1>
                    {formattedUpdated && (
                      <p className="text-xs text-ink-subtle mt-1">
                        {isRtl ? 'آخر تحديث:' : 'Last updated:'} {formattedUpdated}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-sm sm:text-base text-ink-muted leading-loose whitespace-pre-wrap break-words font-normal">
                {bodyText}
              </div>
            </article>
          ) : (
            <div className="rounded-3xl bg-card border border-line p-8 sm:p-12 shadow-elevated text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-elevated border border-line text-ink-muted flex items-center justify-center">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-ink">{pageTitle}</h1>
              <p className="text-sm sm:text-base text-ink-muted max-w-lg mx-auto leading-relaxed">
                {isRtl
                  ? 'هذه الوثيقة غير منشورة أو قيد المراجعة والاعتماد حالياً. يمكنك الرجوع إلى الصفحة الرئيسية أو التواصل معنا لأي استفسار.'
                  : 'This legal document is currently unavailable or pending publication. Please return to the homepage or contact support if you have questions.'}
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-dark dark:bg-primary-solid text-white text-xs font-bold transition-colors"
                >
                  <BackIcon className="w-4 h-4" />
                  <span>{isRtl ? 'الصفحة الرئيسية' : 'Go to Homepage'}</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {isSectionEnabled('footer') && <Footer hashBasePath="/" />}
    </div>
  );
}
