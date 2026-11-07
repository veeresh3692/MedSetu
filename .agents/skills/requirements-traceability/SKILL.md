---
name: requirements-traceability
description: >-
  Maintains bidirectional traceability matrix (RTM) linking business requirements to SRS, architecture components, code modules, and tests.
---

# Skill: requirements-traceability

## 1. Description & Purpose
Maintains bidirectional traceability matrix (RTM) linking business requirements to SRS, architecture components, code modules, and tests.

## 2. Scope & Applicability
Traceability analysis, coverage verification, change impact analysis across requirements and test suites.

## 3. When to Use
Before releasing modules, during quality audits, or when analyzing the impact of changing a requirement.

## 4. Required Inputs
- SRS requirements
- Architecture components
- Test specifications
- Task tickets

## 5. Execution Procedure
1. Construct the Requirements Traceability Matrix (RTM) connecting BRD -> SRS -> SDD -> Code -> Test.
2. Verify that every functional requirement has at least one corresponding test case.
3. Identify orphan requirements (requirements without tests) and orphan code (code without requirements).
4. Evaluate change impact when requirements or schemas are modified.
5. Output audit reports highlighting coverage gaps.

## 6. Safety Constraints & Guardrails
- Never approve a release with unmapped or untested high-priority requirements.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Requirements Traceability Matrix (RTM)
- Gap Analysis Report

## 8. Validation Checklist
- [ ] Does every FR have corresponding test cases?
- [ ] Are there any orphan requirements or code modules?
- [ ] Is traceability updated synchronously with changes?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
