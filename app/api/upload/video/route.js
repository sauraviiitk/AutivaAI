import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    const key = `videos/${crypto.randomUUID()}.mp4`;

    await supabase.storage
      .from("videos")
      .upload(key, file, { contentType: file.type });

    return NextResponse.json({ sucess: true, key: key });
  } catch (err) {
    console.error("Video Upload Error: ", err);
    return Response.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
