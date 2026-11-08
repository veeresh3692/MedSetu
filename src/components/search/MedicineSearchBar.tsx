// ==============================================================================
// MEDICOMPARE INDIA — AUTOCOMPLETE MEDICINE SEARCH BAR
// File: src/components/search/MedicineSearchBar.tsx
// Governance: AGENTS.md, FR-001 (Autocomplete Search), DOC-UI-001 (MC-010)
// ==============================================================================

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export interface SearchResultItem {
  id: string;
  brandName: string;
  slug: string;
  manufacturer: string;
  formulation: {
    id: string;
    name: string;
    dosageForm: string;
    releaseType: string;
    normalizedStrength: string;
  };
  packSize: number;
  packUnit: string;
  mrp: number;
  unitPrice: number;
  formattedUnitPrice: string;
  schedule: string;
  isGenericGeneric: boolean;
}

interface MedicineSearchBarProps {
  placeholder?: string;
  initialQuery?: string;
  className?: string;
}

export function MedicineSearchBar({
  placeholder = 'Search by medicine brand (e.g. Augmentin, Glycomet, Telma) or generic salt...',
  initialQuery = '',
  className = '',
}: MedicineSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search query
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/medicines/search?q=${encodeURIComponent(query.trim())}&limit=8`);
        const json = await res.json();
        if (json.success && json.data?.results) {
          setResults(json.data.results);
          setIsOpen(true);
          setSelectedIndex(-1);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Failed to search medicines:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery(item.brandName);
    router.push(`/compare/${item.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-3xl ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-4 text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search medicine catalog"
          className="h-14 w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-12 text-base text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
        />

        {/* Clear or Loading Icon */}
        <div className="absolute right-4 flex items-center">
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
          ) : query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
          {results.length > 0 ? (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex cursor-pointer items-start justify-between px-4 py-3 transition-colors ${
                    isSelected ? 'bg-emerald-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">
                        {item.brandName}
                      </span>
                      {item.isGenericGeneric && (
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                          Jan Aushadhi
                        </span>
                      )}
                      {item.schedule.startsWith('SCHEDULE_') && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                          Rx
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.formulation.name} • {item.manufacturer}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-slate-900">
                      ₹{item.mrp.toFixed(2)}
                    </div>
                    <div className="text-[11px] font-medium text-emerald-700">
                      {item.formattedUnitPrice}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-6 text-center text-sm text-slate-500">
              No matching medicines found for &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

