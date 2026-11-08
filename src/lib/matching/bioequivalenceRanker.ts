// ==============================================================================
// MEDICOMPARE INDIA — BIOEQUIVALENCE RANKER SERVICE
// File: src/lib/matching/bioequivalenceRanker.ts
// Governance: AGENTS.md, Rule 02, DOC-DATA-002 (MC-008)
// ==============================================================================

import {
  AlternativeCategory,
  BioequivalentAlternative,
  ClinicalFormulation,
  MedicineSKU,
} from './types';
import { calculateSavings, normalizeUnitPrice } from './priceNormalizer';
import { evaluateFormulationEquivalence } from './formulationMatcher';

export interface RankerOptions {
  includeDemo?: boolean;
  minSavingsPercentage?: number;
}

/**
 * Classifies a medicine into its commercial tier.
 */
export function classifyAlternativeCategory(medicine: MedicineSKU): {
  category: AlternativeCategory;
  categoryLabel: string;
} {
  if (medicine.isGenericGeneric) {
    return {
      category: 'JAN_AUSHADHI_GENERIC',
      categoryLabel: 'Government Generic (PMBJP Jan Aushadhi)',
    };
  }

  // Major global innovator pharmaceutical companies in India
  const innovatorFirms = [
    'glaxosmithkline',
    'gsk',
    'pfizer',
    'abbott',
    'sanofi',
    'novartis',
    'astrazeneca',
    'bayer',
    'roche',
    'boehringer ingelheim',
    'merck',
  ];

  const mfg = medicine.manufacturer.toLowerCase();
  const isInnovator = innovatorFirms.some((firm) => mfg.includes(firm));

  if (isInnovator) {
    return {
      category: 'INNOVATOR_BRAND',
      categoryLabel: 'Innovator Commercial Brand',
    };
  }

  return {
    category: 'BRANDED_GENERIC',
    categoryLabel: 'Domestic Branded Generic',
  };
}

/**
 * Evaluates, filters, and ranks bioequivalent alternatives for a prescribed/searched medicine.
 *
 * @param targetMedicine The reference medicine being compared
 * @param targetFormulation The clinical monograph definition of the target medicine
 * @param candidates All candidate medicines in the catalog sharing the same formulation ID
 * @param candidateFormulationMap Map of formulation definitions for candidate items
 * @param options Ranking options
 * @returns Sorted array of BioequivalentAlternative objects
 */
export function rankBioequivalentAlternatives(
  targetMedicine: MedicineSKU,
  targetFormulation: ClinicalFormulation,
  candidates: MedicineSKU[],
  candidateFormulationMap: Map<string, ClinicalFormulation>,
  options: RankerOptions = {}
): BioequivalentAlternative[] {
  const targetPrice = normalizeUnitPrice(
    targetMedicine.mrp,
    targetMedicine.packSize,
    targetMedicine.packUnit
  );

  const results: BioequivalentAlternative[] = [];

  for (const candidate of candidates) {
    // 1. Exclude target medicine itself
    if (candidate.id === targetMedicine.id) {
      continue;
    }

    // 2. Exclude discontinued items
    if (candidate.isDiscontinued) {
      continue;
    }

    // 3. Exclude demo items unless explicitly enabled
    if (!options.includeDemo && candidate.isDemo) {
      continue;
    }

    // 4. Resolve candidate formulation
    const candidateFormulation = candidateFormulationMap.get(candidate.formulationId);
    if (!candidateFormulation) {
      continue;
    }

    // 5. Evaluate Clinical Bioequivalence Invariants
    const matchResult = evaluateFormulationEquivalence(targetFormulation, candidateFormulation);
    if (!matchResult.isMatch) {
      continue;
    }

    // 6. Calculate Unit Economics
    const candidatePrice = normalizeUnitPrice(
      candidate.mrp,
      candidate.packSize,
      candidate.packUnit
    );

    const { savingsPerUnit, savingsPercentage } = calculateSavings(
      targetPrice.unitPrice,
      candidatePrice.unitPrice
    );

    // Filter by minimum savings threshold if specified
    if (options.minSavingsPercentage && savingsPercentage < options.minSavingsPercentage) {
      continue;
    }

    const { category, categoryLabel } = classifyAlternativeCategory(candidate);

    const requiresPrescription =
      candidate.schedule === 'SCHEDULE_H' ||
      candidate.schedule === 'SCHEDULE_H1' ||
      candidate.schedule === 'SCHEDULE_X';

    results.push({
      medicine: candidate,
      category,
      categoryLabel,
      unitPrice: candidatePrice.unitPrice,
      savingsPerUnit,
      savingsPercentage,
      isExactBioequivalent: true,
      requiresPrescription,
      warningNote: requiresPrescription
        ? 'Physical prescription from a Registered Medical Practitioner (RMP) required at retail pharmacy.'
        : undefined,
    });
  }

  // 7. Sort Order:
  // Primary: Jan Aushadhi public generic lines first if savings exist
  // Secondary: Highest savings percentage descending
  // Tertiary: Lowest unit price ascending
  results.sort((a, b) => {
    if (a.category === 'JAN_AUSHADHI_GENERIC' && b.category !== 'JAN_AUSHADHI_GENERIC') {
      return -1;
    }
    if (b.category === 'JAN_AUSHADHI_GENERIC' && a.category !== 'JAN_AUSHADHI_GENERIC') {
      return 1;
    }
    if (b.savingsPercentage !== a.savingsPercentage) {
      return b.savingsPercentage - a.savingsPercentage;
    }
    return a.unitPrice - b.unitPrice;
  });

  return results;
}

