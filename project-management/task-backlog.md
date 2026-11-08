# MEDICOMPARE INDIA — TASK BACKLOG

Statuses: `BACKLOG` | `READY` | `IN_PROGRESS` | `BLOCKED` | `REVIEW` | `REJECTED` | `APPROVED` | `MERGED`

---

## Active & Initial Sprints

### MC-000: Initialize the MediCompare Engineering Organization
- **Objective**: Establish the master orchestrator, 18 specialist agents, 33 domain skills, 4 governance rule sets, Git repository, and project management control systems.
- **Agent**: Elite AI Orchestrator
- **Required Skills**: `system-architecture`, `technical-documentation`, Antigravity customization engine.
- **Inputs**: MediCompare India Master Prompt v2.0, Antigravity workspace specs.
- **Deliverables**: `AGENTS.md`, `GEMINI.md`, `.agents/rules/*.md`, `.agents/skills/**/SKILL.md`, `project-management/*.md`, Initial Execution Report.
- **Dependencies**: None.
- **Acceptance Criteria**:
  1. Workspace and Git verified.
  2. All 18 specialist agents registered.
  3. All 33 specialized skills created in `.agents/skills/` with frontmatter.
  4. 4 governance rule sets authored.
  5. 8 project management tracking files active.
  6. Representative subagent and skill activations validated.
  7. Clear distinction of verified vs unverified capabilities.
- **Tests**: Git status check, skill discovery verification script, subagent definition validation.
- **Reviewer**: Product Owner (Level 5 sign-off required)
- **Status**: `REVIEW`
- **Human Approval Requirement**: Mandatory (Milestone Gate 0).

---

### MC-001: Bengaluru Market Research & Problem Space Validation
- **Objective**: Synthesize empirical data on retail pharmacy pricing in Bengaluru, trade margin variations, and consumer friction in medicine purchases.
- **Agent**: AGENT 03 — Market Research
- **Required Skills**: `market-intelligence`, `competitor-analysis`
- **Inputs**: Public NPPA market reports, retail trade reports, consumer healthcare surveys.
- **Deliverables**: `docs/01-project/research/bengaluru-market-validation.md`
- **Dependencies**: MC-000
- **Acceptance Criteria**: Real evidence citing documented trade margins (16% scheduled vs 20-50% non-scheduled); clear analysis of independent retail pharmacy density in Bengaluru.
- **Tests**: Source provenance check, peer review by Agent 01.
- **Reviewer**: AGENT 01 — Product Strategy
- **Status**: `APPROVED`
- **Gate Approvals**: Gate 1 (Requirements Review) - PASSED, Gate 8 (Documentation Review) - PASSED
- **Human Approval Requirement**: Standard (Level 2).

---

### MC-002: Regulatory Boundary & Legal Compliance Framework
- **Objective**: Define exact compliance boundaries under the Drugs and Cosmetics Act 1940, Pharmacy Rules 1945, and DPDP Act 2023.
- **Agent**: AGENT 04 — Regulatory and Compliance
- **Required Skills**: `india-healthcare-compliance`, `dpdp-privacy-assessment`
- **Inputs**: Statutory Acts, Drug Control Department guidelines, DPDP 2023 rules.
- **Deliverables**: `docs/05-security-and-compliance/regulatory-compliance-framework.md`
- **Dependencies**: MC-000
- **Acceptance Criteria**: Form 20/21 license verification requirements specified; Schedule H/H1/X rules codified; mandatory customer disclaimers drafted; DPDP consent and data minimization requirements formalized.
- **Tests**: Legal citation review, peer review by Agent 12 (Security).
- **Reviewer**: AGENT 12 — Security Engineer
- **Status**: `APPROVED`
- **Gate Approvals**: Gate 7 (Security Review) - PASSED, Gate 8 (Documentation Review) - PASSED
- **Human Approval Requirement**: Mandatory before production (Level 5).

---

### MC-003: Formal IEEE 830 Software Requirements Specification (SRS)
- **Objective**: Author a comprehensive, IEEE Std 830 compliant SRS detailing functional and non-functional requirements for Patient, Pharmacy, and Admin modules.
- **Agent**: AGENT 02 — Business Analyst
- **Required Skills**: `ieee-srs-engineering`, `requirements-traceability`, `data-validation`
- **Inputs**: Master Prompt, Market Validation (MC-001), Regulatory Framework (MC-002).
- **Deliverables**: `docs/02-requirements/srs.md`
- **Dependencies**: MC-001, MC-002
- **Acceptance Criteria**: All functional requirements (FR-001 through FR-050) and non-functional requirements (NFR-001 through NFR-020) uniquely numbered and verifiable.
- **Tests**: Requirements completeness review, ambiguity scan.
- **Reviewer**: AGENT 01 — Product Strategy & AGENT 07 — System Architect
- **Status**: `APPROVED`
- **Gate Approvals**: Gate 1 (Requirements Review) - PASSED, Gate 2 (Architecture Alignment) - PASSED, Gate 8 (Documentation Review) - PASSED
- **Human Approval Requirement**: Standard (Level 2).

---

### MC-004: Bidirectional Requirements Traceability Matrix (RTM)
- **Objective**: Map every business goal to SRS requirements, architectural components, test cases, and verification gates.
- **Agent**: AGENT 02 — Business Analyst
- **Required Skills**: `requirements-traceability`
- **Inputs**: SRS (MC-003).
- **Deliverables**: `docs/02-requirements/rtm.md`, `docs/02-requirements/gate-8-9-rtm-integration-review.md`
- **Dependencies**: MC-003
- **Acceptance Criteria**: 100% of functional requirements mapped to planned test cases and architectural modules. Zero orphan requirements.
- **Tests**: RTM automated consistency check, bidirectional traceability audit.
- **Reviewer**: AGENT 18 — Release and Integration Manager
- **Status**: `APPROVED`
- **Gate Approvals**: Gate 8 (Documentation Review) - PASSED, Gate 9 (Integration Readiness) - PASSED
- **Human Approval Requirement**: Standard (Level 2).

---

### MC-005: Modular Monolith System Architecture & ADRs
- **Objective**: Establish modular monolith architecture specifications, container/component diagrams in Mermaid, and foundational Architecture Decision Records (ADRs).
- **Agent**: AGENT 07 — System Architect
- **Required Skills**: `system-architecture`, `api-contract-design`
- **Inputs**: SRS (MC-003), RTM (MC-004), Tech Stack guidelines.
- **Deliverables**: `docs/03-architecture/system-architecture.md`, `docs/03-architecture/adrs/*.md`
- **Dependencies**: MC-003, MC-004
- **Acceptance Criteria**: Boundaries between Catalog, Comparison, Discovery, Pharmacy Portal, and Admin documented; ADRs created for Next.js App Router, Supabase RLS, Leaflet/OSM.
- **Tests**: Architecture boundary linting rules, peer review.
- **Reviewer**: AGENT 10 — Backend Engineer & AGENT 11 — Database Engineer
- **Status**: `APPROVED`
- **Gate Approvals**: Gate 2 (Architecture Review) - PASSED, Gate 8 (Documentation Review) - PASSED
- **Human Approval Requirement**: Mandatory (Level 2/5).

---

### MC-006: PostgreSQL Relational Schema & Supabase RLS Architecture
- **Objective**: Design normalized PostgreSQL schema (medicines, formulations, pharmacies, offers, price_history, audit_logs) with bulletproof RLS policies and indexes.
- **Agent**: AGENT 11 — Database Engineer
- **Required Skills**: `postgres-database-engineering`, `supabase-rls-engineering`
- **Inputs**: System Architecture (MC-005), Data Governance Rule 02.
- **Deliverables**: `supabase/migrations/20261107_initial_schema.sql`, `docs/03-architecture/database-design.md`, `docs/03-architecture/erd.md`
- **Dependencies**: MC-005
- **Acceptance Criteria**: 13 initial entities with foreign keys, check constraints (`selling_price <= mrp`), composite unique constraints, automated `price_history` trigger, and RLS enabled on all tables.
- **Tests**: Local Supabase migration dry-run, RLS permission test suite.
- **Reviewer**: AGENT 12 — Security Engineer
- **Status**: `READY`
- **Human Approval Requirement**: Mandatory (Level 5 for DB execution).

---

### MC-007: NPPA & Medicine Catalog Provenance Specification
- **Objective**: Detail exact ingestion schema, gazette provenance tracking, and ceiling price models for NPPA/DPCO datasets.
- **Agent**: AGENT 05 — Medicine Data Research
- **Required Skills**: `nppa-data-research`, `medicine-data-provenance`
- **Inputs**: NPPA gazette orders, NLEM 2022 dataset structure.
- **Deliverables**: `docs/04-data-and-medicine/nppa-data-specification.md`, `docs/04-data-and-medicine/data-provenance-guide.md`
- **Dependencies**: MC-006
- **Acceptance Criteria**: Clear separation of NPPA ceiling price from retail selling prices; metadata fields defined for all price records; synthetic demo data markers specified.
- **Tests**: Data provenance schema validation.
- **Reviewer**: AGENT 06 — Data Quality & Matching
- **Status**: `BACKLOG`
- **Human Approval Requirement**: Standard (Level 2).

---

### MC-008: Medicine Entity Resolution & Formulation Matching Engine
- **Objective**: Author core matching algorithms for active salt parsing, strength unit normalization, dosage form compatibility, and release profile checks.
- **Agent**: AGENT 06 — Data Quality and Matching
- **Required Skills**: `medicine-entity-resolution`, `formulation-matching`, `data-validation`
- **Inputs**: Medicine Catalog Specification (MC-007).
- **Deliverables**: `src/lib/matching/formulationMatcher.ts`, `src/lib/matching/entityResolver.ts`
- **Dependencies**: MC-007
- **Acceptance Criteria**: Exact salt composition check; strict release characteristic matching (IR vs SR/ER non-equivalence enforced); unit price normalization (price per unit tablet/ml).
- **Tests**: Vitest unit test suite covering 50+ real-world Indian brand and generic formulation pairings.
- **Reviewer**: AGENT 13 — QA Automation Engineer
- **Status**: `BACKLOG`
- **Human Approval Requirement**: Standard (Level 2).

---

### MC-009: Runtime Zod Validation & API Contract Specifications
- **Objective**: Create runtime Zod schemas for all search queries, pharmacy inventory records, CSV rows, and Route Handler contracts.
- **Agent**: AGENT 10 — Backend Engineer
- **Required Skills**: `api-contract-design`, `data-validation`
- **Inputs**: SRS (MC-003), Schema (MC-006).
- **Deliverables**: `src/lib/validations/*.ts`, `docs/03-architecture/api-specification.md`
- **Dependencies**: MC-006
- **Acceptance Criteria**: Strict Zod schemas for search query parameters, pharmacy registration, CSV batch import, and price observation submissions.
- **Tests**: Zod validation unit tests with positive and negative test vectors.
- **Reviewer**: AGENT 07 — System Architect
- **Status**: `BACKLOG`
- **Human Approval Requirement**: Standard (Level 2).

---

### MC-010: Next.js Foundation & UI Design System Setup
- **Objective**: Scaffold Next.js App Router application with Tailwind CSS, shadcn/ui components, Lucide icons, and MediCompare healthcare palette.
- **Agent**: AGENT 09 — Frontend Engineer
- **Required Skills**: `nextjs-engineering`, `react-architecture`, `healthcare-ui-ux`
- **Inputs**: UI/UX Specification, Design tokens (`#059669`).
- **Deliverables**: `src/app/layout.tsx`, `src/app/globals.css`, `src/components/ui/*`, `tailwind.config.ts`
- **Dependencies**: MC-005
- **Acceptance Criteria**: Clean `next build`, mobile-first responsive viewport, theme tokens configured, zero linting errors.
- **Tests**: TypeScript typecheck (`tsc --noEmit`), ESLint, Lighthouse baseline.
- **Reviewer**: AGENT 08 — UI/UX Designer & AGENT 17 — Performance & Accessibility
- **Status**: `BACKLOG`
- **Human Approval Requirement**: Standard (Level 2).
