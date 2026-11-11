'use client';

import React from 'react';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import { ComplianceRibbon } from '@/components/ComplianceRibbon';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { FareCalculatorSection } from '@/components/FareCalculatorSection';
import { AnalyticsBar } from '@/components/AnalyticsBar';
import { HowItWorks } from '@/components/HowItWorks';
import { ValuePillars } from '@/components/ValuePillars';
import { FleetCategories } from '@/components/FleetCategories';
import { AppExperience } from '@/components/AppExperience';
import { CaptainEarnings } from '@/components/CaptainEarnings';
import { FAQSection } from '@/components/FAQSection';
import { ContactSection } from '@/components/ContactSection';
import { DownloadBanner } from '@/components/DownloadBanner';
import { Footer } from '@/components/Footer';

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

  return (
    <main className="min-h-screen flex flex-col bg-canvas text-ink transition-colors duration-200">
      {orderedSectionKeys.map((key) => {
        const Component = SECTION_REGISTRY[key];
        if (!Component) return null;
        return <Component key={key} />;
      })}
    </main>
  );
}
