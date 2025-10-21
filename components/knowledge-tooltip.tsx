"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KnowledgeTooltipProps {
  term: string;
  definition: string;
  example?: string;
}

export default function KnowledgeTooltip({
  term,
  definition,
  example,
}: KnowledgeTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="inline-block relative">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 text-[#9470DC] font-medium underline decoration-dotted underline-offset-2 hover:text-[#7d5fc4] transition-colors cursor-help"
      >
        {term}
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
          <path
            d="M12 16v-4m0-4h.01"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[9999] w-72 p-4 bg-white rounded-lg shadow-xl border-2 border-[#9470DC]/20 mt-2"
            style={{
              maxWidth: "calc(100vw - 2rem)",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <div className="space-y-2">
              <h4 className="font-bold text-[#9470DC] text-sm flex items-center gap-2">
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                {term}
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {definition}
              </p>
              {example && (
                <div className="mt-3 p-2 bg-purple-50 rounded border border-purple-100">
                  <p className="text-xs text-purple-800">
                    <span className="font-semibold">Example:</span> {example}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
