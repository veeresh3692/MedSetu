// ==============================================================================
// MEDICOMPARE INDIA — GLOBAL NAVIGATION HEADER
// File: src/components/layout/Navbar.tsx
// Governance: AGENTS.md, DOC-UI-001 (MC-010)
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { LocateNearbyPharmacyButton } from '@/components/location/LocateNearbyPharmacyButton';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition-transform group-hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Medi<span className="text-emerald-600">Compare</span>
              </span>
              <span className="ml-1 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                India
              </span>
            </div>
          </Link>

          {/* Hyperlocal City Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 ml-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Bengaluru Urban</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-3 text-sm font-medium">
          <LocateNearbyPharmacyButton variant="navbar" />
          <Link
            href="/"
            className="text-slate-600 hover:text-emerald-600 transition-colors hidden md:inline-block"
          >
            Find Medicines
          </Link>
          <Link
            href="/#about"
            className="text-slate-600 hover:text-emerald-600 transition-colors hidden md:inline-block"
          >
            Jan Aushadhi Generics
          </Link>
          <Link
            href="/pharmacy"
            className="rounded-lg border border-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            Chemist Portal
          </Link>
        </nav>
      </div>
    </header>
  );
}

