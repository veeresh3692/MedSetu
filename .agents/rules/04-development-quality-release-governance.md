# GOVERNANCE RULE 04: DEVELOPMENT, QUALITY & RELEASE GOVERNANCE

## 1. Incremental Workflow Cadence
Development must proceed strictly through iterative, verifiable cycles:
1. **Inspect**: Examine existing codebase, schema, and current task state.
2. **Understand**: Clarify requirements, constraints, and dependencies.
3. **Plan**: Formulate structured task contract and test criteria.
4. **Select Agents**: Identify primary specialist agent and independent review agent.
5. **Select Skills**: Select verified domain skills from `.agents/skills/`.
6. **Delegate**: Assign task with inputs, bounds, and deliverables.
7. **Implement**: Code the minimum viable change adhering to standards.
8. **Test**: Execute unit, integration, or automated tests; verify edge cases.
9. **Review**: Conduct independent peer review and security inspection.
10. **Integrate**: Merge cleanly without regressions or merge conflicts.
11. **Document**: Update technical documentation in `docs/` and project state in `project-management/`.
12. **Update Project State**: Move task from IN_PROGRESS -> REVIEW -> APPROVED -> MERGED.
13. **Report**: Deliver concise, evidence-grounded summary to the Product Owner.

## 2. The 10 Quality Gates
Every non-trivial pull request / feature increment must pass all applicable quality gates:
- **GATE 1 — Requirements Review**: Alignment with IEEE SRS and product acceptance criteria.
- **GATE 2 — Architecture Review**: Compliance with modular monolith ADRs and boundary rules.
- **GATE 3 — Implementation Review**: Code clarity, modularity, error handling, and TypeScript strict typing.
- **GATE 4 — Lint & Type Checks**: Zero TypeScript compiler errors (`tsc --noEmit`), ESLint passing without errors.
- **GATE 5 — Unit & Integration Tests**: High test coverage on business logic (formulation matching, price calculation, RLS).
- **GATE 6 — Independent Code Review**: Peer review by an agent distinct from the implementing author.
- **GATE 7 — Security Review**: Threat model check, OWASP validation, RLS leak check, secret hygiene confirmation.
- **GATE 8 — Documentation Review**: Architecture diagrams, API specs, and ERDs updated synchronously with code.
- **GATE 9 — Integration Review**: End-to-end flow passes in local/staging environment without regressions.
- **GATE 10 — Human Release Approval**: Explicit sign-off by the Product Owner before merging to `main` or deploying.

*Rule: No implementing agent is permitted to be the sole approver of its own work.*

## 3. Git & Branching Strategy
- **Branch Hierarchy**:
  - `main`: Production-ready, stable, protected branch. Deploys to Vercel production.
  - `develop`: Integration branch where tested feature branches converge.
  - `feature/<ticket>-<slug>`: Dedicated branch for an individual task.
  - `bugfix/<ticket>-<slug>`: Bug fixes targeting develop.
  - `hotfix/<ticket>-<slug>`: Emergency fixes branching from main.
- **Conventional Commits**:
  - `feat(<scope>): description`
  - `fix(<scope>): description`
  - `docs(<scope>): description`
  - `test(<scope>): description`
  - `refactor(<scope>): description`
  - `chore(<scope>): description`
  - `security(<scope>): description`

## 4. Human Autonomy Levels
- **LEVEL 0**: Observe and research only.
- **LEVEL 1**: Formulate plan and draft task contracts.
- **LEVEL 2**: Implement approved scope within designated files.
- **LEVEL 3**: Execute tests and run quality checks.
- **LEVEL 4**: Prepare integration diff and release checklist.
- **LEVEL 5**: Production release (strictly requires Product Owner sign-off).

*Mandatory Human Escalation*:
Any architectural change, destructive database migration, external subscription cost, real patient data integration, or production deployment requires explicit Product Owner authorization.
