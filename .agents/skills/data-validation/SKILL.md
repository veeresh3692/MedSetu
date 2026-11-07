---
name: data-validation
description: >-
  Designs and executes rigorous data validation pipelines using Zod, database check constraints, and integrity assertions.
---

# Skill: data-validation

## 1. Description & Purpose
Designs and executes rigorous data validation pipelines using Zod, database check constraints, and integrity assertions.

## 2. Scope & Applicability
Runtime input validation, database constraints, price range sanity checks, and data anomaly detection.

## 3. When to Use
When implementing API route handlers, database schemas, or pharmacy CSV upload parsers.

## 4. Required Inputs
- API request schemas
- CSV import formats
- Database table definitions

## 5. Execution Procedure
1. Create Zod schemas for every external payload, query parameter, and CSV record.
2. Enforce domain constraints: prices must be positive numbers (`> 0`), selling price must be `<= MRP`.
3. Implement SQL check constraints (`CHECK (selling_price > 0 AND selling_price <= mrp)`).
4. Validate date and timestamp formats (ISO-8601 UTC).
5. Reject malformed batches with detailed, structured validation error reports.

## 6. Safety Constraints & Guardrails
- Never allow unvalidated inputs to pass into backend services or raw SQL queries.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Zod Validation Schemas
- Database Check Constraints
- CSV Ingestion Validator

## 8. Validation Checklist
- [ ] Is every input field validated at runtime?
- [ ] Are price relationships (price <= MRP) enforced?
- [ ] Are error responses structured and informative?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
