import { config } from "dotenv";
config({ path: ".env.local" });

import { supabaseAdmin } from "./src/lib/supabaseAdmin";

// @ts-ignore: pdf-parse doesn't have proper types
const pdfParse = require("pdf-parse");

// Type declaration for pdf-parse
type PDFInfo = {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creationDate?: Date;
  modDate?: Date;
};

type PDFMetadata = {
  contentType?: string;
  creator?: string;
  producer?: string;
};

type PDFParseResult = {
  numpages: number;
  numrender: number;
  info: PDFInfo;
  metadata: PDFMetadata;
  text: string;
  version: string;
};

declare module "pdf-parse/lib" {
  function pdfParse(dataBuffer: Buffer): Promise<PDFParseResult>;
  namespace pdfParse {}
  export = pdfParse;
}

async function main() {
  // List all files in the bucket
  const { data: files, error: listError } = await supabaseAdmin.storage
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
    const { data, error } = await supabaseAdmin.storage
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
      // Try to update first
      const { error: updateError } = await supabaseAdmin
        .from("pdf_texts")
        .update({ text })
        .eq("filename", file.name);

      if (updateError) {
        // If update failed (no existing row), insert
        const { error: insertError } = await supabaseAdmin
          .from("pdf_texts")
          .insert({ filename: file.name, text });
        if (insertError) {
          console.error(`Failed to insert ${file.name}:`, insertError.message);
          continue;
        }
      }
      console.log(`Stored text for: ${file.name}`);
    } catch (err) {
      console.error(`Error processing ${file.name}:`, err);
    }
  }
  console.log("Done.");
}

main();
