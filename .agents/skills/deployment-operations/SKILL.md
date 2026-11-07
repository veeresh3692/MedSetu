---
name: deployment-operations
description: >-
  Manages deployment operations, Vercel production environments, Supabase database hosting, and environment configuration.
---

# Skill: deployment-operations

## 1. Description & Purpose
Manages deployment operations, Vercel production environments, Supabase database hosting, and environment configuration.

## 2. Scope & Applicability
Deployment procedures, environment variable governance, DNS/domain mapping, rollbacks, and health checks.

## 3. When to Use
When preparing release deployments, provisioning environments, or troubleshooting runtime deployment issues.

## 4. Required Inputs
- Hosting platforms (Vercel, Supabase)
- Environment variable specifications
- Release artifacts

## 5. Execution Procedure
1. Establish deployment environments: Local Development, Staging (preview branches), and Production (`main`).
2. Maintain strict environment variable documentation in `.env.example` with zero real secrets.
3. Configure Vercel project settings, build commands (`next build`), and preview deployment integrations.
4. Manage Supabase database migrations using Supabase CLI (`supabase db push` / `supabase migration up`).
5. Implement health check endpoint (`/api/health`) and verify zero downtime deployments.

## 6. Safety Constraints & Guardrails
- Production deployments (Level 5) strictly require explicit Product Owner approval. Never deploy unreviewed branches.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Deployment Runbook
- Environment Variable Specification
- Release Health Check Procedure

## 8. Validation Checklist
- [ ] Is `.env.example` complete and up-to-date?
- [ ] Are preview deployments automated for PRs?
- [ ] Is rollback procedure documented?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
