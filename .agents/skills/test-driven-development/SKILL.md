---
name: test-driven-development
description: >-
  Guides test-driven development (TDD) workflows using Vitest / Jest for unit and integration testing of core business logic.
---

# Skill: test-driven-development

## 1. Description & Purpose
Guides test-driven development (TDD) workflows using Vitest / Jest for unit and integration testing of core business logic.

## 2. Scope & Applicability
Unit tests, test-first authoring, edge case coverage, mocking, and assertion verification.

## 3. When to Use
When building algorithms (formulation matching, price calculation, unit normalization) and data transformers.

## 4. Required Inputs
- Feature requirements
- Algorithm specifications
- Edge case lists

## 5. Execution Procedure
1. Write failing unit tests first (Red) capturing business requirements and edge cases.
2. Implement minimum code necessary to make the tests pass (Green).
3. Refactor code for cleanliness, maintainability, and efficiency while ensuring tests stay green (Refactor).
4. Test boundary conditions: null inputs, zero prices, missing formulation parameters, extreme distances.
5. Measure and enforce code coverage on domain services (> 85% branch coverage).

## 6. Safety Constraints & Guardrails
- Never mock the core logic under test. Only mock external I/O boundaries (database, network).
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Vitest Test Suites
- Code Coverage Reports
- Regression Test Baselines

## 8. Validation Checklist
- [ ] Were tests written before or alongside implementation?
- [ ] Are boundary and edge cases covered?
- [ ] Do all tests pass reliably without flakes?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
