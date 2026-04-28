"use client";

import { SparePartItem } from "@/lib/types";
import { formatINR, getUrgencyColor } from "@/lib/utils";

interface PartsTableProps {
  spareParts: SparePartItem[];
}

export default function PartsTable({ spareParts = [] }: PartsTableProps) {
  // Safe default for parts
  const safeParts = spareParts ?? [];

  // Sort by urgency: IMMEDIATE -> WITHIN_6_MONTHS -> WITHIN_1_YEAR
  const urgencyWeight = { IMMEDIATE: 0, WITHIN_6_MONTHS: 1, WITHIN_1_YEAR: 2, MONITOR: 3, SOON: 1 };
  
  const sortedParts = [...safeParts].sort((a, b) => {
    const weightA = urgencyWeight[a?.urgency as keyof typeof urgencyWeight] ?? 99;
    const weightB = urgencyWeight[b?.urgency as keyof typeof urgencyWeight] ?? 99;
    return weightA - weightB;
  });

  const essentialSubtotal = sortedParts
    .filter(p => p?.isEssential)
    .reduce((sum, p) => sum + (p?.estimatedCost ?? 0), 0);

  return (
    <div className="bg-[#131d35] border border-[#0f1629] rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-[#0f1629]">
        <h3 className="text-xl font-bold text-white">Identified Parts Needed</h3>
      </div>
      
      {/* Mobile view */}
      <div className="block md:hidden p-4 space-y-4">
        {sortedParts.length === 0 ? (
          <p className="text-slate-500 text-center py-4">No major parts replacement identified.</p>
        ) : (
          sortedParts.map((part, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border ${(part?.urgency ?? "ROUTINE") === 'IMMEDIATE' ? 'bg-rose-400/5 border-rose-400/20' : 'bg-[#0f1629] border-[#1e2d4f]'} ${part?.isEssential ? 'border-l-4 border-l-blue-400' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-white">{(part?.partName ?? "Unknown")}</h4>
                <span className="font-bold text-slate-200">{formatINR((part?.estimatedCost ?? 0))}</span>
              </div>
              <p className="text-sm text-slate-400 mb-3">{(part?.reason ?? "")}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${getUrgencyColor((part?.urgency ?? "ROUTINE"))}`}>
                  {(part?.urgency ?? "ROUTINE").replace(/_/g, ' ')}
                </span>
                {part?.isEssential && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
                    Essential
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#0f1629]/50 text-sm text-slate-400">
            <tr>
              <th className="py-4 px-6 font-medium">Part Name</th>
              <th className="py-4 px-6 font-medium">Why Needed</th>
              <th className="py-4 px-6 font-medium text-right">Cost</th>
              <th className="py-4 px-6 font-medium">Urgency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0f1629] text-sm">
            {sortedParts.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 px-6 text-slate-500 text-center italic">
                  No parts replacement identified by AI analysis.
                </td>
              </tr>
            ) : (
              sortedParts.map((part, idx) => (
                <tr 
                  key={idx} 
                  className={`${(part?.urgency ?? "ROUTINE") === 'IMMEDIATE' ? 'bg-rose-400/5' : ''} ${part?.isEssential ? 'border-l-4 border-l-blue-400' : ''}`}
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">{(part?.partName ?? "Unknown")}</div>
                    {part?.isEssential && <span className="text-[10px] uppercase text-blue-400 tracking-wider font-bold">ESSENTIAL</span>}
                  </td>
                  <td className="py-4 px-6 text-slate-400">{(part?.reason ?? "")}</td>
                  <td className="py-4 px-6 font-medium text-slate-200 text-right">{formatINR((part?.estimatedCost ?? 0))}</td>
                  <td className="py-4 px-6">
                    <span className={`font-semibold ${getUrgencyColor((part?.urgency ?? "ROUTINE"))}`}>
                      {(part?.urgency ?? "ROUTINE").replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-6 bg-[#0f1629]/30 border-t border-[#0f1629] flex justify-between items-center">
        <div>
          <span className="text-white font-medium">Essential Parts Subtotal</span>
          <p className="text-xs text-slate-500">Critical for safe operation</p>
        </div>
        <span className="text-xl font-bold text-blue-400">{formatINR(essentialSubtotal)}</span>
      </div>
    </div>
  );
}
