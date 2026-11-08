// ==============================================================================
// MEDICOMPARE INDIA — LEAFLET / OSM INTERACTIVE PHARMACY MAP
// File: src/components/pharmacy/PharmacyMap.tsx
// Governance: AGENTS.md, FR-014 (Leaflet/OSM Proximity Map), DOC-UI-001 (MC-010)
// ==============================================================================

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PharmacyOfferItem } from './NearbyPharmacyList';

interface PharmacyMapProps {
  offers: PharmacyOfferItem[];
  userLat?: number;
  userLng?: number;
}

export function PharmacyMap({ offers, userLat = 12.9716, userLng = 77.5946 }: PharmacyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically inject Leaflet CSS if not already present
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Dynamically load Leaflet JS
    import('leaflet')
      .then((L) => {
        if (!isMounted || !mapContainerRef.current) return;

        // Cleanup existing instance if re-mounting
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        // Initialize Map centered at Bengaluru or user location
        const map = L.map(mapContainerRef.current).setView([userLat, userLng], 12);
        mapInstanceRef.current = map;

        // Add OpenStreetMap Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors | MediCompare India',
        }).addTo(map);

        // Custom Emerald Pin Icon for Pharmacies
        const pharmacyIcon = L.divIcon({
          className: 'custom-pharmacy-pin',
          html: `<div style="
            background-color: #059669;
            color: white;
            border: 2px solid white;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
          ">💊</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });

        // Add Markers for Each Verified Pharmacy Offer
        const markerGroup = L.featureGroup();

        offers.forEach((offer) => {
          const lat = offer.pharmacy.latitude;
          const lng = offer.pharmacy.longitude;

          const popupContent = `
            <div style="font-family: inherit; font-size: 13px; max-width: 220px;">
              <strong style="color: #0f172a; font-size: 14px; display: block; margin-bottom: 4px;">
                ${offer.pharmacy.businessName}
              </strong>
              <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">
                ${offer.pharmacy.locality}, Bengaluru
              </div>
              <div style="display: flex; align-items: baseline; gap: 4px; margin-bottom: 6px;">
                <span style="font-size: 18px; font-weight: 800; color: #059669;">
                  ₹${offer.sellingPrice.toFixed(2)}
                </span>
                <span style="font-size: 10px; color: #64748b;">(Selling Price)</span>
              </div>
              <div style="font-size: 11px; font-weight: 600; color: ${
                offer.stockStatus === 'IN_STOCK' ? '#059669' : '#d97706'
              }; margin-bottom: 8px;">
                ${offer.stockStatus === 'IN_STOCK' ? '✓ In Stock' : 'Call to Confirm'}
              </div>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" 
                target="_blank" 
                rel="noopener noreferrer"
                style="
                  display: block;
                  text-align: center;
                  background-color: #059669;
                  color: white;
                  padding: 6px 12px;
                  border-radius: 6px;
                  text-decoration: none;
                  font-weight: 600;
                  font-size: 11px;
                "
              >
                Get Directions
              </a>
            </div>
          `;

          const marker = L.marker([lat, lng], { icon: pharmacyIcon })
            .bindPopup(popupContent)
            .addTo(markerGroup);
        });

        markerGroup.addTo(map);

        if (offers.length > 0) {
          map.fitBounds(markerGroup.getBounds().pad(0.2));
        }

        setMapLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to load Leaflet map:', err);
      });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [offers, userLat, userLng]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-emerald-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
          </svg>
          Bengaluru Pharmacy Map
        </h3>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          OpenStreetMap
        </span>
      </div>

      <div
        ref={mapContainerRef}
        className="h-80 w-full rounded-xl border border-slate-200 bg-slate-100 relative z-0 overflow-hidden"
      >
        {!mapLoaded && (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600 mr-2" />
            Loading interactive map...
          </div>
        )}
      </div>

      <p className="mt-2 text-[11px] text-slate-400 text-center">
        Pins represent verified licensed chemist premises with confirmed stock quotes.
      </p>
    </div>
  );
}

