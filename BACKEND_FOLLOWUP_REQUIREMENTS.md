# Website CMS — Frontend Review & Missing Requirements (`feat/website-cms`)

تحية طيبة لفريق الـ Backend،  
تمت مراجعة دليل الـ API الخاص بفرع **`feat/website-cms`** ومطابقته مع كامل مكونات الموقع في الـ Frontend (`Next.js`). البنية الأساسية لـ `/website/config` و`/website/contact` و`/website/app-link/sms` وإدارة الكتل والصور ممتازة ومتوافقة مع معمارية الموقع.

لإتمام **التحكم الكامل** في الموقع والبدء فوراً في الربط (Frontend Integration)، نحتاج منكم النقاط والتوضيحات التالية:

---

## 1. إضافة الحقول والبلوكات الناقصة

### أ) محتوى الصفحات القانونية (`الشروط والأحكام`، `سياسة الخصوصية`، `حقوق الراكب`)
حالياً يوجد في `footer` روابط `legalLinks[]`، لكن لا يوجد مصدر لنصوص هذه الصفحات لتعديلها من لوحة التحكم.  
**المطلوب أحد الحلين:**
- إضافة endpoint خاص بالصفحات: `GET /website/pages/:slug` (حيث `slug` = `terms` | `privacy` | `passenger-rights`) مع حقول `title: { ar, en }` و `content: { ar, en }` و `updatedAt` و Admin CRUD لها.
- **أو** إضافتها كـ 3 blocks داخل CMS (`legal_terms`, `legal_privacy`, `legal_passenger_rights`) متاحة عبر `GET /website/sections/:key`.

---

### ب) بيانات إضافية ناقصة في البلوكات الحالية

1. **في بلوك `app_experience`:**
   الجدول الحالي يذكر `badge, headline, subtitle, features[]` فقط، لكن القسم في الفرونت اند يحتوي أيضاً على **موك آب جوال تفاعلي (`phoneMockupDemo`)** نحتاج التحكم فيه من الباك اند:
   ```json
   "phoneMockupDemo": {
     "mapImage": { "url": "...", "alt": { "ar": "...", "en": "..." } },
     "statusText": { "ar": "الكابتن يقترب", "en": "Captain approaching" },
     "etaBadge": "3 MIN",
     "destinationPin": { "ar": "KAFD الوجهة", "en": "Destination KAFD" },
     "captainInitials": "ف.ع",
     "captainName": { "ar": "كابتن فهد العتيبي", "en": "Captain Fahad" },
     "vehicleText": { "ar": "كامري 2024 • أ ب ج 4321", "en": "Camry 2024 • ABC 4321" },
     "captainPhone": "920000000",
     "paymentMethod": "Apple Pay",
     "fixedFareDisplay": "28.00 SAR",
     "shareButtonLabel": { "ar": "مشاركة مسار الرحلة الحية", "en": "Share Live Trip Coordinates" },
     "shareCopiedLabel": { "ar": "تم نسخ رابط التتبع بنجاح!", "en": "Tracking Link Copied!" }
   }
   ```

2. **في بلوك `site` و `platform`:**
   يُرجى إضافة الحقول التالية المستخدمة في الهيدر وشريط الامتثال والفوتر:
   - `site.company.fullName`: `{ "ar": "شركة كوا لتقنية المعلومات والنقل البري الذكي", "en": "KOWA Smart Transportation & IT Co." }`
   - `site.company.slogan`: `{ "ar": "...", "en": "..." }`
   - `site.company.about`: `{ "ar": "...", "en": "..." }`
   - `site.company.zatcaLabel`: `{ "ar": "فواتير إلكترونية متوافقة كلياً مع هيئة الزكاة والضريبة والجمارك (ZATCA)", "en": "Fully compliant with ZATCA E-Invoicing regulations" }`
   - `platform.hotline`: `"8005692"` و `platform.hotlineDisplay`: `"800-KOWA (5692)"` (منفصلة عن `phone` و `whatsapp`).
   - `platform.headerLogoUrl` (أيقونة كوا في النافبار) بجانب `siteLogoUrl`.

3. **في `download_banner.qrBox` و `fare_calculator.appRedirectModal`:**
   - إضافة حقل `qrTargetUrl` (رابط التحميل الذكي الذي يُحوّل تلقائياً للمتجر المناسب لتوليد QR Code حقيقي في الفرونت اند) أو `qrImageUrl` (صورة QR مرفوعة عبر Cloudinary).

4. **في بلوك `hero`:**
   - إضافة خيارات التحكم البصري في البلوك (أو داخل `content`):
     - `mirrorBackgroundInLtr` (`boolean`, default `true`)
     - `showAmbientParticles` (`boolean`, default `true`)
     - `showOrbitalStreams` (`boolean`, default `true`)

5. **في بلوك `compliance_ribbon`:**
   - دعم إظهار/إخفاء عناصر الشريط بشكل مستقل (`showZatcaText`, `showHotline`, `showPriceGuarantee`) بجانب نص `priceGuarantee`.

---

### ج) التحكم في الألوان، الثيم، ومفاتيح الوظائف (`site.settings` / `featureFlags`)
لتحقيق التحكم الشامل من الداشبورد بدون تعديل كود الفرونت اند، يُفضل إضافة كائن إعدادات عام داخل `site` (أو في جذر `GET /website/config`):

```json
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
    "enableSmsAppLink": true,
    "maintenanceMode": false,
    "maintenanceMessage": { "ar": "...", "en": "..." }
  },
  "themeTokens": {
    "brandPrimary": "#1F0F8C",
    "brandDark": "#140959",
    "brandLimeAccent": "#D3D93C",
    "darkCanvas": "#0A0F1D",
    "darkCard": "#10182C",
    "darkElevated": "#17223C",
    "darkPrimarySolid": "#634EEB"
  }
}
```

---

## 2. مطلوب للبدء بالربط: عينة JSON الكاملة (Full Seed Payload)

الدليل الحالي يعرض أمثلة JSON كاملة لـ `hero` و `site` و `platform` فقط، بينما يذكر أسماء الحقول فقط لباقي الـ 12 بلوك في الجدول.

**المطلوب إرسال استجابة حقيقية كاملة لـ:**
`GET /website/config?locale=all` (أو ملف الـ Seed JSON المستخدم في `feat/website-cms`)  
حتى نضبط الـ TypeScript Interfaces بدقة 100% — خصوصاً للبنية الداخلية لكل من:
1. **`fare_calculator`**:
   - ما هي الحقول الدقيقة داخل `vehicleClasses[]` (هل تشمل `baseFare`, `perKmRate`, `minimumFare`, `price`, `etaMin`, `previewCaptain`, `image`)؟
   - ما هي الحقول الدقيقة داخل `presets[]` (هل تشمل `id`, `label`, `pickup`, `destination`, `km`, `etaMin`, `priceMultiplier`)؟
   - ما هو هيكل `appRedirectModal` (هل يشمل `promoCode`, `promoText`, `title`, `subtitle`, `smsFallbackLabel`)؟
2. **`captain_earnings`**:
   - هل يحتوي كائن `calculator` على الأرقام والقيم التشغيلية (`hourlyNetRate`: `48`, `platformCommissionPercent`: `15`, `weeklyToMonthlyMultiplier`: `4.3`, `hoursSlider`: `{ min, max, default }`, `daysSlider`: `{ min, max, default }`, `disclaimer`)؟
3. **`fleet_categories`**:
   - هل `image` داخل `categories[]` كائن `{ url, alt }` أم string `imageUrl`؟ وما أسماء حقول السعر (`price`, `capacity`, `eta`, `feature`, `vehicles`, `carName`)؟
4. **`contact`**:
   - هيكل `cards[]` و`form.subjects[]` (هل لكل موضوع `id`, `label: { ar, en }`؟).
5. **`header` و `footer` و `how_it_works` و `value_pillars` و `faq` و `analytics_bar` و `download_banner`**:
   - أسماء الحقول الدقيقة لكل مصفوفة داخلها.

---

## 3. نقاط اختيارية لتحديد المواقع والأداء (حسب قرار الإدارة)

1. **البحث الفعلي عن المواقع وحساب السعر الديناميكي (`fare_calculator`):**
   - في الدليل الحالي لا توجد Endpoints للبحث عن المعالم أو عكس إحداثيات GPS أو حساب مسافة/تسعيرة لأي عنوان مكتوب يدوياً.
   - إذا أردتم أن يقدر الزائر على كتابة/اختيار **أي عنوان في المملكة** وتحديد **موقعه بالـ GPS الفعلي** وحساب التكلفة والمسافة أوتوماتيكياً، نحتاج إضافة:
     - `GET /website/locations/search?q=...&locale=ar`
     - `GET /website/locations/reverse-geocode?lat=...&lng=...&locale=ar`
     - `POST /website/trips/estimate-fare`
   - *(أما إذا كان المطلوب الاكتفاء بالمسارات الجاهزة `presets[]` فقط في هذه المرحلة، فلا داعي لإضافتها الآن).*

2. **مزامنة الكاش الفورية (اختياري):**
   - الكاش الحالي (`revalidate: 60`) ممتاز. وإذا أردتم ظهور تعديلات الأدمن فوراً (أقل من ثانية) بدل انتظار 60 ثانية، يمكن للباك اند إرسال Webhook عند الحفظ في `PUT /admin/website/blocks/*`:
   - `POST {FRONTEND_URL}/api/revalidate` مع Header `x-revalidate-secret`.

---

## 4. ملاحظات تقنية سريعة لفريق الباك اند والداشبورد

1. **توحيد صيغة الاستجابة في مسارات الـ Admin:**
   - في مقدمة الدليل ذُكر أن جميع الاستجابات تتبع `{ "data": ... }`، لكن مسارات `GET /admin/website/blocks`, `GET /admin/website/blocks/:key`, `POST /admin/website/blocks/:key/images` موضحة بدون تغليف `data` بينما مسارات `contact-submissions` و Public routes تستخدم `{ "data": ... }`. يُرجى توحيدها أو تأكيد الشكل الفعلي في الكود لتفادي أخطاء الربط مع الداشبورد.
2. **الأيقونات وصيغ الصور:**
   - منع رفع `SVG` في `POST /admin/website/blocks/:key/images` وتحويل الصور إلى `WebP` ممتاز أمنياً. لذلك سيستمر الفرونت اند في استخدام أسماء أيقونات `lucide-react` النصية (مثل `"ShieldCheck"`, `"Smartphone"`) للأيقونات، على أن تُرفع الشعارات (`siteLogoUrl`, `headerLogoUrl`, `faviconUrl`, وصور المتاجر إن وجدت) بصيغة `PNG` أو `WebP`.
3. **حالة الـ Seed في مثالكم:**
   - لاحظنا في مثال `GET /website/config` أن `analytics_bar` قيمته `"isEnabled": false` ومؤشرين في `hero.trustStats` قيمتهما `"isEnabled": false`. يُرجى التأكيد أن هذه مجرد قيم افتراضية قابلة للتفعيل مباشرة من الداشبورد بمجرد إدخال الأرقام المعتمدة.

---

**بمجرد استلام عينة JSON الكاملة لـ `GET /website/config?locale=all` وتأكيد الحقول المضافة أعلاه، سنبدأ فوراً في ربط الموقع كاملاً بالـ API.**
