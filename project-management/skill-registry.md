# MEDICOMPARE INDIA — SPECIALIZED SKILL REGISTRY

This registry catalogues all 33 specialized agentic skills developed and verified for MediCompare India. Each skill is physically implemented with standardized frontmatter and instructions in `.agents/skills/<skill-name>/SKILL.md`.

---

## 33 Specialized Skills Catalog

| ID | Skill Name | Primary Purpose | Associated Agents | Physical Location | Discovery Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SK-01** | `product-discovery` | Validates healthcare consumer pain points and user personas | Agent 01 | `.agents/skills/product-discovery/SKILL.md` | Verified |
| **SK-02** | `mvp-prioritization` | Prioritizes features via MoSCoW and RICE frameworks | Agent 01 | `.agents/skills/mvp-prioritization/SKILL.md` | Verified |
| **SK-03** | `ieee-srs-engineering` | Authors IEEE Std 830 / 29148 compliant software specifications | Agent 02, Agent 15 | `.agents/skills/ieee-srs-engineering/SKILL.md` | Verified |
| **SK-04** | `requirements-traceability` | Maintains bidirectional traceability matrix (RTM) | Agent 02, Agent 18 | `.agents/skills/requirements-traceability/SKILL.md` | Verified |
| **SK-05** | `market-intelligence` | Researches Indian retail pharmacy structure & margins | Agent 01, Agent 03 | `.agents/skills/market-intelligence/SKILL.md` | Verified |
| **SK-06** | `competitor-analysis` | Evaluates 1mg, Pharmeasy, Apollo, Jan Aushadhi vs MediCompare | Agent 01, Agent 03 | `.agents/skills/competitor-analysis/SKILL.md` | Verified |
| **SK-07** | `india-healthcare-compliance` | Enforces Drugs & Cosmetics Act, Form 20/21 licenses | Agent 04, Agent 16 | `.agents/skills/india-healthcare-compliance/SKILL.md` | Verified |
| **SK-08** | `dpdp-privacy-assessment` | Assesses data protection impact under India DPDP Act 2023 | Agent 04, Agent 12 | `.agents/skills/dpdp-privacy-assessment/SKILL.md` | Verified |
| **SK-09** | `nppa-data-research` | Analyzes NPPA gazettes, NLEM lists & ceiling prices | Agent 05 | `.agents/skills/nppa-data-research/SKILL.md` | Verified |
| **SK-10** | `medicine-data-provenance` | Tracks immutable data source, observation & retrieval times | Agent 05 | `.agents/skills/medicine-data-provenance/SKILL.md` | Verified |
| **SK-11** | `medicine-entity-resolution` | Resolves messy brand names, strengths, and generic salts | Agent 06 | `.agents/skills/medicine-entity-resolution/SKILL.md` | Verified |
| **SK-12** | `formulation-matching` | Clinically matches active ingredients, salts & release profiles | Agent 06 | `.agents/skills/formulation-matching/SKILL.md` | Verified |
| **SK-13** | `data-validation` | Implements Zod validation and SQL check constraints | Agent 02, Agent 06, Agent 10 | `.agents/skills/data-validation/SKILL.md` | Verified |
| **SK-14** | `system-architecture` | Designs modular monolith, component boundaries, and ADRs | Agent 07 | `.agents/skills/system-architecture/SKILL.md` | Verified |
| **SK-15** | `api-contract-design` | Designs OpenAPI specs, Route Handlers & Zod contracts | Agent 07, Agent 10 | `.agents/skills/api-contract-design/SKILL.md` | Verified |
| **SK-16** | `healthcare-ui-ux` | Designs accessible healthcare UX and MediCompare design system | Agent 08 | `.agents/skills/healthcare-ui-ux/SKILL.md` | Verified |
| **SK-17** | `responsive-design` | Creates mobile-first Tailwind layouts for viewports 360px+ | Agent 08, Agent 09 | `.agents/skills/responsive-design/SKILL.md` | Verified |
| **SK-18** | `nextjs-engineering` | Develops Next.js App Router, Server Components & Route Handlers | Agent 09 | `.agents/skills/nextjs-engineering/SKILL.md` | Verified |
| **SK-19** | `react-architecture` | Builds modular React components, hooks, and shadcn/ui integration | Agent 09 | `.agents/skills/react-architecture/SKILL.md` | Verified |
| **SK-20** | `backend-api-engineering` | Implements server-side comparison engine & search endpoints | Agent 10 | `.agents/skills/backend-api-engineering/SKILL.md` | Verified |
| **SK-21** | `postgres-database-engineering` | Authors PostgreSQL migrations, relational schema & indexes | Agent 11 | `.agents/skills/postgres-database-engineering/SKILL.md` | Verified |
| **SK-22** | `supabase-rls-engineering` | Implements Supabase Row Level Security & tenant policies | Agent 11 | `.agents/skills/supabase-rls-engineering/SKILL.md` | Verified |
| **SK-23** | `secure-code-review` | Performs OWASP Top 10 security audits & secret scanning | Agent 12 | `.agents/skills/secure-code-review/SKILL.md` | Verified |
| **SK-24** | `threat-modelling` | Conducts STRIDE threat modeling and mitigation engineering | Agent 12 | `.agents/skills/threat-modelling/SKILL.md` | Verified |
| **SK-25** | `test-driven-development` | Implements Vitest unit & integration test suites | Agent 13 | `.agents/skills/test-driven-development/SKILL.md` | Verified |
| **SK-26** | `playwright-testing` | Develops E2E browser test automation for patient journeys | Agent 13 | `.agents/skills/playwright-testing/SKILL.md` | Verified |
| **SK-27** | `github-ci-cd` | Automates GitHub Actions workflows for lint, test, and build | Agent 14 | `.agents/skills/github-ci-cd/SKILL.md` | Verified |
| **SK-28** | `deployment-operations` | Governs Vercel production hosting & Supabase deployments | Agent 14 | `.agents/skills/deployment-operations/SKILL.md` | Verified |
| **SK-29** | `technical-documentation` | Maintains formal technical specs, ERDs, and user manuals | Agent 15 | `.agents/skills/technical-documentation/SKILL.md` | Verified |
| **SK-30** | `pharmacy-onboarding` | Manages pharmacy registration, drug license verification & CSVs | Agent 16 | `.agents/skills/pharmacy-onboarding/SKILL.md` | Verified |
| **SK-31** | `performance-optimization` | Optimizes Core Web Vitals, query latency & bundle sizes | Agent 17 | `.agents/skills/performance-optimization/SKILL.md` | Verified |
| **SK-32** | `wcag-accessibility` | Audits and enforces WCAG 2.1 AA accessibility standards | Agent 08, Agent 17 | `.agents/skills/wcag-accessibility/SKILL.md` | Verified |
| **SK-33** | `release-management` | Coordinates release checklists, migration sequencing & tags | Agent 18 | `.agents/skills/release-management/SKILL.md` | Verified |

---

## Skill Architecture Notes
- All skills are stored under `.agents/skills/<skill_name>/SKILL.md` with YAML frontmatter conforming to Antigravity's progressive disclosure customization engine.
- A directory junction `.agentsskills` links to `.agents/skills` to guarantee cross-tool path compatibility.
- An explicit manifest `.agents/skills.json` is registered to guarantee detection.
