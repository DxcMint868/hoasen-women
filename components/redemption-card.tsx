"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Copy } from "lucide-react"

interface Woman {
  id: string
  name: string
  slack_pfp_url: string
}

interface Redemption {
  id: string
  phuc_long_code: string
  usdt_claimed: boolean
  nft_claimed: boolean
  claimed_at: string | null
}

export default function RedemptionCard({
  woman,
  redemption,
  personalMessage,
}: {
  woman: Woman
  redemption: Redemption | null
  personalMessage: string
}) {
  const [walletAddress, setWalletAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [claimStatus, setClaimStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [copiedCode, setCopiedCode] = useState(false)

  const handleCopyCode = () => {
    if (redemption?.phuc_long_code) {
      navigator.clipboard.writeText(redemption.phuc_long_code)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const handleClaimReward = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/claim-reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          redemptionId: redemption?.id,
          walletAddress,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to claim reward")
        setClaimStatus("error")
        return
      }

      setClaimStatus("success")
      setWalletAddress("")
    } catch (err) {
      setErrorMessage("An error occurred. Please try again.")
      setClaimStatus("error")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-purple-900 text-balance">Welcome, {woman.name}!</h1>
        <p className="text-lg text-purple-700 text-balance">Your special gift is ready to be claimed</p>
      </div>

      {/* Profile & Message Card */}
      <Card className="border-purple-200 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-purple-200 shadow-md">
              <Image src={woman.slack_pfp_url || "/placeholder.svg"} alt={woman.name} fill className="object-cover" />
            </div>
          </div>
          <CardTitle className="text-2xl text-purple-900">{woman.name}</CardTitle>
          <CardDescription className="text-base text-purple-700 mt-4 italic">"{personalMessage}"</CardDescription>
        </CardHeader>
      </Card>

      {/* Redemption Code Section */}
      <Card className="border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-purple-900">Your Redemption Code</CardTitle>
          <CardDescription>Use this code to claim your rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <code className="flex-1 font-mono text-lg font-bold text-purple-900">
              {redemption?.phuc_long_code || "Loading..."}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="border-purple-200 hover:bg-purple-100 bg-transparent"
            >
              <Copy className="w-4 h-4" />
              {copiedCode ? "Copied!" : "Copy"}
            </Button>
          </div>
          <p className="text-sm text-purple-600">Save this code to claim your USDT and NFT rewards</p>
        </CardContent>
      </Card>

      {/* Rewards Section */}
      <Card className="border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-purple-900">Your Rewards</CardTitle>
          <CardDescription>Track your claimed rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* USDT Reward */}
            <div className="p-4 rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                  💰
                </div>
                <h3 className="font-semibold text-purple-900">USDT Reward</h3>
              </div>
              <p className="text-sm text-purple-600 mb-3">Cryptocurrency reward</p>
              <div className="flex items-center gap-2">
                {redemption?.usdt_claimed ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Claimed</span>
                  </>
                ) : (
                  <span className="text-sm text-purple-600">Pending claim</span>
                )}
              </div>
            </div>

            {/* NFT Reward */}
            <div className="p-4 rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold">
                  🎨
                </div>
                <h3 className="font-semibold text-purple-900">NFT Reward</h3>
              </div>
              <p className="text-sm text-purple-600 mb-3">Digital collectible</p>
              <div className="flex items-center gap-2">
                {redemption?.nft_claimed ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Claimed</span>
                  </>
                ) : (
                  <span className="text-sm text-purple-600">Pending claim</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claim Rewards Form */}
      {!redemption?.usdt_claimed && (
        <Card className="border-purple-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-900">Claim Your Rewards</CardTitle>
            <CardDescription>Enter your wallet address to receive your rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleClaimReward} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wallet" className="text-purple-900">
                  Wallet Address
                </Label>
                <Input
                  id="wallet"
                  type="text"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  disabled={isLoading}
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
                <p className="text-xs text-purple-600">Enter your Ethereum or compatible blockchain wallet address</p>
              </div>

              {claimStatus === "error" && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              {claimStatus === "success" && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">Rewards claimed successfully! Check your wallet.</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !walletAddress || claimStatus === "success"}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
              >
                {isLoading ? "Processing..." : claimStatus === "success" ? "Rewards Claimed" : "Claim Rewards"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Already Claimed Message */}
      {redemption?.usdt_claimed && (
        <Card className="border-green-200 bg-green-50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900">All Rewards Claimed!</h3>
                <p className="text-sm text-green-700">
                  Thank you for celebrating Women's Day with us. Your rewards have been sent to your wallet.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}
