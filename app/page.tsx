"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import AnalysisForm from "@/components/AnalysisForm";
import SkeletonLoader from "@/components/SkeletonLoader";
import ResultsPanel from "@/components/ResultsPanel";
import { AnalysisResult, AnalysisFormData } from "@/lib/types";

export default function Home() {
  const [step, setStep] = useState<"form" | "loading" | "results">("form");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AnalysisFormData | null>(null);
  const [listingImages, setListingImages] = useState<string[]>([]);

  const handleAnalyze = async (data: AnalysisFormData) => {
    setStep("loading");
    setError(null);
    setFormData(data);

    console.log("[CarKnox] Submitting formData:", data);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      console.log("[CarKnox] Raw API response:", json);

      if (!res.ok) {
        const msg = json?.error || "Failed to analyze vehicle. Please try again.";
        const detail = json?.rawResponse ? `\n\nRaw AI output: ${json.rawResponse.slice(0, 300)}` : "";
        throw new Error(msg + detail);
      }

      setResult(json);
      setStep("results");
    } catch (err: unknown) {
      console.error("[CarKnox] Error:", err);
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      setStep("form");
    }
  };

  const handleReanalyze = () => {
    setStep("form");
    setResult(null);
    setError(null);
    setListingImages([]);
  };

  return (
    <>
      <Hero />

      {(step === "form" || step === "loading") && (
        <section id="analyze-form" className="py-12">
          <div className="max-w-3xl mx-auto px-4">
            {error && (
              <div className="p-4 bg-rose-400/10 border border-rose-400/30 rounded-xl flex items-center gap-3 mb-6">
                <span className="text-rose-400 font-bold">⚠</span>
                <p className="text-rose-400 text-sm">{error}</p>
              </div>
            )}

            <AnalysisForm onSubmit={handleAnalyze} onListingImages={setListingImages} />

            {step === "loading" && (
              <div className="mt-12">
                <SkeletonLoader />
              </div>
            )}
          </div>
        </section>
      )}

      {step === "results" && result && formData && (
        <section id="analyze-form" className="py-12">
          <ResultsPanel
            result={result}
            formData={formData}
            listingImages={listingImages}
            onReanalyze={handleReanalyze}
          />
        </section>
      )}
    </>
  );
}