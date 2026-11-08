# REST API SPECIFICATION & ROUTE HANDLER CONTRACTS
## MEDICOMPARE INDIA
**Document ID:** `DOC-API-001`  
**Task ID:** `MC-009`  
**Author:** AGENT 07 — System Architect & AGENT 10 — Backend Engineer  
**Reviewer:** AGENT 12 — Security Engineer  
**Status:** `APPROVED`  
**Version:** `1.0.0`  
**Date:** 2026-11-08  
**Standard:** OpenAPI 3.1 / Next.js App Router Route Handlers  

---

## 1. Architectural Principles & Security Guardrails

All MediCompare API endpoints adhere to strict security, privacy, and architectural standards:
1. **Zero Client Secret Exposure**: Next.js client bundles only use the Supabase Anon key. The server Route Handlers execute queries respecting PostgreSQL Row Level Security (RLS).
2. **Input Validation via Zod**: Every query parameter, URL slug, and request body is validated using strict, immutable Zod schemas before database execution.
3. **DPDP Act Compliance**: Consumer searches and comparisons require **no authentication** and persist **no consumer coordinates or search queries**.
4. **Standardized Response Envelope**:
   ```typescript
   interface ApiResponse<T> {
     success: boolean;
     data?: T;
     error?: {
       code: string;
       message: string;
       details?: unknown;
     };
     meta?: {
       timestamp: string;
       requestId: string;
     };
   }
   ```

---

## 2. Endpoint Contracts

### 2.1 `GET /api/medicines/search`
Multidimensional autocomplete search bar query supporting brand trade names (e.g., "Augmentin") and generic salt names (e.g., "Amoxicillin").

#### Request
- **Method**: `GET`
- **Query Parameters**:
  - `q` (string, required): Search query string (min: 2 chars, max: 100 chars).
  - `limit` (integer, optional, default: 10, max: 20): Result size limit.

#### Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "query": "augmentin",
    "totalMatches": 1,
    "results": [
      {
        "id": "m0000000-0000-0000-0000-000000000001",
        "brandName": "Augmentin 625 Duo Tablet",
        "slug": "augmentin-625-duo-tablet",
        "manufacturer": "GlaxoSmithKline Pharmaceuticals Ltd",
        "formulation": {
          "id": "f0000000-0000-0000-0000-000000000001",
          "name": "Amoxicillin and Potassium Clavulanate Tablet 625mg",
          "dosageForm": "TABLET",
          "releaseType": "IMMEDIATE_RELEASE",
          "normalizedStrength": "500mg + 125mg"
        },
        "packSize": 10.0,
        "packUnit": "tablets",
        "mrp": 223.50,
        "unitPrice": 22.35,
        "schedule": "SCHEDULE_H",
        "isGenericGeneric": false
      }
    ]
  },
  "meta": {
    "timestamp": "2026-11-08T22:15:00.000Z"
  }
}
```

---

### 2.2 `GET /api/medicines/[id]/comparison`
Retrieves comprehensive price comparison data: searched medicine details, government NPPA ceiling reference, bioequivalent generic alternatives, and verified nearby retail pharmacy offers.

#### Request
- **Method**: `GET`
- **Path Parameter**: `id` (UUID, required): Medicine ID.
- **Query Parameters**:
  - `lat` (number, optional): Consumer latitude (-90 to 90).
  - `lng` (number, optional): Consumer longitude (-180 to 180).
  - `radius` (number, optional, default: 5): Distance radius in kilometers (1 to 25).
  - `sortBy` (string, optional, enum: `'price'`, `'distance'`, default: `'price'`).

#### Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "targetMedicine": {
      "id": "m0000000-0000-0000-0000-000000000001",
      "brandName": "Augmentin 625 Duo Tablet",
      "slug": "augmentin-625-duo-tablet",
      "manufacturer": "GlaxoSmithKline Pharmaceuticals Ltd",
      "mrp": 223.50,
      "packSize": 10.0,
      "packUnit": "tablets",
      "unitPrice": 22.35,
      "schedule": "SCHEDULE_H",
      "requiresPrescription": true
    },
    "formulation": {
      "id": "f0000000-0000-0000-0000-000000000001",
      "name": "Amoxicillin and Potassium Clavulanate Tablet 625mg",
      "dosageForm": "TABLET",
      "releaseType": "IMMEDIATE_RELEASE",
      "normalizedStrength": "500mg + 125mg",
      "activeSalts": ["Amoxicillin (500mg)", "Clavulanic Acid (125mg)"]
    },
    "governmentReference": {
      "hasCeilingPrice": true,
      "ceilingPricePerUnit": 18.30,
      "applicableGstRate": 12.0,
      "statutoryMaxUnitPrice": 20.50,
      "dpcoOrderNumber": "S.O. 5249(E)",
      "notificationDate": "2022-11-11",
      "sourceReference": "NPPA Gazette Notification DPCO 2013 S.O. 5249(E)"
    },
    "bioequivalentAlternatives": [
      {
        "medicine": {
          "id": "m0000000-0000-0000-0000-000000000004",
          "brandName": "Jan Aushadhi Amoxy-Clav 625",
          "manufacturer": "PMBI",
          "mrp": 58.00,
          "packSize": 10.0,
          "packUnit": "tablets"
        },
        "category": "JAN_AUSHADHI_GENERIC",
        "categoryLabel": "Government Generic (PMBJP Jan Aushadhi)",
        "unitPrice": 5.80,
        "savingsPerUnit": 16.55,
        "savingsPercentage": 74.1,
        "requiresPrescription": true
      },
      {
        "medicine": {
          "id": "m0000000-0000-0000-0000-000000000002",
          "brandName": "Moxikind-CV 625 Tablet",
          "manufacturer": "Mankind Pharma Ltd",
          "mrp": 165.00,
          "packSize": 10.0,
          "packUnit": "tablets"
        },
        "category": "BRANDED_GENERIC",
        "categoryLabel": "Domestic Branded Generic",
        "unitPrice": 16.50,
        "savingsPerUnit": 5.85,
        "savingsPercentage": 26.2,
        "requiresPrescription": true
      }
    ],
    "nearbyPharmacyOffers": [
      {
        "offerId": "o0000000-0000-0000-0000-000000000012",
        "pharmacy": {
          "id": "p0000000-0000-0000-0000-000000000004",
          "businessName": "Sri Raghavendra Medicals",
          "address": "No. 88, Sampige Road, Malleshwaram, Bengaluru",
          "locality": "Malleshwaram",
          "phone": "+918023344400",
          "distanceKm": 1.45,
          "latitude": 13.003512,
          "longitude": 77.570145
        },
        "sellingPrice": 190.00,
        "unitPrice": 19.00,
        "savingsVsMrp": 33.50,
        "savingsPercentage": 15.0,
        "stockStatus": "IN_STOCK",
        "verificationStatus": "PHARMACY_CONFIRMED",
        "freshness": "Confirmed 3 hours ago"
      }
    ],
    "statutoryDisclaimer": "MediCompare India provides price comparison and informational discovery only. We do not prescribe, sell, or dispense medications. A valid physical prescription from a registered medical practitioner (RMP) is required to purchase Schedule H medicines from licensed retail pharmacies. Always consult a qualified physician before initiating or altering any treatment."
  }
}
```

---

### 2.3 `POST /api/reports/price-dispute`
Allows consumers to report incorrect pharmacy prices, out-of-stock discrepancies, or store refusals.

#### Request
- **Method**: `POST`
- **Body**:
  ```json
  {
    "pharmacyId": "p0000000-0000-0000-0000-000000000004",
    "medicineId": "m0000000-0000-0000-0000-000000000001",
    "reportedSellingPrice": 220.00,
    "issueType": "PRICE_HIGHER_THAN_LISTED",
    "userComment": "Chemist charged ₹220 instead of the ₹190 listed on the platform."
  }
  ```

#### Response: `201 Created`
```json
{
  "success": true,
  "data": {
    "reportId": "r0000000-0000-0000-0000-000000000001",
    "status": "PENDING_REVIEW",
    "message": "Thank you for reporting. Our compliance team will audit this pharmacy quotation."
  }
}
```

---

*Authored by Agent 07 (System Architect) & Agent 10 (Backend Engineer). Approved by Agent 12 (Security Engineer).*

