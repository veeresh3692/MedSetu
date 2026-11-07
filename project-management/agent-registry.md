# MEDICOMPARE INDIA — SPECIALIST AGENT REGISTRY

This registry defines the 18 specialist agents comprising the MediCompare India engineering organization, their assigned domain skills, operational boundaries, and quality gate roles.

---

## Agent Directory & Skill Matrix

| ID | Agent Title | Primary Domain | Assigned Skills | File & Workspace Scope | Gate Review Roles |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AGENT 01** | **Product Strategy** | Product Vision & Roadmap | `product-discovery`, `mvp-prioritization`, `market-intelligence`, `competitor-analysis` | `docs/01-project/` | Gate 1 (Reqs) |
| **AGENT 02** | **Business Analyst** | Requirements & Traceability | `ieee-srs-engineering`, `requirements-traceability`, `data-validation` | `docs/02-requirements/` | Gate 1 (Reqs), Gate 8 (Docs) |
| **AGENT 03** | **Market Research** | Pharmacy Industry Intelligence | `market-intelligence`, `competitor-analysis` | `docs/01-project/research/` | Gate 1 (Reqs) |
| **AGENT 04** | **Regulatory & Compliance** | Drugs & Cosmetics, DPDP | `india-healthcare-compliance`, `dpdp-privacy-assessment` | `docs/05-security-and-compliance/` | Gate 7 (Security/Compliance) |
| **AGENT 05** | **Medicine Data Research** | NPPA, CDSCO & Provenance | `nppa-data-research`, `medicine-data-provenance` | `docs/04-data-and-medicine/` | Gate 2 (Architecture/Data) |
| **AGENT 06** | **Data Quality & Matching** | Entity Resolution & Salts | `medicine-entity-resolution`, `formulation-matching`, `data-validation` | `src/lib/matching/`, `docs/04-data-and-medicine/` | Gate 3 (Impl), Gate 5 (Tests) |
| **AGENT 07** | **System Architect** | Modular Monolith & ADRs | `system-architecture`, `api-contract-design` | `docs/03-architecture/` | Gate 2 (Architecture) |
| **AGENT 08** | **UI/UX Designer** | Healthcare Design System | `healthcare-ui-ux`, `responsive-design`, `wcag-accessibility` | `docs/03-architecture/ui-ux/`, UI design tokens | Gate 1 (Reqs), Gate 8 (Docs) |
| **AGENT 09** | **Frontend Engineer** | Next.js, React, Tailwind | `nextjs-engineering`, `react-architecture`, `responsive-design` | `src/components/`, `src/app/` (pages/layouts) | Gate 3 (Impl), Gate 4 (Lint/Type) |
| **AGENT 10** | **Backend Engineer** | Route Handlers & Engines | `backend-api-engineering`, `api-contract-design`, `data-validation` | `src/app/api/`, `src/lib/server/` | Gate 3 (Impl), Gate 4 (Lint/Type) |
| **AGENT 11** | **Database Engineer** | PostgreSQL, Supabase RLS | `postgres-database-engineering`, `supabase-rls-engineering` | `supabase/migrations/`, schema definitions | Gate 2 (Arch), Gate 7 (Security) |
| **AGENT 12** | **Security Engineer** | Threat Modeling & AppSec | `threat-modelling`, `secure-code-review`, `dpdp-privacy-assessment` | `docs/05-security-and-compliance/`, security audits | Gate 7 (Security Review) |
| **AGENT 13** | **QA Automation Engineer** | Vitest, Playwright, E2E | `test-driven-development`, `playwright-testing` | `tests/`, test configs, fixtures | Gate 5 (Tests), Gate 9 (Integration) |
| **AGENT 14** | **DevOps Engineer** | CI/CD, Vercel & Deployments | `github-ci-cd`, `deployment-operations` | `.github/workflows/`, deploy configs | Gate 9 (Integration) |
| **AGENT 15** | **Documentation Engineer** | Technical Specs & Manuals | `technical-documentation`, `ieee-srs-engineering` | `docs/` | Gate 8 (Documentation) |
| **AGENT 16** | **Pharmacy Operations** | Onboarding & CSV Workflows | `pharmacy-onboarding`, `india-healthcare-compliance` | Operations manuals, onboarding specs | Gate 1 (Reqs), Gate 8 (Docs) |
| **AGENT 17** | **Performance & Accessibility** | Core Web Vitals & WCAG | `performance-optimization`, `wcag-accessibility` | Performance audit reports, accessibility reviews | Gate 4 (Checks), Gate 9 (Integration) |
| **AGENT 18** | **Release & Integration Mgr** | Git Releases & Migrations | `release-management`, `requirements-traceability` | Release checklists, changelogs, migration sequence | Gate 9 (Integration), Gate 10 (Prep) |

---

## Operational Safeguards
1. **Least-Privilege Enforcement**: No specialist agent may modify files outside its assigned workspace scope.
2. **Independent Review Mandate**: An agent cannot review or approve its own code or documentation deliverables.
3. **Product Owner Supremacy**: The Product Owner (B.Tech CSE Cybersecurity student) holds final release authority (Level 5) and approves all major architectural, database, and credential changes.
