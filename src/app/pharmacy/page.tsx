// ==============================================================================
// MEDICOMPARE INDIA — PHARMACY CHEMIST PORTAL DASHBOARD
// Route: /pharmacy
// Governance: AGENTS.md, FR-007, DOC-UI-001 (MC-011)
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function PharmacyDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Portal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                Chemist Partner Portal
              </span>
              <span className="text-xs text-slate-500">• Bengaluru Region</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Store Inventory & Compliance Management
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Manage your pharmacy license verification, update live medicine prices, and upload
              catalog feeds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/pharmacy/upload"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload CSV Catalog
            </Link>
          </div>
        </div>

        {/* Chemist Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Verification Status
            </span>
            <div className="text-lg font-black text-emerald-600 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Approved (Form 20/21)
            </div>
            <p className="text-[11px] text-slate-400">Karnataka Drug Control Dept Verified</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Formulations Listed
            </span>
            <div className="text-2xl font-black text-slate-900">42</div>
            <p className="text-[11px] text-emerald-600 font-medium">100% within statutory MRP</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Price Freshness
            </span>
            <div className="text-lg font-bold text-slate-900">Verified Today</div>
            <p className="text-[11px] text-slate-400">Auto-updated via POS batch</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Foot-Traffic Discovery
            </span>
            <div className="text-2xl font-black text-slate-900">318</div>
            <p className="text-[11px] text-slate-400">Patient views this week</p>
          </div>
        </div>

        {/* Quick Actions & Compliance Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Bulk CSV Inventory Synchronization
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload your daily or weekly stock sheet from Marg ERP, MedPlus POS, or Tally.
              MediCompare automatically resolves commercial brands against canonical clinical
              monographs, verifies statutory MRP price ceilings, and updates your live storefront.
            </p>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Standard Ingestion Columns Required:
              </span>
              <code className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded block overflow-x-auto">
                medicine_slug, brand_name, selling_price, stock_status
              </code>
            </div>

            <div className="pt-2">
              <Link
                href="/pharmacy/upload"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
              >
                Go to File Upload Page →
              </Link>
            </div>
          </div>

          {/* Statutory Drug License Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Drug License Audit Details</h2>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Form 20 Retail License:</span>
                <span className="font-mono font-bold text-slate-900">KA-B1-198421</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Form 21 Biologicals:</span>
                <span className="font-mono font-bold text-slate-900">KA-B1-198422</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Registered Pharmacist:</span>
                <span className="font-semibold text-slate-900">Suresh Kumar</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">KPC Registration:</span>
                <span className="font-mono font-bold text-slate-900">KPC-45129</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">License Validity:</span>
                <span className="font-semibold text-emerald-700">Valid until Dec 2028</span>
              </div>
            </div>

            <div className="rounded-lg bg-emerald-50 p-3 text-[11px] text-emerald-800">
              ✓ Complies with Drugs and Cosmetics Rules, 1945. Verified by MediCompare Compliance
              Auditor.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

