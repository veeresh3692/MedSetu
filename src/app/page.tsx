// ==============================================================================
// MEDICOMPARE INDIA — HOMEPAGE
// Route: /
// Governance: AGENTS.md, FR-001, DOC-UI-001 (MC-010)
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MedicineSearchBar } from '@/components/search/MedicineSearchBar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              Pilot Live in Bengaluru • 10,000+ Formulations Audited
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              Compare medicine prices at{' '}
              <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy underline-offset-8">
                pharmacies near you
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
              Find the lowest trustworthy price for your exact prescribed formulation. Discover
              bioequivalent PMBJP Jan Aushadhi alternatives and verified neighborhood chemists in
              Bengaluru.
            </p>

            {/* Global Autocomplete Search Bar */}
            <div className="mx-auto pt-2 flex justify-center">
              <MedicineSearchBar />
            </div>

            {/* Quick Search Chips */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Popular chronic searches:</span>
              <Link
                href="/compare/m0000000-0000-0000-0000-000000000001"
                className="rounded-full bg-white border border-slate-200 px-3 py-1 font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-colors shadow-2xs"
              >
                Augmentin 625 Duo
              </Link>
              <Link
                href="/compare/m0000000-0000-0000-0000-000000000005"
                className="rounded-full bg-white border border-slate-200 px-3 py-1 font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-colors shadow-2xs"
              >
                Glycomet 500
              </Link>
              <Link
                href="/compare/m0000000-0000-0000-0000-000000000008"
                className="rounded-full bg-white border border-slate-200 px-3 py-1 font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-colors shadow-2xs"
              >
                Telma 40
              </Link>
              <Link
                href="/compare/m0000000-0000-0000-0000-000000000013"
                className="rounded-full bg-white border border-slate-200 px-3 py-1 font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-colors shadow-2xs"
              >
                Atorva 10
              </Link>
              <Link
                href="/compare/m0000000-0000-0000-0000-000000000016"
                className="rounded-full bg-white border border-slate-200 px-3 py-1 font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-colors shadow-2xs"
              >
                Pan 40
              </Link>
            </div>
          </div>
        </section>

        {/* 3 Pillars of Transparency Section */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Complete Medicine Price Transparency
            </h2>
            <p className="text-sm text-slate-600">
              Unlike online courier pharmacies that hide local availability, MediCompare maps the full
              Indian retail pharmaceutical landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Government Ceiling Prices</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check statutory NPPA ceiling prices notified under DPCO 2013 and NLEM 2022 to know
                the legal price cap for your medication.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Jan Aushadhi Generic Savings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discover government-certified bioequivalent PMBJP generic lines offering 50% to 85%
                savings for chronic diabetes and blood pressure maintenance.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Neighborhood Walk-In Pickup</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Locate verified licensed retail chemists with live stock confirmation near your home.
                No 2-day delivery wait times.
              </p>
            </div>
          </div>
        </section>

        {/* Bengaluru Micro-Markets Badge Section */}
        <section className="bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Pilot Chemist Locations in Bengaluru
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-700">
              <span className="rounded-lg bg-white border border-slate-300 px-3 py-1.5 shadow-2xs">
                Indiranagar (100 Feet Rd)
              </span>
              <span className="rounded-lg bg-white border border-slate-300 px-3 py-1.5 shadow-2xs">
                Koramangala (4th & 8th Block)
              </span>
              <span className="rounded-lg bg-white border border-slate-300 px-3 py-1.5 shadow-2xs">
                Jayanagar (4th Main)
              </span>
              <span className="rounded-lg bg-white border border-slate-300 px-3 py-1.5 shadow-2xs">
                Malleshwaram (Sampige Rd)
              </span>
              <span className="rounded-lg bg-white border border-slate-300 px-3 py-1.5 shadow-2xs">
                Whitefield & HSR Layout
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

