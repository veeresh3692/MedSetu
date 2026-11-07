---
name: supabase-rls-engineering
description: >-
  Architects and verifies Supabase Row Level Security (RLS) policies, role-based access control, and tenant isolation.
---

# Skill: supabase-rls-engineering

## 1. Description & Purpose
Architects and verifies Supabase Row Level Security (RLS) policies, role-based access control, and tenant isolation.

## 2. Scope & Applicability
RLS policies, Supabase Auth claims, tenant security, role separation, and policy penetration testing.

## 3. When to Use
When securing database tables, defining permissions for pharmacies, consumers, and admins, or auditing access.

## 4. Required Inputs
- Database tables
- User roles (consumer, pharmacy, admin)
- Supabase Auth schema

## 5. Execution Procedure
1. Enable RLS on every table (`ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`).
2. Define public read policies for verified public data (`CREATE POLICY "Public read verified offers" ON pharmacy_offers FOR SELECT USING (verification_status = 'PHARMACY_CONFIRMED');`).
3. Enforce tenant isolation for pharmacy owners (`CREATE POLICY "Pharmacies manage own inventory" ON pharmacy_offers FOR ALL USING (auth.uid() = (SELECT owner_id FROM pharmacies WHERE id = pharmacy_id));`).
4. Restrict admin tables and actions to users with verified admin claims.
5. Write automated RLS test suites to verify that unauthorized users cannot read or mutate restricted rows.

## 6. Safety Constraints & Guardrails
- NEVER disable RLS on any table in any environment. Test negative authorization cases (unauthorized read/write) rigorously.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Supabase RLS Policy Scripts
- Access Matrix Specification
- RLS Automated Test Suite

## 8. Validation Checklist
- [ ] Is RLS enabled on 100% of tables?
- [ ] Can pharmacy A view/edit pharmacy B's draft records? (Must be false)
- [ ] Are anon users blocked from mutating data?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
