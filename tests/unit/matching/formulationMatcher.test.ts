// ==============================================================================
// MEDICOMPARE INDIA — FORMULATION MATCHING ENGINE UNIT TESTS
// Test Suite: tests/unit/matching/formulationMatcher.test.ts
// Governance: AGENTS.md, Rules 02 & 04, DOC-DATA-002 (MC-008)
// ==============================================================================

import { describe, it, expect } from 'vitest';
import {
  evaluateFormulationEquivalence,
  validateReleaseLock,
} from '../../../src/lib/matching/formulationMatcher';
import {
  calculateSavings,
  estimateMonthlyChronicCost,
  normalizeUnitPrice,
} from '../../../src/lib/matching/priceNormalizer';
import {
  classifyAlternativeCategory,
  rankBioequivalentAlternatives,
} from '../../../src/lib/matching/bioequivalenceRanker';
import { ClinicalFormulation, MedicineSKU } from '../../../src/lib/matching/types';

describe('Formulation Matching & Bioequivalence Engine', () => {
  // Mock Data setup representing authentic seed formulations
  const formulationAmoxyClavIR: ClinicalFormulation = {
    id: 'f0000000-0000-0000-0000-000000000001',
    name: 'Amoxicillin and Potassium Clavulanate Tablet 625mg',
    dosageForm: 'TABLET',
    releaseType: 'IMMEDIATE_RELEASE',
    isCombination: true,
    normalizedStrength: '500mg + 125mg',
  };

  const formulationMetforminIR: ClinicalFormulation = {
    id: 'f0000000-0000-0000-0000-000000000002',
    name: 'Metformin Hydrochloride Tablet 500mg',
    dosageForm: 'TABLET',
    releaseType: 'IMMEDIATE_RELEASE',
    isCombination: false,
    normalizedStrength: '500mg',
  };

  const formulationMetforminSR: ClinicalFormulation = {
    id: 'f0000000-0000-0000-0000-000000000003',
    name: 'Metformin Hydrochloride Sustained Release Tablet 500mg',
    dosageForm: 'TABLET',
    releaseType: 'SUSTAINED_RELEASE',
    isCombination: false,
    normalizedStrength: '500mg',
  };

  const augmentin625: MedicineSKU = {
    id: 'm0000000-0000-0000-0000-000000000001',
    brandName: 'Augmentin 625 Duo Tablet',
    slug: 'augmentin-625-duo-tablet',
    formulationId: 'f0000000-0000-0000-0000-000000000001',
    manufacturer: 'GlaxoSmithKline Pharmaceuticals Ltd',
    packSize: 10,
    packUnit: 'tablets',
    mrp: 223.5,
    schedule: 'SCHEDULE_H',
    isGenericGeneric: false,
    isDiscontinued: false,
  };

  const moxikindCV625: MedicineSKU = {
    id: 'm0000000-0000-0000-0000-000000000002',
    brandName: 'Moxikind-CV 625 Tablet',
    slug: 'moxikind-cv-625-tablet',
    formulationId: 'f0000000-0000-0000-0000-000000000001',
    manufacturer: 'Mankind Pharma Ltd',
    packSize: 10,
    packUnit: 'tablets',
    mrp: 165.0,
    schedule: 'SCHEDULE_H',
    isGenericGeneric: false,
    isDiscontinued: false,
  };

  const janAushadhiAmoxyClav: MedicineSKU = {
    id: 'm0000000-0000-0000-0000-000000000004',
    brandName: 'Jan Aushadhi Amoxy-Clav 625',
    slug: 'jan-aushadhi-amoxy-clav-625',
    formulationId: 'f0000000-0000-0000-0000-000000000001',
    manufacturer: 'PMBI',
    packSize: 10,
    packUnit: 'tablets',
    mrp: 58.0,
    schedule: 'SCHEDULE_H',
    isGenericGeneric: true,
    isDiscontinued: false,
  };

  describe('1. Release Profile Safety Lock (FR-003)', () => {
    it('should approve matching identical release mechanisms', () => {
      const check = validateReleaseLock('IMMEDIATE_RELEASE', 'IMMEDIATE_RELEASE');
      expect(check.isValid).toBe(true);
      expect(check.warning).toBeUndefined();
    });

    it('should strictly reject cross-matching Immediate Release with Sustained Release', () => {
      const check = validateReleaseLock('IMMEDIATE_RELEASE', 'SUSTAINED_RELEASE');
      expect(check.isValid).toBe(false);
      expect(check.warning).toContain('Clinical Safety Lock');
    });

    it('should reject Metformin IR vs Metformin SR during full formulation evaluation', () => {
      const result = evaluateFormulationEquivalence(formulationMetforminIR, formulationMetforminSR);
      expect(result.isMatch).toBe(false);
      expect(result.matchScore).toBe(0);
      expect(result.releaseLockPassed).toBe(false);
      expect(result.clinicalWarning).toBeDefined();
    });
  });

  describe('2. Price Normalization & Savings Calculations (FR-005 & FR-009)', () => {
    it('should accurately calculate normalized unit price per tablet', () => {
      const norm = normalizeUnitPrice(223.5, 10, 'tablets');
      expect(norm.unitPrice).toBe(22.35);
      expect(norm.formattedUnitPrice).toBe('₹22.35 / tablet');
      expect(norm.formattedPackPrice).toBe('₹223.50 (10 tablets)');
    });

    it('should calculate accurate savings between Augmentin and Jan Aushadhi generic', () => {
      // Augmentin ₹22.35/tab vs Jan Aushadhi ₹5.80/tab
      const { savingsPerUnit, savingsPercentage } = calculateSavings(22.35, 5.8);
      expect(savingsPerUnit).toBe(16.55);
      expect(savingsPercentage).toBeCloseTo(74.0, 1);
    });

    it('should correctly estimate 30-day chronic recurring cost', () => {
      // 1 tablet per day at ₹9.50/tab for 30 days = ₹285.00
      const monthlyCost = estimateMonthlyChronicCost(9.5, 1);
      expect(monthlyCost).toBe(285.0);
    });

    it('should throw an error on invalid zero or negative pack size', () => {
      expect(() => normalizeUnitPrice(100, 0)).toThrow('packSize must be greater than zero');
      expect(() => normalizeUnitPrice(100, -5)).toThrow('packSize must be greater than zero');
    });
  });

  describe('3. Commercial Tier Classification & Bioequivalence Ranking (FR-004)', () => {
    it('should classify Jan Aushadhi generic-generic medicines correctly', () => {
      const { category, categoryLabel } = classifyAlternativeCategory(janAushadhiAmoxyClav);
      expect(category).toBe('JAN_AUSHADHI_GENERIC');
      expect(categoryLabel).toContain('Jan Aushadhi');
    });

    it('should classify GSK as an Innovator Commercial Brand', () => {
      const { category } = classifyAlternativeCategory(augmentin625);
      expect(category).toBe('INNOVATOR_BRAND');
    });

    it('should classify Mankind Pharma as a Domestic Branded Generic', () => {
      const { category } = classifyAlternativeCategory(moxikindCV625);
      expect(category).toBe('BRANDED_GENERIC');
    });

    it('should rank Jan Aushadhi generic lines first, followed by branded generics sorted by savings', () => {
      const candidateMap = new Map<string, ClinicalFormulation>();
      candidateMap.set(formulationAmoxyClavIR.id, formulationAmoxyClavIR);

      const candidates = [moxikindCV625, janAushadhiAmoxyClav];

      const alternatives = rankBioequivalentAlternatives(
        augmentin625,
        formulationAmoxyClavIR,
        candidates,
        candidateMap
      );

      expect(alternatives).toHaveLength(2);
      // Jan Aushadhi should rank first
      expect(alternatives[0].medicine.id).toBe(janAushadhiAmoxyClav.id);
      expect(alternatives[0].savingsPercentage).toBeGreaterThan(70);
      expect(alternatives[0].requiresPrescription).toBe(true);

      // Moxikind-CV should rank second
      expect(alternatives[1].medicine.id).toBe(moxikindCV625.id);
      expect(alternatives[1].savingsPercentage).toBeGreaterThan(20);
    });
  });
});

