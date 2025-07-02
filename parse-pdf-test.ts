import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import pdfParse from "pdf-parse";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const filename = "1751479628645-reload.pdf";
  const { data, error } = await supabase.storage
    .from("program-pdfs")
    .download(filename);
  if (error || !data) {
    console.error("Failed to download PDF:", error?.message);
    process.exit(1);
  }
  // data is a Blob, convert to Buffer
  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const parsed = await pdfParse(buffer);
  console.log("Extracted text:\n", parsed.text);
}

main();
