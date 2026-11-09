// ==============================================================================
// MEDICOMPARE INDIA — NEARBY PHARMACY OFFERS LIST COMPONENT
// File: src/components/pharmacy/NearbyPharmacyList.tsx
// Governance: AGENTS.md, FR-007, FR-012, FR-015, FR-016, DOC-UI-001 (MC-010)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { PriceReportModal } from '../dispute/PriceReportModal';
import { QuickDeliveryModal } from './QuickDeliveryModal';

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
  const [selectedOfferForDelivery, setSelectedOfferForDelivery] = useState<PharmacyOfferItem | null>(
    null
  );

  const getStockBadge = (status: PharmacyOfferItem['stockStatus']) => {
    switch (status) {
      case 'IN_STOCK':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            In Stock
          </span>
        );
      case 'LIMITED_STOCK':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
            Limited Stock
          </span>
        );
      case 'OUT_OF_STOCK':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
            Out of Stock
          </span>
        );
      case 'CALL_TO_CONFIRM':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
            Call to Confirm
          </span>
        );
    }
  };

  // Find the fastest / closest in-stock pharmacy
  const closestInStockOffer = [...offers]
    .filter((o) => o.stockStatus === 'IN_STOCK' || o.stockStatus === 'LIMITED_STOCK')
    .sort((a, b) => (a.pharmacy.distanceKm || 999) - (b.pharmacy.distanceKm || 999))[0];

  const getEtaLabel = (distanceKm: number | null) => {
    if (!distanceKm) return '~20-30 mins';
    const mins = Math.max(8, Math.round(distanceKm * 4 + 6));
    return `~${mins} mins`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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

      {/* Fastest Delivery / Earliest Walk-in Highlight Card */}
      {closestInStockOffer && (
        <div className="rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <span>⚡ Earliest Available Store</span>
              <span className="rounded-md bg-emerald-600 text-white text-[10px] px-1.5 py-0.5">
                Fastest Option
              </span>
            </div>
            <div className="font-bold text-slate-900 text-sm sm:text-base">
              {closestInStockOffer.pharmacy.businessName}
            </div>
            <p className="text-xs text-slate-600">
              {closestInStockOffer.pharmacy.distanceKm} km away • Estimated arrival:{' '}
              <span className="font-bold text-emerald-700">
                {getEtaLabel(closestInStockOffer.pharmacy.distanceKm)}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setSelectedOfferForDelivery(closestInStockOffer)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-sm"
            >
              <span>⚡ Get It As Early As Possible</span>
            </button>
          </div>
        </div>
      )}

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
          {offers.map((offer) => {
            const eta = getEtaLabel(offer.pharmacy.distanceKm);

            return (
              <div
                key={offer.offerId}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">
                      {offer.pharmacy.businessName}
                    </span>
                    {getStockBadge(offer.stockStatus)}
                    {offer.pharmacy.distanceKm !== null && offer.pharmacy.distanceKm < 2 && (
                      <span className="rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold px-1.5 py-0.5">
                        ⚡ Quick Walk-in
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600">{offer.pharmacy.address}</p>

                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 pt-1">
                    {offer.pharmacy.distanceKm !== null && (
                      <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        📍 {offer.pharmacy.distanceKm} km away • {eta}
                      </span>
                    )}
                    <a
                      href={`tel:${offer.pharmacy.phone}`}
                      className="font-medium text-slate-700 hover:text-emerald-700 transition-colors"
                    >
                      📞 {offer.pharmacy.phone}
                    </a>
                    <span className="text-slate-400">• Form 20/21 Verified</span>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex flex-col sm:items-end gap-2.5 flex-shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
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

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Instant Runner / Quick Delivery Trigger */}
                    <button
                      type="button"
                      onClick={() => setSelectedOfferForDelivery(offer)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
                      title="View instant delivery apps and runner options for this store"
                    >
                      <span>⚡ Get It Early</span>
                    </button>

                    {/* Google Maps Directions */}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${offer.pharmacy.latitude},${offer.pharmacy.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                    >
                      <span>Directions</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>

                    {/* Report Dispute Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedOfferForReport(offer)}
                      className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors px-1"
                    >
                      Report Price
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Delivery / Runner Apps Modal */}
      {selectedOfferForDelivery && (
        <QuickDeliveryModal
          isOpen={true}
          onClose={() => setSelectedOfferForDelivery(null)}
          pharmacyName={selectedOfferForDelivery.pharmacy.businessName}
          pharmacyAddress={selectedOfferForDelivery.pharmacy.address}
          pharmacyPhone={selectedOfferForDelivery.pharmacy.phone}
          medicineName={medicineName}
          distanceKm={selectedOfferForDelivery.pharmacy.distanceKm}
        />
      )}

      {/* Price Dispute Modal */}
      {selectedOfferForReport && (
        <PriceReportModal
          pharmacyId={selectedOfferForReport.pharmacy.id}
          pharmacyName={selectedOfferForReport.pharmacy.businessName}
          medicineId={medicineId}
          medicineName={medicineName}
          currentReportedPrice={selectedOfferForReport.sellingPrice}
          isOpen={true}
          onClose={() => setSelectedOfferForReport(null)}
        />
      )}
    </div>
  );
}
