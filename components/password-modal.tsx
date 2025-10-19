"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Woman {
  id: string
  name: string
  slack_pfp_url: string
}

export default function PasswordModal({
  woman,
  isOpen,
  onClose,
}: {
  woman: Woman
  isOpen: boolean
  onClose: () => void
}) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          womanId: woman.id,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Invalid password")
        return
      }

      // Redirect to redemption page
      router.push(`/redeem/${woman.id}`)
      onClose()
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-2 border-white/50 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Welcome, {woman.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Enter the password from your lotus plant envelope to unlock your gift.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="border-primary/30 focus:border-primary focus:ring-primary"
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-[#9470DC] hover:bg-[#7d5fc4] text-white"
            >
              {isLoading ? "Verifying..." : "Unlock Gift"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
