import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

const GIFT_MANAGER_ADDRESS = process.env.GIFT_MANAGER_ADDRESS || "";
const BACKEND_SIGNER_KEY = process.env.BACKEND_SIGNER_KEY || "";
const BASE_SEPOLIA_RPC =
  process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org";
const BASE_RPC = process.env.BASE_RPC || "https://mainnet.base.org";

// Contract ABI for redeemUSDT function
const CONTRACT_ABI = [
  {
    type: "function",
    name: "redeemUSDT",
    stateMutability: "nonpayable",
    inputs: [
      { name: "womanId", type: "string" },
      { name: "recipient", type: "address" },
    ],
    outputs: [],
  },
];

export async function POST(request: NextRequest) {
  try {
    const { redemptionId, walletAddress, womanId } = await request.json();

    if (!walletAddress || !womanId) {
      return NextResponse.json(
        { error: "Missing required fields (walletAddress and womanId required)" },
        { status: 400 }
      );
    }

    // Validate wallet address format
    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: "Invalid wallet address format" },
        { status: 400 }
      );
    }

    if (!GIFT_MANAGER_ADDRESS || !BACKEND_SIGNER_KEY) {
      console.error("Missing contract configuration");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = await createClient();

    // Get woman from database using womanId
    const { data: woman, error: womanError } = await supabase
      .from("women_profiles")
      .select("id")
      .eq("id", womanId)
      .single();

    if (womanError || !woman) {
      console.error("Woman not found:", womanError);
      return NextResponse.json({ error: "Woman not found" }, { status: 404 });
    }

    // Get or create redemption record
    let actualRedemptionId = redemptionId;
    
    if (!redemptionId) {
      // Check if redemption exists
      const { data: existingRedemption } = await supabase
        .from("redemptions")
        .select("id")
        .eq("woman_id", womanId)
        .single();

      if (existingRedemption) {
        actualRedemptionId = existingRedemption.id;
      } else {
        // Create new redemption record
        const { data: newRedemption, error: createError } = await supabase
          .from("redemptions")
          .insert({
            woman_id: womanId,
            usdt_claimed: false,
            nft_claimed: false,
          })
          .select("id")
          .single();

        if (createError || !newRedemption) {
          console.error("Failed to create redemption:", createError);
          return NextResponse.json(
            { error: "Failed to create redemption record" },
            { status: 500 }
          );
        }

        actualRedemptionId = newRedemption.id;
      }
    }

    // Set up ethers provider and signer (use Base Sepolia for testing, Base for production)
    const rpcUrl =
      process.env.NODE_ENV === "production" ? BASE_RPC : BASE_SEPOLIA_RPC;
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(BACKEND_SIGNER_KEY, provider);

    // Create contract instance
    const contract = new ethers.Contract(
      GIFT_MANAGER_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    // Call redeemUSDT on the contract
    console.log(`Redeeming USDT for woman ${womanId} to ${walletAddress}`);
    const tx = await contract.redeemUSDT(womanId, walletAddress);
    const receipt = await tx.wait();

    if (!receipt) {
      console.error("Transaction failed");
      return NextResponse.json(
        { error: "Transaction failed" },
        { status: 500 }
      );
    }

    console.log(`USDT redemption successful: tx hash ${receipt.hash}`);

    // Update redemption record in database
    const { error: updateError } = await supabase
      .from("redemptions")
      .update({
        wallet_address: walletAddress,
        usdt_claimed: true,
        claimed_at: new Date().toISOString(),
        tx_hash: receipt.hash,
      })
      .eq("id", actualRedemptionId);

    if (updateError) {
      console.error("Redemption update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update redemption record" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, txHash: receipt.hash });
  } catch (error) {
    console.error("Claim reward error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
