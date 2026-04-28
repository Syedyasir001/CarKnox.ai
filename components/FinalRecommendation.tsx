"use client";

import { motion } from "framer-motion";

interface FinalRecommendationProps {
  finalRecommendation: 'BUY' | 'AVOID' | 'NEGOTIATE';
  recommendationReason: string;
  negotiationTip: string | null;
}

export default function FinalRecommendation({
  finalRecommendation,
  recommendationReason,
  negotiationTip,
}: FinalRecommendationProps) {
  let colors = {
    bg: "bg-[#0f1629]",
    border: "border-[#1e2d4f]",
    text: "text-white"
  };

  if (finalRecommendation === 'BUY') {
    colors = { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" };
  } else if (finalRecommendation === 'AVOID') {
    colors = { bg: "bg-rose-400/10", border: "border-rose-400/30", text: "text-rose-400" };
  } else if (finalRecommendation === 'NEGOTIATE') {
    colors = { bg: "bg-blue-400/10", border: "border-blue-400/30", text: "text-blue-400" };
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`p-6 rounded-2xl border-2 ${colors.bg} ${colors.border}`}
    >
      <h2 className={`font-bebas text-3xl md:text-4xl tracking-wide mb-3 ${colors.text}`}>
        CARKNOX RECOMMENDS: {finalRecommendation}
      </h2>
      <p className="text-slate-200 text-lg mb-6 leading-relaxed">
        {recommendationReason}
      </p>
      
      {negotiationTip && (
        <div className="bg-blue-400/10 border border-blue-400/20 rounded-xl p-4 flex gap-3">
          <span className="text-blue-400 text-xl leading-none mt-0.5">💡</span>
          <div>
            <h4 className="text-blue-400 font-bold mb-1">Negotiation Tip</h4>
            <p className="text-blue-400/80 text-sm">{negotiationTip}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
