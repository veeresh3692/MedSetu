# MEDICOMPARE INDIA — RELEASE CHECKLIST

This checklist governs the release procedure for any major milestone or production deployment under Gate 10 (Human Release Approval).

---

## 1. Requirements & Architecture Gates (Gates 1 & 2)
- [ ] Task scope aligns directly with approved IEEE SRS and BRD user stories.
- [ ] Requirements Traceability Matrix (RTM) updated with new requirement numbers.
- [ ] Architecture Decision Records (ADRs) authored for any new pattern, library, or dependency.
- [ ] Modular monolith boundaries respected (no circular dependencies or boundary leaks).

## 2. Implementation & Code Quality Gates (Gates 3, 4 & 6)
- [ ] Clean code implementation adhering to project conventions and design system tokens.
- [ ] TypeScript strict mode passes with zero errors (`npm run typecheck` or `npx tsc --noEmit`).
- [ ] ESLint passes with zero errors or warnings (`npm run lint`).
- [ ] Independent code review conducted by a specialist agent different from the implementing author.

## 3. Testing & Verification Gates (Gates 5 & 9)
- [ ] Vitest unit tests pass for all domain services, entity matching, and price calculations.
- [ ] Playwright E2E browser tests pass for all affected user journeys.
- [ ] Negative test cases and boundary conditions (zero price, missing salt, network timeout) verified.
- [ ] Local build passes cleanly without warnings (`npm run build`).

## 4. Security & Privacy Gates (Gate 7)
- [ ] Zero secrets, API keys, or service role credentials committed or bundled into client code.
- [ ] Supabase Row Level Security (RLS) verified active and tested on all affected tables.
- [ ] Zod runtime validation enforced on all incoming Route Handler payloads and query parameters.
- [ ] DPDP privacy compliance verified: zero unconsented PII or patient medical history collected.
- [ ] Mandatory statutory healthcare disclaimers verified on all public-facing screens.

## 5. Documentation & Operations Gates (Gate 8)
- [ ] Documentation in `docs/` updated synchronously with implementation.
- [ ] ERD diagrams and API specification documents updated.
- [ ] `project-state.md` and `task-backlog.md` reflect current progress.
- [ ] Release Notes / Changelog drafted detailing changes, fixes, and migration requirements.

## 6. Final Human Sign-Off (Gate 10 — Level 5)
- [ ] Release candidate demonstrated or presented to the Product Owner.
- [ ] Database migrations reviewed for backward compatibility and non-destructive execution.
- [ ] Product Owner explicit authorization granted to merge and deploy.
