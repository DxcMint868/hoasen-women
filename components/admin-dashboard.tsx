"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LogOut, Copy, CheckCircle2, Clock } from "lucide-react"

interface Redemption {
  id: string
  phuc_long_code: string
  usdt_claimed: boolean
  nft_claimed: boolean
  claimed_at: string | null
  wallet_address: string | null
}

interface Woman {
  id: string
  name: string
  slack_pfp_url: string
  created_at: string
  redemptions: Redemption[]
}

export default function AdminDashboard({ women }: { women: Woman[] }) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    // Check if admin token exists
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    router.push("/admin/login")
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const claimedCount = women.filter((w) => w.redemptions[0]?.usdt_claimed).length
  const totalCount = women.length
  const claimRate = totalCount > 0 ? Math.round((claimedCount / totalCount) * 100) : 0

  if (!isAuthorized) {
    return null
  }

  return (
    <>
      {/* Header */}
      <header className="border-b border-purple-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌸</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-purple-900">Hoasen Admin</h1>
                <p className="text-xs text-purple-600">Women's Day Celebration 2024</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-purple-200 hover:bg-purple-50 text-purple-900 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-900">Total Women</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{totalCount}</div>
              <p className="text-xs text-purple-600 mt-1">Registered participants</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-900">Rewards Claimed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{claimedCount}</div>
              <p className="text-xs text-purple-600 mt-1">{claimRate}% claim rate</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-900">Pending Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{totalCount - claimedCount}</div>
              <p className="text-xs text-purple-600 mt-1">Awaiting redemption</p>
            </CardContent>
          </Card>
        </div>

        {/* Women Profiles Table */}
        <Card className="border-purple-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-900">Women Profiles & Redemption Status</CardTitle>
            <CardDescription>Track redemption codes and claim status for all participants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-100 hover:bg-purple-50">
                    <TableHead className="text-purple-900">Name</TableHead>
                    <TableHead className="text-purple-900">Redemption Code</TableHead>
                    <TableHead className="text-purple-900">Status</TableHead>
                    <TableHead className="text-purple-900">Wallet Address</TableHead>
                    <TableHead className="text-purple-900">Claimed At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {women.map((woman) => {
                    const redemption = woman.redemptions[0]
                    const isClaimed = redemption?.usdt_claimed

                    return (
                      <TableRow key={woman.id} className="border-purple-100 hover:bg-purple-50">
                        <TableCell className="font-medium text-purple-900">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={woman.slack_pfp_url || "/placeholder.svg"}
                                alt={woman.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            {woman.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono bg-purple-50 px-2 py-1 rounded border border-purple-200">
                              {redemption?.phuc_long_code.slice(0, 12)}...
                            </code>
                            <button
                              onClick={() => handleCopyCode(redemption?.phuc_long_code || "")}
                              className="p-1 hover:bg-purple-100 rounded transition-colors"
                              title="Copy code"
                            >
                              <Copy className="w-4 h-4 text-purple-600" />
                            </button>
                            {copiedCode === redemption?.phuc_long_code && (
                              <span className="text-xs text-green-600">Copied!</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {isClaimed ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex w-fit gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Claimed
                            </Badge>
                          ) : (
                            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 flex w-fit gap-1">
                              <Clock className="w-3 h-3" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-purple-700">
                          {redemption?.wallet_address ? (
                            <code className="text-xs bg-purple-50 px-2 py-1 rounded border border-purple-200">
                              {redemption.wallet_address.slice(0, 10)}...
                            </code>
                          ) : (
                            <span className="text-purple-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-purple-700">
                          {redemption?.claimed_at ? (
                            new Date(redemption.claimed_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          ) : (
                            <span className="text-purple-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-100 bg-white/50 backdrop-blur-sm mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-sm text-purple-600">Hoasen Admin Dashboard • Women's Day Celebration 2024</p>
        </div>
      </footer>
    </>
  )
}
