import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getWebsiteConfigSafe, getWebsiteSectionSafe } from '@/lib/website-api.server';
import { pickText, resolveLegalBlockKey } from '@/lib/cms-helpers';
import type { LegalBlockContent } from '@/types/website-cms';
import { LegalPageView } from '@/components/LegalPageView';

export async function generateStaticParams() {
  return [{ slug: 'terms' }, { slug: 'privacy' }, { slug: 'passenger-rights' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blockKey = resolveLegalBlockKey(slug);
  if (!blockKey) {
    return { title: 'KOWA' };
  }

  const [config, envelope] = await Promise.all([
    getWebsiteConfigSafe(),
    getWebsiteSectionSafe<LegalBlockContent>(blockKey),
  ]);

  const defaultLocale = config?.site?.settings?.defaultLocale || 'ar';
  const siteName = pickText(config?.site?.seo?.siteName, defaultLocale, 'KOWA Mobility');
  const title = envelope
    ? pickText(envelope.content?.title, defaultLocale, slug)
    : slug;

  return {
    title: `${title} | ${siteName}`,
  };
}

async function LegalContentLoader({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blockKey = resolveLegalBlockKey(slug);
  if (!blockKey) {
    notFound();
  }

  const envelope = await getWebsiteSectionSafe<LegalBlockContent>(blockKey);
  return <LegalPageView slug={slug} block={envelope} />;
}

export default function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-canvas text-ink-muted text-sm font-semibold">
          Loading...
        </div>
      }
    >
      <LegalContentLoader params={params} />
    </Suspense>
  );
}
