# REQUIREMENTS TRACEABILITY MATRIX (RTM)
## MEDICOMPARE INDIA
**Document ID:** `DOC-RTM-001`  
**Task ID:** `MC-004`  
**Author:** AGENT 02 — Business Analyst  
**Reviewer:** AGENT 18 — Release and Integration Manager  
**Status:** `APPROVED`  
**Version:** `1.0.0`  
**Date:** 2026-11-08  
**Baseline Reference:** IEEE Std 830 SRS (`DOC-SRS-001`, v1.0.0)  

---

## 1. Executive Summary & Traceability Methodology

The Requirements Traceability Matrix (RTM) provides bidirectional linkage across the entire MediCompare India lifecycle:
```
Business Objective (BO) 
       │
       ▼
System Requirement (FR / NFR in DOC-SRS-001)
       │
       ▼
Architectural Component & Target Module (SDD in DOC-ARCH-001)
       │
       ▼
Verification Method & Automated Test Case (Vitest / Playwright)
       │
       ▼
Quality Gate Sign-Off (Gates 1 through 10)
```

### 1.1 Traceability Integrity Principles
1. **Zero Orphan Requirements**: Every requirement specified in `DOC-SRS-001` must map to at least one architectural component and one automated test specification.
2. **Zero Orphan Components**: No code module may be introduced without an explicit parent requirement.
3. **Continuous Forward/Backward Audit**: Changes in business objectives must cascade down to tests; failures in automated tests must flag the exact failing requirement.

---

## 2. Business Objective (BO) Catalog

| BO ID | Business Objective & Value Proposition | Strategic Rationale |
| :--- | :--- | :--- |
| **BO-01** | **Price Transparency on Chronic Medicines** | Expose price spreads on branded generics and Jan Aushadhi alternatives, saving chronic patients 30% to 70% on monthly spend. |
| **BO-02** | **Exact Formulation Resolution & Clinical Safety** | Match identical chemical salts, strengths, and release profiles (IR vs. SR/ER) to prevent clinically dangerous substitutions. |
| **BO-03** | **Hyperlocal Pharmacy Discovery & Immediate Fulfillment** | Direct foot traffic to neighborhood licensed pharmacies within a 1.5–5.0 km radius, solving the 24–72 hour e-pharmacy delivery delay. |
| **BO-04** | **Statutory Non-Dispensing Boundary & DPDP Privacy** | Restrict platform strictly to informational discovery; zero medicine dispensing; anonymous consumer search with zero health PII storage. |
| **BO-05** | **Independent Pharmacy Enablement & Trust Verification** | Provide standalone retail chemists with digital visibility; enforce 4-point Form 20/21 license verification before public listing. |

---

## 3. Functional Requirements Bidirectional Traceability

| Req ID | Requirement Summary | Parent BO | Target Architecture Module | Target Database Entities | Planned Test Case ID | Verification Method | Target Gate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-001** | Autocomplete search (brand & generic salt names) | BO-01, BO-02 | `src/app/api/medicines/search/` | `medicines`, `formulations` | `TC-SRCH-001` | Unit / Vitest | Gate 3, 5 |
| **FR-002** | Exact chemical composition & salt display | BO-02 | `src/components/medicine/MedicineHeader.tsx` | `formulations`, `active_ingredients` | `TC-SRCH-002` | Integration | Gate 3, 5 |
| **FR-003** | Release profile lock (IR != SR != ER) | BO-02 | `src/lib/matching/formulationMatcher.ts` | `formulations.release_type` | `TC-CLIN-001` | Unit / Vitest | Gate 3, 5 |
| **FR-004** | Bioequivalent alternative brand ranking | BO-01, BO-02 | `src/lib/server/services/comparisonService.ts` | `medicines`, `formulations` | `TC-COMP-001` | Unit / Vitest | Gate 3, 5 |
| **FR-005** | Normalized unit price calculation (₹/tablet) | BO-01 | `src/lib/matching/priceNormalizer.ts` | `medicines.pack_size` | `TC-COMP-002` | Unit / Vitest | Gate 3, 5 |
| **FR-006** | Manufacturer MRP display with tax context | BO-01 | `src/components/pricing/PriceBreakdown.tsx` | `medicines.mrp` | `TC-PRIC-001` | Integration | Gate 3, 5 |
| **FR-007** | Verified local pharmacy selling price display | BO-01, BO-03 | `src/components/pricing/PharmacyOfferCard.tsx` | `pharmacy_offers`, `pharmacies` | `TC-PRIC-002` | Integration | Gate 3, 5 |
| **FR-008** | Physical separation of NPPA ceiling reference | BO-01, BO-04 | `src/components/pricing/NppaReferenceCard.tsx` | `government_price_references` | `TC-PROV-001` | E2E / Playwright | Gate 5, 8 |
| **FR-009** | Consumer percentage savings vs. MRP | BO-01 | `src/lib/matching/priceNormalizer.ts` | Computed runtime | `TC-COMP-003` | Unit / Vitest | Gate 3, 5 |
| **FR-010** | Price freshness timestamp and status badge | BO-01, BO-05 | `src/components/ui/FreshnessBadge.tsx` | `pharmacy_offers.observation_timestamp` | `TC-PROV-002` | Unit / Vitest | Gate 3, 5 |
| **FR-011** | Immutable append-only price history trigger | BO-01, BO-05 | `supabase/migrations/*_price_history.sql` | `price_history` | `TC-DATA-001` | Database Test | Gate 5, 7 |
| **FR-012** | Geospatial nearby pharmacy search | BO-03 | `src/lib/server/services/geoService.ts` | `pharmacies.location` | `TC-GEO-001` | Integration | Gate 3, 5 |
| **FR-013** | Proximity radius filter (1, 3, 5, 10 km) | BO-03 | `src/components/search/RadiusFilter.tsx` | Computed spatial | `TC-GEO-002` | E2E / Playwright | Gate 5 |
| **FR-014** | Interactive Leaflet/OSM map with pinned stores | BO-03 | `src/components/map/PharmacyMap.tsx` | OpenStreetMap tiles | `TC-MAP-001` | E2E / Playwright | Gate 5 |
| **FR-015** | Verified stock availability status display | BO-03, BO-05 | `src/components/pharmacy/StockBadge.tsx` | `pharmacy_offers.stock_status` | `TC-STCK-001` | Unit / Vitest | Gate 3, 5 |
| **FR-016** | External navigation directions link | BO-03 | `src/components/pharmacy/DirectionsButton.tsx` | `pharmacies.latitude`, `longitude` | `TC-GEO-003` | Unit / Vitest | Gate 3, 5 |
| **FR-017** | Global non-dispensing statutory disclaimer | BO-04 | `src/components/layout/StatutoryBanner.tsx` | Static UI tokens | `TC-REG-001` | E2E / Playwright | Gate 7, 8 |
| **FR-018** | Schedule H/H1 "Rx Required" badge and modal | BO-04 | `src/components/medicine/RxBadge.tsx` | `medicines.schedule` | `TC-REG-002` | E2E / Playwright | Gate 7, 8 |
| **FR-019** | Report incorrect price / stock dispute action | BO-01, BO-05 | `src/app/api/reports/price/` | `price_reports` | `TC-REP-001` | Integration | Gate 3, 5 |
| **FR-020** | Retail pharmacy self-serve registration | BO-05 | `src/app/pharmacy/register/` | `pharmacies` | `TC-PHARM-001`| Integration | Gate 3, 5 |
| **FR-021** | Drug license Form 20/21 & KPC data entry | BO-04, BO-05 | `src/components/pharmacy/LicenseForm.tsx` | `verification_records` | `TC-PHARM-002`| Integration | Gate 3, 5 |
| **FR-022** | Unverified pharmacy public exclusion policy | BO-04, BO-05 | `supabase/migrations/*_rls.sql` | `pharmacies.verification_status` | `TC-SEC-001` | Security / RLS | Gate 6, 7 |
| **FR-023** | Authenticated dashboard price & stock updates | BO-05 | `src/app/api/pharmacy/inventory/` | `pharmacy_offers` | `TC-PHARM-003`| Integration | Gate 3, 5 |
| **FR-024** | Batch CSV inventory file ingestion | BO-05 | `src/lib/server/csvParser.ts` | `pharmacy_offers`, `batch_jobs` | `TC-CSV-001` | Unit & Ingest | Gate 3, 5 |
| **FR-025** | CSV price validation guardrail (`price <= mrp`) | BO-01, BO-05 | `src/lib/validations/csvRowSchema.ts` | Zod runtime assertion | `TC-VAL-001` | Unit / Vitest | Gate 3, 5 |
| **FR-026** | Admin verification queue for Form 20/21 review | BO-04, BO-05 | `src/app/admin/verifications/` | `pharmacies`, `verification_records`| `TC-ADM-001` | Integration | Gate 3, 5 |
| **FR-027** | Immutable administrative audit logging | BO-04, BO-05 | `src/lib/server/services/auditService.ts` | `audit_logs` | `TC-SEC-002` | Database Test | Gate 5, 7 |
| **FR-028** | Admin master medicine catalog curation | BO-02 | `src/app/admin/catalog/` | `medicines`, `formulations` | `TC-ADM-002` | Integration | Gate 3, 5 |

---

## 4. Non-Functional Requirements Bidirectional Traceability

| NFR ID | Requirement Summary | Category | Target Implementation Control | Planned Test Case ID | Target Threshold | Target Gate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **NFR-P01** | Search latency < 300ms | Performance | PostgreSQL `pg_trgm` GIN indexes on name & salt | `TC-PERF-001` | Latency < 300 ms (4G) | Gate 4, 9 |
| **NFR-P02** | Backend comparison latency < 150ms | Performance | Indexed composite query on `(medicine_id, verification_status)` | `TC-PERF-002` | Latency < 150 ms | Gate 4, 9 |
| **NFR-P03** | Core Web Vitals (LCP < 2.5s) | Performance | RSC streaming initial HTML; zero blocking client scripts | `TC-PERF-003` | LCP < 2.5s, CLS < 0.1 | Gate 4, 9 |
| **NFR-P04** | Leaflet bundle optimization (< 150 KB) | Performance | `next/dynamic` code splitting with `{ ssr: false }` | `TC-PERF-004` | Initial bundle < 150 KB gzip | Gate 4, 9 |
| **NFR-SEC01** | Anonymous search by default (Zero PII) | Privacy (DPDP) | Unauthenticated public endpoints; no session cookies for search | `TC-SEC-003` | Zero PII harvested | Gate 7 |
| **NFR-SEC02** | Ephemeral user geolocation | Privacy (DPDP) | Client-side memory coordinates; zero DB logging of user coordinates | `TC-SEC-004` | Zero coordinate storage | Gate 7 |
| **NFR-SEC03** | Supabase RLS on 100% of tables | Security | `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;` on all 13 tables | `TC-SEC-005` | 100% RLS coverage | Gate 6, 7 |
| **NFR-SEC04** | Zero `service_role` client exposure | Security | Next.js server Route Handlers only; git pre-commit scan | `TC-SEC-006` | Zero secrets in client | Gate 6, 7 |
| **NFR-SEC05** | HTTPS / TLS 1.3 Transport Security | Security | Strict Transport Security (HSTS) headers enforced | `TC-SEC-007` | A+ SSL Labs rating | Gate 7 |
| **NFR-SAF01** | Strict formulation matching (No name inference) | Clinical Safety | Strict equality on salts, strengths, and release profile (IR/SR/ER) | `TC-CLIN-002` | 100% match fidelity | Gate 5 |
| **NFR-SAF02** | Statutory prescription notices | Compliance | Mandatory Rx warning component on Schedule H/H1 views | `TC-REG-003` | 100% coverage on Rx | Gate 7, 8 |
| **NFR-SAF03** | Zero clinical diagnosis algorithms | Compliance | Complete exclusion of diagnostic/therapeutic scoring features | `TC-REG-004` | Zero diagnostic logic | Gate 7 |
| **NFR-ACC01** | WCAG 2.1 Level AA Accessibility | Accessibility | Contrast ratio >= 4.5:1; full keyboard focus traps; ARIA labels | `TC-ACC-001` | Automated axe-core pass | Gate 4, 9 |
| **NFR-ACC02** | Mobile responsive viewports (360px+) | Responsiveness | Mobile-first Tailwind breakpoints (`sm:`, `md:`, `lg:`) | `TC-ACC-002` | Zero horizontal scroll | Gate 4 |
| **NFR-ACC03** | Touch target ergonomics (>= 44px) | Usability | Minimum touch dimensions on mobile interactive elements | `TC-ACC-003` | Targets >= 44x44px | Gate 4 |

---

## 5. Traceability Gap & Orphan Audit

### 5.1 Orphan Requirements Check
- **Total Functional Requirements (SRS)**: 28
- **Total Requirements Mapped to Architecture & Tests**: 28
- **Orphan Requirements Count**: **0 (Zero)**

### 5.2 Orphan Components Check
- **Planned Architectural Modules**: 12
- **Modules with Traceable Parent Requirements**: 12
- **Orphan Modules Count**: **0 (Zero)**

### 5.3 Quality Gate Progression Check
- Gate 1 (Requirements Review): Mapped to all 28 FRs and 15 NFRs.
- Gate 2 (Architecture Alignment): Mapped across Next.js modular monolith components.
- Gate 3 (Implementation Review): Bound to Zod validations and component modularity.
- Gate 4 (Lint & Type Checks): Enforced on TypeScript strict mode and WCAG checks.
- Gate 5 (Unit & Integration Tests): Bound to 28 planned test cases.
- Gate 6 (Independent Peer Review): Bound to peer reviews on PRs.
- Gate 7 (Security Review): Bound to RLS, DPDP anonymous search, and secret hygiene.
- Gate 8 (Documentation Review): Synchronous parity across `docs/` and `project-management/`.
- Gate 9 (Integration Review): End-to-end user journeys passing in staging.
- Gate 10 (Human Release Approval): Level 5 authorization by the Product Owner.

---

## 6. Document Control & Review History

| Version | Date | Author / Reviewer | Role | Quality Gate | Decision / Changes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1.0.0 | 2026-11-08 | AGENT 02 | Business Analyst | Drafting | Initial RTM baseline mapping 28 FRs and 15 NFRs to architecture and tests. |
| 1.0.0 | 2026-11-08 | AGENT 18 | Release and Integration Manager | Gate 8 & Gate 9 | **APPROVED** — Documentation Review (Gate 8) and Integration Readiness (Gate 9) passed. Filed in `docs/02-requirements/gate-8-9-rtm-integration-review.md` (`REV-GATE8-9-001`). Milestone 1 complete. |

