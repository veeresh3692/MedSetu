// ==============================================================================
// MEDICOMPARE INDIA — CSV CATALOG UPLOAD & VALIDATION PAGE
// Route: /pharmacy/upload
// Governance: AGENTS.md, Rules 02 & 03, DOC-DATA-003 (MC-012)
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const SAMPLE_CSV = `medicine_slug,brand_name,selling_price,stock_status
augmentin-625-duo-tablet,Augmentin 625 Duo,188.00,IN_STOCK
moxikind-cv-625-tablet,Moxikind-CV 625,130.00,IN_STOCK
glycomet-500-tablet,Glycomet 500,18.00,IN_STOCK
telma-40-tablet,Telma 40,118.00,LIMITED_STOCK
atorva-10-tablet,Atorva 10,92.00,IN_STOCK
pan-40-tablet,Pan 40,130.00,IN_STOCK`;

export default function PharmacyUploadPage() {
  const [pharmacyId, setPharmacyId] = useState('p0000000-0000-0000-0000-000000000001'); // Apollo Indiranagar default
  const [csvContent, setCsvContent] = useState<string>(SAMPLE_CSV);
  const [fileName, setFileName] = useState('inventory-feed.csv');
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvContent((event.target?.result as string) || '');
      };
      reader.readAsText(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch('/api/pharmacy/upload-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pharmacyId,
          fileName,
          csvText: csvContent,
        }),
      });

      const json = await res.json();
      if (res.ok || json.data) {
        setResult(json.data);
      } else {
        setErrorMsg(json.error?.message || 'Failed to process inventory upload.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during network transfer.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/pharmacy" className="hover:text-emerald-600 transition-colors">
            Chemist Portal
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">CSV Catalog Ingestion</span>
        </div>

        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Upload Inventory Catalog Feed
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Bulk synchronize active medicine stock and selling prices from your pharmacy POS.
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
            <strong>Error: </strong>
            {errorMsg}
          </div>
        )}

        {/* Upload Form */}
        <form onSubmit={handleUploadSubmit} className="space-y-6">
          {/* Pharmacy Store Selector */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Pharmacy Store Location
            </label>
            <select
              value={pharmacyId}
              onChange={(e) => setPharmacyId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            >
              <option value="p0000000-0000-0000-0000-000000000001">
                Apollo Pharmacy — 100 Feet Road, Indiranagar (Verified)
              </option>
              <option value="p0000000-0000-0000-0000-000000000002">
                MedPlus Chemist — 80 Feet Road, Koramangala 4th Block (Verified)
              </option>
              <option value="p0000000-0000-0000-0000-000000000003">
                PMBJP Jan Aushadhi Kendra — 11th Main, Jayanagar 4th Block (Verified)
              </option>
              <option value="p0000000-0000-0000-0000-000000000004">
                Sri Raghavendra Medicals — Sampige Road, Malleshwaram (Verified)
              </option>
            </select>
          </div>

          {/* File Upload Zone */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                CSV File Content Preview
              </span>
              <button
                type="button"
                onClick={() => {
                  setCsvContent(SAMPLE_CSV);
                  setFileName('sample-inventory.csv');
                }}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Reset to Sample Feed
              </button>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="text-xs text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
              />
              <span className="text-xs text-slate-400">File: {fileName}</span>
            </div>

            <textarea
              rows={8}
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              className="w-full font-mono text-xs text-slate-800 rounded-xl border border-slate-300 p-3.5 focus:border-emerald-600 focus:outline-none"
              placeholder="Paste raw CSV or upload file above..."
            />

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-400">
                Rule: Selling prices must strictly not exceed manufacturer printed MRP.
              </div>
              <button
                type="submit"
                disabled={isUploading}
                className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isUploading ? 'Validating & Ingesting...' : 'Validate & Upload Batch'}
              </button>
            </div>
          </div>
        </form>

        {/* Ingestion Batch Results */}
        {result && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Ingestion Batch Summary</h3>
                <p className="text-xs text-slate-500">File: {result.fileName}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  result.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : result.status === 'PARTIALLY_FAILED'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {result.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-[10px] font-bold uppercase text-slate-500">Total Rows</span>
                <div className="text-xl font-black text-slate-900">{result.totalRows}</div>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3">
                <span className="text-[10px] font-bold uppercase text-emerald-700">Valid Ingested</span>
                <div className="text-xl font-black text-emerald-700">{result.validRows}</div>
              </div>
              <div className="rounded-xl bg-rose-50 p-3">
                <span className="text-[10px] font-bold uppercase text-rose-700">Rejected Rows</span>
                <div className="text-xl font-black text-rose-700">{result.rejectedRows}</div>
              </div>
            </div>

            {/* Error Table if Any */}
            {result.errors && result.errors.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-rose-700">
                  Validation Errors Encountered:
                </span>
                <div className="overflow-x-auto rounded-xl border border-rose-200">
                  <table className="min-w-full divide-y divide-rose-200 text-xs">
                    <thead className="bg-rose-50 text-rose-900 font-semibold">
                      <tr>
                        <th className="px-3 py-2 text-left">Row #</th>
                        <th className="px-3 py-2 text-left">Medicine Identifier</th>
                        <th className="px-3 py-2 text-left">Error Code</th>
                        <th className="px-3 py-2 text-left">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-100 bg-white">
                      {result.errors.map((err: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-3 py-2 font-mono font-bold text-slate-900">
                            {err.rowNumber}
                          </td>
                          <td className="px-3 py-2 font-medium text-slate-800">
                            {err.identifier}
                          </td>
                          <td className="px-3 py-2 font-mono text-[10px] font-bold text-rose-600">
                            {err.errorCode}
                          </td>
                          <td className="px-3 py-2 text-slate-600">{err.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {result.validRows > 0 && (
              <div className="pt-2 flex justify-end">
                <Link
                  href="/compare/m0000000-0000-0000-0000-000000000001"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  View Updated Prices on Consumer Comparison Page →
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

