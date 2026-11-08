-- ==============================================================================
-- MEDICOMPARE INDIA — CANONICAL DATABASE SEED DATA
-- Seed File: supabase/seed.sql
-- Description: Top chronic therapy formulations, NPPA DPCO ceiling price gazettes,
--              commercial brand MRPs, Jan Aushadhi generic lines, and verified
--              Bengaluru retail pharmacies with live inventory quotes.
-- Target Geography: Bengaluru Urban District, Karnataka (Pilot)
-- Governance: AGENTS.md, Rules 01 & 02, DOC-DATA-001 (MC-007)
-- ==============================================================================

-- 1. AUTH USERS (Mock platform admin & pharmacy operators)
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at)
VALUES
    ('d0d0d0d0-0000-0000-0000-000000000001', 'admin@medcompare.in', '{"full_name": "Dr. Ramesh Adiga (Chief Medical Auditor)"}', NOW(), NOW()),
    ('d0d0d0d0-0000-0000-0000-000000000002', 'indiranagar@apollopharmacy.in', '{"full_name": "Apollo Pharmacy Indiranagar"}', NOW(), NOW()),
    ('d0d0d0d0-0000-0000-0000-000000000003', 'koramangala@medplusindia.com', '{"full_name": "MedPlus Chemist Koramangala"}', NOW(), NOW()),
    ('d0d0d0d0-0000-0000-0000-000000000004', 'jayanagar@pmbjpkendra.gov.in', '{"full_name": "PMBJP Jan Aushadhi Kendra Jayanagar"}', NOW(), NOW()),
    ('d0d0d0d0-0000-0000-0000-000000000005', 'raghavendra.meds@gmail.com', '{"full_name": "Sri Raghavendra Medicals Malleshwaram"}', NOW(), NOW()),
    ('d0d0d0d0-0000-0000-0000-000000000006', 'draftchemist@test.com', '{"full_name": "Unverified Test Chemist"}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. PROFILES
INSERT INTO profiles (id, email, full_name, phone_number, role, is_active)
VALUES
    ('d0d0d0d0-0000-0000-0000-000000000001', 'admin@medcompare.in', 'Dr. Ramesh Adiga', '+919845012345', 'platform_admin', true),
    ('d0d0d0d0-0000-0000-0000-000000000002', 'indiranagar@apollopharmacy.in', 'Suresh Kumar (Chief Pharmacist)', '+918025251100', 'pharmacy_operator', true),
    ('d0d0d0d0-0000-0000-0000-000000000003', 'koramangala@medplusindia.com', 'Girish Reddy', '+918025532200', 'pharmacy_operator', true),
    ('d0d0d0d0-0000-0000-0000-000000000004', 'jayanagar@pmbjpkendra.gov.in', 'Manjunath Swamy', '+918026643300', 'pharmacy_operator', true),
    ('d0d0d0d0-0000-0000-0000-000000000005', 'raghavendra.meds@gmail.com', 'K. V. Raghavendra', '+918023344400', 'pharmacy_operator', true),
    ('d0d0d0d0-0000-0000-0000-000000000006', 'draftchemist@test.com', 'Pending Chemist', '+919900112233', 'pharmacy_operator', true)
ON CONFLICT (id) DO NOTHING;

-- 3. ACTIVE INGREDIENTS (Generic Salts)
INSERT INTO active_ingredients (id, inn_name, standard_unit, therapeutic_category)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Amoxicillin', 'mg', 'Antibiotic / Penicillin'),
    ('a0000000-0000-0000-0000-000000000002', 'Clavulanic Acid', 'mg', 'Beta-Lactamase Inhibitor'),
    ('a0000000-0000-0000-0000-000000000003', 'Metformin Hydrochloride', 'mg', 'Antidiabetic / Biguanide'),
    ('a0000000-0000-0000-0000-000000000004', 'Glimepiride', 'mg', 'Antidiabetic / Sulfonylurea'),
    ('a0000000-0000-0000-0000-000000000005', 'Telmisartan', 'mg', 'Antihypertensive / ARB'),
    ('a0000000-0000-0000-0000-000000000006', 'Amlodipine Besylate', 'mg', 'Antihypertensive / CCB'),
    ('a0000000-0000-0000-0000-000000000007', 'Atorvastatin Calcium', 'mg', 'Lipid-Lowering / Statin'),
    ('a0000000-0000-0000-0000-000000000008', 'Pantoprazole Sodium', 'mg', 'Gastrointestinal / PPI'),
    ('a0000000-0000-0000-0000-000000000009', 'Azithromycin', 'mg', 'Antibiotic / Macrolide'),
    ('a0000000-0000-0000-0000-000000000010', 'Paracetamol', 'mg', 'Analgesic / Antipyretic')
ON CONFLICT (inn_name) DO NOTHING;

-- 4. FORMULATIONS (Standardized Clinical Monographs)
INSERT INTO formulations (id, name, dosage_form, release_type, is_combination, normalized_strength)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'Amoxicillin and Potassium Clavulanate Tablet 625mg', 'TABLET', 'IMMEDIATE_RELEASE', true, '500mg + 125mg'),
    ('f0000000-0000-0000-0000-000000000002', 'Metformin Hydrochloride Tablet 500mg', 'TABLET', 'IMMEDIATE_RELEASE', false, '500mg'),
    ('f0000000-0000-0000-0000-000000000003', 'Metformin Hydrochloride Sustained Release Tablet 500mg', 'TABLET', 'SUSTAINED_RELEASE', false, '500mg'),
    ('f0000000-0000-0000-0000-000000000004', 'Telmisartan Tablet 40mg', 'TABLET', 'IMMEDIATE_RELEASE', false, '40mg'),
    ('f0000000-0000-0000-0000-000000000005', 'Telmisartan and Amlodipine Tablet 40mg + 5mg', 'TABLET', 'IMMEDIATE_RELEASE', true, '40mg + 5mg'),
    ('f0000000-0000-0000-0000-000000000006', 'Atorvastatin Calcium Tablet 10mg', 'TABLET', 'IMMEDIATE_RELEASE', false, '10mg'),
    ('f0000000-0000-0000-0000-000000000007', 'Pantoprazole Gastro-Resistant Tablet 40mg', 'TABLET', 'ENTERIC_COATED', false, '40mg'),
    ('f0000000-0000-0000-0000-000000000008', 'Azithromycin Tablet 500mg', 'TABLET', 'IMMEDIATE_RELEASE', false, '500mg')
ON CONFLICT (id) DO NOTHING;

-- 5. FORMULATION INGREDIENTS BRIDGE
INSERT INTO formulation_ingredients (formulation_id, ingredient_id, strength_value, strength_unit)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 500.000, 'mg'),
    ('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 125.000, 'mg'),
    ('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 500.000, 'mg'),
    ('f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 500.000, 'mg'),
    ('f0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000005', 40.000, 'mg'),
    ('f0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 40.000, 'mg'),
    ('f0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006', 5.000, 'mg'),
    ('f0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000007', 10.000, 'mg'),
    ('f0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000008', 40.000, 'mg'),
    ('f0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000009', 500.000, 'mg')
ON CONFLICT (formulation_id, ingredient_id) DO NOTHING;

-- 6. GOVERNMENT NPPA CEILING PRICES
INSERT INTO government_price_references (id, formulation_id, ceiling_price, unit_specification, applicable_gst_rate, dpco_order_number, notification_date, source_reference)
VALUES
    ('g0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 18.30, 'Per 1 Tablet', 12.00, 'S.O. 5249(E)', '2022-11-11', 'NPPA Gazette Notification DPCO 2013 S.O. 5249(E)'),
    ('g0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 1.82, 'Per 1 Tablet', 12.00, 'S.O. 1563(E)', '2023-03-31', 'NPPA Annual Ceiling Revision S.O. 1563(E)'),
    ('g0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', 2.10, 'Per 1 Tablet', 12.00, 'S.O. 1563(E)', '2023-03-31', 'NPPA Annual Ceiling Revision S.O. 1563(E)'),
    ('g0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000004', 5.85, 'Per 1 Tablet', 12.00, 'S.O. 1563(E)', '2023-03-31', 'NPPA Gazette Notification S.O. 1563(E)'),
    ('g0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000005', 8.40, 'Per 1 Tablet', 12.00, 'S.O. 1563(E)', '2023-03-31', 'NPPA Gazette Notification S.O. 1563(E)'),
    ('g0000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000006', 7.42, 'Per 1 Tablet', 12.00, 'S.O. 1563(E)', '2023-03-31', 'NPPA Gazette Notification S.O. 1563(E)'),
    ('g0000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000007', 7.10, 'Per 1 Tablet', 12.00, 'S.O. 1563(E)', '2023-03-31', 'NPPA Gazette Notification S.O. 1563(E)'),
    ('g0000000-0000-0000-0000-000000000008', 'f0000000-0000-0000-0000-000000000008', 21.50, 'Per 1 Tablet', 12.00, 'S.O. 1563(E)', '2023-03-31', 'NPPA Gazette Notification S.O. 1563(E)')
ON CONFLICT (id) DO NOTHING;

-- 7. CANONICAL MEDICINES (Commercial Brands & Jan Aushadhi Generics)
INSERT INTO medicines (id, brand_name, slug, formulation_id, manufacturer, pack_size, pack_unit, mrp, schedule, is_generic_generic, is_discontinued, is_demo)
VALUES
    -- Amoxicillin + Clavulanic Acid 625mg
    ('m0000000-0000-0000-0000-000000000001', 'Augmentin 625 Duo Tablet', 'augmentin-625-duo-tablet', 'f0000000-0000-0000-0000-000000000001', 'GlaxoSmithKline Pharmaceuticals Ltd', 10.00, 'tablets', 223.50, 'SCHEDULE_H', false, false, false),
    ('m0000000-0000-0000-0000-000000000002', 'Moxikind-CV 625 Tablet', 'moxikind-cv-625-tablet', 'f0000000-0000-0000-0000-000000000001', 'Mankind Pharma Ltd', 10.00, 'tablets', 165.00, 'SCHEDULE_H', false, false, false),
    ('m0000000-0000-0000-0000-000000000003', 'Clavam 625 Tablet', 'clavam-625-tablet', 'f0000000-0000-0000-0000-000000000001', 'Alkem Laboratories Ltd', 10.00, 'tablets', 204.00, 'SCHEDULE_H', false, false, false),
    ('m0000000-0000-0000-0000-000000000004', 'Jan Aushadhi Amoxy-Clav 625', 'jan-aushadhi-amoxy-clav-625', 'f0000000-0000-0000-0000-000000000001', 'Pharmaceuticals & Medical Devices Bureau of India (PMBI)', 10.00, 'tablets', 58.00, 'SCHEDULE_H', true, false, false),

    -- Metformin 500mg (IR)
    ('m0000000-0000-0000-0000-000000000005', 'Glycomet 500 Tablet', 'glycomet-500-tablet', 'f0000000-0000-0000-0000-000000000002', 'USV Ltd', 10.00, 'tablets', 22.50, 'SCHEDULE_H', false, false, false),
    ('m0000000-0000-0000-0000-000000000006', 'Jan Aushadhi Metformin 500 Tablet', 'jan-aushadhi-metformin-500-tablet', 'f0000000-0000-0000-0000-000000000002', 'PMBI', 10.00, 'tablets', 6.50, 'SCHEDULE_H', true, false, false),

    -- Metformin 500mg (SR) - Separate Monograph
    ('m0000000-0000-0000-0000-000000000007', 'Glycomet-SR 500 Tablet', 'glycomet-sr-500-tablet', 'f0000000-0000-0000-0000-000000000003', 'USV Ltd', 10.00, 'tablets', 26.00, 'SCHEDULE_H', false, false, false),

    -- Telmisartan 40mg
    ('m0000000-0000-0000-0000-000000000008', 'Telma 40 Tablet', 'telma-40-tablet', 'f0000000-0000-0000-0000-000000000004', 'Glenmark Pharmaceuticals Ltd', 15.00, 'tablets', 142.50, 'SCHEDULE_H', false, false, false),
    ('m0000000-0000-0000-0000-000000000009', 'Telmikind 40 Tablet', 'telmikind-40-tablet', 'f0000000-0000-0000-0000-000000000004', 'Mankind Pharma Ltd', 10.00, 'tablets', 78.00, 'SCHEDULE_H', false, false, false),
    ('m0000000-0000-0000-0000-000000000010', 'Jan Aushadhi Telmisartan 40 Tablet', 'jan-aushadhi-telmisartan-40-tablet', 'f0000000-0000-0000-0000-000000000004', 'PMBI', 10.00, 'tablets', 18.00, 'SCHEDULE_H', true, false, false),

    -- Telmisartan 40mg + Amlodipine 5mg
    ('m0000000-0000-0000-0000-000000000011', 'Telma-AM Tablet', 'telma-am-tablet', 'f0000000-0000-0000-0000-000000000005', 'Glenmark Pharmaceuticals Ltd', 15.00, 'tablets', 198.00, 'SCHEDULE_H', false, false, false),
    ('m0000000-0000-0000-0000-000000000012', 'Telmikind-AM Tablet', 'telmikind-am-tablet', 'f0000000-0000-0000-0000-000000000005', 'Mankind Pharma Ltd', 10.00, 'tablets', 95.00, 'SCHEDULE_H', false, false, false),

    -- Atorvastatin 10mg
    ('m0000000-0000-0000-0000-000000000013', 'Atorva 10 Tablet', 'atorva-10-tablet', 'f0000000-0000-0000-0000-000000000006', 'Zydus Cadila', 15.00, 'tablets', 112.50, 'SCHEDULE_H', false, false, false),
    ('m0000000-0000-0000-0000-000000000014', 'Storvas 10 Tablet', 'storvas-10-tablet', 'f0000000-0000-0000-0000-000000000006', 'Sun Pharma Laboratories Ltd', 15.00, 'tablets', 118.00, 'SCHEDULE_H', false, false, false),
    ('m0000000-0000-0000-0000-000000000015', 'Jan Aushadhi Atorvastatin 10 Tablet', 'jan-aushadhi-atorvastatin-10-tablet', 'f0000000-0000-0000-0000-000000000006', 'PMBI', 10.00, 'tablets', 24.00, 'SCHEDULE_H', true, false, false),

    -- Pantoprazole 40mg
    ('m0000000-0000-0000-0000-000000000016', 'Pan 40 Tablet', 'pan-40-tablet', 'f0000000-0000-0000-0000-000000000007', 'Alkem Laboratories Ltd', 15.00, 'tablets', 155.00, 'SCHEDULE_H', false, false, false),
    ('m0000000-0000-0000-0000-000000000017', 'Pantocid 40 Tablet', 'pantocid-40-tablet', 'f0000000-0000-0000-0000-000000000007', 'Sun Pharma Laboratories Ltd', 15.00, 'tablets', 160.00, 'SCHEDULE_H', false, false, false),

    -- Azithromycin 500mg
    ('m0000000-0000-0000-0000-000000000018', 'Azithral 500 Tablet', 'azithral-500-tablet', 'f0000000-0000-0000-0000-000000000008', 'Alembic Pharmaceuticals Ltd', 5.00, 'tablets', 121.50, 'SCHEDULE_H', false, false, false),
    ('m0000000-0000-0000-0000-000000000019', 'Azee 500 Tablet', 'azee-500-tablet', 'f0000000-0000-0000-0000-000000000008', 'Cipla Ltd', 5.00, 'tablets', 123.00, 'SCHEDULE_H', false, false, false)
ON CONFLICT (slug) DO NOTHING;

-- 8. PILOT BENGALURU PHARMACIES (Licensed Retail Premises)
INSERT INTO pharmacies (id, owner_id, business_name, legal_name, gstin, address_line, locality, city, state, pincode, latitude, longitude, phone_number, email, verification_status, is_active, is_demo)
VALUES
    ('p0000000-0000-0000-0000-000000000001', 'd0d0d0d0-0000-0000-0000-000000000002', 'Apollo Pharmacy', 'Apollo Hospitals Enterprise Ltd', '29AAACA2019P1ZE', 'No. 742, 100 Feet Road, HAL 2nd Stage', 'Indiranagar', 'Bengaluru', 'Karnataka', '560038', 12.9718915, 77.6411542, '+918025251100', 'indiranagar@apollopharmacy.in', 'APPROVED', true, false),
    ('p0000000-0000-0000-0000-000000000002', 'd0d0d0d0-0000-0000-0000-000000000003', 'MedPlus Chemist', 'Optival Health Solutions Pvt Ltd', '29AABCO4128N1Z4', 'Shop No. 12, 80 Feet Road, 4th Block', 'Koramangala', 'Bengaluru', 'Karnataka', '560034', 12.9343981, 77.6239120, '+918025532200', 'koramangala@medplusindia.com', 'APPROVED', true, false),
    ('p0000000-0000-0000-0000-000000000003', 'd0d0d0d0-0000-0000-0000-000000000004', 'PMBJP Jan Aushadhi Kendra', 'Shree Mahalakshmi Drug Store', '29AABCS8945M1ZO', 'No. 45, 11th Main Road, 4th Block', 'Jayanagar', 'Bengaluru', 'Karnataka', '560011', 12.9298210, 77.5833410, '+918026643300', 'jayanagar@pmbjpkendra.gov.in', 'APPROVED', true, false),
    ('p0000000-0000-0000-0000-000000000004', 'd0d0d0d0-0000-0000-0000-000000000005', 'Sri Raghavendra Medicals', 'Raghavendra Medical & General Stores', '29AAGPR5412D1Z9', 'No. 88, Sampige Road, Between 7th & 8th Cross', 'Malleshwaram', 'Bengaluru', 'Karnataka', '560003', 13.0035120, 77.5701450, '+918023344400', 'raghavendra.meds@gmail.com', 'APPROVED', true, false),
    -- Unapproved / Draft Pharmacy (For testing RLS public read isolation)
    ('p0000000-0000-0000-0000-000000000005', 'd0d0d0d0-0000-0000-0000-000000000006', 'Pending Test Chemist', 'Pending Legal Drug Store', '29AABCP1111A1Z1', 'No. 1, Test Road', 'Whitefield', 'Bengaluru', 'Karnataka', '560066', 12.9698000, 77.7499000, '+919900112233', 'draftchemist@test.com', 'PENDING_VERIFICATION', true, true)
ON CONFLICT (id) DO NOTHING;

-- 9. VERIFICATION RECORDS (Form 20/21 Statutory Licenses)
INSERT INTO verification_records (id, pharmacy_id, form_20_license_number, form_20_expiry_date, form_21_license_number, form_21_expiry_date, pharmacist_name, pharmacist_reg_number, license_document_url, verified_by, verified_at)
VALUES
    ('v0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'KA-B1-198421', '2028-12-31', 'KA-B1-198422', '2028-12-31', 'Suresh Kumar', 'KPC-45129', 'https://storage.medcompare.in/licenses/apollo-indiranagar.pdf', 'd0d0d0d0-0000-0000-0000-000000000001', NOW()),
    ('v0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000002', 'KA-B2-204511', '2027-06-30', 'KA-B2-204512', '2027-06-30', 'Girish Reddy', 'KPC-38914', 'https://storage.medcompare.in/licenses/medplus-koramangala.pdf', 'd0d0d0d0-0000-0000-0000-000000000001', NOW()),
    ('v0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000003', 'KA-B3-181120', '2029-03-31', 'KA-B3-181121', '2029-03-31', 'Manjunath Swamy', 'KPC-51002', 'https://storage.medcompare.in/licenses/pmbjp-jayanagar.pdf', 'd0d0d0d0-0000-0000-0000-000000000001', NOW()),
    ('v0000000-0000-0000-0000-000000000004', 'p0000000-0000-0000-0000-000000000004', 'KA-B4-112233', '2028-09-30', 'KA-B4-112234', '2028-09-30', 'K. V. Raghavendra', 'KPC-22104', 'https://storage.medcompare.in/licenses/raghavendra-malleshwaram.pdf', 'd0d0d0d0-0000-0000-0000-000000000001', NOW())
ON CONFLICT (pharmacy_id) DO NOTHING;

-- 10. PHARMACY OFFERS (Live Quoted Selling Prices - Verified <= MRP)
INSERT INTO pharmacy_offers (id, pharmacy_id, medicine_id, selling_price, stock_status, observation_timestamp, verification_status, is_active, is_demo)
VALUES
    -- Apollo Pharmacy Indiranagar Offers
    ('o0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 201.15, 'IN_STOCK', NOW(), 'PHARMACY_CONFIRMED', true, false), -- Augmentin (10% off MRP 223.50)
    ('o0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000005', 20.25, 'IN_STOCK', NOW(), 'PHARMACY_CONFIRMED', true, false),  -- Glycomet (10% off MRP 22.50)
    ('o0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000008', 128.25, 'IN_STOCK', NOW(), 'PHARMACY_CONFIRMED', true, false), -- Telma 40 (10% off MRP 142.50)
    ('o0000000-0000-0000-0000-000000000004', 'p0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000013', 101.25, 'IN_STOCK', NOW(), 'PHARMACY_CONFIRMED', true, false), -- Atorva 10 (10% off MRP 112.50)

    -- MedPlus Chemist Koramangala Offers
    ('o0000000-0000-0000-0000-000000000005', 'p0000000-0000-0000-0000-000000000002', 'm0000000-0000-0000-0000-000000000001', 195.00, 'IN_STOCK', NOW(), 'PHARMACY_CONFIRMED', true, false), -- Augmentin (₹195.00)
    ('o0000000-0000-0000-0000-000000000006', 'p0000000-0000-0000-0000-000000000002', 'm0000000-0000-0000-0000-000000000002', 140.00, 'IN_STOCK', NOW(), 'PHARMACY_CONFIRMED', true, false), -- Moxikind-CV (₹140.00 vs MRP 165)
    ('o0000000-0000-0000-0000-000000000007', 'p0000000-0000-0000-0000-000000000002', 'm0000000-0000-0000-0000-000000000008', 125.00, 'IN_STOCK', NOW(), 'PHARMACY_CONFIRMED', true, false), -- Telma 40 (₹125.00 vs MRP 142.50)

    -- PMBJP Jan Aushadhi Kendra Jayanagar Offers (Govt Generic Baseline)
    ('o0000000-0000-0000-0000-000000000008', 'p0000000-0000-0000-0000-000000000003', 'm0000000-0000-0000-0000-000000000004', 58.00, 'IN_STOCK', NOW(), 'PHARMACY_CONFIRMED', true, false),  -- Jan Aushadhi Amoxy-Clav 625 (₹58.00!)
    ('o0000000-0000-0000-0000-000000000009', 'p0000000-0000-0000-0000-000000000003', 'm0000000-0000-0000-0000-000000000006', 6.50, 'IN_STOCK', NOW(), 'PHARMACY_CONFIRMED', true, false),   -- Jan Aushadhi Metformin 500 (₹6.50!)
    ('o0000000-0000-0000-0000-000000000010', 'p0000000-0000-0000-0000-000000000003', 'm0000000-0000-0000-0000-000000000010', 18.00, 'IN_STOCK', NOW(), 'PHARMACY_CONFIRMED', true, false),  -- Jan Aushadhi Telmisartan 40 (₹18.00!)
    ('o0000000-0000-0000-0000-000000000011', 'p0000000-0000-0000-0000-000000000003', 'm0000000-0000-0000-0000-000000000015', 24.00, 'IN_STOCK', NOW(), 'PHARMACY_CONFIRMED', true, false),  -- Jan Aushadhi Atorvastatin 10 (₹24.00!)

    -- Sri Raghavendra Medicals Malleshwaram (Independent Chemist with discounts)
    ('o0000000-0000-0000-0000-000000000012', 'p0000000-0000-0000-0000-000000000004', 'm0000000-0000-0000-0000-000000000001', 190.00, 'IN_STOCK', NOW(), 'PHARMACY_CONFIRMED', true, false), -- Augmentin 625 (₹190.00)
    ('o0000000-0000-0000-0000-000000000013', 'p0000000-0000-0000-0000-000000000004', 'm0000000-0000-0000-0000-000000000002', 135.00, 'IN_STOCK', NOW(), 'PHARMACY_CONFIRMED', true, false), -- Moxikind-CV 625 (₹135.00)
    ('o0000000-0000-0000-0000-000000000014', 'p0000000-0000-0000-0000-000000000004', 'm0000000-0000-0000-0000-000000000005', 18.00, 'IN_STOCK', NOW(), 'PHARMACY_CONFIRMED', true, false),  -- Glycomet 500 (₹18.00)
    ('o0000000-0000-0000-0000-000000000015', 'p0000000-0000-0000-0000-000000000004', 'm0000000-0000-0000-0000-000000000008', 120.00, 'LIMITED_STOCK', NOW(), 'PHARMACY_CONFIRMED', true, false) -- Telma 40 (₹120.00)
ON CONFLICT (pharmacy_id, medicine_id) DO NOTHING;

-- 11. PRICE HISTORY (Demonstrating Immutability & Provenance)
INSERT INTO price_history (id, offer_id, pharmacy_id, medicine_id, previous_price, new_price, previous_stock, new_stock, change_source, observation_timestamp, archived_at)
VALUES
    ('h0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 212.00, 201.15, 'IN_STOCK', 'IN_STOCK', 'CSV_IMPORT', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
    ('h0000000-0000-0000-0000-000000000002', 'o0000000-0000-0000-0000-000000000005', 'p0000000-0000-0000-0000-000000000002', 'm0000000-0000-0000-0000-000000000001', 205.00, 195.00, 'IN_STOCK', 'IN_STOCK', 'DASHBOARD_EDIT', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days')
ON CONFLICT (id) DO NOTHING;

