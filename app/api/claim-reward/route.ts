import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { redemptionId, walletAddress } = await request.json()

    if (!redemptionId || !walletAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate wallet address format (basic check)
    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json({ error: "Invalid wallet address format" }, { status: 400 })
    }

    const supabase = await createClient()

    // Update redemption record
    const { error } = await supabase
      .from("redemptions")
      .update({
        wallet_address: walletAddress,
        usdt_claimed: true,
        nft_claimed: true,
        claimed_at: new Date().toISOString(),
      })
      .eq("id", redemptionId)

    if (error) {
      console.error("Redemption update error:", error)
      return NextResponse.json({ error: "Failed to claim reward" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Claim reward error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
