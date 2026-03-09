import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RedemptionCard from "@/components/redemption-card";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { WHEEL_SEGMENTS, type VoucherCard } from "@/lib/wheel-segments";

export default async function RedemptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: woman, error: womanError } = await supabase
    .from("women_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (womanError || !woman) redirect("/");

  const { data: messages, error: msgError } = await supabase
    .from("messages")
    .select("*")
    .eq("woman_id", id)
    .eq("message_type", "personal")
    .limit(1);

  if (msgError) console.error("Error fetching message:", msgError.message);

  const personalMessage =
    messages?.[0]?.content || "Thank you for being a part of Hoasen.";
  const flowers: string[] = messages?.[0]?.flowers
    ? (messages[0].flowers as string).split(",").map((f: string) => f.trim())
    : ["rose", "daisy"];

  // Check if she already spun
  const { data: spinResult } = await supabase
    .from("spin_results")
    .select("gift_key")
    .eq("woman_id", id)
    .single();

  const resolvedSpinResult = spinResult
    ? {
        giftKey: spinResult.gift_key,
        label: WHEEL_SEGMENTS.find(s => s.key === spinResult.gift_key)?.label ?? spinResult.gift_key,
      }
    : null;

  // If she won a voucher, fetch the card so the page renders correctly on load
  let voucherCard: VoucherCard | null = null;
  if (spinResult?.gift_key === "voucher") {
    const { data } = await supabase
      .from("voucher_cards")
      .select("*")
      .eq("assigned_to", id)
      .single();
    voucherCard = (data as VoucherCard) ?? null;
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg, #3B1578 0%, #2d1b4e 50%, #1a0a30 100%)" }}
    >
      {/* Gold noise across the entire page */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url(/textures/gold-noise.png)",
          backgroundSize: "280px",
          opacity: 0.045,
          mixBlendMode: "screen",
        }}
      />

      {/* Gold fluid top sweep */}
      <div
        className="absolute top-0 left-0 right-0 h-[420px] pointer-events-none z-0"
        style={{
          backgroundImage: "url(/textures/gold-fluid.png)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          opacity: 0.12,
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Gold radial glow — top left */}
      <div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] pointer-events-none z-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(245,200,66,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Gold radial glow — bottom right */}
      <div
        className="absolute -bottom-32 -right-32 w-[420px] h-[420px] pointer-events-none z-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(245,200,66,0.09) 0%, transparent 70%)",
        }}
      />

      {/* Thin gold horizontal accent lines */}
      <div
        className="absolute left-0 right-0 pointer-events-none z-0"
        style={{ top: 1, height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(245,200,66,0.35) 30%, rgba(245,200,66,0.55) 50%, rgba(245,200,66,0.35) 70%, transparent 100%)" }}
      />

      <SiteHeader />

      <section className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <RedemptionCard
          woman={woman}
          personalMessage={personalMessage}
          flowers={flowers}
          spinResult={resolvedSpinResult}
          voucherCard={voucherCard}
        />
      </section>

      <SiteFooter />
    </main>
  );
}
