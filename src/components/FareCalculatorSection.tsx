'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Clock,
  Info,
  Loader2,
  LocateFixed,
  Lock,
  MapPin,
  Navigation,
  Receipt,
  RotateCcw,
  Route,
  Search,
  ShieldCheck,
  Smartphone,
  Snowflake,
  Sparkles,
  Users,
  Wifi,
  X,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebsiteConfig } from '@/context/WebsiteConfigContext';
import type {
  DynamicFareCategoryItem,
  EstimateFareResponse,
  FareCalculatorCategoriesResponse,
  FareCalculatorContent,
  FareCalculatorDynamicConfig,
  FareCalculatorPreset,
  FareCalculatorServiceArea,
  GeoPoint,
} from '@/types/website-cms';
import {
  WebsiteApiError,
  estimateWebsiteTripFare,
  fetchFareCalculatorCategories,
  isRequestAbortedError,
} from '@/lib/website-api';
import { AppRedirectModal } from './AppRedirectModal';
import MagneticButton from './MagneticButton';
import { CmsIcon } from './CmsIcon';
import { isSafeHref } from '@/lib/cms-helpers';
import {
  matchLocalLandmarks,
  reverseGeocodeSaudiPlace,
  searchSaudiPlaces,
  type PlaceSuggestion,
} from '@/lib/place-search';

const FareRouteMap = dynamic(() => import('./FareRouteMap').then((mod) => mod.FareRouteMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] sm:h-[340px] lg:h-[380px] rounded-3xl border border-white/15 bg-[#070B16]/80 flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-brand-lime" />
    </div>
  ),
});

// Explicit real Riyadh landmark coordinates mapped to known CMS quick-route presets
const DYNAMIC_PRESET_COORDS: Record<
  string,
  { pickup: GeoPoint; destination: GeoPoint }
> = {
  'kafd-airport': {
    pickup: { latitude: 24.7647, longitude: 46.6406 },
    destination: { latitude: 24.9576, longitude: 47.0017 },
  },
  'olaya-dq': {
    pickup: { latitude: 24.7115, longitude: 46.6743 },
    destination: { latitude: 24.6775, longitude: 46.6256 },
  },
  'park-diriyah': {
    pickup: { latitude: 24.7562, longitude: 46.6305 },
    destination: { latitude: 24.7366, longitude: 46.5752 },
  },
};

const QUICK_RIYADH_POINTS: {
  id: string;
  label: { ar: string; en: string };
  pickup: GeoPoint;
  pickupName: { ar: string; en: string };
  destination: GeoPoint;
  destinationName: { ar: string; en: string };
}[] = [
  {
    id: 'kafd-airport',
    label: { ar: 'المركز المالي ← المطار', en: 'KAFD → Airport T5' },
    pickup: { latitude: 24.7647, longitude: 46.6406 },
    pickupName: {
      ar: 'الرياض - المركز المالي (KAFD)',
      en: 'Riyadh - King Abdullah Financial District (KAFD)',
    },
    destination: { latitude: 24.9576, longitude: 47.0017 },
    destinationName: {
      ar: 'مطار الملك خالد الدولي (صالة 5)',
      en: 'King Khalid International Airport (Terminal 5)',
    },
  },
  {
    id: 'olaya-dq',
    label: { ar: 'العليا ← الحي الدبلوماسي', en: 'Olaya → Diplomatic Qtr' },
    pickup: { latitude: 24.7115, longitude: 46.6743 },
    pickupName: {
      ar: 'برج المملكة - العليا',
      en: 'Kingdom Centre - Al Olaya',
    },
    destination: { latitude: 24.6775, longitude: 46.6256 },
    destinationName: {
      ar: 'حي السفارات - الحي الدبلوماسي',
      en: 'Diplomatic Quarter (DQ)',
    },
  },
  {
    id: 'park-diriyah',
    label: { ar: 'الرياض بارك ← الدرعية', en: 'Riyadh Park → Diriyah' },
    pickup: { latitude: 24.7562, longitude: 46.6305 },
    pickupName: {
      ar: 'الرياض بارك - الدائري الشمالي',
      en: 'Riyadh Park - Northern Ring Rd',
    },
    destination: { latitude: 24.7366, longitude: 46.5752 },
    destinationName: {
      ar: 'مطل البجيري التاريخي - الدرعية',
      en: 'Al-Bujairi Heritage Park - Diriyah',
    },
  },
];

function isValidGeoPoint(point: GeoPoint | null): point is GeoPoint {
  if (!point) return false;
  return (
    typeof point.latitude === 'number' &&
    typeof point.longitude === 'number' &&
    Number.isFinite(point.latitude) &&
    Number.isFinite(point.longitude) &&
    point.latitude >= -90 &&
    point.latitude <= 90 &&
    point.longitude >= -180 &&
    point.longitude <= 180
  );
}

function isWithinServiceArea(
  point: GeoPoint,
  area?: FareCalculatorServiceArea | null
): boolean {
  if (!area) return true;
  if (
    !Number.isFinite(area.south) ||
    !Number.isFinite(area.north) ||
    !Number.isFinite(area.west) ||
    !Number.isFinite(area.east)
  ) {
    return true;
  }
  return (
    point.latitude >= area.south &&
    point.latitude <= area.north &&
    point.longitude >= area.west &&
    point.longitude <= area.east
  );
}

function arePointsNearlyIdentical(a: GeoPoint, b: GeoPoint): boolean {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const c =
    sinLat * sinLat +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinLng * sinLng;
  const distMeters = 2 * R * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
  return distMeters < 10;
}

function formatPointLabel(point: GeoPoint | null): string {
  if (!point) return '';
  return `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`;
}

function formatPrice(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export const FareCalculatorSection: React.FC = () => {
  const { locale, isRtl } = useLanguage();
  const { sections, site } = useWebsiteConfig();
  const data = sections.fare_calculator;

  // 1. Hide section completely if fare_calculator block is disabled / absent
  if (!data) return null;

  const isAr = locale === 'ar';
  const dynamicConfig = data.dynamic;

  // 2. If dynamic exists and enabled === false: show section copy + app CTA, NO fare API calls
  if (dynamicConfig && dynamicConfig.enabled === false) {
    return <DisabledFareCalculatorView data={data} siteTgaLicense={site?.company?.tgaLicense} />;
  }

  // 3. If dynamic.enabled === true: render the full interactive dynamic fare calculator
  if (dynamicConfig && dynamicConfig.enabled === true) {
    return (
      <DynamicFareCalculatorView
        data={data}
        dynamicConfig={dynamicConfig}
        isAr={isAr}
        isRtl={isRtl}
        siteTgaLicense={site?.company?.tgaLicense}
      />
    );
  }

  // 4. Backward-compatible fallback ONLY when CMS has not yet migrated `dynamic`
  return <LegacyPreMigrationFareCalculator data={data} />;
};

/* -------------------------------------------------------------------------- */
/*  Mode 2: Dynamic Disabled (enabled === false) — Copy + App Redirect CTA    */
/* -------------------------------------------------------------------------- */

const DisabledFareCalculatorView: React.FC<{
  data: FareCalculatorContent;
  siteTgaLicense?: string;
}> = ({ data, siteTgaLicense }) => {
  const { isRtl, pick } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const trustStrip = (data.trustStrip || []).filter((item) => item.isEnabled !== false);
  const tgaLicense = (siteTgaLicense || '').trim();

  return (
    <>
      <section
        id="fare-calculator"
        className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50/60 dark:from-[#0A0F1D] dark:via-[#0C1222] dark:to-[#0A0F1D] py-16 lg:py-24 border-b border-neutral-200 dark:border-line transition-colors duration-200"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/5 dark:bg-brand-lime/10 border border-brand/15 dark:border-brand-lime/20 text-brand dark:text-brand-lime text-xs font-black tracking-wide mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
            <span>{pick(data.badge)}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-ink leading-tight mb-4">
            {pick(data.headline?.lead)}{' '}
            <span className="text-brand dark:text-brand-lime">
              {pick(data.headline?.highlight)}
            </span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-ink-muted leading-relaxed max-w-2xl mx-auto mb-8">
            {pick(data.subtitle)}
          </p>

          <div className="flex justify-center mb-10">
            <MagneticButton strength={0.22} as="div">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="py-4 px-8 rounded-2xl bg-brand hover:bg-brand-dark dark:bg-brand-lime dark:hover:bg-[#e1e848] text-white dark:text-neutral-950 font-black text-sm inline-flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer group"
              >
                <Smartphone className="w-4 h-4 text-brand-lime dark:text-neutral-950" />
                <span>{pick(data.labels?.cta)}</span>
                <ArrowIcon className="w-4 h-4 text-brand-lime dark:text-neutral-950" />
              </button>
            </MagneticButton>
          </div>

          {trustStrip.length > 0 || tgaLicense ? (
            <div className="rounded-2xl bg-white dark:bg-[#0E1528] border border-neutral-200 dark:border-line px-6 py-4 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-600 dark:text-ink-muted">
              {trustStrip.map((item) => (
                <div key={item.id} className="flex items-center gap-2 font-bold">
                  <CmsIcon
                    name={item.icon}
                    className="w-4 h-4 text-brand dark:text-brand-lime shrink-0"
                  />
                  <span>{pick(item.text)}</span>
                </div>
              ))}
              {tgaLicense ? (
                <div className="flex items-center gap-2 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-en">TGA #{tgaLicense}</span>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <AppRedirectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pickup=""
        destination=""
        vehicleName=""
      />
    </>
  );
};

/* -------------------------------------------------------------------------- */
/*  Mode 3: Full Dynamic Fare Calculator (Map + Categories + Estimate API)    */
/* -------------------------------------------------------------------------- */

const DynamicFareCalculatorView: React.FC<{
  data: FareCalculatorContent;
  dynamicConfig: FareCalculatorDynamicConfig;
  isAr: boolean;
  isRtl: boolean;
  siteTgaLicense?: string;
}> = ({ data, dynamicConfig, isAr, isRtl, siteTgaLicense }) => {
  const { pick, locale } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const dynLabels = dynamicConfig.labels;
  const showMap = dynamicConfig.showMap !== false;
  const showBreakdown = dynamicConfig.showBreakdown !== false;

  const [pickup, setPickup] = useState<GeoPoint | null>(null);
  const [destination, setDestination] = useState<GeoPoint | null>(null);
  const [pickupName, setPickupName] = useState<string>('');
  const [destinationName, setDestinationName] = useState<string>('');
  const [pickupQuery, setPickupQuery] = useState<string>('');
  const [destinationQuery, setDestinationQuery] = useState<string>('');
  const [openSearchField, setOpenSearchField] = useState<'pickup' | 'destination' | null>(null);
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
  const [coordInputs, setCoordInputs] = useState({
    pickupLat: '',
    pickupLng: '',
    destLat: '',
    destLng: '',
  });
  const [activeSelection, setActiveSelection] = useState<'pickup' | 'destination'>('pickup');
  const [swapRotation, setSwapRotation] = useState(0);
  const [isLocating, setIsLocating] = useState(false);
  const [geoWarning, setGeoWarning] = useState<string | null>(null);

  const [categoriesData, setCategoriesData] = useState<FareCalculatorCategoriesResponse | null>(
    null
  );
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const [estimateResult, setEstimateResult] = useState<EstimateFareResponse | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoriesRevisionRef = useRef(0);
  const categoriesAbortRef = useRef<AbortController | null>(null);
  const estimateRevisionRef = useRef(0);
  const estimateAbortRef = useRef<AbortController | null>(null);
  const mapFrameRef = useRef<HTMLDivElement | null>(null);
  const rideBoxRef = useRef<HTMLDivElement | null>(null);
  const pickupInputRef = useRef<HTMLInputElement | null>(null);
  const destinationInputRef = useRef<HTMLInputElement | null>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const reversePickupAbortRef = useRef<AbortController | null>(null);
  const reversePickupRevRef = useRef(0);
  const reverseDestAbortRef = useRef<AbortController | null>(null);
  const reverseDestRevRef = useRef(0);

  const isManualCoordsVisible = !showMap;

  // Cleanup active requests & outside-click listener for autocomplete dropdown
  useEffect(() => {
    const handleOutsidePointerDown = (event: MouseEvent) => {
      if (rideBoxRef.current && !rideBoxRef.current.contains(event.target as Node)) {
        setOpenSearchField(null);
      }
    };
    document.addEventListener('mousedown', handleOutsidePointerDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsidePointerDown);
      categoriesAbortRef.current?.abort();
      estimateAbortRef.current?.abort();
      searchAbortRef.current?.abort();
      reversePickupAbortRef.current?.abort();
      reverseDestAbortRef.current?.abort();
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const invalidateFare = useCallback(() => {
    estimateRevisionRef.current += 1;
    estimateAbortRef.current?.abort();
    setEstimateResult(null);
    setEstimateError(null);
    setIsEstimating(false);
  }, []);

  const mapErrorToDisplay = useCallback(
    (err: unknown): string => {
      const genericErr = pick(
        dynLabels?.error,
        isAr ? 'تعذر حساب السعر، حاول لاحقًا' : 'Unable to estimate fare. Please try again later'
      );
      const noRouteErr = pick(
        dynLabels?.noRoute,
        isAr ? 'لا يوجد مسار قيادة بين النقطتين' : 'No driving route between these points'
      );

      if (err instanceof WebsiteApiError) {
        switch (err.code) {
          case 'WEBSITE_IDENTICAL_POINTS':
            return isAr
              ? 'نقطة الانطلاق والوجهة متقاربتان جدًا. يرجى اختيار وجهة مختلفة.'
              : 'Pickup and destination are too close. Please choose a different destination.';
          case 'WEBSITE_OUTSIDE_SERVICE_AREA':
            return isAr
              ? 'نقطة الانطلاق أو الوجهة خارج نطاق الخدمة المتاح حاليًا.'
              : 'Pickup or destination is outside the supported service area.';
          case 'WEBSITE_CATEGORY_UNAVAILABLE':
            return isAr
              ? 'الفئة المختارة غير متاحة في هذه المنطقة. تم تحديث قائمة الفئات.'
              : 'Selected ride category is unavailable here. Categories have been refreshed.';
          case 'WEBSITE_ROUTE_TOO_LONG':
            return dynamicConfig.maxDistanceKm
              ? isAr
                ? `المسافة تتجاوز الحد الأقصى المسموح (${dynamicConfig.maxDistanceKm} كم).`
                : `Route distance exceeds the maximum limit (${dynamicConfig.maxDistanceKm} km).`
              : err.getDisplayMessage(isAr ? 'ar' : 'en');
          case 'WEBSITE_ROUTE_NOT_FOUND':
            return noRouteErr;
          case 'WEBSITE_FARE_DISABLED':
            return isAr
              ? 'حاسبة الأسعار الديناميكية معطلة حاليًا.'
              : 'Dynamic fare calculator is currently disabled.';
          case 'RATE_LIMITED':
            return isAr
              ? 'تم تجاوز الحد المؤقت للطلبات. يرجى الانتظار قليلًا والمحاولة مرة أخرى.'
              : 'Too many requests in a short time. Please wait a moment and try again.';
          case 'WEBSITE_FARE_NOT_CONFIGURED':
          case 'WEBSITE_MAPS_NOT_CONFIGURED':
          case 'WEBSITE_ROUTING_UNAVAILABLE':
            return genericErr;
          default:
            if (err.status === 429) {
              return isAr
                ? 'تم تجاوز الحد المؤقت للطلبات. يرجى الانتظار قليلًا والمحاولة مرة أخرى.'
                : 'Too many requests in a short time. Please wait a moment and try again.';
            }
            if (err.status >= 500) return genericErr;
            return err.getDisplayMessage(isAr ? 'ar' : 'en') || genericErr;
        }
      }

      return genericErr;
    },
    [dynLabels, dynamicConfig.maxDistanceKm, isAr, pick]
  );

  const visibleCategories = useMemo<DynamicFareCategoryItem[]>(() => {
    const rawItems = categoriesData?.items || [];
    const allowed = dynamicConfig.allowedCategoryIds || [];
    const filtered =
      allowed.length > 0 ? rawItems.filter((item) => allowed.includes(item.id)) : rawItems;
    return [...filtered].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [categoriesData?.items, dynamicConfig.allowedCategoryIds]);

  const selectedCategory = useMemo(
    () =>
      visibleCategories.find(
        (cat) => cat.id === selectedCategoryId && cat.available && cat.configured
      ) || null,
    [visibleCategories, selectedCategoryId]
  );

  const getCategoryDisplayName = useCallback(
    (cat: DynamicFareCategoryItem | null): string => {
      if (!cat) return '';
      if (typeof cat.name === 'string') return cat.name;
      return pick(cat.name);
    },
    [pick]
  );

  const runEstimateFare = useCallback(
    async (
      pickupPt: GeoPoint,
      destPt: GeoPoint,
      categoryId: string
    ) => {
      if (!isValidGeoPoint(pickupPt) || !isValidGeoPoint(destPt) || !categoryId) return;

      if (
        !isWithinServiceArea(pickupPt, dynamicConfig.serviceArea) ||
        !isWithinServiceArea(destPt, dynamicConfig.serviceArea)
      ) {
        invalidateFare();
        setEstimateError(
          isAr
            ? 'نقطة الانطلاق أو الوجهة خارج نطاق الخدمة المتاح حاليًا.'
            : 'Pickup or destination is outside the supported service area.'
        );
        return;
      }

      if (arePointsNearlyIdentical(pickupPt, destPt)) {
        invalidateFare();
        setEstimateError(
          isAr
            ? 'نقطة الانطلاق والوجهة متقاربتان جدًا. يرجى اختيار وجهة مختلفة.'
            : 'Pickup and destination are too close. Please choose a different destination.'
        );
        return;
      }

      const requestRevision = ++estimateRevisionRef.current;
      estimateAbortRef.current?.abort();
      const controller = new AbortController();
      estimateAbortRef.current = controller;

      setEstimateResult(null);
      setEstimateError(null);
      setIsEstimating(true);

      try {
        const result = await estimateWebsiteTripFare(
          {
            pickup: {
              latitude: Number(pickupPt.latitude),
              longitude: Number(pickupPt.longitude),
            },
            destination: {
              latitude: Number(destPt.latitude),
              longitude: Number(destPt.longitude),
            },
            deliveryCategoryId: categoryId,
          },
          controller.signal
        );

        if (requestRevision !== estimateRevisionRef.current) return;
        setEstimateResult(result);
        setEstimateError(null);
      } catch (err) {
        if (isRequestAbortedError(err) || requestRevision !== estimateRevisionRef.current) return;

        setEstimateResult(null);
        setEstimateError(mapErrorToDisplay(err));

        // If category became unavailable for this area, refresh categories and clear stale selection
        if (
          err instanceof WebsiteApiError &&
          err.code === 'WEBSITE_CATEGORY_UNAVAILABLE'
        ) {
          setSelectedCategoryId('');
          const catRev = ++categoriesRevisionRef.current;
          categoriesAbortRef.current?.abort();
          const catCtrl = new AbortController();
          categoriesAbortRef.current = catCtrl;
          fetchFareCalculatorCategories(
            {
              pickupLatitude: pickupPt.latitude,
              pickupLongitude: pickupPt.longitude,
              locale: 'all',
            },
            catCtrl.signal
          )
            .then((refreshed) => {
              if (catRev !== categoriesRevisionRef.current) return;
              setCategoriesData(refreshed);
            })
            .catch(() => {
              // Keep existing category error state clean
            });
        }
      } finally {
        if (requestRevision === estimateRevisionRef.current) {
          setIsEstimating(false);
        }
      }
    },
    [dynamicConfig.serviceArea, invalidateFare, isAr, mapErrorToDisplay]
  );

  const loadCategoriesForPickup = useCallback(
    async (
      pickupPt: GeoPoint,
      options?: {
        preferredDest?: GeoPoint | null;
        autoPickFirstAvailable?: boolean;
        prevSelectedId?: string;
      }
    ) => {
      const allowed = dynamicConfig.allowedCategoryIds || [];
      if (!isWithinServiceArea(pickupPt, dynamicConfig.serviceArea)) {
        categoriesRevisionRef.current += 1;
        categoriesAbortRef.current?.abort();
        setCategoriesData(null);
        setCategoriesError(
          isAr
            ? 'نقطة الانطلاق خارج نطاق الخدمة المتاح حاليًا.'
            : 'Pickup point is outside the supported service area.'
        );
        setSelectedCategoryId('');
        setIsLoadingCategories(false);
        return;
      }

      const reqRevision = ++categoriesRevisionRef.current;
      categoriesAbortRef.current?.abort();
      const controller = new AbortController();
      categoriesAbortRef.current = controller;

      setIsLoadingCategories(true);
      setCategoriesError(null);

      try {
        const res = await fetchFareCalculatorCategories(
          {
            pickupLatitude: Number(pickupPt.latitude),
            pickupLongitude: Number(pickupPt.longitude),
            locale: 'all',
          },
          controller.signal
        );

        if (reqRevision !== categoriesRevisionRef.current) return;
        setCategoriesData(res);

        const eligible = [...(res.items || [])]
          .filter((item) => allowed.length === 0 || allowed.includes(item.id))
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

        const prevId = options?.prevSelectedId ?? '';
        const stillAvailable = eligible.find(
          (item) => item.id === prevId && item.available && item.configured
        );

        let nextCategoryId = '';
        if (stillAvailable) {
          nextCategoryId = stillAvailable.id;
        } else if (options?.autoPickFirstAvailable) {
          const firstAvail = eligible.find((item) => item.available && item.configured);
          nextCategoryId = firstAvail?.id || '';
        }

        setSelectedCategoryId(nextCategoryId);

        const targetDest = options?.preferredDest;
        if (nextCategoryId && targetDest && isValidGeoPoint(targetDest)) {
          runEstimateFare(pickupPt, targetDest, nextCategoryId);
        }
      } catch (err) {
        if (isRequestAbortedError(err) || reqRevision !== categoriesRevisionRef.current) return;
        setCategoriesData(null);
        setSelectedCategoryId('');
        setCategoriesError(mapErrorToDisplay(err));
      } finally {
        if (reqRevision === categoriesRevisionRef.current) {
          setIsLoadingCategories(false);
        }
      }
    },
    [
      dynamicConfig.allowedCategoryIds,
      dynamicConfig.serviceArea,
      isAr,
      mapErrorToDisplay,
      runEstimateFare,
    ]
  );

  const resolveHumanPickupName = useCallback(
    (point: GeoPoint) => {
      const rev = ++reversePickupRevRef.current;
      reversePickupAbortRef.current?.abort();
      const ctrl = new AbortController();
      reversePickupAbortRef.current = ctrl;
      reverseGeocodeSaudiPlace(point, locale, ctrl.signal)
        .then((name) => {
          if (ctrl.signal.aborted || rev !== reversePickupRevRef.current || !name) return;
          setPickupName(name);
          setPickupQuery(name);
        })
        .catch(() => {
          // Keep friendly placeholder if reverse lookup fails or is rate-limited
        });
    },
    [locale]
  );

  const resolveHumanDestinationName = useCallback(
    (point: GeoPoint) => {
      const rev = ++reverseDestRevRef.current;
      reverseDestAbortRef.current?.abort();
      const ctrl = new AbortController();
      reverseDestAbortRef.current = ctrl;
      reverseGeocodeSaudiPlace(point, locale, ctrl.signal)
        .then((name) => {
          if (ctrl.signal.aborted || rev !== reverseDestRevRef.current || !name) return;
          setDestinationName(name);
          setDestinationQuery(name);
        })
        .catch(() => {
          // Keep friendly placeholder if reverse lookup fails or is rate-limited
        });
    },
    [locale]
  );

  const handlePickupUpdate = useCallback(
    (point: GeoPoint, label?: string) => {
      invalidateFare();
      setGeoWarning(null);
      setPickup(point);
      reversePickupRevRef.current += 1;
      reversePickupAbortRef.current?.abort();

      const resolvedLabel =
        label || (isAr ? 'موقع الانطلاق على الخريطة ✓' : 'Pickup pinned on map ✓');
      setPickupName(resolvedLabel);
      setPickupQuery(resolvedLabel);
      if (!label) {
        resolveHumanPickupName(point);
      }

      setCoordInputs((prev) => ({
        ...prev,
        pickupLat: String(point.latitude),
        pickupLng: String(point.longitude),
      }));

      // Automatically move focus/map selection to destination if not yet picked
      if (!destination) {
        setActiveSelection('destination');
      }

      loadCategoriesForPickup(point, {
        preferredDest: destination,
        prevSelectedId: selectedCategoryId,
        autoPickFirstAvailable: true,
      });
    },
    [
      destination,
      invalidateFare,
      isAr,
      loadCategoriesForPickup,
      resolveHumanPickupName,
      selectedCategoryId,
    ]
  );

  const handleDestinationUpdate = useCallback(
    (point: GeoPoint, label?: string) => {
      invalidateFare();
      setGeoWarning(null);
      setDestination(point);
      reverseDestRevRef.current += 1;
      reverseDestAbortRef.current?.abort();

      const resolvedLabel =
        label || (isAr ? 'الوجهة محددة على الخريطة ✓' : 'Destination pinned on map ✓');
      setDestinationName(resolvedLabel);
      setDestinationQuery(resolvedLabel);
      if (!label) {
        resolveHumanDestinationName(point);
      }

      setCoordInputs((prev) => ({
        ...prev,
        destLat: String(point.latitude),
        destLng: String(point.longitude),
      }));
      if (pickup && selectedCategory) {
        runEstimateFare(pickup, point, selectedCategory.id);
      }
    },
    [
      invalidateFare,
      isAr,
      pickup,
      resolveHumanDestinationName,
      runEstimateFare,
      selectedCategory,
    ]
  );

  const handleCategorySelect = useCallback(
    (cat: DynamicFareCategoryItem) => {
      if (!cat.available || !cat.configured) return;
      invalidateFare();
      setSelectedCategoryId(cat.id);
      if (pickup && destination) {
        runEstimateFare(pickup, destination, cat.id);
      }
    },
    [destination, invalidateFare, pickup, runEstimateFare]
  );

  const handleSwapRoute = () => {
    if (!pickup && !destination) return;
    setSwapRotation((prev) => prev + 180);
    invalidateFare();
    setOpenSearchField(null);
    reversePickupRevRef.current += 1;
    reversePickupAbortRef.current?.abort();
    reverseDestRevRef.current += 1;
    reverseDestAbortRef.current?.abort();

    const nextPickup = destination;
    const nextDest = pickup;
    const nextPickupName = destinationName;
    const nextDestName = pickupName;

    setPickup(nextPickup);
    setDestination(nextDest);
    setPickupName(nextPickupName);
    setPickupQuery(nextPickupName);
    setDestinationName(nextDestName);
    setDestinationQuery(nextDestName);
    setCoordInputs({
      pickupLat: nextPickup ? String(nextPickup.latitude) : '',
      pickupLng: nextPickup ? String(nextPickup.longitude) : '',
      destLat: nextDest ? String(nextDest.latitude) : '',
      destLng: nextDest ? String(nextDest.longitude) : '',
    });

    if (nextPickup) {
      loadCategoriesForPickup(nextPickup, {
        preferredDest: nextDest,
        prevSelectedId: selectedCategoryId,
        autoPickFirstAvailable: true,
      });
    } else {
      categoriesRevisionRef.current += 1;
      categoriesAbortRef.current?.abort();
      setCategoriesData(null);
      setSelectedCategoryId('');
    }
  };

  const handleClearPickup = useCallback(() => {
    invalidateFare();
    categoriesRevisionRef.current += 1;
    categoriesAbortRef.current?.abort();
    reversePickupRevRef.current += 1;
    reversePickupAbortRef.current?.abort();
    setGeoWarning(null);
    setPickup(null);
    setPickupName('');
    setPickupQuery('');
    setCategoriesData(null);
    setCategoriesError(null);
    setIsLoadingCategories(false);
    setSelectedCategoryId('');
    setCoordInputs((prev) => ({ ...prev, pickupLat: '', pickupLng: '' }));
    setActiveSelection('pickup');
  }, [invalidateFare]);

  const handleClearDestination = useCallback(() => {
    invalidateFare();
    reverseDestRevRef.current += 1;
    reverseDestAbortRef.current?.abort();
    setGeoWarning(null);
    setDestination(null);
    setDestinationName('');
    setDestinationQuery('');
    setCoordInputs((prev) => ({ ...prev, destLat: '', destLng: '' }));
    setActiveSelection('destination');
  }, [invalidateFare]);

  const handleResetAll = useCallback(() => {
    invalidateFare();
    categoriesRevisionRef.current += 1;
    categoriesAbortRef.current?.abort();
    reversePickupRevRef.current += 1;
    reversePickupAbortRef.current?.abort();
    reverseDestRevRef.current += 1;
    reverseDestAbortRef.current?.abort();
    searchAbortRef.current?.abort();
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
    setOpenSearchField(null);
    setPlaceSuggestions([]);
    setIsSearchingPlaces(false);
    setGeoWarning(null);
    setPickup(null);
    setDestination(null);
    setPickupName('');
    setPickupQuery('');
    setDestinationName('');
    setDestinationQuery('');
    setCoordInputs({ pickupLat: '', pickupLng: '', destLat: '', destLng: '' });
    setCategoriesData(null);
    setCategoriesError(null);
    setIsLoadingCategories(false);
    setSelectedCategoryId('');
    setActiveSelection('pickup');
  }, [invalidateFare]);

  const triggerPlaceSearch = useCallback(
    (mode: 'pickup' | 'destination', queryText: string) => {
      setActiveSelection(mode);
      setOpenSearchField(mode);

      const localMatches = matchLocalLandmarks(queryText, locale);
      setPlaceSuggestions(localMatches);

      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
        searchTimerRef.current = null;
      }
      searchAbortRef.current?.abort();

      const trimmed = queryText.trim();
      const activeChosenName = mode === 'pickup' ? pickupName : destinationName;
      if (trimmed.length < 2 || (activeChosenName && trimmed === activeChosenName.trim())) {
        setIsSearchingPlaces(false);
        return;
      }

      setIsSearchingPlaces(true);
      searchTimerRef.current = setTimeout(async () => {
        const ctrl = new AbortController();
        searchAbortRef.current = ctrl;
        try {
          const remote = await searchSaudiPlaces(trimmed, locale, ctrl.signal);
          if (ctrl.signal.aborted) return;
          const seenLabels = new Set(localMatches.map((item) => item.label));
          const merged = [
            ...localMatches,
            ...remote.filter((item) => !seenLabels.has(item.label)),
          ].slice(0, 7);
          setPlaceSuggestions(merged);
        } catch {
          // Keep built-in Saudi landmarks silently if network search fails
        } finally {
          if (!ctrl.signal.aborted) {
            setIsSearchingPlaces(false);
          }
        }
      }, 320);
    },
    [destinationName, locale, pickupName]
  );

  const handlePickSuggestion = useCallback(
    (mode: 'pickup' | 'destination', item: PlaceSuggestion) => {
      setOpenSearchField(null);
      setIsSearchingPlaces(false);
      searchAbortRef.current?.abort();
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
        searchTimerRef.current = null;
      }
      if (mode === 'pickup') {
        handlePickupUpdate(item.point, item.label);
        if (!destination) {
          setActiveSelection('destination');
        }
      } else {
        handleDestinationUpdate(item.point, item.label);
      }
    },
    [destination, handleDestinationUpdate, handlePickupUpdate]
  );

  const handleLocateMe = () => {
    setGeoWarning(null);
    setOpenSearchField(null);
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoWarning(
        isAr
          ? 'المتصفح لا يدعم تحديد الموقع التلقائي، يرجى البحث أو الاختيار من الخريطة.'
          : 'Browser geolocation is unavailable. Please search or pick on the map.'
      );
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const point: GeoPoint = {
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        };
        handlePickupUpdate(point, isAr ? 'موقعي الحالي (GPS)' : 'Current Location (GPS)');
        resolveHumanPickupName(point);
      },
      () => {
        setIsLocating(false);
        setGeoWarning(
          isAr
            ? 'تعذر الوصول للموقع الحالي، يمكنك كتابة اسم المكان أو الضغط على الخريطة.'
            : 'Unable to access your current location. Type a place name or tap the map.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleQuickPreset = (presetId: string) => {
    const matched = QUICK_RIYADH_POINTS.find((q) => q.id === presetId);
    const cmsPreset = (data.presets || []).find((p) => p.id === presetId && p.isEnabled !== false);
    if (!matched) return;

    invalidateFare();
    setGeoWarning(null);
    setOpenSearchField(null);
    reversePickupRevRef.current += 1;
    reversePickupAbortRef.current?.abort();
    reverseDestRevRef.current += 1;
    reverseDestAbortRef.current?.abort();

    const pName = cmsPreset ? pick(cmsPreset.pickup) : pick(matched.pickupName);
    const dName = cmsPreset ? pick(cmsPreset.destination) : pick(matched.destinationName);

    setPickup(matched.pickup);
    setDestination(matched.destination);
    setPickupName(pName);
    setPickupQuery(pName);
    setDestinationName(dName);
    setDestinationQuery(dName);
    setCoordInputs({
      pickupLat: String(matched.pickup.latitude),
      pickupLng: String(matched.pickup.longitude),
      destLat: String(matched.destination.latitude),
      destLng: String(matched.destination.longitude),
    });

    loadCategoriesForPickup(matched.pickup, {
      preferredDest: matched.destination,
      prevSelectedId: selectedCategoryId,
      autoPickFirstAvailable: true,
    });
  };

  const handleManualCoordChange = (
    field: 'pickupLat' | 'pickupLng' | 'destLat' | 'destLng',
    value: string
  ) => {
    invalidateFare();
    setGeoWarning(null);
    const next = { ...coordInputs, [field]: value };
    setCoordInputs(next);

    if (field === 'pickupLat' || field === 'pickupLng') {
      const lat = Number(next.pickupLat);
      const lng = Number(next.pickupLng);
      const parsed =
        next.pickupLat.trim() !== '' &&
        next.pickupLng.trim() !== '' &&
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
          ? { latitude: lat, longitude: lng }
          : null;
      setPickup(parsed);
      setPickupName('');
      setPickupQuery(parsed ? formatPointLabel(parsed) : '');
      if (parsed) {
        loadCategoriesForPickup(parsed, {
          preferredDest: destination,
          prevSelectedId: selectedCategoryId,
          autoPickFirstAvailable: true,
        });
      } else {
        categoriesRevisionRef.current += 1;
        categoriesAbortRef.current?.abort();
        setCategoriesData(null);
        setCategoriesError(null);
        setSelectedCategoryId('');
      }
    } else {
      const lat = Number(next.destLat);
      const lng = Number(next.destLng);
      const parsed =
        next.destLat.trim() !== '' &&
        next.destLng.trim() !== '' &&
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
          ? { latitude: lat, longitude: lng }
          : null;
      setDestination(parsed);
      setDestinationName('');
      setDestinationQuery(parsed ? formatPointLabel(parsed) : '');
      if (parsed && pickup && selectedCategory) {
        runEstimateFare(pickup, parsed, selectedCategory.id);
      }
    }
  };

  // Determine available quick preset chips (only those backed by explicit coordinates)
  const quickPresets = useMemo(() => {
    const enabledCmsPresets = (data.presets || []).filter(
      (p) => p.isEnabled !== false && DYNAMIC_PRESET_COORDS[p.id]
    );
    if (enabledCmsPresets.length > 0) {
      return enabledCmsPresets.map((p) => ({
        id: p.id,
        label: pick(p.label),
      }));
    }
    return QUICK_RIYADH_POINTS.map((q) => ({
      id: q.id,
      label: pick(q.label),
    }));
  }, [data.presets, pick]);

  const guidedStepHint = !pickup
    ? isAr
      ? '① من أين تنطلق؟ اختر أو ابحث'
      : '1. Where from? Search or tap map'
    : !destination
      ? isAr
        ? '② إلى أين تذهب؟ اختر أو ابحث'
        : '2. Where to? Search or tap map'
      : isEstimating
        ? isAr
          ? 'جارٍ حساب المسار والسعر الثابت...'
          : 'Calculating fixed fare...'
        : estimateResult
          ? isAr
            ? '✓ السعر ثابت وجاهز للحجز'
            : '✓ Fixed fare ready to book'
          : isAr
            ? '③ اختر الفئة لعرض السعر'
            : '3. Select a category for fare';

  const trustStrip = (data.trustStrip || []).filter((item) => item.isEnabled !== false);
  const tgaLicense = (siteTgaLicense || '').trim();

  const estimatedPriceLabel = estimateResult
    ? `${formatPrice(estimateResult.price)} ${estimateResult.currency} ${
        estimateResult.includesVat ? pick(data.labels?.vatNote) : ''
      }`.trim()
    : undefined;

  return (
    <>
      <section
        id="fare-calculator"
        className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50/60 dark:from-[#0A0F1D] dark:via-[#0C1222] dark:to-[#0A0F1D] py-16 lg:py-24 border-b border-neutral-200 dark:border-line transition-colors duration-200"
      >
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-brand/5 dark:bg-brand/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-brand-lime/15 dark:bg-brand-lime/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-12 lg:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/5 dark:bg-brand-lime/10 border border-brand/15 dark:border-brand-lime/20 text-brand dark:text-brand-lime text-xs font-black tracking-wide mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
              <span>{pick(data.badge)}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-ink leading-tight mb-4">
              {pick(data.headline?.lead)}{' '}
              <span className="relative inline-block text-brand dark:text-brand-lime">
                {pick(data.headline?.highlight)}
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="7"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 7"
                >
                  <path
                    d="M0,5 Q50,0 100,5"
                    fill="none"
                    stroke="#D3D93C"
                    strokeLinecap="round"
                    strokeWidth="6"
                  />
                </svg>
              </span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-ink-muted leading-relaxed max-w-2xl mx-auto">
              {pick(data.subtitle)}
            </p>
          </motion.div>

          {/* Main Calculator Shell */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[2rem] border border-neutral-200 dark:border-line bg-white dark:bg-[#0E1528] shadow-elevated overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Console: Coordinates / Presets / Dynamic Categories / Fare Output */}
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 border-b lg:border-b-0 lg:border-l rtl:lg:border-l rtl:lg:border-r-0 ltr:lg:border-r ltr:lg:border-l-0 border-neutral-200 dark:border-line">
                <div className="space-y-4">
                  {/* Single Calm Guided Step Header + Clear All */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-brand/10 dark:bg-brand-lime/15 text-brand dark:text-brand-lime flex items-center justify-center shrink-0">
                        <Route className="w-4 h-4" />
                      </div>
                      <p className="text-xs sm:text-sm font-black text-neutral-900 dark:text-ink truncate">
                        {guidedStepHint}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {categoriesData?.governorate ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand/10 dark:bg-brand-lime/15 text-brand dark:text-brand-lime text-[11px] font-bold">
                          <MapPin className="w-3 h-3" />
                          <span>{categoriesData.governorate}</span>
                        </span>
                      ) : null}

                      {pickup || destination || selectedCategoryId || estimateResult ? (
                        <button
                          type="button"
                          onClick={handleResetAll}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800/50 bg-rose-50/80 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-[11px] font-bold hover:bg-rose-100 dark:hover:bg-rose-950/50 transition cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{isAr ? 'مسح الكل' : 'Clear all'}</span>
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Clean Ride-App Style Connected Route Search Card (Pickup & Destination) */}
                  <div ref={rideBoxRef} className="relative">
                    <div className="rounded-2xl border border-neutral-200 dark:border-line bg-neutral-50/80 dark:bg-[#141D35] overflow-hidden shadow-subtle">
                      {/* Row 1: Pickup Search Input + GPS My Location + Clear */}
                      <div
                        className={`relative flex items-center gap-2.5 px-3.5 py-3 transition-colors ${
                          showMap && activeSelection === 'pickup'
                            ? 'bg-brand/[0.04] dark:bg-brand-lime/[0.06]'
                            : ''
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full shrink-0 transition-transform ${
                            pickup
                              ? 'bg-brand ring-4 ring-brand/15'
                              : activeSelection === 'pickup'
                                ? 'border-2 border-brand bg-white dark:bg-[#0E1528] scale-110'
                                : 'border-2 border-neutral-400 dark:border-ink-subtle bg-transparent'
                          }`}
                        />

                        <div className="flex-1 min-w-0">
                          <label
                            htmlFor="calc-pickup-search"
                            className="block text-[10px] font-black text-neutral-400 dark:text-ink-subtle mb-0.5"
                          >
                            {pick(data.labels?.pickupPoint)}
                          </label>
                          <div className="relative flex items-center">
                            <input
                              ref={pickupInputRef}
                              id="calc-pickup-search"
                              type="text"
                              autoComplete="off"
                              value={pickupQuery}
                              placeholder={
                                showMap
                                  ? isAr
                                    ? 'اكتب اسم المكان أو اضغط الخريطة...'
                                    : 'Search pickup or tap the map...'
                                  : isAr
                                    ? 'ابحث عن مكان الانطلاق...'
                                    : 'Search pickup place...'
                              }
                              onFocus={() =>
                                triggerPlaceSearch(
                                  'pickup',
                                  pickup && pickupQuery === pickupName ? '' : pickupQuery
                                )
                              }
                              onClick={() => {
                                setActiveSelection('pickup');
                                if (openSearchField !== 'pickup') {
                                  triggerPlaceSearch(
                                    'pickup',
                                    pickup && pickupQuery === pickupName ? '' : pickupQuery
                                  );
                                }
                              }}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPickupQuery(val);
                                triggerPlaceSearch('pickup', val);
                              }}
                              className="w-full bg-transparent text-sm font-bold text-neutral-900 dark:text-ink placeholder:font-medium placeholder:text-neutral-400 dark:placeholder:text-ink-subtle focus:outline-none truncate"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={handleLocateMe}
                            disabled={isLocating}
                            title={isAr ? 'استخدام موقعي الحالي' : 'Use my current location'}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-black bg-white dark:bg-[#0E1528] border border-neutral-200 dark:border-line text-brand dark:text-brand-lime hover:border-brand/50 transition cursor-pointer disabled:opacity-50 shadow-xs"
                          >
                            {isLocating ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <LocateFixed className="w-3.5 h-3.5" />
                            )}
                            <span>{isAr ? 'موقعي' : 'My location'}</span>
                          </button>

                          {pickup || pickupQuery ? (
                            <button
                              type="button"
                              onClick={() => {
                                handleClearPickup();
                                setOpenSearchField(null);
                                pickupInputRef.current?.focus();
                              }}
                              title={isAr ? 'مسح الانطلاق' : 'Clear pickup'}
                              aria-label={isAr ? 'مسح نقطة الانطلاق' : 'Clear pickup'}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          ) : null}
                        </div>
                      </div>

                      {/* Subtle Divider with Clean Floating Swap Icon */}
                      <div className="relative h-px bg-neutral-200 dark:bg-line ms-9">
                        <motion.button
                          type="button"
                          onClick={handleSwapRoute}
                          animate={{ rotate: swapRotation }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          disabled={!pickup && !destination}
                          title={isAr ? 'تبديل الانطلاق والوجهة' : 'Swap pickup & destination'}
                          aria-label={isAr ? 'تبديل المسار' : 'Swap Route'}
                          className="absolute top-1/2 -translate-y-1/2 end-3.5 w-8 h-8 rounded-full bg-white dark:bg-[#0E1528] border border-neutral-200 dark:border-line shadow-subtle flex items-center justify-center text-neutral-600 dark:text-ink-muted hover:text-brand dark:hover:text-brand-lime hover:border-brand/50 transition cursor-pointer disabled:opacity-35 z-10"
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>

                      {/* Row 2: Destination Search Input + Clear */}
                      <div
                        className={`relative flex items-center gap-2.5 px-3.5 py-3 transition-colors ${
                          showMap && activeSelection === 'destination'
                            ? 'bg-brand-lime/[0.1] dark:bg-brand-lime/[0.08]'
                            : ''
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-sm shrink-0 transition-transform ${
                            destination
                              ? 'bg-brand-lime ring-4 ring-brand-lime/25'
                              : activeSelection === 'destination'
                                ? 'border-2 border-brand-lime bg-white dark:bg-[#0E1528] scale-110'
                                : 'border-2 border-neutral-400 dark:border-ink-subtle bg-transparent'
                          }`}
                        />

                        <div className="flex-1 min-w-0">
                          <label
                            htmlFor="calc-destination-search"
                            className="block text-[10px] font-black text-neutral-400 dark:text-ink-subtle mb-0.5"
                          >
                            {pick(data.labels?.destination)}
                          </label>
                          <div className="relative flex items-center">
                            <input
                              ref={destinationInputRef}
                              id="calc-destination-search"
                              type="text"
                              autoComplete="off"
                              value={destinationQuery}
                              placeholder={
                                showMap
                                  ? isAr
                                    ? 'اكتب اسم وجهتك أو اضغط الخريطة...'
                                    : 'Search destination or tap the map...'
                                  : isAr
                                    ? 'ابحث عن وجهتك...'
                                    : 'Search destination...'
                              }
                              onFocus={() =>
                                triggerPlaceSearch(
                                  'destination',
                                  destination && destinationQuery === destinationName
                                    ? ''
                                    : destinationQuery
                                )
                              }
                              onClick={() => {
                                setActiveSelection('destination');
                                if (openSearchField !== 'destination') {
                                  triggerPlaceSearch(
                                    'destination',
                                    destination && destinationQuery === destinationName
                                      ? ''
                                      : destinationQuery
                                  );
                                }
                              }}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDestinationQuery(val);
                                triggerPlaceSearch('destination', val);
                              }}
                              className="w-full bg-transparent text-sm font-bold text-neutral-900 dark:text-ink placeholder:font-medium placeholder:text-neutral-400 dark:placeholder:text-ink-subtle focus:outline-none truncate"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {destination || destinationQuery ? (
                            <button
                              type="button"
                              onClick={() => {
                                handleClearDestination();
                                setOpenSearchField(null);
                                destinationInputRef.current?.focus();
                              }}
                              title={isAr ? 'مسح الوجهة' : 'Clear destination'}
                              aria-label={isAr ? 'مسح الوجهة' : 'Clear destination'}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Friendly Place Autocomplete Dropdown */}
                    {openSearchField && (placeSuggestions.length > 0 || isSearchingPlaces) ? (
                      <div
                        role="listbox"
                        aria-label={isAr ? 'اقتراحات الأماكن' : 'Place suggestions'}
                        className="absolute inset-x-0 top-full mt-1.5 z-30 rounded-2xl border border-neutral-200 dark:border-line bg-white dark:bg-[#10182C] shadow-elevated overflow-hidden max-h-60 overflow-y-auto"
                      >
                        <div className="px-3.5 py-2 border-b border-neutral-100 dark:border-line flex items-center justify-between text-[11px] font-bold text-neutral-400 dark:text-ink-subtle bg-neutral-50/70 dark:bg-[#0E1528]">
                          <span className="inline-flex items-center gap-1.5">
                            <Search className="w-3 h-3" />
                            <span>
                              {openSearchField === 'pickup'
                                ? isAr
                                  ? 'اختر نقطة الانطلاق أو اضغط الخريطة'
                                  : 'Choose pickup or tap the map'
                                : isAr
                                  ? 'اختر وجهتك أو اضغط الخريطة'
                                  : 'Choose destination or tap the map'}
                            </span>
                          </span>
                          {isSearchingPlaces ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-brand dark:text-brand-lime" />
                          ) : null}
                        </div>

                        {placeSuggestions.map((item) => (
                          <button
                            key={`${openSearchField}-${item.id}`}
                            type="button"
                            role="option"
                            aria-selected={false}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handlePickSuggestion(openSearchField, item);
                            }}
                            onClick={() => handlePickSuggestion(openSearchField, item)}
                            className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-right rtl:text-right ltr:text-left hover:bg-neutral-100/80 dark:hover:bg-white/5 transition border-b last:border-b-0 border-neutral-100 dark:border-line/60 cursor-pointer"
                          >
                            <div className="w-7 h-7 rounded-lg bg-brand/10 dark:bg-brand-lime/15 text-brand dark:text-brand-lime flex items-center justify-center shrink-0">
                              <MapPin className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-black text-neutral-900 dark:text-ink truncate">
                                {item.label}
                              </div>
                              {item.subtitle ? (
                                <div className="text-[10px] font-medium text-neutral-500 dark:text-ink-subtle truncate">
                                  {item.subtitle}
                                </div>
                              ) : null}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {/* Quick One-Tap Popular Routes */}
                  {quickPresets.length > 0 ? (
                    <div>
                      <span className="block text-[11px] font-bold text-neutral-400 dark:text-ink-subtle mb-2">
                        {pick(data.labels?.presetsTitle)}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {quickPresets.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleQuickPreset(preset.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border bg-neutral-50 dark:bg-[#141D35] text-neutral-700 dark:text-ink-muted border-neutral-200 dark:border-line hover:border-brand/50 dark:hover:border-brand-lime/50 hover:text-brand dark:hover:text-brand-lime"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Raw Coordinate Inputs (Only rendered when dynamic.showMap === false) */}
                  {isManualCoordsVisible ? (
                    <div className="rounded-2xl bg-neutral-50/90 dark:bg-[#141D35] border border-neutral-200 dark:border-line p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-en">
                      <div>
                        <label
                          htmlFor="calc-pickup-lat"
                          className="block text-[10px] font-bold text-neutral-400 dark:text-ink-subtle mb-1"
                        >
                          Pickup Lat
                        </label>
                        <input
                          id="calc-pickup-lat"
                          type="number"
                          step="any"
                          placeholder="24.7136"
                          value={coordInputs.pickupLat}
                          onChange={(e) => handleManualCoordChange('pickupLat', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#0E1528] border border-neutral-200 dark:border-line text-neutral-900 dark:text-ink focus:outline-none focus:border-brand dark:focus:border-brand-lime"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="calc-pickup-lng"
                          className="block text-[10px] font-bold text-neutral-400 dark:text-ink-subtle mb-1"
                        >
                          Pickup Lng
                        </label>
                        <input
                          id="calc-pickup-lng"
                          type="number"
                          step="any"
                          placeholder="46.6753"
                          value={coordInputs.pickupLng}
                          onChange={(e) => handleManualCoordChange('pickupLng', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#0E1528] border border-neutral-200 dark:border-line text-neutral-900 dark:text-ink focus:outline-none focus:border-brand dark:focus:border-brand-lime"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="calc-dest-lat"
                          className="block text-[10px] font-bold text-neutral-400 dark:text-ink-subtle mb-1"
                        >
                          Dest Lat
                        </label>
                        <input
                          id="calc-dest-lat"
                          type="number"
                          step="any"
                          placeholder="24.8000"
                          value={coordInputs.destLat}
                          onChange={(e) => handleManualCoordChange('destLat', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#0E1528] border border-neutral-200 dark:border-line text-neutral-900 dark:text-ink focus:outline-none focus:border-brand dark:focus:border-brand-lime"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="calc-dest-lng"
                          className="block text-[10px] font-bold text-neutral-400 dark:text-ink-subtle mb-1"
                        >
                          Dest Lng
                        </label>
                        <input
                          id="calc-dest-lng"
                          type="number"
                          step="any"
                          placeholder="46.7000"
                          value={coordInputs.destLng}
                          onChange={(e) => handleManualCoordChange('destLng', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#0E1528] border border-neutral-200 dark:border-line text-neutral-900 dark:text-ink focus:outline-none focus:border-brand dark:focus:border-brand-lime"
                        />
                      </div>
                    </div>
                  ) : null}

                  {geoWarning ? (
                    <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 px-3.5 py-2 text-xs text-amber-900 dark:text-amber-200">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{geoWarning}</span>
                    </div>
                  ) : null}

                  {/* Dynamic Ride Categories from GET /website/fare-calculator/categories */}
                  <div>
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <span className="text-[11px] font-bold text-neutral-400 dark:text-ink-subtle">
                        {pick(
                          dynLabels?.selectCategory,
                          pick(data.labels?.selectClass)
                        )}
                      </span>
                      {isLoadingCategories ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand dark:text-brand-lime">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>{isAr ? 'جارٍ تحميل الفئات...' : 'Loading categories...'}</span>
                        </span>
                      ) : null}
                    </div>

                    {!pickup ? (
                      <div className="rounded-2xl border border-dashed border-neutral-200 dark:border-line p-4 text-center text-xs font-bold text-neutral-500 dark:text-ink-muted">
                        {pick(
                          dynLabels?.selectPickup,
                          isAr ? 'حدد نقطة الانطلاق أولًا لعرض الفئات المتاحة' : 'Select pickup first to load available ride categories'
                        )}
                      </div>
                    ) : categoriesError ? (
                      <div className="rounded-2xl border border-rose-200 dark:border-rose-800/50 bg-rose-50/70 dark:bg-rose-950/20 p-3.5 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{categoriesError}</span>
                      </div>
                    ) : isLoadingCategories && visibleCategories.length === 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[0, 1, 2].map((idx) => (
                          <div
                            key={idx}
                            className="h-20 rounded-2xl border border-neutral-200 dark:border-line bg-neutral-100/70 dark:bg-[#141D35] animate-pulse"
                          />
                        ))}
                      </div>
                    ) : visibleCategories.length === 0 ? (
                      <div className="rounded-2xl border border-neutral-200 dark:border-line bg-neutral-50 dark:bg-[#141D35] p-4 text-center text-xs font-bold text-neutral-500 dark:text-ink-muted">
                        {pick(
                          dynLabels?.noCategories,
                          isAr ? 'لا توجد فئات متاحة في هذه المنطقة' : 'No categories available in this area'
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {visibleCategories.map((cat) => {
                          const isDisabled = !cat.available || !cat.configured;
                          const isSelected = !isDisabled && selectedCategoryId === cat.id;
                          const catName = getCategoryDisplayName(cat);
                          const hasImg = Boolean(cat.imageUrl && isSafeHref(cat.imageUrl));

                          return (
                            <button
                              key={cat.id}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => handleCategorySelect(cat)}
                              className={`relative p-3 rounded-2xl border-2 text-right rtl:text-right ltr:text-left transition-all overflow-hidden ${
                                isDisabled
                                  ? 'border-neutral-200/70 dark:border-line/60 bg-neutral-100/60 dark:bg-[#10182C]/60 opacity-55 cursor-not-allowed'
                                  : isSelected
                                    ? 'border-brand dark:border-brand-lime bg-brand/5 dark:bg-brand-lime/10 shadow-sm cursor-pointer'
                                    : 'border-neutral-200 dark:border-line bg-white dark:bg-[#141D35] hover:border-brand/40 dark:hover:border-primary-token/40 cursor-pointer'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <span
                                  className={`text-xs font-black truncate ${
                                    isSelected
                                      ? 'text-brand dark:text-brand-lime'
                                      : 'text-neutral-800 dark:text-ink'
                                  }`}
                                >
                                  {catName}
                                </span>
                                {hasImg ? (
                                  <Image
                                    src={cat.imageUrl as string}
                                    alt={catName}
                                    width={28}
                                    height={20}
                                    unoptimized
                                    className="w-7 h-5 object-contain shrink-0 rounded"
                                  />
                                ) : null}
                              </div>

                              {cat.description ? (
                                <p className="text-[10px] text-neutral-500 dark:text-ink-subtle line-clamp-2 leading-snug">
                                  {cat.description}
                                </p>
                              ) : null}

                              {isDisabled ? (
                                <span className="mt-1.5 inline-block text-[9px] font-bold text-neutral-500 dark:text-ink-subtle">
                                  {isAr ? 'غير متاحة في هذه المدينة' : 'Unavailable here'}
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Estimate Error Banner (Never falls back to stale fare) */}
                  {estimateError ? (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 px-3.5 py-2.5 text-xs font-bold text-rose-800 dark:text-rose-200 leading-relaxed"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{estimateError}</span>
                    </div>
                  ) : null}
                </div>

                {/* Bottom Total + App CTA + Dynamic Disclaimer */}
                <div className="pt-5 border-t border-neutral-200/80 dark:border-line space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-right rtl:text-right ltr:text-left w-full sm:w-auto">
                      <span className="text-xs font-bold text-neutral-400 dark:text-ink-subtle block">
                        {pick(
                          dynLabels?.total,
                          isAr ? 'السعر التقديري شامل الضريبة' : 'Estimated total including VAT'
                        )}
                      </span>

                      <div className="flex items-baseline gap-2 flex-wrap mt-0.5">
                        {isEstimating ? (
                          <span className="text-sm font-bold text-brand dark:text-brand-lime inline-flex items-center gap-1.5">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>
                              {pick(
                                dynLabels?.loading,
                                isAr ? 'جارٍ حساب السعر والمسار' : 'Calculating route and fare'
                              )}
                            </span>
                          </span>
                        ) : estimateResult ? (
                          <>
                            <AnimatePresence mode="wait">
                              <motion.span
                                key={`${estimateResult.price}-${estimateResult.calculatedAt}`}
                                initial={{ opacity: 0.5, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                                className="text-2xl sm:text-3xl font-black text-brand dark:text-brand-lime font-en"
                              >
                                {formatPrice(estimateResult.price)} {estimateResult.currency}
                              </motion.span>
                            </AnimatePresence>
                            {estimateResult.includesVat ? (
                              <span className="text-[11px] text-neutral-500 dark:text-ink-subtle">
                                {pick(data.labels?.vatNote)}
                              </span>
                            ) : null}
                          </>
                        ) : (
                          <span className="text-sm font-bold text-neutral-400 dark:text-ink-subtle">
                            —
                          </span>
                        )}
                      </div>
                    </div>

                    <MagneticButton strength={0.22} className="w-full sm:w-auto" as="div">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto py-4 px-7 rounded-2xl bg-brand hover:bg-brand-dark dark:bg-brand-lime dark:hover:bg-[#e1e848] text-white dark:text-neutral-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-brand-glow dark:hover:shadow-lime-glow transition-all cursor-pointer group"
                      >
                        <Smartphone className="w-4 h-4 text-brand-lime dark:text-neutral-950" />
                        <span>{pick(data.labels?.cta)}</span>
                        <ArrowIcon
                          className={`w-4 h-4 text-brand-lime dark:text-neutral-950 transition-transform ${
                            isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                          }`}
                        />
                      </button>
                    </MagneticButton>
                  </div>

                  {/* Dynamic Disclaimer from CMS (under Estimated Price) */}
                  <div className="flex items-start gap-2 rounded-xl bg-amber-50/80 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/40 px-3.5 py-2.5 text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>
                      {pick(
                        dynLabels?.disclaimer,
                        isAr
                          ? 'السعر تقديري وفق التعريفة الحالية. يتم تأكيد السعر والحجز داخل التطبيق.'
                          : 'Estimate based on the current tariff. Final price and booking are confirmed in the app.'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Panel: Interactive Map (unless showMap=false) + Route Metrics & VAT Breakdown */}
              <div className="lg:col-span-6 bg-gradient-to-br from-[#0E152B] via-[#130C47] to-[#080C18] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-5 relative overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(rgba(211, 217, 60, 0.35) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-brand/30 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-brand-lime/15 blur-3xl pointer-events-none" />

                {/* Top Route Badges (Strictly from actual estimate response) */}
                <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
                    <span>{pick(data.labels?.radarBadge)}</span>
                  </div>

                  {estimateResult ? (
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-neutral-200 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-lime" />
                        <span>
                          {pick(dynLabels?.duration, isAr ? 'المدة' : 'Duration')}:{' '}
                          <strong className="font-en">
                            ~{Math.round(estimateResult.route.durationMinutes)}{' '}
                            {isAr ? 'د' : 'min'}
                          </strong>
                        </span>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-brand-lime text-neutral-950 font-black font-en">
                        {estimateResult.route.distanceKm.toFixed(1)} KM
                      </span>
                    </div>
                  ) : null}
                </div>

                {/* Interactive Map (Hidden visually when dynamic.showMap === false) */}
                {showMap ? (
                  <div ref={mapFrameRef} className="relative z-10">
                    <FareRouteMap
                      pickup={pickup}
                      destination={destination}
                      activeSelection={activeSelection}
                      onActiveSelectionChange={setActiveSelection}
                      onPickupChange={(pt) => handlePickupUpdate(pt)}
                      onDestinationChange={(pt) => handleDestinationUpdate(pt)}
                      onClearPickup={handleClearPickup}
                      onClearDestination={handleClearDestination}
                      onClearAll={handleResetAll}
                      routeGeometry={estimateResult?.route?.geometry || null}
                      serviceArea={dynamicConfig.serviceArea}
                      pickupLabel={pick(data.labels?.pickupPoint)}
                      destinationLabel={pick(data.labels?.destination)}
                      selectPickupPrompt={pick(
                        dynLabels?.selectPickup,
                        isAr ? 'حدد نقطة الانطلاق على الخريطة' : 'Select pickup on the map'
                      )}
                      selectDestinationPrompt={pick(
                        dynLabels?.selectDestination,
                        isAr ? 'حدد وجهتك على الخريطة' : 'Select destination on the map'
                      )}
                      isLoading={isEstimating || isLoadingCategories}
                    />
                  </div>
                ) : (
                  <div className="relative z-10 rounded-3xl bg-[#070B16]/75 border border-white/10 p-6 text-center space-y-2">
                    <Route className="w-8 h-8 text-brand-lime mx-auto opacity-85" />
                    <p className="text-sm font-black text-white">
                      {pick(data.labels?.radarBadge)}
                    </p>
                    <p className="text-xs text-neutral-300 max-w-md mx-auto">
                      {isAr
                        ? 'أدخل إحداثيات الانطلاق والوجهة أو اختر من المسارات السريعة لعرض المسافة والتكلفة التقديرية.'
                        : 'Enter pickup and destination coordinates or pick a quick route to view the estimated distance and fare.'}
                    </p>
                  </div>
                )}

                {/* Result Summary & Optional VAT Breakdown */}
                <div className="relative z-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-5 space-y-3">
                  {estimateResult ? (
                    <>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-xl bg-[#070B16]/60 border border-white/10 p-2.5">
                          <span className="block text-[10px] text-neutral-300 font-bold mb-1">
                            {pick(dynLabels?.distance, isAr ? 'المسافة' : 'Distance')}
                          </span>
                          <span className="text-sm sm:text-base font-black text-white font-en">
                            {estimateResult.route.distanceKm.toFixed(1)} KM
                          </span>
                        </div>

                        <div className="rounded-xl bg-[#070B16]/60 border border-white/10 p-2.5">
                          <span className="block text-[10px] text-neutral-300 font-bold mb-1">
                            {pick(dynLabels?.duration, isAr ? 'مدة الرحلة' : 'Duration')}
                          </span>
                          <span className="text-sm sm:text-base font-black text-white">
                            ~{Math.round(estimateResult.route.durationMinutes)}{' '}
                            {isAr ? 'دقيقة' : 'min'}
                          </span>
                        </div>

                        <div className="rounded-xl bg-brand-lime/15 border border-brand-lime/40 p-2.5">
                          <span className="block text-[10px] text-brand-lime font-bold mb-1">
                            {pick(dynLabels?.total, isAr ? 'الإجمالي' : 'Total')}
                          </span>
                          <span className="text-sm sm:text-base font-black text-brand-lime font-en">
                            {formatPrice(estimateResult.price)} {estimateResult.currency}
                          </span>
                        </div>
                      </div>

                      {showBreakdown && estimateResult.breakdown ? (
                        <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-neutral-300">
                            <span className="inline-flex items-center gap-1.5">
                              <Receipt className="w-3.5 h-3.5 text-brand-lime" />
                              <span>{isAr ? 'الأجرة قبل الضريبة' : 'Fare before VAT'}</span>
                            </span>
                            <span className="font-bold font-en">
                              {formatPrice(estimateResult.breakdown.fareBeforeVat)}{' '}
                              {estimateResult.currency}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-neutral-300">
                            <span>{isAr ? 'ضريبة القيمة المضافة' : 'VAT'}</span>
                            <span className="font-bold font-en">
                              {formatPrice(estimateResult.breakdown.vatAmount)}{' '}
                              {estimateResult.currency}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-white font-black pt-1 border-t border-white/10">
                            <span>{pick(dynLabels?.total, isAr ? 'الإجمالي' : 'Total')}</span>
                            <span className="text-brand-lime font-en">
                              {formatPrice(estimateResult.breakdown.total)}{' '}
                              {estimateResult.currency}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="flex items-center justify-between gap-3 text-xs text-neutral-300">
                      <div className="min-w-0">
                        <span className="block font-black text-white mb-0.5">
                          {selectedCategory
                            ? getCategoryDisplayName(selectedCategory)
                            : pick(
                                dynLabels?.selectCategory,
                                isAr ? 'اختر فئة الرحلة' : 'Choose a ride category'
                              )}
                        </span>
                        <span className="text-[11px] text-neutral-300">
                          {!pickup
                            ? pick(
                                dynLabels?.selectPickup,
                                isAr ? 'حدد نقطة الانطلاق على الخريطة' : 'Select pickup on the map'
                              )
                            : !destination
                              ? pick(
                                  dynLabels?.selectDestination,
                                  isAr
                                    ? 'حدد وجهتك على الخريطة'
                                    : 'Select destination on the map'
                                )
                              : isEstimating
                                ? pick(
                                    dynLabels?.loading,
                                    isAr
                                      ? 'جارٍ حساب السعر والمسار'
                                      : 'Calculating route and fare'
                                  )
                                : pick(
                                    dynLabels?.calculateButton,
                                    isAr ? 'اضغط لحساب السعر والمسار' : 'Click to estimate fare'
                                  )}
                        </span>
                      </div>
                      <Sparkles className="w-5 h-5 text-brand-lime shrink-0" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {trustStrip.length > 0 || tgaLicense ? (
              <div className="bg-neutral-50 dark:bg-[#0A0F1D] border-t border-neutral-200 dark:border-line px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-600 dark:text-ink-muted">
                {trustStrip.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 font-bold">
                    <CmsIcon
                      name={item.icon}
                      className="w-4 h-4 text-brand dark:text-brand-lime shrink-0"
                    />
                    <span>{pick(item.text)}</span>
                  </div>
                ))}
                {tgaLicense ? (
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-en">TGA #{tgaLicense}</span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </motion.div>
        </div>
      </section>

      <AppRedirectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pickup={pickupName || formatPointLabel(pickup)}
        destination={destinationName || formatPointLabel(destination)}
        vehicleName={getCategoryDisplayName(selectedCategory)}
        startingPriceLabel={estimatedPriceLabel}
      />
    </>
  );
};

/* -------------------------------------------------------------------------- */
/*  Mode 4: Legacy Pre-Migration Preview (only if backend `dynamic` absent)   */
/* -------------------------------------------------------------------------- */

const LegacyPreMigrationFareCalculator: React.FC<{ data: FareCalculatorContent }> = ({ data }) => {
  const { locale, isRtl, pick } = useLanguage();
  const { sections, site } = useWebsiteConfig();
  const isAr = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const fleetCategories = useMemo(
    () => (sections.fleet_categories?.categories || []).filter((c) => c.isEnabled !== false),
    [sections.fleet_categories]
  );

  const presets = useMemo(
    () => (data.presets || []).filter((p) => p.isEnabled !== false),
    [data.presets]
  );
  const vehicleClasses = useMemo(() => data.vehicleClasses || [], [data.vehicleClasses]);

  const [activePresetId, setActivePresetId] = useState<string>('');
  const [customPickup, setCustomPickup] = useState<string | null>(null);
  const [customDestination, setCustomDestination] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [isSwapped, setIsSwapped] = useState<boolean>(false);
  const [swapRotation, setSwapRotation] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const activePreset = useMemo(
    () => presets.find((p) => p.id === activePresetId) || presets[0] || null,
    [presets, activePresetId]
  );

  const resolvedVehicleId = useMemo(() => {
    if (selectedVehicleId && vehicleClasses.some((v) => v.id === selectedVehicleId)) {
      return selectedVehicleId;
    }
    const favorite = vehicleClasses.find((v) => v.isFavorite);
    return favorite?.id || vehicleClasses[0]?.id || '';
  }, [selectedVehicleId, vehicleClasses]);

  const selectedVehicle = useMemo(
    () => vehicleClasses.find((v) => v.id === resolvedVehicleId) || vehicleClasses[0] || null,
    [vehicleClasses, resolvedVehicleId]
  );

  const activeCategoryData = useMemo(
    () => fleetCategories.find((c) => c.id === resolvedVehicleId) || fleetCategories[0] || null,
    [fleetCategories, resolvedVehicleId]
  );

  const defaultPickup = activePreset
    ? pick(isSwapped ? activePreset.destination : activePreset.pickup)
    : '';
  const defaultDestination = activePreset
    ? pick(isSwapped ? activePreset.pickup : activePreset.destination)
    : '';

  const pickup = customPickup !== null ? customPickup : defaultPickup;
  const destination = customDestination !== null ? customDestination : defaultDestination;

  const trustStrip = (data.trustStrip || []).filter((item) => item.isEnabled !== false);
  const savingsBadgeText =
    data.savingsBadge && data.savingsBadge.isEnabled !== false
      ? pick(data.savingsBadge.text)
      : '';
  const favoriteBadgeText = pick(data.favoriteBadge, isAr ? 'المفضل' : 'Top');
  const demoNoticeText = pick(data.demoNotice);
  const tgaLicense = (site?.company?.tgaLicense || '').trim();

  const selectedVehicleName = selectedVehicle ? pick(selectedVehicle.name) : '';
  const selectedStartingPrice = activeCategoryData ? pick(activeCategoryData.startingPrice) : '';
  const startingFromLabel = pick(
    sections.fleet_categories?.labels?.startingFrom,
    isAr ? 'يبدأ المشوار من' : 'Starting from'
  );
  const categoryImgUrl =
    activeCategoryData?.image?.url && isSafeHref(activeCategoryData.image.url)
      ? activeCategoryData.image.url
      : '/hero-bg-kowa.jpg';

  const handleSelectPreset = (preset: FareCalculatorPreset) => {
    setActivePresetId(preset.id);
    setCustomPickup(null);
    setCustomDestination(null);
    setIsSwapped(false);
  };

  const handleSwapRoute = () => {
    setSwapRotation((prev) => prev + 180);
    if (customPickup !== null || customDestination !== null) {
      const prevPickup = pickup;
      const prevDest = destination;
      setCustomPickup(prevDest);
      setCustomDestination(prevPickup);
    } else {
      setIsSwapped((prev) => !prev);
    }
  };

  return (
    <>
      <section
        id="fare-calculator"
        className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50/60 dark:from-[#0A0F1D] dark:via-[#0C1222] dark:to-[#0A0F1D] py-16 lg:py-24 border-b border-neutral-200 dark:border-line transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/5 dark:bg-brand-lime/10 border border-brand/15 dark:border-brand-lime/20 text-brand dark:text-brand-lime text-xs font-black tracking-wide mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
              <span>{pick(data.badge)}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-ink leading-tight mb-4">
              {pick(data.headline?.lead)}{' '}
              <span className="text-brand dark:text-brand-lime">
                {pick(data.headline?.highlight)}
              </span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-ink-muted leading-relaxed max-w-2xl mx-auto">
              {pick(data.subtitle)}
            </p>
          </div>

          <div className="rounded-[2rem] border border-neutral-200 dark:border-line bg-white dark:bg-[#0E1528] shadow-elevated overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 border-b lg:border-b-0 lg:border-l rtl:lg:border-l rtl:lg:border-r-0 ltr:lg:border-r ltr:lg:border-l-0 border-neutral-200 dark:border-line">
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-brand/10 dark:bg-brand-lime/15 text-brand dark:text-brand-lime flex items-center justify-center">
                        <Route className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-black text-neutral-900 dark:text-ink">
                        {pick(data.labels?.consoleHeader)}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 text-[11px] font-bold">
                      <Lock className="w-3 h-3" />
                      <span>{pick(data.labels?.surgeLock)}</span>
                    </span>
                  </div>

                  {presets.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {presets.map((preset) => {
                        const isActive =
                          activePreset?.id === preset.id &&
                          customPickup === null &&
                          customDestination === null;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPreset(preset)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              isActive
                                ? 'bg-brand dark:bg-brand-lime text-white dark:text-neutral-950 border-brand dark:border-brand-lime shadow-sm'
                                : 'bg-neutral-50 dark:bg-[#141D35] text-neutral-600 dark:text-ink-muted border-neutral-200 dark:border-line'
                            }`}
                          >
                            {pick(preset.label)}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  <div className="relative rounded-2xl bg-neutral-50/90 dark:bg-[#141D35] border border-neutral-200 dark:border-line p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand/10 dark:bg-primary-token/20 text-brand dark:text-brand-lime flex items-center justify-center shrink-0">
                        <Navigation className="w-4 h-4" />
                      </div>
                      <input
                        id="legacy-calc-pickup"
                        type="text"
                        value={pickup}
                        onChange={(e) => setCustomPickup(e.target.value)}
                        className="w-full bg-transparent border-0 p-0 text-sm font-bold text-neutral-900 dark:text-ink focus:outline-none truncate"
                      />
                    </div>
                    <div className="flex items-center justify-end">
                      <motion.button
                        type="button"
                        onClick={handleSwapRoute}
                        animate={{ rotate: swapRotation }}
                        className="w-8 h-8 rounded-full bg-white dark:bg-[#10182C] border border-neutral-200 dark:border-line flex items-center justify-center text-neutral-600 dark:text-ink-muted cursor-pointer"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-lime text-neutral-950 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        id="legacy-calc-dest"
                        type="text"
                        value={destination}
                        onChange={(e) => setCustomDestination(e.target.value)}
                        className="w-full bg-transparent border-0 p-0 text-sm font-bold text-neutral-900 dark:text-ink focus:outline-none truncate"
                      />
                    </div>
                  </div>

                  {vehicleClasses.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <span className="text-[11px] font-bold text-neutral-400 dark:text-ink-subtle">
                          {pick(data.labels?.selectClass)}
                        </span>
                        {savingsBadgeText ? (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            {savingsBadgeText}
                          </span>
                        ) : null}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {vehicleClasses.map((v) => {
                          const isSelected = resolvedVehicleId === v.id;
                          const matchedCat = fleetCategories.find((c) => c.id === v.id);
                          const startingPrice = matchedCat ? pick(matchedCat.startingPrice) : '';
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => setSelectedVehicleId(v.id)}
                              className={`p-3.5 rounded-2xl border-2 text-right rtl:text-right ltr:text-left cursor-pointer ${
                                isSelected
                                  ? 'border-brand dark:border-brand-lime bg-brand/5 dark:bg-brand-lime/10'
                                  : 'border-neutral-200 dark:border-line bg-white dark:bg-[#141D35]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[11px] font-black truncate">{pick(v.name)}</span>
                                {v.isFavorite && favoriteBadgeText ? (
                                  <span className="text-[9px] bg-brand dark:bg-brand-lime text-white dark:text-neutral-950 px-1.5 py-0.5 rounded font-black">
                                    {favoriteBadgeText}
                                  </span>
                                ) : null}
                              </div>
                              {startingPrice ? (
                                <div className="text-sm font-black">{startingPrice}</div>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {demoNoticeText ? (
                    <div className="flex items-start gap-2 rounded-xl bg-amber-50/80 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/40 px-3.5 py-2.5 text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed">
                      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{demoNoticeText}</span>
                    </div>
                  ) : null}
                </div>

                <div className="pt-5 border-t border-neutral-200/80 dark:border-line flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-right rtl:text-right ltr:text-left w-full sm:w-auto">
                    <span className="text-xs font-bold text-neutral-400 dark:text-ink-subtle block">
                      {pick(data.labels?.finalFare)}
                    </span>
                    <div className="text-2xl font-black text-brand dark:text-brand-lime">
                      {selectedStartingPrice ? `${startingFromLabel} ${selectedStartingPrice}` : pick(data.labels?.surgeLock)}
                    </div>
                  </div>
                  <MagneticButton strength={0.22} className="w-full sm:w-auto" as="div">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full sm:w-auto py-4 px-7 rounded-2xl bg-brand hover:bg-brand-dark dark:bg-brand-lime dark:hover:bg-[#e1e848] text-white dark:text-neutral-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer group"
                    >
                      <Smartphone className="w-4 h-4 text-brand-lime dark:text-neutral-950" />
                      <span>{pick(data.labels?.cta)}</span>
                      <ArrowIcon className="w-4 h-4 text-brand-lime dark:text-neutral-950" />
                    </button>
                  </MagneticButton>
                </div>
              </div>

              <div className="lg:col-span-6 bg-gradient-to-br from-[#0E152B] via-[#130C47] to-[#080C18] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-brand-lime animate-ping" />
                    <span>{pick(data.labels?.radarBadge)}</span>
                  </div>
                  {activePreset ? (
                    <div className="flex items-center gap-2 text-xs font-bold font-en">
                      <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-neutral-200 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-lime" />
                        <span>~{activePreset.etaMin} MIN</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-brand-lime text-neutral-950 font-black">
                        {activePreset.km} KM
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-3xl bg-[#070B16]/75 border border-white/10 p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="text-neutral-300 font-bold truncate">{pickup}</span>
                    <span className="text-brand-lime font-bold truncate">{destination}</span>
                  </div>
                  {activeCategoryData ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-[11px] text-neutral-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Snowflake className="w-3.5 h-3.5 text-brand-lime" />
                        {pick(activeCategoryData.feature)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-brand-lime" />
                        {pick(activeCategoryData.capacity)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Wifi className="w-3.5 h-3.5 text-brand-lime" />
                        {pick(activeCategoryData.badge)}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/15 p-4 flex items-center gap-4">
                  <div className="relative w-24 h-20 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-[#0A0F1D]">
                    <Image
                      src={categoryImgUrl}
                      alt={selectedVehicleName}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="120px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center gap-1 bg-brand-lime text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded-full mb-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{pick(data.labels?.previewBadge)}</span>
                    </span>
                    <h3 className="text-sm font-black text-white truncate">
                      {activeCategoryData ? pick(activeCategoryData.title) : selectedVehicleName}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {trustStrip.length > 0 || tgaLicense ? (
              <div className="bg-neutral-50 dark:bg-[#0A0F1D] border-t border-neutral-200 dark:border-line px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-600 dark:text-ink-muted">
                {trustStrip.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 font-bold">
                    <CmsIcon
                      name={item.icon}
                      className="w-4 h-4 text-brand dark:text-brand-lime shrink-0"
                    />
                    <span>{pick(item.text)}</span>
                  </div>
                ))}
                {tgaLicense ? (
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-en">TGA #{tgaLicense}</span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <AppRedirectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pickup={pickup}
        destination={destination}
        vehicleName={selectedVehicleName}
        startingPriceLabel={
          selectedStartingPrice ? `${startingFromLabel} ${selectedStartingPrice}` : undefined
        }
      />
    </>
  );
};
