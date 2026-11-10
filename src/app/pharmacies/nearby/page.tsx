// ==============================================================================
// MEDICOMPARE INDIA — HYPERLOCAL NEARBY PHARMACY SHOPS DISCOVERY
// Route: /pharmacies/nearby
// Governance: AGENTS.md, FR-007, FR-012, FR-014, DOC-UI-001 (MC-010)
// Privacy: Zero server GPS logging (DPDP Act 2023 compliant)
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PharmacyMap } from '@/components/pharmacy/PharmacyMap';
import { QuickDeliveryModal } from '@/components/pharmacy/QuickDeliveryModal';
import { BENGALURU_LOCALITIES } from '@/components/location/UserLocationBar';
import { calculateHaversineDistance } from '@/lib/geo/haversine';
import { PharmacyOfferItem } from '@/components/pharmacy/NearbyPharmacyList';

interface VerifiedPharmacy {
  id: string;
  name: string;
  address: string;
  locality: string;
  phone: string;
  latitude: number;
  longitude: number;
  type: 'RETAIL_CHAIN' | 'JAN_AUSHADHI' | 'INDEPENDENT' | 'HOSPITAL_24X7';
  typeLabel: string;
  isOpen24x7: boolean;
  hoursText: string;
  licenseNumber: string;
}

const VERIFIED_PHARMACIES: VerifiedPharmacy[] = [
  {
    id: 'p0000000-0000-0000-0000-000000000001',
    name: 'Apollo Pharmacy Indiranagar',
    address: '100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru',
    locality: 'Indiranagar',
    phone: '+918025251100',
    latitude: 12.9719,
    longitude: 77.6412,
    type: 'RETAIL_CHAIN',
    typeLabel: 'Retail Pharmacy Chain',
    isOpen24x7: true,
    hoursText: 'Open 24 Hours • 7 Days',
    licenseNumber: 'KA-BGL-2024-0012',
  },
  {
    id: 'p0000000-0000-0000-0000-000000000002',
    name: 'MedPlus Chemist Koramangala',
    address: '80ft Road, 4th Block, Koramangala, Bengaluru',
    locality: 'Koramangala',
    phone: '+918025532200',
    latitude: 12.9352,
    longitude: 77.6245,
    type: 'RETAIL_CHAIN',
    typeLabel: 'Retail Pharmacy Chain',
    isOpen24x7: false,
    hoursText: '7:00 AM – 11:30 PM',
    licenseNumber: 'KA-BGL-2024-0015',
  },
  {
    id: 'p0000000-0000-0000-0000-000000000003',
    name: 'PMBJP Jan Aushadhi Kendra Jayanagar',
    address: '11th Main, 4th Block, Jayanagar, Bengaluru',
    locality: 'Jayanagar',
    phone: '+918026643300',
    latitude: 12.9250,
    longitude: 77.5938,
    type: 'JAN_AUSHADHI',
    typeLabel: 'PMBJP Jan Aushadhi (Govt Generic)',
    isOpen24x7: false,
    hoursText: '8:30 AM – 9:00 PM',
    licenseNumber: 'KA-BGL-GOV-0089',
  },
  {
    id: 'p0000000-0000-0000-0000-000000000004',
    name: 'Sri Raghavendra Medicals Malleshwaram',
    address: 'Margosa Road, 8th Cross, Malleshwaram, Bengaluru',
    locality: 'Malleshwaram',
    phone: '+918023344400',
    latitude: 13.0068,
    longitude: 77.5684,
    type: 'INDEPENDENT',
    typeLabel: 'Licensed Independent Chemist',
    isOpen24x7: false,
    hoursText: '8:00 AM – 10:30 PM',
    licenseNumber: 'KA-BGL-2023-0941',
  },
  {
    id: 'p0000000-0000-0000-0000-000000000005',
    name: 'Manipal Hospital Pharmacy Kodihalli',
    address: '98 HAL Old Airport Road, Kodihalli, Bengaluru',
    locality: 'Old Airport Road',
    phone: '+918025024444',
    latitude: 12.9592,
    longitude: 77.6499,
    type: 'HOSPITAL_24X7',
    typeLabel: 'Hospital 24/7 Chemist',
    isOpen24x7: true,
    hoursText: 'Open 24 Hours Emergency Retail',
    licenseNumber: 'KA-BGL-2024-0311',
  },
];

export default function NearbyPharmaciesPage() {
  const searchParams = useSearchParams();

  // Read URL coords or default to central Bengaluru
  const paramLat = searchParams?.get('lat');
  const paramLng = searchParams?.get('lng');

  const [userLat, setUserLat] = useState<number>(paramLat ? parseFloat(paramLat) : 12.9716);
  const [userLng, setUserLng] = useState<number>(paramLng ? parseFloat(paramLng) : 77.5946);
  const [filterType, setFilterType] = useState<'ALL' | 'JAN_AUSHADHI' | 'OPEN_24X7'>('ALL');
  const [selectedPharmacyForDelivery, setSelectedPharmacyForDelivery] = useState<VerifiedPharmacy | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (paramLat && paramLng) {
      setUserLat(parseFloat(paramLat));
      setUserLng(parseFloat(paramLng));
    }
  }, [paramLat, paramLng]);

  const handleLiveGPS = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Calculate distance for all pharmacies and sort by closest
  const pharmaciesWithDistance = VERIFIED_PHARMACIES.map((p) => {
    const dist = calculateHaversineDistance(userLat, userLng, p.latitude, p.longitude);
    const etaMins = Math.max(8, Math.round(dist * 4 + 6));
    return {
      ...p,
      distanceKm: dist,
      etaMins,
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  // Filter based on active tab
  const filteredPharmacies = pharmaciesWithDistance.filter((p) => {
    if (filterType === 'JAN_AUSHADHI') return p.type === 'JAN_AUSHADHI';
    if (filterType === 'OPEN_24X7') return p.isOpen24x7;
    return true;
  });

  // Convert to map offer format
  const mapOffers: PharmacyOfferItem[] = filteredPharmacies.map((p, idx) => ({
    offerId: `map-store-${idx + 1}`,
    pharmacy: {
      id: p.id,
      businessName: p.name,
      address: p.address,
      locality: p.locality,
      phone: p.phone,
      distanceKm: p.distanceKm,
      latitude: p.latitude,
      longitude: p.longitude,
    },
    sellingPrice: 0,
    unitPrice: 0,
    savingsVsMrp: 0,
    savingsPercentage: 0,
    stockStatus: 'IN_STOCK',
    verificationStatus: 'VERIFIED',
    observationTimestamp: new Date().toISOString(),
  }));

  const closestPharmacy = filteredPharmacies[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              Bengaluru Hyperlocal Discovery Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Locate Nearby Pharmacy Shops & Jan Aushadhi Kendras
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Discover licensed retail chemists and government generic stores near your current location with fastest walk-in or runner delivery options.
            </p>
          </div>

          {/* Live GPS Button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleLiveGPS}
              disabled={isLocating}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50"
            >
              <span>📍</span>
              <span>{isLocating ? 'Acquiring GPS...' : 'Re-Locate Me'}</span>
            </button>
          </div>
        </div>

        {/* Neighborhood Quick Switcher */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="text-slate-500">Quick Areas:</span>
          {BENGALURU_LOCALITIES.map((loc) => {
            const isSelected =
              Math.abs(loc.lat - userLat) < 0.02 && Math.abs(loc.lng - userLng) < 0.02;

            return (
              <button
                key={loc.name}
                type="button"
                onClick={() => {
                  setUserLat(loc.lat);
                  setUserLng(loc.lng);
                }}
                className={`rounded-full px-3 py-1 transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-400'
                }`}
              >
                {loc.name}
              </button>
            );
          })}
        </div>

        {/* Fastest Chemist Banner */}
        {closestPharmacy && (
          <div className="rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <span>⚡ Closest Pharmacy to You</span>
                <span className="rounded-md bg-emerald-600 text-white text-[10px] px-1.5 py-0.5">
                  Earliest Option
                </span>
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900">
                {closestPharmacy.name}
              </div>
              <p className="text-xs text-slate-600">
                {closestPharmacy.address} •{' '}
                <span className="font-bold text-emerald-700">
                  {closestPharmacy.distanceKm} km away (~{closestPharmacy.etaMins} mins walk-in / runner)
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${closestPharmacy.phone}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-colors shadow-2xs"
              >
                <span>📞 Call Store</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedPharmacyForDelivery(closestPharmacy)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <span>⚡ Fast Runner</span>
              </button>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
              filterType === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Verified Chemists ({pharmaciesWithDistance.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('JAN_AUSHADHI')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
              filterType === 'JAN_AUSHADHI'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>PMBJP Jan Aushadhi (Govt)</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('OPEN_24X7')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
              filterType === 'OPEN_24X7'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Open 24/7 Chemists
          </button>
        </div>

        {/* Main Grid: Pharmacy List & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Pharmacy Cards (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {filteredPharmacies.map((pharmacy) => {
              const isJanAushadhi = pharmacy.type === 'JAN_AUSHADHI';

              return (
                <div
                  key={pharmacy.id}
                  className={`rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md ${
                    isJanAushadhi
                      ? 'border-blue-200 bg-blue-50/40'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">
                          {pharmacy.name}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            isJanAushadhi
                              ? 'bg-blue-600 text-white'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {pharmacy.typeLabel}
                        </span>
                        {pharmacy.isOpen24x7 && (
                          <span className="rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5">
                            24/7 Open
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600">{pharmacy.address}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                        <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          📍 {pharmacy.distanceKm} km away • ~{pharmacy.etaMins} mins
                        </span>
                        <span>🕒 {pharmacy.hoursText}</span>
                        <span className="text-slate-400">• License: {pharmacy.licenseNumber}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-2 flex-shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => setSelectedPharmacyForDelivery(pharmacy)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                      >
                        <span>⚡ Get It Early</span>
                      </button>

                      <a
                        href={`tel:${pharmacy.phone}`}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <span>📞 Call Chemist</span>
                      </a>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline pt-1"
                      >
                        <span>Directions ↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Map (5 Cols - Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <PharmacyMap
              offers={mapOffers}
              userLat={userLat}
              userLng={userLng}
            />

            {/* Hyperlocal Tips */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-950 space-y-1.5">
              <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                ⚡ Walk-in & Quick Runner Guideline:
              </span>
              <p className="leading-relaxed">
                All stores listed are Form 20/21 licensed pharmacies in Bengaluru. For Schedule H medicines, keep your doctor prescription handy for instant verification at the counter or to hand to a runner.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Quick Delivery Runner Modal */}
      {selectedPharmacyForDelivery && (
        <QuickDeliveryModal
          isOpen={true}
          onClose={() => setSelectedPharmacyForDelivery(null)}
          pharmacyName={selectedPharmacyForDelivery.name}
          pharmacyAddress={selectedPharmacyForDelivery.address}
          pharmacyPhone={selectedPharmacyForDelivery.phone}
          medicineName="Prescribed Medicine"
          distanceKm={selectedPharmacyForDelivery.distanceKm}
        />
      )}

      <Footer />
    </div>
  );
}

