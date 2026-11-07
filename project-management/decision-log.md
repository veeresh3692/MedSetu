# MEDICOMPARE INDIA — DECISION LOG (ADR REPOSITORY)

This log tracks architectural, strategic, and governance decisions made across the lifecycle of MediCompare India.

---

## ADR-001: Architecture Model — Modular Monolith over Microservices
- **Date**: 2026-11-07
- **Status**: **APPROVED**
- **Decision Makers**: Elite AI Orchestrator, Product Owner
- **Context**: MediCompare India is launching its MVP targeting Bengaluru with future Pan-India expansion. The Product Owner is an individual B.Tech CSE Cybersecurity student. The initial system must be robust, secure, easily maintainable, and cost-effective without operational friction.
- **Decision**: Adopt a strict **Modular Monolith** using Next.js (App Router, Server Components, Route Handlers), React, TypeScript, and Supabase PostgreSQL. Reject microservices, Kubernetes, message brokers (Kafka/RabbitMQ), and multi-cloud infrastructure for the MVP.
- **Consequences**:
  - *Positive*: Single repository, unified type safety, instant local development, zero inter-service network latency, zero Kubernetes maintenance cost.
  - *Negative*: Scalability boundaries must be maintained through strict internal module interfaces rather than physical network boundaries.
  - *Compliance*: Perfect fit for solo developer maintainability and rapid iteration.

---

## ADR-002: Spatial Mapping Strategy — Leaflet + OpenStreetMap over Proprietary Map APIs
- **Date**: 2026-11-07
- **Status**: **APPROVED**
- **Decision Makers**: Elite AI Orchestrator, Product Owner
- **Context**: The platform requires displaying nearby licensed pharmacies with interactive distance and route discovery. Commercial map providers (Google Maps Platform, Mapbox) enforce steep pay-per-load pricing models that introduce billing risk for a student/startup project.
- **Decision**: Exclusively use **Leaflet with OpenStreetMap (OSM) tiles** for web geospatial rendering. Calculate distances using spatial database queries (PostGIS/Haversine) on server routes.
- **Consequences**:
  - *Positive*: Completely open-source, zero API subscription costs, no billing surprise risk.
  - *Negative*: Tiles must be cached respectfully following OSM tile usage policies; advanced proprietary traffic data is not available (not required for MVP pharmacy discovery).
  - *Compliance*: Protects project budget and guarantees uninterrupted service.

---

## ADR-003: Price Provenance Separation & Anti-Hallucination Guardrails
- **Date**: 2026-11-07
- **Status**: **APPROVED**
- **Decision Makers**: Elite AI Orchestrator, Regulatory Agent, Security Engineer
- **Context**: Presenting government price-cap figures (NPPA ceiling prices) as live retail store prices is deceptive and violates consumer protection principles. Presenting synthetic or unverified pharmacy offers harms trust and could mislead patients.
- **Decision**: Physically separate database tables for (1) `government_price_references`, (2) `pharmacy_offers`, and (3) `price_history`. Explicitly enforce verification statuses (`UNVERIFIED`, `PHARMACY_CONFIRMED`, `ADMIN_AUDITED`). Government prices must never be displayed as store selling prices. Demo records must have `is_demo = true` and are banned from production endpoints.
- **Consequences**:
  - *Positive*: High consumer and regulatory trust, crystal-clear audit trails, zero price hallucination risk.
  - *Negative*: Requires rigorous UI labeling and more complex comparison queries joining multiple distinct tables.

---

## ADR-004: Strict Non-Clinical Boundary & Regulatory Disclaimers
- **Date**: 2026-11-07
- **Status**: **APPROVED**
- **Decision Makers**: Elite AI Orchestrator, Regulatory Agent
- **Context**: Operating in the Indian healthcare domain entails strict liability under the Drugs and Cosmetics Act 1940 and Medical Council / NMC guidelines regarding unauthorized medical advice, prescription dispensing, and drug promotion.
- **Decision**: MediCompare India is strictly classified as an informational search, price comparison, and pharmacy discovery engine. It shall **NEVER** offer clinical diagnoses, recommend changing prescribed medications without doctor consultation, or directly sell prescription drugs. Prominent statutory disclaimers and Schedule H/H1 prescription notices must be embedded across all user interfaces.
- **Consequences**:
  - *Positive*: Eliminates regulatory risk of unauthorized pharmacy practice or unlawful medical advice.
  - *Negative*: Requires continuous content auditing of UI copy and metadata to ensure no prohibited therapeutic claims appear.

---

## ADR-005: Antigravity Customization Architecture (.agents/skills & .agents/rules)
- **Date**: 2026-11-07
- **Status**: **APPROVED**
- **Decision Makers**: Elite AI Orchestrator
- **Context**: Specialized domain tasks require deterministic, high-quality guidelines without bloating the LLM prompt context window in every single turn.
- **Decision**: Implement the 33 domain skills as standalone modules in `.agents/skills/<skill-name>/SKILL.md` utilizing Antigravity's progressive disclosure engine. Supplement with 4 hierarchical governance rules in `.agents/rules/` and central rules in `AGENTS.md` and `GEMINI.md`. Link `.agentsskills` via junction for backward/cross-tool compatibility.
- **Consequences**:
  - *Positive*: Context-efficient, version-controlled, reproducible, modular.
  - *Negative*: Requires skills to be maintained and kept in sync with architectural evolution.
