import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database.types";

/**
 * Service-role client. Bypasses RLS entirely.
 *
 * ONLY import this from webhook route handlers (app/api/webhooks/**) where no
 * user session exists. Every other privileged action (admin dashboard, etc.)
 * must run as the acting user's own authenticated session and rely on RLS —
 * see lib/supabase/server.ts.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey || serviceRoleKey.includes("REPLACE_ME")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured — set a real key before using webhook routes.",
    );
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
