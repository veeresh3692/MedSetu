---
name: react-architecture
description: >-
  Designs maintainable React component hierarchies, custom hooks, state management, and design system component composition.
---

# Skill: react-architecture

## 1. Description & Purpose
Designs maintainable React component hierarchies, custom hooks, state management, and design system component composition.

## 2. Scope & Applicability
Component modularity, shadcn/ui integration, custom hooks, context providers, and re-render optimization.

## 3. When to Use
When structuring frontend component trees, managing client state, or implementing UI interactions.

## 4. Required Inputs
- UI design requirements
- State flow specifications
- Design system primitives

## 5. Execution Procedure
1. Structure components into atomic hierarchy: `ui/` (primitives), `modules/` (domain-specific cards/tables), `layouts/` (shell).
2. Integrate shadcn/ui primitives (Button, Dialog, Dropdown, Table, Input, Card) customized with brand tokens.
3. Encapsulate business logic into reusable custom hooks (e.g., `useMedicineSearch`, `useGeolocation`, `usePriceComparison`).
4. Optimize state management: use local component state for UI toggles, URL query params for search filters, and server fetch for data.
5. Prevent unnecessary re-renders using `useMemo`, `useCallback`, and clean dependency arrays.

## 6. Safety Constraints & Guardrails
- Avoid storing large server datasets in complex global client state stores when URL or server components suffice.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Component Architecture Tree
- Custom React Hooks
- shadcn/ui Component Setup

## 8. Validation Checklist
- [ ] Are components decoupled and single-responsibility?
- [ ] Are search filters synchronized with URL search params?
- [ ] Are prop types strictly typed with TypeScript?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
