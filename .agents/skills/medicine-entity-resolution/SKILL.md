---
name: medicine-entity-resolution
description: >-
  Resolves medicine identity across messy brand names, generic salt combinations, strengths, and packaging formats.
---

# Skill: medicine-entity-resolution

## 1. Description & Purpose
Resolves medicine identity across messy brand names, generic salt combinations, strengths, and packaging formats.

## 2. Scope & Applicability
Entity resolution, salt extraction, brand-generic mapping, multi-ingredient parsing, and alias management.

## 3. When to Use
When ingesting pharmacy inventory CSVs, processing search queries, or deduplicating medicine catalog records.

## 4. Required Inputs
- Raw medicine title strings
- Manufacturer product sheets
- Canonical medicine master list

## 5. Execution Procedure
1. Tokenize and normalize raw drug strings (convert to lowercase, strip trailing punctuation, standardize whitespace).
2. Extract active ingredients, component strengths, and dosage forms using regex and semantic dictionary matching.
3. Separate brand trade names (e.g., "Augmentin 625 Duo") from active formulation ("Amoxicillin 500mg + Clavulanic Acid 125mg").
4. Assign canonical entity UUID to the resolved formulation.
5. Maintain alias tables for common misspellings and trade variations.

## 6. Safety Constraints & Guardrails
- If salt composition or strength is ambiguous or missing, do NOT guess. Mark record as REQUIRES_MANUAL_REVIEW.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Entity Resolution Ruleset
- Medicine Alias Table
- Disambiguation Pipeline

## 8. Validation Checklist
- [ ] Does the resolution parse multi-salt combinations accurately?
- [ ] Are strengths normalized to standard units?
- [ ] Are ambiguous records safely flagged?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
