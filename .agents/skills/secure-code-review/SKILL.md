---
name: secure-code-review
description: >-
  Conducts rigorous, static and contextual security code reviews focusing on OWASP Top 10, auth bypasses, and data leaks.
---

# Skill: secure-code-review

## 1. Description & Purpose
Conducts rigorous, static and contextual security code reviews focusing on OWASP Top 10, auth bypasses, and data leaks.

## 2. Scope & Applicability
Code auditing, secret scanning, injection vulnerability checks, SSRF prevention, and authorization review.

## 3. When to Use
During Gate 7 security reviews before merging pull requests or integrating new endpoints.

## 4. Required Inputs
- Source code diffs
- Pull requests
- API endpoint logic

## 5. Execution Procedure
1. Scan diffs for accidental hardcoded secrets, tokens, or environment credentials.
2. Inspect all input entry points for injection vulnerabilities (SQLi, XSS, prototype pollution).
3. Verify that Route Handlers authenticate the caller and verify role authorization before executing database mutations.
4. Verify that server errors return generic error messages to clients without dumping stack traces or database schema names.
5. Output a structured Security Review Report with findings rated by CVSS severity.

## 6. Safety Constraints & Guardrails
- Block merging immediately if any High or Critical security vulnerability or secret leakage is detected.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Security Review Report
- Remediation Recommendations
- Gate 7 Sign-Off

## 8. Validation Checklist
- [ ] Are all inputs validated via Zod?
- [ ] Are secrets completely absent from code and client bundles?
- [ ] Is authorization verified on every mutation?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
