---
name: nppa-data-research
description: >-
  Researches and standardizes National Pharmaceutical Pricing Authority (NPPA) ceiling price datasets and Drug Price Control Orders (DPCO).
---

# Skill: nppa-data-research

## 1. Description & Purpose
Researches and standardizes National Pharmaceutical Pricing Authority (NPPA) ceiling price datasets and Drug Price Control Orders (DPCO).

## 2. Scope & Applicability
NLEM schedules, ceiling price gazette notifications, Pharma Sahi Daam data structures, and statutory price formulas.

## 3. When to Use
When sourcing, parsing, or auditing government reference price data for scheduled formulations.

## 4. Required Inputs
- NPPA Gazette notifications
- Pharma Sahi Daam data schema
- NLEM 2022 list

## 5. Execution Procedure
1. Review NPPA statutory framework under DPCO 2013 and NLEM 2022.
2. Identify official notification formats (S.O. numbers, gazette dates, ceiling price per unit).
3. Extract formulation parameters: salt name, strength, dosage form, pack size, ceiling price (excluding GST).
4. Account for statutory applicable GST rates (5% or 12%) when presenting comparison baselines.
5. Structure ingestion templates for parsing NPPA ceiling price tables into PostgreSQL reference tables.

## 6. Safety Constraints & Guardrails
- Never treat NPPA ceiling prices as local retail pharmacy selling prices; they represent statutory maximums for scheduled drugs.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- NPPA Data Specification
- Ceiling Price Ingestion Schema
- S.O. Reference Catalog

## 8. Validation Checklist
- [ ] Are ceiling prices distinguished from retail selling prices?
- [ ] Is applicable GST treated transparently?
- [ ] Is the source gazette / S.O. number preserved?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
