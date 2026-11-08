# MEDICOMPARE INDIA — PROJECT STATE

## Executive Summary
- **Project**: MediCompare India
- **Mission**: Enable Indian consumers to identify exact medicine formulations, compare trustworthy pharmacy prices, and discover licensed nearby pharmacies.
- **Current Phase**: **Phase 2 — Modular Monolith Architecture & Database Design**
- **Active Task**: `MC-005` (Modular Monolith System Architecture & ADRs) -> **APPROVED**; Next: `MC-006` (PostgreSQL Relational Schema & Supabase RLS Architecture)
- **Status**: **MC-005 APPROVED (GATES 2 & 8 PASSED) | READY FOR MC-006**
- **Product Owner**: Individual B.Tech CSE Cybersecurity Student (Sole Authority)
- **Orchestrator**: Elite AI Orchestrator coordinating 18 Specialist Sub-Agents and 33 Domain Skills.

---

## Technical & Infrastructure Baselines

| Component | Standard / Technology | Version / Status |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router, React Server Components) | Next.js 15+ / React 19 / TypeScript (Strict) |
| **Styling & UI Primitives** | Tailwind CSS v4, shadcn/ui, Lucide Icons | Configured to MediCompare palette (`#059669`) |
| **Backend & APIs** | Next.js Route Handlers (`src/app/api/`) | Modular service layer, Zod validation |
| **Database & Auth** | Supabase (PostgreSQL 15+, Supabase Auth, RLS) | Strict RLS, SQL migrations, triggers |
| **Mapping & Geospatial** | Leaflet + OpenStreetMap (OSM) | Free/Open-source, no billing dependencies |
| **Visualizations** | Recharts | Price trends, historical comparisons |
| **Testing** | Vitest (Unit/Integration) + Playwright (E2E) | Node test runner configured |
| **CI/CD & Hosting** | GitHub Actions -> Vercel (Frontend/API) + Supabase | Planned modular deployment |

---

## Milestone Roadmap

- [x] **Milestone 0: Organization Initialization (MC-000)**
  - Workspace inspection, Git setup, Orchestrator rules, 18 specialist agent registrations, 33 specialized skill definitions, 4 governance rule sets, project management artifacts.
- [x] **Milestone 1: Problem Validation, Regulatory Dossier & IEEE SRS (MC-001 to MC-004)**
  - [x] MC-001: Bengaluru Retail Pharmacy Market Research & Problem Validation (Agent 03, Approved)
  - [x] MC-002: Drugs & Cosmetics Act + DPDP Compliance Boundary Framework (Agent 04, Approved)
  - [x] MC-003: Formal IEEE Std 830 Software Requirements Specification (Agent 02, Approved)
  - [x] MC-004: Bidirectional Requirements Traceability Matrix (Agent 02, Approved by Agent 18)
- [ ] **Milestone 2: Modular Monolith Architecture & Database Design (MC-005 to MC-007)**
  - [x] MC-005: Modular Monolith System Architecture & ADRs (Agent 07, Approved by Agent 10 & Agent 11)
  - [ ] MC-006: PostgreSQL Schema & Supabase RLS Policies (Agent 11)
  - [ ] MC-007: NPPA & Medicine Catalog Provenance Specification (Agent 05)
- [ ] **Milestone 3: Core Medicine Matching & Ingestion Engine (MC-008 to MC-010)**
  - Entity resolution, active salt & release profile matching algorithm, Zod validation pipelines, CSV ingestion test harness.
- [ ] **Milestone 4: Backend API Services & Price Comparison Logic (MC-011 to MC-013)**
  - Search Route Handlers, comparison engine, spatial pharmacy discovery, mock/seed isolation.
- [ ] **Milestone 5: Patient Web Application & UI/UX (MC-014 to MC-016)**
  - Responsive patient search interface, comparison view, mobile drawer map, accessibility compliance.
- [ ] **Milestone 6: Pharmacy Portal & Admin Governance (MC-017 to MC-019)**
  - Pharmacy registration, drug license upload, CSV inventory manager, admin verification queue.
- [ ] **Milestone 7: Verification, Security Audit & Alpha Launch (MC-020 to MC-022)**
  - End-to-end Playwright tests, STRIDE security audit, performance tuning, Bengaluru pilot launch.

---

## Active Quality Gates Status
- All work strictly adheres to Gates 1 through 10.
- Current gate: **Gate 10 (Human Release Approval)** on Task `MC-000`.
