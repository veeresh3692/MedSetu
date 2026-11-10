// ==============================================================================
// MEDICOMPARE INDIA — CHEMIST PORTAL LOGIN
// Route: /pharmacy/login
// Governance: AGENTS.md, FR-015, FR-016 (Form 20/21 Chemist Access)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function ChemistLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('indiranagar@apollopharmacy.in');
  const [licenseNumber, setLicenseNumber] = useState('KA-BGL-2024-0012');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/pharmacy');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-xl mb-1">
              💊
            </div>
            <h1 className="text-2xl font-black text-slate-900">Chemist Portal Login</h1>
            <p className="text-xs text-slate-500">
              Access inventory management and upload verified medicine counter quotes.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Chemist Registered Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Drug License Number (Form 20 / 21)
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                required
                placeholder="e.g. KA-BGL-2024-XXXX"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? 'Verifying License...' : 'Sign In to Chemist Dashboard'}
            </button>
          </form>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-[11px] text-emerald-950 space-y-1">
            <span className="font-bold flex items-center gap-1 text-emerald-900">
              ✓ Demo Chemist Credentials Pre-loaded
            </span>
            <p className="text-slate-600">
              Click sign in to enter the verified Chemist Dashboard and CSV upload interface.
            </p>
          </div>

          <div className="text-center text-xs text-slate-500">
            <Link href="/" className="hover:text-emerald-700 underline font-medium">
              ← Return to Consumer Medicine Search
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

