// ==============================================================================
// MEDICOMPARE INDIA — MEDICINE PRICE COMPARISON & DISCOVERY PAGE
// Route: /compare/[id]
// Governance: AGENTS.md, FR-001..FR-019, DOC-UI-001 (MC-010)
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MedicineHeader } from '@/components/medicine/MedicineHeader';
import { GovernmentPriceCard } from '@/components/medicine/GovernmentPriceCard';
import { BioequivalentAlternatives } from '@/components/medicine/BioequivalentAlternatives';
import { NearbyPharmacyList } from '@/components/pharmacy/NearbyPharmacyList';
import { PharmacyMap } from '@/components/pharmacy/PharmacyMap';
import { getMedicineComparison } from '@/lib/server/services/comparisonService';

interface ComparePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    lat?: string;
    lng?: string;
    radius?: string;
    sortBy?: 'price' | 'distance';
  }>;
}

export default async function CompareMedicinePage({
  params,
  searchParams,
}: ComparePageProps) {
  const { id } = await params;
  const sParams = await searchParams;

  const userLat = sParams.lat ? parseFloat(sParams.lat) : 12.9716; // Bengaluru center default
  const userLng = sParams.lng ? parseFloat(sParams.lng) : 77.5946;
  const radius = sParams.radius ? parseFloat(sParams.radius) : 10;
  const sortBy = sParams.sortBy || 'price';

  let comparisonData;
  try {
    comparisonData = await getMedicineComparison(id, userLat, userLng, radius, sortBy);
  } catch (err: any) {
    if (err.message?.includes('not found')) {
      notFound();
    }
    throw err;
  }

  const {
    targetMedicine,
    formulation,
    governmentReference,
    bioequivalentAlternatives,
    nearbyPharmacyOffers,
  } = comparisonData;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-400">Bengaluru</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">
            {targetMedicine.brandName}
          </span>
        </nav>

        {/* 1. Target Medicine Header & Clinical Monograph */}
        <MedicineHeader medicine={targetMedicine} formulation={formulation} />

        {/* 2. Government NPPA Ceiling Price Reference */}
        <GovernmentPriceCard govtRef={governmentReference} />

        {/* 3. Bioequivalent Generic Alternatives (Jan Aushadhi & Branded Generics) */}
        {bioequivalentAlternatives && bioequivalentAlternatives.length > 0 && (
          <BioequivalentAlternatives
            alternatives={bioequivalentAlternatives}
            targetBrandName={targetMedicine.brandName}
            targetUnitPrice={targetMedicine.unitPrice}
          />
        )}

        {/* 4. Local Pharmacy Comparison & Spatial Map View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Pharmacy Offers List (7 Cols on Desktop) */}
          <div className="lg:col-span-7">
            <NearbyPharmacyList
              offers={nearbyPharmacyOffers}
              medicineId={targetMedicine.id}
              medicineName={targetMedicine.brandName}
            />
          </div>

          {/* Interactive Map (5 Cols on Desktop - Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <PharmacyMap
              offers={nearbyPharmacyOffers}
              userLat={userLat}
              userLng={userLng}
            />

            {/* Hyperlocal Tips Card */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-950 space-y-1.5">
              <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-emerald-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                Bengaluru Local Pharmacy Tip:
              </span>
              <p className="leading-relaxed">
                Prices shown are direct counter quotes verified by licensed chemists in
                Bengaluru. Always carry your physical doctor prescription when purchasing Schedule H
                medications.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

