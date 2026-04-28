"use client";

import { motion } from "framer-motion";

export default function SkeletonLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto py-12 px-4"
    >
      {/* Top Loading Indicator */}
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-[#0f1629]" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent animate-spin" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bebas tracking-wide text-white mb-2">
          CarKnox is analyzing your vehicle...
        </h2>
        <p className="text-slate-400">This takes about 10–15 seconds</p>
      </div>

      {/* Skeletons Container */}
      <div className="space-y-6">
        {/* Short - Verdict Area */}
        <div className="w-full h-32 bg-[#131d35] border border-[#0f1629] rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 shimmer" />
        </div>

        {/* Medium - Price Breakdown */}
        <div className="w-full h-64 bg-[#131d35] border border-[#0f1629] rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 shimmer" />
        </div>

        {/* Tall - Parts Table */}
        <div className="w-full h-96 bg-[#131d35] border border-[#0f1629] rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 shimmer" />
        </div>

        {/* Medium - Recommendation */}
        <div className="w-full h-56 bg-[#131d35] border border-[#0f1629] rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 shimmer" />
        </div>
      </div>
    </motion.div>
  );
}
