# KOWA Mobility Website — Backend & Full CMS API Specification

هذا المستند هو المرجع الهندسي الكامل لفريق الـ **Backend** لبناء جميع الـ Endpoints وقاعدة البيانات ولوحة التحكم المطلوبة لإدارة **كل شيء** في موقع **كوا (KOWA Mobility)** بشكل ديناميكي كامل (نصوص عربية/إنجليزية، صور وملفات، أرقام ومعادلات، ألوان وهوية، تفعيل/إخفاء الأقسام والمزايا، والوظائف التفاعلية).

---

## 1. نظرة عامة وقواعد معمارية (Architecture Overview)

### 1.1 طبيعة الموقع (Landing Page -> Mobile App Funnel)
- الموقع هو **صفحة هبوط تعريفية وتفاعلية** توجه المستخدمين في النهاية إلى **تطبيق كوا على الجوال** (أو نموذج تواصل الكباتن والشركات).
- **لا يوجد حجز رحلات فعلي من الموقع**؛ حاسبة المسار تقوم فقط بتقدير المسافة والزمن والسعر الثابت التقديري ثم توجّه المستخدم لتحميل/فتح التطبيق مع كود الخصم.
- **ملاحظة:** الملفان `src/components/previoushero.tsx` و `src/components/BookingModal.tsx` هما نسختان مؤرشفتان فقط ولا يُستخدمان في الموقع الحي، لذا لا يجب بناء Endpoints لحجز الرحلات لهما.

### 1.2 المعايير العامة للـ API
- **Base URL:** `/api/v1`
- **دعم اللغات (Localization):**
  - جميع النصوص تدعم العربية والإنجليزية (`ar`, `en`).
  - نقاط العرض العامة (`public`) تقبل `?locale=ar|en|all` (والقيمة الافتراضية `all` عند التحميل في Next.js SSR/ISR لتبديل اللغة فورياً في المتصفح دون إعادة تحميل).
- **هيكل الاستجابة الموحد (Standard Envelope):**
```json
{
  "success": true,
  "message": "تم تنفيذ الطلب بنجاح",
  "data": {},
  "meta": {
    "version": "2026.11.10.1",
    "updatedAt": "2026-11-10T13:00:00Z"
  }
}
```
- **هيكل الأخطاء الموحد:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "messageAr": "يرجى إدخال رقم جوال صحيح",
    "messageEn": "Please enter a valid mobile number",
    "fields": { "phone": "Must match ^5[0-9]{8}$" }
  }
}
```
- **الأمان والمصادقة:**
  - مسارات `/api/v1/public/*`: متاحة للعرض العام مع كاش (`Cache-Control` / `ETag`).
  - مسارات `/api/v1/admin/*`: محمية بـ **JWT Bearer Token** + صلاحيات أدوار (`SUPER_ADMIN`, `CONTENT_EDITOR`, `SUPPORT_AGENT`).
  - حماية مسارات الإرسال (`contact`, `send-sms`, `estimate-fare`) عبر **Rate Limiting** و CORS مسموح لنطاقات الموقع فقط.
- **مزامنة التعديلات الفورية (Next.js Cache Revalidation):**
  - عند أي حفظ أو تعديل من لوحة التحكم (`admin/*`)، يُرسل الباك اند Webhook إلى الفرونت اند:
  - `POST {FRONTEND_URL}/api/revalidate` مع Header `x-revalidate-secret` لتحديث الكاش فوراً دون إعادة بناء الموقع.

---

## 2. نقطة التهيئة الرئيسية للموقع (Master Config Endpoint)

لتسريع الأداء في Next.js SSR/ISR (جلب الموقع في طلب واحد)، أو جلب أقسام محددة عند الحاجة:

| Method | Endpoint | الوصف |
| :--- | :--- | :--- |
| `GET` | `/api/v1/public/site-config?locale=all` | إرجاع جميع إعدادات الموقع، الهوية، الألوان، الترتيب، وكامل الأقسام الـ 12 في استجابة واحدة. |
| `GET` | `/api/v1/public/sections/:sectionKey?locale=all` | إرجاع بيانات قسم محدد فقط (`hero`, `fare_calculator`, `fleet_categories`, ...). |

### هيكل استجابة `GET /api/v1/public/site-config` الكامل
يحتوي الكائن المرجَع على الكتل التالية:
1. `settings` (الهوية، الألوان، تفعيلات النظام، اللغات، الثيم)
2. `seo` (بيانات محركات البحث والمشاركة الاجتماعية)
3. `company` (بيانات الشركة، التراخيص، العنوان، قنوات التواصل، المتاجر، السوشيال ميديا)
4. `sectionsOrder` (مصفوفة التحكم بظهور وترتيب كل سكشن)
5. `sections` (بيانات كل سكشن من الـ 12 سيكشن بالتفصيل)

---

## 3. تفاصيل التحكم الكامل بكل عنصر في الموقع (Schema لكل وحدة)

### 3.1 الإعدادات العامة، الألوان، الهوية، والـ SEO (`settings` + `seo`)
تستبدل القيم الثابتة في `src/app/layout.tsx`، `src/app/globals.css`، `ThemeContext.tsx`، و `LanguageContext.tsx`:

```json
{
  "settings": {
    "defaultLocale": "ar",
    "defaultTheme": "light",
    "featureFlags": {
      "enableLanguageSwitch": true,
      "enableThemeToggle": true,
      "enableSmoothScroll": true,
      "enableScrollProgress": true,
      "enableBackToTop": true,
      "enable3DTiltCards": true,
      "enableMagneticButtons": true,
      "enableHeroParticles": true,
      "enableSmsAppLink": true,
      "maintenanceMode": false,
      "maintenanceMessageAr": "الموقع قيد التحديث حالياً",
      "maintenanceMessageEn": "Website is currently under maintenance"
    },
    "themeTokens": {
      "brandPrimary": "#1F0F8C",
      "brandDark": "#140959",
      "brandDeep": "#0B0438",
      "brandLimeAccent": "#D3D93C",
      "brandLimeHover": "#C0C628",
      "lightCanvas": "#F8FAFD",
      "lightCard": "#FFFFFF",
      "lightInk": "#0F172A",
      "darkCanvas": "#0A0F1D",
      "darkCard": "#10182C",
      "darkElevated": "#17223C",
      "darkPrimarySolid": "#634EEB",
      "darkInk": "#F1F5F9"
    }
  },
  "seo": {
    "metadataBase": "https://kowa.sa",
    "titleAr": "كـوا | KOWA - التنقل الذكي الفاخر والقيمة العادلة بالسعر الثابت",
    "titleEn": "KOWA Mobility - Smart Luxury Mobility & Fair Fixed Pricing",
    "descriptionAr": "انضم إلى منصة كوا الذكية للتنقل الفاخر والخدمات اللوجستية بالمملكة العربية السعودية...",
    "descriptionEn": "Join KOWA smart mobility platform in Saudi Arabia...",
    "keywords": ["كوا", "KOWA", "تطبيق كوا", "تنقل ذكي", "توصيل الرياض"],
    "faviconUrl": "/kowa-badge-navy.png",
    "ogTitleAr": "كوا — KOWA | منصة النقل والخدمات اللوجستية الذكية في السعودية",
    "ogDescriptionAr": "تنقّل بسهولة وأمان في جميع أنحاء المملكة مع منصة كوا الذكية للتنقل الفاخر.",
    "ogImageUrl": "/kowa-badge-navy.png",
    "twitterCard": "summary_large_image"
  }
}
```

### 3.2 بيانات الشركة، الامتثال، المتاجر، والسوشيال ميديا (`company`)
تستبدل `src/data/company.ts`:

```json
{
  "company": {
    "name": {
      "ar": "كـوا | KOWA",
      "en": "KOWA Mobility",
      "fullAr": "شركة كوا لتقنية المعلومات والنقل البري الذكي",
      "fullEn": "KOWA Smart Transportation & IT Co."
    },
    "slogan": {
      "ar": "المنصة السعودية الرائدة في ابتكار حلول التنقل الذكي والفاخر",
      "en": "Leading Saudi platform pioneering smart luxury mobility solutions"
    },
    "about": {
      "ar": "كوا (Kowa) — المنصة السعودية الرائدة في ابتكار حلول التنقل الذكي...",
      "en": "KOWA — The premier Saudi platform for innovative smart mobility..."
    },
    "address": {
      "ar": "الرياض، المملكة العربية السعودية",
      "en": "Riyadh, Kingdom of Saudi Arabia",
      "city": "الرياض",
      "country": "المملكة العربية السعودية"
    },
    "contact": {
      "email": "support@kowa.sa",
      "hotline": "8005692",
      "hotlineDisplay": "800-KOWA (5692)",
      "whatsapp": "+966552291088",
      "whatsappLink": "https://wa.me/966552291088"
    },
    "compliance": {
      "tgaLicense": "492/ن",
      "tgaLabelAr": "مرخص ومعتمد من الهيئة العامة للنقل (TGA) رقم 492/ن",
      "tgaLabelEn": "Licensed by Saudi Transport General Authority (TGA) #492/N",
      "zatcaAr": "فواتير إلكترونية متوافقة كلياً مع هيئة الزكاة والضريبة والجمارك (ZATCA)",
      "zatcaEn": "Fully compliant with ZATCA E-Invoicing regulations"
    },
    "branding": {
      "websiteUrl": "https://kowa.sa",
      "copyrightYear": "2026",
      "headerLogoUrl": "/kowa-ik@4x.png",
      "badgeLogoUrl": "/kowa-badge-navy.png",
      "faviconUrl": "/kowa-badge-navy.png"
    },
    "appStores": {
      "appleStoreUrl": "https://apps.apple.com/...",
      "googlePlayUrl": "https://play.google.com/store/apps/...",
      "appleIconUrl": "/apple.svg",
      "googlePlayIconUrl": "/google-play.svg",
      "qrDownloadTargetUrl": "https://kowa.sa/download",
      "qrImageUrl": null
    },
    "socials": [
      {
        "id": "x",
        "name": "X (Twitter)",
        "href": "https://x.com/kowa_sa",
        "username": "@kowa_sa",
        "color": "#000000",
        "isEnabled": true,
        "sortOrder": 1
      }
    ]
  }
}
```
*(جميع المنصات الحالية: `x`, `tiktok`, `snapchat`, `whatsapp`, `youtube`, `linkedin` قابلة للإضافة/التعديل/الحذف/الترتيب من الباك اند).*

### 3.3 ترتيب وإظهار الأقسام (`sectionsOrder`)
تتيح للأدمن تفعيل/إخفاء أي قسم أو تغيير ترتيبه في `src/app/page.tsx`:
```json
[
  { "key": "compliance_ribbon", "isEnabled": true, "sortOrder": 1 },
  { "key": "header", "isEnabled": true, "sortOrder": 2 },
  { "key": "hero", "isEnabled": true, "sortOrder": 3 },
  { "key": "fare_calculator", "isEnabled": true, "sortOrder": 4 },
  { "key": "analytics_bar", "isEnabled": true, "sortOrder": 5 },
  { "key": "how_it_works", "isEnabled": true, "sortOrder": 6 },
  { "key": "value_pillars", "isEnabled": true, "sortOrder": 7 },
  { "key": "fleet_categories", "isEnabled": true, "sortOrder": 8 },
  { "key": "app_experience", "isEnabled": true, "sortOrder": 9 },
  { "key": "captain_earnings", "isEnabled": true, "sortOrder": 10 },
  { "key": "faq", "isEnabled": true, "sortOrder": 11 },
  { "key": "contact", "isEnabled": true, "sortOrder": 12 },
  { "key": "download_banner", "isEnabled": true, "sortOrder": 13 },
  { "key": "footer", "isEnabled": true, "sortOrder": 14 }
]
```

---

### 3.4 تفاصيل بيانات كل قسم (`sections`)

#### أ) شريط الامتثال العلوي (`compliance_ribbon` — `ComplianceRibbon.tsx`)
```json
{
  "isEnabled": true,
  "showZatcaText": true,
  "showHotline": true,
  "showPriceGuaranteePill": true,
  "priceGuaranteePill": {
    "ar": "تثبيت السعر الفوري 100%",
    "en": "100% Instant Price Guarantee"
  }
}
```

#### ب) الهيدر وقائمة التنقل (`header` — `Header.tsx`)
```json
{
  "brandTitleAr": "كـوا",
  "brandBadgeEn": "KOWA",
  "brandTaglineEn": "Smart Mobility & Fair Value",
  "showBrandTagline": true,
  "navLinks": [
    { "id": "home", "labelAr": "الرئيسية", "labelEn": "Home", "href": "#hero", "badge": null, "isEnabled": true, "sortOrder": 1 },
    { "id": "how-it-works", "labelAr": "كيف تعمل", "labelEn": "How It Works", "href": "#how-it-works", "badge": null, "isEnabled": true, "sortOrder": 2 },
    { "id": "categories", "labelAr": "فئات الأسطول", "labelEn": "Fleet Categories", "href": "#categories", "badge": null, "isEnabled": true, "sortOrder": 3 },
    {
      "id": "captain",
      "labelAr": "انضم ككابتن",
      "labelEn": "Drive with Us",
      "href": "#captain-earnings",
      "badge": { "ar": "أرباح 9,500+", "en": "Earn 9.5K+", "isEnabled": true },
      "isEnabled": true,
      "sortOrder": 4
    },
    { "id": "faq", "labelAr": "الأسئلة الشائعة", "labelEn": "FAQ", "href": "#faq", "badge": null, "isEnabled": true, "sortOrder": 5 },
    { "id": "contact", "labelAr": "تواصل معنا", "labelEn": "Contact Us", "href": "#contact", "badge": null, "isEnabled": true, "sortOrder": 6 }
  ],
  "ctaButton": {
    "isEnabled": true,
    "labelAr": "تحميل التطبيق",
    "labelEn": "Get the App",
    "mobileLabelAr": "تحميل التطبيق الآن",
    "mobileLabelEn": "Download the App Now",
    "href": "#download-banner"
  }
}
```

#### ج) الهيرو الرئيسي (`hero` — `HeroSection.tsx`)
```json
{
  "backgroundImageUrl": "/hero-bg-kowa.jpg",
  "backgroundAlt": { "ar": "سيارة كوا التنفيذية الفاخرة على طريق الرياض ليلاً", "en": "KOWA luxury executive vehicle gliding through Riyadh at night" },
  "mirrorBackgroundInLtr": true,
  "showAmbientParticles": true,
  "showOrbitalStreams": true,
  "kicker": {
    "ar": "المنصة الوطنية الرائدة للتنقل الذكي الفاخر بالمملكة",
    "en": "Saudi Arabia’s Leading Smart Luxury Mobility Platform"
  },
  "headline": {
    "leadAr": "ارتقِ بتجربة تنقلك..",
    "highlightAr": "فخامة استثنائية",
    "tailAr": "تليق بك",
    "leadEn": "Elevate Every Journey..",
    "highlightEn": "Exceptional Luxury",
    "tailEn": "Made for You"
  },
  "subtitle": {
    "ar": "أعد تعريف تنقلك اليومي في المملكة بسيارات فاخرة 2023+، كباتن سعوديين نخبة، وتتبع مسار فوري بدقة فائقة مع تسعيرة ثابتة 100% دون أي مفاجآت.",
    "en": "Redefine your daily mobility across the Kingdom with modern 2023+ executive vehicles..."
  },
  "primaryCta": { "labelAr": "احسب سعيرتك التقديرية", "labelEn": "Estimate Ride Fare", "href": "#fare-calculator", "isEnabled": true },
  "secondaryCta": { "labelAr": "حمّل التطبيق مجاناً", "labelEn": "Download Free App", "href": "#download-banner", "isEnabled": true },
  "scrollCue": { "labelAr": "احسب سعيرتك الآن", "labelEn": "Explore Instant Fare", "href": "#fare-calculator", "isEnabled": true },
  "trustStats": [
    { "id": "riders", "icon": "TrendingUp", "value": "+12,000", "labelAr": "عميل نشط", "labelEn": "Active Riders", "isEnabled": true },
    { "id": "fixed", "icon": "ShieldCheck", "value": "100%", "labelAr": "تسعيرة ثابتة", "labelEn": "Fixed Fares", "isEnabled": true },
    { "id": "rating", "icon": "Star", "value": "4.98", "labelAr": "تقييم الخدمة", "labelEn": "Avg Rating", "isEnabled": true }
  ]
}
```

#### د) حاسبة السعر التقديري ومعاينة المسار ونافذة التطبيق (`fare_calculator` — `FareCalculatorSection.tsx` + `AppRedirectModal.tsx`)
```json
{
  "badge": { "ar": "حاسبة السعر التقديري ومعاينة المسار", "en": "Smart Fare Estimator & Route Preview" },
  "headline": {
    "leadAr": "مشوارك القادم، بأعلى معايير الراحة وبأفضل",
    "highlightAr": "سعر ثابت",
    "leadEn": "Your next journey, peak comfort with a guaranteed",
    "highlightEn": "fixed fare"
  },
  "subtitle": {
    "ar": "وداعاً للتسعير المفاجئ أوقات الذروة. جرّب مسارات الرياض الشائعة...",
    "en": "Say goodbye to rush-hour surge multipliers..."
  },
  "consoleLabels": {
    "headerAr": "مُقدّر التكلفة ومعاينة المسار",
    "headerEn": "Route & Fare Estimator",
    "surgeLockAr": "تسعيرة محمية ضد الذروة",
    "surgeLockEn": "Zero Surge Lock",
    "presetsTitleAr": "وجهات سريعة شائعة في الرياض:",
    "presetsTitleEn": "Popular Riyadh Routes:",
    "savingsBadgeAr": "توفير ~18% عن تسعيرة الذروة",
    "savingsBadgeEn": "Saving ~18% vs peak surge",
    "finalFareLabelAr": "التكلفة التقديرية الثابتة في التطبيق",
    "finalFareLabelEn": "Estimated App Fixed Fare",
    "vatNoteAr": "(شامل الضريبة)",
    "vatNoteEn": "(Incl. VAT)",
    "ctaLabelAr": "اطلب رحلتك عبر التطبيق",
    "ctaLabelEn": "Request via KOWA App",
    "radarBadgeAr": "معاينة المسار والتوقيت التقديري",
    "radarBadgeEn": "Live App Route Preview",
    "previewBadgeAr": "معاينة فئة التطبيق",
    "previewBadgeEn": "App Class Preview"
  },
  "pricingEngine": {
    "currencyAr": "ر.س",
    "currencyEn": "SAR",
    "vatIncluded": true,
    "surgeSavingsPercent": 18,
    "allowCustomInput": true,
    "allowRouteSwap": true,
    "allowGpsLocate": true,
    "defaultVehicles": [
      {
        "id": "eco",
        "nameAr": "إيكو سمارت",
        "nameEn": "Eco Smart",
        "baseFare": 8.0,
        "perKmRate": 0.50,
        "minimumFare": 18.0,
        "displayFallbackPrice": "24.00",
        "isFavorite": false,
        "popularBadgeAr": null,
        "popularBadgeEn": null,
        "previewCaptain": {
          "nameAr": "كابتن خالد الدوسري",
          "nameEn": "Captain Khalid Al-Dosari",
          "plateAr": "ر ي ض 2048",
          "plateEn": "RYD 2048",
          "rating": "4.95",
          "arrivalMin": 2
        },
        "isEnabled": true,
        "sortOrder": 1
      },
      {
        "id": "comfort",
        "nameAr": "كومفورت",
        "nameEn": "Comfort",
        "baseFare": 12.0,
        "perKmRate": 0.6875,
        "minimumFare": 28.0,
        "displayFallbackPrice": "34.00",
        "isFavorite": true,
        "popularBadgeAr": "المفضل",
        "popularBadgeEn": "Top",
        "previewCaptain": {
          "nameAr": "كابتن فهد العتيبي",
          "nameEn": "Captain Fahad Al-Otaibi",
          "plateAr": "أ ب ج 4321",
          "plateEn": "ABC 4321",
          "rating": "4.98",
          "arrivalMin": 3
        },
        "isEnabled": true,
        "sortOrder": 2
      },
      {
        "id": "business",
        "nameAr": "بزنس VIP",
        "nameEn": "Business VIP",
        "baseFare": 22.0,
        "perKmRate": 1.25,
        "minimumFare": 55.0,
        "displayFallbackPrice": "62.00",
        "isFavorite": false,
        "popularBadgeAr": null,
        "popularBadgeEn": null,
        "previewCaptain": {
          "nameAr": "كابتن سعود القحطاني",
          "nameEn": "Captain Saud Al-Qahtani",
          "plateAr": "ف خ م 9001",
          "plateEn": "VIP 9001",
          "rating": "5.00",
          "arrivalMin": 4
        },
        "isEnabled": true,
        "sortOrder": 3
      }
    ]
  },
  "routePresets": [
    {
      "id": "kafd-airport",
      "labelAr": "المركز المالي ← المطار",
      "labelEn": "KAFD ← Airport T5",
      "pickupAr": "الرياض - المركز المالي (KAFD)",
      "pickupEn": "Riyadh - King Abdullah Financial District (KAFD)",
      "pickupCoords": { "lat": 24.7648, "lng": 46.6406 },
      "destAr": "مطار الملك خالد الدولي (صالة 5)",
      "destEn": "King Khalid International Airport (Terminal 5)",
      "destCoords": { "lat": 24.9576, "lng": 46.6988 },
      "km": 32,
      "etaMin": 24,
      "priceMultiplier": 1.0,
      "isEnabled": true,
      "sortOrder": 1
    }
  ],
  "trustStripItems": [
    { "icon": "CheckCircle", "ar": "لا رسوم إلغاء خلال أول 3 دقائق", "en": "Free cancellation within 3 mins" },
    { "icon": "CreditCard", "ar": "mada • Apple Pay • Visa • Mastercard", "en": "mada • Apple Pay • Visa • Mastercard" },
    { "icon": "Receipt", "ar": "فواتير ضريبية فورية ZATCA", "en": "Automated ZATCA E-Invoices" },
    { "icon": "ShieldCheck", "ar": "TGA #492/ن", "en": "TGA #492/N" }
  ],
  "appRedirectModal": {
    "titleAr": "أكمل طلبك عبر تطبيق كوا",
    "titleEn": "Request Your Ride in the KOWA App",
    "subtitleAr": "تتم طلبات الرحلات وتتبع الكابتن والدفع الآمن داخل التطبيق الرسمي فقط",
    "subtitleEn": "Ride dispatch, live captain GPS & payments happen inside the official mobile app",
    "promo": {
      "isEnabled": true,
      "code": "KOWA20",
      "textAr": "خصم 20% لأول 3 رحلات في التطبيق:",
      "textEn": "20% OFF first 3 app rides:"
    },
    "smsFallbackButtonAr": "إرسال رابط تحميل التطبيق برسالة SMS لجوالك",
    "smsFallbackButtonEn": "Send App Download Link via SMS"
  }
}
```

#### هـ) شريط الإحصائيات (`analytics_bar` — `AnalyticsBar.tsx`)
```json
{
  "items": [
    {
      "id": "users",
      "numericValue": 12000,
      "prefix": "+",
      "suffixAr": "",
      "suffixEn": "",
      "labelAr": "مستخدم مسجَّل",
      "labelEn": "Registered Users",
      "subtextAr": "في مختلف مناطق المملكة",
      "subtextEn": "Across the Kingdom",
      "badgeAr": "ثقة متنامية",
      "badgeEn": "Growing Trust",
      "icon": "Users",
      "isEnabled": true,
      "sortOrder": 1
    },
    {
      "id": "captains",
      "numericValue": 318,
      "prefix": "+",
      "suffixAr": "",
      "suffixEn": "",
      "labelAr": "سائق نشط ومعتمد",
      "labelEn": "Active Verified Captains",
      "subtextAr": "نخبة كباتن سعوديين",
      "subtextEn": "Elite Saudi Captains",
      "badgeAr": "فحص أمني 100%",
      "badgeEn": "100% Vetted",
      "icon": "ShieldCheck",
      "isEnabled": true,
      "sortOrder": 2
    },
    {
      "id": "eta",
      "numericValue": 12,
      "prefix": "",
      "suffixAr": " د",
      "suffixEn": " min",
      "labelAr": "متوسط وقت الوصول",
      "labelEn": "Average Arrival Time",
      "subtextAr": "دقة مواعيد وسرعة استجابة",
      "subtextEn": "Punctual & Responsive",
      "badgeAr": "استجابة سريعة",
      "badgeEn": "Fast Response",
      "icon": "Clock",
      "isEnabled": true,
      "sortOrder": 3
    }
  ]
}
```

#### و) كيف يعمل (`how_it_works` — `HowItWorks.tsx`)
```json
{
  "badge": { "ar": "خطوات سهلة وسريعة", "en": "Easy & Instant Steps" },
  "headline": { "leadAr": "ثلاث خطوات ذكية تفصلك عن", "highlightAr": "وجهتك القادمة", "leadEn": "Three Smart Steps to Your", "highlightEn": "Next Destination" },
  "subtitle": { "ar": "تجربة سلسة وفورية تبدأ من شاشة هاتفك وحتى وصولك آمناً ومستمتعاً، بدون أي تعقيد أو انتظار.", "en": "A seamless, frictionless experience starting from your phone screen to your safe, comfortable arrival." },
  "steps": [
    {
      "stepNumber": "01",
      "icon": "Smartphone",
      "badgeAr": "تحميل فوري",
      "badgeEn": "Instant App",
      "titleAr": "حمّل التطبيق في ثوانٍ",
      "titleEn": "Download the App in Seconds",
      "descriptionAr": "متوفر مجاناً على منصتي App Store و Google Play. تسجيل سريع وموثق برقم الجوال أو النفاذ الوطني في أقل من دقيقة.",
      "descriptionEn": "Available for free on the App Store and Google Play...",
      "featureTextAr": "متوافق مع iOS وأندرويد",
      "featureTextEn": "iOS & Android Ready",
      "highlightAr": "App Store • Google Play",
      "highlightEn": "App Store • Google Play",
      "isEnabled": true,
      "sortOrder": 1
    }
  ],
  "footerPromo": {
    "isEnabled": true,
    "titleAr": "جاهز للانطلاق بأول مشوار؟",
    "titleEn": "Ready for Your First Ride?",
    "subtitleAr": "استخدم كود KOWA20 للحصول على خصم 20% على أول ثلاث رحلات",
    "subtitleEn": "Use promo code KOWA20 for 20% OFF on your first 3 rides",
    "ctaLabelAr": "تحميل التطبيق الآن",
    "ctaLabelEn": "Get the App Now",
    "ctaHref": "#download-banner"
  }
}
```

#### ز) ميثاق كوا / القيم (`value_pillars` — `ValuePillars.tsx`)
```json
{
  "badge": { "ar": "ميثاق كوا للتنقل", "en": "The KOWA Mobility Charter" },
  "headline": { "ar": "لماذا يختار عملاء المملكة كوا بديلاً ذكياً؟", "en": "Why Commuters Across KSA Choose KOWA" },
  "subtitle": { "ar": "بنينا كوا لتقديم معادلة واضحة: أعلى مستويات الجودة والنظافة...", "en": "Built to deliver a straightforward promise..." },
  "pillars": [
    {
      "id": 1,
      "icon": "DollarSign",
      "badgeStyle": "lime",
      "titleAr": "لا تسعير مفاجئ في الذروة",
      "titleEn": "Zero Surge Pricing in Rush Hours",
      "badgeAr": "سعر عادل",
      "badgeEn": "Fair Fare",
      "descriptionAr": "...",
      "descriptionEn": "...",
      "featureTextAr": "ضمان السعر الثابت 100%",
      "featureTextEn": "100% Fixed Fare Guarantee",
      "featureIcon": "CheckCircle",
      "isEnabled": true,
      "sortOrder": 1
    }
  ]
}
```

#### ح) فئات الأسطول (`fleet_categories` — `FleetCategories.tsx` + `src/data/translations.ts`)
```json
{
  "badge": { "ar": "الفئات والأسطول", "en": "Fleet & Categories" },
  "headline": { "ar": "اختر الفئة التي تناسب مشوارك بدقة", "en": "Select the Tailored Class for Your Ride" },
  "subtitle": { "ar": "خيارات مرنة ومحددة تلبي مشاويرك السريعة...", "en": "Flexible tailored options..." },
  "defaultActiveCategoryId": "comfort",
  "ctaButton": { "labelAr": "احسب تسعيرة هذه الفئة", "labelEn": "Estimate This Class", "href": "#fare-calculator" },
  "categories": [
    {
      "id": "eco",
      "tabLabelAr": "إيكو",
      "tabLabelEn": "ECO",
      "badge": { "ar": "اقتصادي ذكي", "en": "Smart Economy" },
      "vehicles": { "ar": "ياريس 2024 • أكسنت • نيسان صني", "en": "Yaris 2024 • Accent • Sunny" },
      "title": { "ar": "كوا إيكو (KOWA Eco)", "en": "KOWA Eco" },
      "desc": { "ar": "...", "en": "..." },
      "capacity": { "ar": "4 ركاب + 1 حقيبة", "en": "4 Passengers + 1 Luggage" },
      "eta": { "ar": "3 - 5 دقائق", "en": "3 - 5 mins" },
      "feature": { "ar": "مكيفة 100% وشاحن", "en": "AC & Fast USB" },
      "startingPriceNumeric": 18.00,
      "priceDisplay": { "ar": "18.00 ر.س", "en": "18.00 SAR" },
      "carName": "Toyota Yaris / Hyundai Accent 2024",
      "modelYearBadge": "2024 MODEL",
      "inspectionBadge": { "ar": "فحص جودة أسبوعي معتمد", "en": "Certified Weekly Inspection" },
      "imageUrl": "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80",
      "isEnabled": true,
      "sortOrder": 1
    }
  ]
}
```
*(يشمل كامل الفئات الأربع: `eco`, `comfort`, `business`, `family` ويمكن إضافة فئات جديدة من الباك اند).*

#### ط) تجربة التطبيق والتكنولوجيا (`app_experience` — `AppExperience.tsx`)
```json
{
  "badge": { "ar": "التكنولوجيا والراحة", "en": "Technology & Comfort" },
  "headline": { "ar": "تجربة رقمية مصممة للسرعة والأمان المالي المطلق", "en": "A Digital Mobility Platform Engineered for Speed and Financial Peace" },
  "subtitle": { "ar": "صُمم تطبيق كوا وفق أحدث معايير التكنولوجيا الفن تك والنقل الذكي...", "en": "Built with the highest fintech standards..." },
  "features": [
    {
      "id": "payment",
      "icon": "Wallet",
      "titleAr": "دفع فوري بلمسة واحدة عبر مدى و Apple Pay",
      "titleEn": "Instant One-Touch Payment via mada & Apple Pay",
      "descAr": "...",
      "descEn": "...",
      "isEnabled": true,
      "sortOrder": 1
    }
  ],
  "phoneMockupDemo": {
    "mapImageUrl": "https://lh3.googleusercontent.com/...",
    "statusTextAr": "الكابتن يقترب",
    "statusTextEn": "Captain approaching",
    "etaBadge": "3 MIN",
    "destinationPinAr": "KAFD الوجهة",
    "destinationPinEn": "Destination KAFD",
    "captainInitials": "ف.ع",
    "captainNameAr": "كابتن فهد العتيبي",
    "captainNameEn": "Captain Fahad",
    "vehicleTextAr": "كامري 2024 • أ ب ج 4321",
    "vehicleTextEn": "Camry 2024 • ABC 4321",
    "paymentMethod": "Apple Pay",
    "fixedFareDisplay": "28.00 SAR",
    "shareButtonAr": "مشاركة مسار الرحلة الحية",
    "shareButtonEn": "Share Live Trip Coordinates"
  }
}
```

#### ي) حاسبة أرباح الكابتن وشروط الانضمام (`captain_earnings` — `CaptainEarnings.tsx` + `CaptainModal.tsx`)
```json
{
  "badge": { "ar": "كباتن المملكة", "en": "Captains of Saudi Arabia" },
  "headline": { "ar": "قد بأمان مع كوا وحقق دخلاً شهرياً مرناً ومجزياً", "en": "Drive with KOWA & Unlock Flexible, High-Yield Monthly Earnings" },
  "subtitle": { "ar": "كن سيد وقتك. انضم إلى الآلاف من الكباتن السعوديين...", "en": "Be your own boss..." },
  "highlights": [
    { "icon": "Percent", "titleAr": "أقل عمولة منصة 15%", "titleEn": "Lowest 15% Platform Take", "descAr": "احتفظ بأكبر قدر من أرباحك", "descEn": "Keep max trip earnings" },
    { "icon": "Banknote", "titleAr": "إيداع بنكي يومي", "titleEn": "Daily Direct Deposit", "descAr": "أرباحك بحسابك دون تأخير", "descEn": "Immediate earnings transfer" }
  ],
  "primaryCta": { "labelAr": "سجل ككابتن الآن", "labelEn": "Apply as Captain Now" },
  "criteriaCta": { "labelAr": "معايير القبول والسيارات", "labelEn": "Requirements & Eligibility" },
  "calculator": {
    "titleAr": "حاسبة الدخل الصافي التقديري",
    "titleEn": "Net Earnings Calculator",
    "benchmarkBadgeAr": "بناءً على مشاوير الرياض",
    "benchmarkBadgeEn": "Riyadh Benchmarks",
    "hourlyNetRate": 48,
    "platformCommissionPercent": 15,
    "weeklyToMonthlyMultiplier": 4.3,
    "hoursSlider": { "min": 2, "max": 12, "default": 6 },
    "daysSlider": { "min": 1, "max": 7, "default": 5 },
    "disclaimerAr": "* الحساب تقديري صافي بعد استقطاع تكلفة الوقود وعمولة المنصة 15%، ويتفاوت بحسب الحوافز وساعات الذروة.",
    "disclaimerEn": "* Net estimates account for fuel expenses and the 15% platform fee; actual earnings may vary with incentives."
  },
  "criteriaModal": {
    "titleAr": "شروط التسجيل ومعايير المركبات",
    "titleEn": "Captain & Vehicle Criteria",
    "subtitleAr": "وفق اللائحة المعتمدة من الهيئة العامة للنقل (TGA)",
    "subtitleEn": "In compliance with TGA Saudi Transport regulations",
    "captainRequirements": [
      { "ar": "أن يكون المتقدم سعودي الجنسية (حصر التوجيه للسعوديين)", "en": "Saudi National (mandatory regulatory requirement)", "sortOrder": 1 }
    ],
    "vehicleStandards": [
      { "labelAr": "سنة الصنع الأدنى:", "labelEn": "Minimum Model Year:", "valueAr": "2020 أو أحدث", "valueEn": "2020 or newer", "isHighlighted": true, "sortOrder": 1 }
    ],
    "ctaLabelAr": "فهمت الشروط، الذهاب لنموذج التسجيل",
    "ctaLabelEn": "Understood, Proceed to Registration"
  }
}
```

#### ك) الأسئلة الشائعة وبطاقة الدعم (`faq` — `FAQSection.tsx`)
```json
{
  "badge": { "ar": "الأسئلة الشائعة • إجابات فورية", "en": "FAQ • Instant Answers" },
  "headline": { "leadAr": "إجابات واضحة لجميع", "highlightAr": "استفساراتك", "leadEn": "Clear Answers to All Your", "highlightEn": "Questions" },
  "subtitle": { "ar": "كل ما تحتاج لمعرفته عن خدمات كوا، معايير الأمان، وضمانات الجودة والتسعيرة العادلة.", "en": "Everything you need to know..." },
  "items": [
    {
      "id": 1,
      "categoryAr": "طلب الرحلات",
      "categoryEn": "Booking Rides",
      "questionAr": "كيف أطلب رحلتي الأولى مع كوا بكل سهولة؟",
      "questionEn": "How do I easily book my first ride with KOWA?",
      "answerAr": "...",
      "answerEn": "...",
      "isDefaultOpen": true,
      "isEnabled": true,
      "sortOrder": 1
    }
  ],
  "supportCard": {
    "isEnabled": true,
    "badgeAr": "مركز المساعدة المباشر 24/7",
    "badgeEn": "24/7 Live Support",
    "titleAr": "هل لديك استفسار آخر لم تجده هنا؟",
    "titleEn": "Have Another Question Not Listed?",
    "subtitleAr": "فريق خدمة عملاء كوا متواجد على مدار الساعة لخدمتك...",
    "subtitleEn": "Our dedicated customer service team is on standby 24/7...",
    "metrics": [
      { "icon": "Clock", "valueAr": "أقل من دقيقتين", "valueEn": "Under 2 Minutes", "labelAr": "متوسط سرعة الرد المباشر", "labelEn": "Average response speed" },
      { "icon": "ShieldCheck", "valueAr": "100% كادر محلي متخصص", "valueEn": "100% Dedicated Support", "labelAr": "فريق دعم ومتابعة رحلات على مدار الساعة", "labelEn": "24/7 trip monitoring team" }
    ],
    "primaryCtaAr": "تواصل مع الدعم الفني",
    "primaryCtaEn": "Contact Support",
    "whatsappLabelAr": "واتساب",
    "whatsappLabelEn": "WhatsApp"
  }
}
```

#### ل) قسم التواصل وقائمة المواضيع (`contact` — `ContactSection.tsx`)
```json
{
  "badge": { "ar": "معلومات التواصل المعتمدة", "en": "Official Contact Information" },
  "headline": { "ar": "فريقنا في خدمتك دائماً على مدار الساعة", "en": "Our Team is Always at Your Service 24/7" },
  "subtitle": { "ar": "نسعد بالإجابة عن استفساراتك واستقبال مقترحاتك...", "en": "We look forward to addressing your inquiries..." },
  "emailSlaNote": { "ar": "رد فوري خلال أقل من 24 ساعة", "en": "Average response within 24 hours" },
  "whatsappNote": { "ar": "محادثة سريعة مع مسؤولي خدمة الركاب", "en": "Direct chat with passenger care agents" },
  "hotlineNote": { "ar": "متاح 24 ساعة طوال أيام الأسبوع", "en": "Available 24/7 across the Kingdom" },
  "workingHours": {
    "titleAr": "أوقات العمل الميداني وغرفة العمليات:",
    "titleEn": "Operations Control Room:",
    "textAr": "خدمة الركاب والرحلات متوفرة 24/7 دون انقطاع",
    "textEn": "24/7 uninterrupted fleet operations"
  },
  "form": {
    "titleAr": "أرسل لنا استفسارك أو طلبك",
    "titleEn": "Send us a Direct Message",
    "subtitleAr": "سيصل طلبك مباشرة إلى القسم المختص وسيتواصل معك أحد ممثلي كوا بأسرع وقت.",
    "subtitleEn": "Your inquiry will be routed immediately to our specialized department.",
    "subjects": [
      { "id": "general", "valueAr": "استفسار عام", "valueEn": "General Inquiry", "routeEmail": "support@kowa.sa", "isEnabled": true, "sortOrder": 1 },
      { "id": "captain", "valueAr": "انضمام كابتن", "valueEn": "Captain Onboarding", "routeEmail": "captains@kowa.sa", "isEnabled": true, "sortOrder": 2 },
      { "id": "corporate", "valueAr": "حسابات شركات ووفود", "valueEn": "Corporate Mobility", "routeEmail": "corporate@kowa.sa", "isEnabled": true, "sortOrder": 3 },
      { "id": "feedback", "valueAr": "شكوى أو مقترح", "valueEn": "Feedback & Complaints", "routeEmail": "care@kowa.sa", "isEnabled": true, "sortOrder": 4 }
    ]
  }
}
```

#### م) بانر تحميل التطبيق (`download_banner` — `DownloadBanner.tsx`)
```json
{
  "badge": { "taglineAr": "تنقل أذكى.. أسرع.. وأكثر راحة", "taglineEn": "Smarter, Faster, Peak Comfort", "promoAr": "خصم 20% كود KOWA20", "promoEn": "20% OFF Code KOWA20" },
  "headline": { "ar": "جاهز لتجربة تنقل استثنائية لم تعهدها من قبل؟", "en": "Ready for an Exceptional Mobility Experience?" },
  "subtitle": { "ar": "انضم إلى آلاف المستخدمين الذين يثقون في كوا يومياً...", "en": "Join thousands of daily commuters trusting KOWA..." },
  "smsForm": {
    "isEnabled": true,
    "countryCode": "+966",
    "placeholder": "5XXXXXXXX",
    "buttonAr": "إرسال الرابط SMS",
    "buttonEn": "Send SMS Link",
    "successAr": "تم إرسال رابط تحميل كوا بنجاح عبر رسالة نصية SMS إلى هاتفك!",
    "successEn": "KOWA app download link has been sent via SMS to your phone!"
  },
  "qrBox": {
    "isEnabled": true,
    "titleAr": "امسح الكود بكاميرا الجوال",
    "titleEn": "Scan with your Phone Camera",
    "subtitleAr": "لتحميل التطبيق مباشرة على أي هاتف",
    "subtitleEn": "To download the app directly on any device"
  }
}
```

#### ن) الفوتر والصفحات القانونية (`footer` — `Footer.tsx`)
```json
{
  "servicesColumn": {
    "titleAr": "خدمات المشاوير",
    "titleEn": "Passenger Rides",
    "links": [
      { "labelAr": "مشاوير داخل المدينة الفورية", "labelEn": "Instant City Commutes", "href": "#fare-calculator", "isEnabled": true, "sortOrder": 1 },
      { "labelAr": "استقبال صالات المطارات التنفيذية", "labelEn": "Executive Airport Meet & Greet", "href": "#categories", "isEnabled": true, "sortOrder": 2 },
      { "labelAr": "رحلات مباشرة بين المدن", "labelEn": "Direct Intercity Trips", "href": "#categories", "isEnabled": true, "sortOrder": 3 },
      { "labelAr": "خدمة سائق خاص بالساعة", "labelEn": "Hourly Private Chauffeur", "href": "#fare-calculator", "isEnabled": true, "sortOrder": 4 },
      { "labelAr": "بزنس VIP ورجال الأعمال", "labelEn": "Business VIP & Diplomats", "href": "#categories", "isEnabled": true, "sortOrder": 5 }
    ]
  },
  "businessColumn": {
    "titleAr": "الأعمال والكباتن",
    "titleEn": "Business & Captains",
    "links": [
      { "labelAr": "التسجيل ككابتن سعودي", "labelEn": "Register as a Captain", "href": "#captain-earnings", "isEnabled": true, "sortOrder": 1 },
      { "labelAr": "حاسبة أرباح الكابتن اليومية", "labelEn": "Captain Daily Earnings Estimator", "href": "#captain-earnings", "isEnabled": true, "sortOrder": 2 },
      { "labelAr": "حلول KOWA للشركات والوفود", "labelEn": "Corporate Mobility Programs", "href": "#contact", "isEnabled": true, "sortOrder": 3 },
      { "labelAr": "إدارة حسابات منسوبي الشركات", "labelEn": "Employee Travel Accounts", "href": "#contact", "isEnabled": true, "sortOrder": 4 },
      { "labelAr": "ميثاق السلامة وجودة الأسطول", "labelEn": "Fleet Safety & Hygiene Charter", "href": "#value-pillars", "isEnabled": true, "sortOrder": 5 }
    ]
  },
  "legalLinks": [
    { "slug": "terms", "labelAr": "الشروط والأحكام", "labelEn": "Terms & Conditions", "href": "/legal/terms", "isEnabled": true, "sortOrder": 1 },
    { "slug": "privacy", "labelAr": "سياسة الخصوصية", "labelEn": "Privacy Policy", "href": "/legal/privacy", "isEnabled": true, "sortOrder": 2 },
    { "slug": "passenger-rights", "labelAr": "حقوق الراكب", "labelEn": "Passenger Rights", "href": "/legal/passenger-rights", "isEnabled": true, "sortOrder": 3 },
    { "slug": "contact", "labelAr": "تواصل معنا", "labelEn": "Contact Us", "href": "#contact", "isEnabled": true, "sortOrder": 4 }
  ],
  "socialCardNote": {
    "ar": "للاستفسارات والشكاوى ومتابعة الرحلات عبر منصة X وواتساب",
    "en": "Customer inquiries & trip tracking available on X and WhatsApp"
  },
  "copyright": {
    "ar": "جميع الحقوق محفوظة © {{year}} لمنصة كوا للتنقل الذكي ({{fullCompanyName}}). المملكة العربية السعودية.",
    "en": "All rights reserved © {{year}} {{fullCompanyName}}. Kingdom of Saudi Arabia."
  }
}
```

---

## 4. الوظائف التفاعلية (Functional & Interactive Public Endpoints)

### 4.1 نموذج التواصل وانضمام الكباتن والشركات (`POST /api/v1/public/contact`)
- **الغرض:** يحل محل `src/app/api/contact/route.ts` المعتمد على Resend فقط، بحيث يحفظ الرسائل في قاعدة البيانات (Inbox/CRM)، يوجه البريد حسب `subjectId`، ويرجع معرّف التذكرة للمستخدم.
- **Request Body:**
```json
{
  "name": "محمد بن سعد",
  "phone": "+966551234567",
  "email": "name@example.com",
  "subjectId": "captain",
  "subjectLabel": "انضمام كابتن",
  "message": "أرغب بالانضمام ككابتن بسيارتي كامري 2024",
  "locale": "ar"
}
```
- **Validation:** `name` >= 2 chars، `email` valid regex، `phone` >= 8 digits، `message` >= 5 chars.
- **Response (`201 Created`):**
```json
{
  "success": true,
  "message": "تم استلام رسالتك بنجاح! سيقوم فريق خدمة عملاء كوا بالرد عليك خلال دقائق.",
  "data": { "ticketId": "KW-MSG-10482", "status": "new" }
}
```

### 4.2 إرسال رابط تحميل التطبيق برسالة SMS (`POST /api/v1/public/app-links/send-sms`)
- **الغرض:** استبدال المحاكاة في `DownloadBanner.tsx` بإرسال حقيقي لرسالة SMS تحتوي رابط التحميل الذكي (Smart App Link يوجه تلقائياً لـ App Store أو Google Play حسب جهاز المستخدم) عبر مزود SMS سعودي (مثل Unifonic أو Taqnyat).
- **Request Body:** `{ "countryCode": "+966", "phone": "551234567", "locale": "ar" }`
- **Validation & Security:** التحقق من `^5[0-9]{8}$` + **Rate Limit صارم** (مثلاً بحد أقصى 3 طلبات لنفس الرقم أو IP كل 15 دقيقة).

### 4.3 تحديد الموقع وحساب المسار والتسعيرة التقديرية (Smart Estimator APIs)
لتطوير `FareCalculatorSection.tsx` من قيم ثابتة إلى حساب فعلي حقيقي:

1. **البحث عن المعالم والأحياء (`GET /api/v1/public/locations/search?q=المطار&locale=ar&limit=8`):**
   - يبحث في جدول المعالم السعودية المخزن في الباك اند (أو Proxy لخدمة خرائط مثل Google Places / Nominatim) ويرجع:
   ```json
   {
     "data": [
       { "id": "ruh-airport-t5", "nameAr": "مطار الملك خالد الدولي (صالة 5)", "nameEn": "King Khalid Int. Airport (T5)", "cityAr": "الرياض", "lat": 24.9576, "lng": 46.6988 }
     ]
   }
   ```
2. **عكس الإحداثيات عند ضغط زر GPS (`GET /api/v1/public/locations/reverse-geocode?lat=24.7648&lng=46.6406&locale=ar`):**
   - يحوّل إحداثيات `navigator.geolocation` إلى اسم الحي والمدينة الفعلي في المملكة.
3. **حساب التكلفة التقديرية الفعلي (`POST /api/v1/public/trips/estimate-fare`):**
   - **Request:** `{ "pickupCoords": { "lat": 24.7648, "lng": 46.6406 }, "destCoords": { "lat": 24.9576, "lng": 46.6988 }, "locale": "ar" }`
   - **Logic:** يحسب المسافة (`distanceKm`) والزمن المقدر (`etaMin`) ويطبق تسعيرة كل فئة من قاعدة البيانات (`Math.max(minimumFare, baseFare + distanceKm * perKmRate)`).
   - **Response:**
   ```json
   {
     "data": {
       "distanceKm": 32.4,
       "etaMin": 24,
       "currencyAr": "ر.س",
       "currencyEn": "SAR",
       "estimates": [
         { "vehicleId": "eco", "price": "24.00", "arrivalMin": 2 },
         { "vehicleId": "comfort", "price": "34.00", "arrivalMin": 3 },
         { "vehicleId": "business", "price": "62.00", "arrivalMin": 4 }
       ]
     }
   }
   ```

### 4.4 الصفحات القانونية والمحتوى النصي (`GET /api/v1/public/pages/:slug`)
- **Slugs:** `terms`, `privacy`, `passenger-rights` (قابلة لإضافة صفحات أخرى مثل `about`).
- **Response:** `{ "slug": "privacy", "titleAr": "سياسة الخصوصية", "titleEn": "Privacy Policy", "contentMarkdownAr": "...", "contentMarkdownEn": "...", "updatedAt": "..." }`.

---

## 5. نقاط تحكم لوحة الأدمن الكاملة (Admin Panel CRUD Endpoints)

جميع المسارات التالية محمية بـ `Authorization: Bearer <token>` وتحدّث قاعدة البيانات + تطلق Revalidation Webhook فور الحفظ:

### 5.1 الإعدادات والهوية والترتيب
| Method | Endpoint | الوظيفة |
| :--- | :--- | :--- |
| `GET / PUT` | `/api/v1/admin/settings` | تعديل `defaultLocale`, `defaultTheme`, `featureFlags`, `themeTokens` (الألوان) |
| `GET / PUT` | `/api/v1/admin/seo` | تعديل جميع وسوم الميتا والكلمات المفتاحية وصورة المشاركة |
| `GET / PUT` | `/api/v1/admin/company` | تعديل بيانات الشركة، العنوان، التراخيص (`TGA`, `ZATCA`)، أرقام التواصل، وروابط المتاجر |
| `PUT` | `/api/v1/admin/sections/order` | إعادة ترتيب السكاشن وتفعيل/إخفاء أي سكشن (`isEnabled`, `sortOrder`) |
| `GET / PUT` | `/api/v1/admin/sections/:sectionKey` | تعديل نصوص وصور وإعدادات أي سكشن (بما في ذلك معادلات حاسبة الأرباح وشروط الكابتن ومحتوى Hero و AppExperience و DownloadBanner) |

### 5.2 القوائم الديناميكية (Collections CRUD)
*(كل جدول يدعم `GET` قائمة، `POST` إنشاء، `PUT /:id` تعديل، `DELETE /:id` حذف، و`PATCH /reorder` لإعادة الترتيب)*:
- `/api/v1/admin/nav-links` (روابط النافبار + شارة الأرباح)
- `/api/v1/admin/socials` (منصات التواصل الاجتماعي)
- `/api/v1/admin/analytics-stats` (مؤشرات شريط الإحصائيات)
- `/api/v1/admin/how-it-works/steps` (خطوات كيف يعمل)
- `/api/v1/admin/value-pillars` (ركائز ميثاق كوا)
- `/api/v1/admin/fleet-categories` (فئات الأسطول والصور والمواصفات والأسعار)
- `/api/v1/admin/fare-calculator/vehicles` (تسعيرات الفئات في الحاسبة وبروفايلات الكباتن المعاينة)
- `/api/v1/admin/fare-calculator/presets` (المسارات الجاهزة في الرياض ومدن المملكة)
- `/api/v1/admin/locations` (قاعدة بيانات المعالم والأحياء للبحث التلقائي)
- `/api/v1/admin/faqs` (الأسئلة الشائعة وتصنيفاتها)
- `/api/v1/admin/pages` (الصفحات القانونية: الشروط، الخصوصية، حقوق الراكب)
- `/api/v1/admin/contact-subjects` (مواضيع نموذج التواصل وإيميل التوجيه لكل موضوع)

### 5.3 إدارة الوسائط والصور (Media Library)
| Method | Endpoint | الوظيفة |
| :--- | :--- | :--- |
| `POST` | `/api/v1/admin/media/upload` | رفع صورة أو SVG (`multipart/form-data`: `hero`, `fleet`, `logos`, `general`) وإرجاع الرابط العام `url` وأبعاد الصورة |
| `GET` | `/api/v1/admin/media` | استعراض كافة الصور والملفات المرفوعة مع إمكانية البحث والتصفية |
| `DELETE` | `/api/v1/admin/media/:id` | حذف ملف من التخزين (S3 / Cloudflare R2 / Local Storage) |

### 5.4 إدارة الرسائل وسجلات التشغيل (CRM / Operations)
| Method | Endpoint | الوظيفة |
| :--- | :--- | :--- |
| `GET` | `/api/v1/admin/contact-submissions` | استعراض رسائل التواصل وطلبات انضمام الكباتن والشركات (تصفية حسب `status`, `subjectId`, بحث، Pagination) |
| `PATCH` | `/api/v1/admin/contact-submissions/:id` | تحديث حالة الطلب (`new`, `in_progress`, `resolved`, `archived`) وإضافة ملاحظات داخلية |
| `GET` | `/api/v1/admin/sms-logs` | سجل محاولات إرسال روابط التحميل عبر SMS (لمراقبة الاستهلاك والحماية) |

---

## 6. ملخص جداول قاعدة البيانات المقترحة (Database Schema Summary)

1. `site_settings` (Key-Value JSONB أو أعمدة مهيكلة لـ `themeTokens`, `featureFlags`, `seo`, `company`, `appStores`)
2. `sections_config` (`key` PK, `is_enabled`, `sort_order`, `content_ar` JSONB, `content_en` JSONB, `media_assets` JSONB, `config` JSONB, `updated_at`)
3. `fleet_categories` (`id`, `slug`, `tab_label_ar`, `tab_label_en`, `title_ar`, `title_en`, `desc_ar`, `desc_en`, `price_starting`, `base_fare`, `per_km_rate`, `minimum_fare`, `image_url`, `specs` JSONB, `is_enabled`, `sort_order`)
4. `route_presets` & `saudi_locations` (للمسارات السريعة والبحث التلقائي بالإحداثيات `lat`, `lng`)
5. `faq_items`, `analytics_stats`, `value_pillars`, `how_it_works_steps`, `social_links`, `nav_links`
6. `legal_pages` (`slug` PK, `title_ar`, `title_en`, `content_ar`, `content_en`, `is_enabled`, `updated_at`)
7. `contact_subjects` & `contact_submissions` (`id`, `ticket_code`, `name`, `phone`, `email`, `subject_id`, `message`, `status`, `notes`, `created_at`)
8. `sms_dispatch_logs` (`id`, `phone`, `ip_address`, `provider_message_id`, `status`, `created_at`)
9. `media_assets` (`id`, `filename`, `url`, `mime_type`, `size_bytes`, `folder`, `created_at`)
10. `admin_users` & `audit_logs` (لتتبع من عدّل ماذا ومتى في لوحة التحكم)

---

## 7. متغيرات البيئة المطلوبة (Environment Variables Reference)
```env
# Next.js Frontend
NEXT_PUBLIC_API_BASE_URL=https://api.kowa.sa/api/v1
REVALIDATE_SECRET=your_strong_webhook_secret

# Backend Services
DATABASE_URL=postgresql://...
JWT_SECRET=...
RESEND_API_KEY=...
SMS_PROVIDER_API_KEY=...   # e.g., Unifonic / Taqnyat
STORAGE_S3_BUCKET=...      # For Media Upload
FRONTEND_REVALIDATE_URL=https://kowa.sa/api/revalidate
```
