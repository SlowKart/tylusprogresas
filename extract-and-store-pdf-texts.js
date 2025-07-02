require("dotenv").config({ path: ".env.local" });

const { supabaseAdmin } = require("./src/lib/supabaseAdmin.cjs");
const pdfParse = require("pdf-parse");

async function processFiles() {
  try {
    const { data: files, error } = await supabaseAdmin.storage
      .from("program-pdfs")
      .list();

    if (error) {
      console.error("Error listing files:", error.message);
      return;
    }

    for (const file of files) {
      console.log(`Processing: ${file.name}`);
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
        const text = parsed.text;

        // Delete existing row first
        await supabaseAdmin
          .from("pdf_texts")
          .delete()
          .eq("filename", file.name);

        // Then insert new row
        const { error: insertError } = await supabaseAdmin
          .from("pdf_texts")
          .insert({ filename: file.name, text });

        if (insertError) {
          console.error(`Failed to insert ${file.name}:`, insertError.message);
          continue;
        }
        console.log(`Stored text for: ${file.name}`);
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
