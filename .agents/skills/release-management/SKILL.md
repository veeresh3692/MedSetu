---
name: release-management
description: >-
  Coordinates integration reviews, Git release tags, migration sequencing, release checklists, and changelog management.
---

# Skill: release-management

## 1. Description & Purpose
Coordinates integration reviews, Git release tags, migration sequencing, release checklists, and changelog management.

## 2. Scope & Applicability
Release coordination, semantic versioning, migration ordering, release checklists, and production sign-off.

## 3. When to Use
When preparing a version release, cutting release candidates, or executing release gates.

## 4. Required Inputs
- Merged features
- Migration scripts
- Test execution summaries
- Task backlog state

## 5. Execution Procedure
1. Verify that all features planned for the release have passed Quality Gates 1 through 9.
2. Sequence database migrations safely (backward-compatible schema updates first, code deployment second, cleanups last).
3. Maintain semantic versioning (`v0.1.0-alpha`, `v0.2.0-beta`, `v1.0.0`) and generate structured `RELEASE_NOTES.md`.
4. Execute pre-release checklist: verify environment variables, test staging build, confirm database backups.
5. Submit Release Candidate to Product Owner for Level 5 human sign-off before tagging and deploying to production.

## 6. Safety Constraints & Guardrails
- Never tag or deploy a release without explicit Product Owner approval. Never skip migration dry-runs.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Release Checklist
- Release Notes / Changelog
- Migration Sequencing Plan

## 8. Validation Checklist
- [ ] Have all 10 quality gates been verified?
- [ ] Is migration sequence verified and non-destructive?
- [ ] Is explicit Product Owner sign-off recorded?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
