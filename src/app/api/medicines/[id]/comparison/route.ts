// ==============================================================================
// MEDICOMPARE INDIA — MEDICINE PRICE COMPARISON ROUTE HANDLER
// Route: GET /api/medicines/[id]/comparison
// Governance: AGENTS.md, Rules 01, 02 & 03, DOC-API-001 (MC-009)
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { comparisonQuerySchema } from '@/lib/validation/apiSchemas';
import { getMedicineComparison } from '@/lib/server/services/comparisonService';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);

    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const radiusParam = searchParams.get('radius') || '5';
    const sortByParam = searchParams.get('sortBy') || 'price';

    // 1. Zod Validation
    const validationResult = comparisonQuerySchema.safeParse({
      id,
      lat: latParam ?? undefined,
      lng: lngParam ?? undefined,
      radius: radiusParam,
      sortBy: sortByParam,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid comparison parameters',
            details: validationResult.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { lat, lng, radius, sortBy } = validationResult.data;

    // 2. Fetch Multi-Tier Comparison Dataset
    const comparisonData = await getMedicineComparison(id, lat, lng, radius, sortBy);

    return NextResponse.json(
      {
        success: true,
        data: comparisonData,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API /api/medicines/[id]/comparison] Error:', error);

    const isNotFound = error.message?.includes('not found');
    const statusCode = isNotFound ? 404 : 500;

    return NextResponse.json(
      {
        success: false,
        error: {
          code: isNotFound ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
          message: error.message || 'An unexpected error occurred while fetching comparison data',
        },
      },
      { status: statusCode }
    );
  }
}

