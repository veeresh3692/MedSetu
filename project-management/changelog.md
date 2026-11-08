# CHANGELOG
All notable changes to **MediCompare India** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0-rc.1] - 2026-11-08

### Added
- **Core Architecture & Schema**:
  - PostgreSQL 15 schema across 13 relational tables with 100% Supabase Row Level Security (RLS) coverage.
  - Immutability database triggers for price history archival (`trg_archive_price_history`) and selling price ceiling enforcement (`selling_price <= mrp`).
  - Security anti-tampering triggers preventing unauthorized role elevation and pharmacy self-approval.
- **Data & Clinical Provenance**:
  - National Pharmaceutical Pricing Authority (NPPA) DPCO 2013 / NLEM 2022 ceiling pricing specification.
  - Authentic canonical Bengaluru seed dataset for top chronic therapies (Augmentin, Glycomet, Telma, Atorva, Pan 40) paired with PMBJP Jan Aushadhi generic lines.
  - Verified physical chemist locations in Indiranagar, Koramangala, Jayanagar, and Malleshwaram.
- **Formulation Matching & Safety Engine**:
  - Exact Monograph matching algorithm enforcing the **Release Profile Safety Lock** (IR vs. SR/ER).
  - Price normalization engine computing unit prices ($\text{₹/tablet}$) and consumer savings percentages.
  - Multi-tier alternative categorization (Jan Aushadhi Generics, Domestic Branded Generics, Innovator Brands).
- **Backend Route Handlers & Zod Schemas**:
  - `GET /api/medicines/search` — Autocomplete search supporting brand and generic salt names.
  - `GET /api/medicines/[id]/comparison` — Multi-tier price comparison, nearby pharmacy offers, and NPPA references.
  - `POST /api/reports/price-dispute` — Anonymous consumer dispute reporting.
- **Frontend Healthcare UI & Spatial Mapping**:
  - High-conversion Homepage with hero autocomplete search bar.
  - Full split-screen medicine comparison page (`/compare/[id]`).
  - Interactive Leaflet / OpenStreetMap component pinning verified chemist locations with live stock indicators.
  - Schedule H Rx prescription badges and persistent statutory non-dispensing disclaimers.
- **Testing & Tooling**:
  - Vitest automated unit test suites for clinical matching, Zod validation, and Haversine distance calculations.
  - GitHub Actions CI workflow for continuous type checking and test automation.

