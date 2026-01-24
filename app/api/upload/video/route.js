import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    const key = `${crypto.randomUUID()}.mp4`;

    const { data, error } = await supabase.storage
      .from("videos")
      .upload(key, file, { contentType: file.type });

    if (error) {
      console.log("SUPABASE UPLOAD ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, key: data.path });
  } catch (err) {
    console.error("Video Upload Error: ", err);
    return Response.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
