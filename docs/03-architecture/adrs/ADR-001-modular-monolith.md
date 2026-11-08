# ADR-001: MODULAR MONOLITH OVER MICROSERVICES
**Status:** APPROVED  
**Date:** 2026-11-08  
**Deciders:** Elite AI Orchestrator, AGENT 07 (System Architect), Product Owner  
**Consulted:** AGENT 10 (Backend Engineer), AGENT 11 (Database Engineer), AGENT 14 (DevOps Engineer)  

---

## 1. Context & Problem Statement
MediCompare India is launching its medicine price comparison and nearby pharmacy discovery platform starting in Bengaluru, Karnataka, with planned Pan-India scaling. The Product Owner is an individual B.Tech CSE Cybersecurity student acting as solo developer.

The system requires:
- Rapid development velocity and fast feedback loops.
- End-to-end TypeScript type safety across frontend, API routes, and database models.
- Minimal operational overhead (zero complex orchestration, zero multi-cloud subscriptions).
- High performance (search latency < 300ms, DB query latency < 150ms).

Should MediCompare India be partitioned into microservices (e.g., Search Service, Auth Service, Pricing Service, Geo Service) or structured as a disciplined Modular Monolith?

---

## 2. Decision
We will build MediCompare India as a **Disciplined Modular Monolith** using **Next.js (App Router, Server Components, Route Handlers), React 19, TypeScript, Tailwind CSS, shadcn/ui, and Supabase PostgreSQL**.

Logical module boundaries will be strictly enforced through internal directory structures (`src/lib/server/services/`, `src/lib/matching/`, `src/lib/validations/`) and TypeScript interface contracts rather than network boundaries.

---

## 3. Alternatives Considered

### Alternative 1: Microservices Architecture (Node/Express or Go Microservices + Kafka + Kubernetes)
- *Pros*: Independent service deployment, polyglot capability.
- *Cons*: Severe distributed system complexity, network latency between services, distributed transaction overhead, high cloud infrastructure costs, impossible for a solo developer to maintain reliably.
- *Verdict*: **REJECTED**.

### Alternative 2: Traditional Separate Frontend (Vite/React) + Backend (Express/NestJS)
- *Pros*: Clear physical decoupling of frontend and backend repos.
- *Cons*: Duplicated type definitions, CORS configuration friction, two deployment targets, slower developer iteration.
- *Verdict*: **REJECTED**.

---

## 4. Consequences

### Positive Consequences
- **Single Unified Codebase**: End-to-end TypeScript strict typing from database models to frontend components.
- **Zero Inter-Service Latency**: Internal service calls are in-process function executions, avoiding HTTP serialization/deserialization.
- **Solo Developer Maintainability**: One command (`npm run dev`) launches the entire platform locally.
- **Cost Efficiency**: Deploys seamlessly on standard Vercel serverless compute and Supabase managed database tiers without Kubernetes or container cluster costs.

### Negative / Trade-off Consequences
- **Discipline Required**: Without physical network boundaries, developers must resist the temptation to couple modules tightly or bypass domain service abstractions.
- **Shared Compute**: Heavy computational tasks (such as massive CSV batch parsing) must be throttled or chunked to prevent blocking serverless execution limits.

---

## 5. Compliance & Verification
- Adheres to MediCompare Governance Rule `01-product-architecture-governance.md`.
- Verified in Task MC-005 by Agent 07 (System Architect).
