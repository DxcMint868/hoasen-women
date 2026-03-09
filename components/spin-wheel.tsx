"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { WHEEL_SEGMENTS, type VoucherCard } from "@/lib/wheel-segments";

interface SpinWheelProps {
  womanId: string;
  onResult: (giftKey: string, label: string) => void;
  initialResult?: { giftKey: string; label: string } | null;
  initialVoucherCard?: VoucherCard | null;
}

// Deep purple + gold palette — alternating per segment
const SEGMENT_COLORS = [
  { bg: "#4A1D8C", text: "#F5C842" },
  { bg: "#C9A84C", text: "#2d1b4e" },
  { bg: "#6B3FA0", text: "#FFE680" },
  { bg: "#B8860B", text: "#2d1b4e" },
  { bg: "#3B1578", text: "#F5C842" },
  { bg: "#E8C97A", text: "#2d1b4e" },
  { bg: "#5C2DA8", text: "#FFE680" },
  { bg: "#D4A017", text: "#2d1b4e" },
];

const N = WHEEL_SEGMENTS.length;
const SLICE_DEG = 360 / N;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeSlice(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polarToCartesian(cx, cy, r, startDeg);
  const e = polarToCartesian(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
}

// Word-wrap a label into lines that fit within the radial slice
function wrapLabel(text: string, maxCharsPerLine = 15): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxCharsPerLine) {
      current += " " + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3); // max 3 lines
}

export default function SpinWheel({ womanId, onResult, initialResult, initialVoucherCard }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{ giftKey: string; label: string } | null>(
    initialResult ?? null
  );
  const [showResult, setShowResult] = useState(!!initialResult);
  const [voucherCard, setVoucherCard] = useState<VoucherCard | null>(initialVoucherCard ?? null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [error, setError] = useState("");
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, []);

  const handleSpin = async () => {
    if (spinning || result) return;
    setSpinning(true);
    setError("");

    try {
      const res = await fetch("/api/spin-wheel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ womanId }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      const { segmentIndex, giftKey, label } = data;

      // Calculate final rotation:
      // Segment i center is at (i * SLICE_DEG + SLICE_DEG/2) degrees from top
      // We want that center at the indicator (top = 0°)
      // So we rotate wheel by -(i * SLICE_DEG + SLICE_DEG/2)
      // Add multiple full rotations for drama
      const segmentCenter = segmentIndex * SLICE_DEG + SLICE_DEG / 2;
      const targetDeg = 360 * 6 + (360 - segmentCenter);
      setRotation((prev) => prev + targetDeg);

      // After spin animation completes, show result + fetch voucher card if applicable
      animRef.current = setTimeout(async () => {
        setResult({ giftKey, label });
        setShowResult(true);
        setSpinning(false);
        onResult(giftKey, label);

        if (giftKey === "voucher") {
          const cardRes = await fetch(`/api/voucher-card?womanId=${womanId}`);
          const cardData = await cardRes.json();
          setVoucherCard(cardData.card ?? null);
        }
      }, 4200);
    } catch (e) {
      setError("Something went wrong. Please try again.");
      setSpinning(false);
    }
  };

  const cx = 200;
  const cy = 200;
  const r = 185;
  const innerR = 38;
  const textR = 130;

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Wheel Container */}
      <div className="relative" style={{ width: 400, height: 400 }}>
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: "0 0 60px 10px rgba(245,200,66,0.18), 0 0 0 3px rgba(245,200,66,0.25)",
            borderRadius: "50%",
          }}
        />

        {/* Pointer / indicator at top */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-20"
          style={{ top: -14 }}
        >
          <svg width="28" height="36" viewBox="0 0 28 36">
            <polygon
              points="14,34 2,4 26,4"
              fill="#F5C842"
              stroke="#B8860B"
              strokeWidth="1.5"
            />
            <polygon points="14,34 2,4 26,4" fill="url(#goldPointer)" />
            <defs>
              <linearGradient id="goldPointer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFE680" />
                <stop offset="100%" stopColor="#B8860B" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Spinning SVG Wheel */}
        <motion.svg
          width="400"
          height="400"
          viewBox="0 0 400 400"
          animate={{ rotate: rotation }}
          transition={spinning ? { duration: 4, ease: [0.17, 0.67, 0.35, 1.0] } : { duration: 0 }}
          style={{ transformOrigin: "200px 200px" }}
        >
          <defs>
            {/* Single clip circle — noise applied once over entire wheel, no per-slice tiling */}
            <clipPath id="wheelCircleClip">
              <circle cx={cx} cy={cy} r={r} />
            </clipPath>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE680" stopOpacity="1" />
              <stop offset="60%" stopColor="#F5C842" stopOpacity="1" />
              <stop offset="100%" stopColor="#B8860B" stopOpacity="1" />
            </radialGradient>
            <radialGradient id="hubSheen" cx="35%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#FFF5B0" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#B8860B" stopOpacity="1" />
            </radialGradient>
            <filter id="textShadow">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Outer decorative ring */}
          <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke="#F5C842" strokeWidth="2" strokeOpacity="0.4" />
          <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#F5C842" strokeWidth="1" strokeOpacity="0.25" />

          {/* Segments */}
          {WHEEL_SEGMENTS.map((seg, i) => {
            const startDeg = i * SLICE_DEG;
            const endDeg = startDeg + SLICE_DEG;
            const midDeg = startDeg + SLICE_DEG / 2;
            const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
            const tp = polarToCartesian(cx, cy, textR, midDeg);
            // Flip text on the left half so it's always readable from outside
            const textAngle = midDeg >= 180 ? midDeg + 90 : midDeg - 90;

            return (
              <g key={seg.key}>
                {/* Slice */}
                <path
                  d={describeSlice(cx, cy, r, startDeg, endDeg)}
                  fill={color.bg}
                  stroke="#1a0a30"
                  strokeWidth="1.2"
                />
                {/* Thin gold separator line */}
                {(() => {
                  const lp = polarToCartesian(cx, cy, r, startDeg);
                  return (
                    <line
                      x1={cx} y1={cy}
                      x2={lp.x} y2={lp.y}
                      stroke="#F5C842"
                      strokeWidth="0.8"
                      strokeOpacity="0.5"
                    />
                  );
                })()}
                {/* Label — multi-line wrapped */}
                {(() => {
                  const lines = wrapLabel(seg.label);
                  const fontSize = 9.5;
                  const lineHeight = 11.5;
                  const totalH = (lines.length - 1) * lineHeight;
                  return (
                    <text
                      fill={color.text}
                      fontSize={fontSize}
                      fontFamily="'Geist', sans-serif"
                      fontWeight="500"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle}, ${tp.x}, ${tp.y})`}
                      filter="url(#textShadow)"
                      style={{ letterSpacing: "0.01em" }}
                    >
                      {lines.map((line, j) => (
                        <tspan
                          key={j}
                          x={tp.x}
                          y={tp.y - totalH / 2 + j * lineHeight}
                        >
                          {line}
                        </tspan>
                      ))}
                    </text>
                  );
                })()}
              </g>
            );
          })}

          {/* Single gold noise overlay across the whole wheel — no per-slice tiling artifact */}
          <image
            href="/textures/gold-noise.png"
            x={cx - r} y={cy - r}
            width={r * 2} height={r * 2}
            opacity="0.09"
            clipPath="url(#wheelCircleClip)"
            preserveAspectRatio="xMidYMid slice"
            style={{ mixBlendMode: "overlay" }}
          />

          {/* Center hub */}
          <circle cx={cx} cy={cy} r={innerR + 2} fill="#1a0a30" opacity="0.6" />
          <circle cx={cx} cy={cy} r={innerR} fill="url(#centerGlow)" />
          <circle cx={cx} cy={cy} r={innerR} fill="url(#hubSheen)" opacity="0.5" />
          <circle cx={cx} cy={cy} r={innerR - 5} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={4} fill="#1a0a30" opacity="0.8" />
          <circle cx={cx} cy={cy} r={2} fill="#FFE680" opacity="0.9" />
        </motion.svg>
      </div>

      {/* Spin Button */}
      {!result && (
        <motion.button
          onClick={handleSpin}
          disabled={spinning}
          whileHover={!spinning ? { scale: 1.04 } : {}}
          whileTap={!spinning ? { scale: 0.97 } : {}}
          className="relative overflow-hidden px-12 py-4 rounded-full font-semibold text-base tracking-widest uppercase disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: spinning
              ? "linear-gradient(135deg, #6B3FA0, #4A1D8C)"
              : "linear-gradient(135deg, #F5C842, #B8860B, #F5C842)",
            backgroundSize: spinning ? "auto" : "200% 200%",
            color: spinning ? "#FFE680" : "#2d1b4e",
            boxShadow: spinning
              ? "0 4px 20px rgba(106,63,160,0.4)"
              : "0 4px 24px rgba(245,200,66,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
            border: "1px solid rgba(245,200,66,0.4)",
            letterSpacing: "0.15em",
          }}
        >
          {/* Noise texture overlay on button */}
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url(/textures/gold-noise.png)",
              backgroundSize: "120px",
              opacity: spinning ? 0 : 0.12,
              mixBlendMode: "overlay",
            }}
          />
          <span className="relative">
            {spinning ? "Spinning..." : "Spin"}
          </span>
        </motion.button>
      )}

      {error && (
        <p className="text-sm text-red-400 font-medium">{error}</p>
      )}

      {/* Result reveal */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md space-y-4"
          >
            {/* Result label card */}
            <div
              className="relative overflow-hidden rounded-2xl p-8 text-center"
              style={{
                background: "linear-gradient(145deg, #2d1b4e, #4A1D8C)",
                boxShadow: "0 8px 48px rgba(245,200,66,0.2), inset 0 1px 0 rgba(245,200,66,0.15)",
                border: "1px solid rgba(245,200,66,0.3)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "url(/textures/gold-noise.png)",
                  backgroundSize: "180px",
                  opacity: 0.07,
                  mixBlendMode: "screen",
                }}
              />
              <div className="relative space-y-3">
                <p className="text-xs tracking-[0.25em] uppercase font-medium" style={{ color: "#F5C842", opacity: 0.7 }}>
                  Your Gift
                </p>
                <p className="text-xl font-semibold leading-snug" style={{ color: "#FFE680" }}>
                  {result.label}
                </p>
                <div
                  className="mx-auto mt-2 h-px w-16"
                  style={{ background: "linear-gradient(90deg, transparent, #F5C842, transparent)" }}
                />
                {result.giftKey !== "voucher" && (
                  <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Speak to the team to redeem — it&apos;s yours.
                  </p>
                )}
              </div>
            </div>

            {/* Voucher card detail — pending or ready */}
            {result.giftKey === "voucher" && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl"
                style={{
                  background: "linear-gradient(145deg, #1a0a30, #2d1b4e)",
                  border: "1px solid rgba(245,200,66,0.25)",
                  boxShadow: "0 4px 32px rgba(245,200,66,0.1)",
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: "url(/textures/gold-fluid.png)",
                    backgroundSize: "cover",
                    opacity: 0.06,
                  }}
                />

                {voucherCard?.status === "ready" && voucherCard.card_image_url ? (
                  /* ── Ready: show the actual card ── */
                  <div className="relative p-6 space-y-5">
                    <p className="text-xs tracking-[0.22em] uppercase text-center font-medium" style={{ color: "rgba(245,200,66,0.7)" }}>
                      Your Gift Card
                    </p>
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl" style={{ border: "1px solid rgba(245,200,66,0.2)" }}>
                      <Image
                        src={voucherCard.card_image_url}
                        alt="Gift Card"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    {voucherCard.card_code && (
                      <div className="space-y-2">
                        <p className="text-xs text-center tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                          Code
                        </p>
                        <div
                          className="flex items-center gap-3 px-4 py-3 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(245,200,66,0.15)" }}
                        >
                          <span className="flex-1 text-center font-mono font-semibold tracking-widest text-sm" style={{ color: "#FFE680" }}>
                            {voucherCard.card_code}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(voucherCard.card_code!);
                              setCopiedCode(true);
                              setTimeout(() => setCopiedCode(false), 2000);
                            }}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                            style={{
                              background: copiedCode ? "rgba(245,200,66,0.2)" : "rgba(245,200,66,0.1)",
                              color: "#F5C842",
                              border: "1px solid rgba(245,200,66,0.2)",
                            }}
                          >
                            {copiedCode ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ── Pending: being prepared ── */
                  <div className="relative p-8 text-center space-y-5">
                    {/* Hourglass SVG */}
                    <div className="flex justify-center">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F5C842" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
                        <path d="M5 2h14M5 22h14M6 2v4l4 4-4 4v4M18 2v4l-4 4 4 4v4" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <p className="text-base font-medium" style={{ color: "#FFE680" }}>
                        Your gift card is being prepared
                      </p>
                      <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                        We&apos;re getting your gift card ready. Come back to this page in about two weeks and it&apos;ll be waiting here for you.
                      </p>
                    </div>
                    <div
                      className="mx-auto h-px w-24"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(245,200,66,0.3), transparent)" }}
                    />
                    <p className="text-xs tracking-[0.15em] uppercase" style={{ color: "rgba(245,200,66,0.45)" }}>
                      Ready around late March 2026
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
