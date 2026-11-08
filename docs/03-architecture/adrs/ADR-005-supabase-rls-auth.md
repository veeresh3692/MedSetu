# ADR-005: SUPABASE POSTGRESQL WITH STRICT ROW LEVEL SECURITY (RLS)
**Status:** APPROVED  
**Date:** 2026-11-08  
**Deciders:** Elite AI Orchestrator, AGENT 07 (System Architect), AGENT 11 (Database Engineer)  
**Consulted:** AGENT 10 (Backend Engineer), AGENT 12 (Security Engineer)  

---

## 1. Context & Problem Statement
MediCompare India requires a scalable relational database, secure multi-tenant authentication, and granular access control for:
- Anonymous public consumers searching medicines and pharmacy offers.
- Authenticated retail pharmacy operators managing their own inventory and prices.
- Administrative superusers verifying Form 20/21 drug licenses and curating the master catalog.

Security mandates dictate:
- Tenant isolation: Pharmacy A must NEVER be able to read drafts, edit, or delete Pharmacy B's inventory.
- Zero client-side secret leakage: Supabase `service_role` key must never reach frontend browser bundles.
- DPDP Act compliance: Unauthenticated public search with zero PII harvesting.

What database and authorization architecture should MediCompare India adopt?

---

## 2. Decision
We will use **Supabase Managed PostgreSQL 15+ with Supabase Auth and strict Row Level Security (RLS)**.

Architectural rules:
1. **100% RLS Enforcement**: RLS will be enabled on every table (`ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`). Zero un-gated tables.
2. **Public Read Policies**: Public anon role has `SELECT`-only access on verified public catalog rows (`verification_status = 'PHARMACY_CONFIRMED'`).
3. **Tenant Owner Policies**: Authenticated pharmacy users have `ALL` access to their own records governed by `auth.uid() = pharmacy.owner_id`.
4. **Server-Side Route Handlers for Privileged Operations**: The Supabase `service_role` client is restricted strictly to server-side Route Handlers (`src/app/api/`) with Zod validation and session authorization checks. Frontend client receives only the public `anon` key.

---

## 3. Alternatives Considered

### Alternative 1: Application-Level Authorization (Manual `WHERE user_id = ...` in code)
- *Pros*: Simple to write initially.
- *Cons*: Prone to critical human error; a single omitted `WHERE` clause leaks competitor inventory or sensitive license data; fails defense-in-depth principles.
- *Verdict*: **REJECTED**.

### Alternative 2: Self-Hosted PostgreSQL on VPS / AWS RDS
- *Pros*: Full infrastructure ownership.
- *Cons*: Requires manual patching, connection pooling setup, backup scheduling, and custom JWT auth infrastructure; introduces operational overhead incompatible with solo developer constraints.
- *Verdict*: **REJECTED**.

---

## 4. Consequences

### Positive Consequences
- **Database-Level Defense-in-Depth**: Even if a Route Handler has an authorization bug, the database engine enforces tenant boundaries at the SQL level.
- **Built-in Connection Pooling**: Supavisor connection pooler handles serverless concurrency without exhausting PostgreSQL connections.
- **Auditability**: RLS policies are version-controlled in SQL migration files in `supabase/migrations/`.

### Negative / Trade-off Consequences
- **Local Testing**: Requires running Supabase local CLI (`supabase start`) or dedicated staging database instance for integration tests.
- **Complex Policies**: Joins inside RLS policies (e.g., checking pharmacy ownership across tables) require careful indexing on `owner_id` to avoid query latency degradation.

---

## 5. Compliance & Verification
- Adheres to MediCompare Governance Rule `03-security-privacy-compliance-governance.md` and Risk Register `RSK-05`.
- Verified in Task MC-005 by Agent 07 (System Architect).
