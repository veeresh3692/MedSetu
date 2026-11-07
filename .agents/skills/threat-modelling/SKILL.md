---
name: threat-modelling
description: >-
  Performs STRIDE and OWASP-based threat modeling for MediCompare India systems and data flows.
---

# Skill: threat-modelling

## 1. Description & Purpose
Performs STRIDE and OWASP-based threat modeling for MediCompare India systems and data flows.

## 2. Scope & Applicability
Threat modeling, attack surface mapping, spoofing, tampering, information disclosure, and mitigation design.

## 3. When to Use
During architecture design, major feature additions, or regulatory compliance auditing.

## 4. Required Inputs
- Data flow diagrams (DFD)
- Architecture specifications
- Trust boundaries

## 5. Execution Procedure
1. Identify system assets: pharmacy license credentials, pricing feeds, patient search queries, admin audit logs.
2. Map trust boundaries: Public Client <-> Next.js Route Handlers <-> Supabase Database <-> External APIs.
3. Apply STRIDE methodology (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege).
4. Identify top threat vectors (e.g., pharmacy competitor scraping, fake license upload, price tampering, DDoS).
5. Formulate actionable mitigations and control requirements for each identified threat.

## 6. Safety Constraints & Guardrails
- Only perform theoretical and authorized threat modeling. Never conduct unauthorized attacks on real infrastructure.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- STRIDE Threat Model Document
- Attack Surface Map
- Mitigation Control Checklist

## 8. Validation Checklist
- [ ] Are all trust boundaries identified?
- [ ] Are mitigations assigned to every identified threat?
- [ ] Is the threat model reviewed by the Security Engineer?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
