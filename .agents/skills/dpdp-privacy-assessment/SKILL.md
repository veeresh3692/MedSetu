---
name: dpdp-privacy-assessment
description: >-
  Conducts privacy impact assessments under the Indian Digital Personal Data Protection (DPDP) Act, 2023.
---

# Skill: dpdp-privacy-assessment

## 1. Description & Purpose
Conducts privacy impact assessments under the Indian Digital Personal Data Protection (DPDP) Act, 2023.

## 2. Scope & Applicability
Data principal rights, consent notices, purpose limitation, data minimization, retention schedules, and breach management.

## 3. When to Use
When designing user data schema, search logging, user accounts, and pharmacy operator onboarding.

## 4. Required Inputs
- DPDP Act 2023 statutory provisions
- Application data models
- User registration and search workflows

## 5. Execution Procedure
1. Map all personal data flows (patient searches, pharmacy contact details, login credentials).
2. Apply strict data minimization: allow unauthenticated medicine search without recording IP or personal health identifiers.
3. Design DPDP-compliant multilingual consent notices for registered pharmacy operators and consumers.
4. Implement data principal rights mechanisms: right to access, right to correction, right to erasure.
5. Establish data retention limits and safe anonymization routines for search telemetry.

## 6. Safety Constraints & Guardrails
- Never store unnecessary patient identifiable information (PII) alongside searched drug names.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- DPDP Compliance Matrix
- Data Flow Diagram
- Consent Notice Templates

## 8. Validation Checklist
- [ ] Can users search medicines anonymously?
- [ ] Is personal data strictly minimized?
- [ ] Is there a clear data deletion workflow?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
