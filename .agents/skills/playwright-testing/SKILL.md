---
name: playwright-testing
description: >-
  Develops and executes end-to-end (E2E) browser automation test suites using Playwright.
---

# Skill: playwright-testing

## 1. Description & Purpose
Develops and executes end-to-end (E2E) browser automation test suites using Playwright.

## 2. Scope & Applicability
User journey automation, cross-browser testing, responsive viewport testing, and visual regression.

## 3. When to Use
When validating user workflows (medicine search, price comparison, pharmacy onboarding) in a simulated browser.

## 4. Required Inputs
- User journeys
- Page URLs and selectors
- Test fixtures

## 5. Execution Procedure
1. Define critical E2E user paths: Patient Search -> Filter by Distance -> Select Formulation -> Compare Prices -> View Pharmacy Details.
2. Configure Playwright with resilient selectors (role-based, test-id, text content; avoid brittle CSS paths).
3. Implement test fixtures with isolated mock database states or seed data.
4. Test mobile and desktop viewport profiles.
5. Run tests headless in CI and generate HTML trace reports on failure.

## 6. Safety Constraints & Guardrails
- Do not run automated tests against live production databases with write operations.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Playwright E2E Test Suite
- E2E Test Execution Report
- Trace & Video Failure Artifacts

## 8. Validation Checklist
- [ ] Do tests use resilient user-facing selectors?
- [ ] Are critical patient and pharmacy journeys covered?
- [ ] Do tests pass in headless CI mode?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
