# ENTITY RELATIONSHIP DIAGRAM (ERD)
## MEDICOMPARE INDIA
**Document ID:** `DOC-ERD-001`  
**Task ID:** `MC-006`  
**Author:** AGENT 11 — Database Engineer  
**Reviewer:** AGENT 12 — Security Engineer  
**Status:** `APPROVED`  
**Version:** `1.1.0`  
**Date:** 2026-11-08  

---

## 1. Visual Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    profiles ||--o{ pharmacies : "owns"
    profiles ||--o{ audit_logs : "triggers"
    profiles ||--o{ verification_records : "verifies"
    profiles ||--o{ price_reports : "resolves"

    pharmacies ||--|| verification_records : "has license"
    pharmacies ||--o{ pharmacy_offers : "quotes"
    pharmacies ||--o{ data_import_jobs : "submits"
    pharmacies ||--o{ price_reports : "reported in"

    active_ingredients ||--o{ formulation_ingredients : "constitutes"
    formulations ||--o{ formulation_ingredients : "composed of"
    formulations ||--o{ medicines : "categorizes"
    formulations ||--o{ government_price_references : "regulated by"

    medicines ||--o{ pharmacy_offers : "offered as"
    medicines ||--o{ price_reports : "disputed in"

    pharmacy_offers ||--o{ price_history : "archives"

    profiles {
        uuid id PK
        text email
        text full_name
        text phone_number
        user_role role
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    active_ingredients {
        uuid id PK
        text inn_name
        text standard_unit
        text therapeutic_category
        timestamptz created_at
    }

    formulations {
        uuid id PK
        text name
        dosage_form dosage_form
        release_type release_type
        boolean is_combination
        text normalized_strength
        timestamptz created_at
        timestamptz updated_at
    }

    formulation_ingredients {
        uuid id PK
        uuid formulation_id FK
        uuid ingredient_id FK
        numeric strength_value
        text strength_unit
    }

    medicines {
        uuid id PK
        text brand_name
        text slug
        uuid formulation_id FK
        text manufacturer
        numeric pack_size
        text pack_unit
        numeric mrp
        drug_schedule schedule
        boolean is_generic_generic
        boolean is_discontinued
        boolean is_demo
        timestamptz created_at
        timestamptz updated_at
    }

    government_price_references {
        uuid id PK
        uuid formulation_id FK
        numeric ceiling_price
        text unit_specification
        numeric applicable_gst_rate
        text dpco_order_number
        date notification_date
        text source_reference
        timestamptz retrieval_timestamp
        timestamptz created_at
    }

    pharmacies {
        uuid id PK
        uuid owner_id FK
        text business_name
        text legal_name
        text gstin
        text address_line
        text locality
        text city
        text state
        varchar pincode
        numeric latitude
        numeric longitude
        text phone_number
        text email
        verification_status verification_status
        boolean is_active
        boolean is_demo
        timestamptz created_at
        timestamptz updated_at
    }

    verification_records {
        uuid id PK
        uuid pharmacy_id FK
        text form_20_license_number
        date form_20_expiry_date
        text form_21_license_number
        date form_21_expiry_date
        text pharmacist_name
        text pharmacist_reg_number
        text license_document_url
        uuid verified_by FK
        timestamptz verified_at
        text rejection_reason
        timestamptz created_at
        timestamptz updated_at
    }

    pharmacy_offers {
        uuid id PK
        uuid pharmacy_id FK
        uuid medicine_id FK
        numeric selling_price
        stock_status stock_status
        timestamptz observation_timestamp
        timestamptz retrieval_timestamp
        offer_verification_status verification_status
        boolean is_active
        boolean is_demo
        timestamptz created_at
        timestamptz updated_at
    }

    price_history {
        uuid id PK
        uuid offer_id
        uuid pharmacy_id
        uuid medicine_id
        numeric previous_price
        numeric new_price
        stock_status previous_stock
        stock_status new_stock
        text change_source
        timestamptz observation_timestamp
        timestamptz archived_at
    }

    data_import_jobs {
        uuid id PK
        uuid pharmacy_id FK
        text file_name
        integer total_rows
        integer valid_rows
        integer rejected_rows
        text status
        jsonb error_summary
        timestamptz created_at
        timestamptz completed_at
    }

    price_reports {
        uuid id PK
        uuid pharmacy_id FK
        uuid medicine_id FK
        numeric reported_selling_price
        text issue_type
        text user_comment
        report_status status
        text resolution_notes
        uuid resolved_by FK
        timestamptz created_at
        timestamptz resolved_at
    }

    audit_logs {
        uuid id PK
        uuid user_id FK
        text action
        text entity_type
        uuid entity_id
        jsonb diff_payload
        inet ip_address
        timestamptz created_at
    }
```

---

## 2. Relational Cardinalities & Deletion Semantics

| Parent Entity | Child Entity | Cardinality | Delete Cascade Rule | Architectural Rationale |
| :--- | :--- | :--- | :--- | :--- |
| `auth.users` | `profiles` | 1 : 1 | `ON DELETE CASCADE` | Profile exists only while auth user account exists. |
| `profiles` | `pharmacies` | 1 : N | `ON DELETE RESTRICT` | A user account cannot be deleted while it owns an active pharmacy business. |
| `pharmacies` | `verification_records` | 1 : 1 | `ON DELETE CASCADE` | License record is tightly coupled to the specific store entity. |
| `pharmacies` | `pharmacy_offers` | 1 : N | `ON DELETE CASCADE` | If a pharmacy closes or is unlisted, active inventory offers are purged. |
| `formulations` | `medicines` | 1 : N | `ON DELETE RESTRICT` | A clinical formulation cannot be deleted if commercial brand medicines reference it. |
| `medicines` | `pharmacy_offers` | 1 : N | `ON DELETE RESTRICT` | A canonical medicine cannot be deleted while live store quotes exist. |
| `pharmacy_offers` | `price_history` | 1 : N | **TRIGGER-MANAGED** | Uncoupling PK/FK ensures historical price records survive even if parent offers are deleted. |

---

*Authored by Agent 11 (Database Engineer). Ready for Gate 7 Security & RLS Audit by Agent 12 (Security Engineer).*
