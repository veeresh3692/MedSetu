# MEDICOMPARE INDIA — MASTER DOCUMENTATION INDEX
**Document ID:** `DOC-INDEX-001`  
**Version:** `1.0.0`  
**Date:** 2026-11-08  
**Applicability:** Core Architecture, Requirements, Compliance, and Data Specifications  

---

## 📚 Documentation Hierarchy

MediCompare India's engineering documentation is organized into five structured directories conforming to IEEE Std 830, ISO/IEC/IEEE 29148, and the Indian regulatory frameworks (DPCO 2013, DPDP Act 2023).

```
docs/
├── 01-project/                  # Vision, Roadmap & Market Intelligence
├── 02-requirements/             # IEEE 830 SRS & Requirements Traceability Matrix
├── 03-architecture/             # Database Design, ERD, API Specifications & UI/UX
├── 04-data-and-medicine/        # NPPA Ceiling Specs, Matching Algorithms & Seed Data
└── 05-security-and-compliance/  # Security Audits, RLS Reviews & DPDP Compliance
```

---

## 1. Domain 01: Project Strategy & Market Intelligence (`docs/01-project/`)

- [`project-charter.md`](file:///c:/Users/veere/Desktop/Med%20compare/docs/01-project/project-charter.md) (`DOC-PROJ-001`):
  Formal platform charter, problem statement, core value proposition, KPIs, and governance scope.
- [`research/bengaluru-market-validation.md`](file:///c:/Users/veere/Desktop/Med%20compare/docs/01-project/research/bengaluru-market-validation.md) (`DOC-RES-001`):
  Empirical market validation for Bengaluru retail pharmacies, trade margin structures (16% scheduled vs. 50%+ branded generic), consumer friction points, and competitive benchmarks against Tata 1mg, Apollo 24/7, and PharmEasy.

---

## 2. Domain 02: Requirements & Specifications (`docs/02-requirements/`)

- [`srs.md`](file:///c:/Users/veere/Desktop/Med%20compare/docs/02-requirements/srs.md) (`DOC-SRS-001`):
  Software Requirements Specification conforming to **IEEE Std 830-1998 / ISO/IEC/IEEE 29148**. Covers Functional Requirements (`FR-001` through `FR-019`), Non-Functional Requirements, and non-dispensing boundaries.
- [`rtm.md`](file:///c:/Users/veere/Desktop/Med%20compare/docs/02-requirements/rtm.md) (`DOC-RTM-001`):
  Bidirectional Requirements Traceability Matrix linking Business Objectives (`BO-01`..`BO-05`) to SRS Functional Requirements, target code modules, and automated test cases.

---

## 3. Domain 03: System Architecture (`docs/03-architecture/`)

- [`database-design.md`](file:///c:/Users/veere/Desktop/Med%20compare/docs/03-architecture/database-design.md) (`DOC-DB-001`):
  PostgreSQL 15 relational architecture, 13 core table definitions, covering indexes, and Row Level Security (RLS) matrix.
- [`erd.md`](file:///c:/Users/veere/Desktop/Med%20compare/docs/03-architecture/erd.md) (`DOC-ERD-001`):
  Entity-Relationship Diagram (Mermaid) detailing table cardinalities, foreign key constraints, and cascade deletion rules.
- [`api-specification.md`](file:///c:/Users/veere/Desktop/Med%20compare/docs/03-architecture/api-specification.md) (`DOC-API-001`):
  REST API contracts and Next.js Route Handler specifications (`/api/medicines/search`, `/api/medicines/[id]/comparison`, `/api/reports/price-dispute`).
- [`ui-ux-specification.md`](file:///c:/Users/veere/Desktop/Med%20compare/docs/03-architecture/ui-ux-specification.md) (`DOC-UI-001`):
  Healthcare UI/UX design system tokens, WCAG 2.1 AA accessibility standards, responsive grid layout, and component contracts.

---

## 4. Domain 04: Data & Medicine Provenance (`docs/04-data-and-medicine/`)

- [`nppa-data-specification.md`](file:///c:/Users/veere/Desktop/Med%20compare/docs/04-data-and-medicine/nppa-data-specification.md) (`DOC-DATA-001`):
  National Pharmaceutical Pricing Authority statutory framework, DPCO 2013 / NLEM 2022 ceiling pricing, GST rates, and price normalization equations.
- [`matching-engine-specification.md`](file:///c:/Users/veere/Desktop/Med%20compare/docs/04-data-and-medicine/matching-engine-specification.md) (`DOC-DATA-002`):
  Clinical monograph matching algorithms, Five Invariant Checks, Release Profile Safety Lock (IR vs. SR/ER), and Jan Aushadhi generic categorization.
- [`csv-ingestion-schema.md`](file:///c:/Users/veere/Desktop/Med%20compare/docs/04-data-and-medicine/csv-ingestion-schema.md) (`DOC-DATA-003`):
  Retail chemist POS catalog CSV import specification, header mapping, price ceiling validation, and error tracking schemas.

---

## 5. Domain 05: Security, Privacy & Compliance (`docs/05-security-and-compliance/`)

- [`regulatory-compliance-framework.md`](file:///c:/Users/veere/Desktop/Med%20compare/docs/05-security-and-compliance/regulatory-compliance-framework.md) (`DOC-REG-001`):
  Drugs and Cosmetics Act 1940, Drugs & Cosmetics Rules 1945, Retail Pharmacy Forms 20/21 licensing, Schedule H/H1/X rules, and statutory disclaimers.
- [`dpdp-privacy-plan.md`](file:///c:/Users/veere/Desktop/Med%20compare/docs/05-security-and-compliance/dpdp-privacy-plan.md) (`DOC-PRIV-001`):
  Digital Personal Data Protection Act 2023 compliance, Data Minimization architecture, ephemeral geolocation processing, and Data Principal rights.
- [`threat-model.md`](file:///c:/Users/veere/Desktop/Med%20compare/docs/05-security-and-compliance/threat-model.md) (`DOC-THREAT-001`):
  Microsoft STRIDE threat model and OWASP API Security Top 10 (2023) vulnerability assessment and mitigation matrix.
- [`security-review-gate-7.md`](file:///c:/Users/veere/Desktop/Med%20compare/docs/05-security-and-compliance/security-review-gate-7.md) (`SEC-AUDIT-20261108-001`):
  Independent Gate 7 Security & RLS penetration audit report. Documents vulnerability analysis, remediated privilege escalations (SEC-01, SEC-02), and anti-tampering trigger verification.
- [`project-defense-viva-guide.md`](file:///c:/Users/veere/Desktop/Med%20compare/docs/05-security-and-compliance/project-defense-viva-guide.md) (`DEFENSE-GUIDE-001`):
  B.Tech CSE Cybersecurity Capstone viva defense dossier. Details STRIDE threat modeling, RLS multi-tenant isolation, privilege escalation defense triggers, DPDP Act 2023 compliance, and top 10 examination Q&As.

---

## 6. Repository Governance

All implementation increments follow the rules in `.agents/rules/`:
1. `01-product-architecture-governance.md`
2. `02-data-medicine-governance.md`
3. `03-security-privacy-compliance-governance.md`
4. `04-development-quality-release-governance.md`

