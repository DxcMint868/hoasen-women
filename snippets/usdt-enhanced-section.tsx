// Enhanced USDT success state with transaction details and MetaMask guidance
// Replace the section after "claimStatus === 'success'" in the USDT form

{/* Loading animation */}
{isLoading && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-4 bg-purple-50 border border-purple-200 rounded-lg"
  >
    <div className="flex flex-col items-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 rounded-full border-4 border-[#9470DC]/30 border-t-[#9470DC]"
      />
      <p className="text-sm font-medium text-[#9470DC]">
        Processing your transaction on the blockchain...
      </p>
      <p className="text-xs text-muted-foreground text-center">
        This may take a few moments. Please don't close this page.
      </p>
    </div>
  </motion.div>
)}

{claimStatus === "success" && (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="space-y-4"
  >
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
      <div className="flex gap-2">
        <svg
          className="w-5 h-5 text-green-600 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-semibold text-green-900">
            Success! 10 USDT sent to your wallet
          </p>
          <p className="text-xs text-green-700 mt-1">
            Your transaction has been confirmed on the blockchain.
          </p>
        </div>
      </div>
    </div>

    {/* Transaction link */}
    {txHash && (
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs font-medium text-blue-900 mb-2">
          View your transaction:
        </p>
        <a
          href={`${process.env.NODE_ENV === "production" ? "https://basescan.org" : "https://sepolia.basescan.org"}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
        >
          {txHash}
        </a>
      </div>
    )}

    {/* Instructions for checking balance */}
    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-3">
      <h4 className="text-sm font-semibold text-purple-900">
        How to check your USDT balance:
      </h4>
      <ol className="space-y-2 text-xs text-purple-800">
        <li className="flex items-start gap-2">
          <span className="font-bold">1.</span>
          <span>Open your MetaMask wallet</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="font-bold">2.</span>
          <span>Click the network dropdown at the top and select <strong>"Base"</strong> {process.env.NODE_ENV !== "production" && "(or Base Sepolia for testing)"}</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="font-bold">3.</span>
          <span>Scroll down to see your USDT token balance (it may take a minute to appear)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="font-bold">4.</span>
          <span>If you don't see USDT, tap "Import tokens" and search for USDT on Base network</span>
        </li>
      </ol>
    </div>
  </motion.div>
)}
