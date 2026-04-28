"use client";

import { motion } from "framer-motion";

interface VerdictBadgeProps {
  priceVerdict: 'FAIR' | 'OVERPRICED' | 'GOOD_DEAL';
}

export default function VerdictBadge({ priceVerdict }: VerdictBadgeProps) {
  let config = {
    text: "",
    colors: "",
  };

  if (priceVerdict === 'GOOD_DEAL') {
    config = { text: "✓ GREAT DEAL", colors: "text-cyan-400 border-cyan-400 bg-cyan-400/10" };
  } else if (priceVerdict === 'FAIR') {
    config = { text: "≈ FAIR PRICE", colors: "text-blue-400 border-blue-400 bg-blue-400/10" };
  } else if (priceVerdict === 'OVERPRICED') {
    config = { text: "↑ OVERPRICED", colors: "text-rose-400 border-rose-400 bg-rose-400/10" };
  }

  return (
    <div className="flex justify-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 20 }}
        whileInView={{ scale: 1, opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`px-8 py-3 rounded-full border-2 font-bebas text-3xl tracking-wide ${config.colors}`}
      >
        {config.text}
      </motion.div>
    </div>
  );
}
