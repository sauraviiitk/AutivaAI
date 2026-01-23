import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    const key = `eeg/${crypto.randomUUID()}.csv`;

    await supabase.storage
      .from("eeg")
      .upload(key, file, { contentType: "text/csv" });

    return NextResponse.json({ sucess: true, key: key });
  } catch (err) {
    console.error("EEG Upload Error: ", err);
    return Response.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
