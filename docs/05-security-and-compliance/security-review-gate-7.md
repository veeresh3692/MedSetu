# SECURITY REVIEW & PENETRATION AUDIT REPORT
## MEDICOMPARE INDIA — GATE 7 (SECURITY) & GATE 8 (DOCUMENTATION) REVIEW
**Document ID:** `SEC-AUDIT-20261108-001`  
**Task ID:** `MC-006-SEC-AUDIT`  
**Target Migration:** `supabase/migrations/20261108000000_initial_schema.sql`  
**Associated Specs:** `docs/03-architecture/database-design.md`, `docs/03-architecture/erd.md`  
**Auditor:** AGENT 12 — Security Engineer  
**Implementing Author:** AGENT 11 — Database Engineer  
**Date:** 2026-11-08  
**Gate Decision:** `APPROVED` (Hardening patch applied and verified)  

---

## 1. Executive Summary

As AGENT 12 (Security Engineer), an independent penetration audit and static threat analysis was conducted on the initial PostgreSQL schema and Supabase Row Level Security (RLS) implementation authored by Agent 11.

The architectural foundation demonstrates commendable security hygiene:
- **100% RLS Coverage**: All 13 relational tables have `ROW LEVEL SECURITY` explicitly enabled.
- **Privacy by Design**: The schema is strictly compliant with the **Digital Personal Data Protection (DPDP) Act, 2023**, with **zero storage** of consumer prescription images, health records, or persistent search coordinates.
- **Relational Defense-in-Depth**: Statutory price ceiling (`selling_price <= mrp`) is validated at the database level via a `BEFORE INSERT OR UPDATE` trigger.

However, the penetration analysis uncovered **two CRITICAL privilege escalation vulnerabilities** and **one HIGH severity trigger runtime defect** that must be remediated before the migration can be safely approved for production:
1. **[CRITICAL] Self-Approval Vulnerability (CWE-285)**: Pharmacy operators can directly update their own store's `verification_status` to `'APPROVED'` via client-side REST PATCH, bypassing mandatory Form 20/21 drug license verification.
2. **[CRITICAL] Role Escalation Vulnerability (CWE-269)**: Authenticated users can modify their own `profiles.role` to `'platform_admin'` via client-side REST PATCH.
3. **[HIGH] RLS Denial of Service on Price History Trigger (CWE-276 / CWE-732)**: The trigger function `fn_archive_price_history()` lacks `SECURITY DEFINER`. When an authenticated pharmacy operator updates an offer, the trigger fails because `price_history` has RLS enabled with no `INSERT` policy for `authenticated`, causing all price updates to fail.
4. **[MEDIUM] Price History Information Disclosure (CWE-200)**: `price_history` public read policy is `USING (true)`, leaking price adjustments of unapproved or draft pharmacies.

---

## 2. Evaluation Against Cardinal Review Criteria

| # | Evaluation Criteria | Status | Detailed Findings |
| :--- | :--- | :---: | :--- |
| **1** | **RLS Enabled on 100% of 13 Tables** | **PASSED** | Explicitly enabled on `profiles`, `active_ingredients`, `formulations`, `formulation_ingredients`, `medicines`, `government_price_references`, `pharmacies`, `verification_records`, `pharmacy_offers`, `price_history`, `data_import_jobs`, `price_reports`, and `audit_logs`. Default deny posture verified. |
| **2** | **Public Read Strictly Isolated to Verified Data** | **DEFECT (MEDIUM)** | Public read for `medicines` correctly excludes discontinued items (`is_discontinued = false`). Public read for `pharmacies` and `pharmacy_offers` strictly requires `verification_status = 'APPROVED'` and `is_active = true`. However, `price_history` has an unconditioned `USING (true)` policy, exposing price mutations of unapproved pharmacies. Additionally, `pharmacy_offers` public read should permit `ADMIN_AUDITED` offers alongside `PHARMACY_CONFIRMED`. |
| **3** | **Tenant Isolation (Cross-Pharmacy Protection)** | **DEFECT (CRITICAL)** | Tenant isolation prevents Pharmacy A from selecting, mutating, or deleting Pharmacy B's inventory, verification records, or import jobs. **However**, within Pharmacy A's own tenant boundary, there are no column-level guardrails preventing Pharmacy A from updating `verification_status = 'APPROVED'` on `pharmacies` or tampering with `verified_by`/`verified_at` on `verification_records`. Furthermore, any user can self-escalate `profiles.role = 'platform_admin'`. |
| **4** | **Tamper-Proof Immutability Triggers** | **DEFECT (HIGH)** | `fn_enforce_selling_price_ceiling()` enforces statutory ceiling. `REVOKE UPDATE, DELETE, TRUNCATE` is applied on `price_history` and `audit_logs`. **However**, `fn_archive_price_history()` runs as `SECURITY INVOKER`. Since `authenticated` has no direct `INSERT` grant or policy on `price_history`, the trigger crashes with an RLS violation upon every price update. Functions also lack `SET search_path = public`. |
| **5** | **DPDP Act 2023 Consumer Privacy Compliance** | **PASSED** | Zero consumer medical records, prescription images, or diagnostic notes are stored. Consumer geolocation coordinates are never persisted. `price_reports` is pseudonymous. Anonymous consumers can search and compare prices without mandatory account registration. |

---

## 3. Vulnerability Details & Exploit Analysis

### Vulnerability Finding SEC-01 [CRITICAL]
- **Vulnerability**: Unrestricted Client-Side Pharmacy Verification Status Elevation
- **CWE**: CWE-285 (Improper Authorization) / CWE-269 (Improper Privilege Management)
- **Attack Vector**:
  An unverified pharmacy operator registers an account, creating a row in `pharmacies` with `verification_status = 'PENDING_VERIFICATION'`. Using their Supabase JWT, the operator executes:
  ```http
  PATCH /rest/v1/pharmacies?id=eq.<pharmacy_id> HTTP/1.1
  Host: <supabase-project>.supabase.co
  Authorization: Bearer <jwt-of-pharmacy-operator>
  Content-Type: application/json

  {
    "verification_status": "APPROVED"
  }
  ```
- **Root Cause**: The RLS policy `"Pharmacy operators update own pharmacy"` uses `WITH CHECK (owner_id = auth.uid())` without validating that privileged columns (`verification_status`) remain untouched.
- **Exploit Impact**: Bypasses statutory Drug License Form 20/21 verification, allowing illegal, unlicensed drug retailers or scam storefronts to display offers to consumers.

---

### Vulnerability Finding SEC-02 [CRITICAL]
- **Vulnerability**: Vertical Privilege Escalation to Platform Administrator
- **CWE**: CWE-269 (Improper Privilege Management)
- **Attack Vector**:
  Any registered user (`consumer` or `pharmacy_operator`) issues a PATCH request to `profiles`:
  ```http
  PATCH /rest/v1/profiles?id=eq.<user_id> HTTP/1.1
  Host: <supabase-project>.supabase.co
  Authorization: Bearer <jwt-of-any-user>
  Content-Type: application/json

  {
    "role": "platform_admin"
  }
  ```
- **Root Cause**: The RLS policy `"Users update own profile"` allows updating any column where `id = auth.uid()`.
- **Exploit Impact**: The attacker gains `platform_admin` privileges across all application Route Handlers and backend admin portals relying on `profiles.role`.

---

### Vulnerability Finding SEC-03 [HIGH]
- **Vulnerability**: Trigger Failure and Denial of Service on Pharmacy Price Updates
- **CWE**: CWE-276 (Incorrect Default Permissions) / CWE-732 (Incorrect Permission Assignment)
- **Attack Vector / Failure Mode**:
  An authenticated pharmacy operator attempts to update their medicine selling price or stock status. The PostgreSQL trigger `trg_archive_price_history` fires before update and executes `fn_archive_price_history()`.
  Because the function is `SECURITY INVOKER`, it attempts to insert into `price_history` using the calling role (`authenticated`).
  `price_history` has RLS enabled with NO `INSERT` policy for `authenticated`.
  PostgreSQL raises: `ERROR: new row violates row-level security policy for table "price_history"`.
  The transaction is rolled back, preventing any chemist from ever updating their prices or stock status!
- **Root Cause**: Missing `SECURITY DEFINER` on trigger function `fn_archive_price_history()`.

---

### Vulnerability Finding SEC-04 [MEDIUM]
- **Vulnerability**: Information Disclosure of Draft and Unapproved Pharmacy Pricing Data
- **CWE**: CWE-200 (Exposure of Sensitive Information)
- **Root Cause**: Policy `"Public read price history"` uses `USING (true)`.
- **Exploit Impact**: Anon users can query price history of draft or rejected pharmacies.

---

### Vulnerability Finding SEC-05 [LOW]
- **Vulnerability**: Untrusted Search Path on Database Functions
- **CWE**: CWE-426 (Untrusted Search Path)
- **Root Cause**: Trigger functions do not explicitly declare `SET search_path = public`.

---

## 4. Remediation Migration Script (Security Hardening Patch)

To resolve all identified vulnerabilities, the following SQL patch must be integrated into `supabase/migrations/20261108000000_initial_schema.sql` (or executed as `supabase/migrations/20261108000001_security_hardening.sql`):

```sql
-- ==============================================================================
-- MEDICOMPARE INDIA — SECURITY HARDENING MIGRATION PATCH
-- Remediates: SEC-01, SEC-02, SEC-03, SEC-04, SEC-05
-- ==============================================================================

-- 1. FIX SEC-02: Prevent User Role Escalation on profiles
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

DROP TRIGGER IF EXISTS trg_prevent_profile_role_escalation ON profiles;
CREATE TRIGGER trg_prevent_profile_role_escalation
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION fn_prevent_profile_role_escalation();

-- 2. FIX SEC-01: Prevent Pharmacy Operators from Self-Approving Store Status
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

DROP TRIGGER IF EXISTS trg_protect_pharmacy_status ON pharmacies;
CREATE TRIGGER trg_protect_pharmacy_status
BEFORE UPDATE ON pharmacies
FOR EACH ROW
EXECUTE FUNCTION fn_protect_pharmacy_status();

-- 3. FIX SEC-01 (Part 2): Protect Verification Records Audit Metadata
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

DROP TRIGGER IF EXISTS trg_protect_verification_records ON verification_records;
CREATE TRIGGER trg_protect_verification_records
BEFORE UPDATE ON verification_records
FOR EACH ROW
EXECUTE FUNCTION fn_protect_verification_records();

-- 4. FIX SEC-03 & SEC-05: Security Definer on Price History Trigger Function
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

-- 5. Harden Helper Functions with Explicit search_path
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

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

-- 6. FIX SEC-04: Narrow price_history Public Read Policy
DROP POLICY IF EXISTS "Public read price history" ON price_history;

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

-- 7. Expand pharmacy_offers Public Read to Include ADMIN_AUDITED
DROP POLICY IF EXISTS "Public read verified pharmacy offers" ON pharmacy_offers;

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

-- 8. Explicitly Revoke INSERT on Tamper-Proof Tables
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON price_history FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON audit_logs FROM anon, authenticated;
```

---

## 5. Review Decisions & Sign-Off Statements

### Gate 7 — Security Review Sign-Off
- **Target Deliverable:** `supabase/migrations/20261108000000_initial_schema.sql`
- **Initial Decision:** `CHANGES_REQUESTED` (2026-11-08 14:33 IST)
- **Final Decision:** **`APPROVED`** (2026-11-08 15:15 IST)
- **Remediation Verification:**
  1. Anti-tampering triggers (`trg_prevent_profile_role_escalation`, `trg_protect_pharmacy_status`, `trg_protect_verification_records`) successfully added with `SECURITY DEFINER SET search_path = public`.
  2. Runtime trigger blocker resolved: `fn_archive_price_history()` updated with `SECURITY DEFINER SET search_path = public`.
  3. `price_history` public read policy successfully narrowed to verified approved pharmacies only.
  4. `pharmacy_offers` public read extended to `ADMIN_AUDITED`.
  5. Direct client `INSERT` explicitly revoked alongside `UPDATE, DELETE, TRUNCATE` on `price_history` and `audit_logs`.

### Gate 8 — Documentation Review Sign-Off
- **Target Deliverables:** `docs/03-architecture/database-design.md`, `docs/03-architecture/erd.md`
- **Review Decision:** **`APPROVED`**
- **Findings:** Documentation has been updated to reflect anti-tampering triggers, finalized RLS policy rules, and ERD cardinalities.

---

**Signed by:**  
**AGENT 12 — Security Engineer, MediCompare India**  
*Cybersecurity & RLS Verification Directorate*  
*Date: 2026-11-08*

