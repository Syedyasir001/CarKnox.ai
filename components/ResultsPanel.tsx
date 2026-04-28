"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AnalysisResult, AnalysisFormData } from "@/lib/types";
import { generateReportPDF } from "@/lib/pdf-generator";
import VerdictBadge from "./VerdictBadge";
import PriceBreakdown from "./PriceBreakdown";
import ServiceCostCard from "./ServiceCostCard";
import PartsTable from "./PartsTable";
import ProsConsGrid from "./ProsConsGrid";
import FinalRecommendation from "./FinalRecommendation";
interface ResultsPanelProps {
  result: AnalysisResult;
  formData: AnalysisFormData;
  listingImages?: string[];
  onReanalyze?: () => void;
}

export default function ResultsPanel({ result, formData, onReanalyze, listingImages: _listingImages = [] }: ResultsPanelProps) {
  console.log("[CarKnox] ResultsPanel received result:", result);
  const serviceCosts = result?.firstYearServiceCost?.estimated ?? 0;
  const partsCosts = result?.spareParts?.reduce((acc, part) => acc + (part?.estimatedCost ?? 0), 0) ?? 0;
  // Compute Year 1 Total Cost from actual data — never trust the AI's value directly
  const computedTotalCost = (formData.askingPrice ?? 0) + serviceCosts + partsCosts;

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      console.log("[CarKnox] Generating PDF with result:", result, "formData:", formData);
      await generateReportPDF(result, formData);
      console.log("[CarKnox] PDF generated successfully");
    } catch (err) {
      console.error("[CarKnox] PDF generation error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="w-full max-w-3xl mx-auto py-12 px-4 flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 pb-6 border-b border-[#0f1629]">
        <div>
          <h2 className="text-slate-400 text-sm uppercase tracking-widest mb-1">CarKnox Analysis</h2>
          <h1 className="text-3xl font-bold text-white">
            {formData.yearOfManufacture} {formData.carMake} {formData.carModel}
          </h1>
        </div>
        <button 
          onClick={onReanalyze}
          className="px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-400/10 hover:bg-blue-400/20 border border-blue-400/20 rounded-lg transition-colors self-start sm:self-auto"
        >
          Re-analyze
        </button>
        </div>

        {_listingImages.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest">
              Listing Photos
            </p>
            <div className="grid grid-cols-3 gap-2">
              {_listingImages.map((url: string, i: number) => (
                <img
                  key={i}
                  src={url}
                  alt={`Listing photo ${i + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-white/10"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              ))}
            </div>
          </div>
        )}

        <VerdictBadge priceVerdict={result?.priceVerdict ?? "FAIR"} />

      <PriceBreakdown 
        askingPrice={formData.askingPrice}
        estimatedFairPrice={result?.estimatedFairPrice ?? 0}
        totalEstimatedCost={computedTotalCost}
        priceConfidence={result?.priceConfidence ?? "MEDIUM"}
        priceConfidenceReason={result?.priceConfidenceReason}
        priceVerdictReason={result?.priceVerdictReason ?? ""}
        serviceCosts={serviceCosts}
        partsCosts={partsCosts}
      />

      <ServiceCostCard firstYearServiceCost={result?.firstYearServiceCost ?? { estimated: 0, breakdown: [] }} />

      <PartsTable spareParts={result?.spareParts ?? []} />

      <ProsConsGrid pros={result?.pros ?? []} cons={result?.cons ?? []} />

      <FinalRecommendation 
        finalRecommendation={result?.finalRecommendation ?? "NEGOTIATE"}
        recommendationReason={result?.recommendationReason ?? ""}
        negotiationTip={result?.negotiationTip ?? null}
      />

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-[#131d35] border border-[#0f1629] rounded-xl mt-4">
        <span className="text-slate-500 mt-0.5">⚠</span>
        <p className="text-xs text-slate-500 leading-relaxed">
          This analysis is AI-generated. Always get a physical inspection by a certified mechanic before making any purchase decision.
        </p>
      </div>

      {/* Download Button */}
      <div className="flex justify-center mt-6">
        {error && (
          <div className="w-full max-w-md mb-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm text-center">
            {error}
          </div>
        )}
        <button 
          type="button"
          onClick={handleDownload}
          disabled={isGenerating}
          aria-label={isGenerating ? "Generating PDF report, please wait" : "Download analysis report as PDF"}
          className="px-8 py-3 rounded-xl border-2 border-blue-400 text-blue-400 font-medium hover:bg-blue-400 hover:text-[#131d35] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed touch-target"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          {isGenerating ? "Generating..." : "Download Report"}
        </button>
      </div>

    </motion.div>
  );
}
