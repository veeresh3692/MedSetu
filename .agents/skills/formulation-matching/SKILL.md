---
name: formulation-matching
description: >-
  Performs clinical and chemical formulation matching between prescribed medicines, brand alternatives, and generic substitutes.
---

# Skill: formulation-matching

## 1. Description & Purpose
Performs clinical and chemical formulation matching between prescribed medicines, brand alternatives, and generic substitutes.

## 2. Scope & Applicability
Active salt equivalence, exact strength matching, dosage form compatibility, release characteristics, and pack-size calculation.

## 3. When to Use
When executing price comparison queries to find exact or equivalent lower-cost alternatives for a searched medicine.

## 4. Required Inputs
- Target medicine formulation
- Available catalog formulations
- Pharmacy inventory offers

## 5. Execution Procedure
1. Compare active pharmaceutical ingredients: exact match on all active components in combination products.
2. Verify exact strength equality across all ingredients (e.g., 500mg vs 250mg is NOT a match).
3. Verify dosage form compatibility (tablets vs capsules may match under specific oral rules; syrups and tablets never match).
4. Check release profile: Immediate Release (IR) must NEVER be matched with Sustained Release (SR) or Extended Release (ER) as a direct substitute.
5. Calculate normalized unit price (price per tablet / price per 10ml) to enable fair comparison across different pack sizes.

## 6. Safety Constraints & Guardrails
- NEVER declare therapeutic equivalence on different salts, differing strengths, or altered release profiles. Flag substitutions clearly.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Formulation Matching Algorithm Spec
- Equivalence Matrix
- Unit Price Normalization Engine

## 8. Validation Checklist
- [ ] Are release characteristics (IR/SR/ER) strictly checked?
- [ ] Are combination drug ratios validated?
- [ ] Is normalized unit price calculated correctly?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
