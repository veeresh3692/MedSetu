// ==============================================================================
// MEDICOMPARE INDIA — FORMULATION MATCHING ENGINE DOMAIN TYPES
// File: src/lib/matching/types.ts
// Governance: AGENTS.md, Rule 02, DOC-DATA-002 (MC-008)
// ==============================================================================

export type DosageForm =
  | 'TABLET'
  | 'CAPSULE'
  | 'SYRUP'
  | 'INJECTION'
  | 'SUSPENSION'
  | 'DROPS'
  | 'OINTMENT'
  | 'GEL'
  | 'INHALER'
  | 'RESPULE'
  | 'POWDER';

export type ReleaseType =
  | 'IMMEDIATE_RELEASE'
  | 'SUSTAINED_RELEASE'
  | 'EXTENDED_RELEASE'
  | 'ENTERIC_COATED'
  | 'MODIFIED_RELEASE';

export type DrugSchedule =
  | 'SCHEDULE_H'
  | 'SCHEDULE_H1'
  | 'SCHEDULE_X'
  | 'OTC'
  | 'GENERAL';

export type AlternativeCategory =
  | 'JAN_AUSHADHI_GENERIC'
  | 'BRANDED_GENERIC'
  | 'INNOVATOR_BRAND';

export interface ActiveIngredientComponent {
  ingredientId: string;
  innName: string;
  strengthValue: number;
  strengthUnit: string;
}

export interface ClinicalFormulation {
  id: string;
  name: string;
  dosageForm: DosageForm;
  releaseType: ReleaseType;
  isCombination: boolean;
  normalizedStrength: string;
  components?: ActiveIngredientComponent[];
}

export interface MedicineSKU {
  id: string;
  brandName: string;
  slug: string;
  formulationId: string;
  manufacturer: string;
  packSize: number;
  packUnit: string;
  mrp: number; // In INR (₹)
  schedule: DrugSchedule;
  isGenericGeneric: boolean; // True for PMBJP Jan Aushadhi
  isDiscontinued: boolean;
  isDemo?: boolean;
}

export interface NormalizedPrice {
  packPrice: number;
  packSize: number;
  packUnit: string;
  unitPrice: number; // Price per single tablet/capsule/ml
  formattedUnitPrice: string; // e.g. "₹22.35 / tablet"
  formattedPackPrice: string; // e.g. "₹223.50 (Strip of 10 tablets)"
}

export interface BioequivalentAlternative {
  medicine: MedicineSKU;
  category: AlternativeCategory;
  categoryLabel: string;
  unitPrice: number;
  savingsPerUnit: number; // In INR
  savingsPercentage: number; // e.g. 74.05%
  isExactBioequivalent: boolean;
  requiresPrescription: boolean;
  warningNote?: string;
}

export interface FormulationMatchResult {
  isMatch: boolean;
  matchScore: number; // 0 to 100
  releaseLockPassed: boolean;
  dosageFormPassed: boolean;
  reason?: string;
  clinicalWarning?: string;
}

