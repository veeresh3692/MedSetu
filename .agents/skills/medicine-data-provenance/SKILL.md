---
name: medicine-data-provenance
description: >-
  Establishes immutable data provenance, source tracking, and audit trails for all medicine catalog and price records.
---

# Skill: medicine-data-provenance

## 1. Description & Purpose
Establishes immutable data provenance, source tracking, and audit trails for all medicine catalog and price records.

## 2. Scope & Applicability
Data lineage, observation timestamps, retrieval timestamps, source verification status, and change audit trails.

## 3. When to Use
When designing or modifying schemas for medicines, prices, pharmacy inventories, or imports.

## 4. Required Inputs
- Database schemas
- Price records
- Ingestion batch metadata

## 5. Execution Procedure
1. Define mandatory provenance metadata for every price observation (`source`, `source_reference`, `observation_timestamp`, `retrieval_timestamp`).
2. Establish verification status lifecycle (`UNVERIFIED` -> `PHARMACY_CONFIRMED` -> `ADMIN_AUDITED`).
3. Implement append-only price history logging that survives updates or deletions in active inventory.
4. Maintain data source register linking records to official public orders or verified store submissions.
5. Validate that all price displays expose provenance to the user (e.g., "Updated 2 hours ago by Pharmacy XYZ").

## 6. Safety Constraints & Guardrails
- Never allow synthetic or demo data to overwrite or mix with verified live price records.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Provenance Metadata Standard
- Lineage Tracking Architecture
- Price Audit Trigger Design

## 8. Validation Checklist
- [ ] Are observation and retrieval timestamps distinct?
- [ ] Does price history survive active inventory deletion?
- [ ] Is data source visible to end consumers?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
