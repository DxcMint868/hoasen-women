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
import KnowledgeTooltip from "./knowledge-tooltip";

interface Woman {
  id: string;
  name: string;
  slack_pfp_url: string;
  phuc_long_image: string;
}

interface Redemption {
  id: string;
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
  const [giftBoxOpened, setGiftBoxOpened] = useState(false);
  const [txHash, setTxHash] = useState<string>("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<
    Array<{ id: number; x: number }>
  >([]);
  const [clickedReactions, setClickedReactions] = useState<Set<string>>(
    new Set()
  );
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const totalPages = 5; // Welcome, Affirmations, USDT, Phuc Long, Feedback

  const handleCopyCode = () => {
    if (woman?.phuc_long_image) {
      navigator.clipboard.writeText(woman.phuc_long_image);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleHeartClick = () => {
    const newHeart = {
      id: Date.now(),
      x: Math.random() * 100 - 50,
    };
    setFloatingHearts((prev) => [...prev, newHeart]);
    setHeartCount((prev) => prev + 1);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 2000);
  };

  const handleReactionClick = (emoji: string) => {
    const newClicked = new Set(clickedReactions);
    newClicked.add(emoji);
    setClickedReactions(newClicked);

    // Trigger easter egg if 3+ unique reactions
    if (newClicked.size >= 3 && !showEasterEgg) {
      setTimeout(() => setShowEasterEgg(true), 300);
    }

    // Spawn hearts
    handleHeartClick();
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return;

    setIsSubmittingFeedback(true);
    try {
      // You can add your feedback submission logic here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFeedback("");
      // Show success message
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmittingFeedback(false);
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
          womanId: woman.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to claim reward");
        setClaimStatus("error");
        return;
      }

      setClaimStatus("success");
      setTxHash(data.txHash || "");
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
    <div className="w-full max-w-4xl mx-auto">
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
              <Card className="relative border-2 border-white/50 backdrop-blur-sm overflow-hidden min-h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/95 to-white pointer-events-none" />
                <CardContent className="relative p-8 sm:p-12">
                  <AffirmationsPage womanId={woman.id} />
                </CardContent>
              </Card>
            )}

            {/* Page 1: Tribute & Welcome */}
            {currentPage === 1 && (
              <Card className="relative border-2 border-white/50 backdrop-blur-sm overflow-hidden min-h-[600px]">
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
              <Card className="relative border-2 border-white/50 backdrop-blur-sm overflow-visible min-h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/95 to-white pointer-events-none rounded-lg" />
                <CardHeader className="relative text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9470DC]/20 to-[#9470DC]/40 flex items-center justify-center shadow-lg">
                      {/* <svg
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
                      </svg> */}
                      <Image
                        src="/rose.png"
                        alt="Rose"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <CardTitle className="text-3xl text-foreground">
                    LUCKY MONEY -{" "}
                    <KnowledgeTooltip
                      term="USDT"
                      definition="USDT (Tether) is a stablecoin cryptocurrency pegged to the US Dollar. Each USDT token is worth approximately $1 USD, making it stable and predictable unlike Bitcoin or Ethereum."
                      example="Your 12 USDT = approximately $12 USD that you can use, trade, or convert to regular money anytime."
                    />{" "}
                    GIFT
                  </CardTitle>
                  <CardDescription className="text-base italic leading-relaxed">
                    Lady, maybe you expected a red envelope with cash — consider
                    this Hoasen's modern twist: secure{" "}
                    <KnowledgeTooltip
                      term="stablecoin"
                      definition="A cryptocurrency designed to maintain a stable value by being pegged to a real-world asset like the US Dollar. Unlike Bitcoin or Ethereum that go up and down, stablecoins stay at a consistent price."
                      example="1 USDT always equals $1 USD in real life, making it perfect for everyday transactions without worrying about price changes."
                    />{" "}
                    tokens that live on the{" "}
                    <KnowledgeTooltip
                      term="blockchain"
                      definition="A digital ledger that records transactions across many computers. Think of it like a shared Google Doc that everyone can see, but no one can secretly change or delete."
                      example="When you receive USDT, it's recorded on the blockchain, and everyone can verify you own it—but only you can spend it with your wallet."
                    />
                    .
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-6 px-8 pb-8">
                  {!redemption?.usdt_claimed ? (
                    <>
                      {/* Web3 Wallet Guide */}
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                          New to{" "}
                          <KnowledgeTooltip
                            term="Web3"
                            definition="The next generation of the internet where you own your digital assets directly, without relying on banks or companies to hold them for you. It's powered by blockchain technology."
                            example="Instead of PayPal holding your money, with Web3 you hold your own USDT in your personal wallet—like carrying cash, but digital and global."
                          />
                          ? Here's how to get started:
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
                            Download a{" "}
                            <KnowledgeTooltip
                              term="Web3 wallet"
                              definition="A digital app that stores your cryptocurrency and lets you send or receive it. Think of it as a digital purse that only you can access with your password."
                              example="MetaMask is a popular wallet app that works like a mobile banking app, but for cryptocurrencies."
                            />{" "}
                            app (e.g., MetaMask, Trust Wallet)
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
                            Copy your{" "}
                            <KnowledgeTooltip
                              term="wallet address"
                              definition="Your unique identifier on the blockchain, like an email address but for receiving cryptocurrency. It starts with '0x' and is a long string of letters and numbers."
                              example="0x742d35C...5f0bEb - this is like your bank account number that others use to send you money."
                            />{" "}
                            (starts with "0x...")
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

                        {/* Loading animation */}
                        {isLoading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 bg-purple-50 border border-purple-200 rounded-lg"
                          >
                            <div className="flex flex-col items-center gap-3">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="w-12 h-12 rounded-full border-4 border-[#9470DC]/30 border-t-[#9470DC]"
                              />
                              <p className="text-sm font-medium text-[#9470DC]">
                                Processing your transaction on the blockchain...
                              </p>
                              <p className="text-xs text-muted-foreground text-center">
                                This may take a few moments. Please don't close
                                this page.
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {claimStatus === "error" && (
                          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-2">
                            <p className="text-sm text-destructive">
                              {errorMessage}
                            </p>
                          </div>
                        )}

                        {claimStatus === "success" && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-4"
                          >
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                              <div className="flex gap-2">
                                <svg
                                  className="w-5 h-5 text-green-600 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-green-900">
                                    Success! 12{" "}
                                    <KnowledgeTooltip
                                      term="USDT"
                                      definition="USDT (Tether) is a stablecoin cryptocurrency pegged to the US Dollar. Each USDT token is worth approximately $1 USD, making it stable and predictable unlike Bitcoin or Ethereum."
                                      example="Your 12 USDT = approximately $12 USD that you can use, trade, or convert to regular money anytime."
                                    />{" "}
                                    sent to your wallet
                                  </p>
                                  <p className="text-xs text-green-700 mt-1">
                                    Your transaction has been confirmed on the
                                    blockchain.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Transaction link */}
                            {txHash && (
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs font-medium text-blue-900 mb-2">
                                  View your transaction:
                                </p>
                                <a
                                  href={`${
                                    process.env.NODE_ENV === "production"
                                      ? "https://basescan.org"
                                      : "https://sepolia.basescan.org"
                                  }/tx/${txHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                                >
                                  {txHash}
                                </a>
                              </div>
                            )}

                            {/* Instructions for checking balance */}
                            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-3">
                              <h4 className="text-sm font-semibold text-purple-900">
                                How to check your USDT balance:
                              </h4>
                              <ol className="space-y-2 text-xs text-purple-800">
                                <li className="flex items-start gap-2">
                                  <span className="font-bold">1.</span>
                                  <span>Open your MetaMask wallet</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="font-bold">2.</span>
                                  <span>
                                    Click the network dropdown at the top and
                                    select <strong>"Base"</strong>{" "}
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="font-bold">3.</span>
                                  <span>
                                    Click on 'Tokens' tab and scroll down to see
                                    your USDT token balance (wait few minutes)
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="font-bold">4.</span>
                                  <span>
                                    If you don't see USDT, tap "Import tokens"
                                    and search for USDT on Base network
                                  </span>
                                </li>
                                <li>
                                  <span className="italic mt-4">
                                    If you still don't see USDT, contact
                                    support: minh@hoasen.io (or Slack)
                                  </span>
                                </li>
                              </ol>
                            </div>
                          </motion.div>
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

            {/* Page 3: Phuc Long Gift */}
            {currentPage === 3 && (
              <Card className="relative border-2 border-white/50 backdrop-blur-sm overflow-hidden min-h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/95 to-white pointer-events-none" />

                <CardHeader className="relative text-center pb-4">
                  <div className="flex justify-center mb-3">
                    <div className="text-6xl">☕</div>
                  </div>
                  <CardTitle className="text-3xl text-foreground">
                    Phúc Long Gift Card
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    100,000 VND for your caffeine fix
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative space-y-6 px-8 pb-8">
                  {!giftBoxOpened ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 min-h-[450px]">
                      {/* Message */}
                      <div className="max-w-md mx-auto space-y-4 text-center">
                        <p className="text-gray-700 leading-relaxed">
                          Hey! A beauty like you shouldn't be dehydrated. ✨
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          We got you something that'll brighten your day (and
                          quench your thirst).
                        </p>
                        <p className="text-gray-600">
                          Here's a little treat from Phúc Long—enjoy!
                        </p>
                      </div>

                      {/* Gift box */}
                      <div className="flex flex-col items-center gap-4">
                        <motion.button
                          onClick={() => setGiftBoxOpened(true)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="cursor-pointer focus:outline-none"
                        >
                          <motion.div
                            animate={{
                              y: [0, -10, 0],
                              rotateZ: [0, 2, -2, 0],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="text-8xl"
                          >
                            🎁
                          </motion.div>
                        </motion.button>

                        <p className="text-sm text-purple-600 font-medium animate-pulse">
                          Tap to open
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Sparkles animation */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 pointer-events-none"
                      >
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{
                              x: "50%",
                              y: "50%",
                              scale: 0,
                            }}
                            animate={{
                              x: `${50 + (Math.random() - 0.5) * 100}%`,
                              y: `${50 + (Math.random() - 0.5) * 100}%`,
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 1,
                              delay: i * 0.1,
                              ease: "easeOut",
                            }}
                            className="absolute"
                          >
                            ✨
                          </motion.div>
                        ))}
                      </motion.div>

                      <div className="flex-1 flex flex-col items-center justify-center space-y-6 px-4 min-h-[450px]">
                        {woman?.phuc_long_image ? (
                          <div className="text-center space-y-6 z-10 w-full max-w-lg mx-auto">
                            {/* Gift card image */}
                            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border-2 border-white shadow-md">
                                <Image
                                  src={woman.phuc_long_image}
                                  alt="Phúc Long Gift Card"
                                  fill
                                  className="object-contain"
                                  priority
                                />
                              </div>

                              <div className="mt-5 flex gap-3 justify-center">
                                <a
                                  href={woman.phuc_long_image}
                                  download={`phuclong-gift-card-${woman.name}.png`}
                                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                  </svg>
                                  Download
                                </a>

                                <button
                                  onClick={handleCopyCode}
                                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                  </svg>
                                  {copiedCode ? "Copied!" : "Copy"}
                                </button>
                              </div>
                            </div>

                            {/* Instructions */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
                              <p className="text-sm text-blue-900">
                                <strong>How to use:</strong> Save or screenshot
                                this card, then show it at any Phúc Long store
                                to redeem. Enjoy! 🫰
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-gray-500">
                              Gift card coming soon! ✨
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Page 4: Feedback & Hearts */}
            {currentPage === 4 && (
              <Card className="relative border-2 border-white/50 backdrop-blur-sm overflow-hidden min-h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/95 to-white pointer-events-none" />

                {/* Easter Egg Modal */}
                <AnimatePresence>
                  {showEasterEgg && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                      onClick={() => setShowEasterEgg(false)}
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="relative bg-white rounded-3xl p-8 max-w-md shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Glitter particles */}
                        {[...Array(20)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{
                              scale: [0, 1, 0],
                              x: (Math.random() - 0.5) * 300,
                              y: (Math.random() - 0.5) * 300,
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              delay: i * 0.05,
                              repeat: Infinity,
                              repeatDelay: 2,
                            }}
                            className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                            style={{
                              boxShadow: "0 0 10px rgba(250, 204, 21, 0.8)",
                            }}
                          />
                        ))}

                        <div className="text-center space-y-4 relative z-10">
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              repeatDelay: 2,
                            }}
                            className="text-5xl mb-4"
                          >
                            🎉
                          </motion.div>

                          <h3 className="text-2xl font-bold text-purple-900">
                            Hidden Gem Discovered!
                          </h3>

                          {/* AI-gen image */}
                          <div className="relative w-64 h-64 mx-auto my-6 rounded-2xl overflow-hidden border-4 border-purple-300 shadow-xl">
                            <Image
                              src={`/easter-egg/${woman.id}.png`}
                              alt="Special AI-generated celebration"
                              fill
                              className="object-cover"
                            />
                          </div>

                          <p className="text-gray-700 leading-relaxed">
                            You found the secret by reacting with 3+ emojis!
                          </p>
                          <p className="text-sm text-gray-600">
                            This special image was crafted by Hoasen's superb AI
                            agent working tirelessly to cheer you up.
                          </p>
                          <p className="text-lg font-semibold text-purple-600">
                            Happy Women's Day! 💜
                          </p>

                          <div className="flex gap-3 justify-center pt-4">
                            <a
                              href={`/easter-egg/${woman.id}.png`}
                              download={`hoasen-womensday-${woman.name}.png`}
                              className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
                            >
                              Download
                            </a>
                            <button
                              onClick={() => setShowEasterEgg(false)}
                              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Share your thoughts (optional)
                      </label>
                      <Textarea
                        value={feedback}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setFeedback(e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        placeholder="How do you feel? Do you have any feedback? We'd love to know..."
                        className="w-full bg-white px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#9470DC] focus:ring-2 focus:ring-[#9470DC]/20 outline-none transition-all resize-none"
                        rows={4}
                      />
                    </div>

                    <div className="text-center space-y-4 relative">
                      <p className="text-sm text-gray-600">
                        Show some love to Hoasen with your reactions!
                      </p>

                      <div className="flex justify-center gap-3">
                        {[
                          {
                            icon: "💜",
                            color: "from-purple-400 to-purple-600",
                          },
                          {
                            icon: "😊",
                            color: "from-yellow-400 to-orange-500",
                          },
                          {
                            icon: "⭐",
                            color: "from-yellow-300 to-yellow-500",
                          },
                          { icon: "👍", color: "from-blue-400 to-blue-600" },
                          {
                            icon: "🪷",
                            color: "from-pink-300 to-pink-500",
                          },
                        ].map((reaction, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleReactionClick(reaction.icon)}
                            className={`w-14 h-14 rounded-full bg-gradient-to-br ${
                              reaction.color
                            } flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition-all ${
                              clickedReactions.has(reaction.icon)
                                ? "ring-4 ring-white ring-offset-2"
                                : ""
                            }`}
                          >
                            {reaction.icon}
                          </motion.button>
                        ))}
                      </div>

                      {heartCount > 0 && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-[#9470DC] font-medium"
                        >
                          {heartCount} reactions sent! Keep going! 🎉
                        </motion.p>
                      )}

                      {/* Floating Hearts Animation */}
                      <AnimatePresence>
                        {floatingHearts.map((heart) => (
                          <motion.div
                            key={heart.id}
                            initial={{ opacity: 1, y: 0, x: heart.x }}
                            animate={{
                              opacity: 0,
                              y: -200,
                              x: heart.x + (Math.random() - 0.5) * 100,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="absolute pointer-events-none text-4xl"
                            style={{ bottom: 100, left: "50%" }}
                          >
                            💜
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <button
                      onClick={handleSubmitFeedback}
                      disabled={isSubmittingFeedback}
                      className="w-full py-3 bg-gradient-to-r from-[#9470DC] to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingFeedback
                        ? "Sending..."
                        : "Send Your Message"}
                    </button>
                  </div>

                  {/* Legacy Heart Spam Section - Keep for backward compatibility */}
                  <div className="pt-6 border-t-2 border-white/30 hidden">
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
