import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    const key = `${crypto.randomUUID()}.csv`;

    const { data, error } = await supabase.storage
      .from("eeg") // ✅ bucket name must exist
      .upload(key, file, { contentType: "text/csv" });

    if (error) {
      console.log("SUPABASE UPLOAD ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, key: data.path });
  } catch (err) {
    console.error("EEG Upload Error: ", err);
    return Response.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
