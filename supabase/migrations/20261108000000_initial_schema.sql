-- ==============================================================================
-- MEDICOMPARE INDIA — INITIAL DATABASE MIGRATION
-- Migration: 20261108000000_initial_schema.sql
-- Description: Core relational schema, strict constraints, immutability triggers,
--              performance indexes (trigram/spatial), and Supabase Row Level Security.
-- Author: AGENT 11 — Database Engineer
-- Governance: AGENTS.md, Rules 02 & 03, ADR-003, ADR-005
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('consumer', 'pharmacy_operator', 'platform_admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE drug_schedule AS ENUM ('SCHEDULE_H', 'SCHEDULE_H1', 'SCHEDULE_X', 'OTC', 'GENERAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE release_type AS ENUM ('IMMEDIATE_RELEASE', 'SUSTAINED_RELEASE', 'EXTENDED_RELEASE', 'ENTERIC_COATED', 'MODIFIED_RELEASE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE dosage_form AS ENUM ('TABLET', 'CAPSULE', 'SYRUP', 'INJECTION', 'SUSPENSION', 'DROPS', 'OINTMENT', 'GEL', 'INHALER', 'RESPULE', 'POWDER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('PENDING_VERIFICATION', 'APPROVED', 'REJECTED', 'SUSPENDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE offer_verification_status AS ENUM ('UNVERIFIED', 'PHARMACY_CONFIRMED', 'ADMIN_AUDITED', 'DISPUTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE stock_status AS ENUM ('IN_STOCK', 'LIMITED_STOCK', 'OUT_OF_STOCK', 'CALL_TO_CONFIRM');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE price_type AS ENUM ('GOVERNMENT_CEILING', 'MANUFACTURER_MRP', 'PHARMACY_OFFER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('PENDING_REVIEW', 'INVESTIGATING', 'RESOLVED', 'DISMISSED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ==============================================================================
-- 4. TABLE DEFINITIONS
-- ==============================================================================

-- 4.1 PROFILES (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    role user_role NOT NULL DEFAULT 'consumer',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.2 ACTIVE INGREDIENTS (Generic Salts)
CREATE TABLE IF NOT EXISTS active_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inn_name TEXT UNIQUE NOT NULL, -- International Nonproprietary Name
    standard_unit TEXT NOT NULL DEFAULT 'mg',
    therapeutic_category TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.3 FORMULATIONS (Chemical & Clinical Definitions)
CREATE TABLE IF NOT EXISTS formulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- e.g. "Amoxicillin and Potassium Clavulanate Tablet 625mg"
    dosage_form dosage_form NOT NULL,
    release_type release_type NOT NULL DEFAULT 'IMMEDIATE_RELEASE',
    is_combination BOOLEAN NOT NULL DEFAULT false,
    normalized_strength TEXT NOT NULL, -- e.g. "500mg + 125mg"
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.4 FORMULATION INGREDIENTS (Normalized Many-to-Many Bridge)
CREATE TABLE IF NOT EXISTS formulation_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    formulation_id UUID NOT NULL REFERENCES formulations(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES active_ingredients(id) ON DELETE RESTRICT,
    strength_value NUMERIC(10, 3) NOT NULL CHECK (strength_value > 0),
    strength_unit TEXT NOT NULL, -- mg, mcg, ml, %, IU
    CONSTRAINT uq_formulation_ingredient UNIQUE (formulation_id, ingredient_id)
);

-- 4.5 MEDICINES (Canonical Brand Catalog)
CREATE TABLE IF NOT EXISTS medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_name TEXT NOT NULL, -- e.g. "Augmentin 625 Duo"
    slug TEXT UNIQUE NOT NULL,
    formulation_id UUID NOT NULL REFERENCES formulations(id) ON DELETE RESTRICT,
    manufacturer TEXT NOT NULL, -- e.g. "GlaxoSmithKline Pharmaceuticals Ltd"
    pack_size NUMERIC(8, 2) NOT NULL CHECK (pack_size > 0), -- e.g. 10.00
    pack_unit TEXT NOT NULL DEFAULT 'tablets', -- tablets, capsules, ml, gm
    mrp NUMERIC(10, 2) NOT NULL CHECK (mrp > 0), -- Printed Packaging MRP in INR
    schedule drug_schedule NOT NULL DEFAULT 'SCHEDULE_H',
    is_generic_generic BOOLEAN NOT NULL DEFAULT false, -- True for Jan Aushadhi (PMBJP)
    is_discontinued BOOLEAN NOT NULL DEFAULT false,
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.6 GOVERNMENT PRICE REFERENCES (NPPA Ceiling Prices)
CREATE TABLE IF NOT EXISTS government_price_references (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    formulation_id UUID NOT NULL REFERENCES formulations(id) ON DELETE RESTRICT,
    ceiling_price NUMERIC(10, 2) NOT NULL CHECK (ceiling_price > 0), -- Price per specified unit (excl. GST)
    unit_specification TEXT NOT NULL, -- e.g. "Per 1 Tablet", "Per 100ml"
    applicable_gst_rate NUMERIC(4, 2) NOT NULL DEFAULT 12.00, -- 5% or 12%
    dpco_order_number TEXT NOT NULL, -- Official Gazette S.O. Number
    notification_date DATE NOT NULL,
    source_reference TEXT NOT NULL, -- e.g. "NPPA Gazette S.O. 1563(E)"
    retrieval_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.7 PHARMACIES (Physical Licensed Retail Premises)
CREATE TABLE IF NOT EXISTS pharmacies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    business_name TEXT NOT NULL, -- Registered Trade Name
    legal_name TEXT NOT NULL,    -- Name on Form 20/21 Drug License
    gstin TEXT UNIQUE,
    address_line TEXT NOT NULL,
    locality TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Bengaluru',
    state TEXT NOT NULL DEFAULT 'Karnataka',
    pincode VARCHAR(6) NOT NULL CHECK (pincode ~ '^[1-9][0-9]{5}$'),
    latitude NUMERIC(10, 7) NOT NULL CHECK (latitude BETWEEN 11.5 AND 18.5),   -- Karnataka bounds
    longitude NUMERIC(10, 7) NOT NULL CHECK (longitude BETWEEN 74.0 AND 78.5), -- Karnataka bounds
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    verification_status verification_status NOT NULL DEFAULT 'PENDING_VERIFICATION',
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.8 VERIFICATION RECORDS (Form 20/21 License Audit Details)
CREATE TABLE IF NOT EXISTS verification_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    form_20_license_number TEXT NOT NULL,
    form_20_expiry_date DATE NOT NULL,
    form_21_license_number TEXT NOT NULL,
    form_21_expiry_date DATE NOT NULL,
    pharmacist_name TEXT NOT NULL,
    pharmacist_reg_number TEXT NOT NULL, -- Karnataka Pharmacy Council (KPC) number
    license_document_url TEXT,
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_pharmacy_verification UNIQUE (pharmacy_id)
);

-- 4.9 PHARMACY OFFERS (Live Retail Selling Prices & Stock)
CREATE TABLE IF NOT EXISTS pharmacy_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE RESTRICT,
    selling_price NUMERIC(10, 2) NOT NULL CHECK (selling_price > 0),
    stock_status stock_status NOT NULL DEFAULT 'IN_STOCK',
    observation_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    retrieval_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verification_status offer_verification_status NOT NULL DEFAULT 'PHARMACY_CONFIRMED',
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_pharmacy_medicine_offer UNIQUE (pharmacy_id, medicine_id)
);

-- 4.10 PRICE HISTORY (Immutable Historical Audit Log)
CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID NOT NULL,
    pharmacy_id UUID NOT NULL,
    medicine_id UUID NOT NULL,
    previous_price NUMERIC(10, 2) NOT NULL,
    new_price NUMERIC(10, 2) NOT NULL,
    previous_stock stock_status,
    new_stock stock_status,
    change_source TEXT NOT NULL, -- 'CSV_IMPORT', 'DASHBOARD_EDIT', 'AUDIT_CORRECTION'
    observation_timestamp TIMESTAMPTZ NOT NULL,
    archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.11 DATA IMPORT JOBS (CSV & Batch Tracking)
CREATE TABLE IF NOT EXISTS data_import_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    total_rows INTEGER NOT NULL DEFAULT 0,
    valid_rows INTEGER NOT NULL DEFAULT 0,
    rejected_rows INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'PROCESSING', -- PROCESSING, COMPLETED, FAILED
    error_summary JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 4.12 PRICE REPORTS (Crowd-Sourced Consumer Dispute Tracking)
CREATE TABLE IF NOT EXISTS price_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE RESTRICT,
    reported_selling_price NUMERIC(10, 2),
    issue_type TEXT NOT NULL, -- 'PRICE_HIGHER_THAN_LISTED', 'OUT_OF_STOCK', 'STORE_REFUSED'
    user_comment TEXT,
    status report_status NOT NULL DEFAULT 'PENDING_REVIEW',
    resolution_notes TEXT,
    resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 4.13 AUDIT LOGS (Immutable System Security & Regulatory Audit Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- e.g. "PHARMACY_APPROVED", "PRICE_OVERRIDDEN", "CATALOG_MERGED"
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    diff_payload JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. DATABASE TRIGGERS
-- ==============================================================================

-- 5.1 Enforce Selling Price <= Manufacturer MRP Ceiling Trigger
CREATE OR REPLACE FUNCTION fn_enforce_selling_price_ceiling()
RETURNS TRIGGER AS $$
DECLARE
    v_mrp NUMERIC(10, 2);
BEGIN
    SELECT mrp INTO v_mrp FROM public.medicines WHERE id = NEW.medicine_id;
    IF v_mrp IS NULL THEN
        RAISE EXCEPTION 'Target medicine ID % does not exist in canonical catalog', NEW.medicine_id;
    END IF;
    IF NEW.selling_price > v_mrp THEN
        RAISE EXCEPTION 'Retail selling price (₹%) cannot exceed manufacturer MRP (₹%)', NEW.selling_price, v_mrp;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_check_selling_price_ceiling
BEFORE INSERT OR UPDATE ON pharmacy_offers
FOR EACH ROW
EXECUTE FUNCTION fn_enforce_selling_price_ceiling();

-- 5.2 Immutable Price History Archiving Trigger (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION fn_archive_price_history()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        IF (OLD.selling_price <> NEW.selling_price OR OLD.stock_status <> NEW.stock_status) THEN
            INSERT INTO public.price_history (
                offer_id, pharmacy_id, medicine_id,
                previous_price, new_price,
                previous_stock, new_stock,
                change_source, observation_timestamp
            ) VALUES (
                OLD.id, OLD.pharmacy_id, OLD.medicine_id,
                OLD.selling_price, NEW.selling_price,
                OLD.stock_status, NEW.stock_status,
                'PRICE_UPDATE_TRIGGER', OLD.observation_timestamp
            );
        END IF;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.price_history (
            offer_id, pharmacy_id, medicine_id,
            previous_price, new_price,
            previous_stock, new_stock,
            change_source, observation_timestamp
        ) VALUES (
            OLD.id, OLD.pharmacy_id, OLD.medicine_id,
            OLD.selling_price, 0.00,
            OLD.stock_status, 'OUT_OF_STOCK',
            'OFFER_DELETION_TRIGGER', OLD.observation_timestamp
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_archive_price_history
BEFORE UPDATE OR DELETE ON pharmacy_offers
FOR EACH ROW
EXECUTE FUNCTION fn_archive_price_history();

-- 5.3 Security Anti-Tampering Triggers (Privilege Escalation Protection)
CREATE OR REPLACE FUNCTION fn_prevent_profile_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.role IS DISTINCT FROM OLD.role) THEN
        IF (COALESCE(current_setting('request.jwt.claim.role', true), '') <> 'service_role'
            AND NOT EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() AND role = 'platform_admin'
            )) THEN
            RAISE EXCEPTION 'Security Violation: Modifying user role is restricted to platform administrators';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_prevent_profile_role_escalation
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION fn_prevent_profile_role_escalation();

CREATE OR REPLACE FUNCTION fn_protect_pharmacy_status()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.verification_status IS DISTINCT FROM OLD.verification_status) THEN
        IF (COALESCE(current_setting('request.jwt.claim.role', true), '') <> 'service_role'
            AND NOT EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() AND role = 'platform_admin'
            )) THEN
            RAISE EXCEPTION 'Security Violation: Modifying verification_status is restricted to platform administrators';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_protect_pharmacy_status
BEFORE UPDATE ON pharmacies
FOR EACH ROW
EXECUTE FUNCTION fn_protect_pharmacy_status();

CREATE OR REPLACE FUNCTION fn_protect_verification_records()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.verified_by IS DISTINCT FROM OLD.verified_by 
        OR NEW.verified_at IS DISTINCT FROM OLD.verified_at
        OR NEW.rejection_reason IS DISTINCT FROM OLD.rejection_reason) THEN
        IF (COALESCE(current_setting('request.jwt.claim.role', true), '') <> 'service_role'
            AND NOT EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() AND role = 'platform_admin'
            )) THEN
            RAISE EXCEPTION 'Security Violation: Only platform administrators can verify drug licenses';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_protect_verification_records
BEFORE UPDATE ON verification_records
FOR EACH ROW
EXECUTE FUNCTION fn_protect_verification_records();

-- 5.4 Updated_at Timestamp Triggers
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_formulations_updated_at BEFORE UPDATE ON formulations FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_medicines_updated_at BEFORE UPDATE ON medicines FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_pharmacies_updated_at BEFORE UPDATE ON pharmacies FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_verification_records_updated_at BEFORE UPDATE ON verification_records FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_pharmacy_offers_updated_at BEFORE UPDATE ON pharmacy_offers FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- ==============================================================================
-- 6. PERFORMANCE & SPATIAL INDEXES
-- ==============================================================================

-- Trigram Indexes for Instant Autocomplete (< 20ms)
CREATE INDEX IF NOT EXISTS idx_medicines_brand_name_trgm ON medicines USING gin (brand_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_formulations_name_trgm ON formulations USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_active_ingredients_inn_trgm ON active_ingredients USING gin (inn_name gin_trgm_ops);

-- B-Tree Indexes on Foreign Keys & Lookups
CREATE INDEX IF NOT EXISTS idx_medicines_formulation_id ON medicines(formulation_id);
CREATE INDEX IF NOT EXISTS idx_medicines_slug ON medicines(slug);
CREATE INDEX IF NOT EXISTS idx_formulation_ingredients_form_id ON formulation_ingredients(formulation_id);
CREATE INDEX IF NOT EXISTS idx_formulation_ingredients_ingr_id ON formulation_ingredients(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_govt_prices_formulation_id ON government_price_references(formulation_id);

-- Composite Indexes on Pharmacy Offers for Comparison Engine (< 10ms)
CREATE INDEX IF NOT EXISTS idx_pharmacy_offers_lookup ON pharmacy_offers(medicine_id, verification_status, is_active)
INCLUDE (selling_price, stock_status);

CREATE INDEX IF NOT EXISTS idx_pharmacy_offers_pharmacy ON pharmacy_offers(pharmacy_id);

-- Spatial Bounding-Box Index on Pharmacies for Proximity Queries (< 5ms)
CREATE INDEX IF NOT EXISTS idx_pharmacies_coordinates ON pharmacies(latitude, longitude)
WHERE verification_status = 'APPROVED' AND is_active = true;

CREATE INDEX IF NOT EXISTS idx_pharmacies_owner ON pharmacies(owner_id);
CREATE INDEX IF NOT EXISTS idx_price_history_lookup ON price_history(medicine_id, pharmacy_id, archived_at DESC);

-- ==============================================================================
-- 7. SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- 7.1 Enable RLS on 100% of tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE formulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE formulation_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_price_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 7.2 PUBLIC READ POLICIES (Unauthenticated Consumers)
CREATE POLICY "Public read active medicines" ON medicines
    FOR SELECT TO anon, authenticated
    USING (is_discontinued = false);

CREATE POLICY "Public read formulations" ON formulations
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Public read ingredients" ON active_ingredients
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Public read formulation ingredients" ON formulation_ingredients
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Public read govt ceiling prices" ON government_price_references
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Public read verified approved pharmacies" ON pharmacies
    FOR SELECT TO anon, authenticated
    USING (verification_status = 'APPROVED' AND is_active = true);

CREATE POLICY "Public read verified pharmacy offers" ON pharmacy_offers
    FOR SELECT TO anon, authenticated
    USING (
        verification_status IN ('PHARMACY_CONFIRMED', 'ADMIN_AUDITED')
        AND is_active = true
        AND EXISTS (
            SELECT 1 FROM pharmacies p
            WHERE p.id = pharmacy_offers.pharmacy_id
            AND p.verification_status = 'APPROVED'
            AND p.is_active = true
        )
    );

CREATE POLICY "Public read verified price history" ON price_history
    FOR SELECT TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM pharmacies p
            WHERE p.id = price_history.pharmacy_id
            AND p.verification_status = 'APPROVED'
            AND p.is_active = true
        )
    );

CREATE POLICY "Pharmacy operators view own price history" ON price_history
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM pharmacies p
            WHERE p.id = price_history.pharmacy_id
            AND p.owner_id = auth.uid()
        )
    );

-- 7.3 CONSUMER INSERT POLICIES (Unauthenticated Dispute Reports)
CREATE POLICY "Public create price reports" ON price_reports
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- 7.4 PHARMACY OPERATOR POLICIES (Tenant-Isolated)
CREATE POLICY "Users read own profile" ON profiles
    FOR SELECT TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users update own profile" ON profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY "Pharmacy operators view own pharmacy" ON pharmacies
    FOR SELECT TO authenticated
    USING (owner_id = auth.uid());

CREATE POLICY "Pharmacy operators insert own pharmacy" ON pharmacies
    FOR INSERT TO authenticated
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Pharmacy operators update own pharmacy" ON pharmacies
    FOR UPDATE TO authenticated
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Pharmacy operators manage verification records" ON verification_records
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM pharmacies p WHERE p.id = verification_records.pharmacy_id AND p.owner_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM pharmacies p WHERE p.id = verification_records.pharmacy_id AND p.owner_id = auth.uid()));

CREATE POLICY "Pharmacy operators manage own offers" ON pharmacy_offers
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM pharmacies p WHERE p.id = pharmacy_offers.pharmacy_id AND p.owner_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM pharmacies p WHERE p.id = pharmacy_offers.pharmacy_id AND p.owner_id = auth.uid()));

CREATE POLICY "Pharmacy operators manage own import jobs" ON data_import_jobs
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM pharmacies p WHERE p.id = data_import_jobs.pharmacy_id AND p.owner_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM pharmacies p WHERE p.id = data_import_jobs.pharmacy_id AND p.owner_id = auth.uid()));

-- 7.5 SECURITY TAMPER-PROOFING
-- Prevent any non-trigger modification, direct insertion, or truncation of audit tables
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON price_history FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON audit_logs FROM anon, authenticated;
