# GOVERNANCE RULE 01: PRODUCT & ARCHITECTURE GOVERNANCE

## 1. Product Vision & MVP Scope
- **Product**: MediCompare India
- **Core Value Proposition**: Find the lowest trustworthy price for the exact medicine formulation at pharmacies near you.
- **Initial Geography**: Bengaluru, Karnataka, India (expanding Pan-India).
- **Target Users**:
  - *Patients/Consumers*: Searching for exact prescribed formulations, comparing transparent prices, checking local pharmacy stock, discovering nearby licensed pharmacies.
  - *Licensed Pharmacies*: Onboarding with valid Drug Licenses (Form 20/21), updating verified stock and selling prices, managing catalog via CSV/dashboard.
  - *Platform Administrators*: Verifying pharmacy licenses, auditing price reports, maintaining the canonical medicine master catalog.
- **Problem Validation**: Do not assume every medicine has significant price variation. Some medicines are strictly price-capped under NLEM/DPCO; others have wide generic/branded generic spreads. All assertions must be grounded in empirical data.

## 2. Architectural Principles & Constraints
- **Modular Monolith**:
  - Next.js (App Router, Route Handlers, Server Components where appropriate)
  - React, TypeScript (strict mode enabled)
  - Tailwind CSS + shadcn/ui + Lucide React
  - Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS)
  - Leaflet + OpenStreetMap (free/open-source spatial discovery, no costly Google Maps API dependency for MVP)
  - Recharts for transparent price history and analytics
- **No Over-Engineering**:
  - NO microservices, NO Kubernetes, NO multi-cloud orchestration for the MVP.
  - Designed for maintainability by a solo B.Tech CSE Cybersecurity developer.
  - Avoid paid recurring infrastructure subscriptions when open-source/free-tier alternatives exist.
- **Component & Boundary Discipline**:
  - Clear separation of concerns between presentation, domain business logic, data access, and integration layers.
  - Every external input must be validated via Zod schemas at runtime before hitting database or services.
