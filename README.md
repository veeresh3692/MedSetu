# MediCompare India 💊🇮🇳
### Medicine Price Comparison & Hyperlocal Pharmacy Discovery Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%2015-emerald?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Unit%20Tested-729B1B?style=flat-square&logo=vitest)](https://vitest.dev/)
[![Compliance](https://img.shields.io/badge/DPDP%20Act%202023-Privacy%20by%20Design-purple?style=flat-square)](docs/05-security-and-compliance/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

> **Core Value Proposition**: Find the lowest trustworthy price for your exact prescribed medicine formulation at licensed retail pharmacies near you in Bengaluru — benchmarking commercial brand MRPs, verified chemist quotes, government NPPA price ceilings, and PMBJP Jan Aushadhi generic alternatives.

---

## 📖 Table of Contents
- [Executive Overview](#-executive-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Regulatory & Privacy Posture (DPDP Act 2023)](#-regulatory--privacy-posture)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started & Local Development](#-getting-started--local-development)
- [Automated Testing](#-automated-testing)
- [Quality Gates & Governance](#-quality-gates--governance)
- [Statutory Disclaimer](#-statutory-disclaimer)
- [License](#-license)

---

## 🌟 Executive Overview

In India, healthcare expenditure is predominantly out-of-pocket (65%+), with outpatient pharmaceutical spend representing the single largest recurring cost for chronic patients. 

Patients managing chronic conditions (hypertension, diabetes, cardiovascular diseases) frequently pay a **200% to 400% brand premium** for innovator medicines when identical, bioequivalent domestic generics or government Jan Aushadhi alternatives exist at a fraction of the cost. Meanwhile, centralized e-pharmacies require 24–72 hours for delivery, failing patients with acute or same-day treatment requirements.

**MediCompare India** solves this by creating a **neutral, search and discovery engine**:
1. **Clinical Exact Formulation Matching**: Normalizes active pharmaceutical ingredients, exact strengths, dosage forms, and strictly locks release profiles (Immediate Release vs. Sustained Release).
2. **Three-Tier Price Transparency**: Distinctly displays Manufacturer MRP, Verified Retail Chemist Selling Prices ($\le \text{MRP}$), and Government NPPA Reference Price Ceilings.
3. **PMBJP Jan Aushadhi Generic Discovery**: Surfaces government generic alternatives offering **50% to 85% consumer savings**.
4. **Hyperlocal Walk-in Discovery**: Calculates exact distances ($\text{km}$) using the Haversine formula and renders verified chemist premises on interactive Leaflet / OpenStreetMap views.

---

## 🚀 Key Features

### 1. Instant Multidimensional Search
- Trigram fuzzy autocomplete across brand names (e.g., *Augmentin*, *Glycomet*, *Telma*) and generic salts (*Amoxicillin*, *Metformin*, *Telmisartan*).
- Response latency target $< 20\text{ms}$ with zero registration friction.

### 2. Clinical Monograph & Release Profile Safety Lock
- Strict clinical guardrails (Governance Rule 02): Prevents dangerous substitutions by requiring exact matches on active salts, strengths, and dosage forms.
- **Safety Lock (FR-003)**: Forbids cross-matching Immediate Release (IR) with Sustained Release (SR) or Extended Release (ER) formulations.

### 3. Unit Economics Normalization
- Normalizes disparate packaging sizes (strips of 10 vs. strips of 15) to calculate true **Cost per Tablet / Capsule / ml** ($\text{₹/unit}$).
- Computes monthly chronic medication expenditure (30-day course) and savings percentages.

### 4. Interactive OpenStreetMap / Leaflet View
- Pinned locations of licensed retail pharmacies in Bengaluru (Indiranagar, Koramangala, Jayanagar, Malleshwaram).
- Live stock status indicators (`In Stock`, `Limited Stock`, `Call to Confirm`) and 1-click Google Maps directions.

### 5. Crowdsourced Price Auditing
- Unauthenticated dispute modal allowing patients to report out-of-stock stores or chemist overcharging for compliance review.

---

## 🏗️ System Architecture

MediCompare India is engineered as a **Modular Monolith** prioritizing performance, developer ergonomics, and rock-solid relational data integrity.

```mermaid
flowchart TD
    Client["Browser Client / Patient (Next.js 15 SSR + React 19)"]
    
    subgraph "Next.js App Router (Vercel)"
        Router["Route Handlers (/api/medicines/*)"]
        Matcher["Formulation Matching Engine (src/lib/matching/)"]
        Normalizer["Price Normalizer & Savings Engine"]
        Geo["Haversine Geospatial Service (src/lib/geo/)"]
        Zod["Zod Validation Layer (src/lib/validation/)"]
    end
    
    subgraph "Supabase PostgreSQL 15 (Strict RLS)"
        Medicines[("medicines & formulations")]
        GovtPrices[("government_price_references (NPPA)")]
        Pharmacies[("pharmacies (Forms 20/21)")]
        Offers[("pharmacy_offers (Verified <= MRP)")]
        History[("price_history (Immutable Trigger-Managed)")]
        Audit[("audit_logs & price_reports")]
    end
    
    Client -->|HTTP GET / Search & Compare| Router
    Router --> Zod
    Zod --> Matcher
    Matcher --> Normalizer
    Router --> Geo
    Router -->|PostgREST (Anon Client / RLS)| Medicines
    Router -->|PostgREST| GovtPrices
    Router -->|PostgREST| Offers
    Offers -.->|Trigger fn_archive_price_history| History
```

---

## 🛡️ Regulatory & Privacy Posture

### Indian Digital Personal Data Protection Act (DPDP Act, 2023)
- **Data Minimization**: MediCompare **NEVER** stores patient medical histories, clinical diagnoses, or prescription scans.
- **Anonymous Discovery**: Patients can search, compare prices, and locate pharmacies without creating an account or providing PII.
- **No Search Coordinate Persistence**: Geolocation coordinates are evaluated in-memory for Haversine distance calculations and are never logged to the database.

### Drugs and Cosmetics Act, 1940 & Pharmacy Rules
- **Non-Dispensing Boundary**: MediCompare is strictly an informational directory and search platform. We do **NOT** sell, dispense, store, or deliver prescription drugs.
- **Form 20 & 21 Compliance**: Participating pharmacies must hold valid retail drug licenses issued by State Drug Control Authorities.
- **Schedule H / H1 / X Warnings**: All prescription medicines carry prominent amber/red warnings requiring a physical prescription from a Registered Medical Practitioner (RMP) at the pharmacy counter.

### Database Security & Row Level Security (RLS)
- **100% RLS Coverage**: Row Level Security is explicitly enabled on all 13 relational tables.
- **Privilege Escalation Protected**: Dedicated PostgreSQL triggers (`trg_prevent_profile_role_escalation`, `trg_protect_pharmacy_status`) prevent client-side elevation to admin or unauthorized store self-approval.
- **Immutable Audit Trails**: Price mutation triggers run as `SECURITY DEFINER` while direct `INSERT`, `UPDATE`, and `DELETE` grants are revoked from public roles.

---

## 💻 Tech Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router)** | React Server Components, fast streaming, serverless Route Handlers |
| **Language** | **TypeScript 5.6** | Full type-safety, strict compiler invariants |
| **Database** | **Supabase (PostgreSQL 15)** | Relational integrity, trigram text search, Row Level Security |
| **Styling** | **Tailwind CSS 3.4** | Clean healthcare design tokens (`#059669` emerald), responsive grid |
| **Mapping** | **Leaflet 1.9 + OpenStreetMap** | Open-source, zero proprietary map tracking, lightweight tiles |
| **Validation** | **Zod 3.23** | Strict schema validation for all incoming queries and payloads |
| **Testing** | **Vitest 2.1** | Ultra-fast unit testing for clinical matching and price algorithms |

---

## 📁 Project Directory Structure

```text
med-compare/
├── .github/
│   └── workflows/
│       └── ci.yml                     # Continuous Integration workflow
├── docs/                              # Comprehensive Technical Documentation
│   ├── 01-project/                    # Project charter, market research & validation
│   ├── 02-requirements/               # IEEE Std 830 SRS & Requirements Traceability Matrix
│   ├── 03-architecture/               # System architecture, DB design, ERD, API specs, UI/UX
│   ├── 04-data-and-medicine/          # NPPA specs, matching engine & CSV ingestion schema
│   ├── 05-security-and-compliance/    # Threat model, DPDP privacy plan, Gate 7 audit & viva guide
│   └── README.md                      # Documentation Hub Index
├── project-management/                # Task Backlog & Changelog
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── api/
│   │   │   ├── medicines/search/      # Autocomplete Search API Route Handler
│   │   │   ├── medicines/[id]/        # Multi-tier Comparison API Route Handler
│   │   │   ├── pharmacy/upload-catalog/# Chemist CSV Batch Ingestion Route Handler
│   │   │   └── reports/price-dispute/ # Consumer Dispute Reporting Route Handler
│   │   ├── compare/[id]/              # Split-view comparison page view
│   │   ├── pharmacy/                  # Chemist partner dashboard & CSV upload portal
│   │   ├── globals.css                # Global Tailwind CSS directives
│   │   ├── layout.tsx                 # Root layout with meta tags & viewport
│   │   └── page.tsx                   # High-conversion Homepage
│   ├── components/
│   │   ├── dispute/                   # PriceReportModal component
│   │   ├── layout/                    # Navbar & Footer with statutory disclaimers
│   │   ├── medicine/                  # MedicineHeader, GovernmentPriceCard, BioequivalentAlternatives
│   │   ├── pharmacy/                  # NearbyPharmacyList & Leaflet PharmacyMap
│   │   └── search/                    # MedicineSearchBar with debounced autocomplete
│   └── lib/
│       ├── geo/                       # Haversine distance & bounding-box calculations
│       ├── matching/                  # FormulationMatcher, PriceNormalizer, BioequivalenceRanker
│       ├── server/                    # Supabase server client, Comparison & CSV services
│       └── validation/                # Zod schemas (apiSchemas.ts)
├── supabase/
│   ├── migrations/
│   │   └── 20261108000000_initial_schema.sql # 13 tables, RLS policies, security triggers
│   └── seed.sql                       # Top chronic medicines & Bengaluru pilot chemists
├── tests/
│   └── unit/
│       ├── api/                       # Zod validation schema tests
│       ├── csv/                       # CSV ingestion parser & validator tests
│       ├── geo/                       # Haversine spatial calculation tests
│       └── matching/                  # Clinical bioequivalence & release lock tests
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── .env.example
├── LICENSE
└── README.md
```

---

## 🛠️ Getting Started & Local Development

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm** or **pnpm**
- **Supabase CLI** (optional for local database container): `npm install -g supabase`

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/your-username/med-compare.git
cd med-compare
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

### 4. Database Setup & Migrations
Using Supabase CLI:
```bash
# Start local Supabase instance
supabase start

# Apply relational schema, triggers, and RLS policies
supabase db reset
```
*Note: `supabase db reset` automatically applies `supabase/migrations/` and seeds the canonical dataset from `supabase/seed.sql`.*

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing

MediCompare includes a dedicated unit and integration test suite authored in **Vitest**:
```bash
# Run all automated tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage Highlights:
- **`tests/unit/matching/formulationMatcher.test.ts`**:
  - Enforces Release Profile Safety Lock (verifies rejection of Metformin IR vs. Metformin SR).
  - Validates unit price normalization ($\text{₹/tablet}$) and percentage savings calculation (verifies 74% savings between Augmentin and Jan Aushadhi).
  - Validates alternative brand ranking order.
- **`tests/unit/csv/csvIngestion.test.ts`**:
  - Validates CSV parser header mapping, quotation sanitization, and empty file handling.
- **`tests/unit/api/apiValidation.test.ts`**:
  - Validates Zod query sanitization, minimum length constraints, and UUID validation.
- **`tests/unit/geo/haversine.test.ts`**:
  - Validates spherical distance calculation between Bengaluru micro-markets (Indiranagar $\leftrightarrow$ Koramangala).

---

## 🎯 Quality Gates & Governance

This repository adheres to the **10 Quality Gates** defined in `.agents/rules/04-development-quality-release-governance.md`:

| Gate | Title | Verified By | Deliverables |
| :---: | :--- | :---: | :--- |
| **Gate 1** | Requirements Review | Agent 01 | [`docs/02-requirements/srs.md`](docs/02-requirements/srs.md) |
| **Gate 2** | Architecture Alignment | Agent 07 | Modular Monolith Design & ADRs |
| **Gate 3** | Implementation Review | Agent 10 | Route Handlers & Domain Services |
| **Gate 4** | Lint & Type Checks | CI Workflow | Zero TypeScript compiler errors |
| **Gate 5** | Unit & Integration Tests | Agent 13 | Vitest test suite (`tests/unit/`) |
| **Gate 6** | Independent Peer Review | Agent 06 | Formulation Matching Audit |
| **Gate 7** | Security & RLS Review | Agent 12 | [`docs/05-security-and-compliance/security-review-gate-7.md`](docs/05-security-and-compliance/security-review-gate-7.md) |
| **Gate 8** | Technical Documentation | Agent 15 | Synchronized `docs/` hierarchy |
| **Gate 9** | Local Integration | Agent 18 | Route Handlers + Seed Data Flow |
| **Gate 10** | Release Sign-Off | Product Owner | Mainline merge authorization |

---

## ⚖️ Statutory Disclaimer

> **MediCompare India provides price comparison and informational discovery only. We do not prescribe, sell, or dispense medications. A valid physical prescription from a registered medical practitioner (RMP) is required to purchase Schedule H, H1, or X medicines from licensed retail pharmacies. Always consult a qualified physician before initiating or altering any treatment.**

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

*Developed with pride for accessible, transparent healthcare in India.*

