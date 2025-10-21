"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import AffirmationModal from "./affirmation-modal";

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
    title: "Chief Food Officer (& Front-End Engineer)",
    description:
      "The Cá Khô Queen. Her dried fish made it all the way to Bangkok in Meg's suitcase.",
    hoverEffect: "treats",
  },
};

export default function ProfileCard({
  woman,
  onClick,
}: {
  woman: Woman;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showAffirmationModal, setShowAffirmationModal] = useState(false);
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
          </motion.div>
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
        </motion.div>
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
          </motion.div>
        );
      }
    } else if (personalization.hoverEffect === "treats") {
      // Sweet treats floating around
      const treats = ["🍰", "🧋", "🍩", "🍪", "🍨"];
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
          </motion.div>
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
      <div className="relative rounded-2xl overflow-hidden border-2 border-white/50 hover:border-white/70 transition-all duration-500 shadow-lg hover:shadow-2xl backdrop-blur-md">
        {/* Floating elements */}
        {renderFloatingElements()}
        {/* Smooth gradient overlay across entire card */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/95 to-white pointer-events-none" />

        {/* Content with relative positioning */}
        <div className="relative">
          {/* Image Container */}
          <div className="relative aspect-square bg-gradient-to-br from-white/10 to-white/5 overflow-hidden p-4">
            {/* Outer frame effect */}
            <div className="absolute inset-4 border-2 border-white/30 rounded-xl pointer-events-none" />

            {/* Photo */}
            <div className="relative h-full rounded-lg overflow-hidden">
              <Image
                src={woman.slack_pfp_url || "/placeholder.svg"}
                alt={woman.name}
                fill
                className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              {/* Soft overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          {/* Content - text section */}
          <div className="px-6 py-5 text-center border-t-2 border-white/30">
            <h3 className="text-lg font-medium text-foreground mb-1 tracking-wide">
              {woman.name}
            </h3>
            {personalization && (
              <>
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  {personalization.title}
                </p>
                <p className="text-xs text-muted-foreground/80 font-light italic leading-relaxed">
                  {personalization.description}
                </p>
              </>
            )}
            {!personalization && (
              <p className="text-xs text-muted-foreground font-light tracking-widest uppercase">
                Click to reveal
              </p>
            )}
          </div>

          {/* Affirmation Button - Show on Hover */}
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowAffirmationModal(true);
              }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#F8BBD0]/80 hover:bg-[#F8BBD0] text-[#9470DC] font-medium text-sm rounded-full transition-all shadow-md hover:shadow-lg"
            >
              💝 Send Affirmation
            </motion.button>
          )}
        </div>
      </div>

      {/* Affirmation Modal */}
      <AffirmationModal
        womanId={woman.id}
        womanName={woman.name}
        isOpen={showAffirmationModal}
        onClose={() => setShowAffirmationModal(false)}
      />
    </motion.div>
  );
}
