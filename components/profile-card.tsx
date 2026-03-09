"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

interface Woman {
  id: string;
  name: string;
  slack_pfp_url: string;
}

// Personalized data for each woman
const personalizations: Record<
  string,
  {
    title: string;
    description: string;
    hoverEffect: "cats" | "bugs" | "treats";
  }
> = {
  "Meg Chanta": {
    title: "Designer",
    description:
      "Multilingual in Thai, English, and Figma. Also speaks fluent Cat and Dog.",
    hoverEffect: "cats",
  },
  "Hao Vo": {
    title: "QA Engineer",
    description:
      "Professional bug whisperer. They see her coming and run for their lives.",
    hoverEffect: "bugs",
  },
  "Nhu Nguyen": {
    title: "Front-End Engineer & Chief Food Officer",
    description:
      "The Cá Khô Queen. Her dried fish made it all the way to Bangkok in Meg's suitcase.",
    hoverEffect: "treats",
  },
  "Trang Nguyen": {
    title: "Project Manager",
    description:
      "Moved an entire office in her first week. Maps chaos, connects dots, speaks Czech, German, English & Vietnamese — probably thinks in all four at once.",
    hoverEffect: "treats",
  },
  "Mink Chanakan": {
    title: "Marketing Specialist",
    description:
      "Queen of content who turns ideas into campaigns and every campaign into a story worth remembering. Creative, sharp, and always three steps ahead.",
    hoverEffect: "cats",
  }
};

export default function ProfileCard({
  woman,
  onClick,
}: {
  woman: Woman;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const personalization = personalizations[woman.name];
  // Render floating elements based on personalization
  const renderFloatingElements = () => {
    if (!isHovered || !personalization) return null;

    const elements: React.ReactNode[] = [];

    if (personalization.hoverEffect === "cats") {
      // Cute cats running around
      for (let i = 0; i < 3; i++) {
        elements.push(
          <motion.div
            key={`cat-${i}`}
            className="absolute pointer-events-none"
            initial={{ x: -30, y: Math.random() * 200 + 50 }}
            animate={{
              x: 400,
              y: Math.random() * 200 + 50,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.8,
            }}
          >
            <span className="text-2xl">🐱</span>
          </motion.div>,
        );
      }
      // Add a dog too
      elements.push(
        <motion.div
          key="dog"
          className="absolute pointer-events-none"
          initial={{ x: -30, y: Math.random() * 200 + 100 }}
          animate={{
            x: 400,
            y: Math.random() * 200 + 100,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 1.5,
          }}
        >
          <span className="text-2xl">🐶</span>
        </motion.div>,
      );
    } else if (personalization.hoverEffect === "bugs") {
      // Bugs scurrying around
      for (let i = 0; i < 4; i++) {
        elements.push(
          <motion.div
            key={`bug-${i}`}
            className="absolute pointer-events-none"
            initial={{ x: Math.random() * 300, y: -20 }}
            animate={{
              x: Math.random() * 300,
              y: 400,
            }}
            transition={{
              duration: 2 + Math.random() * 1.5,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <span className="text-xl">🐛</span>
          </motion.div>,
        );
      }
    } else if (personalization.hoverEffect === "treats") {
      // Sweet treats floating around
    const treats = ["✨", "💛", "🌟", "⭐", "🏆"];
      for (let i = 0; i < 5; i++) {
        elements.push(
          <motion.div
            key={`treat-${i}`}
            className="absolute pointer-events-none"
            initial={{
              x: Math.random() * 300,
              y: 400,
              rotate: 0,
            }}
            animate={{
              x: Math.random() * 300,
              y: -30,
              rotate: 360,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.6,
            }}
          >
            <span className="text-2xl">{treats[i]}</span>
          </motion.div>,
        );
      }
    }

    return elements;
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer group"
    >
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          background: "linear-gradient(160deg, #2d1b4e 0%, #1a0a30 100%)",
          border: "1px solid rgba(245,200,66,0.25)",
          boxShadow: isHovered
            ? "0 20px 60px rgba(74,29,140,0.5), 0 0 0 1px rgba(245,200,66,0.4)"
            : "0 8px 32px rgba(74,29,140,0.3), 0 0 0 1px rgba(245,200,66,0.15)",
        }}
      >
        {/* Gold noise texture */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "url(/textures/gold-noise.png)", backgroundSize: "180px", opacity: 0.05, mixBlendMode: "screen" }} />

        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(245,200,66,0.6), transparent)" }} />

        {/* Floating elements */}
        {renderFloatingElements()}

        <div className="relative">
          {/* Image container */}
          <div className="relative aspect-square overflow-hidden p-3">
            <div className="absolute inset-3 rounded-xl pointer-events-none z-10"
              style={{ border: "1px solid rgba(245,200,66,0.2)" }} />
            <div className="relative h-full rounded-xl overflow-hidden">
              <Image
                src={woman.slack_pfp_url || "/placeholder.svg"}
                alt={woman.name}
                fill
                className="object-cover transition-transform duration-700 ease-out"
                style={{ transform: isHovered ? "scale(1.04)" : "scale(1)" }}
              />
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(to top, rgba(26,10,48,0.5) 0%, transparent 60%)",
                  opacity: isHovered ? 1 : 0.4,
                }}
              />
            </div>
          </div>

          {/* Text section */}
          <div className="px-5 py-4 text-center"
            style={{ borderTop: "1px solid rgba(245,200,66,0.12)" }}>
            <h3 className="text-base font-semibold mb-0.5 tracking-wide" style={{ color: "#FFE680" }}>
              {woman.name}
            </h3>
            {personalization ? (
              <>
                <p className="text-xs font-medium mb-2" style={{ color: "rgba(245,200,66,0.7)", letterSpacing: "0.06em" }}>
                  {personalization.title}
                </p>
                <p className="text-xs font-light italic leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {personalization.description}
                </p>
              </>
            ) : (
              <p className="text-xs font-light tracking-widest uppercase" style={{ color: "rgba(245,200,66,0.45)" }}>
                Click to reveal
              </p>
            )}
          </div>

          {/* Hover CTA */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-5 pb-4 flex justify-center"
            >
              <div
                className="px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
                style={{
                  background: "linear-gradient(135deg, rgba(245,200,66,0.15), rgba(245,200,66,0.08))",
                  border: "1px solid rgba(245,200,66,0.3)",
                  color: "#F5C842",
                  letterSpacing: "0.1em",
                }}
              >
                Open gift
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
