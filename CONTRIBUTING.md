# CONTRIBUTING TO MEDICOMPARE INDIA

Thank you for contributing to **MediCompare India**! We welcome contributions that improve medicine transparency, patient accessibility, and data integrity.

---

## 1. Code of Conduct & Non-Dispensing Boundary
- MediCompare is strictly an informational search and discovery platform. We do not sell, dispense, compound, or courier medications.
- Never introduce features that simulate medical diagnosis, treatment alterations, or direct prescription drug ordering.
- Strictly adhere to the Indian **Drugs and Cosmetics Act, 1940** and the **Digital Personal Data Protection (DPDP) Act, 2023**.

---

## 2. Conventional Commits
All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat(<scope>): description` — New feature or endpoint
- `fix(<scope>): description` — Bug fix
- `docs(<scope>): description` — Documentation updates
- `test(<scope>): description` — Adding or updating test cases
- `security(<scope>): description` — Security fixes, RLS hardening, vulnerability patches
- `refactor(<scope>): description` — Code refactoring without behavioral change
- `chore(<scope>): description` — Tooling, dependency, or configuration updates

Examples:
- `feat(matching): implement release profile safety lock for sustained release formulations`
- `security(rls): prevent client-side user role modification on profiles`
- `docs(nppa): publish dpco 2013 ceiling price specification`

---

## 3. Branching Strategy
- `main`: Production-ready, stable, protected branch. Deploys to Vercel production.
- `develop`: Integration branch where tested feature branches converge.
- `feature/<ticket>-<slug>`: Dedicated branch for an individual task.
- `bugfix/<ticket>-<slug>`: Bug fixes targeting `develop`.
- `hotfix/<ticket>-<slug>`: Emergency patches branching from `main`.

---

## 4. The 10 Quality Gates Checklist
Before submitting a pull request, ensure your branch passes all applicable quality gates:

- [ ] **Gate 1 — Requirements Review**: Alignment with IEEE Std 830 SRS (`DOC-SRS-001`).
- [ ] **Gate 2 — Architecture Review**: Compliance with modular monolith ADRs and boundary rules.
- [ ] **Gate 3 — Implementation Review**: Strict TypeScript typing, modular server-side logic.
- [ ] **Gate 4 — Lint & Type Checks**: Zero compiler errors (`npx tsc --noEmit`).
- [ ] **Gate 5 — Unit & Integration Tests**: High test coverage via Vitest (`npm run test`).
- [ ] **Gate 6 — Independent Code Review**: Peer review by an agent distinct from the implementing author.
- [ ] **Gate 7 — Security Review**: Threat model check, OWASP validation, Supabase RLS leak audit.
- [ ] **Gate 8 — Documentation Review**: Architecture diagrams, API specs, and ERDs updated synchronously.
- [ ] **Gate 9 — Integration Review**: End-to-end user flows pass in local environment without regressions.
- [ ] **Gate 10 — Release Approval**: Product Owner authorization before merging to `main`.

---

## 5. Security & Secret Hygiene
- **ZERO TOLERANCE** for hardcoded secrets or committing `.env` files.
- The Supabase `service_role` key must **NEVER** be exposed to frontend client code or prefixed with `NEXT_PUBLIC_`.
- Always validate incoming Route Handler inputs using strict `zod` schemas.

