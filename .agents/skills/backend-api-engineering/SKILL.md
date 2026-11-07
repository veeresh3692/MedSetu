---
name: backend-api-engineering
description: >-
  Engineers secure, performant server-side business logic, Route Handlers, search services, and comparison engines.
---

# Skill: backend-api-engineering

## 1. Description & Purpose
Engineers secure, performant server-side business logic, Route Handlers, search services, and comparison engines.

## 2. Scope & Applicability
Server-side logic, price comparison algorithms, pharmacy discovery services, caching, and error resilience.

## 3. When to Use
When implementing backend endpoints, comparison logic, pharmacy inventory management, or geo-queries.

## 4. Required Inputs
- API contracts
- Database access layer
- Business logic specifications

## 5. Execution Procedure
1. Implement business logic services in `src/lib/server/services/` decoupled from HTTP route handlers.
2. Construct the core price comparison engine: retrieve canonical formulation, fetch active pharmacy offers, normalize pack pricing, sort by price and distance.
3. Implement spatial query handling for nearby pharmacies using Haversine formula or PostGIS coordinates.
4. Handle error states gracefully with typed custom errors (`NotFoundError`, `ValidationError`, `UnauthorizedError`).
5. Add comprehensive unit tests covering comparison edge cases and sorting criteria.

## 6. Safety Constraints & Guardrails
- Never execute unparameterized queries. Always enforce authentication and authorization before processing mutations.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Backend Service Modules
- Price Comparison Engine
- Spatial Discovery Service

## 8. Validation Checklist
- [ ] Is business logic isolated from HTTP routing?
- [ ] Are edge cases (0 offers, tied prices, out-of-stock items) handled?
- [ ] Are unit tests passing?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
