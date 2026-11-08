# NATIONAL PHARMACEUTICAL PRICING AUTHORITY (NPPA) DATA SPECIFICATION
## MEDICOMPARE INDIA — MEDICINE PRICING & PROVENANCE STANDARD
**Document ID:** `DOC-DATA-001`  
**Task ID:** `MC-007`  
**Author:** AGENT 05 — Medicine Data Research & AGENT 06 — Data Quality  
**Reviewer:** AGENT 12 — Security Engineer  
**Status:** `APPROVED`  
**Version:** `1.0.0`  
**Date:** 2026-11-08  
**Applicability:** Drug Price Control Order (DPCO 2013) & National List of Essential Medicines (NLEM 2022)  

---

## 1. Regulatory Context & Statutory Framework

Under the **Essential Commodities Act, 1955** and the **Drugs (Prices Control) Order, 2013 (DPCO 2013)**, the **National Pharmaceutical Pricing Authority (NPPA)** under the Ministry of Chemicals and Fertilizers, Government of India, fixes and regulates the statutory ceiling prices of essential medicines listed in the **National List of Essential Medicines (NLEM)**.

### 1.1 Statutory Rules Governing Price Presentation:
1. **Ceiling Price (Excl. GST)**: NPPA notifies the maximum ceiling price per specified unit (e.g. per 1 tablet, per 1 capsule, per 1ml injection) exclusive of local taxes (GST).
2. **Applicable GST**: Goods and Services Tax on medicines in India is either **5%** (life-saving / critical formulations) or **12%** (standard scheduled formulations).
3. **Maximum Retail Price (MRP)**: Manufacturers are legally prohibited from printing an MRP exceeding:
   $$\text{Statutory Maximum MRP} = (\text{Ceiling Price} \times \text{Pack Size}) \times (1 + \text{GST Rate})$$
4. **Mandatory Separation (Governance Rule 02)**:
   - Government NPPA Reference Prices must **NEVER** be displayed to consumers as live pharmacy selling prices.
   - Government reference prices are informational baselines against which commercial MRPs and local pharmacy discounts are benchmarked.

---

## 2. Ingestion Pipeline & Data Schema

### 2.1 Entity Mapping in PostgreSQL Schema

NPPA reference data maps directly into table [`government_price_references`](file:///c:/Users/veere/Desktop/Med%20compare/supabase/migrations/20261108000000_initial_schema.sql#L125-L137):

| Field Name | Type | Description | Example Value |
| :--- | :--- | :--- | :--- |
| `id` | UUID (PK) | Unique reference identifier | `gen_random_uuid()` |
| `formulation_id` | UUID (FK) | Reference to bioequivalent clinical formulation | `formulations.id` |
| `ceiling_price` | NUMERIC(10, 2) | Notified ceiling price per unit (excl. GST) | `2.14` (₹2.14 / tab) |
| `unit_specification` | TEXT | Monograph unit measurement | `"Per 1 Tablet"`, `"Per 100ml"` |
| `applicable_gst_rate` | NUMERIC(4, 2) | Statutory GST percentage | `12.00` (12%) |
| `dpco_order_number` | TEXT | Official Ministry of Chemicals Gazette S.O. Number | `"S.O. 1563(E)"` |
| `notification_date` | DATE | Date of gazette notification | `'2023-03-31'` |
| `source_reference` | TEXT | Gazette publication citation | `"NPPA Gazette Notification March 2023"` |
| `retrieval_timestamp` | TIMESTAMPTZ | Ingestion and verification timestamp | `NOW()` |

---

## 3. Top Chronic Therapy Formulations for Bengaluru Pilot

The initial pilot focuses on high-prevalence chronic conditions in Bengaluru (Diabetology, Cardiology, Pulmonology, Gastroenterology, Anti-infectives) where recurring monthly out-of-pocket spend is highest:

### 3.1 Pilot Monograph Definitions

| Therapeutic Category | Clinical Formulation Monograph | Normalized Strength | NPPA Ceiling Price (Excl. GST) | Indicative Gazette Order |
| :--- | :--- | :--- | :--- | :--- |
| **Diabetology** | Metformin Hydrochloride Tablet | 500mg | ₹1.82 / tablet | S.O. 1563(E) |
| **Diabetology** | Glimepiride Tablet | 2mg | ₹4.25 / tablet | S.O. 1563(E) |
| **Cardiology** | Telmisartan Tablet | 40mg | ₹5.85 / tablet | S.O. 1563(E) |
| **Cardiology** | Amlodipine Besylate Tablet | 5mg | ₹2.14 / tablet | S.O. 1563(E) |
| **Cardiology** | Atorvastatin Calcium Tablet | 10mg | ₹7.42 / tablet | S.O. 1563(E) |
| **Cardiology** | Rosuvastatin Calcium Tablet | 10mg | ₹11.20 / tablet | S.O. 1563(E) |
| **Anti-infective** | Amoxicillin + Potassium Clavulanate Tablet | 500mg + 125mg | ₹18.30 / tablet | S.O. 5249(E) |
| **Anti-infective** | Azithromycin Tablet | 500mg | ₹21.50 / tablet | S.O. 1563(E) |
| **Gastroenterology** | Pantoprazole Sodium Tablet | 40mg | ₹7.10 / tablet | S.O. 1563(E) |
| **Gastroenterology** | Omeprazole Capsule | 20mg | ₹3.40 / capsule | S.O. 1563(E) |
| **Pulmonology** | Montelukast Sodium + Levocetirizine Tablet | 10mg + 5mg | Non-scheduled (Market) | N/A |

---

## 4. Price Tiering Architecture & Commercial Spread

To achieve price transparency without misleading patients, MediCompare categorizes all products into three commercial pricing tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MEDICOMPARE PRICING TIERS                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│  INNOVATOR / LEADING │ │   BRANDED GENERICS   │ │   PUBLIC GENERICS    │
│    COMMERCIAL BRAND  │ │ (DOMESTIC PRODUCERS) │ │  (PMBJP JAN AUSHADHI)│
├──────────────────────┤ ├──────────────────────┤ ├──────────────────────┤
│ e.g. Augmentin 625   │ │ e.g. Moxikind-CV 625 │ │ e.g. Amoxy-Clav 625  │
│ MRP: ₹223.50 (10 tabs│ │ MRP: ₹165.00 (10 tabs│ │ MRP: ₹58.00 (10 tabs)│
│ High marketing spend │ │ Mid-range commercial │ │ Bioequivalent generic│
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘
```

### 4.1 Price Normalization Formula
All medicine cards and comparison tables must present a **Normalized Unit Price (₹ / tablet, ₹ / capsule, ₹ / ml)**:
$$\text{Unit Price} = \frac{\text{Pack Selling Price}}{\text{Pack Size}}$$

For example:
- **Augmentin 625 Duo** (GSK): Pack MRP ₹223.50 (10 tablets) $\rightarrow$ **₹22.35 / tablet**
- **Moxikind-CV 625** (Mankind): Pack MRP ₹165.00 (10 tablets) $\rightarrow$ **₹16.50 / tablet**
- **Jan Aushadhi Amoxy-Clav 625**: Pack MRP ₹58.00 (10 tablets) $\rightarrow$ **₹5.80 / tablet**
- **NPPA Ceiling Price**: Statutory reference ₹18.30 + 12% GST $\rightarrow$ **₹20.50 / tablet ceiling**

---

## 5. Data Validation & Quality Invariants (Zod Rules)

Every imported NPPA record must pass the following structural validation invariants:
1. `ceiling_price > 0`
2. `applicable_gst_rate IN (5.00, 12.00)`
3. `dpco_order_number` must match statutory gazette pattern `^S\.O\.\s*[0-9]+(\([A-Z]\))?$`
4. `notification_date <= CURRENT_DATE`
5. `formulation_id` must resolve to a valid UUID in table `formulations`.

---

*Authored by Agent 05 (Medicine Data Research) and Agent 06 (Data Quality). Reviewed by Agent 12 (Security Engineer).*

