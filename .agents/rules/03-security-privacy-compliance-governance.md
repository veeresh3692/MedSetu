# GOVERNANCE RULE 03: SECURITY, PRIVACY & COMPLIANCE GOVERNANCE

## 1. Regulatory Context (India Healthcare)
- **Drugs and Cosmetics Act, 1940 & Drugs and Cosmetics Rules, 1945**:
  - MediCompare India is an informational directory, price comparison, and pharmacy discovery service.
  - MediCompare does **NOT** sell, dispense, store, compound, or fulfill prescription drugs directly.
  - Participating retail pharmacies must possess valid retail drug licenses issued by State Drug Control Authorities (Form 20 for non-Schedule C/C(1) drugs, Form 21 for Schedule C/C(1) drugs, and Form 20F/21F where applicable).
  - MediCompare must display mandatory consumer disclaimers:
    > "MediCompare India provides price comparison and informational discovery only. We do not prescribe, sell, or dispense medications. A valid physical prescription from a registered medical practitioner (RMP) is required to purchase Schedule H, H1, or X medicines from licensed retail pharmacies. Always consult a qualified physician before initiating or altering any treatment."
- **Digital Personal Data Protection Act (DPDP Act, 2023)**:
  - Strict data minimization: Do not collect or store sensitive medical records, prescription images, or diagnosis notes unless explicitly designed and compliant with consent notices.
  - Consumer searches for medicine prices should remain privacy-preserving and accessible without mandatory account registration.
  - Where user accounts exist, clear purpose specification, explicit consent mechanisms, and easy account/data deletion capabilities must be provided.
  - Audit logs must be maintained for administrative actions, pharmacy license approvals, and price modifications.

## 2. Technical Security Guardrails
- **Zero Secret Exposure**:
  - NEVER commit API keys, database credentials, Supabase `service_role` keys, or webhook secrets to Git.
  - Next.js client bundles (`NEXT_PUBLIC_*`) must ONLY receive public, non-privileged identifiers (e.g., Supabase Anon Key).
  - The Supabase `service_role` key must ONLY be executed within server-side Route Handlers with rigorous authorization checks.
- **Supabase Row Level Security (RLS)**:
  - RLS must be explicitly enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`) on EVERY table without exception.
  - Public read policies are strictly restricted to public catalog items (`medicines`, verified `pharmacy_offers`, published `government_price_references`).
  - Write policies are strictly bound to authenticated pharmacy owner IDs (`auth.uid() = pharmacy.owner_id`) or admin role claims.
- **Input Validation & Sanitization**:
  - All incoming Route Handler payloads and query parameters must be validated using strict `zod` schemas.
  - SQL injection defenses: Exclusively use parameterized queries and Supabase PostgREST client methods. Never concatenate raw strings into SQL.
- **Access Control & Least Privilege**:
  - Distinct roles: `public_consumer`, `pharmacy_operator`, `platform_admin`.
  - Role escalation attempts must be logged to `audit_logs` and rejected with `403 Forbidden`.
  - Security testing is strictly confined to local development and sandbox instances explicitly authorized by the Product Owner.
