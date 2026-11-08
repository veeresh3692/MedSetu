// ==============================================================================
// MEDICOMPARE INDIA — API REQUEST & QUERY VALIDATION SCHEMAS
// File: src/lib/validation/apiSchemas.ts
// Governance: AGENTS.md, Rule 03 (Input Validation via Zod), DOC-API-001 (MC-009)
// ==============================================================================

import { z } from 'zod';

/**
 * Validates search query parameters for GET /api/medicines/search
 */
export const searchMedicineQuerySchema = z.object({
  q: z
    .string({ required_error: 'Search query parameter "q" is required' })
    .trim()
    .min(2, { message: 'Search query must be at least 2 characters long' })
    .max(100, { message: 'Search query cannot exceed 100 characters' }),
  limit: z.coerce
    .number()
    .int()
    .min(1, { message: 'Limit must be at least 1' })
    .max(20, { message: 'Limit cannot exceed 20' })
    .default(10),
});

export type SearchMedicineQuery = z.infer<typeof searchMedicineQuerySchema>;

/**
 * Validates query parameters for GET /api/medicines/[id]/comparison
 */
export const comparisonQuerySchema = z.object({
  id: z
    .string({ required_error: 'Medicine ID is required' })
    .uuid({ message: 'Medicine ID must be a valid UUID' }),
  lat: z.coerce
    .number()
    .min(-90)
    .max(90)
    .optional(),
  lng: z.coerce
    .number()
    .min(-180)
    .max(180)
    .optional(),
  radius: z.coerce
    .number()
    .positive({ message: 'Radius must be a positive number' })
    .max(50, { message: 'Radius cannot exceed 50 kilometers' })
    .default(5),
  sortBy: z
    .enum(['price', 'distance'])
    .default('price'),
});

export type ComparisonQuery = z.infer<typeof comparisonQuerySchema>;

/**
 * Validates submission payload for POST /api/reports/price-dispute
 */
export const priceDisputeReportSchema = z.object({
  pharmacyId: z
    .string({ required_error: 'pharmacyId is required' })
    .uuid({ message: 'pharmacyId must be a valid UUID' }),
  medicineId: z
    .string({ required_error: 'medicineId is required' })
    .uuid({ message: 'medicineId must be a valid UUID' }),
  reportedSellingPrice: z
    .number({ invalid_type_error: 'reportedSellingPrice must be a number' })
    .positive({ message: 'reportedSellingPrice must be greater than zero' })
    .optional(),
  issueType: z.enum(
    ['PRICE_HIGHER_THAN_LISTED', 'OUT_OF_STOCK', 'STORE_REFUSED'],
    { required_error: 'issueType is required' }
  ),
  userComment: z
    .string()
    .trim()
    .max(500, { message: 'userComment cannot exceed 500 characters' })
    .optional(),
});

export type PriceDisputeReportInput = z.infer<typeof priceDisputeReportSchema>;

