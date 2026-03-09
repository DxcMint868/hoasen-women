import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import type { VoucherCard } from "@/lib/wheel-segments";

export type { VoucherCard };

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const womanId = searchParams.get("womanId");

  if (!womanId) {
    return NextResponse.json({ error: "Missing womanId" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("voucher_cards")
    .select("*")
    .eq("assigned_to", womanId)
    .single();

  if (error || !data) {
    return NextResponse.json({ card: null });
  }

  return NextResponse.json({ card: data as VoucherCard });
}
