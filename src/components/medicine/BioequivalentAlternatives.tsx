// ==============================================================================
// MEDICOMPARE INDIA — BIOEQUIVALENT ALTERNATIVES COMPARISON LIST
// File: src/components/medicine/BioequivalentAlternatives.tsx
// Governance: AGENTS.md, FR-004, FR-005, FR-009, DOC-UI-001 (MC-010)
// ==============================================================================

import React from 'react';
import Link from 'next/link';

interface AlternativeItem {
  medicine: {
    id: string;
    brandName: string;
    manufacturer: string;
    mrp: number;
    packSize: number;
    packUnit: string;
  };
  category: 'JAN_AUSHADHI_GENERIC' | 'BRANDED_GENERIC' | 'INNOVATOR_BRAND';
  categoryLabel: string;
  unitPrice: number;
  savingsPerUnit: number;
  savingsPercentage: number;
  requiresPrescription: boolean;
  warningNote?: string;
}

interface BioequivalentAlternativesProps {
  alternatives: AlternativeItem[];
  targetBrandName: string;
  targetUnitPrice: number;
}

export function BioequivalentAlternatives({
  alternatives,
  targetBrandName,
  targetUnitPrice,
}: BioequivalentAlternativesProps) {
  if (!alternatives || alternatives.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
            ✓
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            Bioequivalent Generic Alternatives
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Exact identical active salt composition, dosage form, and release characteristics.
          Ranked by highest consumer savings relative to {targetBrandName}.
        </p>
      </div>

      <div className="space-y-3">
        {alternatives.map((alt) => {
          const isJanAushadhi = alt.category === 'JAN_AUSHADHI_GENERIC';

          return (
            <div
              key={alt.medicine.id}
              className={`rounded-xl border p-4 transition-all hover:shadow-md ${
                isJanAushadhi
                  ? 'border-blue-300 bg-blue-50/50 hover:border-blue-400'
                  : 'border-slate-200 bg-white hover:border-emerald-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">
                      {alt.medicine.brandName}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        isJanAushadhi
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {alt.categoryLabel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    {alt.medicine.manufacturer} • Strip of {alt.medicine.packSize}{' '}
                    {alt.medicine.packUnit}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <div className="flex items-baseline gap-1.5 sm:justify-end">
                      <span className="text-lg font-black text-slate-900">
                        ₹{alt.unitPrice.toFixed(2)}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        / {alt.medicine.packUnit.slice(0, -1)}
                      </span>
                    </div>

                    {alt.savingsPercentage > 0 ? (
                      <span className="inline-block rounded-md bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-xs font-extrabold text-emerald-800">
                        Save {alt.savingsPercentage}% (₹{alt.savingsPerUnit.toFixed(2)} / unit)
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Similar price</span>
                    )}
                  </div>

                  <Link
                    href={`/compare/${alt.medicine.id}`}
                    className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm flex-shrink-0"
                  >
                    Compare
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        <strong className="text-slate-900">Clinical Substitution Notice: </strong>
        Bioequivalent generic alternatives share the same therapeutic active ingredients and release
        rates. However, always consult your physician or dispensing pharmacist before changing
        brands for maintenance treatments.
      </div>
    </div>
  );
}

