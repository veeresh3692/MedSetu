// ==============================================================================
// MEDICOMPARE INDIA — PHARMACY CSV CATALOG UPLOAD ROUTE HANDLER
// Route: POST /api/pharmacy/upload-catalog
// Governance: AGENTS.md, Rule 02 & 03, DOC-DATA-003 (MC-012)
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { processPharmacyCatalogImport } from '@/lib/server/services/csvIngestionService';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let pharmacyId = '';
    let fileName = 'inventory.csv';
    let csvText = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      pharmacyId = (formData.get('pharmacyId') as string) || '';
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FILE_MISSING',
              message: 'No CSV file was uploaded in the request.',
            },
          },
          { status: 400 }
        );
      }

      fileName = file.name;
      csvText = await file.text();
    } else {
      // JSON payload support
      const body = await request.json();
      pharmacyId = body.pharmacyId;
      fileName = body.fileName || 'inventory.csv';
      csvText = body.csvText;
    }

    if (!pharmacyId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PHARMACY_ID_REQUIRED',
            message: 'pharmacyId parameter is required to tag inventory ownership.',
          },
        },
        { status: 400 }
      );
    }

    if (!csvText || csvText.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EMPTY_FILE',
            message: 'Uploaded CSV file contains no content.',
          },
        },
        { status: 400 }
      );
    }

    // Process Ingestion Batch
    const summary = await processPharmacyCatalogImport(pharmacyId, fileName, csvText);

    const httpStatus = summary.status === 'FAILED' ? 422 : 200;

    return NextResponse.json(
      {
        success: summary.status !== 'FAILED',
        data: summary,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: httpStatus }
    );
  } catch (error: any) {
    console.error('[API /api/pharmacy/upload-catalog] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INGESTION_ERROR',
          message: error.message || 'An error occurred during catalog processing.',
        },
      },
      { status: 500 }
    );
  }
}

