---
name: india-healthcare-compliance
description: >-
  Navigates and enforces Indian pharmaceutical and healthcare laws including the Drugs and Cosmetics Act 1940, Pharmacy Rules, and CDSCO guidelines.
---

# Skill: india-healthcare-compliance

## 1. Description & Purpose
Navigates and enforces Indian pharmaceutical and healthcare laws including the Drugs and Cosmetics Act 1940, Pharmacy Rules, and CDSCO guidelines.

## 2. Scope & Applicability
Retail pharmacy licensing (Form 20/21), Schedule H/H1/X rules, prescription validity requirements, and drug promotion prohibitions.

## 3. When to Use
When designing pharmacy verification workflows, customer disclaimers, prescription handling guidelines, and platform terms.

## 4. Required Inputs
- Drugs and Cosmetics Act, 1940
- Drugs and Cosmetics Rules, 1945
- Pharmacy Practice Regulations
- Draft E-Pharmacy Rules

## 5. Execution Procedure
1. Analyze statutory constraints governing retail sale of drugs in India (licensing under Forms 20, 20B, 21, 21B).
2. Ensure platform does not solicit or execute unauthorized direct sales of prescription medicines.
3. Formulate strict verification checklists for pharmacy Drug License numbers and pharmacist registration.
4. Enforce mandatory disclaimers regarding Schedule H, H1, and X medications requiring valid physical doctor prescriptions.
5. Audit all platform messaging to ensure no prohibited therapeutic claims or medical advice are offered.

## 6. Safety Constraints & Guardrails
- Always state that compliance reviews represent technical compliance frameworks and require qualified Indian legal counsel before commercial launch.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Pharmacy Compliance Checklist
- Regulatory Boundary Report
- Mandatory Disclaimers Package

## 8. Validation Checklist
- [ ] Are drug license form requirements accurate?
- [ ] Are Schedule H/H1 warnings embedded in UI requirements?
- [ ] Is medical advice strictly disclaimed?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
