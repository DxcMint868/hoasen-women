import { useState } from "react";

export default function MenCard() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{ perspective: 1200 }}
    >
      <div
        className="w-full h-full"
        style={{ width: "100%", height: "100%", maxWidth: 340, minHeight: 420 }}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 ease-in-out`}
          style={{
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
          }}
          onClick={() => setFlipped((f) => !f)}
        >
          {/* Front Side */}
          <div
            className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border-2 border-white/50 bg-gradient-to-b from-white/90 via-white/95 to-white shadow-lg flex flex-col items-center justify-center cursor-pointer"
            style={{
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="w-24 h-24 mb-4 flex items-center justify-center">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="40" cy="28" r="16" fill="#D1C4E9" />
                <ellipse cx="40" cy="60" rx="22" ry="14" fill="#EDE7F6" />
                <rect
                  x="32"
                  y="44"
                  width="16"
                  height="18"
                  rx="8"
                  fill="#B39DDB"
                />
                <ellipse cx="40" cy="28" rx="16" ry="16" fill="#D1C4E9" />
                <ellipse cx="40" cy="28" rx="8" ry="8" fill="#B39DDB" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1 tracking-wide">
              For men of Hoasen
            </h3>
            <p className="text-xs text-muted-foreground font-light tracking-widest uppercase">
              Click to flip
            </p>
          </div>
          {/* Back Side */}
          <div
            className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border-2 border-white/50 bg-gradient-to-b from-white/90 via-white/95 to-white shadow-lg flex flex-col items-center justify-center cursor-pointer"
            style={{
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="w-20 h-20 mb-4 flex items-center justify-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="20"
                  y="8"
                  width="8"
                  height="32"
                  rx="4"
                  fill="#B39DDB"
                />
                <rect
                  x="8"
                  y="20"
                  width="32"
                  height="8"
                  rx="4"
                  fill="#B39DDB"
                />
              </svg>
            </div>
            <p className="text-base text-foreground text-center px-4 font-semibold">
              Sorry, this card is for decoration only.
              <br />
              Try again on International Men's Day!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
