import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Supabase connection failed:", error.message);
    process.exit(1);
  }
  console.log("Supabase connection successful! Buckets:", data);
}

testConnection();
