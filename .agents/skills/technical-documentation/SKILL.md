---
name: technical-documentation
description: >-
  Authors, structures, and audits comprehensive technical documentation across SRS, TRD, SDD, API specs, and ERDs.
---

# Skill: technical-documentation

## 1. Description & Purpose
Authors, structures, and audits comprehensive technical documentation across SRS, TRD, SDD, API specs, and ERDs.

## 2. Scope & Applicability
Technical documentation architecture, markdown standards, diagrams, manuals, and doc synchronization.

## 3. When to Use
When creating or updating specifications in `docs/` and maintaining parity between documentation and implementation.

## 4. Required Inputs
- System implementation
- Architecture specifications
- API contracts

## 5. Execution Procedure
1. Structure documentation into standardized directories: `docs/01-project/` through `docs/09-ai-orchestration/`.
2. Author formal specifications (TRD, SDD, ERD, API specs) using clear markdown, tables, and Mermaid diagrams.
3. Maintain documentation integrity: doc updates must accompany code changes in the same pull request.
4. Author practical user guides: Patient Manual, Pharmacy Manual, Administrator Manual.
5. Conduct documentation QA: verify all links, command examples, and schema diagrams.

## 6. Safety Constraints & Guardrails
- Never mark an unimplemented feature as complete in documentation. Clearly label planned vs implemented features.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Technical Specification Documents
- User Guides
- Documentation Quality Audit

## 8. Validation Checklist
- [ ] Are all 9 doc directories properly populated?
- [ ] Are Mermaid diagrams valid and rendering properly?
- [ ] Does documentation accurately match the code?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
