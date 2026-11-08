// ==============================================================================
// MEDICOMPARE INDIA — GLOBAL FOOTER & STATUTORY DISCLAIMER
// File: src/components/layout/Footer.tsx
// Governance: AGENTS.md, Rule 01 & 03 (Mandatory Disclaimers, DPDP Act)
// ==============================================================================

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      {/* Statutory Regulatory Disclaimer Banner */}
      <div className="bg-emerald-950/80 border-b border-emerald-800/40 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center gap-3 text-xs leading-relaxed text-emerald-200/90">
          <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <strong className="text-white font-semibold uppercase tracking-wider block sm:inline mr-2">
              Statutory Healthcare Notice:
            </strong>
            MediCompare India provides price comparison and informational discovery only. We do
            not prescribe, sell, or dispense medications. A valid physical prescription from a
            registered medical practitioner (RMP) is required to purchase Schedule H, H1, or X
            medicines from licensed retail pharmacies. Always consult a qualified physician before
            initiating or altering any treatment.
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-tight">
                Medi<span className="text-emerald-400">Compare</span> India
              </span>
              <span className="text-[10px] font-semibold uppercase bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 px-1.5 py-0.5 rounded">
                Bengaluru Pilot
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Empowering Indian consumers to discover the lowest trustworthy price for exact
              bioequivalent medicine formulations across licensed neighborhood chemists and Pradhan
              Mantri Jan Aushadhi Kendras.
            </p>
            <p className="text-xs text-slate-500">
              Compliant with the Drugs and Cosmetics Act 1940 and India Digital Personal Data
              Protection (DPDP) Act 2023.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Transparency & Legal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                  DPDP Privacy Notice
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-emerald-400 transition-colors">
                  Non-Dispensing Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="hover:text-emerald-400 transition-colors">
                  Drug License Verification Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Medical Emergency
            </h3>
            <p className="text-xs text-slate-400 mb-2 leading-relaxed">
              MediCompare is not for acute emergency care. In critical situations, immediately contact:
            </p>
            <div className="rounded-lg border border-rose-900/40 bg-rose-950/20 p-2.5 text-xs text-rose-300">
              <span className="font-bold text-white block">National Emergency Ambulance:</span>
              <span className="text-sm font-extrabold text-rose-400">108 / 112</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 MediCompare India. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Zero patient health data stored. Privacy by Design.</p>
        </div>
      </div>
    </footer>
  );
}

