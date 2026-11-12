import type { Metadata } from 'next';
import { Cairo, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { WebsiteConfigProvider } from '@/context/WebsiteConfigContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import ScrollProgress from '@/components/ScrollProgress';
import BackToTop from '@/components/BackToTop';
import { MaintenanceGate } from '@/components/MaintenanceScreen';
import { COMPANY_DATA } from '@/data/company';
import { getWebsiteConfigSafe } from '@/lib/website-api.server';
import { hexToRgbTriplet, pickText } from '@/lib/cms-helpers';
import type { WebsiteThemeTokens } from '@/types/website-cms';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

function buildSafeThemeCss(tokens: Partial<WebsiteThemeTokens> | undefined): string {
  if (!tokens) return '';
  const validHex = (val: string | undefined) =>
    val && /^#[0-9a-fA-F]{6}$/.test(val.trim()) ? val.trim() : null;

  const brandPrimary = validHex(tokens.brandPrimary);
  const brandDark = validHex(tokens.brandDark);
  const rawBrandLime = validHex(tokens.brandLimeAccent);
  const LEGACY_YELLOW_HEXES = new Set(['#D3D93C', '#DAE423', '#DEEA2C', '#E1E848', '#C0C628']);
  const brandLime =
    rawBrandLime && !LEGACY_YELLOW_HEXES.has(rawBrandLime.toUpperCase())
      ? rawBrandLime
      : null;
  const darkCanvas = hexToRgbTriplet(tokens.darkCanvas);
  const darkCard = hexToRgbTriplet(tokens.darkCard);
  const darkElevated = hexToRgbTriplet(tokens.darkElevated);
  const darkPrimarySolid = hexToRgbTriplet(tokens.darkPrimarySolid);

  const rootVars: string[] = [];
  if (brandPrimary) rootVars.push(`--color-brand: ${brandPrimary};`);
  if (brandDark) rootVars.push(`--color-brand-dark: ${brandDark};`);
  if (brandLime) {
    rootVars.push(`--color-brand-lime: ${brandLime};`);
    rootVars.push(`--color-brand-accent: ${brandLime};`);
  }

  const darkVars: string[] = [];
  if (darkCanvas) darkVars.push(`--canvas: ${darkCanvas};`);
  if (darkCard) darkVars.push(`--card: ${darkCard};`);
  if (darkElevated) darkVars.push(`--elevated: ${darkElevated};`);
  if (darkPrimarySolid) darkVars.push(`--primary-solid: ${darkPrimarySolid};`);

  const chunks: string[] = [];
  if (rootVars.length > 0) chunks.push(`:root { ${rootVars.join(' ')} }`);
  if (darkVars.length > 0) chunks.push(`.dark { ${darkVars.join(' ')} }`);
  return chunks.join(' ');
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getWebsiteConfigSafe();
  const seo = config?.site?.seo;
  const platform = config?.platform;
  const locale = config?.site?.settings?.defaultLocale || 'ar';

  const canonicalUrl = seo?.canonicalUrl || 'https://kowa.sa';
  const title = pickText(
    seo?.title,
    locale,
    'كـوا | KOWA - التنقل الذكي الفاخر والقيمة العادلة بالسعر الثابت'
  );
  const description = pickText(
    seo?.description,
    locale,
    'انضم إلى منصة كوا الذكية للتنقل الفاخر والخدمات اللوجستية بالمملكة العربية السعودية. كباتن سعوديون نخبة، تتبع مسار فوري، وتجربة تنقل استثنائية وآمنة.'
  );
  const siteName = pickText(seo?.siteName, locale, 'كوا KOWA Mobility');
  const ogTitle = pickText(seo?.ogTitle, locale, title);
  const ogDescription = pickText(seo?.ogDescription, locale, description);
  const ogImage = seo?.ogImageUrl || COMPANY_DATA.logo;
  const favicon = platform?.faviconUrl || COMPANY_DATA.logoFav;

  const keywords = Array.isArray(seo?.keywords)
    ? seo.keywords
    : typeof seo?.keywords === 'object' && seo.keywords
      ? pickText(seo.keywords, locale)
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean)
      : [
          'كوا',
          'KOWA',
          'تطبيق كوا',
          'كوا للتنقل',
          'تنقل ذكي',
          'توصيل الرياض',
          'كباتن سعوديين',
          'سيارة فاخرة الرياض',
          'خدمات لوجستية السعودية',
          'تطبيق توصيل السعودية',
        ];

  return {
    metadataBase: new URL(canonicalUrl.startsWith('http') ? canonicalUrl : 'https://kowa.sa'),
    title,
    description,
    keywords,
    authors: [{ name: siteName, url: canonicalUrl }],
    publisher: siteName,
    alternates: {
      canonical: canonicalUrl,
    },
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName,
      images: [{ url: ogImage, width: 400, height: 260, alt: siteName }],
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: seo?.twitterCard === 'summary' ? 'summary' : 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getWebsiteConfigSafe();
  const defaultLocale = config?.site?.settings?.defaultLocale === 'en' ? 'en' : 'ar';
  const defaultTheme = config?.site?.settings?.defaultTheme || 'light';
  const enableThemeToggle = config?.site?.settings?.featureFlags?.enableThemeToggle ?? true;
  const themeCss = buildSafeThemeCss(config?.site?.settings?.themeTokens);

  const safeDefaultTheme =
    defaultTheme === 'dark' || defaultTheme === 'system' ? defaultTheme : 'light';

  const themeScript = `(function(){try{var allow=${enableThemeToggle ? 'true' : 'false'};var def="${safeDefaultTheme}";var t=allow?localStorage.getItem("theme"):null;var isDark=t==="dark"||(!t&&(def==="dark"||(def==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches)));if(isDark){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}})();`;

  return (
    <html
      lang={defaultLocale}
      dir={defaultLocale === 'ar' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className={`${cairo.variable} ${plusJakartaSans.variable} scroll-smooth`}
    >
      <head>
        {themeCss ? <style dangerouslySetInnerHTML={{ __html: themeCss }} /> : null}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased bg-canvas text-ink selection:bg-brand selection:text-white transition-colors duration-200">
        <WebsiteConfigProvider initialConfig={config}>
          <ThemeProvider>
            <LanguageProvider>
              <SmoothScrollProvider>
                <ScrollProgress />
                <MaintenanceGate>{children}</MaintenanceGate>
                <BackToTop />
              </SmoothScrollProvider>
            </LanguageProvider>
          </ThemeProvider>
        </WebsiteConfigProvider>
      </body>
    </html>
  );
}
