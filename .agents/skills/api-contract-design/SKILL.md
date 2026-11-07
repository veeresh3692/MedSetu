---
name: api-contract-design
description: >-
  Designs clean, type-safe, RESTful Next.js Route Handler API contracts with OpenAPI specifications and Zod definitions.
---

# Skill: api-contract-design

## 1. Description & Purpose
Designs clean, type-safe, RESTful Next.js Route Handler API contracts with OpenAPI specifications and Zod definitions.

## 2. Scope & Applicability
API endpoint design, HTTP methods, status codes, request/response schemas, error contracts, and API documentation.

## 3. When to Use
When designing or updating backend endpoints for search, comparison, pharmacy inventory, or admin functions.

## 4. Required Inputs
- Functional requirements
- Domain data models
- Frontend consumption needs

## 5. Execution Procedure
1. Design RESTful resource endpoints (e.g., `GET /api/v1/medicines/search`, `POST /api/v1/pharmacies/inventory`).
2. Define Zod input schemas (`z.object({...})`) and inferred TypeScript types for all requests and responses.
3. Standardize API envelope format: `{ success: true, data: ..., error: null }` and `{ success: false, data: null, error: { code, message, details } }`.
4. Specify HTTP status codes accurately (200, 201, 400, 401, 403, 404, 422, 500).
5. Document API contracts with OpenAPI 3.1 specifications and example payloads.

## 6. Safety Constraints & Guardrails
- Never expose internal database column names, raw error stack traces, or privileged user IDs in public API responses.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- OpenAPI Specification
- Shared TypeScript Type Definitions
- Standardized Error Contracts

## 8. Validation Checklist
- [ ] Are all endpoints documented with request/response schemas?
- [ ] Is the error contract consistent across all routes?
- [ ] Are sensitive internal fields stripped?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
