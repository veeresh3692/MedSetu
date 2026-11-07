---
name: github-ci-cd
description: >-
  Configures and maintains GitHub Actions workflows for continuous integration, linting, testing, and deployment pipelines.
---

# Skill: github-ci-cd

## 1. Description & Purpose
Configures and maintains GitHub Actions workflows for continuous integration, linting, testing, and deployment pipelines.

## 2. Scope & Applicability
GitHub Actions workflow YAMLs, branch protection rules, automated test execution, and deployment hooks.

## 3. When to Use
When setting up or updating CI/CD pipelines, automating test runs on pull requests, or configuring release automation.

## 4. Required Inputs
- Repository structure
- Test commands
- Deployment target configurations

## 5. Execution Procedure
1. Author `.github/workflows/ci.yml` triggered on pull requests and pushes to `develop` and `main`.
2. Configure job pipeline: Checkout -> Node.js Setup -> Dependency Install (`npm ci`) -> Lint (`npm run lint`) -> Typecheck (`tsc --noEmit`) -> Unit Tests (`npm test`).
3. Add Playwright E2E testing job with artifact retention for test reports.
4. Configure branch protection recommendations: require passing CI checks and peer review before merging to `main`.
5. Maintain zero build failures on trunk.

## 6. Safety Constraints & Guardrails
- Never log secrets or environment variables in workflow console logs. Use GitHub Encrypted Secrets.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- GitHub Actions Workflow Files
- CI/CD Pipeline Documentation
- Branch Protection Guide

## 8. Validation Checklist
- [ ] Does CI run lint, typecheck, and unit tests on every PR?
- [ ] Are secrets securely injected from repository secrets?
- [ ] Is build caching optimized for speed?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
