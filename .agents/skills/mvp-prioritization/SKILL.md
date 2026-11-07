---
name: mvp-prioritization
description: >-
  Applies prioritization frameworks (MoSCoW, RICE) to define the leanest, high-impact MVP scope for MediCompare India.
---

# Skill: mvp-prioritization

## 1. Description & Purpose
Applies prioritization frameworks (MoSCoW, RICE) to define the leanest, high-impact MVP scope for MediCompare India.

## 2. Scope & Applicability
Feature roadmapping, backlog grooming, MVP scope boundaries, and deferral of non-critical capabilities.

## 3. When to Use
When evaluating features for initial launch vs future phases, or when scope creep threatens project milestones.

## 4. Required Inputs
- Feature backlog ideas
- Engineering capacity (solo developer)
- Market launch constraints

## 5. Execution Procedure
1. Inventory candidate features across patient, pharmacy, and admin journeys.
2. Score features on Reach, Impact, Confidence, and Effort (RICE).
3. Categorize features into Must-Have, Should-Have, Could-Have, and Won't-Have (MoSCoW).
4. Strictly eliminate or defer nice-to-have features (e.g., automated payment gateways, complex native apps, AI diagnostics) from MVP.
5. Produce an explicit MVP scope boundary document with justification for deferred items.

## 6. Safety Constraints & Guardrails
- Refuse scope creep that compromises core price transparency or security. Keep MVP maintainable by a solo developer.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- MVP Scope Definition
- RICE Scoring Sheet
- Feature Phase Matrix

## 8. Validation Checklist
- [ ] Is the MVP achievable within solo engineering limits?
- [ ] Are nice-to-have features explicitly deferred?
- [ ] Is the core value proposition protected?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
