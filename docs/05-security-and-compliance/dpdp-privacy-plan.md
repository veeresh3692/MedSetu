# DIGITAL PERSONAL DATA PROTECTION (DPDP ACT, 2023) COMPLIANCE PLAN
## MEDICOMPARE INDIA — DATA PRIVACY IMPACT ASSESSMENT (DPIA) & ARCHITECTURE
**Document ID:** `DOC-PRIV-001`  
**Task ID:** `MC-002-DPDP`  
**Author:** AGENT 04 — Regulatory & Compliance & AGENT 12 — Security Engineer  
**Status:** `APPROVED`  
**Version:** `1.0.0`  
**Date:** 2026-11-08  
**Statutory Reference:** The Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)  

---

## 1. Statutory Context & Principles of Privacy by Design

The **Digital Personal Data Protection Act, 2023 (DPDP Act)** regulates the processing of digital personal data in India. For health-related digital platforms, public trust hinges on strict adherence to **Section 4 (Grounds for Processing)** and **Section 6 (Consent and Notice)**.

MediCompare India adopts a radical **"Privacy by Design"** posture:
> **Core Architectural Posture**: The most effective way to protect sensitive health data is to **never collect or store it in the first place**.

---

## 2. Data Classification Matrix

| Data Entity | Classification | Ingestion / Processing Method | Retention & Storage Policy | DPDP Risk Level |
| :--- | :--- | :--- | :--- | :---: |
| **Patient Health Records / Prescriptions** | **Sensitive Health Data** | **STRICTLY PROHIBITED** (Zero collection) | Never stored or transmitted | **ZERO RISK** |
| **Consumer Search Queries** | Personal Behavioral Data | Processed in-memory for autocomplete API | Never persisted to database | **ZERO RISK** |
| **Consumer Geolocation (Lat/Lng)** | Telemetry / Location Data | Processed in-memory for Haversine distance | Ephemeral; never stored | **ZERO RISK** |
| **Consumer Price Dispute Comments** | Pseudonymous Feedback | Stored in `price_reports` table | Stored without consumer user ID or phone | **LOW** |
| **Chemist Operator Profile (Email/Phone)** | Business Identity Data | Supabase Auth (`profiles` table) | Retained during active partnership | **LOW** |
| **Pharmacist Form 20/21 Drug Licenses** | Statutory Regulatory Data | Stored in `verification_records` table | Retained for statutory audit compliance | **CONTROLLED** |

---

## 3. Data Minimization Architecture (Section 6 Compliance)

```
┌────────────────────────────────────────────────────────────────────────┐
│                  DATA MINIMIZATION DATAFLOW PIPELINE                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
PATIENT COMPARISON QUERY                                    CHEMIST ONBOARDING
• Search string: "Augmentin"                                • Chemist business name
• In-memory Haversine calculation                           • Form 20/21 license numbers
• Coordinates ephemeral in memory                           • Pharmacist KPC registration
• NO ACCOUNT REGISTRATION REQUIRED                          • Encrypted in Supabase PostgreSQL
• ZERO DATABASE WRITE                                       • Isolated via Row Level Security
```

### 3.1 Anonymous Patient Access (No Mandatory Sign-Up)
Under Section 6(1) of the DPDP Act, platforms must not bundle unnecessary account creation with basic service delivery.
- MediCompare enables complete search, formulation matching, price comparisons, and pharmacy map discovery **without creating an account**.
- Patients can compare medicine prices completely anonymously.

### 3.2 Ephemeral Geolocation Calculations
To calculate distances between patients and retail chemists:
1. Coordinates are supplied via browser `navigator.geolocation` or manual locality selection.
2. Coordinates are sent as transient HTTP query parameters (`?lat=12.97&lng=77.59`).
3. The Route Handler computes Haversine distance in-memory.
4. **Zero database logging**: Coordinates are discarded immediately after response dispatch.

---

## 4. Rights of Data Principals (Sections 11–14 Compliance)

The DPDP Act guarantees specific rights to Data Principals (registered pharmacy operators and administrative users):

1. **Right to Access Information (Section 11)**:
   - Authenticated pharmacy operators can view all store records, inventory feeds, and verification submissions directly via the Chemist Portal (`/pharmacy`).
2. **Right to Correction and Erasure (Section 12)**:
   - Operators can update their profile information or soft-delete their pharmacy listings (`is_active = false`).
   - Cascade rules ensure associated live quotes are removed when a pharmacy closes.
3. **Right of Grievance Redressal (Section 13)**:
   - A dedicated privacy contact channel is published in the footer: `privacy@medcompare.in`.
   - Inquiries are acknowledged within 48 hours and resolved within 30 days.

---

## 5. Security Safeguards & Breach Mitigation (Section 8 Compliance)

Under Section 8(5), Data Fiduciaries must implement reasonable security safeguards to prevent personal data breaches:
1. **100% Supabase Row Level Security (RLS)**: Enforces physical database-level tenant isolation.
2. **Zero Client Secret Exposure**: Next.js client bundles never receive service role keys.
3. **Input Sanitization**: All endpoint inputs validated with strict Zod schemas to block injection vectors.
4. **Transport Layer Security**: HTTPS (TLS 1.3) enforced on all production endpoints.

---

*Authored by Agent 04 & Agent 12. Approved for MediCompare India Production Governance.*

