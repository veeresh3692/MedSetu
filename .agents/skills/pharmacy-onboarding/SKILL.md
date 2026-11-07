---
name: pharmacy-onboarding
description: >-
  Designs and manages the pharmacy onboarding, drug license verification, catalog ingestion, and operational compliance workflows.
---

# Skill: pharmacy-onboarding

## 1. Description & Purpose
Designs and manages the pharmacy onboarding, drug license verification, catalog ingestion, and operational compliance workflows.

## 2. Scope & Applicability
Pharmacy onboarding workflows, license verification standards (Form 20/21), store profile management, and CSV inventory import.

## 3. When to Use
When developing or auditing the pharmacy registration portal, license verification queues, or inventory import features.

## 4. Required Inputs
- Pharmacy regulatory rules
- CSV template formats
- Store metadata requirements

## 5. Execution Procedure
1. Design multi-step onboarding workflow: Pharmacy Business Details -> Drug License Upload (Form 20/21) -> Pharmacist Registration -> Operating Hours & Geolocation.
2. Build admin verification queue: verify license numbers against state drug control registers, record approval/rejection audit trail.
3. Design standard pharmacy CSV inventory template (columns: `brand_name`, `salt_composition`, `strength`, `pack_size`, `mrp`, `selling_price`, `stock_status`).
4. Implement batch CSV parser with per-row validation and error feedback.
5. Create pharmacy operational manual detailing catalog management and price update expectations.

## 6. Safety Constraints & Guardrails
- Unverified pharmacies must remain in `PENDING_VERIFICATION` status and CANNOT display offers publicly.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Pharmacy Onboarding Specification
- CSV Import Template
- Admin Verification SOP

## 8. Validation Checklist
- [ ] Are drug license fields mandatory?
- [ ] Are unverified pharmacies prevented from public listing?
- [ ] Is CSV error reporting clear and actionable?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
