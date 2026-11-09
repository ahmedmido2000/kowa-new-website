export type Locale = 'ar' | 'en';

export interface CategoryData {
  id: string;
  badge: { ar: string; en: string };
  vehicles: { ar: string; en: string };
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  capacity: { ar: string; en: string };
  eta: { ar: string; en: string };
  feature: { ar: string; en: string };
  price: { ar: string; en: string };
  carName: string;
  image: string;
}

export const CATEGORIES: CategoryData[] = [
  {
    id: 'eco',
    badge: { ar: 'اقتصادي ذكي', en: 'Smart Economy' },
    vehicles: { ar: 'ياريس 2024 • أكسنت • نيسان صني', en: 'Yaris 2024 • Accent • Sunny' },
    title: { ar: 'كوا إيكو (KOWA Eco)', en: 'KOWA Eco' },
    desc: {
      ar: 'الحل العملي الأوفر للمشاوير الفردية السريعة والرحلات اليومية داخل المدينة مع سيارات حديثة مكيفة.',
      en: 'The most cost-effective practical option for quick solo rides and daily city commutes in modern, air-conditioned cars.'
    },
    capacity: { ar: '4 ركاب + 1 حقيبة', en: '4 Passengers + 1 Luggage' },
    eta: { ar: '< 2 دقيقة', en: '< 2 mins' },
    feature: { ar: 'تكييف قوي + تثبيت السعر', en: 'Strong AC + Fixed Fare' },
    price: { ar: '18.00 ر.س', en: '18.00 SAR' },
    carName: 'Toyota Yaris / Hyundai Accent 2024',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'comfort',
    badge: { ar: 'الفئة الأكثر طلباً', en: 'Most Popular' },
    vehicles: { ar: 'تويوتا كامري 2024 • فورد توروس', en: 'Toyota Camry 2024 • Ford Taurus' },
    title: { ar: 'كوا كومفورت (KOWA Comfort)', en: 'KOWA Comfort' },
    desc: {
      ar: 'الخيار المفضل للمشاوير اليومية المريحة. مقصورة واسعة للأقدام، عزل صوتي ممتاز للتركيز أو الاسترخاء، وسائقون حاصلون على تقييم 4.9 فما فوق.',
      en: 'The prime choice for relaxed daily rides. Generous legroom, premium sound insulation for focus or relaxation, and top-rated 4.9+ captains.'
    },
    capacity: { ar: '4 ركاب + 2 حقيبة', en: '4 Passengers + 2 Luggage' },
    eta: { ar: '< 3 دقائق', en: '< 3 mins' },
    feature: { ar: 'مياه وضيافة + شاحن سريع', en: 'Complimentary Water + Fast Charging' },
    price: { ar: '28.00 ر.س', en: '28.00 SAR' },
    carName: 'Toyota Camry / Ford Taurus 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3FCu6-QfkrRp_G7ngS_EtUnaTAseJKOwOZiIFMBokxeebFZF1urnsEGTDzfbrLcSJmsmaXqxRgcEzmpwJO4u8ncXXfa2ivR442blsiM8Kb3kxC4InMsq6GDEWycrLsZDCKqTY_4bWJ9cVXU71BdruG5T5FkpGbsI5oLRAitqUxEMXyjF8ALkUo6c77BY6z64-5CjEVwlh6eNMrkT_GTryA4KV_zj-ghpUG6rdX0BI'
  },
  {
    id: 'business',
    badge: { ar: 'فخامة كونسيرج تنفيذية', en: 'Executive Luxury' },
    vehicles: { ar: 'Lucid Air • Lexus ES 350 • BMW 5', en: 'Lucid Air • Lexus ES 350 • BMW 5' },
    title: { ar: 'كوا بزنس VIP (KOWA Business VIP)', en: 'KOWA Business VIP' },
    desc: {
      ar: 'أرقى درجات الرفاهية لرجال الأعمال والوفود ومناسبات الاستقبال الرسمية. كابتن بزي رسمي، إنترنت 5G مجاني، وسرية تامة.',
      en: 'Unmatched luxury for corporate leaders, executive delegates, and official receptions. Uniformed captains, complimentary 5G Wi-Fi, and complete discretion.'
    },
    capacity: { ar: '3 ركاب + 3 حقائب', en: '3 Passengers + 3 Luggage' },
    eta: { ar: '< 5 دقائق', en: '< 5 mins' },
    feature: { ar: 'واي فاي 5G + بروتوكول استقبال', en: '5G Wi-Fi + Protocol Reception' },
    price: { ar: '55.00 ر.س', en: '55.00 SAR' },
    carName: 'Lucid Air / Lexus ES VIP 2024',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'family',
    badge: { ar: 'سعة عائلية فائقة', en: 'Family & Luggage XL' },
    vehicles: { ar: 'GMC يوكن • شيفروليه تاهو • هيونداي ستاريا', en: 'GMC Yukon • Chevrolet Tahoe • Staria' },
    title: { ar: 'كوا عائلي وسفر XL (Family XL)', en: 'KOWA Family XL' },
    desc: {
      ar: 'مساحات رحبة تتسع لجميع أفراد العائلة وحقائب السفر الكبيرة بكل أريحية. مثالية لرحلات المطارات والرحلات العائلية بين المدن.',
      en: 'Spacious 7-seater vehicles accommodating the entire family and extensive travel luggage with maximum comfort. Perfect for airport transfers and intercity trips.'
    },
    capacity: { ar: '7 ركاب + 6 حقائب كبيرة', en: '7 Passengers + 6 Luggage' },
    eta: { ar: '< 6 دقائق', en: '< 6 mins' },
    feature: { ar: 'مكيف مستقل + مقاعد أطفال', en: 'Dual AC + Child Safety Seats' },
    price: { ar: '45.00 ر.س', en: '45.00 SAR' },
    carName: 'GMC Yukon / Tahoe XL 2024',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80'
  }
];

export const HERO_VEHICLE_OPTIONS = [
  { id: 'eco', name: { ar: 'إيكو سمارت', en: 'Eco Smart' }, price: '24.00', isFavorite: false },
  { id: 'comfort', name: { ar: 'كومفورت', en: 'Comfort' }, price: '34.00', isFavorite: true },
  { id: 'business', name: { ar: 'بزنس VIP', en: 'Business VIP' }, price: '62.00', isFavorite: false },
];
