import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RedemptionCard from "@/components/redemption-card";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default async function RedemptionPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Fetch woman profile
  const { data: woman, error: womanError } = await supabase
    .from("women_profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (womanError || !woman) {
    redirect("/");
  }

  // Fetch redemption record
  const { data: redemption } = await supabase
    .from("redemptions")
    .select("*")
    .eq("woman_id", params.id)
    .single();

  // Fetch personal message
  const { data: messages } = await supabase
    .from("messages")
    .select("content")
    .eq("woman_id", params.id)
    .eq("message_type", "personal")
    .limit(1);

  const personalMessage =
    messages?.[0]?.content || "Thank you for being part of Hoasen!";

  return (
    <main className="min-h-screen bg-[#9470DC]">
      <SiteHeader />

      {/* Main Content */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <RedemptionCard
          woman={woman}
          redemption={redemption}
          personalMessage={personalMessage}
        />
      </section>

      <SiteFooter />
    </main>
  );
}
