// ==============================================================================
// MEDICOMPARE INDIA — CONSUMER PRICE REPORT / DISPUTE MODAL
// File: src/components/dispute/PriceReportModal.tsx
// Governance: AGENTS.md, FR-019 (Crowdsourced Price Audit), DOC-UI-001 (MC-010)
// ==============================================================================

'use client';

import React, { useState } from 'react';

interface PriceReportModalProps {
  pharmacyId: string;
  pharmacyName: string;
  medicineId: string;
  medicineName: string;
  listedPrice: number;
  onClose: () => void;
}

export function PriceReportModal({
  pharmacyId,
  pharmacyName,
  medicineId,
  medicineName,
  listedPrice,
  onClose,
}: PriceReportModalProps) {
  const [issueType, setIssueType] = useState<
    'PRICE_HIGHER_THAN_LISTED' | 'OUT_OF_STOCK' | 'STORE_REFUSED'
  >('PRICE_HIGHER_THAN_LISTED');
  const [reportedPrice, setReportedPrice] = useState<string>('');
  const [userComment, setUserComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/reports/price-dispute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pharmacyId,
          medicineId,
          reportedSellingPrice: reportedPrice ? parseFloat(reportedPrice) : undefined,
          issueType,
          userComment: userComment.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(json.error?.message || 'Failed to submit report.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        {isSuccess ? (
          <div className="text-center py-4 space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Report Submitted</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thank you for helping protect pricing transparency in Bengaluru. Our compliance
              audit team will investigate this pharmacy listing.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Report Pharmacy Discrepancy</h3>
                <p className="text-xs text-slate-500">
                  {pharmacyName} • {medicineName}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {errorMessage && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Issue Encountered
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              >
                <option value="PRICE_HIGHER_THAN_LISTED">
                  Price in store was higher than listed (Listed: ₹{listedPrice.toFixed(2)})
                </option>
                <option value="OUT_OF_STOCK">Store was completely out of stock</option>
                <option value="STORE_REFUSED">Chemist refused to dispense or provide receipt</option>
              </select>
            </div>

            {issueType === 'PRICE_HIGHER_THAN_LISTED' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Actual Price Charged by Store (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="e.g. 210.00"
                  value={reportedPrice}
                  onChange={(e) => setReportedPrice(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Additional Comments (Optional)
              </label>
              <textarea
                rows={3}
                maxLength={500}
                placeholder="Provide any details (e.g. date visited, cashier explanation)..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 rounded-xl border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-1/2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

