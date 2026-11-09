# كـوا | KOWA - Smart Mobility & Fair Value Website (Next.js)

A modern, high-performance web platform for **KOWA (كـوا)** — Saudi Arabia's premier smart mobility and ride-hailing service, featuring guaranteed fixed upfront fares, TGA accreditation, and elite Saudi captains.

Converted from static HTML into a modern **Next.js 16 (App Router)** application with **React 19**, **TypeScript**, and **Tailwind CSS**.

---

## 🏢 Official Company Data (Integrated from Previous Site)

- **Official Brand**: كـوا | KOWA (شركة كوا لتقنية المعلومات والنقل البري الذكي / KOWA Mobility)
- **Headquarters Address**: الرياض، المملكة العربية السعودية (Riyadh, Kingdom of Saudi Arabia)
- **Support Email**: `support@kowa.sa`
- **Toll-Free Hotline**: `800-KOWA (5692)` / `8005692`
- **WhatsApp Support**: `+966552291088` ([wa.me/966552291088](https://wa.me/966552291088))
- **Licensing & Accreditation**:
  - Transport General Authority (TGA): License #492/ن
  - ZATCA: 100% E-Invoicing Compliant
- **Official Social Media**:
  - **X (Twitter)**: [x.com/kowa_sa](https://x.com/kowa_sa)
  - **TikTok**: [tiktok.com/@kowa.sa](https://www.tiktok.com/@kowa.sa)
  - **Snapchat**: [snapchat.com/add/kowa.sa](https://www.snapchat.com/add/kowa.sa)
  - **WhatsApp**: [wa.me/966552291088](https://wa.me/966552291088)
  - **YouTube**: [youtube.com/@kowa_sa](https://youtube.com/@kowa_sa?si=SrID9613TfoGOzN8)
  - **LinkedIn**: [linkedin.com/company/kowaboor](https://www.linkedin.com/company/kowaboor/)
- **Brand Assets**: Official `logo.png` and `logo-fav.png` vectors preserved in `/public`.

---

## 🌟 Key Features

- **⚡ Next.js 16 App Router & Turbopack**: Blazing-fast page loads, optimized assets, and static generation.
- **🌐 Bilingual Arabic & English Support (RTL/LTR)**: Instant direction (`dir="rtl"` / `dir="ltr"`) and language toggle with synchronized typography.
- **🚖 Interactive Fare Calculator Console**:
  - Live pickup and destination inputs with geolocation trigger
  - Fleet selector (Eco Smart, Comfort, Business VIP)
  - Interactive Instant Booking Modal with real-time feedback
- **🛡️ Value Pillars**: Zero-surge pricing guarantee, 2023+ modern sanitized fleet, and elite Saudi captain vetting.
- **🚘 Fleet Showcase Tabs**: Dynamic category switcher (*Eco*, *Comfort*, *Business VIP*, *Family XL*) showcasing car models, passenger/luggage capacities, average ETAs, and starting fares.
- **📱 Simulated Interactive Mobile Mockup**:
  - Live route navigation simulation with animated pins
  - Captain profile sheet (Captain Sultan Al-Shammari, 4.99 ★)
  - Mada & Apple Pay badges, automated ZATCA e-invoicing notice, and one-click trip sharing.
- **💰 Captain Earnings Estimator**:
  - Interactive dual sliders for daily driving hours (2–12 hrs) and weekly working days (1–7 days)
  - Live formula recalculation of net monthly earnings in SAR
  - Regulatory registration conditions & vehicle criteria modal (TGA compliant)
- **📬 Contact & Support Section**:
  - Headquarters address, direct email, WhatsApp chat, and 24/7 hotline cards
  - Dedicated interactive contact form with server-side validation and email delivery via Resend API (`/api/contact`)
- **📲 App Download Banner**:
  - Instant SMS link dispatch form with Saudi phone validation (`+966 5XXXXXXXX`)
  - Official Apple App Store & Google Play vector badges
  - High-res QR code for camera scan downloads
- **🏛️ Regulatory & Corporate Footer**:
  - Full company credentials, social media directory, passenger rights, and sitemap

---

## 🏗️ Architecture & Project Structure

```
├── public/
│   ├── logo.png                 # Official KOWA Company Logo
│   ├── logo-fav.png             # Official Favicon
│   ├── apple.svg                # Apple App Store vector badge
│   ├── google-play.svg          # Google Play vector badge
│   └── ...
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── contact/route.ts # Contact form email dispatcher (Resend API)
│   │   ├── globals.css          # Tailwind CSS v4 styling & theme tokens
│   │   ├── layout.tsx           # Google Fonts (Cairo & Plus Jakarta Sans), SEO metadata
│   │   └── page.tsx             # Main page composition
│   ├── components/
│   │   ├── ComplianceRibbon.tsx # Top official TGA license & 800-KOWA ribbon
│   │   ├── Header.tsx           # Sticky nav with official logo, language switch, mobile drawer
│   │   ├── HeroSection.tsx      # Main headline, visual hero, dual-action fare calculator
│   │   ├── BookingModal.tsx     # Interactive ride request modal with instant feedback
│   │   ├── ValuePillars.tsx     # 3 Core service guarantees
│   │   ├── FleetCategories.tsx  # Interactive tabbed vehicle class showcase
│   │   ├── AppExperience.tsx    # Smartphone UI mockup with live route and fintech features
│   │   ├── CaptainEarnings.tsx  # Dynamic monthly income calculator with sliders
│   │   ├── CaptainModal.tsx     # TGA criteria and vehicle onboarding modal
│   │   ├── ContactSection.tsx   # Contact form, HQ address, WhatsApp, phone & social cards
│   │   ├── DownloadBanner.tsx   # SMS link sender, store badges & QR code
│   │   └── Footer.tsx           # Corporate info, social media directory, legal notices
│   ├── context/
│   │   └── LanguageContext.tsx  # React context for Arabic (RTL) / English (LTR) switching
│   └── data/
│       ├── company.ts           # Centralized official company data, address, links & contacts
│       └── translations.ts      # Multi-language copy, fleet data & vehicle constants
├── next.config.ts               # Next.js configuration (remote image patterns, optimizations)
├── tsconfig.json                # TypeScript strict configuration
└── package.json                 # Dependencies & project scripts
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production
```bash
npm run build
npm run start
```
