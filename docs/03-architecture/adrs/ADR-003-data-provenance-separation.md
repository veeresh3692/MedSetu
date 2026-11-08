# ADR-003: PHYSICAL SEPARATION OF MEDICINE & PRICE DATASETS
**Status:** APPROVED  
**Date:** 2026-11-08  
**Deciders:** Elite AI Orchestrator, AGENT 07 (System Architect), AGENT 05 (Medicine Data Research)  
**Consulted:** AGENT 06 (Data Quality & Matching), AGENT 11 (Database Engineer)  

---

## 1. Context & Problem Statement
In retail pharmaceuticals in India, multiple distinct price concepts exist for a single drug:
1. Government Ceiling Prices notified under the Drugs (Prices Control) Order (DPCO) by the National Pharmaceutical Pricing Authority (NPPA).
2. Manufacturer Maximum Retail Price (MRP) printed on packaging.
3. Retail Pharmacy Selling Prices (offered price at local stores, typically discounted 10-25% on branded generics).
4. Historical Price Observations (past prices over time).

Conflating these distinct figures—specifically, showing government reference prices as local pharmacy selling prices—would mislead consumers and destroy platform credibility. Furthermore, active inventory updates could destroy audit trails if not isolated.

How should price and catalog datasets be structured in the database?

---

## 2. Decision
We will enforce **strict physical database separation** across five distinct data entities:
1. `medicines`: Canonical catalog containing brand name, active formulation ID, manufacturer, pack size, and printed MRP.
2. `formulations`: Clinical active chemical salts, normalized strengths, dosage forms, and release profiles (IR, SR, ER).
3. `government_price_references`: Sourced strictly from NPPA gazette notifications (NLEM 2022). Labeled clearly as government reference ceiling prices.
4. `pharmacy_offers`: Verified store quotations submitted by licensed chemists.
5. `price_history`: Append-only immutable log populated via PostgreSQL triggers before any offer mutation or deletion.

Synthetic or demonstration records must explicitly set `is_demo = true` and are banned from production queries.

---

## 3. Alternatives Considered

### Alternative 1: Single Denormalized "Prices" Table
- *Pros*: Simple single-table queries.
- *Cons*: High risk of field confusion; impossible to maintain clean audit provenance; government ceiling prices easily mixed up with store prices; historical price data lost when rows are updated.
- *Verdict*: **REJECTED**.

---

## 4. Consequences

### Positive Consequences
- **Uncompromised Truth in Data**: Zero chance of presenting government ceiling prices as active store offers.
- **Permanent Audit Lineage**: Every price observation preserves `source`, `source_reference`, `observation_timestamp`, `retrieval_timestamp`, and `verification_status`.
- **Audit Resilience**: Deleting an active pharmacy offer never deletes historical price observation records.

### Negative / Trade-off Consequences
- **Query Complexity**: Search and comparison queries require multi-table joins (`medicines` JOIN `formulations` JOIN `pharmacy_offers` JOIN `pharmacies`).
- **Index Management**: Requires composite indexes on foreign keys and verification status flags to maintain sub-150ms query latency.

---

## 5. Compliance & Verification
- Adheres to MediCompare Governance Rule `02-data-medicine-governance.md` and Risk Register `RSK-02`.
- Verified in Task MC-005 by Agent 07 (System Architect).
