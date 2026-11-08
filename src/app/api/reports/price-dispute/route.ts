// ==============================================================================
// MEDICOMPARE INDIA — CONSUMER PRICE DISPUTE REPORTING ROUTE HANDLER
// Route: POST /api/reports/price-dispute
// Governance: AGENTS.md, Rule 03 (DPDP Anonymous Dispute Reporting), DOC-API-001
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { priceDisputeReportSchema } from '@/lib/validation/apiSchemas';
import { getSupabaseAnonClient } from '@/lib/server/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod Validation
    const validationResult = priceDisputeReportSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid report data submitted',
            details: validationResult.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { pharmacyId, medicineId, reportedSellingPrice, issueType, userComment } =
      validationResult.data;

    // 2. Insert into price_reports table (RLS allows anon INSERT)
    const supabase = getSupabaseAnonClient();

    const { data, error } = await supabase
      .from('price_reports')
      .insert({
        pharmacy_id: pharmacyId,
        medicine_id: medicineId,
        reported_selling_price: reportedSellingPrice,
        issue_type: issueType,
        user_comment: userComment,
        status: 'PENDING_REVIEW',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[API /api/reports/price-dispute] Database error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to record price report. Please try again later.',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          reportId: data.id,
          status: 'PENDING_REVIEW',
          message:
            'Thank you for reporting. Our compliance team will audit this pharmacy quotation.',
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API /api/reports/price-dispute] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while submitting your dispute report',
        },
      },
      { status: 500 }
    );
  }
}

