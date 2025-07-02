import { config } from "dotenv";
config({ path: ".env.local" });

import { supabase } from "./src/lib/supabase";
// Use require for pdf-parse to avoid esModuleInterop issues in CJS/TS
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require("pdf-parse");

async function main() {
  // List all files in the bucket
  const { data: files, error: listError } = await supabase.storage
    .from("program-pdfs")
    .list("");
  if (listError) {
    console.error("Failed to list files:", listError.message);
    process.exit(1);
  }
  if (!files || files.length === 0) {
    console.log("No files found in bucket.");
    return;
  }

  for (const file of files) {
    if (!file.name.endsWith(".pdf")) continue;
    console.log(`Processing: ${file.name}`);
    const { data, error } = await supabase.storage
      .from("program-pdfs")
      .download(file.name);
    if (error || !data) {
      console.error(`Failed to download ${file.name}:`, error?.message);
      continue;
    }
    try {
      const arrayBuffer = await data.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const parsed = await pdfParse(buffer);
      const text = parsed.text;
      // Upsert into pdf_texts table
      const { error: upsertError } = await supabase
        .from("pdf_texts")
        .upsert({ filename: file.name, text })
        .select();
      if (upsertError) {
        console.error(`Failed to upsert ${file.name}:`, upsertError.message);
      } else {
        console.log(`Stored text for: ${file.name}`);
      }
    } catch (err) {
      console.error(`Error processing ${file.name}:`, err);
    }
  }
  console.log("Done.");
}

main();
