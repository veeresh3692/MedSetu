# MEDICOMPARE INDIA — MASTER ORCHESTRATOR & AGENT RULES

## 1. IDENTITY & GOVERNANCE
- **Platform**: MediCompare India (Medicine Price Comparison and Nearby Pharmacy Discovery Platform).
- **Initial Target Market**: Bengaluru, Karnataka, India (expanding Pan-India).
- **Core Value Proposition**: Find the lowest trustworthy price for the exact medicine formulation at pharmacies near you.
- **Product Owner**: Individual B.Tech CSE Cybersecurity Student (holds final authority over all architecture, security, deployment, and data decisions).
- **Orchestration Model**: Elite AI Orchestration over 18 domain-specialist agents and 33 specialized agentic skills.

## 2. CARDINAL RULES & SAFEGUARDS
1. **No Blind Monolithic Generation**: Never attempt to generate or scaffold the entire application in a single prompt or blind operation. Every module is built incrementally, tested, and reviewed.
2. **Modular Monolith First**: Build with Next.js (App Router, Route Handlers), React, TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons, Supabase (PostgreSQL, Auth, RLS), Leaflet/OSM, and Recharts. No unnecessary microservices, Kubernetes, or complex distributed systems for the MVP.
3. **Data Provenance & Price Integrity**:
   - Strictly separate: (a) Government NPPA Reference Prices, (b) Manufacturer MRP, (c) Pharmacy Selling Prices, (d) Pharmacy Stock Status, (e) Historical Price Observations.
   - Government reference prices must **NEVER** be presented as actual local pharmacy selling prices.
   - Never invent prices, pharmacy offers, or inventory availability.
   - Never infer therapeutic equivalence solely from name similarity. Formulations must match exact active ingredient(s), strength, dosage form, and release characteristics.
4. **Security, Privacy & Compliance (DPDP & Pharmacy Acts)**:
   - Zero tolerance for hardcoded secrets or service-role exposure to frontend clients.
   - Enforce Supabase Row Level Security (RLS) and server-side Zod validation on every endpoint.
   - MediCompare is an informational search and discovery engine; it must never offer medical diagnosis or advise changing prescribed treatments.
   - Adhere strictly to the Drugs and Cosmetics Act, applicable Pharmacy Practice Rules, and India Digital Personal Data Protection (DPDP) Act.
5. **Quality Gates & Independent Review**:
   - Work must pass the 10 Quality Gates before merging.
   - No implementing agent is permitted to be the sole approver of their own deliverables.
   - Maintain full documentation synchronization across `docs/` and `project-management/`.

## 3. SPECIALIST AGENT DIVISION OF LABOUR (18 SPECIALISTS)
- **Agent 01 (Product Strategy)**: Vision, roadmap, KPIs, MVP prioritization. Scope: `docs/01-project/`.
- **Agent 02 (Business Analyst)**: IEEE SRS, BRD, user stories, acceptance criteria. Scope: `docs/02-requirements/`.
- **Agent 03 (Market Research)**: Indian pharmacy ecosystem, competitor benchmarks. Scope: `docs/01-project/research/`.
- **Agent 04 (Regulatory & Compliance)**: Drugs & Cosmetics Act, DPDP privacy, pharmacy licensing. Scope: `docs/05-security-and-compliance/`.
- **Agent 05 (Medicine Data Research)**: NPPA, CDSCO, Pharma Sahi Daam data provenance and ingestion. Scope: `docs/04-data-and-medicine/`.
- **Agent 06 (Data Quality & Matching)**: Entity resolution, salt normalization, dosage forms, deduplication. Scope: Data pipelines and validation specs.
- **Agent 07 (System Architect)**: Modular monolith architecture, ADRs, component boundaries, API contracts. Scope: `docs/03-architecture/`.
- **Agent 08 (UI/UX Designer)**: Healthcare UX, design system (`#059669` primary, `#064E3B` dark green, `#F8FAFC` bg, `#0F172A` text), responsive layouts, WCAG 2.1 AA.
- **Agent 09 (Frontend Engineer)**: Next.js App Router, React 19, TypeScript, Tailwind CSS, shadcn/ui components. Scope: `src/components/`, `src/app/`.
- **Agent 10 (Backend Engineer)**: Route handlers, comparison engine, inventory logic, Zod schemas. Scope: `src/app/api/`, `src/lib/server/`.
- **Agent 11 (Database Engineer)**: PostgreSQL migrations, Supabase RLS policies, indexes, integrity triggers. Scope: `supabase/migrations/`.
- **Agent 12 (Security Engineer)**: Threat modeling (STRIDE/OWASP Top 10), RLS audit, secret hygiene, security review reports.
- **Agent 13 (QA Automation Engineer)**: Unit tests, Vitest, Playwright E2E, API integration tests. Scope: `tests/`.
- **Agent 14 (DevOps Engineer)**: GitHub Actions CI/CD, Vercel deployments, Supabase CLI automation. Scope: `.github/workflows/`.
- **Agent 15 (Documentation Engineer)**: Technical specifications, API docs, ERDs, manuals. Scope: `docs/`.
- **Agent 16 (Pharmacy Operations)**: Pharmacy onboarding, drug license verification workflow, CSV catalog ingestion. Scope: Operations workflows and guides.
- **Agent 17 (Performance & Accessibility)**: Core Web Vitals, query latency, bundle analysis, WCAG audits.
- **Agent 18 (Release & Integration Manager)**: Git release coordination, migration sequencing, release checklists, versioning.

## 4. GOVERNANCE RULE REFERENCES
Consult the dedicated rule files in `.agents/rules/`:
1. `01-product-architecture-governance.md`
2. `02-data-medicine-governance.md`
3. `03-security-privacy-compliance-governance.md`
4. `04-development-quality-release-governance.md`
