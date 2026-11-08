// ==============================================================================
// MEDICOMPARE INDIA — GOVERNMENT NPPA CEILING PRICE CARD
// File: src/components/medicine/GovernmentPriceCard.tsx
// Governance: AGENTS.md, Rule 02, FR-008, DOC-DATA-001 (MC-007)
// ==============================================================================

import React from 'react';

interface GovernmentPriceCardProps {
  govtRef: {
    hasCeilingPrice: boolean;
    ceilingPricePerUnit?: number;
    applicableGstRate?: number;
    statutoryMaxUnitPrice?: number;
    dpcoOrderNumber?: string;
    notificationDate?: string;
    sourceReference?: string;
  };
}

export function GovernmentPriceCard({ govtRef }: GovernmentPriceCardProps) {
  if (!govtRef.hasCeilingPrice) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">NPPA Status: </span>
        This formulation is currently non-scheduled under DPCO 2013 (market-determined pricing
        with 10% annual MRP increase cap).
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50/50 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-bold text-white tracking-wide uppercase">
              Government Price Ceiling
            </span>
            <span className="text-xs text-blue-900 font-medium">
              National Pharmaceutical Pricing Authority (NPPA)
            </span>
          </div>

          <p className="text-xs text-blue-800 leading-relaxed">
            Statutory ceiling fixed under the <strong>Drugs (Prices Control) Order, 2013</strong>.
            Manufacturers cannot legally price above this ceiling.
          </p>

          <p className="text-[11px] text-blue-600/90 font-mono">
            Gazette Order: <strong>{govtRef.dpcoOrderNumber}</strong> • Notified:{' '}
            {govtRef.notificationDate}
          </p>
        </div>

        <div className="flex-shrink-0 text-left sm:text-right bg-white/80 rounded-xl p-3 border border-blue-200/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
            Statutory Ceiling (incl. {govtRef.applicableGstRate}% GST)
          </span>
          <div className="text-2xl font-black text-blue-950">
            ₹{govtRef.statutoryMaxUnitPrice?.toFixed(2)}{' '}
            <span className="text-xs font-semibold text-blue-600">/ unit</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Base: ₹{govtRef.ceilingPricePerUnit?.toFixed(2)} (excl. GST)
          </span>
        </div>
      </div>
    </div>
  );
}

