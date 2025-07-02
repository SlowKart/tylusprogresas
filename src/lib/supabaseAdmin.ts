import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client with SERVICE_ROLE key (full privileges).
 * NEVER import this from client-side code.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables (url / service key)");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
