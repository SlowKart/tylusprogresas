import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs"; // Ensure Node.js runtime for file handling

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  // Debug: log all keys
  for (const [key, value] of formData.entries()) {
    console.log("FormData key:", key, "value:", value);
  }
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Generate a unique filename (timestamp + original name)
  const filename = `${Date.now()}-${(file as File).name}`;

  // Upload to Supabase Storage
  const { error } = await supabase.storage
    .from("program-pdfs")
    .upload(filename, file as File, {
      contentType: (file as File).type || "application/pdf",
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, filename });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
