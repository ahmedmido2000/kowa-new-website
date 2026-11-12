'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import type LType from 'leaflet';
import { Check, Crosshair, Loader2, MapPin, Navigation, RotateCcw, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import type {
  EstimateFareRouteGeometry,
  FareCalculatorServiceArea,
  GeoPoint,
} from '@/types/website-cms';

interface FareRouteMapProps {
  pickup: GeoPoint | null;
  destination: GeoPoint | null;
  activeSelection: 'pickup' | 'destination';
  onActiveSelectionChange: (mode: 'pickup' | 'destination') => void;
  onPickupChange: (point: GeoPoint) => void;
  onDestinationChange: (point: GeoPoint) => void;
  onClearPickup?: () => void;
  onClearDestination?: () => void;
  onClearAll?: () => void;
  routeGeometry: EstimateFareRouteGeometry | null;
  serviceArea?: FareCalculatorServiceArea | null;
  pickupLabel: string;
  destinationLabel: string;
  selectPickupPrompt: string;
  selectDestinationPrompt: string;
  isLoading?: boolean;
}

const DEFAULT_CENTER: [number, number] = [24.7136, 46.6753];
const DEFAULT_ZOOM = 11;

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function roundCoord(value: number): number {
  return Number(value.toFixed(6));
}

export const FareRouteMap: React.FC<FareRouteMapProps> = ({
  pickup,
  destination,
  activeSelection,
  onActiveSelectionChange,
  onPickupChange,
  onDestinationChange,
  onClearPickup,
  onClearDestination,
  onClearAll,
  routeGeometry,
  serviceArea,
  pickupLabel,
  destinationLabel,
  selectPickupPrompt,
  selectDestinationPrompt,
  isLoading = false,
}) => {
  const { locale } = useLanguage();
  const { theme } = useTheme();
  const isAr = locale === 'ar';

  const [mapReadyTick, setMapReadyTick] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LType.Map | null>(null);
  const leafletRef = useRef<typeof LType | null>(null);
  const tileLayerRef = useRef<LType.TileLayer | null>(null);
  const pickupMarkerRef = useRef<LType.Marker | null>(null);
  const destinationMarkerRef = useRef<LType.Marker | null>(null);
  const routeGroupRef = useRef<LType.LayerGroup | null>(null);
  const serviceAreaLayerRef = useRef<LType.Rectangle | null>(null);

  const activeSelectionRef = useRef(activeSelection);
  const pickupRef = useRef(pickup);
  const destinationRef = useRef(destination);
  const onPickupChangeRef = useRef(onPickupChange);
  const onDestinationChangeRef = useRef(onDestinationChange);
  const onActiveSelectionChangeRef = useRef(onActiveSelectionChange);

  useEffect(() => {
    activeSelectionRef.current = activeSelection;
  }, [activeSelection]);

  useEffect(() => {
    pickupRef.current = pickup;
  }, [pickup]);

  useEffect(() => {
    destinationRef.current = destination;
  }, [destination]);

  useEffect(() => {
    onPickupChangeRef.current = onPickupChange;
  }, [onPickupChange]);

  useEffect(() => {
    onDestinationChangeRef.current = onDestinationChange;
  }, [onDestinationChange]);

  useEffect(() => {
    onActiveSelectionChangeRef.current = onActiveSelectionChange;
  }, [onActiveSelectionChange]);

  // Initialize Leaflet strictly on the browser client
  useEffect(() => {
    let isDisposed = false;

    async function initMap() {
      const container = containerRef.current;
      if (!container) return;

      const L = await import('leaflet');
      if (isDisposed || !containerRef.current) return;

      leafletRef.current = L;

      const map = L.map(containerRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: true,
      });

      L.control
        .zoom({
          position: 'bottomleft',
        })
        .addTo(map);

      tileLayerRef.current = L.tileLayer(TILE_URL, {
        maxZoom: 19,
        attribution: TILE_ATTRIBUTION,
      }).addTo(map);

      routeGroupRef.current = L.layerGroup().addTo(map);

      map.on('click', (event: LType.LeafletMouseEvent) => {
        const point: GeoPoint = {
          latitude: roundCoord(event.latlng.lat),
          longitude: roundCoord(event.latlng.lng),
        };
        if (activeSelectionRef.current === 'pickup') {
          onPickupChangeRef.current(point);
          if (!destinationRef.current) {
            onActiveSelectionChangeRef.current('destination');
          }
        } else {
          onDestinationChangeRef.current(point);
        }
      });

      mapRef.current = map;
      setMapReadyTick((tick) => tick + 1);
    }

    initMap();

    return () => {
      isDisposed = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      pickupMarkerRef.current = null;
      destinationMarkerRef.current = null;
      routeGroupRef.current = null;
      serviceAreaLayerRef.current = null;
      tileLayerRef.current = null;
      leafletRef.current = null;
    };
    // Initialize map once; Dark Mode tile styling uses CSS
  }, []);

  // Dark theme tile styling is handled via CSS `.dark .kowa-map-tiles .leaflet-tile-pane`

  // Draw optional serviceArea bounding rectangle
  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    if (serviceAreaLayerRef.current) {
      serviceAreaLayerRef.current.remove();
      serviceAreaLayerRef.current = null;
    }

    if (
      serviceArea &&
      Number.isFinite(serviceArea.south) &&
      Number.isFinite(serviceArea.north) &&
      Number.isFinite(serviceArea.west) &&
      Number.isFinite(serviceArea.east) &&
      serviceArea.south < serviceArea.north &&
      serviceArea.west < serviceArea.east
    ) {
      const bounds = L.latLngBounds(
        [serviceArea.south, serviceArea.west],
        [serviceArea.north, serviceArea.east]
      );
      serviceAreaLayerRef.current = L.rectangle(bounds, {
        color: '#634EEB',
        weight: 1.5,
        opacity: 0.45,
        dashArray: '6 6',
        fill: false,
        interactive: false,
      }).addTo(map);
    }
  }, [serviceArea, mapReadyTick]);

  // Sync pickup & destination markers
  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    const makeIcon = (variant: 'pickup' | 'destination') =>
      L.divIcon({
        className: 'kowa-map-pin-wrapper',
        html:
          variant === 'pickup'
            ? `<div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
                <span style="position:absolute;inset:0;border-radius:9999px;background:rgba(99,78,235,0.28);"></span>
                <span style="width:16px;height:16px;border-radius:9999px;background:#634EEB;border:3px solid #FFFFFF;box-shadow:0 3px 10px rgba(0,0,0,0.35);"></span>
              </div>`
            : `<div style="position:relative;width:30px;height:30px;display:flex;align-items:center;justify-content:center;">
                <span style="position:absolute;inset:0;border-radius:9999px;background:rgba(14,165,233,0.34);"></span>
                <span style="width:17px;height:17px;border-radius:9999px;background:#0EA5E9;border:3px solid #FFFFFF;box-shadow:0 3px 10px rgba(0,0,0,0.4);"></span>
              </div>`,
        iconSize: variant === 'pickup' ? [28, 28] : [30, 30],
        iconAnchor: variant === 'pickup' ? [14, 14] : [15, 15],
      });

    if (pickup) {
      const latLng: [number, number] = [pickup.latitude, pickup.longitude];
      if (!pickupMarkerRef.current) {
        const marker = L.marker(latLng, {
          icon: makeIcon('pickup'),
          draggable: true,
        }).addTo(map);
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          onPickupChangeRef.current({
            latitude: roundCoord(pos.lat),
            longitude: roundCoord(pos.lng),
          });
        });
        pickupMarkerRef.current = marker;
      } else {
        pickupMarkerRef.current.setLatLng(latLng);
      }
      pickupMarkerRef.current.bindTooltip(pickupLabel, { direction: 'top', offset: [0, -10] });
    } else if (pickupMarkerRef.current) {
      pickupMarkerRef.current.remove();
      pickupMarkerRef.current = null;
    }

    if (destination) {
      const latLng: [number, number] = [destination.latitude, destination.longitude];
      if (!destinationMarkerRef.current) {
        const marker = L.marker(latLng, {
          icon: makeIcon('destination'),
          draggable: true,
        }).addTo(map);
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          onDestinationChangeRef.current({
            latitude: roundCoord(pos.lat),
            longitude: roundCoord(pos.lng),
          });
        });
        destinationMarkerRef.current = marker;
      } else {
        destinationMarkerRef.current.setLatLng(latLng);
      }
      destinationMarkerRef.current.bindTooltip(destinationLabel, {
        direction: 'top',
        offset: [0, -10],
      });
    } else if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
      destinationMarkerRef.current = null;
    }
  }, [pickup, destination, pickupLabel, destinationLabel, mapReadyTick]);

  // Draw GeoJSON LineString route (strictly from backend Mapbox geometry — never straight-line fallback)
  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    const group = routeGroupRef.current;
    if (!map || !L || !group) return;

    group.clearLayers();

    if (
      routeGeometry &&
      routeGeometry.type === 'LineString' &&
      Array.isArray(routeGeometry.coordinates) &&
      routeGeometry.coordinates.length >= 2
    ) {
      // GeoJSON coordinates are [longitude, latitude]; Leaflet expects [latitude, longitude]
      const latLngs: [number, number][] = routeGeometry.coordinates
        .filter(
          (coord): coord is [number, number] =>
            Array.isArray(coord) &&
            coord.length >= 2 &&
            Number.isFinite(coord[0]) &&
            Number.isFinite(coord[1])
        )
        .map(([lng, lat]) => [lat, lng]);

      if (latLngs.length >= 2) {
        L.polyline(latLngs, {
          color: '#634EEB',
          weight: 9,
          opacity: 0.3,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(group);

        const mainRoute = L.polyline(latLngs, {
          color: theme === 'dark' ? '#FFFFFF' : '#2563EB',
          weight: 4.5,
          opacity: 0.96,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(group);

        map.fitBounds(mainRoute.getBounds(), { padding: [44, 44], maxZoom: 15 });
        return;
      }
    }

    // If no route yet, smoothly frame selected pins
    if (pickup && destination) {
      const pinBounds = L.latLngBounds(
        [pickup.latitude, pickup.longitude],
        [destination.latitude, destination.longitude]
      );
      map.fitBounds(pinBounds, { padding: [52, 52], maxZoom: 14 });
    } else if (pickup) {
      map.panTo([pickup.latitude, pickup.longitude]);
    } else if (destination) {
      map.panTo([destination.latitude, destination.longitude]);
    }
  }, [routeGeometry, pickup, destination, theme, mapReadyTick]);

  const handleRecenter = () => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    if (pickup && destination) {
      const bounds = L.latLngBounds(
        [pickup.latitude, pickup.longitude],
        [destination.latitude, destination.longitude]
      );
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
    } else if (pickup) {
      map.setView([pickup.latitude, pickup.longitude], 13);
    } else if (destination) {
      map.setView([destination.latitude, destination.longitude], 13);
    } else {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  };

  const activeGuidance =
    activeSelection === 'pickup'
      ? pickup
        ? isAr
          ? 'انقر في أي مكان على الخريطة أو اسحب الدبوس لتغيير نقطة الانطلاق'
          : 'Click anywhere or drag pin to move pickup'
        : selectPickupPrompt
      : destination
        ? isAr
          ? 'انقر في أي مكان على الخريطة أو اسحب الدبوس لتغيير الوجهة'
          : 'Click anywhere or drag pin to move destination'
        : selectDestinationPrompt;

  return (
    <div className="isolate relative w-full h-[320px] sm:h-[360px] lg:h-[400px] rounded-3xl overflow-hidden border border-white/15 bg-[#070B16] shadow-inner">
      {/* Leaflet Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-crosshair"
        aria-label={isAr ? 'خريطة اختيار مسار الرحلة' : 'Interactive trip route map'}
      />

      {/* Top Pin Mode Selector & Reset Controls */}
      <div className="pointer-events-none absolute top-3 inset-x-3 z-[450] flex flex-wrap items-center justify-between gap-2">
        <div className="pointer-events-auto inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-white/95 dark:bg-[#0E1528]/95 backdrop-blur-md border border-neutral-200 dark:border-white/15 shadow-md">
          <div className="inline-flex items-center">
            <button
              type="button"
              onClick={() => onActiveSelectionChange('pickup')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-black transition cursor-pointer ${
                activeSelection === 'pickup'
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10'
              }`}
            >
              {pickup ? (
                <Check className="w-3 h-3 shrink-0" />
              ) : (
                <Navigation className="w-3 h-3 shrink-0" />
              )}
              <span>{pickupLabel}</span>
            </button>
            {pickup && onClearPickup ? (
              <button
                type="button"
                onClick={onClearPickup}
                title={isAr ? 'مسح نقطة الانطلاق' : 'Clear pickup'}
                aria-label={isAr ? 'مسح نقطة الانطلاق' : 'Clear pickup'}
                className="p-1 -ms-0.5 me-0.5 rounded-md text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            ) : null}
          </div>

          <div className="inline-flex items-center">
            <button
              type="button"
              onClick={() => onActiveSelectionChange('destination')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-black transition cursor-pointer ${
                activeSelection === 'destination'
                  ? 'bg-[#0EA5E9] dark:bg-white text-white dark:text-brand shadow-sm'
                  : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10'
              }`}
            >
              {destination ? (
                <Check className="w-3 h-3 shrink-0" />
              ) : (
                <MapPin className="w-3 h-3 shrink-0" />
              )}
              <span>{destinationLabel}</span>
            </button>
            {destination && onClearDestination ? (
              <button
                type="button"
                onClick={onClearDestination}
                title={isAr ? 'مسح الوجهة' : 'Clear destination'}
                aria-label={isAr ? 'مسح الوجهة' : 'Clear destination'}
                className="p-1 -ms-0.5 me-0.5 rounded-md text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5">
          {(pickup || destination) && onClearAll ? (
            <button
              type="button"
              onClick={onClearAll}
              title={isAr ? 'مسح النقاط' : 'Clear points'}
              className="inline-flex items-center gap-1 px-2.5 h-8 rounded-xl bg-white/95 dark:bg-[#0E1528]/95 backdrop-blur-md border border-neutral-200 dark:border-white/15 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-md transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isAr ? 'مسح' : 'Clear'}</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleRecenter}
            title={isAr ? 'توسيط الخريطة' : 'Recenter map'}
            aria-label={isAr ? 'توسيط الخريطة' : 'Recenter map'}
            className="w-8 h-8 rounded-xl bg-white/95 dark:bg-[#0E1528]/95 backdrop-blur-md border border-neutral-200 dark:border-white/15 text-neutral-700 dark:text-neutral-200 hover:text-brand dark:hover:text-brand-lime shadow-md flex items-center justify-center transition cursor-pointer"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Guidance Pill (keeps clear of bottom-left zoom & bottom-right attribution) */}
      <div className="pointer-events-none absolute bottom-7 inset-x-3 z-[450] flex items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-[#0E1528]/95 backdrop-blur-md border border-neutral-200 dark:border-white/15 text-[11px] font-bold text-neutral-800 dark:text-neutral-100 shadow-md max-w-[calc(100%-88px)]">
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-brand dark:text-brand-lime shrink-0" />
          ) : (
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                activeSelection === 'pickup' ? 'bg-brand animate-pulse' : 'bg-[#0EA5E9] animate-pulse'
              }`}
            />
          )}
          <span className="truncate">{activeGuidance}</span>
        </div>
      </div>
    </div>
  );
};
