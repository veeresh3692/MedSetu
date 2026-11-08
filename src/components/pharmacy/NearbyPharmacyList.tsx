// ==============================================================================
// MEDICOMPARE INDIA — NEARBY PHARMACY OFFERS LIST COMPONENT
// File: src/components/pharmacy/NearbyPharmacyList.tsx
// Governance: AGENTS.md, FR-007, FR-012, FR-015, FR-016, DOC-UI-001 (MC-010)
// ==============================================================================

import React, { useState } from 'react';
import { PriceReportModal } from '../dispute/PriceReportModal';

export interface PharmacyOfferItem {
  offerId: string;
  pharmacy: {
    id: string;
    businessName: string;
    address: string;
    locality: string;
    phone: string;
    distanceKm: number | null;
    latitude: number;
    longitude: number;
  };
  sellingPrice: number;
  unitPrice: number;
  savingsVsMrp: number;
  savingsPercentage: number;
  stockStatus: 'IN_STOCK' | 'LIMITED_STOCK' | 'OUT_OF_STOCK' | 'CALL_TO_CONFIRM';
  verificationStatus: string;
  observationTimestamp: string;
}

interface NearbyPharmacyListProps {
  offers: PharmacyOfferItem[];
  medicineId: string;
  medicineName: string;
}

export function NearbyPharmacyList({
  offers,
  medicineId,
  medicineName,
}: NearbyPharmacyListProps) {
  const [selectedOfferForReport, setSelectedOfferForReport] = useState<PharmacyOfferItem | null>(
    null
  );

  const getStockBadge = (status: PharmacyOfferItem['stockStatus']) => {
    switch (status) {
      case 'IN_STOCK':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            In Stock
          </span>
        );
      case 'LIMITED_STOCK':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
            Limited Stock
          </span>
        );
      case 'OUT_OF_STOCK':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
            Out of Stock
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
            Call to Confirm
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Available at Pharmacies Near You
          </h2>
          <p className="text-xs text-slate-500">
            Verified licensed chemists in Bengaluru with confirmed stock and pricing.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
          {offers.length} {offers.length === 1 ? 'Store' : 'Stores'} Found
        </span>
      </div>

      {offers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
          <p className="text-sm font-medium text-slate-600">
            No active pharmacy quotes found within your selected radius.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Try expanding your search radius or check back soon as more chemists update their stock.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {offers.map((offer) => (
            <div
              key={offer.offerId}
              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-base">
                    {offer.pharmacy.businessName}
                  </span>
                  {getStockBadge(offer.stockStatus)}
                </div>

                <p className="text-xs text-slate-600">{offer.pharmacy.address}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  {offer.pharmacy.distanceKm !== null && (
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {offer.pharmacy.distanceKm} km away
                    </span>
                  )}
                  <span>Ph: {offer.pharmacy.phone}</span>
                  <span className="text-slate-400">• Form 20/21 Verified</span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                <div className="text-left sm:text-right">
                  <div className="text-2xl font-black text-slate-900">
                    ₹{offer.sellingPrice.toFixed(2)}
                  </div>
                  {offer.savingsVsMrp > 0 ? (
                    <span className="text-xs font-bold text-emerald-700 block">
                      Save ₹{offer.savingsVsMrp.toFixed(2)} ({offer.savingsPercentage}% off)
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 block">Standard MRP</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${offer.pharmacy.latitude},${offer.pharmacy.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <span>Directions</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedOfferForReport(offer)}
                    className="text-[11px] text-slate-400 hover:text-rose-600 text-center transition-colors"
                  >
                    Report Price
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Price Dispute Modal */}
      {selectedOfferForReport && (
        <PriceReportModal
          pharmacyId={selectedOfferForReport.pharmacy.id}
          pharmacyName={selectedOfferForReport.pharmacy.businessName}
          medicineId={medicineId}
          medicineName={medicineName}
          listedPrice={selectedOfferForReport.sellingPrice}
          onClose={() => setSelectedOfferForReport(null)}
        />
      )}
    </div>
  );
}

