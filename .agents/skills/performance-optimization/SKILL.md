---
name: performance-optimization
description: >-
  Diagnoses and optimizes application performance, Core Web Vitals, database query latency, and frontend asset delivery.
---

# Skill: performance-optimization

## 1. Description & Purpose
Diagnoses and optimizes application performance, Core Web Vitals, database query latency, and frontend asset delivery.

## 2. Scope & Applicability
Lighthouse scoring, LCP/FID/CLS optimization, SQL query indexing, Next.js bundle analysis, and caching.

## 3. When to Use
When evaluating page load speeds, optimizing complex search/comparison queries, or minimizing bundle sizes.

## 4. Required Inputs
- Lighthouse reports
- Database query execution plans (`EXPLAIN ANALYZE`)
- Next.js bundle analyzer outputs

## 5. Execution Procedure
1. Audit Core Web Vitals (Largest Contentful Paint < 2.5s, Cumulative Layout Shift < 0.1, First Input Delay < 100ms).
2. Optimize client bundle sizes: dynamically import heavy components (e.g., Leaflet maps via `next/dynamic` with SSR disabled).
3. Analyze SQL query plans (`EXPLAIN ANALYZE`) on search and comparison endpoints; add missing indexes on frequent filter columns.
4. Implement effective HTTP cache-control headers on static medicine catalog queries.
5. Compress images, utilize SVGs for icons, and leverage modern font optimization (`next/font`).

## 6. Safety Constraints & Guardrails
- Do not sacrifice data freshness or price accuracy for aggressive caching. Price observations must remain fresh.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Performance Audit Report
- Query Optimization DDL
- Bundle Analysis Findings

## 8. Validation Checklist
- [ ] Is Leaflet dynamically imported without SSR issues?
- [ ] Are search queries executing under 200ms in DB?
- [ ] Are Core Web Vitals in green thresholds?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
