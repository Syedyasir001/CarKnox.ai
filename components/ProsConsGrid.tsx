"use client";

import { motion } from "framer-motion";

interface ProsConsGridProps {
  pros: string[];
  cons: string[];
}

export default function ProsConsGrid({ pros, cons }: ProsConsGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-[#131d35] border border-[#0f1629] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-cyan-400/10 flex items-center justify-center">
            <span className="text-cyan-400 font-bold">✓</span>
          </div>
          <h3 className="text-lg font-bold text-white">What Works In Your Favour</h3>
        </div>
        
        <motion.ul 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {(pros ?? []).map((pro, idx) => (
            <motion.li key={idx} variants={itemAnim} className="flex items-start gap-3 text-slate-300">
              <span className="text-cyan-400 font-bold mt-0.5">✓</span>
              <span>{pro}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <div className="bg-[#131d35] border border-[#0f1629] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-rose-400/10 flex items-center justify-center">
            <span className="text-rose-400 font-bold">✗</span>
          </div>
          <h3 className="text-lg font-bold text-white">Watch Out For</h3>
        </div>
        
        <motion.ul 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {(cons ?? []).map((con, idx) => (
            <motion.li key={idx} variants={itemAnim} className="flex items-start gap-3 text-slate-300">
              <span className="text-rose-400 font-bold mt-0.5">✗</span>
              <span>{con}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}
