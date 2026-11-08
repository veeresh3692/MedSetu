// ==============================================================================
// MEDICOMPARE INDIA — SUPABASE SERVER CLIENT UTILITY
// File: src/lib/server/supabase.ts
// Governance: AGENTS.md, Rule 03 (Zero Secret Exposure, RLS by Default)
// ==============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Creates a public / consumer Supabase client.
 * Strictly operates under PostgreSQL Row Level Security (RLS) as `anon` role.
 */
export function getSupabaseAnonClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Creates a privileged administrative Supabase client using service_role.
 * STRICTLY RESTRICTED: Used exclusively within verified server-side Route Handlers for admin workflows.
 * NEVER exposed to client bundles.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined in the server environment.');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

