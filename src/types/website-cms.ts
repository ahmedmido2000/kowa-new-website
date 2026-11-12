export type Locale = 'ar' | 'en';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface CmsImage {
  url: string;
  alt: LocalizedText;
}

export type WebsiteSectionKey =
  | 'compliance_ribbon'
  | 'header'
  | 'hero'
  | 'fare_calculator'
  | 'analytics_bar'
  | 'how_it_works'
  | 'value_pillars'
  | 'fleet_categories'
  | 'app_experience'
  | 'captain_earnings'
  | 'faq'
  | 'contact'
  | 'download_banner'
  | 'footer';

export interface SectionOrderItem {
  key: WebsiteSectionKey | string;
  isEnabled: boolean;
  sortOrder: number;
}

export interface ComplianceRibbonContent {
  priceGuarantee: LocalizedText;
  showZatcaText?: boolean;
  showHotline?: boolean;
  showPriceGuarantee?: boolean;
}

export interface HeaderNavBadge {
  text: LocalizedText;
  isEnabled?: boolean;
}

export interface HeaderNavLink {
  id: string;
  label: LocalizedText;
  href: string;
  badge?: HeaderNavBadge | null;
  isEnabled: boolean;
}

export interface HeaderContent {
  brandTitle: LocalizedText;
  brandBadge: LocalizedText;
  brandTagline: LocalizedText;
  navLinks: HeaderNavLink[];
  cta: {
    label: LocalizedText;
    mobileLabel: LocalizedText;
    href: string;
  };
}

export interface HeroTrustStat {
  id: string;
  icon: string;
  value: string;
  label: LocalizedText;
  isEnabled: boolean;
}

export interface HeroContent {
  kicker: LocalizedText;
  headline: {
    lead: LocalizedText;
    highlight: LocalizedText;
    tail: LocalizedText;
  };
  subtitle: LocalizedText;
  backgroundImage: CmsImage;
  primaryCta: {
    label: LocalizedText;
    href: string;
  };
  secondaryCta: {
    label: LocalizedText;
    href: string;
  };
  scrollCue: {
    label: LocalizedText;
    href: string;
  };
  trustStats: HeroTrustStat[];
  mirrorBackgroundInLtr?: boolean;
  showAmbientParticles?: boolean;
  showOrbitalStreams?: boolean;
}

export interface FareCalculatorPreset {
  id: string;
  label: LocalizedText;
  pickup: LocalizedText;
  destination: LocalizedText;
  km: number;
  etaMin: number;
  isEnabled: boolean;
}

export interface FareCalculatorVehicleClass {
  id: string;
  name: LocalizedText;
  isFavorite: boolean;
}

export interface FareCalculatorTrustItem {
  id: string;
  icon: string;
  text: LocalizedText;
  isEnabled: boolean;
}

export interface AppRedirectPromo {
  isEnabled?: boolean;
  code?: string;
  text: LocalizedText;
}

export interface FareCalculatorServiceArea {
  south: number;
  north: number;
  west: number;
  east: number;
}

export interface FareCalculatorDynamicLabels {
  calculateButton: LocalizedText;
  loading: LocalizedText;
  selectPickup: LocalizedText;
  selectDestination: LocalizedText;
  selectCategory: LocalizedText;
  noCategories: LocalizedText;
  error: LocalizedText;
  noRoute: LocalizedText;
  distance: LocalizedText;
  duration: LocalizedText;
  total: LocalizedText;
  disclaimer: LocalizedText;
}

export interface FareCalculatorDynamicConfig {
  enabled: boolean;
  showMap: boolean;
  showBreakdown: boolean;
  allowedCategoryIds?: string[];
  maxDistanceKm?: number;
  serviceArea?: FareCalculatorServiceArea | null;
  labels: FareCalculatorDynamicLabels;
}

export interface FareCalculatorContent {
  dynamic?: FareCalculatorDynamicConfig | null;
  badge: LocalizedText;
  headline: {
    lead: LocalizedText;
    highlight: LocalizedText;
  };
  subtitle: LocalizedText;
  savingsBadge?: { text: LocalizedText; isEnabled?: boolean } | null;
  favoriteBadge?: LocalizedText | null;
  demoNotice?: LocalizedText | null;
  labels: {
    consoleHeader: LocalizedText;
    pickupPoint: LocalizedText;
    destination: LocalizedText;
    presetsTitle: LocalizedText;
    selectClass: LocalizedText;
    previewBadge: LocalizedText;
    radarBadge: LocalizedText;
    finalFare: LocalizedText;
    vatNote: LocalizedText;
    surgeLock: LocalizedText;
    cta: LocalizedText;
  };
  presets: FareCalculatorPreset[];
  vehicleClasses: FareCalculatorVehicleClass[];
  trustStrip: FareCalculatorTrustItem[];
  appRedirectModal: {
    title: LocalizedText;
    subtitle: LocalizedText;
    promo?: AppRedirectPromo | null;
    smsFallbackButton: LocalizedText;
    scanLabel: LocalizedText;
    qrTargetUrl: string;
    qrImageUrl: string;
  };
}

export interface AnalyticsBarItem {
  id: string;
  numeric: number | null;
  prefix?: string;
  suffix?: LocalizedText;
  label: LocalizedText;
  subtext: LocalizedText;
  badge: LocalizedText;
  icon: string;
  isEnabled: boolean;
}

export interface AnalyticsBarContent {
  items: AnalyticsBarItem[];
}

export interface HowItWorksStep {
  id: string;
  stepNumber: string;
  icon: string;
  badge: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  featureText: LocalizedText;
  highlight: LocalizedText;
  isEnabled: boolean;
}

export interface HowItWorksContent {
  badge: LocalizedText;
  headline: {
    lead: LocalizedText;
    highlight: LocalizedText;
  };
  subtitle: LocalizedText;
  steps: HowItWorksStep[];
  footerPromo?: {
    promo?: AppRedirectPromo | null;
    title: LocalizedText;
    ctaLabel: LocalizedText;
    ctaHref: string;
  } | null;
}

export interface ValuePillarItem {
  id: string;
  icon: string;
  badgeStyle: 'lime' | 'neutral' | 'emerald' | string;
  title: LocalizedText;
  badge: LocalizedText;
  description: LocalizedText;
  featureText: LocalizedText;
  featureIcon: string;
  isEnabled: boolean;
}

export interface ValuePillarsContent {
  badge: LocalizedText;
  headline: LocalizedText;
  subtitle: LocalizedText;
  pillars: ValuePillarItem[];
}

export interface FleetCategoryItem {
  id: string;
  tabLabel: LocalizedText;
  badge: LocalizedText;
  vehicles: LocalizedText;
  title: LocalizedText;
  desc: LocalizedText;
  capacity: LocalizedText;
  eta: LocalizedText;
  feature: LocalizedText;
  startingPrice: LocalizedText;
  carName: string;
  image: CmsImage;
  isEnabled: boolean;
}

export interface FleetCategoriesContent {
  badge: LocalizedText;
  headline: LocalizedText;
  subtitle: LocalizedText;
  modelYearBadge?:
    | {
        text: LocalizedText;
        isEnabled?: boolean;
      }
    | LocalizedText
    | null;
  inspectionBadge?: LocalizedText | null;
  defaultActiveCategoryId?: string;
  labels: {
    cta: LocalizedText;
    capacity: LocalizedText;
    features: LocalizedText;
    avgArrival: LocalizedText;
    startingFrom: LocalizedText;
  };
  categories: FleetCategoryItem[];
}

export interface AppExperienceFeature {
  id: string;
  icon: string;
  title: LocalizedText;
  description: LocalizedText;
  isEnabled: boolean;
}

export interface PhoneMockupDemo {
  mapImage: CmsImage;
  statusText: LocalizedText;
  etaBadge: string;
  destinationPin: LocalizedText;
  captainInitials: string;
  captainName: LocalizedText;
  vehicleText: LocalizedText;
  captainPhone: string;
  paymentMethod: string;
  fixedFareDisplay: string;
  shareButtonLabel: LocalizedText;
  shareCopiedLabel: LocalizedText;
}

export interface AppExperienceContent {
  badge: LocalizedText;
  headline: LocalizedText;
  subtitle: LocalizedText;
  features: AppExperienceFeature[];
  phoneMockupDemo: PhoneMockupDemo;
}

export interface CaptainHighlightItem {
  id: string;
  icon: string;
  title: LocalizedText;
  description: LocalizedText;
  isEnabled: boolean;
}

export interface CaptainRequirementItem {
  id: string;
  text: LocalizedText;
  isEnabled: boolean;
}

export interface CaptainVehicleStandardItem {
  id: string;
  label: LocalizedText;
  value: LocalizedText;
  isEnabled: boolean;
  isHighlighted?: boolean;
}

export interface CaptainEarningsContent {
  badge: LocalizedText;
  headline: LocalizedText;
  subtitle: LocalizedText;
  highlights: CaptainHighlightItem[];
  primaryCta: { label: LocalizedText };
  criteriaCta: { label: LocalizedText };
  calculator: {
    title: LocalizedText;
    benchmarkBadge: LocalizedText;
    hoursLabel: LocalizedText;
    daysLabel: LocalizedText;
    weeklyLabel: LocalizedText;
    monthlyLabel: LocalizedText;
    disclaimer: LocalizedText;
    demoNotice: LocalizedText;
    hourlyNetRate: number | null;
    platformCommissionPercent: number | null;
    weeklyToMonthlyMultiplier: number;
    hoursSlider: { min: number; max: number; default: number };
    daysSlider: { min: number; max: number; default: number };
  };
  criteriaModal: {
    title: LocalizedText;
    subtitle: LocalizedText;
    captainRequirementsTitle: LocalizedText;
    vehicleStandardsTitle: LocalizedText;
    ctaLabel: LocalizedText;
    captainRequirements: CaptainRequirementItem[];
    vehicleStandards: CaptainVehicleStandardItem[];
  };
}

export interface FaqItem {
  id: string;
  category: LocalizedText;
  question: LocalizedText;
  answer: LocalizedText;
  isDefaultOpen: boolean;
  isEnabled: boolean;
}

export interface FaqSupportMetric {
  id: string;
  icon: string;
  value: LocalizedText;
  label: LocalizedText;
  isEnabled: boolean;
}

export interface FaqContent {
  badge: LocalizedText;
  headline: {
    lead: LocalizedText;
    highlight: LocalizedText;
  };
  subtitle: LocalizedText;
  items: FaqItem[];
  supportCard: {
    badge: LocalizedText;
    title: LocalizedText;
    subtitle: LocalizedText;
    metrics: FaqSupportMetric[];
    primaryCta: {
      href: string;
      label: LocalizedText;
    };
    whatsappLabel: LocalizedText;
  };
}

export interface ContactSubjectItem {
  id: string;
  label: LocalizedText;
  routeEmail?: string;
  isEnabled: boolean;
}

export interface ContactContent {
  badge: LocalizedText;
  headline: LocalizedText;
  subtitle: LocalizedText;
  socialTitle: LocalizedText;
  workingHours: {
    title: LocalizedText;
    text: LocalizedText;
  };
  cards: {
    headquartersLabel: LocalizedText;
    headerquarterNote?: LocalizedText;
    headquartersNote?: LocalizedText;
    emailLabel: LocalizedText;
    emailNote: LocalizedText;
    whatsappLabel: LocalizedText;
    whatsappLiveBadge: LocalizedText;
    whatsappNote: LocalizedText;
    hotlineLabel: LocalizedText;
    hotlineNote: LocalizedText;
  };
  form: {
    title: LocalizedText;
    subtitle: LocalizedText;
    labels: {
      fullName: LocalizedText;
      phone: LocalizedText;
      email: LocalizedText;
      subject: LocalizedText;
      message: LocalizedText;
    };
    placeholders: {
      fullName: LocalizedText;
      phone: LocalizedText;
      email: LocalizedText;
      message: LocalizedText;
      location?: LocalizedText;
    };
    subjects: ContactSubjectItem[];
    submitLabel: LocalizedText;
    submittingLabel: LocalizedText;
    successMessage: LocalizedText;
  };
}

export interface DownloadBannerContent {
  badge: {
    promo?: AppRedirectPromo | null;
    tagline: LocalizedText;
  };
  headline: LocalizedText;
  subtitle: LocalizedText;
  smsForm: {
    countryCode: string;
    placeholder: string;
    buttonLabel: LocalizedText;
    successMessage: LocalizedText;
    messageTemplate?: LocalizedText;
  };
  storeBadges: {
    appStoreCaption: LocalizedText;
    googlePlayCaption: LocalizedText;
  };
  qrBox: {
    title: LocalizedText;
    subtitle: LocalizedText;
    qrImageUrl: string;
    qrTargetUrl: string;
  };
}

export interface FooterNavLink {
  id: string;
  label: LocalizedText;
  href: string;
  isEnabled: boolean;
}

export interface FooterLegalLink {
  id: string;
  label: LocalizedText;
  href: string;
  contentKey?: string;
  isEnabled: boolean;
}

export interface FooterContent {
  servicesColumn: {
    title: LocalizedText;
    links: FooterNavLink[];
  };
  businessColumn: {
    title: LocalizedText;
    links: FooterNavLink[];
  };
  socialColumnTitle: LocalizedText;
  socialNote: LocalizedText;
  hotlineLabel: LocalizedText;
  legalLinks: FooterLegalLink[];
}

export interface WebsiteSectionsMap {
  compliance_ribbon?: ComplianceRibbonContent;
  header?: HeaderContent;
  hero?: HeroContent;
  fare_calculator?: FareCalculatorContent;
  analytics_bar?: AnalyticsBarContent;
  how_it_works?: HowItWorksContent;
  value_pillars?: ValuePillarsContent;
  fleet_categories?: FleetCategoriesContent;
  app_experience?: AppExperienceContent;
  captain_earnings?: CaptainEarningsContent;
  faq?: FaqContent;
  contact?: ContactContent;
  download_banner?: DownloadBannerContent;
  footer?: FooterContent;
}

export interface WebsiteSiteSeo {
  title: LocalizedText;
  description: LocalizedText;
  ogTitle?: LocalizedText;
  ogDescription?: LocalizedText;
  keywords?: string[] | LocalizedText;
  siteName?: LocalizedText;
  ogImageUrl?: string;
  twitterCard?: string;
  canonicalUrl?: string;
}

export interface WebsiteCompanyInfo {
  name: LocalizedText;
  fullName: LocalizedText;
  slogan: LocalizedText;
  about: LocalizedText;
  hotline: string;
  hotlineDisplay: string;
  tgaLicense: string;
  tgaLabel: LocalizedText;
  zatcaLabel: LocalizedText;
  websiteUrl: string;
  headerLogoUrl: string;
  copyright: LocalizedText;
}

export interface WebsiteSocialChannel {
  id: string;
  name: string;
  href: string;
  color: string;
  username: string;
  isEnabled: boolean;
}

export interface WebsiteFeatureFlags {
  enableLanguageSwitch: boolean;
  enableThemeToggle: boolean;
  enableSmoothScroll: boolean;
  enableScrollProgress: boolean;
  enableBackToTop: boolean;
  enable3DTiltCards: boolean;
  enableMagneticButtons: boolean;
  enableSmsAppLink: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: LocalizedText;
}

export interface WebsiteThemeTokens {
  brandPrimary: string;
  brandDark: string;
  brandLimeAccent: string;
  darkCanvas: string;
  darkCard: string;
  darkElevated: string;
  darkPrimarySolid: string;
}

export interface WebsiteSiteSettings {
  defaultLocale: Locale;
  defaultTheme: ThemePreference;
  featureFlags: WebsiteFeatureFlags;
  themeTokens: WebsiteThemeTokens;
}

export interface WebsiteSiteConfig {
  seo: WebsiteSiteSeo;
  company: WebsiteCompanyInfo;
  socials: WebsiteSocialChannel[];
  settings: WebsiteSiteSettings;
}

export interface WebsitePlatformConfig {
  appName: LocalizedText;
  supportEmail: string;
  phone: string;
  whatsapp: string;
  address: LocalizedText;
  androidAppUrl: string;
  iosAppUrl: string;
  siteLogoUrl: string;
  faviconUrl: string | null;
  hotline: string;
  hotlineDisplay: string;
  headerLogoUrl: string;
}

export interface WebsiteConfigData {
  sectionsOrder: SectionOrderItem[];
  sections: WebsiteSectionsMap;
  site: WebsiteSiteConfig;
  platform: WebsitePlatformConfig;
  updatedAt: string | null;
}

export interface LegalBlockContent {
  title: LocalizedText;
  content: LocalizedText;
}

export interface WebsiteSectionEnvelope<T = unknown> {
  key: string;
  content: T;
  updatedAt: string | null;
}

export interface ContactSubmissionRequest {
  name: string;
  phone: string;
  email: string;
  subjectId?: string;
  subject?: string;
  message: string;
  locale?: Locale;
}

export interface ContactSubmissionResponse {
  ticketId: string;
  status: string;
}

export interface SmsAppLinkRequest {
  phone: string;
  locale?: Locale;
}

export interface SmsAppLinkResponse {
  sent: boolean;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface DynamicFareCategoryItem {
  id: string;
  code: string;
  name: LocalizedText | string;
  description: string;
  imageUrl: string | null;
  sortOrder: number;
  configured: boolean;
  available: boolean;
}

export interface FareCalculatorCategoriesResponse {
  cityId: string | null;
  governorate: string;
  items: DynamicFareCategoryItem[];
}

export interface EstimateFareRequest {
  pickup: GeoPoint;
  destination: GeoPoint;
  deliveryCategoryId: string;
}

export interface EstimateFareBreakdown {
  fareBeforeVat: number;
  vatAmount: number;
  total: number;
}

export interface EstimateFareRouteGeometry {
  type: 'LineString';
  coordinates: [number, number][];
}

export interface EstimateFareResponse {
  deliveryCategoryId: string;
  cityId: string;
  governorate: string;
  currency: string;
  estimated: boolean;
  includesVat: boolean;
  pickup: GeoPoint;
  destination: GeoPoint;
  route: {
    distanceKm: number;
    durationMinutes: number;
    geometry: EstimateFareRouteGeometry;
  };
  price: number;
  breakdown?: EstimateFareBreakdown | null;
  pricingVersion: number;
  calculatedAt: string;
}
