// ==============================================================================
// MEDICOMPARE INDIA — PRICE NORMALIZER SERVICE
// File: src/lib/matching/priceNormalizer.ts
// Governance: AGENTS.md, Rule 02, DOC-DATA-002 (MC-008)
// ==============================================================================

import { NormalizedPrice } from './types';

/**
 * Normalizes a packaged medicine price into a per-unit economic rate (₹ / tablet, ₹ / ml).
 *
 * @param packPrice Total retail price of the package in INR (₹)
 * @param packSize Number of units contained in the package (e.g., 10, 15, 100)
 * @param packUnit Name of unit (e.g. "tablets", "capsules", "ml")
 * @returns NormalizedPrice structure with raw numbers and formatted labels
 */
export function normalizeUnitPrice(
  packPrice: number,
  packSize: number,
  packUnit: string = 'tablets'
): NormalizedPrice {
  if (packSize <= 0) {
    throw new Error(`Invalid packSize: ${packSize}. Pack size must be greater than zero.`);
  }
  if (packPrice < 0) {
    throw new Error(`Invalid packPrice: ${packPrice}. Price cannot be negative.`);
  }

  // Round unit price to 2 decimal places with mathematical precision
  const unitPrice = Math.round((packPrice / packSize) * 100) / 100;
  
  // Singularize unit for display (e.g., "tablets" -> "tablet")
  const singularUnit = packUnit.endsWith('s') ? packUnit.slice(0, -1) : packUnit;

  return {
    packPrice,
    packSize,
    packUnit,
    unitPrice,
    formattedUnitPrice: `₹${unitPrice.toFixed(2)} / ${singularUnit}`,
    formattedPackPrice: `₹${packPrice.toFixed(2)} (${packSize} ${packUnit})`,
  };
}

/**
 * Calculates absolute and percentage savings for an alternative medicine compared to a baseline medicine.
 *
 * @param baselineUnitPrice Unit price of the prescribed / searched medicine (₹ / unit)
 * @param alternativeUnitPrice Unit price of the candidate substitute medicine (₹ / unit)
 * @returns Object containing absolute savings per unit (₹) and percentage savings (%)
 */
export function calculateSavings(
  baselineUnitPrice: number,
  alternativeUnitPrice: number
): { savingsPerUnit: number; savingsPercentage: number } {
  if (baselineUnitPrice <= 0) {
    return { savingsPerUnit: 0, savingsPercentage: 0 };
  }

  const savingsPerUnit = Math.round((baselineUnitPrice - alternativeUnitPrice) * 100) / 100;
  const rawPercentage = ((baselineUnitPrice - alternativeUnitPrice) / baselineUnitPrice) * 100;
  const savingsPercentage = Math.round(Math.max(0, rawPercentage) * 10) / 10;

  return {
    savingsPerUnit: Math.max(0, savingsPerUnit),
    savingsPercentage,
  };
}

/**
 * Estimates 30-day recurring chronic expenditure for a standard daily maintenance dose.
 *
 * @param unitPrice Normalized price per unit (₹ / unit)
 * @param dailyDoseUnits Units consumed per day (default: 1 tablet/day)
 * @returns Total monthly cost in INR (₹)
 */
export function estimateMonthlyChronicCost(
  unitPrice: number,
  dailyDoseUnits: number = 1
): number {
  return Math.round(unitPrice * dailyDoseUnits * 30 * 100) / 100;
}

