import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { imageKey, videoKey, eegKey } = await req.json();

  // 🔮 Call ML / SPI API (placeholder)
  const output = { score: 0.87, risk: "medium" };

  // get test number
  const { count } = await supabase
    .from("screening")
    .select("*", { count: "exact", head: true });

  await supabase.from("screening").insert({
    user_id: "AUTH_USER_UUID_HERE", // replace via auth
    image_key: imageKey,
    video_key: videoKey,
    eeg_key: eegKey,
    screening_output: output,
    test_number: (count ?? 0) + 1,
  });

  return NextResponse.json({ output });
}
