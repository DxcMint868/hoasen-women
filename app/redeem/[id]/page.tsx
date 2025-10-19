import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import RedemptionCard from "@/components/redemption-card"

export default async function RedemptionPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Fetch woman profile
  const { data: woman, error: womanError } = await supabase
    .from("women_profiles")
    .select("*")
    .eq("id", params.id)
    .single()

  if (womanError || !woman) {
    redirect("/")
  }

  // Fetch redemption record
  const { data: redemption } = await supabase.from("redemptions").select("*").eq("woman_id", params.id).single()

  // Fetch personal message
  const { data: messages } = await supabase
    .from("messages")
    .select("content")
    .eq("woman_id", params.id)
    .eq("message_type", "personal")
    .limit(1)

  const personalMessage = messages?.[0]?.content || "Thank you for being part of Hoasen!"

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-purple-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌸</span>
              </div>
              <h1 className="text-2xl font-bold text-purple-900">Hoasen</h1>
            </a>
            <p className="text-sm text-purple-600 font-medium">Women's Day Celebration 2024</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <RedemptionCard woman={woman} redemption={redemption} personalMessage={personalMessage} />
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-100 bg-white/50 backdrop-blur-sm mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-sm text-purple-600">Made with care for the women of Hoasen • October 20, 2024</p>
        </div>
      </footer>
    </main>
  )
}
