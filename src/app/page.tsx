import { ComplianceRibbon } from '@/components/ComplianceRibbon';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ValuePillars } from '@/components/ValuePillars';
import { FleetCategories } from '@/components/FleetCategories';
import { AppExperience } from '@/components/AppExperience';
import { CaptainEarnings } from '@/components/CaptainEarnings';
import { ContactSection } from '@/components/ContactSection';
import { DownloadBanner } from '@/components/DownloadBanner';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-canvas text-ink transition-colors duration-200">
      <ComplianceRibbon />
      <Header />
      <HeroSection />
      <ValuePillars />
      <FleetCategories />
      <AppExperience />
      <CaptainEarnings />
      <ContactSection />
      <DownloadBanner />
      <Footer />
    </main>
  );
}
