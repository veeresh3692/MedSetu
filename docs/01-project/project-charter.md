# PROJECT CHARTER
## MEDICOMPARE INDIA — PLATFORM GOVERNANCE & CHARTER
**Document ID:** `DOC-PROJ-001`  
**Task ID:** `MC-001-CHARTER`  
**Author:** AGENT 01 — Product Strategy  
**Reviewer:** Individual B.Tech CSE Cybersecurity Student (Product Owner)  
**Status:** `APPROVED`  
**Version:** `1.0.0`  
**Date:** 2026-11-08  
**Applicability:** Bengaluru Urban District (Pilot Phase) -> Pan-India Expansion  

---

## 1. Project Background & Business Case

In India, healthcare expenditure is predominantly out-of-pocket (65%+), with retail pharmaceutical purchases accounting for 52% to 60% of outpatient healthcare spend. Patients managing recurring chronic conditions (such as Type 2 Diabetes, Hypertension, and Dyslipidemia) incur monthly maintenance costs between ₹1,800 and ₹5,400.

While centralized e-pharmacies offer discounts on packaged products, their fulfillment cycles (24–72 hours) fail to satisfy acute needs, same-day pickup, or immediate treatment requirements. Furthermore, extreme price spreads exist between commercial innovator brands (e.g. *Augmentin 625*, *Telma 40*), domestic branded generics (e.g. *Moxikind-CV*, *Telmikind*), and government generic lines (*Pradhan Mantri Bhartiya Janaushadhi Pariyojana - PMBJP*).

**MediCompare India** is chartered to bridge this information asymmetry by delivering a neutral, search, discovery, and price comparison engine that connects healthcare consumers with licensed neighborhood chemists in Bengaluru.

---

## 2. Project Vision & Core Value Proposition

> **"To empower every Indian healthcare consumer with instant, transparent price discovery for their exact prescribed medicine formulation, enabling 30% to 70% savings through bioequivalent generic alternatives and walk-in fulfillment at verified neighborhood pharmacies."**

---

## 3. Project Objectives & Key Performance Indicators (KPIs)

| Objective | Target Metric (Pilot Phase) | Verification Method |
| :--- | :--- | :--- |
| **Search Latency** | Autocomplete response time **$< 20\text{ ms}$** | Performance benchmarker (trigram index) |
| **Formulation Accuracy** | **100% adherence** to Release Profile Safety Lock (zero IR vs SR mismatches) | Automated Vitest clinical test suite |
| **Price Data Integrity** | **Zero violations** of statutory ceiling (`selling_price <= mrp`) | Database trigger enforcement |
| **Chemist Network Density** | **4+ pilot micro-markets** mapped in Bengaluru with verified Form 20/21 licenses | Supabase verified pharmacy records |
| **Privacy Compliance** | **Zero consumer health PII** or persistent search coordinates stored | DPDP Act 2023 compliance audit |

---

## 4. Project Scope & Non-Dispensing Boundary

### In-Scope:
1. Multidimensional autocomplete search across brand names and active generic salts.
2. Clinical formulation resolution (active salts, strength, dosage form, and release lock: IR vs. SR/ER).
3. Three-tier price benchmarking: Manufacturer MRP, Verified Chemist Selling Quotes, and NPPA Price Ceilings.
4. Bioequivalent Jan Aushadhi generic alternative ranking based on consumer savings.
5. Hyperlocal pharmacy discovery with interactive OpenStreetMap / Leaflet views and Haversine distance calculations.
6. Chemist Partner Portal with Form 20/21 license onboarding and CSV inventory batch ingestion.
7. Crowdsourced consumer price dispute reporting.

### Out-of-Scope (Strict Regulatory Non-Dispensing Boundary):
1. **No Online Medicine Dispensing or Sales**: MediCompare does not sell, compound, or courier medicines.
2. **No E-Commerce Cart or Payment Gateway**: All transactions occur physically at licensed chemist counters.
3. **No Medical Diagnosis or Treatment Alteration Advice**: Users are strictly instructed to consult their prescribing physician.
4. **No Schedule X Narcotic Promotional Discovery**: Schedule X drugs are excluded from public search autocomplete.

---

## 5. Stakeholder Matrix & Governance

- **Product Owner & Lead Developer**: Individual B.Tech CSE Cybersecurity Student (holds final authority over architecture, security, deployment, and data decisions).
- **Target End-Users**:
  - Healthcare Consumers / Chronic Maintenance Patients (Bengaluru).
  - Licensed Independent Retail Chemists and PMBJP Jan Aushadhi Kendras.
- **Orchestration Model**: Elite AI Orchestration over 18 domain-specialist agents and 33 domain skills governed by `AGENTS.md` and `.agents/rules/`.

---

*Authored by Agent 01 (Product Strategy). Approved by Product Owner.*

