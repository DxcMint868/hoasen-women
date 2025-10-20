"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Woman {
  id: string;
  name: string;
  slack_pfp_url: string;
}

export default function PasswordModal({
  woman,
  isOpen,
  onClose,
}: {
  woman: Woman;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scanStep, setScanStep] = useState<"face" | "scores" | "password">(
    "face"
  );
  const [scanProgress, setScanProgress] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          womanId: woman.id,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid password");
        return;
      }

      // Redirect to redemption page
      router.push(`/redeem/${woman.id}`);
      onClose();
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Face ID scan animation logic
  useEffect(() => {
    if (!isOpen) {
      setScanStep("face");
      setScanProgress(0);
      return;
    }
    if (scanStep === "face") {
      setScanProgress(0);
      const interval = setInterval(() => {
        setScanProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setScanStep("scores"), 500);
            return 100;
          }
          return p + 5;
        });
      }, 270);
      return () => clearInterval(interval);
    }
    if (scanStep === "scores") {
      const timeout = setTimeout(() => setScanStep("password"), 6000);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, scanStep]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-2 border-white/50 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Welcome, {woman.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {scanStep === "face" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9470DC]/30 to-[#F8BBD0]/40 flex items-center justify-center mb-2 border-2 border-[#9470DC]/40 animate-pulse">
                {/* Fake camera icon */}
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 38 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="6"
                    y="12"
                    width="26"
                    height="18"
                    rx="5"
                    fill="#9470DC"
                  />
                  <circle cx="19" cy="21" r="6" fill="#F8BBD0" />
                  <rect
                    x="14"
                    y="8"
                    width="10"
                    height="6"
                    rx="3"
                    fill="#B39DDB"
                  />
                </svg>
              </div>
              <div className="text-center text-sm text-muted-foreground font-medium">
                Please look at the screen and smile for Face ID
                <br />
                <span className="text-xs text-[#9470DC]">
                  (For authentication)
                </span>
              </div>
              <div className="w-full h-3 bg-[#9470DC]/10 rounded-full overflow-hidden">
                <div
                  style={{ width: `${scanProgress}%` }}
                  className="h-full bg-[#9470DC] transition-all duration-100 rounded-full"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Scanning... {scanProgress}%
              </div>
            </div>
          )}

          {scanStep === "scores" && (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="text-lg font-bold text-[#9470DC] mb-2">
                Scan Complete!
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F8BBD0]/40 px-3 py-2 rounded-lg text-center text-sm font-semibold text-[#9470DC]">
                  100% Gorgeous
                </div>
                <div className="bg-[#FFD54F]/40 px-3 py-2 rounded-lg text-center text-sm font-semibold text-[#9470DC]">
                  100% Smile
                </div>
                <div className="bg-[#B2DFDB]/40 px-3 py-2 rounded-lg text-center text-sm font-semibold text-[#9470DC]">
                  100% Energetic
                </div>
                <div className="bg-[#CE93D8]/40 px-3 py-2 rounded-lg text-center text-sm font-semibold text-[#9470DC]">
                  100% Beautiful
                </div>
                <div className="bg-[#FFAB91]/40 px-3 py-2 rounded-lg text-center text-sm font-semibold text-[#9470DC]">
                  100% Fun
                </div>
                <div className="bg-[#A5D6A7]/40 px-3 py-2 rounded-lg text-center text-sm font-semibold text-[#9470DC]">
                  100% Hoasen Spirit
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                You passed with flying colors!
              </div>
            </div>
          )}

          {scanStep === "password" && (
            <>
              <p className="text-sm text-muted-foreground">
                Enter the password from your physical envelope delivered to your
                office seat to unlock your gift.
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
