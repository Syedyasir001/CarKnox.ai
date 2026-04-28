"use client";

import { formatINR } from "@/lib/utils";

interface PriceBreakdownProps {
  askingPrice: number;
  estimatedFairPrice: number;
  totalEstimatedCost: number;
  priceConfidence: 'LOW' | 'MEDIUM' | 'HIGH';
  priceConfidenceReason?: string;
  priceVerdictReason: string;
  serviceCosts?: number;
  partsCosts?: number;
}

export default function PriceBreakdown({
  askingPrice = 0,
  estimatedFairPrice = 0,
  totalEstimatedCost = 0,
  priceConfidence = "MEDIUM",
  priceConfidenceReason,
  priceVerdictReason = "",
  serviceCosts = 0,
  partsCosts = 0,
}: PriceBreakdownProps) {
  // If serviceCosts and partsCosts aren't passed, calculate a rough split of the difference
  const difference = totalEstimatedCost - askingPrice;
  const actualServiceCosts = serviceCosts || difference * 0.6;
  const actualPartsCosts = partsCosts || difference * 0.4;

  const askingPercent = (askingPrice / (totalEstimatedCost || 1)) * 100;
  const servicePercent = (actualServiceCosts / (totalEstimatedCost || 1)) * 100;
  const partsPercent = (actualPartsCosts / (totalEstimatedCost || 1)) * 100;

  const getConfidenceStyles = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'LOW':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const defaultReasons: Record<string, string> = {
    LOW: 'Limited market data available for this configuration.',
    MEDIUM: 'Moderate data available; estimate may vary.',
    HIGH: 'Strong market data — estimate is reliable.',
  };

  const confidenceReason = priceConfidenceReason || defaultReasons[priceConfidence] || '';

  return (
    <div className="bg-[#131d35] border border-[#0f1629] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Price Breakdown</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getConfidenceStyles(priceConfidence)}`}>
          {priceConfidence} Confidence
        </div>
      </div>

      <p className="text-sm text-slate-400 mb-6">{confidenceReason}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-[#0f1629] rounded-xl border border-[#1e2d4f]">
          <p className="text-sm text-slate-400 mb-1">Asking Price</p>
          <p className="text-2xl font-bold text-slate-100">{formatINR(askingPrice)}</p>
        </div>
        <div className="p-4 bg-[#0f1629] rounded-xl border border-[#1e2d4f]">
          <p className="text-sm text-slate-400 mb-1">CarKnox Fair Value</p>
          <p className="text-2xl font-bold text-blue-400">{formatINR(estimatedFairPrice)}</p>
        </div>
        <div className="p-4 bg-[#0f1629] rounded-xl border border-[#1e2d4f]">
          <p className="text-sm text-slate-400 mb-1">Year 1 Total Cost</p>
          <p className="text-2xl font-bold text-rose-400">{formatINR(totalEstimatedCost)}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-4 w-full flex rounded-full overflow-hidden">
          <div style={{ width: `${askingPercent}%` }} className="bg-slate-600" />
          <div style={{ width: `${servicePercent}%` }} className="bg-blue-500" />
          <div style={{ width: `${partsPercent}%` }} className="bg-rose-400" />
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-600" />
            <span className="text-slate-400">Asking Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-400">Service Costs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400" />
            <span className="text-slate-400">Parts Costs</span>
          </div>
        </div>
      </div>

      <p className="text-slate-400 italic mt-6">{priceVerdictReason}</p>
    </div>
  );
}
