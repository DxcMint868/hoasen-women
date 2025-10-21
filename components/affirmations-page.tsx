"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

interface Affirmation {
  id: string;
  sender_name: string;
  message: string;
  created_at: string;
  flowers?: string | { type: string; quantity: number }[];
}

export default function AffirmationsPage({ womanId }: { womanId: string }) {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAffirmations = async () => {
      try {
        const supabase = createClient();
        console.log("Fetching affirmations for woman_id:", womanId);

        const { data, error: err } = await supabase
          .from("affirmations")
          .select("*")
          .eq("woman_id", womanId)
          .order("created_at", { ascending: false });

        console.log("Supabase response:", { data, error: err });

        if (err) {
          console.error("Error fetching affirmations:", err);
          setError("Failed to load affirmations");
          return;
        }

        console.log("Affirmations received:", data);
        setAffirmations(data || []);
      } catch (err) {
        console.error("Error:", err);
        setError("An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAffirmations();
  }, [womanId]);

  if (isLoading) {
    // Animated flowers loader
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative w-32 h-32">
          {/* Animated SVG flowers */}
          <motion.svg
            initial={{ scale: 0.7, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            viewBox="0 0 128 128"
            className="absolute inset-0 w-full h-full"
          >
            {/* Rose */}
            <motion.circle
              cx="64"
              cy="40"
              r="18"
              fill="#F8BBD0"
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0,
              }}
            />
            {/* Tulip */}
            <motion.ellipse
              cx="32"
              cy="80"
              rx="12"
              ry="18"
              fill="#FFD54F"
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.3,
              }}
            />
            {/* Lavender */}
            <motion.rect
              x="90"
              y="70"
              width="10"
              height="28"
              rx="5"
              fill="#CE93D8"
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.6,
              }}
            />
            {/* Sunflower */}
            <motion.circle
              cx="100"
              cy="32"
              r="10"
              fill="#FFD700"
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.9,
              }}
            />
            {/* Daisy */}
            <motion.ellipse
              cx="20"
              cy="30"
              rx="8"
              ry="12"
              fill="#FFF9C4"
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1.2,
              }}
            />
          </motion.svg>
          {/* Center emoji */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 flex items-center justify-center text-4xl"
          >
            💐
          </motion.div>
        </div>
        <p className="mt-6 text-lg text-[#9470DC] font-medium">
          Loading affirmations...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        {/* Debug Info - Remove after testing */}
        {/* <p className="text-xs text-muted-foreground/40 mb-2">Debug: womanId={womanId}, affirmations count={affirmations.length}</p> */}
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Affirmations
        </h2>
        <p className="text-muted-foreground">
          {affirmations.length === 0
            ? "It's quiet here. It seems that you woke up the earliest, to a serene garden that is yet to bloom."
            : `${affirmations.length} beautiful message${
                affirmations.length !== 1 ? "s" : ""
              } of love and support from Hoasenner colleagues`}
        </p>
      </div>

      {/* Affirmations Grid */}
      {affirmations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {affirmations.map((aff, index) => (
            <motion.div
              key={aff.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div
                className="relative p-6 rounded-2xl border-2 border-white/40 bg-gradient-to-br overflow-hidden hover:shadow-lg transition-all duration-300"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${
                    [
                      "#F8BBD0",
                      "#FFD54F",
                      "#CE93D8",
                      "#B2DFDB",
                      "#FFAB91",
                      "#A5D6A7",
                    ][index % 6]
                  }15, white)`,
                }}
              >
                {/* Decorative avatar corner */}
                <div className="absolute top-0 right-0 w-12 h-12 opacity-90 pointer-events-none">
                  <img
                    src={`/random-avatars/${(index % 9) + 1}.jpg`}
                    alt="Random avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#9470DC]/30 shadow"
                  />
                </div>

                {/* Content */}
                <div className="relative space-y-3">
                  {/* Affirmation Message */}
                  <p className="text-foreground font-light italic text-base leading-relaxed">
                    "{aff.message}"
                  </p>

                  {/* Flowers sent */}
                  {(() => {
                    // Parse flowers string to array if needed
                    let flowersArr: { type: string; quantity: number }[] = [];
                    if (Array.isArray(aff.flowers)) {
                      flowersArr = aff.flowers;
                    } else if (
                      typeof aff.flowers === "string" &&
                      aff.flowers.length > 0
                    ) {
                      flowersArr = aff.flowers
                        .split(",")
                        .map((pair) => {
                          const [type, qty] = pair.split("|");
                          return { type, quantity: Number(qty) };
                        })
                        .filter((f) => f.type && f.quantity > 0);
                    }
                    return flowersArr.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {flowersArr.map((flower, i) => {
                          const emoji =
                            flower.type === "rose"
                              ? "🌹"
                              : flower.type === "tulip"
                              ? "🌷"
                              : flower.type === "lavender"
                              ? "💜"
                              : flower.type === "sunflower"
                              ? "🌻"
                              : flower.type === "daisy"
                              ? "🌼"
                              : "💐";
                          return (
                            <span
                              key={flower.type + i}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/70 border border-[#9470DC]/20 text-sm font-medium text-[#9470DC] shadow"
                            >
                              {emoji} x{flower.quantity}
                            </span>
                          );
                        })}
                      </div>
                    ) : null;
                  })()}

                  {/* Sender Name */}
                  <div className="pt-3 border-t border-[#9470DC]/20">
                    <p className="text-sm font-medium text-[#9470DC]">
                      ✨ {aff.sender_name}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {new Date(aff.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16 px-6"
        >
          <div className="max-w-md mx-auto space-y-4">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="text-6xl mb-4"
            >
              �
            </motion.div>
            <h3 className="text-xl font-semibold text-foreground">
              Your Garden of Kindness
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              This space is reserved for heartfelt messages from your
              colleagues. While it's quiet now, it's ready to bloom with words
              of appreciation and support. 🌸
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
