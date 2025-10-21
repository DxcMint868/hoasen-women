"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AffirmationsPage from "./affirmations-page";

interface Woman {
  id: string;
  name: string;
  slack_pfp_url: string;
}

interface Redemption {
  id: string;
  phuc_long_code: string;
  usdt_claimed: boolean;
  nft_claimed: boolean;
  claimed_at: string | null;
}

export default function RedemptionCard({
  woman,
  redemption,
  personalMessage,
}: {
  woman: Woman;
  redemption: Redemption | null;
  personalMessage: string;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [hearts, setHearts] = useState<
    Array<{ id: number; x: number; delay: number }>
  >([]);
  const [heartCount, setHeartCount] = useState(0);

  const totalPages = 5;

  const handleCopyCode = () => {
    if (redemption?.phuc_long_code) {
      navigator.clipboard.writeText(redemption.phuc_long_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setDirection(page > currentPage ? 1 : -1);
    setCurrentPage(page);
  };

  const spamHeart = () => {
    const newHeart = {
      id: Date.now(),
      x: Math.random() * 80 + 10, // Random position between 10% and 90%
      delay: Math.random() * 0.2,
    };
    setHearts((prev) => [...prev, newHeart]);
    setHeartCount((prev) => prev + 1);

    // Remove heart after animation
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 3000);
  };

  const handleSubmitFeedback = async () => {
    // TODO: Implement feedback submission
    console.log("Feedback:", feedback);
  };

  const handleClaimReward = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/claim-reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          redemptionId: redemption?.id,
          walletAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to claim reward");
        setClaimStatus("error");
        return;
      }

      setClaimStatus("success");
      setWalletAddress("");
    } catch (err) {
      setErrorMessage("An error occurred. Please try again.");
      setClaimStatus("error");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Page Indicators */}
      <div className="flex justify-center gap-2 mb-8">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentPage
                ? "w-8 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>

      {/* Book Container */}
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {/* Page 0: Affirmations */}
            {currentPage === 0 && (
              <Card className="relative border-2 border-white/50 shadow-2xl backdrop-blur-sm overflow-hidden min-h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/95 to-white pointer-events-none" />
                <CardContent className="relative p-8 sm:p-12">
                  <AffirmationsPage womanId={woman.id} />
                </CardContent>
              </Card>
            )}

            {/* Page 1: Tribute & Welcome */}
            {currentPage === 1 && (
              <Card className="relative border-2 border-white/50 shadow-2xl backdrop-blur-sm overflow-hidden min-h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/95 to-white pointer-events-none" />
                <CardContent className="relative p-8 sm:p-12">
                  <div className="text-center space-y-8">
                    {/* Profile Image */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="flex justify-center"
                    >
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#9470DC]/30 shadow-xl">
                        <Image
                          src={woman.slack_pfp_url || "/placeholder.svg"}
                          alt={woman.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </motion.div>

                    {/* Welcome Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-4"
                    >
                      <h1 className="text-4xl sm:text-5xl font-bold text-[#9470DC]">
                        Dear {woman.name},
                      </h1>
                      <div className="max-w-2xl mx-auto space-y-4 text-lg text-muted-foreground">
                        <p className="italic leading-relaxed">
                          "{personalMessage}"
                        </p>
                        <div className="pt-4 space-y-3">
                          <div className="flex items-center justify-center gap-2 text-foreground font-medium">
                            <svg
                              className="w-5 h-5 text-[#9470DC]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                              <path d="M12 7v5l3 3" strokeWidth="1.5" />
                            </svg>
                            Happy Vietnam Women's Day 20/10!
                          </div>
                          <p className="text-base">
                            Your dedication, creativity, and passion inspire us
                            every day. As a token of our appreciation, we've
                            prepared something special for you.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Call to Action */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="pt-8"
                    >
                      <Button
                        onClick={nextPage}
                        size="lg"
                        className="bg-[#9470DC] hover:bg-[#7d5fc4] text-white px-8 py-6 text-lg"
                      >
                        Open Your Gift
                        <svg
                          className="ml-2 w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.7}
                            d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M6.757 17.243l-2.121 2.121m12.728 0l-2.121-2.121M6.757 6.757L4.636 4.636"
                          />
                        </svg>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Page 2: USDT Gift */}
            {currentPage === 2 && (
              <Card className="relative border-2 border-white/50 shadow-2xl backdrop-blur-sm overflow-hidden min-h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/95 to-white pointer-events-none" />
                <CardHeader className="relative text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9470DC]/20 to-[#9470DC]/40 flex items-center justify-center shadow-lg">
                      <svg
                        className="w-10 h-10 text-[#9470DC]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="3"
                          y="7"
                          width="18"
                          height="10"
                          rx="3"
                          strokeWidth="1.7"
                        />
                        <path d="M16 12h.01" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                  <CardTitle className="text-3xl text-foreground">
                    Gift #1: USDT Reward
                  </CardTitle>
                  <CardDescription className="text-base">
                    Your cryptocurrency gift awaits
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-6 px-8 pb-8">
                  {!redemption?.usdt_claimed ? (
                    <>
                      {/* Web3 Wallet Guide */}
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                          {/* Sparkle icon already replaced above with SVG */}
                          New to Web3? Here's how to get started:
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                          <li className="flex items-start gap-2">
                            <svg
                              className="w-3 h-3 mt-1 text-[#9470DC]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 8 8"
                            >
                              <circle cx="4" cy="4" r="3" strokeWidth="1.2" />
                            </svg>
                            Download a Web3 wallet app (e.g., MetaMask, Trust
                            Wallet)
                          </li>
                          <li className="flex items-start gap-2">
                            <svg
                              className="w-3 h-3 mt-1 text-[#9470DC]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 8 8"
                            >
                              <circle cx="4" cy="4" r="3" strokeWidth="1.2" />
                            </svg>
                            Create a new wallet and securely save your recovery
                            phrase
                          </li>
                          <li className="flex items-start gap-2">
                            <svg
                              className="w-3 h-3 mt-1 text-[#9470DC]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 8 8"
                            >
                              <circle cx="4" cy="4" r="3" strokeWidth="1.2" />
                            </svg>
                            Copy your wallet address (starts with "0x...")
                          </li>
                          <li className="flex items-start gap-2">
                            <svg
                              className="w-3 h-3 mt-1 text-[#9470DC]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 8 8"
                            >
                              <circle cx="4" cy="4" r="3" strokeWidth="1.2" />
                            </svg>
                            Paste it below to receive your USDT gift
                          </li>
                        </ul>
                      </div>

                      {/* Wallet Input Form */}
                      <form onSubmit={handleClaimReward} className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="wallet"
                            className="text-foreground text-lg"
                          >
                            Your Wallet Address
                          </Label>
                          <Input
                            id="wallet"
                            type="text"
                            placeholder="0x..."
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            disabled={isLoading}
                            className="border-[#9470DC]/30 focus:border-[#9470DC] focus:ring-[#9470DC] text-base py-6"
                          />
                        </div>

                        {claimStatus === "error" && (
                          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-2">
                            {/* Alert icon already replaced above with SVG */}
                            <p className="text-sm text-destructive">
                              {errorMessage}
                            </p>
                          </div>
                        )}

                        {claimStatus === "success" && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
                            {/* Check icon already replaced above with SVG */}
                            <p className="text-sm text-green-700">
                              USDT claimed successfully! Check your wallet.
                            </p>
                          </div>
                        )}

                        <Button
                          type="submit"
                          disabled={
                            isLoading ||
                            !walletAddress ||
                            claimStatus === "success"
                          }
                          className="w-full bg-[#9470DC] hover:bg-[#7d5fc4] text-white py-6 text-lg"
                        >
                          {isLoading
                            ? "Processing..."
                            : claimStatus === "success"
                            ? "Claimed!"
                            : "Claim USDT Reward"}
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-8 space-y-4">
                      {/* Check icon already replaced above with SVG */}
                      <h3 className="text-2xl font-semibold text-green-900">
                        USDT Claimed!
                      </h3>
                      <p className="text-green-700">
                        Your reward has been sent to your wallet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Page 3: NFT Mint with Optional Wish */}
            {currentPage === 3 && (
              <Card className="relative border-2 border-white/50 shadow-2xl backdrop-blur-sm overflow-hidden min-h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/95 to-white pointer-events-none" />

                <CardHeader className="relative text-center pb-3">
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9470DC]/20 to-[#9470DC]/40 flex items-center justify-center shadow-lg">
                      <svg
                        className="w-8 h-8 text-[#9470DC]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <rect x="4" y="7" width="16" height="10" rx="5" />
                        <path d="M4 7l8 6 8-6" />
                      </svg>
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-foreground">
                    A Moment Worth Keeping
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Commemorate this special day on the blockchain
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative space-y-5 px-8 pb-8">
                  {!redemption?.nft_claimed ? (
                    <>
                      {/* Introduction */}
                      <div className="text-center space-y-3 py-4">
                        <p className="text-base text-foreground leading-relaxed">
                          Today marks a special moment between us and you.
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          We'd love to create a lasting memory of this
                          celebration by minting an NFT—a unique digital
                          keepsake that captures this moment forever.
                        </p>
                      </div>

                      {/* Optional Wish Section */}
                      <div className="space-y-3 p-5 bg-white/50 rounded-xl border border-purple-100/50">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-foreground">
                            A Moment for Reflection
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            If you'd like, take a quiet moment for yourself.
                            Perhaps there's something you hope for, or a thought
                            you'd like to hold onto. You're welcome to write it
                            here—it's completely optional and entirely yours.
                          </p>
                        </div>

                        <Textarea
                          id="wish"
                          placeholder="A thought, a hope, a quiet wish... (optional)"
                          value={feedback}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => setFeedback(e.target.value)}
                          className="min-h-[100px] resize-none bg-white border-[#9470DC]/20 focus:border-[#9470DC]/40 focus:ring-[#9470DC]/40 text-sm placeholder:text-muted-foreground/60"
                        />

                        <div className="flex items-start gap-2 pt-1">
                          <svg
                            className="w-4 h-4 text-[#9470DC] flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <rect x="4" y="7" width="16" height="10" rx="5" />
                            <path d="M4 7l8 6 8-6" />
                          </svg>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Your words stay private. Only a unique code that
                            represents your note—like a fingerprint—is stored.
                            No one can read the actual words from this code.
                          </p>
                        </div>
                      </div>

                      {/* Two Column Layout for Education */}
                      <div className="grid md:grid-cols-2 gap-4 pt-2">
                        {/* What is NFT */}
                        <div className="space-y-2.5 p-4 bg-gradient-to-br from-blue-50/40 to-transparent rounded-lg border border-blue-100/50">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                />
                              </svg>
                            </div>
                            <h3 className="font-semibold text-sm text-foreground">
                              What is an NFT?
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Think of it as a digital keepsake—unique and truly
                            yours. This NFT is like a certificate that says:
                          </p>
                          <ul className="space-y-1.5 text-xs text-muted-foreground pl-1">
                            <li className="flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5 font-medium">
                                •
                              </span>
                              <span>This moment belongs to you</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5 font-medium">
                                •
                              </span>
                              <span>It's stored forever, can't be lost</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5 font-medium">
                                •
                              </span>
                              <span>There's a surprise hidden inside</span>
                            </li>
                          </ul>
                        </div>

                        {/* Why Blockchain */}
                        <div className="space-y-2.5 p-4 bg-gradient-to-br from-purple-50/40 to-transparent rounded-lg border border-purple-100/50">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                              </svg>
                            </div>
                            <h3 className="font-semibold text-sm text-foreground">
                              Why Blockchain?
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Blockchain is like a special storage system that
                            keeps your NFT safe:
                          </p>
                          <ul className="space-y-1.5 text-xs text-muted-foreground pl-1">
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5 font-medium">
                                •
                              </span>
                              <span>Not controlled by any one company</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5 font-medium">
                                •
                              </span>
                              <span>Can't be changed or erased</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5 font-medium">
                                •
                              </span>
                              <span>Your information stays protected</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Subtle Hint */}
                      <div className="p-3 bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-center text-amber-800/90">
                          <span className="font-medium">
                            A little something extra:
                          </span>{" "}
                          Your NFT holds a surprise worth 100,000 VND inside.
                        </p>
                      </div>

                      {/* Mint Button */}
                      <Button
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#9470DC] to-[#7d5fc4] hover:from-[#8060d0] hover:to-[#6d4fb8] text-white py-5 text-base shadow-md flex items-center justify-center gap-2"
                        onClick={() => {
                          // TODO: Implement NFT minting with optional wish hash
                          console.log(
                            "Mint NFT with optional wish:",
                            feedback || "No wish provided"
                          );
                        }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M9 5l7 7-7 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {isLoading ? "Creating Your NFT..." : "Create My NFT"}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        Whether you add a personal note or not, this NFT is
                        yours to keep
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-6 space-y-5">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mx-auto shadow-lg">
                          <svg
                            className="w-7 h-7 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </motion.div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          Your NFT is Ready
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                          This moment now lives on the blockchain—a permanent
                          keepsake of today's celebration.
                        </p>
                      </div>

                      {/* Show Phuc Long code after minting */}
                      <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 border border-amber-200 rounded-lg p-5 space-y-3 max-w-md mx-auto">
                        <div className="text-center space-y-1">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <svg
                              className="w-4 h-4 text-amber-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                              />
                            </svg>
                            <p className="text-xs font-medium text-amber-700">
                              Your Hidden Gift
                            </p>
                          </div>
                          <h4 className="text-lg font-semibold text-amber-900">
                            Phúc Long Coffee
                          </h4>
                          <p className="text-xs text-amber-700">100,000 VND</p>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-amber-300">
                          <code className="flex-1 font-mono text-base font-bold text-center text-amber-900">
                            {redemption?.phuc_long_code || "Loading..."}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyCode}
                            className="border-[#9470DC]/40 hover:bg-[#9470DC]/10"
                          >
                            <svg
                              className="w-3.5 h-3.5 text-[#9470DC]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                strokeWidth="1.5"
                              />
                              <rect
                                x="3"
                                y="3"
                                width="13"
                                height="13"
                                rx="2"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </Button>
                        </div>
                        <p className="text-xs text-center text-amber-700">
                          Enjoy a moment of calm with your favorite coffee.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Page 4: Feedback & Hearts */}
            {currentPage === 4 && (
              <Card className="relative border-2 border-white/50 shadow-2xl backdrop-blur-sm overflow-hidden min-h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/95 to-white pointer-events-none" />

                {/* Floating Hearts */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <AnimatePresence>
                    {hearts.map((heart) => (
                      <motion.div
                        key={heart.id}
                        initial={{ y: "100%", opacity: 1, scale: 0 }}
                        animate={{
                          y: "-100%",
                          opacity: [0, 1, 1, 0],
                          scale: [0, 1.2, 1, 0.8],
                          rotate: [0, 10, -10, 0],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 3,
                          delay: heart.delay,
                          ease: "easeOut",
                        }}
                        style={{
                          position: "absolute",
                          left: `${heart.x}%`,
                          bottom: 0,
                        }}
                      >
                        <svg
                          className="w-7 h-7 text-pink-300 drop-shadow"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21s-5.5-4.36-8-7.36C1.5 10.5 3.5 7 7 7c1.54 0 3.04.99 4 2.09C12.96 7.99 14.46 7 16 7c3.5 0 5.5 3.5 3 6.64C17.5 16.64 12 21 12 21z" />
                        </svg>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <CardHeader className="relative text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9470DC]/20 to-[#9470DC]/40 flex items-center justify-center shadow-lg">
                      <svg
                        className="w-10 h-10 text-[#9470DC]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <rect x="4" y="7" width="16" height="10" rx="5" />
                        <path d="M4 7l8 6 8-6" />
                      </svg>
                    </div>
                  </div>
                  <CardTitle className="text-3xl text-foreground">
                    Thank You!
                  </CardTitle>
                  <CardDescription className="text-base">
                    We'd love to hear from you
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-6 px-8 pb-8">
                  <div className="text-center space-y-4 mb-6">
                    <p className="text-lg text-muted-foreground">
                      Your contributions make Hoasen a better place every day.
                      We hope you enjoyed your gifts!
                    </p>
                  </div>

                  {/* Feedback Form */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="feedback"
                        className="text-lg text-foreground"
                      >
                        Share Your Thoughts (Optional)
                      </Label>
                      <Textarea
                        id="feedback"
                        placeholder="Tell us what you think, or share any suggestions..."
                        value={feedback}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setFeedback(e.target.value)
                        }
                        className="min-h-[120px] bg-white resize-none border-[#9470DC]/30 focus:border-[#9470DC] focus:ring-[#9470DC]"
                      />
                    </div>

                    <Button
                      onClick={handleSubmitFeedback}
                      disabled={!feedback.trim()}
                      className="w-full bg-[#9470DC] hover:bg-[#7d5fc4] text-white py-6 text-lg"
                    >
                      Submit Feedback
                    </Button>
                  </div>

                  {/* Heart Spam Section */}
                  <div className="pt-6 border-t-2 border-white/30">
                    <div className="text-center space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          Let Hoasen know you care!
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Tap the heart as many times as you like!
                        </p>
                        {heartCount > 0 && (
                          <p className="text-2xl font-bold text-pink-600">
                            {heartCount} heart{heartCount !== 1 ? "s" : ""}{" "}
                            sent!
                          </p>
                        )}
                      </div>
                      <div className="w-full flex justify-center gap-8">
                        <Button
                          onClick={spamHeart}
                          size="lg"
                          className="bg-gradient-to-r from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 text-pink-400 w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center border border-pink-100"
                          aria-label="Send a heart"
                        >
                          <svg
                            className="w-10 h-10 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 21s-5.5-4.36-8-7.36C1.5 10.5 3.5 7 7 7c1.54 0 3.04.99 4 2.09C12.96 7.99 14.46 7 16 7c3.5 0 5.5 3.5 3 6.64C17.5 16.64 12 21 12 21z" />
                          </svg>
                        </Button>
                        <Button
                          onClick={spamHeart}
                          size="lg"
                          className="bg-gradient-to-r from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 text-yellow-400 w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center border border-yellow-100"
                          aria-label="Send a smile"
                        >
                          <svg
                            className="w-10 h-10 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M8 15c1.333 1 2.667 1 4 0" />
                            <circle cx="9" cy="10" r="1" />
                            <circle cx="15" cy="10" r="1" />
                          </svg>
                        </Button>
                        <Button
                          onClick={spamHeart}
                          size="lg"
                          className="bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-400 w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center border border-blue-100"
                          aria-label="Send a star"
                        >
                          <svg
                            className="w-10 h-10 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            viewBox="0 0 24 24"
                          >
                            <polygon points="12,3 15,10 22,10 17,15 19,22 12,18 5,22 7,15 2,10 9,10" />
                          </svg>
                        </Button>
                        <Button
                          onClick={spamHeart}
                          size="lg"
                          className="bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-400 w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center border border-green-100"
                          aria-label="Send a thumbs up"
                        >
                          <svg
                            className="w-10 h-10 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            viewBox="0 0 24 24"
                          >
                            <path d="M7 22V10a2 2 0 012-2h5.5a2 2 0 012 2v12" />
                            <path d="M2 12h5v10H2z" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8">
        <Button
          onClick={prevPage}
          disabled={currentPage === 0}
          variant="outline"
          size="lg"
          className="border-white/50 bg-white/20 hover:bg-white/30 text-white disabled:opacity-30 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Previous
        </Button>

        <div className="text-white/80 font-medium">
          Page {currentPage + 1} of {totalPages}
        </div>

        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          variant="outline"
          size="lg"
          className="border-white/50 bg-white/20 hover:bg-white/30 text-white disabled:opacity-30 flex items-center gap-2"
        >
          Next
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 5l7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
