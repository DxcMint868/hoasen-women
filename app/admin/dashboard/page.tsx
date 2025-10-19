import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminDashboard from "@/components/admin-dashboard"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch all women profiles with their redemption status
  const { data: women, error } = await supabase.from("women_profiles").select(`
    id,
    name,
    slack_pfp_url,
    created_at,
    redemptions (
      id,
      phuc_long_code,
      usdt_claimed,
      nft_claimed,
      claimed_at,
      wallet_address
    )
  `)

  if (error) {
    console.error("Error fetching women profiles:", error)
    redirect("/admin/login")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <AdminDashboard women={women || []} />
    </main>
  )
}
