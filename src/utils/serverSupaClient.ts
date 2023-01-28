import { createClient } from "@supabase/supabase-js";

// For use only on the server
export function createSupaServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_PRIVATE!
  );
}
