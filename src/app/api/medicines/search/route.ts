// ==============================================================================
// MEDICOMPARE INDIA — MEDICINE AUTOCOMPLETE SEARCH ROUTE HANDLER
// Route: GET /api/medicines/search
// Governance: AGENTS.md, Rule 03 (Input Validation via Zod), DOC-API-001 (MC-009)
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { searchMedicineQuerySchema } from '@/lib/validation/apiSchemas';
import { searchMedicines } from '@/lib/server/services/comparisonService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = searchParams.get('q');
    const limitParam = searchParams.get('limit') || '10';

    // 1. Zod Validation
    const validationResult = searchMedicineQuerySchema.safeParse({
      q: queryParam,
      limit: limitParam,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid search parameters',
            details: validationResult.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { q, limit } = validationResult.data;

    // 2. Execute Autocomplete Trigram Query
    const results = await searchMedicines(q, limit);

    return NextResponse.json(
      {
        success: true,
        data: {
          query: q,
          totalMatches: results.length,
          results,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API /api/medicines/search] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while processing your search request',
        },
      },
      { status: 500 }
    );
  }
}

