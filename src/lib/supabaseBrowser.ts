import { createClient } from "@supabase/supabase-js";

/**
 * Browser-safe Supabase client using the PUBLIC anon key.
 * Suitable for React Client Components.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables (url / anon key)");
}

export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);
