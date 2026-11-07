---
name: ieee-srs-engineering
description: >-
  Authors and maintains IEEE Std 830 / ISO/IEC/IEEE 29148 compliant Software Requirements Specifications (SRS) for MediCompare India.
---

# Skill: ieee-srs-engineering

## 1. Description & Purpose
Authors and maintains IEEE Std 830 / ISO/IEC/IEEE 29148 compliant Software Requirements Specifications (SRS) for MediCompare India.

## 2. Scope & Applicability
Formal requirements specification, functional and non-functional requirements, interfaces, system constraints.

## 3. When to Use
When formalizing system requirements, defining acceptance baselines, or updating formal documentation.

## 4. Required Inputs
- Product discovery documents
- Regulatory parameters
- Technical architectural boundaries

## 5. Execution Procedure
1. Define system overview, purpose, and operational context according to IEEE 830 standards.
2. Specify exact functional requirements (FR-xxx) with unambiguous inputs, processing steps, and outputs.
3. Specify non-functional requirements (NFR-xxx) covering performance, security, availability, and usability.
4. Document external interface requirements (user interfaces, hardware, software, communications).
5. Establish unique identifier numbering for every requirement for bidirectional traceability.

## 6. Safety Constraints & Guardrails
- Avoid ambiguous words like "user-friendly" or "fast". Use quantified metrics (e.g., search latency < 500ms).
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Formal IEEE-Style SRS Document
- Requirements Numbering Index

## 8. Validation Checklist
- [ ] Is every requirement uniquely numbered?
- [ ] Are requirements verifiable and testable?
- [ ] Are edge cases and error states specified?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
