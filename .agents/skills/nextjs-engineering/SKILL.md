---
name: nextjs-engineering
description: >-
  Builds robust, modern web applications utilizing Next.js App Router, React Server Components, Route Handlers, and Server Actions.
---

# Skill: nextjs-engineering

## 1. Description & Purpose
Builds robust, modern web applications utilizing Next.js App Router, React Server Components, Route Handlers, and Server Actions.

## 2. Scope & Applicability
Next.js App Router directory conventions, SSR/SSG caching strategies, Route Handlers, and production builds.

## 3. When to Use
When developing pages, layouts, server endpoints, or optimizing Next.js build performance.

## 4. Required Inputs
- Next.js project configuration
- Route specifications
- Component designs

## 5. Execution Procedure
1. Organize code within `src/app/` using App Router conventions (`layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`).
2. Maximize React Server Components (RSC) for initial page renders to minimize client bundle weight.
3. Use Route Handlers (`src/app/api/.../route.ts`) with typed Request/Response contracts for backend services.
4. Configure proper Next.js caching and revalidation headers for medicine catalog pages (`revalidate = 3600`).
5. Validate zero build errors via `next build`.

## 6. Safety Constraints & Guardrails
- Never import client-only libraries inside server components or leak server secrets into client components.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Next.js App Router Structure
- Route Handlers
- Production Build Validation

## 8. Validation Checklist
- [ ] Does `npm run build` succeed cleanly?
- [ ] Are server components utilized where client interactivity is unnecessary?
- [ ] Are error and loading boundaries in place?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
