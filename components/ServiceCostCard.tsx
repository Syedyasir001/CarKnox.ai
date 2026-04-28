"use client";

import { motion } from "framer-motion";
import { formatINR } from "@/lib/utils";
import { ServiceCostItem } from "@/lib/types";

interface ServiceCostCardProps {
  firstYearServiceCost: {
    estimated: number;
    breakdown: ServiceCostItem[];
  };
}

export default function ServiceCostCard({ firstYearServiceCost }: ServiceCostCardProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  const getPriorityColors = (priority: string) => {
    switch(priority) {
      case 'URGENT': return 'bg-rose-400/10 text-rose-400 border-rose-400/20';
      case 'SOON': return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
      default: return 'bg-[#0f1629] text-slate-400 border-[#1e2d4f]';
    }
  };

  const safeBreakdown = firstYearServiceCost?.breakdown ?? [];

  return (
    <div className="bg-[#131d35] border border-[#0f1629] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#0f1629]">
        <h3 className="text-xl font-bold text-white">Service Breakdown</h3>
        <span className="text-2xl font-bold text-blue-400">
          {formatINR((firstYearServiceCost?.estimated ?? 0))}
        </span>
      </div>

      <motion.div 
        variants={container} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true }}
        className="space-y-4"
      >
        {safeBreakdown.length === 0 ? (
          <p className="text-slate-500 italic text-sm">No specific service items identified.</p>
        ) : (
          safeBreakdown.map((item, idx) => (
            <motion.div key={idx} variants={itemAnim} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#0f1629]/50 last:border-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-slate-200 font-medium">{item?.item ?? "Service Item"}</span>
                <span className="text-xs text-slate-500 md:hidden">{formatINR((item?.cost ?? 0))}</span>
              </div>
              <div className="flex items-center gap-4 justify-between sm:justify-end">
                <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${getPriorityColors(item?.priority ?? "ROUTINE")}`}>
                  {item?.priority ?? "ROUTINE"}
                </span>
                <span className="text-slate-300 font-medium hidden md:block">
                  {formatINR((item?.cost ?? 0))}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
