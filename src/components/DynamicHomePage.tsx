'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import { ComplianceRibbon } from '@/components/ComplianceRibbon';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { LazySection } from '@/components/LazySection';

// Below-the-fold sections are dynamically code-split to maximize mobile performance and reduce TBT
const FareCalculatorSection = dynamic(
  () => import('@/components/FareCalculatorSection').then((m) => m.FareCalculatorSection)
);
const AnalyticsBar = dynamic(
  () => import('@/components/AnalyticsBar').then((m) => m.AnalyticsBar)
);
const HowItWorks = dynamic(
  () => import('@/components/HowItWorks').then((m) => m.HowItWorks)
);
const ValuePillars = dynamic(
  () => import('@/components/ValuePillars').then((m) => m.ValuePillars)
);
const FleetCategories = dynamic(
  () => import('@/components/FleetCategories').then((m) => m.FleetCategories)
);
const AppExperience = dynamic(
  () => import('@/components/AppExperience').then((m) => m.AppExperience)
);
const CaptainEarnings = dynamic(
  () => import('@/components/CaptainEarnings').then((m) => m.CaptainEarnings)
);
const FAQSection = dynamic(
  () => import('@/components/FAQSection').then((m) => m.FAQSection)
);
const ContactSection = dynamic(
  () => import('@/components/ContactSection').then((m) => m.ContactSection)
);
const DownloadBanner = dynamic(
  () => import('@/components/DownloadBanner').then((m) => m.DownloadBanner)
);
const Footer = dynamic(
  () => import('@/components/Footer').then((m) => m.Footer)
);

const SECTION_REGISTRY: Record<string, React.ComponentType> = {
  compliance_ribbon: ComplianceRibbon,
  header: Header,
  hero: HeroSection,
  fare_calculator: FareCalculatorSection,
  analytics_bar: AnalyticsBar,
  how_it_works: HowItWorks,
  value_pillars: ValuePillars,
  fleet_categories: FleetCategories,
  app_experience: AppExperience,
  captain_earnings: CaptainEarnings,
  faq: FAQSection,
  contact: ContactSection,
  download_banner: DownloadBanner,
  footer: Footer,
};

export function DynamicHomePage() {
  const { orderedSectionKeys, config } = useWebsiteConfig();

  if (!config) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-canvas text-ink px-4">
        <div className="max-w-md text-center space-y-3 p-8 rounded-3xl bg-card border border-line shadow-elevated">
          <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-bold text-ink-muted">جاري تحميل محتوى المنصة...</p>
        </div>
      </main>
    );
  }

  const ABOVE_THE_FOLD = new Set(['compliance_ribbon', 'header', 'hero']);

  return (
    <main className="min-h-screen flex flex-col bg-canvas text-ink transition-colors duration-200">
      {orderedSectionKeys.map((key) => {
        const Component = SECTION_REGISTRY[key];
        if (!Component) return null;

        if (ABOVE_THE_FOLD.has(key)) {
          return <Component key={key} />;
        }

        return (
          <LazySection key={key} fallbackHeight="350px" rootMargin="0px">
            <Component />
          </LazySection>
        );
      })}
    </main>
  );
}
