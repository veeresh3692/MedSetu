// ==============================================================================
// MEDICOMPARE INDIA — LOCATE ME NEARBY PHARMACY SHOPS BUTTON
// File: src/components/location/LocateNearbyPharmacyButton.tsx
// Governance: AGENTS.md, FR-007, FR-012, FR-014, DOC-UI-001 (MC-010)
// Privacy: Zero server GPS persistence (DPDP Act 2023 compliant)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LocateNearbyPharmacyButtonProps {
  variant?: 'hero' | 'navbar' | 'compact';
  className?: string;
  label?: string;
}

export function LocateNearbyPharmacyButton({
  variant = 'hero',
  className = '',
  label = 'Locate Me Nearby Pharmacy Shops',
}: LocateNearbyPharmacyButtonProps) {
  const router = useRouter();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateMe = () => {
    setIsLocating(true);

    if (!navigator.geolocation) {
      // Fallback to default Bengaluru center
      router.push('/pharmacies/nearby?lat=12.9716&lng=77.5946&source=fallback');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        router.push(
          `/pharmacies/nearby?lat=${latitude.toFixed(6)}&lng=${longitude.toFixed(6)}&source=gps`
        );
      },
      (error) => {
        setIsLocating(false);
        // On permission denied or timeout, gracefully redirect with Bengaluru default
        console.warn('Geolocation failed or denied, using Bengaluru center:', error.message);
        router.push('/pharmacies/nearby?lat=12.9716&lng=77.5946&source=permission_denied');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  if (variant === 'navbar') {
    return (
      <button
        type="button"
        onClick={handleLocateMe}
        disabled={isLocating}
        className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400 transition-all shadow-2xs disabled:opacity-60 ${className}`}
        title="Find open pharmacy shops and Jan Aushadhi Kendras near your current location"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 text-emerald-700"
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
        <span>{isLocating ? 'Locating...' : 'Locate Nearby Pharmacies'}</span>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleLocateMe}
        disabled={isLocating}
        className={`inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-all shadow-2xs ${className}`}
      >
        <span>📍</span>
        <span>{isLocating ? 'Acquiring Location...' : label}</span>
      </button>
    );
  }

  // Default 'hero' variant: bold, high-contrast healthcare CTA
  return (
    <button
      type="button"
      onClick={handleLocateMe}
      disabled={isLocating}
      className={`group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 px-6 py-3.5 text-sm sm:text-base font-extrabold text-white shadow-lg shadow-emerald-700/25 hover:shadow-xl hover:shadow-emerald-700/35 hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-75 disabled:hover:scale-100 ${className}`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-white ${isLocating ? 'animate-spin' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isLocating ? (
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          ) : (
            <>
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </>
          )}
        </svg>
      </span>
      <span>{isLocating ? 'Locating Nearby Pharmacy Shops...' : label}</span>
      <span className="rounded-full bg-emerald-500/40 px-2 py-0.5 text-xs font-semibold text-emerald-100">
        GPS Active
      </span>
    </button>
  );
}

