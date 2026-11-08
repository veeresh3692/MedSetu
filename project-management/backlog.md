# PROJECT BACKLOG & TASK STATUS
## MEDICOMPARE INDIA
**Document ID:** `PM-BACKLOG-001`  
**Version:** `1.0.0`  
**Date:** 2026-11-08  
**Governance:** AGENTS.md & Governance Rule 04  

---

## 1. Sprint 1 Task Status (MVP Foundation)

| Task ID | Task Description | Primary Agent | Quality Gates | Status | Target Deliverables |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **MC-001** | Bengaluru Pharmacy Market Validation | Agent 03 | 1, 8 | **DONE** | [`docs/01-project/research/bengaluru-market-validation.md`](../docs/01-project/research/bengaluru-market-validation.md) |
| **MC-002** | Regulatory & Compliance Framework | Agent 04 | 1, 7, 8 | **DONE** | Drugs and Cosmetics Act & DPDP Act compliance rules |
| **MC-003** | IEEE Std 830 Software Requirements Spec (SRS) | Agent 02 | 1, 8 | **DONE** | [`docs/02-requirements/srs.md`](../docs/02-requirements/srs.md) |
| **MC-004** | Requirements Traceability Matrix (RTM) | Agent 02 | 1, 8 | **DONE** | [`docs/02-requirements/rtm.md`](../docs/02-requirements/rtm.md) |
| **MC-005** | Modular Monolith Architecture & ADRs | Agent 07 | 2, 8 | **DONE** | Gate 2 Architecture Reviews |
| **MC-006** | PostgreSQL Schema & Supabase RLS Migration | Agent 11 | 3, 7, 8 | **DONE** | [`supabase/migrations/20261108000000_initial_schema.sql`](../supabase/migrations/20261108000000_initial_schema.sql) |
| **MC-006-SEC**| Independent Security Review & RLS Audit | Agent 12 | 7, 8 | **DONE** | [`docs/05-security-and-compliance/security-review-gate-7.md`](../docs/05-security-and-compliance/security-review-gate-7.md) |
| **MC-007** | NPPA Data Specification & Canonical Seed | Agent 05 | 1, 3, 8 | **DONE** | [`docs/04-data-and-medicine/nppa-data-specification.md`](../docs/04-data-and-medicine/nppa-data-specification.md), [`supabase/seed.sql`](../supabase/seed.sql) |
| **MC-008** | Formulation Matching & Bioequivalence Engine | Agent 06 | 3, 5, 8 | **DONE** | [`src/lib/matching/`](../src/lib/matching/), [`tests/unit/matching/`](../tests/unit/matching/) |
| **MC-009** | Next.js Autocomplete Search & Comparison APIs| Agent 10 | 3, 5, 8 | **DONE** | [`src/app/api/`](../src/app/api/), [`tests/unit/api/`](../tests/unit/api/) |
| **MC-010** | Frontend Search, Comparison & Leaflet Map UI | Agent 09 | 3, 8 | **DONE** | [`src/components/`](../src/components/), [`src/app/compare/[id]/`](../src/app/compare/[id]/) |
| **MC-011** | Pharmacy Chemist Portal: Drug License Verification | Agent 16 / Agent 09 | 3, 8 | **DONE** | [`src/app/pharmacy/`](../src/app/pharmacy/) |
| **MC-012** | CSV Inventory Catalog Bulk Ingestion Pipeline | Agent 10 / Agent 16 | 3, 5, 8 | **DONE** | [`src/lib/server/services/csvIngestionService.ts`](../src/lib/server/services/csvIngestionService.ts), [`src/app/pharmacy/upload/`](../src/app/pharmacy/upload/) |
| **DEFENSE** | B.Tech CSE Cybersecurity Viva & Defense Dossier | Agent 12 | 7, 8 | **DONE** | [`docs/05-security-and-compliance/project-defense-viva-guide.md`](../docs/05-security-and-compliance/project-defense-viva-guide.md) |

---

## 2. Upcoming Sprint Backlog (Sprint 2)

| Task ID | Task Description | Primary Agent | Priority |
| :--- | :--- | :--- | :---: |
| **MC-013** | Admin Governance Queue: License Verification & Dispute Review | Agent 07 / Agent 10 | Medium |
| **MC-014** | Historical Price Trend Line Charts (Recharts) | Agent 09 | Medium |
| **MC-015** | Playwright End-to-End (E2E) Browser Automation Suite | Agent 13 | High |

