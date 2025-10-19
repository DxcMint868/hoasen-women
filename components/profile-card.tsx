"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface Woman {
  id: string
  name: string
  slack_pfp_url: string
}

export default function ProfileCard({
  woman,
  onClick,
}: {
  woman: Woman
  onClick: () => void
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div className="relative rounded-2xl overflow-hidden border-2 border-white/50 hover:border-white/70 transition-all duration-500 shadow-lg hover:shadow-2xl backdrop-blur-md">
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
            <h3 className="text-lg font-medium text-foreground mb-1 tracking-wide">{woman.name}</h3>
            <p className="text-xs text-muted-foreground font-light tracking-widest uppercase">Click to reveal</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
