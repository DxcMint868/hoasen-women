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
      <header className="border-b border-primary/20 bg-background/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-primary-foreground font-bold text-lg">🪷</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Hoasen Admin</h1>
                <p className="text-xs text-muted-foreground">Women's Day Celebration 2024</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-primary/40 hover:bg-primary/10 text-foreground bg-transparent"
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
          <Card className="border-2 border-primary/40 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">Total Women</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered participants</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/40 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">Rewards Claimed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{claimedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">{claimRate}% claim rate</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/40 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">Pending Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{totalCount - claimedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting redemption</p>
            </CardContent>
          </Card>
        </div>

        {/* Women Profiles Table */}
        <Card className="border-2 border-primary/40 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Women Profiles & Redemption Status</CardTitle>
            <CardDescription>Track redemption codes and claim status for all participants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/20 hover:bg-primary/5">
                    <TableHead className="text-foreground">Name</TableHead>
                    <TableHead className="text-foreground">Redemption Code</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Wallet Address</TableHead>
                    <TableHead className="text-foreground">Claimed At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {women.map((woman) => {
                    const redemption = woman.redemptions[0]
                    const isClaimed = redemption?.usdt_claimed

                    return (
                      <TableRow key={woman.id} className="border-primary/20 hover:bg-primary/5">
                        <TableCell className="font-medium text-foreground">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/30">
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
                            <code className="text-xs font-mono bg-muted px-2 py-1 rounded border border-primary/30">
                              {redemption?.phuc_long_code.slice(0, 12)}...
                            </code>
                            <button
                              onClick={() => handleCopyCode(redemption?.phuc_long_code || "")}
                              className="p-1 hover:bg-primary/10 rounded transition-colors"
                              title="Copy code"
                            >
                              <Copy className="w-4 h-4 text-primary" />
                            </button>
                            {copiedCode === redemption?.phuc_long_code && (
                              <span className="text-xs text-secondary">Copied!</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {isClaimed ? (
                            <Badge className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/20 flex w-fit gap-1 border border-secondary/40">
                              <CheckCircle2 className="w-3 h-3" />
                              Claimed
                            </Badge>
                          ) : (
                            <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/20 flex w-fit gap-1 border border-destructive/40">
                              <Clock className="w-3 h-3" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {redemption?.wallet_address ? (
                            <code className="text-xs bg-muted px-2 py-1 rounded border border-primary/30">
                              {redemption.wallet_address.slice(0, 10)}...
                            </code>
                          ) : (
                            <span className="text-muted-foreground/50">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {redemption?.claimed_at ? (
                            new Date(redemption.claimed_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          ) : (
                            <span className="text-muted-foreground/50">-</span>
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
      <footer className="border-t border-primary/20 bg-background/80 backdrop-blur-sm mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-sm text-muted-foreground">Hoasen Admin Dashboard • Women's Day Celebration 2024</p>
        </div>
      </footer>
    </>
  )
}
