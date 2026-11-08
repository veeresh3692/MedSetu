# RETAIL PHARMACY CSV CATALOG INGESTION SPECIFICATION
## MEDICOMPARE INDIA
**Document ID:** `DOC-DATA-003`  
**Task ID:** `MC-012`  
**Author:** AGENT 10 — Backend Engineer & AGENT 16 — Pharmacy Operations  
**Reviewer:** AGENT 12 — Security Engineer  
**Status:** `APPROVED`  
**Version:** `1.0.0`  
**Date:** 2026-11-08  
**Applicability:** Chemist Inventory Batch Ingestion & Validation Pipeline  

---

## 1. Overview & Business Workflow

Local retail pharmacies in Bengaluru maintain inventory in heterogeneous local POS / billing software (e.g. Marg ERP, MedPlus POS, Busy, Tally). To facilitate effortless onboarding without custom API integrations, MediCompare supports **standardized CSV catalog batch ingestion**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                     CSV INGESTION PIPELINE LIFECYCLE                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
1. CLIENT SUBMISSION                                        2. VALIDATION GATE
   Authenticated chemist uploads                               Parse CSV structure
   CSV via /pharmacy/upload                                    Validate row schemas (Zod)
    │                                                               │
    └───────────────────────────────┬───────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
3. CANONICAL RESOLUTION                                     4. ATOMIC COMMIT & AUDIT
   Match brand_name or slug                                    Upsert pharmacy_offers
   Enforce selling_price <= mrp                                Archive price_history trigger
   Reject invalid / unknown SKUs                               Record data_import_jobs batch
```

---

## 2. Standardized CSV Format

Chemist inventory files must contain the following standard headers:

| Header Name | Type | Required | Description | Example Value |
| :--- | :--- | :---: | :--- | :--- |
| `medicine_slug` | String | Yes (or brand) | Canonical slug or brand name | `"augmentin-625-duo-tablet"` |
| `brand_name` | String | Yes (if slug missing) | Commercial trade name | `"Augmentin 625 Duo"` |
| `selling_price` | Decimal | Yes | Quoted retail selling price (₹) | `195.00` |
| `stock_status` | Enum | Yes | `IN_STOCK`, `LIMITED_STOCK`, `OUT_OF_STOCK` | `IN_STOCK` |
| `batch_number` | String | No | Chemist internal batch identifier | `"BT-2026-X4"` |

### 2.1 Sample CSV File (`sample-inventory.csv`)
```csv
medicine_slug,brand_name,selling_price,stock_status
augmentin-625-duo-tablet,Augmentin 625 Duo,190.00,IN_STOCK
moxikind-cv-625-tablet,Moxikind-CV 625,135.00,IN_STOCK
glycomet-500-tablet,Glycomet 500,18.00,IN_STOCK
telma-40-tablet,Telma 40,120.00,LIMITED_STOCK
atorva-10-tablet,Atorva 10,95.00,IN_STOCK
pan-40-tablet,Pan 40,135.00,IN_STOCK
```

---

## 3. Validation Invariants & Error Handling

Each row must satisfy strict statutory and relational criteria:
1. **Price Floor**: `selling_price > 0`.
2. **Statutory Ceiling**: `selling_price <= medicines.mrp`. If `selling_price > mrp`, the row is rejected with `EXCEEDS_MRP_CEILING` error.
3. **Stock Enumeration**: `stock_status IN ('IN_STOCK', 'LIMITED_STOCK', 'OUT_OF_STOCK', 'CALL_TO_CONFIRM')`.
4. **Tenant Isolation**: Ingestion records are strictly tagged with the authenticated pharmacy operator's `pharmacy_id`. Operators cannot ingest records for other stores.

### 3.1 Batch Summary Response Structure
```typescript
interface CsvImportResult {
  jobId: string;
  fileName: string;
  totalRows: number;
  validRows: number;
  rejectedRows: number;
  status: 'COMPLETED' | 'PARTIALLY_FAILED' | 'FAILED';
  errors: Array<{
    rowNumber: number;
    brandName?: string;
    errorCode: string;
    message: string;
  }>;
}
```

---

*Authored by Agent 10 & Agent 16. Approved by Agent 12 (Security Engineer).*

