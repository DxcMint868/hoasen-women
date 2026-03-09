"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SpinWheel from "./spin-wheel";
import type { VoucherCard } from "@/lib/wheel-segments";

interface Woman {
  id: string;
  name: string;
  slack_pfp_url: string;
}

// ─── Botanical SVG flowers ────────────────────────────────────────────────────

function FlowerRose({ size = 72, opacity = 0.55 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" opacity={opacity}>
      <ellipse cx="36" cy="20" rx="9" ry="15" fill="#E8C97A" transform="rotate(0 36 36)" />
      <ellipse cx="36" cy="20" rx="9" ry="15" fill="#D4A017" transform="rotate(60 36 36)" />
      <ellipse cx="36" cy="20" rx="9" ry="15" fill="#E8C97A" transform="rotate(120 36 36)" />
      <ellipse cx="36" cy="20" rx="9" ry="15" fill="#C9A84C" transform="rotate(180 36 36)" />
      <ellipse cx="36" cy="20" rx="9" ry="15" fill="#E8C97A" transform="rotate(240 36 36)" />
      <ellipse cx="36" cy="20" rx="9" ry="15" fill="#D4A017" transform="rotate(300 36 36)" />
      <circle cx="36" cy="36" r="10" fill="#B8860B" />
      <circle cx="33" cy="33" r="4" fill="#FFE680" fillOpacity="0.5" />
      <line x1="36" y1="48" x2="36" y2="70" stroke="#6B3FA0" strokeWidth="1.5" strokeOpacity="0.35" />
      <ellipse cx="27" cy="61" rx="8" ry="4.5" fill="#6B3FA0" fillOpacity="0.18" transform="rotate(-25 27 61)" />
    </svg>
  );
}

function FlowerTulip({ size = 72, opacity = 0.55 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" opacity={opacity}>
      <path d="M36 36 Q24 22 28 10 Q36 18 36 36Z" fill="#D4A017" />
      <path d="M36 36 Q48 22 44 10 Q36 18 36 36Z" fill="#E8C97A" />
      <path d="M36 36 Q22 28 18 16 Q30 20 36 36Z" fill="#C9A84C" fillOpacity="0.7" />
      <path d="M36 36 Q50 28 54 16 Q42 20 36 36Z" fill="#E8C97A" fillOpacity="0.7" />
      <line x1="36" y1="36" x2="36" y2="68" stroke="#6B3FA0" strokeWidth="1.5" strokeOpacity="0.35" />
      <path d="M36 52 Q26 48 22 42" stroke="#6B3FA0" strokeWidth="1.2" strokeOpacity="0.25" fill="none" />
    </svg>
  );
}

function FlowerDaisy({ size = 72, opacity = 0.5 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" opacity={opacity}>
      {[0,40,80,120,160,200,240,280,320].map((deg, i) => (
        <ellipse key={i} cx="36" cy="19" rx="5" ry="12" fill={i % 2 === 0 ? "#FFE680" : "#E8C97A"}
          transform={`rotate(${deg} 36 36)`} />
      ))}
      <circle cx="36" cy="36" r="9" fill="#D4A017" />
      <circle cx="33" cy="33" r="3.5" fill="#FFE680" fillOpacity="0.6" />
      <line x1="36" y1="46" x2="36" y2="70" stroke="#6B3FA0" strokeWidth="1.5" strokeOpacity="0.35" />
      <ellipse cx="28" cy="60" rx="7" ry="4" fill="#6B3FA0" fillOpacity="0.15" transform="rotate(-20 28 60)" />
    </svg>
  );
}

function FlowerLavender({ size = 72, opacity = 0.5 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" opacity={opacity}>
      <line x1="36" y1="68" x2="36" y2="20" stroke="#6B3FA0" strokeWidth="1.5" strokeOpacity="0.4" />
      {[20,26,32,38,44,50].map((y, i) => (
        <g key={i}>
          <ellipse cx={36 - 7} cy={y} rx="7" ry="4" fill="#B89AE0" fillOpacity="0.5" transform={`rotate(-30 ${36-7} ${y})`} />
          <ellipse cx={36 + 7} cy={y} rx="7" ry="4" fill="#D4A017" fillOpacity="0.35" transform={`rotate(30 ${36+7} ${y})`} />
        </g>
      ))}
    </svg>
  );
}

function FlowerSunflower({ size = 72, opacity = 0.55 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" opacity={opacity}>
      {[0,22.5,45,67.5,90,112.5,135,157.5,180,202.5,225,247.5,270,292.5,315,337.5].map((deg, i) => (
        <ellipse key={i} cx="36" cy="16" rx="4" ry="11" fill={i % 2 === 0 ? "#F5C842" : "#D4A017"}
          transform={`rotate(${deg} 36 36)`} />
      ))}
      <circle cx="36" cy="36" r="11" fill="#B8860B" />
      <circle cx="32" cy="32" r="4" fill="#D4A017" fillOpacity="0.5" />
      <line x1="36" y1="48" x2="36" y2="70" stroke="#6B3FA0" strokeWidth="1.5" strokeOpacity="0.35" />
    </svg>
  );
}

const FLOWER_MAP: Record<string, React.ComponentType<{ size?: number; opacity?: number }>> = {
  rose: FlowerRose,
  tulip: FlowerTulip,
  daisy: FlowerDaisy,
  lavender: FlowerLavender,
  sunflower: FlowerSunflower,
};

// ─── Navigation icons ─────────────────────────────────────────────────────────

const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5l7 7-7 7" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 19l-7-7 7-7" />
  </svg>
);

// ─── Screen 1: Artistic letter ────────────────────────────────────────────────

function LetterScreen({ woman, personalMessage, flowers, onNext }: {
  woman: Woman;
  personalMessage: string;
  flowers: string[];
  onNext: () => void;
}) {
  const flowerTypes = flowers.length > 0 ? flowers : ["rose", "daisy"];
  const FlowerA = FLOWER_MAP[flowerTypes[0]] ?? FlowerRose;
  const FlowerB = FLOWER_MAP[flowerTypes[1]] ?? FlowerDaisy;

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: "linear-gradient(160deg, #FFFDF5 0%, #FFF8E7 50%, #FFFBF0 100%)",
        boxShadow: "0 32px 80px rgba(74,29,140,0.22), 0 2px 0 rgba(245,200,66,0.5)",
        border: "1px solid rgba(245,200,66,0.4)",
      }}
    >
      {/* Gold noise on card */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "url(/textures/gold-noise.png)", backgroundSize: "200px", opacity: 0.04, mixBlendMode: "multiply" }} />

      {/* Top gold bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: "linear-gradient(90deg, transparent, #F5C842 30%, #FFE680 50%, #F5C842 70%, transparent)" }} />
      {/* Bottom gold bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: "linear-gradient(90deg, transparent, #F5C842 30%, #FFE680 50%, #F5C842 70%, transparent)" }} />

      {/* Corner flowers */}
      <div className="absolute top-3 left-3 pointer-events-none">
        <FlowerA size={80} opacity={0.45} />
      </div>
      <div className="absolute top-3 right-3 pointer-events-none" style={{ transform: "scaleX(-1)" }}>
        <FlowerB size={72} opacity={0.38} />
      </div>
      <div className="absolute bottom-16 right-4 pointer-events-none" style={{ transform: "rotate(180deg)" }}>
        <FlowerA size={64} opacity={0.3} />
      </div>
      <div className="absolute bottom-16 left-4 pointer-events-none" style={{ transform: "rotate(180deg) scaleX(-1)" }}>
        <FlowerB size={56} opacity={0.25} />
      </div>

      {/* Letter content */}
      <div className="relative px-12 py-12 flex flex-col items-center gap-7 min-h-[640px]">

        {/* Date badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <div className="h-px w-8" style={{ background: "linear-gradient(90deg, transparent, #B8860B)" }} />
          <p className="text-xs tracking-[0.3em] uppercase font-semibold" style={{ color: "#B8860B" }}>
            International Women&apos;s Day · March 8, 2026
          </p>
          <div className="h-px w-8" style={{ background: "linear-gradient(90deg, #B8860B, transparent)" }} />
        </motion.div>

        {/* Profile medallion */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
        >
          <div className="relative">
            <div className="absolute -inset-1.5 rounded-full"
              style={{ background: "conic-gradient(from 0deg, #F5C842, #B8860B, #FFE680, #F5C842)", opacity: 0.7 }} />
            <div className="relative w-24 h-24 rounded-full overflow-hidden"
              style={{ boxShadow: "0 4px 24px rgba(74,29,140,0.2)" }}>
              <Image src={woman.slack_pfp_url || "/placeholder.svg"} alt={woman.name} fill className="object-cover" />
            </div>
          </div>
        </motion.div>

        {/* Salutation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="text-center"
        >
          <h1 className="text-4xl font-semibold" style={{ color: "#2d1b4e", letterSpacing: "-0.015em" }}>
            Dear {woman.name.split(" ")[0]},
          </h1>
        </motion.div>

        {/* Gold ornament divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.5 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.42 }}
          className="flex items-center gap-3 w-full max-w-xs"
        >
          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(184,134,11,0.4))" }} />
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M9 1 L10.5 7 L16.5 9 L10.5 11 L9 17 L7.5 11 L1.5 9 L7.5 7 Z"
              fill="#B8860B" fillOpacity="0.6" />
          </svg>
          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(184,134,11,0.4), transparent)" }} />
        </motion.div>

        {/* Letter body */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-base leading-[1.85] text-center max-w-sm font-light"
          style={{ color: "#3d2b60", fontStyle: "italic" }}
        >
          &ldquo;{personalMessage}&rdquo;
        </motion.p>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="h-px w-20" style={{ background: "linear-gradient(90deg, transparent, #B8860B, transparent)" }} />
          <p className="text-sm font-medium tracking-widest" style={{ color: "#B8860B", letterSpacing: "0.12em" }}>
            With love, Hoasen
          </p>
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.78 }}
          onClick={onNext}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative overflow-hidden flex items-center gap-3 px-10 py-3.5 rounded-full font-medium text-sm"
          style={{
            background: "linear-gradient(135deg, #2d1b4e, #4A1D8C)",
            color: "#FFE680",
            boxShadow: "0 6px 24px rgba(74,29,140,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
            border: "1px solid rgba(245,200,66,0.25)",
            letterSpacing: "0.1em",
          }}
        >
          <span className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "url(/textures/gold-noise.png)", backgroundSize: "120px", opacity: 0.08 }} />
          <span className="relative tracking-widest uppercase text-xs">Reveal your gift</span>
          <span className="relative"><ChevronRight /></span>
        </motion.button>
      </div>
    </div>
  );
}

// ─── Screen 2: Spin wheel ─────────────────────────────────────────────────────

function GiftScreen({ woman, onBack, initialResult, initialVoucherCard }: {
  woman: Woman;
  onBack: () => void;
  initialResult?: { giftKey: string; label: string } | null;
  initialVoucherCard?: VoucherCard | null;
}) {
  const [result, setResult] = useState<{ giftKey: string; label: string } | null>(initialResult ?? null);

  return (
    <div className="space-y-0">
      {/* Header */}
      <div
        className="px-10 py-7 flex items-center justify-between rounded-t-3xl"
        style={{
          background: "linear-gradient(160deg, #2d1b4e 0%, #4A1D8C 100%)",
          border: "1px solid rgba(245,200,66,0.2)",
          borderBottom: "none",
        }}
      >
        <button onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "#F5C842" }}>
          <ChevronLeft />
          <span style={{ letterSpacing: "0.06em" }}>Back</span>
        </button>
        <p className="text-xs tracking-[0.2em] uppercase font-medium" style={{ color: "rgba(245,200,66,0.8)" }}>
          Your gift awaits
        </p>
        <div className="w-16" />
      </div>

      {/* Wheel area */}
      <div
        className="px-8 pb-12 pt-10 rounded-b-3xl flex flex-col items-center gap-4 relative"
        style={{
          background: "linear-gradient(180deg, #4A1D8C 0%, #2d1b4e 100%)",
          border: "1px solid rgba(245,200,66,0.2)",
          borderTop: "none",
          boxShadow: "0 24px 80px rgba(74,29,140,0.35)",
        }}
      >
        <div className="absolute left-0 right-0 h-32 pointer-events-none opacity-10 top-0"
          style={{ backgroundImage: "url(/textures/gold-fluid.png)", backgroundSize: "cover" }} />

        {!result ? (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h2 className="text-2xl font-semibold" style={{ color: "#FFE680", letterSpacing: "-0.01em" }}>
              Spin to reveal your gift
            </h2>
            <p className="text-sm font-light mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>One spin. Yours to keep.</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h2 className="text-2xl font-semibold" style={{ color: "#FFE680", letterSpacing: "-0.01em" }}>
              Happy International Women&apos;s Day, {woman.name.split(" ")[0]}
            </h2>
          </motion.div>
        )}

        <SpinWheel
          womanId={woman.id}
          onResult={(key, label) => setResult({ giftKey: key, label })}
          initialResult={initialResult}
          initialVoucherCard={initialVoucherCard}
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RedemptionCard({
  woman,
  personalMessage,
  flowers,
  spinResult,
  voucherCard,
}: {
  woman: Woman;
  personalMessage: string;
  flowers: string[];
  spinResult?: { giftKey: string; label: string } | null;
  voucherCard?: VoucherCard | null;
}) {
  const [screen, setScreen] = useState<0 | 1>(0);
  const [dir, setDir] = useState(1);

  const goTo = (next: 0 | 1) => {
    setDir(next > screen ? 1 : -1);
    setScreen(next);
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 56 : -56, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 56 : -56, opacity: 0 }),
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* 2-dot step indicator */}
      <div className="flex justify-center gap-3 mb-8">
        {[0, 1].map((i) => (
          <div key={i} className="transition-all duration-500 rounded-full"
            style={{
              width: i === screen ? 32 : 8, height: 8,
              background: i === screen
                ? "linear-gradient(90deg, #F5C842, #B8860B)"
                : i < screen ? "rgba(245,200,66,0.5)" : "rgba(255,255,255,0.2)",
              boxShadow: i === screen ? "0 0 8px rgba(245,200,66,0.5)" : "none",
            }}
          />
        ))}
      </div>

      <AnimatePresence initial={false} custom={dir} mode="wait">
        <motion.div
          key={screen}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          {screen === 0 && (
            <LetterScreen
              woman={woman}
              personalMessage={personalMessage}
              flowers={flowers}
              onNext={() => goTo(1)}
            />
          )}
          {screen === 1 && (
            <GiftScreen
              woman={woman}
              onBack={() => goTo(0)}
              initialResult={spinResult}
              initialVoucherCard={voucherCard}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
