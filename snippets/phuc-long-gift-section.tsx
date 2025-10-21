// Creative Phuc Long gift reveal section
// Replace entire page 3 (NFT Minting section) with this

{/* Page 3: Phuc Long Gift */}
{currentPage === 3 && (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    className="flex flex-col h-full"
  >
    <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-[#9470DC] to-purple-600 bg-clip-text text-transparent">
      A Moment Just For You
    </h2>

    {!giftBoxOpened ? (
      <motion.div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-3 px-4">
          <p className="text-base text-muted-foreground leading-relaxed">
            You deserve a pause. A moment to breathe.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            To nourish yourself with something warm and comforting.
          </p>
          <p className="text-base font-medium text-purple-800">
            We've prepared something special for you...
          </p>
        </div>

        {/* Animated gift box */}
        <motion.button
          onClick={() => setGiftBoxOpened(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer focus:outline-none focus:ring-4 focus:ring-purple-300 rounded-lg"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotateZ: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl"
          >
            🎁
          </motion.div>
        </motion.button>

        <p className="text-sm text-purple-600 font-medium animate-pulse">
          Tap the gift to open
        </p>
      </motion.div>
    ) : (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col items-center justify-center space-y-6 px-4"
      >
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
                scale: 0
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 100}%`,
                y: `${50 + (Math.random() - 0.5) * 100}%`,
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute"
            >
              ✨
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center space-y-4 z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4"
          >
            ☕
          </motion.div>

          <h3 className="text-xl font-bold text-purple-900">
            Phuc Long Gift Card
          </h3>
          
          <p className="text-sm text-muted-foreground">
            100,000 VND to treat yourself
          </p>

          {/* Gift code */}
          <div className="bg-gradient-to-br from-[#9470DC]/10 to-purple-100 border-2 border-[#9470DC] rounded-lg p-6 space-y-3">
            <p className="text-xs font-medium text-purple-700 uppercase tracking-wide">
              Your Gift Code
            </p>
            <div className="bg-white rounded px-4 py-3 font-mono text-lg font-bold text-purple-900 tracking-wider">
              {redemption.phuc_long_code || "PHUCLONG2024"}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(redemption.phuc_long_code || "PHUCLONG2024");
                // You can add a toast notification here
              }}
              className="w-full bg-[#9470DC] hover:bg-[#7d5ec4] text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              Copy Code
            </button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Present this code at any Phuc Long store</p>
            <p>or use it online when ordering</p>
          </div>
        </div>
      </motion.div>
    )}
  </motion.div>
)}
