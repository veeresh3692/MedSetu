# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## MEDICOMPARE INDIA
**Standard:** IEEE Std 830-1998 / ISO/IEC/IEEE 29148:2018  
**Document ID:** `DOC-SRS-001`  
**Task ID:** `MC-003`  
**Author:** AGENT 02 — Business Analyst  
**Reviewers:** AGENT 01 — Product Strategy & AGENT 07 — System Architect  
**Status:** `APPROVED`  
**Version:** `1.0.0`  
**Date:** 2026-11-08  

---

## 1. INTRODUCTION

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the complete, authoritative software requirements for **MediCompare India** (Version 1.0.0). It defines the functional, non-functional, external interface, and regulatory requirements for the web-based medicine price comparison and nearby pharmacy discovery platform.

### 1.2 Scope
MediCompare India is a specialized healthcare information platform serving consumers, licensed retail pharmacies, and administrators in Bengaluru, Karnataka (with planned Pan-India expansion).
- **In-Scope**:
  1. Multidimensional search across brand names, generic chemical salts, and dosage strengths.
  2. Exact medicine formulation matching (salt, strength, dosage form, and release profile: IR vs. SR/ER).
  3. Price comparison across verified local retail pharmacies, manufacturer MRP, Government NPPA reference prices, and Jan Aushadhi generic baselines.
  4. Nearby licensed pharmacy discovery using interactive, open-source geospatial maps (Leaflet + OpenStreetMap) with walking/driving distance calculations.
  5. Pharmacy portal for drug license onboarding (Forms 20 & 21), CSV inventory catalog ingestion, stock status updates, and price confirmations.
  6. Administrative governance queue for pharmacy license verification, catalog curation, incorrect price complaint reviews, and immutable audit logging.
- **Out-of-Scope (Strict Non-Dispensing Boundary)**:
  1. No online sale, ordering, compounding, or courier delivery of prescription medicines.
  2. No storage or processing of patient medical histories, clinical diagnoses, or prescription scans.
  3. No clinical treatment recommendations or medical diagnosis.

### 1.3 Definitions, Acronyms, and Abbreviations
- **API**: Active Pharmaceutical Ingredient (the therapeutic chemical substance).
- **DPCO**: Drugs (Prices Control) Order, 2013.
- **DPDP Act**: Digital Personal Data Protection Act, 2023.
- **Form 20 / 21**: Retail drug licenses issued under the Drugs and Cosmetics Rules, 1945.
- **FDC**: Fixed-Dose Combination (two or more active drugs in a single formulation).
- **IR / SR / ER / MR**: Immediate Release / Sustained Release / Extended Release / Modified Release.
- **MRP**: Maximum Retail Price inclusive of all taxes.
- **NLEM**: National List of Essential Medicines (notified by the Ministry of Health and Family Welfare).
- **NPPA**: National Pharmaceutical Pricing Authority.
- **PMBJP**: Pradhan Mantri Bhartiya Janaushadhi Pariyojana.
- **PTR**: Price to Retailer.
- **RLS**: Row Level Security (PostgreSQL / Supabase).
- **RMP**: Registered Medical Practitioner (licensed physician).

### 1.4 References
1. IEEE Std 830-1998: *Recommended Practice for Software Requirements Specifications*.
2. Drugs and Cosmetics Act, 1940 & Drugs and Cosmetics Rules, 1945.
3. Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023).
4. MediCompare India Market Validation Dossier (`DOC-RES-001`).
5. MediCompare India Regulatory & Compliance Framework (`DOC-REG-001`).
6. MediCompare India Master Orchestrator Rules (`AGENTS.md`) & Governance Rules (`.agents/rules/`).

---

## 2. OVERALL DESCRIPTION

### 2.1 Product Perspective
MediCompare India is architected as a **Modular Monolith** using Next.js (App Router, Server Components, Route Handlers), React, TypeScript, Tailwind CSS, shadcn/ui, Supabase (PostgreSQL with RLS), and Leaflet/OSM.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      MEDICOMPARE SYSTEM BOUNDARY                       │
├────────────────────────────────────────────────────────────────────────┤
│  PATIENT / PUBLIC CONSUMER         LICENSED PHARMACY OPERATOR          │
│  (Anonymous Search, Web Browser)   (Authenticated Web Dashboard)       │
│                │                                 │                     │
│                ▼                                 ▼                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     NEXT.JS APP ROUTER CORE                      │  │
│  │ ┌──────────────────────┐ ┌──────────────────┐ ┌────────────────┐ │  │
│  │ │ Search & Formulation │ │ Price Comparison │ │ Geolocation &  │ │  │
│  │ │ Resolution Engine    │ │ Engine           │ │ Nearby Discovery│ │  │
│  │ └──────────────────────┘ └──────────────────┘ └────────────────┘ │  │
│  │ ┌──────────────────────┐ ┌──────────────────┐ ┌────────────────┐ │  │
│  │ │ Pharmacy Onboarding  │ │ CSV Ingestion    │ │ Admin Audit &  │ │  │
│  │ │ & Verification Portal│ │ Pipeline         │ │ Governance     │ │  │
│  │ └──────────────────────┘ └──────────────────┘ └────────────────┘ │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│                                     ▼                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              SUPABASE POSTGRESQL (Strict RLS Enabled)            │  │
│  │  • medicines                  • pharmacies                       │  │
│  │  • formulations               • pharmacy_offers (verified only)  │  │
│  │  • government_price_references• price_history (immutable audit)  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.2 User Classes and Characteristics
1. **Patient / Consumer (Public User)**:
   - Primary goal: Look up exact prescribed medicines, compare local retail pharmacy prices, locate nearby pharmacies with verified stock, and discover Jan Aushadhi generic alternatives.
   - Access: Anonymous by default (zero registration barrier).
2. **Licensed Pharmacy Operator (Authenticated Business User)**:
   - Primary goal: Maintain verified digital presence, upload Form 20/21 drug licenses, upload stock/price feeds via CSV or web dashboard, confirm stock freshness.
   - Access: Authenticated via Supabase Auth; access isolated via RLS.
3. **Platform Administrator (Superuser)**:
   - Primary goal: Validate pharmacy drug license numbers against State Drug Control registers, curate medicine master formulations, audit price disputes, monitor system health.

### 2.3 Operating Environment & Constraints
- **Client**: Modern web browsers (Chrome, Firefox, Safari, Edge, Android Chrome, iOS Safari) with responsive viewports down to 360px.
- **Server**: Next.js Node.js runtime hosted on Vercel; serverless Route Handlers.
- **Database**: Supabase PostgreSQL 15+ managed instance.
- **Mapping**: Leaflet JS 1.9+ with OpenStreetMap tile servers.

---

## 3. SPECIFIC FUNCTIONAL REQUIREMENTS

### 3.1 Module 1: Patient Medicine Discovery & Exact Formulation Resolution

| Req ID | Requirement Statement | Inputs | Processing | Outputs | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-001** | The system shall provide an unauthenticated autocomplete search bar accepting brand trade names (e.g., "Augmentin 625 Duo") or active chemical salt names (e.g., "Amoxicillin Clavulanic Acid"). | Search string (`min 2 chars`) | Case-insensitive tokenization and trigram matching against `medicines` and `formulations`. | List of up to 10 matching candidate medicines grouped by Brand and Generic Salt. | Unit & E2E Test |
| **FR-002** | The system shall display the exact chemical composition, active salt names, individual ingredient strengths, dosage form, and manufacturer for every searched medicine. | Selected medicine ID | Query canonical `formulations` record joined with active ingredient salts. | Formatted medicine header displaying active salt, strength, form, and innovator/manufacturer. | Integration Test |
| **FR-003** | The system shall strictly distinguish between Immediate Release (IR), Sustained Release (SR), Extended Release (ER), and Enteric Coated (EC) formulations, preventing incompatible substitutions. | Target formulation ID | Release characteristic equivalence check (`target.release_type == candidate.release_type`). | Enforced formulation lock; non-equivalent release profiles displayed with explicit clinical incompatibility badge. | Unit Test |
| **FR-004** | The system shall present exact bioequivalent alternatives (branded generics and Jan Aushadhi generic equivalents) sharing identical salts, strengths, and release profiles. | Formulation ID | Formulation matching algorithm query returning candidate medicines with matching active salts. | Ranked list of identical-formulation alternative brands sorted by price savings. | Unit Test |
| **FR-005** | The system shall calculate and display normalized unit prices (e.g., price per tablet, price per 10ml, price per vial) alongside pack prices. | Pack size, total pack price | Divide total price by pack count (`unit_price = pack_price / pack_units`). | Formatted display: `₹120 / strip of 10 (₹12.00 / tablet)`. | Unit Test |

### 3.2 Module 2: Price Comparison & Data Provenance Engine

| Req ID | Requirement Statement | Inputs | Processing | Outputs | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-006** | The system shall display the Manufacturer Maximum Retail Price (MRP) clearly labeled as statutory packaging price. | Medicine ID | Fetch `mrp` from `medicines` table. | Display: `MRP: ₹XXX.XX (Inclusive of all taxes)`. | Integration Test |
| **FR-007** | The system shall display verified local pharmacy selling prices alongside store distance, address, and verification status. | Medicine ID, user coordinates | Spatial join between `pharmacy_offers` and `pharmacies` filtered by `verification_status = 'PHARMACY_CONFIRMED'`. | Table/Cards of pharmacy offers sorted by price or distance. | Integration Test |
| **FR-008** | The system shall physically separate and display Government NPPA Ceiling Prices from local retail selling prices. | Formulation ID | Query `government_price_references` table for DPCO 2013 / NLEM 2022 ceiling order. | Separate reference card: `Govt. Reference Price (NPPA): ₹XX.XX / unit (DPCO S.O. #XXXX)`. | E2E Test |
| **FR-009** | The system shall compute percentage consumer savings relative to MRP for every pharmacy offer and generic alternative. | MRP, offered selling price | Calculate `savings = ((mrp - selling_price) / mrp) * 100`. | Display: `Save ₹XX.XX (YY% off MRP)`. | Unit Test |
| **FR-010** | The system shall display price freshness timestamp (e.g., "Price confirmed 4 hours ago") for every pharmacy quotation. | `observation_timestamp` | Format relative time difference between current timestamp and `observation_timestamp`. | Human-readable freshness label with relative badge (Green < 24h, Amber < 7d, Red > 7d). | Unit Test |
| **FR-011** | The system shall maintain an immutable, append-only price history archive that survives the modification or unlisting of an active offer. | Price update event | Database trigger writes previous record to `price_history` before update. | Historical price trend dataset available for charting. | Database Test |

### 3.3 Module 3: Geospatial Pharmacy Discovery & Stock Availability

| Req ID | Requirement Statement | Inputs | Processing | Outputs | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-012** | The system shall discover pharmacies near the consumer using browser geolocation or user-selected locality/PIN code in Bengaluru. | Client lat/lng or locality string | Haversine distance calculation in SQL query (`ST_Distance` or mathematical spherical formula). | List of pharmacies sorted by ascending physical distance (km). | Integration Test |
| **FR-013** | The system shall provide a proximity radius filter (1 km, 3 km, 5 km, 10 km, All Bengaluru). | Selected radius filter | Filter SQL query: `WHERE distance <= selected_radius`. | Updated pharmacy list and map bounds matching radius. | E2E Test |
| **FR-014** | The system shall render an interactive Leaflet/OpenStreetMap view displaying pinned verified pharmacies with custom colored markers indicating price competitiveness. | Pharmacy coordinates, offer price | Render Leaflet map with custom marker clusters; popup showing store name, price, stock, and directions button. | Interactive map view on desktop and mobile drawer. | E2E Test |
| **FR-015** | The system shall display verified stock availability status (`IN_STOCK`, `LIMITED_STOCK`, `OUT_OF_STOCK`, `CALL_TO_CONFIRM`). | `inventory_status` | Query active inventory record for `pharmacy_id` and `medicine_id`. | Badge indicating stock state with last stock confirmation time. | Unit Test |
| **FR-016** | The system shall provide a one-click "Get Directions" link opening Google Maps / Apple Maps / OSM with store coordinates. | Pharmacy lat/lng | Format universal map navigation URL (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`). | External navigation redirect in new tab. | Unit Test |

### 3.4 Module 4: Regulatory Disclaimers & Price Reporting

| Req ID | Requirement Statement | Inputs | Processing | Outputs | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-017** | The system shall render a persistent statutory disclaimer on all pages stating MediCompare is an informational platform and does not dispense or deliver medicines. | Page mount | Render global disclaimer banner in header and footer. | Visible statutory disclaimer text conforming to `DOC-REG-001`. | Accessibility / E2E |
| **FR-018** | The system shall display an unambiguous "Rx Required" badge and modal on all Schedule H and Schedule H1 prescription medications. | Medicine schedule classification | Conditional check on `medicine.schedule IN ('SCHEDULE_H', 'SCHEDULE_H1', 'SCHEDULE_X')`. | Prominent amber/red warning banner: *"Physical Doctor's Prescription Required at Pharmacy Counter"*. | E2E Test |
| **FR-019** | The system shall provide an unauthenticated "Report Incorrect Price / Out of Stock" button on every pharmacy card. | Pharmacy ID, Medicine ID, User comment, reported issue type | Write submission to `price_reports` table with status `PENDING_REVIEW`. | Success confirmation: *"Thank you. Our compliance team will audit this pharmacy quotation."* | Integration Test |

### 3.5 Module 5: Pharmacy Registration & Drug License Verification

| Req ID | Requirement Statement | Inputs | Processing | Outputs | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-020** | The system shall allow retail pharmacies to register with business name, licensed premises address, contact number, and geocoded location. | Pharmacy profile form data | Validate fields via Zod; insert into `pharmacies` with `verification_status = 'PENDING_VERIFICATION'`. | Registered pharmacy record in pending state (zero public listing). | Integration Test |
| **FR-021** | The system shall require the pharmacy to input Drug License Form 20, Form 21 numbers, license expiry dates, and Registered Pharmacist KPC registration number. | License metadata, document upload | Format validation on license numbers; store in `verification_records`. | Verification record linked to pharmacy awaiting admin review. | Integration Test |
| **FR-022** | The system shall restrict unverified pharmacies from displaying any prices or inventory offers to the public until approved by an administrator. | Public search query | Enforce SQL WHERE clause: `pharmacy.verification_status = 'ACTIVE'`. | Unverified pharmacy offers are completely excluded from public endpoints. | Security / RLS Test |

### 3.6 Module 6: Pharmacy Catalog, Pricing & CSV Inventory Ingestion

| Req ID | Requirement Statement | Inputs | Processing | Outputs | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-023** | The system shall allow authenticated pharmacy operators to update selling prices and stock status for catalog medicines via web dashboard. | Medicine ID, Selling Price, Stock Status | Validate `selling_price > 0` and `selling_price <= mrp`; upsert to `pharmacy_offers`. | Updated live offer with fresh `observation_timestamp`. | Integration Test |
| **FR-024** | The system shall support batch CSV inventory ingestion (columns: `brand_name`, `salt_name`, `strength`, `pack_size`, `mrp`, `selling_price`, `stock_status`). | CSV file upload | Parse CSV stream, validate every row via Zod, match against master catalog, report per-row success/failure. | Batch ingestion summary: `X rows ingested, Y rows rejected with errors`. | Unit & Integration Test |
| **FR-025** | The system shall reject any CSV record where `selling_price > mrp` or where the price is negative or zero. | CSV row pricing fields | Zod validation rule: `selling_price <= mrp && selling_price > 0`. | Error logged for row: *"Selling price cannot exceed manufacturer MRP"*. | Unit Test |

### 3.7 Module 7: Administrative Review, Catalog Moderation & Audit Logging

| Req ID | Requirement Statement | Inputs | Processing | Outputs | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-026** | The system shall provide an administrative queue displaying pending pharmacy applications with submitted Drug License Form 20/21 details. | Admin session | Query `pharmacies` WHERE `verification_status = 'PENDING_VERIFICATION'`. | Review table with action buttons (Approve, Reject, Request Clarification). | Integration Test |
| **FR-027** | The system shall log every administrative approval, rejection, and price modification in an immutable `audit_logs` table. | Admin ID, action type, target ID, metadata | Insert record to `audit_logs` capturing timestamp, admin identity, action, and diff payload. | Immutable audit trail record. | Database Test |
| **FR-028** | The system shall provide an admin catalog management interface to add, edit, or merge canonical medicines and formulation mappings. | Formulation details | Validate active salts, strength units, release types; upsert master catalog. | Updated canonical medicine database. | Integration Test |

---

## 4. NON-FUNCTIONAL REQUIREMENTS

### 4.1 Performance Requirements (NFR-P)
- **NFR-P01 (Search Latency)**: Autocomplete search queries shall return results within **< 300 ms** for a catalog of 20,000 formulations under average 4G network conditions.
- **NFR-P02 (Comparison Query Latency)**: Price comparison and nearby pharmacy spatial queries shall execute on the backend within **< 150 ms**.
- **NFR-P03 (Core Web Vitals)**:
  - Largest Contentful Paint (LCP) shall be **< 2.5 seconds**.
  - First Input Delay (FID) / INP shall be **< 100 milliseconds**.
  - Cumulative Layout Shift (CLS) shall be **< 0.1**.
- **NFR-P04 (Bundle Optimization)**: Heavy mapping libraries (Leaflet) shall be loaded dynamically via code-splitting (`next/dynamic` with SSR disabled) ensuring client initial bundle weight **< 150 KB gzip**.

### 4.2 Security, Privacy & DPDP Requirements (NFR-SEC)
- **NFR-SEC01 (Anonymous Search by Default)**: The system shall not require user account registration, authentication, or collection of personal identifiers (name, phone, email) to search medicines or compare prices.
- **NFR-SEC02 (Ephemeral Geolocation)**: User geographical coordinates shall be processed strictly client-side and ephemeral in memory. Coordinates shall **NEVER** be stored in persistent database logs or linked to a user profile.
- **NFR-SEC03 (Supabase Row Level Security)**: RLS shall be enabled on **100% of database tables**. Public read access is strictly limited to verified catalog and offer data. Mutations strictly require authenticated pharmacy owner or admin claims.
- **NFR-SEC04 (Zero Secret Exposure)**: Supabase `service_role` credentials shall strictly execute within server-side Route Handlers. Client bundles shall receive only public anon keys.
- **NFR-SEC05 (Transport Security)**: 100% of web and API communications shall be enforced over HTTPS with TLS 1.3 encryption and HSTS headers.

### 4.3 Healthcare Safety & Clinical Integrity Requirements (NFR-SAF)
- **NFR-SAF01 (Formulation Match Fidelity)**: The system shall require exact matching on active pharmaceutical ingredients, component strengths, and release profiles (IR vs. SR/ER). Zero approximate name matching for substitutions.
- **NFR-SAF02 (Statutory Disclaimers)**: 100% of public views displaying prescription medications shall render statutory notices indicating that physical purchase requires a valid RMP prescription.
- **NFR-SAF03 (No Clinical Advice)**: The system shall contain zero algorithms or features providing diagnostic suggestions, therapeutic efficacy claims, or disease treatment recommendations.

### 4.4 Usability & Accessibility Requirements (NFR-ACC)
- **NFR-ACC01 (WCAG 2.1 AA Compliance)**: All user interface components shall meet WCAG 2.1 Level AA standards, including a minimum color contrast ratio of **4.5:1** for standard text.
- **NFR-ACC02 (Mobile Responsiveness)**: The interface shall render without horizontal scrolling, clipped content, or broken layouts across viewports from **360px to 1920px**.
- **NFR-ACC03 (Touch Ergonomics)**: All interactive touch targets (search items, filter chips, buttons) shall have a minimum clickable area of **44px × 44px**.

---

## 5. EXTERNAL INTERFACE REQUIREMENTS

### 5.1 User Interfaces
- **Patient Web View**: Minimalist, high-contrast search interface, responsive cards for pharmacy offers, toggleable split-screen map view, clear price breakdown badges.
- **Pharmacy Dashboard**: Secure authenticated layout featuring inventory overview, price edit modal, drag-and-drop CSV upload zone, and license verification status badge.
- **Admin Console**: License verification review queue, audit log viewer, and medicine catalog editor.

### 5.2 Software & Database Interfaces
- **PostgreSQL / Supabase**: Connection via Supabase JS client and server Route Handlers using PostgREST and connection pooler.
- **OpenStreetMap / Leaflet**: OpenStreetMap standard tile servers (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) rendered via Leaflet 1.9+.

### 5.3 Communication Protocols
- RESTful HTTP API over HTTPS/TLS 1.3. Payloads formatted in JSON with standardized response envelopes (`{ success: true, data: ... }`).

---

### 6. DOCUMENT CONTROL & REVIEW HISTORY

| Version | Date | Author / Reviewer | Role | Decision / Changes |
| :--- | :--- | :--- | :--- | :--- |
| 1.0.0 | 2026-11-08 | AGENT 02 | Business Analyst | Initial IEEE Std 830 compliant SRS draft for MC-003. |
| 1.0.0 | 2026-11-08 | AGENT 07 | System Architect | **APPROVED** — Quality Gate 2 (Architecture Alignment). Formal review filed in `docs/03-architecture/gate-2-architecture-review.md` (`REV-GATE2-001`). |
| 1.0.0 | 2026-11-08 | AGENT 01 | Product Strategy | **APPROVED** — Quality Gate 1 (Requirements Review). Formal review filed in `docs/01-project/gate-01-requirements-review.md` (`REV-GATE1-001`). |

