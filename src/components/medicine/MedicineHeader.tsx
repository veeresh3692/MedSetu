// ==============================================================================
// MEDICOMPARE INDIA — MEDICINE HEADER & CLINICAL MONOGRAPH CARD
// File: src/components/medicine/MedicineHeader.tsx
// Governance: AGENTS.md, FR-002, FR-018, DOC-UI-001 (MC-010)
// ==============================================================================

import React from 'react';

interface MedicineHeaderProps {
  medicine: {
    id: string;
    brandName: string;
    manufacturer: string;
    mrp: number;
    packSize: number;
    packUnit: string;
    unitPrice: number;
    formattedUnitPrice: string;
    schedule: string;
    requiresPrescription: boolean;
  };
  formulation: {
    id: string;
    name: string;
    dosageForm: string;
    releaseType: string;
    normalizedStrength: string;
    activeSalts: string[];
  };
}

export function MedicineHeader({ medicine, formulation }: MedicineHeaderProps) {
  const isSustainedRelease =
    formulation.releaseType === 'SUSTAINED_RELEASE' ||
    formulation.releaseType === 'EXTENDED_RELEASE';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Left Side: Brand & Monograph Details */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {medicine.brandName}
            </h1>
            {medicine.requiresPrescription && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900 border border-amber-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Rx Required (Schedule H)
              </span>
            )}
            {isSustainedRelease && (
              <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-900 border border-purple-200">
                Sustained Release (SR) Lock
              </span>
            )}
          </div>

          <p className="text-sm font-medium text-slate-600">
            Manufactured by <strong className="text-slate-900">{medicine.manufacturer}</strong>
          </p>

          {/* Clinical Monograph Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700">
            <div className="font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-emerald-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10.5 20.5 3 13a9 9 0 0 1 12.7-12.7l7.5 7.5a9 9 0 0 1-12.7 12.7Z" />
                <path d="m8.5 8.5 7 7" />
              </svg>
              Standard Clinical Monograph:
            </div>
            <p className="text-slate-800 font-medium mb-2">{formulation.name}</p>

            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] text-slate-500 font-semibold mr-1">Active Salts:</span>
              {formulation.activeSalts && formulation.activeSalts.length > 0 ? (
                formulation.activeSalts.map((salt, idx) => (
                  <span
                    key={idx}
                    className="inline-block rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-800"
                  >
                    {salt}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-slate-500">{formulation.normalizedStrength}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Packaging & MRP Box */}
        <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
          <div className="text-left lg:text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Printed Pack MRP
            </span>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              ₹{medicine.mrp.toFixed(2)}
            </div>
            <span className="text-xs text-slate-500">
              Strip of {medicine.packSize} {medicine.packUnit}
            </span>
          </div>

          <div className="mt-2 text-right">
            <span className="inline-block rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
              {medicine.formattedUnitPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

