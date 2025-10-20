"use client";

import { useEffect, useState } from "react";

const funnyBubbles = [
  "Found a bug? Fix it urself lol",
  "PRs welcome!",
  "This site runs on cá khô energy",
  "Design by Meg, bugs by Hao, Ca Kho by Nhu",
  "If you can read this, you can code!",
  "No QA, no party",
  "Bubble tea not included",
  "If you want a new feature, send snacks",
  "Cá khô: the real MVP",
  "Designer’s secret: Figma and cat memes",
  "QA motto: If it’s not broken, break it!",
  "Front-end powered by food cravings",
  "Deploying... please wait (or eat)",
  "If you see this, you’re awesome!",
  "This site is 99% bug-free. The other 1% is a feature.",
  "No food, no deploy",
  "Bangkok tested, Hoasen approved",
  "Warning: May contain traces of cá khô",
  "If you’re hungry, ask Nhu",
  "Meg’s design, Hao’s bugs, Nhu’s food. What a team!",
  "Refresh for more fun!",
];

export default function SiteFooter() {
  const [bubble, setBubble] = useState(funnyBubbles[0]);
  useEffect(() => {
    const interval = setInterval(() => {
      setBubble(funnyBubbles[Math.floor(Math.random() * funnyBubbles.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-white/20 bg-[#9470DC]/80 backdrop-blur-sm mt-24 relative">
      {/* Floating funny bubble */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-8 z-10">
        <div className="bg-white/90 text-[#9470DC] px-5 py-2 rounded-full shadow-lg border border-[#9470DC]/30 text-sm font-semibold animate-bounce select-none">
          {bubble}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center flex flex-col items-center gap-3">
        <p className="text-sm text-white/80">
          Made with <b>love</b> in heart, <b>skills</b> in hand, and <b>creativity</b> in mind (❌ <b>money</b> in pocket) • October 20, 2024
        </p>
        <a
          href="https://github.com/DxcMint868/hoasen-women"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="11" fill="#fff" />
            <path
              d="M11 17c-3.3 0-6-2.7-6-6 0-2.6 1.7-4.8 4.1-5.7.3-.1.4.1.4.3v1.2c-1.7-.4-2.1.8-2.1.8-.3.7-.7.9-.7.9-.6.4 0 .4 0 .4.7 0 1.1.7 1.1.7.6 1.1 1.6.8 2 .6.1-.4.2-.8.4-1-.7-.1-1.4-.4-1.4-1.6 0-.4.1-.7.3-1-.1-.3-.3-1.1.1-2.2 0 0 .6-.2 2 .8.6-.2 1.2-.3 1.8-.3s1.2.1 1.8.3c1.4-1 2-.8 2-.8.4 1.1.2 1.9.1 2.2.2.3.3.6.3 1 0 1.2-.7 1.5-1.4 1.6.2.2.4.6.4 1 0 1.2-.7 2.1-2.1 2.1z"
              fill="#9470DC"
            />
          </svg>
          View source on GitHub
        </a>
      </div>
    </footer>
  );
}
