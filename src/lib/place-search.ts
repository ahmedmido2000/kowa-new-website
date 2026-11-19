import type { GeoPoint, Locale } from '@/types/website-cms';

export interface PlaceSuggestion {
  id: string;
  label: string;
  subtitle?: string;
  point: GeoPoint;
  source: 'local' | 'osm';
}

interface LocalLandmark {
  id: string;
  ar: string;
  en: string;
  cityAr: string;
  cityEn: string;
  keywords: string[];
  point: GeoPoint;
}

const EGYPT_LANDMARKS: LocalLandmark[] = [
  {
    id: 'cairo-airport',
    ar: 'مطار القاهرة الدولي (مبنى الركاب)',
    en: 'Cairo International Airport (Terminals)',
    cityAr: 'مصر الجديدة، القاهرة',
    cityEn: 'Heliopolis, Cairo',
    keywords: ['مطار', 'القاهرة', 'صالة 3', 'صالة 2', 'صالة 1', 'airport', 'cairo airport', 'cai'],
    point: { latitude: 30.1123, longitude: 31.4005 },
  },
  {
    id: 'cfc-mall',
    ar: 'كايرو فستيفال سيتي مول (CFC)',
    en: 'Cairo Festival City Mall (CFC)',
    cityAr: 'التجمع الخامس، القاهرة الجديدة',
    cityEn: '5th Settlement, New Cairo',
    keywords: ['فستيفال', 'كايرو فستيفال', 'التجمع', 'التجمع الخامس', 'cfc', 'festival city', 'new cairo'],
    point: { latitude: 30.0286, longitude: 31.4705 },
  },
  {
    id: 'tahrir-downtown',
    ar: 'ميدان التحرير - وسط البلد',
    en: 'Tahrir Square - Downtown',
    cityAr: 'وسط البلد، القاهرة',
    cityEn: 'Downtown, Cairo',
    keywords: ['التحرير', 'ميدان التحرير', 'وسط البلد', 'وسط البلد القاهرة', 'tahrir', 'downtown'],
    point: { latitude: 30.0444, longitude: 31.2357 },
  },
  {
    id: 'giza-pyramids',
    ar: 'أهرامات الجيزة - نزلة السمان',
    en: 'Giza Pyramids Complex',
    cityAr: 'الهرم، الجيزة',
    cityEn: 'Al Haram, Giza',
    keywords: ['الأهرامات', 'أهرامات الجيزة', 'الهرم', 'أبو الهول', 'pyramids', 'giza'],
    point: { latitude: 29.9792, longitude: 31.1342 },
  },
  {
    id: 'mall-of-arabia',
    ar: 'مول العرب - ميدان جهينة',
    en: 'Mall of Arabia - Juhayna Sq',
    cityAr: '6 أكتوبر، الجيزة',
    cityEn: '6th of October, Giza',
    keywords: ['مول العرب', 'أكتوبر', 'جهينة', 'mall of arabia', 'october'],
    point: { latitude: 30.0074, longitude: 30.9733 },
  },
  {
    id: 'mall-of-egypt',
    ar: 'مول مصر - طريق الواحات',
    en: 'Mall of Egypt - Al Wahat Rd',
    cityAr: '6 أكتوبر، الجيزة',
    cityEn: '6th of October, Giza',
    keywords: ['مول مصر', 'الواحات', 'أكتوبر', 'mall of egypt'],
    point: { latitude: 29.9725, longitude: 31.0167 },
  },
  {
    id: 'hyper-one-zayed',
    ar: 'هايبر وان - الشيخ زايد',
    en: 'Hyper One - Sheikh Zayed',
    cityAr: 'الشيخ زايد، الجيزة',
    cityEn: 'Sheikh Zayed, Giza',
    keywords: ['هايبر وان', 'الشيخ زايد', 'زايد', 'محور 26 يوليو', 'hyper one', 'sheikh zayed'],
    point: { latitude: 30.0216, longitude: 30.9839 },
  },
  {
    id: 'citystars',
    ar: 'سيتي ستارز مول - مدينة نصر',
    en: 'Citystars Mall - Nasr City',
    cityAr: 'مدينة نصر، القاهرة',
    cityEn: 'Nasr City, Cairo',
    keywords: ['سيتي ستارز', 'مدينة نصر', 'citystars', 'nasr city'],
    point: { latitude: 30.0734, longitude: 31.3456 },
  },
  {
    id: 'new-capital-cbd',
    ar: 'العاصمة الإدارية - حي المال والأعمال (البرج الأيقوني)',
    en: 'New Capital - CBD (Iconic Tower)',
    cityAr: 'العاصمة الإدارية الجديدة',
    cityEn: 'New Administrative Capital',
    keywords: ['العاصمة الإدارية', 'البرج الأيقوني', 'حي المال', 'iconic tower', 'new capital'],
    point: { latitude: 30.0131, longitude: 31.7456 },
  },
  {
    id: 'korba-heliopolis',
    ar: 'حي الكوربة التاريخي - مصر الجديدة',
    en: 'Al Korba Heritage District - Heliopolis',
    cityAr: 'مصر الجديدة، القاهرة',
    cityEn: 'Heliopolis, Cairo',
    keywords: ['الكوربة', 'مصر الجديدة', 'روكسي', 'korba', 'heliopolis'],
    point: { latitude: 30.0898, longitude: 31.3285 },
  },
  {
    id: 'zamalek-tower',
    ar: 'برج القاهرة - الجزيرة',
    en: 'Cairo Tower - Gezira',
    cityAr: 'الزمالك، القاهرة',
    cityEn: 'Zamalek, Cairo',
    keywords: ['برج القاهرة', 'الزمالك', 'الجزيرة', 'cairo tower', 'zamalek'],
    point: { latitude: 30.0459, longitude: 31.2243 },
  },
  {
    id: 'maadi-degla',
    ar: 'شارع 9 - دجلة المعادي',
    en: 'Street 9 - Degla Maadi',
    cityAr: 'المعادي، القاهرة',
    cityEn: 'Maadi, Cairo',
    keywords: ['المعادي', 'شارع 9', 'دجلة', 'maadi', 'street 9'],
    point: { latitude: 29.9602, longitude: 31.2585 },
  },
  {
    id: 'alex-corniche',
    ar: 'كورنيش الإسكندرية - محطة الرمل',
    en: 'Alexandria Waterfront - Raml Station',
    cityAr: 'محطة الرمل، الإسكندرية',
    cityEn: 'Raml Station, Alexandria',
    keywords: ['الإسكندرية', 'الكورنيش', 'محطة الرمل', 'alexandria', 'corniche'],
    point: { latitude: 31.2001, longitude: 29.9015 },
  },
  {
    id: 'borg-elarab-airport',
    ar: 'مطار برج العرب الدولي',
    en: 'Borg El Arab International Airport',
    cityAr: 'برج العرب، الإسكندرية',
    cityEn: 'Borg El Arab, Alexandria',
    keywords: ['مطار برج العرب', 'برج العرب', 'الإسكندرية', 'borg el arab', 'airport'],
    point: { latitude: 30.9177, longitude: 29.6964 },
  },
];

function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/(^|\s)ال(?=[\u0621-\u064A]{2,})/g, '$1');
}

export function matchLocalLandmarks(query: string, locale: Locale): PlaceSuggestion[] {
  const q = normalizeSearchText(query);
  const list = q
    ? EGYPT_LANDMARKS.filter(
        (item) =>
          normalizeSearchText(item.ar).includes(q) ||
          normalizeSearchText(item.en).includes(q) ||
          normalizeSearchText(item.cityAr).includes(q) ||
          normalizeSearchText(item.cityEn).includes(q) ||
          item.keywords.some((k) => normalizeSearchText(k).includes(q))
      )
    : EGYPT_LANDMARKS.slice(0, 6);

  return list.slice(0, 5).map((item) => ({
    id: `local-${item.id}`,
    label: locale === 'ar' ? item.ar : item.en,
    subtitle: locale === 'ar' ? item.cityAr : item.cityEn,
    point: item.point,
    source: 'local',
  }));
}

export async function searchPlaces(
  query: string,
  locale: Locale,
  signal?: AbortSignal
): Promise<PlaceSuggestion[]> {
  const trimmed = query.trim();
  const localMatches = matchLocalLandmarks(trimmed, locale);
  if (trimmed.length < 2) return localMatches;

  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('q', trimmed);
    url.searchParams.set('countrycodes', 'eg'); // Restrict strictly to Egypt
    url.searchParams.set('limit', '5');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('accept-language', locale === 'ar' ? 'ar' : 'en');

    const res = await fetch(url.toString(), { signal });
    if (!res.ok) return localMatches;

    const rows = (await res.json()) as Array<{
      place_id: number;
      display_name: string;
      name?: string;
      lat: string;
      lon: string;
      address?: {
        road?: string;
        neighbourhood?: string;
        suburb?: string;
        city?: string;
        town?: string;
        state?: string;
      };
    }>;

    const osmMatches: PlaceSuggestion[] = [];
    for (const row of rows) {
      const lat = Number(row.lat);
      const lng = Number(row.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

      const addr = row.address;
      const primary =
        row.name ||
        addr?.road ||
        addr?.neighbourhood ||
        addr?.suburb ||
        row.display_name.split(',')[0]?.trim();
      const cityPart = addr?.city || addr?.town || addr?.state || '';
      const areaPart =
        addr?.neighbourhood || addr?.suburb || (addr?.road && addr.road !== primary ? addr.road : '');
      const subtitle = [areaPart, cityPart].filter(Boolean).join('، ');

      osmMatches.push({
        id: `osm-${row.place_id}`,
        label: primary || row.display_name,
        subtitle: subtitle || row.display_name,
        point: {
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lng.toFixed(6)),
        },
        source: 'osm',
      });
    }

    // Deduplicate local + OSM by label/proximity
    const merged = [...localMatches];
    for (const osm of osmMatches) {
      const duplicate = merged.some(
        (m) =>
          Math.abs(m.point.latitude - osm.point.latitude) < 0.002 &&
          Math.abs(m.point.longitude - osm.point.longitude) < 0.002
      );
      if (!duplicate) merged.push(osm);
    }

    return merged.slice(0, 6);
  } catch {
    return localMatches;
  }
}

export async function reverseGeocodePlace(
  point: GeoPoint,
  locale: Locale,
  signal?: AbortSignal
): Promise<string | null> {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse');
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('lat', String(point.latitude));
    url.searchParams.set('lon', String(point.longitude));
    url.searchParams.set('accept-language', locale === 'ar' ? 'ar' : 'en');

    const res = await fetch(url.toString(), { signal });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      name?: string;
      display_name?: string;
      address?: {
        road?: string;
        neighbourhood?: string;
        suburb?: string;
        city?: string;
        town?: string;
      };
    };

    const a = data.address;
    const parts = [
      data.name || a?.road,
      a?.neighbourhood || a?.suburb,
      a?.city || a?.town,
    ].filter((v, idx, arr): v is string => Boolean(v) && arr.indexOf(v) === idx);

    if (parts.length > 0) return parts.join(' - ');
    return data.display_name ? data.display_name.split(',').slice(0, 2).join(' - ').trim() : null;
  } catch {
    return null;
  }
}

// Backward compatibility aliases
export const searchSaudiPlaces = searchPlaces;
export const reverseGeocodeSaudiPlace = reverseGeocodePlace;
