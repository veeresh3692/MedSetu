// ==============================================================================
// MEDICOMPARE INDIA — API VALIDATION & ZOD SCHEMAS TEST SUITE
// Test Suite: tests/unit/api/apiValidation.test.ts
// Governance: AGENTS.md, Rule 03 (Zod Validation), DOC-API-001 (MC-009)
// ==============================================================================

import { describe, it, expect } from 'vitest';
import {
  searchMedicineQuerySchema,
  comparisonQuerySchema,
  priceDisputeReportSchema,
} from '../../../src/lib/validation/apiSchemas';

describe('API Input Validation Schemas (Zod)', () => {
  describe('1. Search Medicine Query Schema', () => {
    it('should validate valid search query parameters', () => {
      const valid = searchMedicineQuerySchema.safeParse({ q: 'Augmentin', limit: '10' });
      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.q).toBe('Augmentin');
        expect(valid.data.limit).toBe(10);
      }
    });

    it('should reject search queries shorter than 2 characters', () => {
      const invalid = searchMedicineQuerySchema.safeParse({ q: 'a' });
      expect(invalid.success).toBe(false);
      if (!invalid.success) {
        expect(invalid.error.flatten().fieldErrors.q).toBeDefined();
      }
    });

    it('should reject limits exceeding maximum bound of 20', () => {
      const invalid = searchMedicineQuerySchema.safeParse({ q: 'Metformin', limit: '50' });
      expect(invalid.success).toBe(false);
      if (!invalid.success) {
        expect(invalid.error.flatten().fieldErrors.limit).toBeDefined();
      }
    });
  });

  describe('2. Comparison Query Schema', () => {
    it('should validate valid medicine comparison parameters', () => {
      const valid = comparisonQuerySchema.safeParse({
        id: 'm0000000-0000-0000-0000-000000000001',
        lat: '12.9716',
        lng: '77.5946',
        radius: '5',
        sortBy: 'price',
      });
      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.id).toBe('m0000000-0000-0000-0000-000000000001');
        expect(valid.data.lat).toBe(12.9716);
        expect(valid.data.sortBy).toBe('price');
      }
    });

    it('should reject non-UUID medicine IDs', () => {
      const invalid = comparisonQuerySchema.safeParse({ id: 'invalid-id' });
      expect(invalid.success).toBe(false);
    });

    it('should reject out-of-bounds latitude and longitude', () => {
      const invalid = comparisonQuerySchema.safeParse({
        id: 'm0000000-0000-0000-0000-000000000001',
        lat: 95.0, // > 90
        lng: 77.5,
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe('3. Price Dispute Report Schema', () => {
    it('should validate valid dispute submissions', () => {
      const valid = priceDisputeReportSchema.safeParse({
        pharmacyId: 'p0000000-0000-0000-0000-000000000001',
        medicineId: 'm0000000-0000-0000-0000-000000000001',
        reportedSellingPrice: 215.0,
        issueType: 'PRICE_HIGHER_THAN_LISTED',
        userComment: 'Quoted higher price in store',
      });
      expect(valid.success).toBe(true);
    });

    it('should reject invalid issueType enum values', () => {
      const invalid = priceDisputeReportSchema.safeParse({
        pharmacyId: 'p0000000-0000-0000-0000-000000000001',
        medicineId: 'm0000000-0000-0000-0000-000000000001',
        issueType: 'INVALID_TYPE',
      });
      expect(invalid.success).toBe(false);
    });
  });
});

