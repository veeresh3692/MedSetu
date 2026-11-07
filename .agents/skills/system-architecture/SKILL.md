---
name: system-architecture
description: >-
  Architects the modular monolith for MediCompare India, establishing component boundaries, ADRs, and clean interface contracts.
---

# Skill: system-architecture

## 1. Description & Purpose
Architects the modular monolith for MediCompare India, establishing component boundaries, ADRs, and clean interface contracts.

## 2. Scope & Applicability
System modularity, Next.js architecture, layer decoupling, Supabase integration patterns, and architectural decision records.

## 3. When to Use
When designing system components, making major technical trade-offs, or reviewing boundary violations.

## 4. Required Inputs
- System requirements
- Tech stack constraints
- Performance targets

## 5. Execution Procedure
1. Define modular monolithic architecture boundaries: Core Catalog, Search & Comparison, Pharmacy Portal, Geolocation, Admin.
2. Establish Architecture Decision Records (ADRs) with Context, Decision, Consequences, and Alternatives Considered.
3. Create visual architecture diagrams using Mermaid (Context, Container, and Component levels).
4. Define strict dependency directions: UI -> Application Services -> Domain Models -> Data Access.
5. Audit imports to prevent circular dependencies or domain leakage into UI.

## 6. Safety Constraints & Guardrails
- Resist premature microservice decomposition. Maintain simplicity, fast development velocity, and low operational overhead.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Modular Monolith Architecture Spec
- Mermaid Architecture Diagrams
- ADR Repository

## 8. Validation Checklist
- [ ] Are component boundaries clearly documented?
- [ ] Are ADRs authored for major technical choices?
- [ ] Is the architecture maintainable by a solo developer?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
