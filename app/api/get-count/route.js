import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const { count, error } = await supabase
      .from("screening")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) {
      console.error("Error at get count: ", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ count }, { status: 200 });
  } catch (err) {
    console.error("Error at get count: ", err);
    return NextResponse.json(
      { error: "Something went wrong", details: err.message },
      { status: 500 },
    );
  }
}
