import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import { WHEEL_SEGMENTS } from "@/lib/wheel-segments";

export { WHEEL_SEGMENTS };

export async function POST(request: NextRequest) {
  try {
    const { womanId } = await request.json();
    if (!womanId) {
      return NextResponse.json({ error: "Missing womanId" }, { status: 400 });
    }

    const supabase = await createClient();

    // Return existing result if already spun — idempotent
    const { data: existing } = await supabase
      .from("spin_results")
      .select("*")
      .eq("woman_id", womanId)
      .single();

    if (existing) {
      const segmentIndex = WHEEL_SEGMENTS.findIndex(s => s.key === existing.gift_key);
      return NextResponse.json({
        alreadySpun: true,
        giftKey: existing.gift_key,
        segmentIndex,
        label: WHEEL_SEGMENTS[segmentIndex]?.label,
      });
    }

    // Pool availability
    const { data: pool } = await supabase
      .from("gift_pool")
      .select("gift_key, available");

    const availabilityMap: Record<string, number> = {};
    (pool || []).forEach(p => { availabilityMap[p.gift_key] = p.available; });

    // ── Voucher probability ────────────────────────────────────────────────
    // Base chance: 1 / totalWomen (e.g. 20% for 5 women)
    // If ≤ 2 women have yet to spin (including the current one): rises to 40%
    // If voucher pool is empty: 0%
    const { count: totalWomen } = await supabase
      .from("women_profiles")
      .select("*", { count: "exact", head: true });

    const { count: spunCount } = await supabase
      .from("spin_results")
      .select("*", { count: "exact", head: true });

    const total = totalWomen ?? 5;
    // +1 because current person hasn't been recorded yet
    const remaining = total - (spunCount ?? 0);
    const voucherAvailable = (availabilityMap["voucher"] ?? 0) > 0;
    const voucherChance = voucherAvailable
      ? remaining <= 2 ? 0.40 : 1 / total
      : 0;

    // ── Determine winner ───────────────────────────────────────────────────
    let winner: (typeof WHEEL_SEGMENTS)[number];

    if (Math.random() < voucherChance) {
      winner = WHEEL_SEGMENTS.find(s => s.key === "voucher")!;
    } else {
      // Pick from all non-voucher segments; respect company_trip pool
      const eligible = WHEEL_SEGMENTS.filter(
        s => s.key !== "voucher" && (!s.limited || (availabilityMap[s.key] ?? 0) > 0)
      );
      winner = eligible[Math.floor(Math.random() * eligible.length)];
    }

    // ── Deduct pool if limited ────────────────────────────────────────────
    if (winner.limited) {
      await supabase
        .from("gift_pool")
        .update({ available: (availabilityMap[winner.key] ?? 1) - 1 })
        .eq("gift_key", winner.key);
    }

    // ── Assign a voucher card if she won the voucher ──────────────────────
    if (winner.key === "voucher") {
      const { data: unassignedCard } = await supabase
        .from("voucher_cards")
        .select("id")
        .is("assigned_to", null)
        .limit(1)
        .single();

      if (unassignedCard) {
        await supabase
          .from("voucher_cards")
          .update({ assigned_to: womanId })
          .eq("id", unassignedCard.id);
      }
    }

    // ── Record spin result ────────────────────────────────────────────────
    await supabase
      .from("spin_results")
      .insert({ woman_id: womanId, gift_key: winner.key });

    const segmentIndex = WHEEL_SEGMENTS.findIndex(s => s.key === winner.key);

    return NextResponse.json({
      alreadySpun: false,
      giftKey: winner.key,
      segmentIndex,
      label: winner.label,
    });
  } catch (error) {
    console.error("Spin wheel error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const womanId = searchParams.get("womanId");

  if (!womanId) {
    return NextResponse.json({ error: "Missing womanId" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("spin_results")
    .select("*")
    .eq("woman_id", womanId)
    .single();

  const { data: pool } = await supabase
    .from("gift_pool")
    .select("gift_key, available");

  return NextResponse.json({
    alreadySpun: !!existing,
    giftKey: existing?.gift_key ?? null,
    pool: pool ?? [],
    segments: WHEEL_SEGMENTS,
  });
}
