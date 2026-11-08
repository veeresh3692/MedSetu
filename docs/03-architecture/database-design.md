# DATABASE DESIGN SPECIFICATION
## MEDICOMPARE INDIA
**Document ID:** `DOC-DB-001`  
**Task ID:** `MC-006`  
**Author:** AGENT 11 — Database Engineer  
**Reviewer:** AGENT 12 — Security Engineer  
**Status:** `APPROVED`  
**Version:** `1.1.0`  
**Date:** 2026-11-08  
**Target Migration:** `supabase/migrations/20261108000000_initial_schema.sql`  

---

## 1. Executive Summary & Design Principles

The MediCompare India database architecture is engineered on **PostgreSQL 15+ (managed via Supabase)**. It implements strict relational integrity, immutable price history triggers, trigram search acceleration, spatial indexing, and defense-in-depth **Row Level Security (RLS)**.

### 1.1 Architectural Pillars
1. **Dataset Separation**: Government NPPA ceiling prices, Manufacturer packaging MRP, and Retail Pharmacy selling prices reside in physically separate tables (`government_price_references`, `medicines`, `pharmacy_offers`).
2. **Price Ceiling Enforcement**: The statutory and business rule `selling_price <= mrp` is enforced by a PostgreSQL `BEFORE INSERT OR UPDATE` trigger (`fn_enforce_selling_price_ceiling()`).
3. **Immutable Price Archiving**: Active inventory mutations automatically archive the prior state into `price_history` via a database trigger (`fn_archive_price_history()`), with all `UPDATE` and `DELETE` grants revoked on history tables.
4. **Tenant Isolation via RLS**: 100% of tables have Row Level Security enabled. Authenticated pharmacies can only access their own records (`auth.uid() = pharmacy.owner_id`).

---

## 2. Entity Dictionary & Table Schemas

### 2.1 Core Identity & Catalog Entities

#### `profiles`
Links directly to Supabase `auth.users(id)` to manage platform identities and role-based permissions.
- `id` (UUID, PK): References `auth.users(id)` on delete cascade.
- `email` (TEXT, UNIQUE, NOT NULL): Contact email address.
- `role` (user_role, NOT NULL): `consumer`, `pharmacy_operator`, or `platform_admin`.
- `is_active` (BOOLEAN): Soft-disable account flag.

#### `active_ingredients`
Canonical registry of Active Pharmaceutical Ingredients (APIs / generic salts).
- `id` (UUID, PK): Unique ingredient identifier.
- `inn_name` (TEXT, UNIQUE, NOT NULL): International Nonproprietary Name (e.g., "amoxicillin", "clavulanic acid", "metformin").
- `standard_unit` (TEXT): Normalized unit (e.g., "mg", "mcg", "IU").

#### `formulations`
Standardized clinical definitions representing bioequivalent pharmaceutical formulations.
- `id` (UUID, PK): Unique formulation identifier.
- `name` (TEXT, NOT NULL): Official generic monograph title.
- `dosage_form` (dosage_form, NOT NULL): `TABLET`, `CAPSULE`, `SYRUP`, `INJECTION`, etc.
- `release_type` (release_type, NOT NULL): `IMMEDIATE_RELEASE`, `SUSTAINED_RELEASE`, `EXTENDED_RELEASE`, `ENTERIC_COATED`.
- `is_combination` (BOOLEAN): Flag indicating multi-salt FDC.
- `normalized_strength` (TEXT): Normalized display string (e.g., "500mg + 125mg").

#### `formulation_ingredients`
Many-to-many bridge resolving combination formulations into their component salts and exact strengths.
- `formulation_id` (UUID, FK): References `formulations(id)`.
- `ingredient_id` (UUID, FK): References `active_ingredients(id)`.
- `strength_value` (NUMERIC(10, 3)): Normalized numeric amount.
- `strength_unit` (TEXT): Unit of measure ("mg", "mcg", "%").

#### `medicines`
Commercial branded catalog marketed by pharmaceutical manufacturers.
- `id` (UUID, PK): Unique medicine SKU identifier.
- `brand_name` (TEXT, NOT NULL): Commercial trade name (e.g., "Augmentin 625 Duo").
- `slug` (TEXT, UNIQUE, NOT NULL): SEO-friendly URL slug.
- `formulation_id` (UUID, FK): References `formulations(id)`.
- `manufacturer` (TEXT, NOT NULL): Name of marketing/manufacturing firm.
- `pack_size` (NUMERIC(8, 2)): Unit count (e.g., 10.00).
- `pack_unit` (TEXT): "tablets", "capsules", "ml".
- `mrp` (NUMERIC(10, 2)): Printed packaging Maximum Retail Price (inclusive of all taxes).
- `schedule` (drug_schedule): `SCHEDULE_H`, `SCHEDULE_H1`, `SCHEDULE_X`, `OTC`.
- `is_generic_generic` (BOOLEAN): Flag for PMBJP / Jan Aushadhi generic products.
- `is_demo` (BOOLEAN): Excluded from production consumer endpoints.

---

### 2.2 Pricing & Provenance Entities

#### `government_price_references`
Statutory ceiling prices notified by the National Pharmaceutical Pricing Authority (NPPA).
- `id` (UUID, PK): Unique reference price record.
- `formulation_id` (UUID, FK): References `formulations(id)`.
- `ceiling_price` (NUMERIC(10, 2)): Statutory ceiling per unit (excl. GST).
- `unit_specification` (TEXT): "Per 1 Tablet", "Per 100ml".
- `applicable_gst_rate` (NUMERIC(4, 2)): Statutory GST percentage (5% or 12%).
- `dpco_order_number` (TEXT): S.O. gazette number.
- `notification_date` (DATE): Date of gazette notification.

#### `pharmacy_offers`
Active inventory quotations submitted by licensed retail pharmacies.
- `id` (UUID, PK): Unique offer record.
- `pharmacy_id` (UUID, FK): References `pharmacies(id)`.
- `medicine_id` (UUID, FK): References `medicines(id)`.
- `selling_price` (NUMERIC(10, 2)): Quoted retail selling price (enforced `<= mrp`).
- `stock_status` (stock_status): `IN_STOCK`, `LIMITED_STOCK`, `OUT_OF_STOCK`, `CALL_TO_CONFIRM`.
- `observation_timestamp` (TIMESTAMPTZ): When the chemist updated/confirmed price.
- `verification_status` (offer_verification_status): `PHARMACY_CONFIRMED`, `ADMIN_AUDITED`.

#### `price_history`
Immutable append-only audit trail populated exclusively by triggers.
- `id` (UUID, PK): Unique historical observation record.
- `offer_id` (UUID): Reference to parent offer.
- `pharmacy_id`, `medicine_id`: Composite lookup keys.
- `previous_price`, `new_price`: Price delta.
- `previous_stock`, `new_stock`: Stock transition delta.
- `change_source` (TEXT): Provenance source (`PRICE_UPDATE_TRIGGER`, `CSV_IMPORT`).
- `observation_timestamp`: Source timestamp.
- `archived_at` (TIMESTAMPTZ): Server archiving timestamp.

---

### 2.3 Pharmacy & Operational Entities

#### `pharmacies`
Physical licensed retail chemist premises in Bengaluru.
- `id` (UUID, PK): Unique pharmacy store ID.
- `owner_id` (UUID, FK): References `profiles(id)`.
- `business_name`, `legal_name`, `gstin`: Business identifiers.
- `address_line`, `locality`, `city`, `state`, `pincode`: Physical address.
- `latitude`, `longitude` (NUMERIC(10, 7)): Coordinate bounding box for Karnataka (11.5°–18.5°N, 74.0°–78.5°E).
- `verification_status` (verification_status): `PENDING_VERIFICATION`, `APPROVED`, `REJECTED`, `SUSPENDED`.

#### `verification_records`
Statutory Drug License Form 20/21 audit metadata.
- `pharmacy_id` (UUID, FK, UNIQUE): One-to-one link to `pharmacies`.
- `form_20_license_number`, `form_20_expiry_date`: Retail license for non-Schedule C/C1/X drugs.
- `form_21_license_number`, `form_21_expiry_date`: Retail license for Schedule C/C1 biologicals.
- `pharmacist_name`, `pharmacist_reg_number`: Karnataka Pharmacy Council (KPC) registration.
- `verified_by` (UUID, FK): Platform administrator profile.

#### `price_reports` & `audit_logs`
Dispute resolution tracking and immutable security audit logs for compliance audits.

---

## 3. Indexing Strategy & Query Optimization

| Index Name | Table & Target Column(s) | Type | Purpose | Latency Target |
| :--- | :--- | :--- | :--- | :--- |
| `idx_medicines_brand_name_trgm` | `medicines(brand_name)` | GIN (`gin_trgm_ops`) | Autocomplete fuzzy search | **< 20 ms** |
| `idx_formulations_name_trgm` | `formulations(name)` | GIN (`gin_trgm_ops`) | Generic monograph lookup | **< 20 ms** |
| `idx_pharmacy_offers_lookup` | `pharmacy_offers(medicine_id, verification_status, is_active)` | B-Tree (Covering `INCLUDE`) | Instant price comparison table scan | **< 10 ms** |
| `idx_pharmacies_coordinates` | `pharmacies(latitude, longitude) WHERE verification_status = 'APPROVED'` | Partial B-Tree | Bounding-box spatial pre-filter for Haversine | **< 5 ms** |
| `idx_price_history_lookup` | `price_history(medicine_id, pharmacy_id, archived_at DESC)` | B-Tree Composite | Historical price chart rendering | **< 15 ms** |

---

## 4. Row Level Security (RLS) Policy Matrix

| Table Name | Anon Consumer Read | Authenticated Pharmacy Access | Admin Access |
| :--- | :--- | :--- | :--- |
| `profiles` | ❌ Disallowed | `SELECT`/`UPDATE` own row (`id = auth.uid()`, role escalation blocked by trigger) | Via Server Route Handler |
| `medicines` | ✅ Active non-discontinued items | ✅ Public read access | Via Server Route Handler |
| `formulations` | ✅ Full public read | ✅ Public read access | Via Server Route Handler |
| `government_price_references` | ✅ Full public read | ✅ Public read access | Via Server Route Handler |
| `pharmacies` | ✅ Only `verification_status = 'APPROVED'` | `SELECT`/`INSERT`/`UPDATE` owned store (`owner_id = auth.uid()`, status change blocked by trigger) | Via Server Route Handler |
| `verification_records` | ❌ Disallowed (Private PII) | `ALL` on owned store record (audit metadata blocked by trigger) | Via Server Route Handler |
| `pharmacy_offers` | ✅ Verified offers (`PHARMACY_CONFIRMED`, `ADMIN_AUDITED`) from approved stores | `ALL` on owned store inventory | Via Server Route Handler |
| `price_history` | ✅ Only verified offers from approved stores | `SELECT` owned store history (Mutation/Direct Insert Revoked) | Via Server Route Handler |
| `price_reports` | ✅ `INSERT` unauthenticated reports | ❌ Read disallowed | Via Server Route Handler |
| `audit_logs` | ❌ Disallowed | ❌ Disallowed (Tamper-proof, Mutation/Direct Insert Revoked) | Via Server Route Handler |

---

## 5. Security Anti-Tampering & Integrity Triggers

| Trigger Name | Target Table | Timing & Event | Security Function & Protection |
| :--- | :--- | :--- | :--- |
| `trg_prevent_profile_role_escalation` | `profiles` | `BEFORE UPDATE` | Forbids mutating `role` unless executed by `service_role` or existing `platform_admin`. Prevents unauthorized privilege escalation. |
| `trg_protect_pharmacy_status` | `pharmacies` | `BEFORE UPDATE` | Forbids store owners from altering `verification_status` to `'APPROVED'`. Preserves mandatory Form 20/21 compliance gate. |
| `trg_protect_verification_records` | `verification_records` | `BEFORE UPDATE` | Prevents store operators from modifying license audit metadata (`verified_by`, `verified_at`, `rejection_reason`). |
| `trg_check_selling_price_ceiling` | `pharmacy_offers` | `BEFORE INSERT OR UPDATE` | Strict statutory ceiling enforcement: `selling_price <= medicines.mrp`. Aborts transaction if violated. |
| `trg_archive_price_history` | `pharmacy_offers` | `BEFORE UPDATE OR DELETE` | Executes as `SECURITY DEFINER` to archive price and stock mutations into `price_history`. |

---

*Authored by Agent 11 (Database Engineer). Audited & Approved by Agent 12 (Security Engineer) for Gate 7 and Gate 8.*
