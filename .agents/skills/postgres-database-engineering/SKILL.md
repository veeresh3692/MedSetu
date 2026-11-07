---
name: postgres-database-engineering
description: >-
  Designs, implements, and tunes PostgreSQL schemas, migrations, relational integrity, indexes, and triggers.
---

# Skill: postgres-database-engineering

## 1. Description & Purpose
Designs, implements, and tunes PostgreSQL schemas, migrations, relational integrity, indexes, and triggers.

## 2. Scope & Applicability
SQL DDL migrations, relational integrity, composite indexes, foreign key cascading, and query performance.

## 3. When to Use
When creating database tables, writing SQL migrations, adding indexes, or tuning complex queries.

## 4. Required Inputs
- Data models
- Query access patterns
- Supabase PostgreSQL environment

## 5. Execution Procedure
1. Author modular, reversible SQL migration scripts in `supabase/migrations/<timestamp>_<name>.sql`.
2. Define clear schemas: `medicines`, `formulations`, `pharmacies`, `pharmacy_offers`, `price_history`, `government_price_references`, `audit_logs`.
3. Enforce relational integrity: strict foreign keys, NOT NULL constraints, unique compound indexes (`UNIQUE(pharmacy_id, medicine_id)`).
4. Build performance indexes: B-tree indexes on foreign keys, GIN trgm indexes on drug name search columns, and spatial/composite indexes.
5. Write database triggers for automated `updated_at` timestamps and immutable `price_history` archiving.

## 6. Safety Constraints & Guardrails
- Never run destructive migrations (`DROP TABLE`, `ALTER TABLE ... DROP COLUMN`) without explicit Product Owner sign-off.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- SQL Migration Files
- Database Schema Documentation
- Index Optimization Plan

## 8. Validation Checklist
- [ ] Are all foreign keys indexed?
- [ ] Are check constraints in place for price values?
- [ ] Are triggers attached for price history archiving?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
