# ACADEMIC VIVA & CYBERSECURITY ARCHITECTURE DEFENSE DOSSIER
## MEDICOMPARE INDIA — B.TECH CSE CAPSTONE DEFENSE GUIDE
**Document ID:** `DEFENSE-GUIDE-001`  
**Author:** AGENT 12 — Security Engineer  
**Role:** Individual B.Tech CSE Cybersecurity Student Project  
**Date:** 2026-11-08  
**Scope:** Architecture Defense, Threat Modeling, Supabase RLS Penetration & DPDP Compliance  

---

## 1. Executive Project Summary (Elevator Pitch)

> **"MediCompare India is a privacy-first medicine price comparison and nearby pharmacy discovery platform. It solves the 30% to 300% price opacity in the Indian retail pharmaceutical sector by cross-benchmarking commercial brand MRPs, verified neighborhood chemist selling prices, Government NPPA price ceilings, and bioequivalent PMBJP Jan Aushadhi generic alternatives. Architecturally, it is built as a Modular Monolith using Next.js 15, TypeScript, Supabase PostgreSQL with 100% Row Level Security, and Leaflet OpenStreetMap, adhering strictly to the Digital Personal Data Protection (DPDP) Act, 2023."**

---

## 2. The 4 Cybersecurity Pillars of MediCompare

When professors or external examiners ask *"What makes this a cybersecurity project rather than just a web app?"*, articulate these four architectural pillars:

### Pillar 1: Multi-Tenant Database Isolation via Supabase RLS (Defense-in-Depth)
- **Vulnerability Prevented**: Insecure Direct Object Reference (IDOR) & Cross-Tenant Data Leaking (CWE-639).
- **Implementation**: 100% of all 13 PostgreSQL tables enforce **Row Level Security (RLS)** with a **default-deny posture**.
- **Tenant Isolation Rule**: Chemist A cannot read, update, or delete Chemist B's inventory, import jobs, or Form 20/21 license documents (`owner_id = auth.uid()`).
- **Public Scoping**: Anonymous public queries can only see pharmacies where `verification_status = 'APPROVED'` and offers where `is_active = true`. Unverified or draft stores are completely invisible at the database engine level.

### Pillar 2: Anti-Tampering Triggers & Privilege Escalation Defense
- **Vulnerabilities Prevented**:
  - Vertical Role Escalation (CWE-269): Authenticated users sending REST `PATCH` with `{"role": "platform_admin"}`.
  - Verification Bypass (CWE-285): Pharmacy operators attempting to self-approve their store (`{"verification_status": "APPROVED"}`).
- **Defensive Mechanism**: Custom PostgreSQL `BEFORE UPDATE` database triggers:
  - [`trg_prevent_profile_role_escalation`](file:///c:/Users/veere/Desktop/Med%20compare/supabase/migrations/20261108000000_initial_schema.sql#L339-L342): Aborts transaction if non-admin tries to modify role.
  - [`trg_protect_pharmacy_status`](file:///c:/Users/veere/Desktop/Med%20compare/supabase/migrations/20261108000000_initial_schema.sql#L360-L363): Forbids store owners from altering verification status without admin audit.
- **Audit Immutability**: Historical price archiving trigger (`trg_archive_price_history`) runs as `SECURITY DEFINER SET search_path = public`, while direct `INSERT, UPDATE, DELETE, TRUNCATE` permissions are revoked from client roles.

### Pillar 3: Privacy by Design under the Indian DPDP Act, 2023
- **Vulnerabilities Prevented**: Sensitive Health Data Exposure & Mass Surveillance (CWE-359).
- **Implementation**:
  1. **Zero Patient Health Records**: MediCompare does not store prescription scans, patient medical histories, or clinical diagnostic notes.
  2. **Anonymous Consumer Discovery**: Patients compare prices without mandatory account registration or login.
  3. **Zero Coordinate Logging**: Geolocation coordinates are computed in-memory via the Haversine formula and never persisted to database tables.
  4. **Pseudonymous Price Reporting**: Dispute reporting (`price_reports`) collects zero consumer PII.

### Pillar 4: Statutory Price Integrity Invariants
- **Vulnerability Prevented**: Illegal Overcharging & Price Tampering.
- **Implementation**: Database trigger [`fn_enforce_selling_price_ceiling()`](file:///c:/Users/veere/Desktop/Med%20compare/supabase/migrations/20261108000000_initial_schema.sql#L259-L278) mathematically enforces that no pharmacy offer can be inserted or updated if `selling_price > medicines.mrp`, upholding DPCO 2013 legal compliance.

---

## 3. STRIDE Threat Model Summary

| Threat Category | Potential Threat | MediCompare Mitigation |
| :--- | :--- | :--- |
| **Spoofing** | Rogue store posing as licensed Apollo/MedPlus | Mandatory Form 20/21 license verification before admin approval |
| **Tampering** | Chemist altering prices above printed MRP | PostgreSQL database trigger `trg_check_selling_price_ceiling` |
| **Repudiation** | Chemist disputing price quotation changes | Immutable append-only trigger table `price_history` |
| **Information Disclosure** | Competitor scraping unverified pharmacy pricing | RLS policy scoping public read to `APPROVED` pharmacies only |
| **Denial of Service** | Malicious payloads crashing search endpoints | Strict input sanitization and boundary limits via **Zod** |
| **Elevation of Privilege**| Chemist self-approving store status | `trg_protect_pharmacy_status` aborts transaction |

---

## 4. Top 10 Viva Questions & Model Answers

### Q1: Why did you choose a Modular Monolith instead of Microservices?
**Answer**: *"For an MVP targeting Bengaluru with sub-20ms latency requirements, a Modular Monolith with Next.js App Router and Supabase PostgreSQL avoids distributed transaction overhead, network latency between microservices, and operational complexity. It provides clean module boundaries (`matching`, `geo`, `server`, `validation`) within a unified type-safe codebase, perfectly suited for rapid iteration and high reliability."*

### Q2: How do you prevent an authenticated user from modifying their role in Supabase?
**Answer**: *"Supabase PostgREST default RLS checks `auth.uid() = id`, which allows users to update any column on their own profile row, including `role`. To prevent vertical privilege escalation (CWE-269), I engineered a PostgreSQL `BEFORE UPDATE` trigger `fn_prevent_profile_role_escalation()`. If `NEW.role != OLD.role`, the trigger inspects the caller's JWT claims. Unless the caller possesses the `service_role` or existing `platform_admin` role, the transaction immediately raises an exception and aborts."*

### Q3: How does your formulation matching engine prevent clinical errors?
**Answer**: *"Under Governance Rule 02, therapeutic equivalence cannot be inferred from name similarity. Two medicines are only considered bioequivalent if they share identical active salts (INN), exact metric strength, identical dosage form (e.g. tablet vs syrup), and matching release profiles. Our engine enforces a strict Release Profile Safety Lock (FR-003): Immediate Release (IR) and Sustained Release (SR) cannot be cross-matched because swapping them alters pharmacokinetics and could cause hypoglycemia or hypertension."*

### Q4: How do you comply with the DPDP Act 2023?
**Answer**: *"We implement strict Data Minimization under Section 6 of the DPDP Act. We store zero consumer health records, zero prescription images, and zero diagnostic notes. Furthermore, price comparison is completely anonymous—consumers do not create accounts or link phone numbers to search, and GPS coordinates are processed in-memory for Haversine distance calculations without persistent database logging."*

### Q5: How do you handle CSV inventory uploads securely?
**Answer**: *"The CSV ingestion pipeline parses file text into structured records, validates schema invariants using Zod, checks the price floor, and verifies that `selling_price <= medicines.mrp`. Incompatible rows are rejected with detailed audit error codes rather than crashing the transaction. Valid rows are upserted into `pharmacy_offers`, which immediately triggers the database-level `price_history` archival."*

### Q6: Why did you use Leaflet and OpenStreetMap instead of Google Maps API?
**Answer**: *"OpenStreetMap via Leaflet JS provides complete privacy (no proprietary user tracking), avoids vendor lock-in and credit card billing quotas, and delivers lightweight, fast tile rendering that integrates seamlessly into our Next.js client components."*

### Q7: What happens if a pharmacy quotes a price higher than MRP?
**Answer**: *"The submission is rejected at two independent layers: first by the TypeScript CSV ingestion validation service (`EXCEEDS_MRP_CEILING`), and second by a database-level BEFORE INSERT OR UPDATE trigger (`trg_check_selling_price_ceiling`) that queries canonical catalog MRP and raises a database exception if violated."*

### Q8: What was your Gate 7 Security Audit finding and how was it remediated?
**Answer**: *"During my independent Gate 7 audit, I uncovered that the price archiving trigger function ran as `SECURITY INVOKER`, causing an RLS denial when chemists updated offers. I remediated this by defining the function as `SECURITY DEFINER SET search_path = public`. I also identified that pharmacy operators could self-approve verification status via REST PATCH, and patched this by creating the `trg_protect_pharmacy_status` trigger."*

### Q9: What is the significance of the NPPA DPCO 2013 data?
**Answer**: *"The National Pharmaceutical Pricing Authority (NPPA) regulates scheduled essential formulations in India under the DPCO 2013 and NLEM 2022. We ingest official gazette S.O. ceiling orders to show consumers the statutory legal price ceiling alongside commercial MRP and chemist selling prices, establishing true price transparency."*

### Q10: How does your application perform autocomplete search under 20ms?
**Answer**: *"We created PostgreSQL trigram GIN indexes (`idx_medicines_brand_name_trgm` and `idx_formulations_name_trgm`) using the `pg_trgm` extension. This enables index-accelerated fuzzy string matching on partial keystrokes without full table scans."*

---

*Compiled for the individual B.Tech CSE Cybersecurity Capstone Project. Evaluated under AGENTS.md Quality Gates.*

