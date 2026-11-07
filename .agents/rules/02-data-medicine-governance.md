# GOVERNANCE RULE 02: MEDICINE & PRICE DATA GOVERNANCE

## 1. Medicine Identity & Clinical Resolution
- Medicine identity resolution must be multidimensional. Formulations cannot be matched by brand name alone.
- Every formulation identity MUST evaluate:
  1. **Active Pharmaceutical Ingredients (API / Generic Salt Name)**: Normalized international non-proprietary names (INN) / Indian Pharmacopoeia standards.
  2. **Strength**: Explicit unit normalization (e.g., mg, mcg, g, IU, ml, % w/v).
  3. **Dosage Form**: Tablet, capsule, syrup, injection, ointment, suspension, drops, etc.
  4. **Release Characteristics**: Immediate release (IR), sustained release (SR), extended release (ER), enteric-coated (EC), modified release (MR).
  5. **Combination Ingredients**: Exact composition and individual component strengths (e.g., Amoxicillin 500mg + Clavulanic Acid 125mg).
  6. **Pack Size & Unit of Sale**: Strip of 10, bottle of 100ml, blister of 15. Price per unit/tablet vs price per pack must be clearly distinguished.
  7. **Manufacturer & Marketing Company**: Distinguishing innovator brands from branded generics and generic-generics (Jan Aushadhi).
- **Prohibited Inference**: Never infer therapeutic equivalence solely from name similarity or approximate salt composition. Incompatible formulations must NEVER be compared as direct substitutes.

## 2. Price Provenance & Dataset Separation
The database and API must strictly isolate five distinct data categories:
1. **Government Reference Prices (NLEM / DPCO)**:
   - Ceiling prices notified by the National Pharmaceutical Pricing Authority (NPPA).
   - Must be labeled explicitly as "Government Ceiling Price / Reference Price".
   - **MANDATORY**: Government reference prices must NEVER be shown as actual local pharmacy selling prices or current store offers.
2. **Maximum Retail Price (MRP)**:
   - Manufacturer-printed maximum packaging price.
3. **Pharmacy Selling Prices (Offered Price)**:
   - Price quoted or confirmed by a licensed pharmacy for retail sale (must be <= MRP).
4. **Pharmacy Stock Availability**:
   - In Stock, Limited Stock, Out of Stock, or Unverified.
   - Must include observation / confirmation timestamp.
5. **Historical Price Observations**:
   - Immutable audit trail of price changes over time.
   - Historical records must persist permanently even if an active pharmacy inventory item is unlisted or deleted.

## 3. Price Record Audit Requirements
Every price entry must store:
- `price_type`: ENUM ('GOVERNMENT_CEILING', 'MANUFACTURER_MRP', 'PHARMACY_OFFER')
- `value`: Decimal numeric amount in INR (₹)
- `source`: ENUM ('NPPA_NOTIFICATION', 'PHARMACY_DIRECT_FEED', 'PHARMACY_CSV_UPLOAD', 'RECEIPT_AUDIT', 'MANUAL_VERIFIED')
- `source_reference`: Official order number, invoice ID, or upload batch ID
- `observation_timestamp`: When the price was observed at the source
- `retrieval_timestamp`: When the system ingested or validated the record
- `verification_status`: ENUM ('UNVERIFIED', 'PHARMACY_CONFIRMED', 'ADMIN_AUDITED', 'DISPUTED')
- `pharmacy_id`: Foreign key UUID (mandatory for pharmacy selling prices, null for government ceiling)

## 4. Truth in Data & Demo Guardrails
- Synthetic, seeded, or demonstration records must NEVER be displayed as live real-world offers to consumers.
- Any test or staging environment data must be flagged explicitly with `is_demo = true` and excluded from production queries.
- Never scrape or ingest datasets without verifying permissible data licensing, robots.txt, and terms of service.
