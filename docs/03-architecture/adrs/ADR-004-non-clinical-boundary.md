# ADR-004: STRICT NON-CLINICAL BOUNDARY & STATUTORY DISCLAIMERS
**Status:** APPROVED  
**Date:** 2026-11-08  
**Deciders:** Elite AI Orchestrator, AGENT 07 (System Architect), AGENT 04 (Regulatory & Compliance)  
**Consulted:** AGENT 02 (Business Analyst), AGENT 08 (UI/UX Designer), AGENT 12 (Security Engineer)  

---

## 1. Context & Problem Statement
Operating in the Indian pharmaceutical information ecosystem carries significant statutory liabilities under:
- *Drugs and Cosmetics Act, 1940* & *Rules, 1945* (unauthorized dispensing or substitution of prescription drugs).
- *Pharmacy Act, 1948* (unlicensed pharmacy practice).
- *Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954* (therapeutic and curative efficacy claims).
- National Medical Commission (NMC) guidelines regarding medical advice.

Platforms that venture into prescription medicine checkout, automated brand substitution, or symptom-based drug recommendations face regulatory crackdowns, legal injunctions, and direct consumer safety risks.

What is MediCompare India's legal and architectural boundary regarding clinical dispensing and recommendations?

---

## 2. Decision
MediCompare India is strictly architected as an **informational discovery and price comparison engine**.

The platform:
1. **Does NOT sell, dispense, courier, or stock medicines**: All dispensing takes place physically at licensed brick-and-mortar retail chemists upon presentation of a valid physical prescription.
2. **Does NOT offer clinical diagnosis or prescriptive treatment advice**: Search is strictly restricted to brand trade names and active generic salts.
3. **Enforces Bioequivalence Clinical Guardrails**: Formulation matching requires exact equality on active salts, strengths, and release profiles (IR != SR != ER). Substitutions are labeled as informational alternatives, accompanied by mandatory warnings to consult treating physicians.
4. **Embeds Standardized Disclaimers**: Persistent non-dispensing banner on all views, prominent "Rx Required" badge and modal on Schedule H/H1 drugs, and price freshness notices.

---

## 3. Alternatives Considered

### Alternative 1: E-Pharmacy Marketplace with Online Cart Checkout & Delivery
- *Pros*: Potential commission revenue on transactions.
- *Cons*: Regulatory conflict under draft e-pharmacy rules, retail chemist resistance, complex courier cold-chain logistics, heavy licensing burden.
- *Verdict*: **REJECTED**.

### Alternative 2: AI Diagnostic Symptom Checker with Drug Recommendations
- *Pros*: Increased user engagement.
- *Cons*: High liability under Indian medical malpractice law, severe violation of DMRA 1954, extreme risk of hallucinated medical guidance.
- *Verdict*: **REJECTED**.

---

## 4. Consequences

### Positive Consequences
- **Zero Dispensing Regulatory Risk**: Eliminates risk of unlicensed pharmacy classification under Drugs & Cosmetics Act.
- **Chemist Alignment**: Neighborhood retail chemists view MediCompare as an ally driving walk-in foot traffic, rather than a predatory dark-store competitor.
- **Architectural Simplicity**: No shopping cart state machines, payment gateway integrations, refund pipelines, or delivery fleet tracking.

### Negative / Trade-off Consequences
- **Offline Conversion Tracking**: Platform cannot programmatically verify whether a patient completed the physical in-store purchase; rely on "Report Incorrect Price" or pharmacy stock check-ins.

---

## 5. Compliance & Verification
- Adheres to MediCompare Governance Rule `03-security-privacy-compliance-governance.md` and Risk Register `RSK-01`.
- Verified in Task MC-005 by Agent 07 (System Architect).
