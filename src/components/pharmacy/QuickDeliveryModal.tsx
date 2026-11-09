// ==============================================================================
// MEDICOMPARE INDIA — QUICK DELIVERY & RUNNER DISCOVERY MODAL
// File: src/components/pharmacy/QuickDeliveryModal.tsx
// Governance: AGENTS.md, FR-007, FR-012, DOC-UI-001 (MC-010)
// ==============================================================================

'use client';

import React, { useState } from 'react';

interface QuickDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacyPhone: string;
  medicineName: string;
  distanceKm: number | null;
}

export function QuickDeliveryModal({
  isOpen,
  onClose,
  pharmacyName,
  pharmacyAddress,
  pharmacyPhone,
  medicineName,
  distanceKm,
}: QuickDeliveryModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cleanPhone = pharmacyPhone.replace(/[^0-9]/g, '');
  const waMessage = encodeURIComponent(
    `Hello, I saw ${medicineName} in stock at ${pharmacyName} on MediCompare India. I would like to reserve this medication for immediate pickup or delivery runner.`
  );

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${pharmacyName}, ${pharmacyAddress}, Phone: ${pharmacyPhone}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const estimatedMins = distanceKm ? Math.max(10, Math.round(distanceKm * 4 + 8)) : 25;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              ⚡ Fastest Pickup & Delivery
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Get {medicineName} As Early As Possible
            </h2>
            <p className="text-xs text-slate-500">
              Estimated arrival: <span className="font-bold text-emerald-700">~{estimatedMins} minutes</span> from {pharmacyName} ({distanceKm ? `${distanceKm} km` : 'Nearby'}).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Selected Chemist Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">{pharmacyName}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              In Stock
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{pharmacyAddress}</p>
          <div className="pt-1 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">Ph: {pharmacyPhone}</span>
            <button
              type="button"
              onClick={handleCopyAddress}
              className="font-bold text-emerald-700 hover:text-emerald-800 underline transition-colors"
            >
              {copied ? '✓ Address Copied!' : '📋 Copy Address for Runner'}
            </button>
          </div>
        </div>

        {/* Option 1: Direct Store Hold & Call */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Step 1 • Reserve with Chemist
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={`tel:${pharmacyPhone}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-sm"
            >
              <span>📞 Call Chemist to Hold</span>
            </a>
            <a
              href={`https://wa.me/91${cleanPhone}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-all"
            >
              <span>💬 WhatsApp Order</span>
            </a>
          </div>
        </div>

        {/* Option 2: Instant Runner Apps */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Step 2 • Dispatch Instant Delivery Runner (15–30 Mins)
          </span>
          <p className="text-xs text-slate-500">
            Book a local runner to pick up from this store and deliver straight to your doorstep:
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <a
              href="https://www.swiggy.com/genie"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-200 bg-white p-2.5 hover:border-orange-400 hover:shadow-xs transition-all flex flex-col items-center gap-1 group"
            >
              <span className="text-base">🛵</span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-orange-600">Swiggy Genie</span>
              <span className="text-[10px] text-slate-400">15-30m runner</span>
            </a>
            <a
              href="https://www.dunzo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-200 bg-white p-2.5 hover:border-emerald-400 hover:shadow-xs transition-all flex flex-col items-center gap-1 group"
            >
              <span className="text-base">⚡</span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600">Dunzo</span>
              <span className="text-[10px] text-slate-400">Local pickup</span>
            </a>
            <a
              href="https://porter.in"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-200 bg-white p-2.5 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col items-center gap-1 group"
            >
              <span className="text-base">📦</span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Porter</span>
              <span className="text-[10px] text-slate-400">2-Wheeler runner</span>
            </a>
          </div>
        </div>

        {/* Option 3: Major Online Pharmacy Apps */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Alternative • Quick Medicine Apps
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <a
              href={`https://www.apollo247.com/search-medicines/${encodeURIComponent(medicineName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              Apollo 24/7 Instant
            </a>
            <a
              href={`https://www.1mg.com/search/all?name=${encodeURIComponent(medicineName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              Tata 1mg
            </a>
            <a
              href={`https://pharmeasy.in/search/all?name=${encodeURIComponent(medicineName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              PharmEasy
            </a>
          </div>
        </div>

        {/* Statutory Reminder */}
        <div className="rounded-xl bg-slate-100 px-3.5 py-2 text-[11px] text-slate-500">
          ⚠️ <span className="font-semibold">Prescription Rule:</span> Please have your valid physical doctor's prescription ready for Schedule H medicines when picking up or handing over to a delivery runner.
        </div>
      </div>
    </div>
  );
}
