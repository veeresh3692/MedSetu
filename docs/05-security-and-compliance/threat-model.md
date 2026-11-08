# THREAT MODEL & OWASP API SECURITY ASSESSMENT
## MEDICOMPARE INDIA — SECURITY THREAT ANALYSIS
**Document ID:** `DOC-THREAT-001`  
**Task ID:** `MC-002-THREAT`  
**Author:** AGENT 12 — Security Engineer  
**Status:** `APPROVED`  
**Version:** `1.0.0`  
**Date:** 2026-11-08  
**Standards:** Microsoft STRIDE Threat Model / OWASP API Security Top 10 (2023)  

---

## 1. Executive Summary & Security Objectives

MediCompare India processes real-time retail pharmaceutical prices, statutory drug license records, and consumer search queries. Maintaining absolute integrity of pricing data and protecting the privacy of healthcare consumers are paramount.

This document establishes the formal **STRIDE Threat Model** and **OWASP API Security Top 10 (2023)** audit for the platform.

---

## 2. STRIDE Threat Analysis & Defensive Countermeasures

```
┌────────────────────────────────────────────────────────────────────────┐
│                        STRIDE THREAT MODEL MATRIX                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────┬───────┴───────────────┬────────────────────┐
    ▼                       ▼                       ▼                    ▼
SPOOFING                TAMPERING               REPUDIATION         ELEVATION
Fake chemist listings   Altering selling price  Disputing price     Self-approving store
Form 20/21 license audit Above printed MRP      audit changes       verification status
                        Trigger check_price     Trigger archive     Trigger protect_status
```

### 2.1 Spoofing (Identity Impersonation)
- **Threat Vector**: An unlicensed chemist registers a fraudulent pharmacy listing posing as an Apollo or MedPlus franchise.
- **Impact**: Patients purchasing from counterfeit or unlicensed drug retailers.
- **Mitigation**:
  1. Mandatory submission of Form 20 & 21 drug licenses and KPC registration.
  2. Public read policies on `pharmacies` and `pharmacy_offers` strictly enforce `verification_status = 'APPROVED'`.
  3. New stores start in `PENDING_VERIFICATION` state and require platform admin audit before publication.

### 2.2 Tampering (Data Modification)
- **Threat Vector 1**: A chemist attempts to list a medicine price higher than the manufacturer packaging MRP.
  - **Mitigation**: Database trigger [`trg_check_selling_price_ceiling`](file:///c:/Users/veere/Desktop/Med%20compare/supabase/migrations/20261108000000_initial_schema.sql#L275-L278) mathematically enforces `selling_price <= medicines.mrp` at the PostgreSQL engine level.
- **Threat Vector 2**: A malicious actor modifies historical price records to hide price gouging.
  - **Mitigation**: `REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON price_history FROM anon, authenticated;`. History is populated exclusively by trigger [`fn_archive_price_history()`](file:///c:/Users/veere/Desktop/Med%20compare/supabase/migrations/20261108000000_initial_schema.sql#L280-L321) running as `SECURITY DEFINER`.

### 2.3 Repudiation (Denial of Action)
- **Threat Vector**: A chemist claims they never quoted a disputed price or changed their stock status.
  - **Mitigation**: Every price mutation automatically inserts prior state, new state, observation timestamp, and source (`PRICE_UPDATE_TRIGGER`, `CSV_IMPORT`) into immutable `price_history`. Batch CSV uploads are logged in `data_import_jobs`.

### 2.4 Information Disclosure (Data Leakage)
- **Threat Vector**: Competitor chemist scrapes unapproved draft pricing or patient queries.
  - **Mitigation**:
    1. Zero patient search queries or coordinates are stored.
    2. `price_history` RLS policy requires that the referenced pharmacy has `verification_status = 'APPROVED' AND is_active = true`.
    3. `verification_records` (containing pharmacist PII) has zero public read policy.

### 2.5 Denial of Service (Resource Exhaustion)
- **Threat Vector**: Flooding autocomplete search with malformed strings or enormous radius values (e.g., `radius=9999999999`).
  - **Mitigation**:
    1. Strict Zod schemas ([`src/lib/validation/apiSchemas.ts`](file:///c:/Users/veere/Desktop/Med%20compare/src/lib/validation/apiSchemas.ts)) cap query string lengths (`max: 100`) and enforce radius bounds (`max: 50 km`).
    2. Trigram GIN indexes (`gin_trgm_ops`) accelerate fuzzy matching without full-table sequential scans.

### 2.6 Elevation of Privilege (Privilege Escalation)
- **Threat Vector 1**: Authenticated user attempts to modify their `profiles.role` to `'platform_admin'`.
  - **Mitigation**: Trigger [`trg_prevent_profile_role_escalation`](file:///c:/Users/veere/Desktop/Med%20compare/supabase/migrations/20261108000000_initial_schema.sql#L339-L342) aborts any transaction attempting to modify `role` without `service_role` or existing admin authorization.
- **Threat Vector 2**: Chemist attempts to self-approve their store status (`verification_status = 'APPROVED'`).
  - **Mitigation**: Trigger [`trg_protect_pharmacy_status`](file:///c:/Users/veere/Desktop/Med%20compare/supabase/migrations/20261108000000_initial_schema.sql#L360-L363) aborts any transaction attempting to modify verification status without admin authorization.

---

## 3. OWASP API Security Top 10 (2023) Assessment

| OWASP API Risk | Assessment in MediCompare | Status |
| :--- | :--- | :---: |
| **API1:2023 Broken Object Level Auth (BOLA)** | Tenant isolation enforced in Supabase RLS (`owner_id = auth.uid()`). Chemists cannot access other stores' inventory. | **PASS** |
| **API2:2023 Broken Authentication** | Managed via Supabase Auth (JWT tokens, secure bcrypt passwords, ephemeral sessions). | **PASS** |
| **API3:2023 Broken Object Property Level Auth** | Prevented by triggers blocking mutation of `role`, `verification_status`, and `verified_by`. | **PASS** |
| **API4:2023 Unrestricted Resource Consumption** | Zod enforces strict parameter bounds (`limit <= 20`, `radius <= 50 km`, `q <= 100 chars`). | **PASS** |
| **API5:2023 Broken Function Level Auth** | Administrative mutations require service role or `platform_admin` profile verification. | **PASS** |
| **API6:2023 Unrestricted Access to Sensitive Business Flows** | Price disputes rate-limited; mandatory Form 20/21 license checks before listing. | **PASS** |
| **API7:2023 Server-Side Request Forgery (SSRF)** | Zero external URL fetching based on user-supplied inputs. | **PASS** |
| **API8:2023 Security Misconfiguration** | Next.js client bundles strictly restricted to `NEXT_PUBLIC_SUPABASE_ANON_KEY`. | **PASS** |
| **API9:2023 Improper Inventory Management** | OpenAPI 3.1 specification maintained synchronously with Route Handlers (`DOC-API-001`). | **PASS** |
| **API10:2023 Unsafe Consumption of APIs** | All external datasets (NPPA gazettes) validated through strict ingestion schemas before DB commit. | **PASS** |

---

*Authored by Agent 12 (Security Engineer). Approved for MediCompare India Production Governance.*

