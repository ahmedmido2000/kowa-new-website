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

const SAUDI_LANDMARKS: LocalLandmark[] = [
  {
    id: 'kkia',
    ar: 'مطار الملك خالد الدولي',
    en: 'King Khalid International Airport',
    cityAr: 'الرياض',
    cityEn: 'Riyadh',
    keywords: ['مطار', 'الملك خالد', 'airport', 'kkia', 'riyadh airport'],
    point: { latitude: 24.9576, longitude: 47.0017 },
  },
  {
    id: 'kafd',
    ar: 'مركز الملك عبدالله المالي (KAFD)',
    en: 'King Abdullah Financial District (KAFD)',
    cityAr: 'الرياض',
    cityEn: 'Riyadh',
    keywords: ['المركز المالي', 'المالي', 'kafd', 'العقيق', 'financial'],
    point: { latitude: 24.7647, longitude: 46.6406 },
  },
  {
    id: 'kingdom-centre',
    ar: 'برج المملكة - العليا',
    en: 'Kingdom Centre - Al Olaya',
    cityAr: 'الرياض',
    cityEn: 'Riyadh',
    keywords: ['برج المملكة', 'المملكة', 'العليا', 'kingdom', 'olaya'],
    point: { latitude: 24.7115, longitude: 46.6743 },
  },
  {
    id: 'riyadh-park',
    ar: 'الرياض بارك مول',
    en: 'Riyadh Park Mall',
    cityAr: 'الرياض',
    cityEn: 'Riyadh',
    keywords: ['الرياض بارك', 'بارك', 'مول', 'riyadh park', 'mall'],
    point: { latitude: 24.7562, longitude: 46.6305 },
  },
  {
    id: 'boulevard',
    ar: 'بوليفارد رياض سيتي',
    en: 'Boulevard Riyadh City',
    cityAr: 'الرياض',
    cityEn: 'Riyadh',
    keywords: ['البوليفارد', 'بوليفارد', 'حطين', 'boulevard', 'blvd'],
    point: { latitude: 24.7676, longitude: 46.6039 },
  },
  {
    id: 'diriyah',
    ar: 'الدرعية التاريخية - مطل البجيري',
    en: 'Diriyah - Al-Bujairi Heritage Park',
    cityAr: 'الدرعية، الرياض',
    cityEn: 'Diriyah, Riyadh',
    keywords: ['الدرعية', 'البجيري', 'diriyah', 'bujairi'],
    point: { latitude: 24.7366, longitude: 46.5752 },
  },
  {
    id: 'dq',
    ar: 'الحي الدبلوماسي (حي السفارات)',
    en: 'Diplomatic Quarter (DQ)',
    cityAr: 'الرياض',
    cityEn: 'Riyadh',
    keywords: ['السفارات', 'الدبلوماسي', 'diplomatic', 'dq'],
    point: { latitude: 24.6775, longitude: 46.6256 },
  },
  {
    id: 'faisaliah',
    ar: 'برج الفيصلية',
    en: 'Al Faisaliah Tower',
    cityAr: 'العليا، الرياض',
    cityEn: 'Al Olaya, Riyadh',
    keywords: ['الفيصلية', 'faisaliah'],
    point: { latitude: 24.6904, longitude: 46.6853 },
  },
  {
    id: 'jeddah-corniche',
    ar: 'واجهة روشن البحرية - كورنيش جدة',
    en: 'Jeddah Waterfront Corniche',
    cityAr: 'جدة',
    cityEn: 'Jeddah',
    keywords: ['جدة', 'كورنيش', 'روشن', 'jeddah', 'corniche'],
    point: { latitude: 21.6203, longitude: 39.1086 },
  },
  {
    id: 'kaia-jeddah',
    ar: 'مطار الملك عبدالعزيز الدولي',
    en: 'King Abdulaziz International Airport',
    cityAr: 'جدة',
    cityEn: 'Jeddah',
    keywords: ['مطار جدة', 'الملك عبدالعزيز', 'jeddah airport', 'kaia'],
    point: { latitude: 21.6796, longitude: 39.1565 },
  },
  {
    id: 'khobar-corniche',
    ar: 'كورنيش الخبر',
    en: 'Al Khobar Corniche',
    cityAr: 'الخبر',
    cityEn: 'Al Khobar',
    keywords: ['الخبر', 'كورنيش الخبر', 'khobar'],
    point: { latitude: 26.2929, longitude: 50.2202 },
  },
  {
    id: 'nakheel-mall',
    ar: 'النخيل مول - الرياض',
    en: 'Al Nakheel Mall - Riyadh',
    cityAr: 'حي المغرزات، الرياض',
    cityEn: 'Al Mughrizat, Riyadh',
    keywords: ['النخيل', 'النخيل مول', 'المغرزات', 'nakheel', 'mall'],
    point: { latitude: 24.7697, longitude: 46.7155 },
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
    ? SAUDI_LANDMARKS.filter(
        (item) =>
          normalizeSearchText(item.ar).includes(q) ||
          normalizeSearchText(item.en).includes(q) ||
          normalizeSearchText(item.cityAr).includes(q) ||
          normalizeSearchText(item.cityEn).includes(q) ||
          item.keywords.some((k) => normalizeSearchText(k).includes(q))
      )
    : SAUDI_LANDMARKS.slice(0, 6);

  return list.slice(0, 5).map((item) => ({
    id: `local-${item.id}`,
    label: locale === 'ar' ? item.ar : item.en,
    subtitle: locale === 'ar' ? item.cityAr : item.cityEn,
    point: item.point,
    source: 'local',
  }));
}

export async function searchSaudiPlaces(
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
    url.searchParams.set('countrycodes', 'sa');
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

export async function reverseGeocodeSaudiPlace(
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
