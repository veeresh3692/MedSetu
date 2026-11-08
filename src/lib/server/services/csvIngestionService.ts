// ==============================================================================
// MEDICOMPARE INDIA — CSV CATALOG INGESTION SERVICE
// File: src/lib/server/services/csvIngestionService.ts
// Governance: AGENTS.md, Rules 02 & 03, DOC-DATA-003 (MC-012)
// ==============================================================================

import { getSupabaseAnonClient } from '../supabase';

export interface CsvRowInput {
  medicineSlug?: string;
  brandName?: string;
  sellingPrice: number;
  stockStatus: 'IN_STOCK' | 'LIMITED_STOCK' | 'OUT_OF_STOCK' | 'CALL_TO_CONFIRM';
  batchNumber?: string;
}

export interface CsvRowError {
  rowNumber: number;
  identifier: string;
  errorCode: string;
  message: string;
}

export interface CsvImportSummary {
  jobId?: string;
  fileName: string;
  totalRows: number;
  validRows: number;
  rejectedRows: number;
  status: 'COMPLETED' | 'PARTIALLY_FAILED' | 'FAILED';
  errors: CsvRowError[];
}

/**
 * Parses raw CSV string into normalized row objects.
 */
export function parseRawCsvText(csvText: string): Array<{ rowNumber: number; data: Record<string, string> }> {
  const lines = csvText.trim().split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('CSV file is empty or missing data rows.');
  }

  // Parse header line
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
  const parsedRows: Array<{ rowNumber: number; data: Record<string, string> }> = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
    const rowObj: Record<string, string> = {};

    headers.forEach((header, index) => {
      rowObj[header] = values[index] !== undefined ? values[index] : '';
    });

    parsedRows.push({
      rowNumber: i + 1, // 1-indexed including header
      data: rowObj,
    });
  }

  return parsedRows;
}

/**
 * Processes, validates, and ingests a chemist's inventory CSV feed into Supabase.
 */
export async function processPharmacyCatalogImport(
  pharmacyId: string,
  fileName: string,
  csvText: string
): Promise<CsvImportSummary> {
  const supabase = getSupabaseAnonClient();

  const parsed = parseRawCsvText(csvText);
  const totalRows = parsed.length;
  const errors: CsvRowError[] = [];
  const validOffersToUpsert: Array<{
    pharmacy_id: string;
    medicine_id: string;
    selling_price: number;
    stock_status: string;
    observation_timestamp: string;
    verification_status: string;
    is_active: boolean;
  }> = [];

  // Fetch canonical active medicines catalog for matching
  const { data: canonicalMedicines, error: catalogError } = await supabase
    .from('medicines')
    .select('id, brand_name, slug, mrp')
    .eq('is_discontinued', false);

  if (catalogError || !canonicalMedicines) {
    throw new Error(`Failed to load canonical medicine catalog: ${catalogError?.message}`);
  }

  const slugMap = new Map<string, { id: string; brandName: string; mrp: number }>();
  const nameMap = new Map<string, { id: string; brandName: string; mrp: number }>();

  canonicalMedicines.forEach((m: any) => {
    const item = { id: m.id, brandName: m.brand_name, mrp: Number(m.mrp) };
    slugMap.set(m.slug.toLowerCase(), item);
    nameMap.set(m.brand_name.toLowerCase(), item);
  });

  const validStockStatuses = ['IN_STOCK', 'LIMITED_STOCK', 'OUT_OF_STOCK', 'CALL_TO_CONFIRM'];

  for (const item of parsed) {
    const { rowNumber, data } = item;
    const slugInput = (data['medicine_slug'] || data['slug'] || '').toLowerCase();
    const brandInput = (data['brand_name'] || data['brand'] || data['name'] || '').toLowerCase();
    const priceInput = data['selling_price'] || data['price'] || '';
    const stockInput = (data['stock_status'] || data['stock'] || 'IN_STOCK').toUpperCase();

    const identifier = slugInput || brandInput || `Row ${rowNumber}`;

    // 1. Resolve Target Canonical Medicine
    const matched = slugMap.get(slugInput) || nameMap.get(brandInput);
    if (!matched) {
      errors.push({
        rowNumber,
        identifier,
        errorCode: 'UNRECOGNIZED_MEDICINE',
        message: `Medicine "${identifier}" could not be resolved in the canonical medicine catalog.`,
      });
      continue;
    }

    // 2. Validate Selling Price
    const sellingPrice = parseFloat(priceInput);
    if (isNaN(sellingPrice) || sellingPrice <= 0) {
      errors.push({
        rowNumber,
        identifier,
        errorCode: 'INVALID_PRICE',
        message: `Selling price must be a valid positive number. Received: "${priceInput}"`,
      });
      continue;
    }

    // 3. Enforce Statutory Ceiling (selling_price <= MRP)
    if (sellingPrice > matched.mrp) {
      errors.push({
        rowNumber,
        identifier,
        errorCode: 'EXCEEDS_MRP_CEILING',
        message: `Quoted selling price (₹${sellingPrice.toFixed(2)}) exceeds manufacturer packaging MRP (₹${matched.mrp.toFixed(2)}). Legally prohibited under DPCO.`,
      });
      continue;
    }

    // 4. Validate Stock Status Enum
    if (!validStockStatuses.includes(stockInput)) {
      errors.push({
        rowNumber,
        identifier,
        errorCode: 'INVALID_STOCK_STATUS',
        message: `Stock status "${stockInput}" is invalid. Must be one of: ${validStockStatuses.join(', ')}.`,
      });
      continue;
    }

    validOffersToUpsert.push({
      pharmacy_id: pharmacyId,
      medicine_id: matched.id,
      selling_price: sellingPrice,
      stock_status: stockInput,
      observation_timestamp: new Date().toISOString(),
      verification_status: 'PHARMACY_CONFIRMED',
      is_active: true,
    });
  }

  // Batch Upsert Valid Offers into pharmacy_offers (Triggers price_history archival automatically!)
  if (validOffersToUpsert.length > 0) {
    const { error: upsertError } = await supabase
      .from('pharmacy_offers')
      .upsert(validOffersToUpsert, { onConflict: 'pharmacy_id,medicine_id' });

    if (upsertError) {
      throw new Error(`Failed to commit inventory updates: ${upsertError.message}`);
    }
  }

  const validRows = validOffersToUpsert.length;
  const rejectedRows = errors.length;

  let status: CsvImportSummary['status'] = 'COMPLETED';
  if (rejectedRows > 0 && validRows > 0) {
    status = 'PARTIALLY_FAILED';
  } else if (rejectedRows > 0 && validRows === 0) {
    status = 'FAILED';
  }

  // Record batch job log in data_import_jobs
  const { data: jobRecord } = await supabase
    .from('data_import_jobs')
    .insert({
      pharmacy_id: pharmacyId,
      file_name: fileName,
      total_rows: totalRows,
      valid_rows: validRows,
      rejected_rows: rejectedRows,
      status,
      error_summary: errors.length > 0 ? errors : null,
      completed_at: new Date().toISOString(),
    })
    .select('id')
    .maybeSingle();

  return {
    jobId: jobRecord?.id,
    fileName,
    totalRows,
    validRows,
    rejectedRows,
    status,
    errors,
  };
}

