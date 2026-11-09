import type { Metadata } from 'next';
import { Cairo, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { COMPANY_DATA } from '@/data/company';

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

export const metadata: Metadata = {
  metadataBase: new URL('https://kowa.sa'),
  title: 'كـوا | KOWA - التنقل الذكي الفاخر والقيمة العادلة بالسعر الثابت',
  description:
    'انضم إلى منصة كوا الذكية للتنقل الفاخر والخدمات اللوجستية بالمملكة العربية السعودية. كباتن سعوديون نخبة، تتبع مسار فوري، وتجربة تنقل استثنائية وآمنة.',
  keywords: [
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
  ],
  authors: [{ name: 'كوا KOWA Mobility', url: 'https://kowa.sa' }],
  publisher: 'KOWA Mobility',
  icons: {
    icon: COMPANY_DATA.logoFav,
    shortcut: COMPANY_DATA.logoFav,
    apple: COMPANY_DATA.logoFav,
  },
  openGraph: {
    title: 'كوا — KOWA | منصة النقل والخدمات اللوجستية الذكية في السعودية',
    description: 'تنقّل بسهولة وأمان في جميع أنحاء المملكة مع منصة كوا الذكية للتنقل الفاخر.',
    url: 'https://kowa.sa',
    siteName: 'كوا KOWA Mobility',
    images: [{ url: COMPANY_DATA.logo, width: 400, height: 260, alt: 'كوا KOWA Mobility' }],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'كوا — KOWA | منصة النقل والخدمات اللوجستية الذكية في السعودية',
    description: 'تنقّل بسهولة وأمان في جميع أنحاء المملكة مع منصة كوا الذكية للتنقل الفاخر.',
    images: [COMPANY_DATA.logo],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${plusJakartaSans.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-white text-neutral-900 selection:bg-brand selection:text-white">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
