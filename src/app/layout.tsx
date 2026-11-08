// ==============================================================================
// MEDICOMPARE INDIA — ROOT APP ROUTER LAYOUT
// File: src/app/layout.tsx
// Governance: AGENTS.md, DOC-UI-001 (MC-010)
// ==============================================================================

import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediCompare India — Medicine Price Comparison & Nearby Pharmacy Discovery',
  description:
    'Find the lowest trustworthy price for your exact medicine formulation at licensed pharmacies near you in Bengaluru. Compare MRP, Jan Aushadhi generics, and NPPA price caps.',
  keywords: [
    'medicine price comparison',
    'pharmacy near me',
    'bengaluru pharmacy',
    'generic medicine',
    'Jan Aushadhi',
    'NPPA ceiling price',
    'augmentin price',
    'glycomet price',
  ],
  authors: [{ name: 'MediCompare India' }],
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#059669',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}

