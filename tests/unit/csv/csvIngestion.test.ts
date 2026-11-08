// ==============================================================================
// MEDICOMPARE INDIA — CSV INGESTION PIPELINE TEST SUITE
// Test Suite: tests/unit/csv/csvIngestion.test.ts
// Governance: AGENTS.md, Rules 02 & 03, DOC-DATA-003 (MC-012)
// ==============================================================================

import { describe, it, expect } from 'vitest';
import { parseRawCsvText } from '../../../src/lib/server/services/csvIngestionService';

describe('CSV Catalog Ingestion Parser', () => {
  it('should parse valid CSV text with standard headers', () => {
    const csv = `medicine_slug,brand_name,selling_price,stock_status
augmentin-625-duo-tablet,Augmentin 625 Duo,190.00,IN_STOCK
glycomet-500-tablet,Glycomet 500,18.00,LIMITED_STOCK`;

    const parsed = parseRawCsvText(csv);
    expect(parsed).toHaveLength(2);

    expect(parsed[0].rowNumber).toBe(2);
    expect(parsed[0].data['medicine_slug']).toBe('augmentin-625-duo-tablet');
    expect(parsed[0].data['selling_price']).toBe('190.00');
    expect(parsed[0].data['stock_status']).toBe('IN_STOCK');

    expect(parsed[1].rowNumber).toBe(3);
    expect(parsed[1].data['brand_name']).toBe('Glycomet 500');
    expect(parsed[1].data['stock_status']).toBe('LIMITED_STOCK');
  });

  it('should trim surrounding whitespace and remove quotes from fields', () => {
    const csv = `"medicine_slug" , "selling_price" , "stock_status"
"augmentin-625-duo-tablet" , "195.50" , "IN_STOCK"`;

    const parsed = parseRawCsvText(csv);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].data['medicine_slug']).toBe('augmentin-625-duo-tablet');
    expect(parsed[0].data['selling_price']).toBe('195.50');
    expect(parsed[0].data['stock_status']).toBe('IN_STOCK');
  });

  it('should throw an error on empty string or headers-only CSV', () => {
    expect(() => parseRawCsvText('')).toThrow('empty or missing data rows');
    expect(() => parseRawCsvText('medicine_slug,selling_price')).toThrow('empty or missing data rows');
  });
});

