import { createRequire } from "module";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables (url / service key)");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function processFiles() {
  try {
    // Get all PDF files from storage
    const { data: files, error } = await supabaseAdmin.storage
      .from("program-pdfs")
      .list();

    if (error) {
      console.error("Error listing files:", error.message);
      return;
    }

    // Get already parsed files from database
    const { data: parsedFiles, error: dbError } = await supabaseAdmin
      .from("pdf_texts")
      .select("filename");

    if (dbError) {
      console.error("Error fetching parsed files:", dbError.message);
      return;
    }

    const parsedFilenames = new Set(parsedFiles.map(f => f.filename));
    
    // Filter out already parsed files and non-PDF files
    const newFiles = files.filter(file => 
      !parsedFilenames.has(file.name) && 
      file.name.toLowerCase().endsWith('.pdf')
    );
    
    console.log(`Found ${files.length} total files, ${newFiles.length} new PDF files to process`);

    if (newFiles.length === 0) {
      console.log("No new PDF files to process");
      return;
    }

    for (const file of newFiles) {
      console.log(`Processing new PDF: ${file.name}`);
      try {
        const { data, error: downloadError } = await supabaseAdmin.storage
          .from("program-pdfs")
          .download(file.name);

        if (downloadError) {
          console.error(
            `Error downloading ${file.name}:`,
            downloadError.message
          );
          continue;
        }

        const arrayBuffer = await data.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const parsed = await pdfParse(buffer);
        
        // Clean the text to handle Unicode issues
        const text = parsed.text
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
          .replace(/\\/g, '\\\\') // Escape backslashes
          .trim();

        // Insert new row (no need to delete since we filtered out existing ones)
        const { error: insertError } = await supabaseAdmin
          .from("pdf_texts")
          .insert({ filename: file.name, text });

        if (insertError) {
          console.error(`Failed to insert ${file.name}:`, insertError.message);
          continue;
        }
        console.log(`✓ Stored text for: ${file.name}`);
      } catch (err) {
        console.error(`Error processing ${file.name}:`, err);
      }
    }
  } catch (err) {
    console.error("Error in processFiles:", err);
  }
}

async function main() {
  await processFiles();
  console.log("Done.");
}

main().catch(console.error);
