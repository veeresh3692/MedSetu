// ==============================================================================
// MEDICOMPARE INDIA — USER LOCATION & QUICK DELIVERY BAR
// File: src/components/location/UserLocationBar.tsx
// Governance: AGENTS.md, FR-007, FR-012, FR-014, DOC-UI-001 (MC-010)
// Privacy: Zero server coordinate persistence (DPDP Act 2023 compliant)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export interface BengaluruLocality {
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export const BENGALURU_LOCALITIES: BengaluruLocality[] = [
  { name: 'Indiranagar', lat: 12.9719, lng: 77.6412, description: 'East Bengaluru • 100ft Rd' },
  { name: 'Koramangala', lat: 12.9352, lng: 77.6245, description: 'South-East • 80ft Rd' },
  { name: 'Jayanagar', lat: 12.9250, lng: 77.5938, description: 'South Bengaluru • 4th Block' },
  { name: 'Malleshwaram', lat: 13.0068, lng: 77.5684, description: 'North-West • Margosa Rd' },
  { name: 'HSR Layout', lat: 12.9121, lng: 77.6446, description: 'South-East • Sector 1-7' },
  { name: 'Whitefield', lat: 12.9698, lng: 77.7500, description: 'East Bengaluru • IT Corridor' },
  { name: 'Central / MG Road', lat: 12.9716, lng: 77.5946, description: 'Central Business District' },
];

interface UserLocationBarProps {
  currentLat: number;
  currentLng: number;
  currentSortBy: 'price' | 'distance';
  currentRadius: number;
  medicineName?: string;
}

export function UserLocationBar({
  currentLat,
  currentLng,
  currentSortBy,
  currentRadius,
  medicineName,
}: UserLocationBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [showLocalityMenu, setShowLocalityMenu] = useState(false);

  // Find if current coords match any known locality
  const matchedLocality = BENGALURU_LOCALITIES.find(
    (l) => Math.abs(l.lat - currentLat) < 0.01 && Math.abs(l.lng - currentLng) < 0.01
  );

  const activeLocationLabel = matchedLocality
    ? matchedLocality.name
    : `Custom Coordinates (${currentLat.toFixed(2)}, ${currentLng.toFixed(2)})`;

  const updateLocationParams = (
    newLat: number,
    newLng: number,
    newSort?: 'price' | 'distance',
    newRadius?: number
  ) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('lat', newLat.toString());
    params.set('lng', newLng.toString());
    if (newSort) params.set('sortBy', newSort);
    if (newRadius) params.set('radius', newRadius.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        // Default to 'distance' (earliest/closest) when user detects exact GPS
        updateLocationParams(latitude, longitude, 'distance');
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('Location permission denied. Please select your neighborhood below.');
        } else {
          setGpsError('Could not acquire GPS fix. Please pick a locality below.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  return (
    <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/90 via-white to-slate-50 p-4 sm:p-5 shadow-xs transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Location Indicator & Change Selector */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-2xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Locating nearby pharmacies in:
              </span>
              <span className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                {activeLocationLabel}
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600 pl-9">
            Showing verified stores sorted to get{' '}
            <span className="font-semibold text-emerald-800">{medicineName || 'your medicine'}</span>{' '}
            as early as possible.
          </p>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:self-end lg:self-auto">
          {/* GPS Detect Button */}
          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50 hover:border-emerald-400 transition-all shadow-2xs disabled:opacity-50"
            title="Use device GPS to locate closest chemist"
          >
            {isLocating ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5 text-emerald-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Acquiring GPS...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-emerald-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="22" y1="12" x2="18" y2="12" />
                  <line x1="6" y1="12" x2="2" y2="12" />
                  <line x1="12" y1="6" x2="12" y2="2" />
                  <line x1="12" y1="22" x2="12" y2="18" />
                </svg>
                <span>Use My Live Location</span>
              </>
            )}
          </button>

          {/* Neighborhood Selector Dropdown Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLocalityMenu(!showLocalityMenu)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-2xs"
            >
              <span>Change Area</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-3.5 w-3.5 transition-transform ${showLocalityMenu ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Neighborhood Menu Popover */}
            {showLocalityMenu && (
              <div className="absolute right-0 sm:right-auto sm:left-0 z-30 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-slate-900/5 animate-in fade-in-50 zoom-in-95">
                <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  Select Bengaluru Neighborhood
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {BENGALURU_LOCALITIES.map((loc) => {
                    const isSelected =
                      Math.abs(loc.lat - currentLat) < 0.01 &&
                      Math.abs(loc.lng - currentLng) < 0.01;

                    return (
                      <button
                        key={loc.name}
                        type="button"
                        onClick={() => {
                          setShowLocalityMenu(false);
                          updateLocationParams(loc.lat, loc.lng);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-100 font-medium'
                        }`}
                      >
                        <span className="flex items-center justify-between">
                          <span>{loc.name}</span>
                          {isSelected && <span className="text-emerald-600 font-bold">✓</span>}
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          {loc.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Delivery Speed / Priority Toggle */}
          <div className="inline-flex rounded-xl border border-slate-300 bg-slate-100 p-0.5 text-xs font-bold shadow-2xs">
            <button
              type="button"
              onClick={() => updateLocationParams(currentLat, currentLng, 'distance')}
              className={`rounded-lg px-3 py-1.5 transition-all flex items-center gap-1 ${
                currentSortBy === 'distance'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Sort by closest distance for fastest walk-in or runner delivery"
            >
              <span>⚡ Earliest / Closest</span>
            </button>
            <button
              type="button"
              onClick={() => updateLocationParams(currentLat, currentLng, 'price')}
              className={`rounded-lg px-3 py-1.5 transition-all flex items-center gap-1 ${
                currentSortBy === 'price'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Sort by lowest price quote first"
            >
              <span>💰 Lowest Price</span>
            </button>
          </div>
        </div>
      </div>

      {/* GPS Error Alert */}
      {gpsError && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs text-amber-800 flex items-center justify-between">
          <span>⚠️ {gpsError}</span>
          <button
            type="button"
            onClick={() => setGpsError(null)}
            className="text-amber-900 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
