"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AnalysisFormData } from "@/lib/types";
import { SUPPORTED_SITES_DISPLAY } from "@/lib/constants";

interface AnalysisFormProps {
  onSubmit?: (data: AnalysisFormData) => void;
  onListingImages?: (images: string[]) => void;
}

export default function AnalysisForm({ onSubmit, onListingImages }: AnalysisFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<AnalysisFormData>>({
    ownerCount: "1st",
    hasServiceHistory: false,
    fuelType: "Petrol",
    transmission: "Manual",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [showSupportedSites, setShowSupportedSites] = useState(false);
  const [extractedDetails, setExtractedDetails] = useState<Record<string, unknown> | null>(null);

  const inputClass =
    "w-full bg-[#0f1629] border border-[#1e2d4f] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400 transition-colors px-4 py-3 min-h-[44px]";

  const updateField = (field: keyof AnalysisFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAutoFill = async () => {
    if (!formData.listingUrl) {
      setErrors(prev => ({ ...prev, listingUrl: "Please enter a URL first to auto-fill" }));
      return;
    }

    setIsExtracting(true);
    setErrors({});
    setExtractError(null);
    setExtractedDetails(null);
    
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.listingUrl }),
      });

      const data = await res.json();
      
      if (!res.ok || data.success === false) {
        setExtractError(data.userMessage || "Failed to extract data");
        return;
      }

      // Store extracted details for display
      setExtractedDetails({
        askingPrice: data.askingPrice,
        carMake: data.carMake,
        carModel: data.carModel,
        yearOfManufacture: data.yearOfManufacture,
        mileage: data.mileage,
        fuelType: data.fuelType,
        transmission: data.transmission,
        ownerCount: data.ownerCount,
        location: data.location,
        hasServiceHistory: data.hasServiceHistory,
      });

      setFormData(prev => ({
        ...prev,
        ...data,
        // Ensure numbers are numbers
        askingPrice: data.askingPrice ? Number(data.askingPrice) : prev.askingPrice,
        mileage: data.mileage ? Number(data.mileage) : prev.mileage,
        yearOfManufacture: data.yearOfManufacture ? Number(data.yearOfManufacture) : prev.yearOfManufacture,
        // Ensure some fields have safe defaults if not extracted properly
        conditionDescription: data.conditionDescription || prev.conditionDescription || "Looks good based on the listing."
      }));

      const images = data.listingImages || [];
      if (onListingImages) onListingImages(images);

    } finally {
      setIsExtracting(false);
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.listingUrl) newErrors.listingUrl = "Listing URL is required. Enter the OLX or Cars24 listing URL.";
    if (!formData.askingPrice) newErrors.askingPrice = "Asking price is required. Enter the listed price in INR.";
    if (!formData.carMake) newErrors.carMake = "Car make is required. Enter the manufacturer (e.g., Maruti, Hyundai).";
    if (!formData.carModel) newErrors.carModel = "Car model is required. Enter the model name.";
    if (!formData.yearOfManufacture)
      newErrors.yearOfManufacture = "Year of manufacture is required. Enter the registration year.";
    if (!formData.mileage) newErrors.mileage = "Mileage is required. Enter the kilometers driven.";
    if (!formData.location) newErrors.location = "Location is required. Enter the city where the car is listed.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.conditionDescription)
      newErrors.conditionDescription = "Condition description is required. Describe the car's current condition.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;

    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }
    if (onSubmit) {
      onSubmit(formData as AnalysisFormData);
    }
  };

  const steps = ["Listing Details", "Condition"];

  return (
    <div className="py-10 px-4">
      <div className="w-full mx-auto bg-[#131d35] border border-[#0f1629] rounded-2xl p-6 md:p-8 shadow-2xl">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-10 relative px-2">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#0f1629] -z-10" />
          <motion.div
            className="absolute top-4 left-0 h-0.5 bg-blue-400 -z-10 origin-left"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    isActive
                      ? "border-blue-400 bg-[#131d35]"
                      : isCompleted
                      ? "border-blue-400 bg-blue-400"
                      : "border-[#1e2d4f] bg-[#131d35]"
                  }`}
                >
                  {isActive && <div className="w-3 h-3 rounded-full bg-blue-400" />}
                  {isCompleted && <span className="text-[#131d35] text-xs font-bold">✓</span>}
                </div>
                <span
                  className={`text-xs md:text-sm mt-3 font-medium transition-colors duration-300 ${
                    isActive || isCompleted ? "text-blue-400" : "text-slate-500"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Listing Details */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="md:col-span-2">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-slate-400">
                  Listing URL
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSupportedSites(!showSupportedSites)}
                    className="text-xs font-medium text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    {showSupportedSites ? 'Hide' : 'Show'} supported sites
                  </button>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    disabled={isExtracting || !formData.listingUrl}
                    className="text-xs font-medium bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExtracting ? (
                      <>
                        <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>✨ Auto-Fill</>
                    )}
                  </button>
                </div>
              </div>
              <input
                type="text"
                className={inputClass}
                placeholder="https://www.olx.in/..."
                value={formData.listingUrl || ""}
                onChange={(e) => updateField("listingUrl", e.target.value)}
              />
              {errors.listingUrl && (
                <p className="text-rose-400 text-xs mt-1.5 font-medium">{errors.listingUrl}</p>
              )}

              {/* Supported Sites Dropdown */}
              {showSupportedSites && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-4 bg-[#0f1629] border border-[#1e2d4f] rounded-xl overflow-hidden"
                >
                  <p className="text-xs font-medium text-slate-400 mb-2">Supported platforms:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUPPORTED_SITES_DISPLAY.map((site) => (
                      <span
                        key={site}
                        className="text-xs px-2 py-1 bg-blue-400/10 text-blue-400 rounded-md"
                      >
                        {site}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Extracted Details Display */}
              {extractedDetails && !extractError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-emerald-400">✓ Details Extracted</p>
                    <button
                      type="button"
                      onClick={() => setExtractedDetails(null)}
                      className="text-emerald-400 hover:text-emerald-300 text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {Object.entries(extractedDetails).map(([key, value]) => {
                      if (!value || key === 'listingImages') return null;
                      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      return (
                        <div key={key} className="bg-[#131d35] rounded-lg px-3 py-2">
                          <span className="text-slate-500 block mb-0.5">{label}</span>
                          <span className="text-white font-medium">
                            {key === 'askingPrice' && value ? `₹${Number(value).toLocaleString()}` : 
                             key === 'mileage' && value ? `${Number(value).toLocaleString()} km` :
                             String(value)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {extractError && (
                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start justify-between gap-2">
                  <p className="text-amber-400 text-sm">{extractError}</p>
                  <button
                    type="button"
                    onClick={() => setExtractError(null)}
                    className="text-amber-400 hover:text-amber-300 text-lg leading-none shrink-0"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Asking Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-500 font-medium">
                  ₹
                </span>
                <input
                  type="number"
                  className={`${inputClass} pl-8`}
                  placeholder="500000"
                  value={formData.askingPrice || ""}
                  onChange={(e) =>
                    updateField(
                      "askingPrice",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>
              {errors.askingPrice && (
                <p className="text-rose-400 text-xs mt-1.5 font-medium">{errors.askingPrice}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Car Make
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. Maruti"
                value={formData.carMake || ""}
                onChange={(e) => updateField("carMake", e.target.value)}
              />
              {errors.carMake && (
                <p className="text-rose-400 text-xs mt-1.5 font-medium">{errors.carMake}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Car Model
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. Swift"
                value={formData.carModel || ""}
                onChange={(e) => updateField("carModel", e.target.value)}
              />
              {errors.carModel && (
                <p className="text-rose-400 text-xs mt-1.5 font-medium">{errors.carModel}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Year of Manufacture
              </label>
              <input
                type="number"
                className={inputClass}
                placeholder="2018"
                value={formData.yearOfManufacture || ""}
                onChange={(e) =>
                  updateField(
                    "yearOfManufacture",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
              {errors.yearOfManufacture && (
                <p className="text-rose-400 text-xs mt-1.5 font-medium">
                  {errors.yearOfManufacture}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Mileage
              </label>
              <div className="relative">
                <input
                  type="number"
                  className={`${inputClass} pr-12`}
                  placeholder="62000"
                  value={formData.mileage || ""}
                  onChange={(e) =>
                    updateField(
                      "mileage",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
                <span className="absolute right-4 top-3 text-slate-500 font-medium">
                  km
                </span>
              </div>
              {errors.mileage && (
                <p className="text-rose-400 text-xs mt-1.5 font-medium">{errors.mileage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Fuel Type
              </label>
              <select
                className={inputClass}
                value={formData.fuelType || "Petrol"}
                onChange={(e) => updateField("fuelType", e.target.value)}
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Transmission
              </label>
              <select
                className={inputClass}
                value={formData.transmission || "Manual"}
                onChange={(e) => updateField("transmission", e.target.value)}
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Location
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. Bengaluru"
                value={formData.location || ""}
                onChange={(e) => updateField("location", e.target.value)}
              />
              {errors.location && (
                <p className="text-rose-400 text-xs mt-1.5 font-medium">{errors.location}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Condition */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Condition Description
              </label>
              <textarea
                className={`${inputClass} h-32 resize-none`}
                placeholder="Describe any scratches, dents, strange engine sounds, AC performance, tyre condition, and known issues..."
                value={formData.conditionDescription || ""}
                onChange={(e) => updateField("conditionDescription", e.target.value)}
              />
              {errors.conditionDescription && (
                <p className="text-rose-400 text-xs mt-1.5 font-medium">
                  {errors.conditionDescription}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-3">
                Owner Count
              </label>
              <div className="flex gap-3">
                {["1st", "2nd", "3rd", "4th+"].map((owner) => (
                  <button
                    key={owner}
                    type="button"
                    onClick={() => updateField("ownerCount", owner)}
                    className={`flex-1 py-3 rounded-xl border transition-colors font-medium ${
                      formData.ownerCount === owner
                        ? "bg-blue-400/10 border-blue-400 text-blue-400"
                        : "bg-[#0f1629] border-[#1e2d4f] text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {owner}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0f1629] border border-[#1e2d4f]">
                <div>
                  <p className="text-white font-medium">Service history available</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Authorized dealer service records
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateField("hasServiceHistory", !formData.hasServiceHistory)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.hasServiceHistory ? "bg-blue-400" : "bg-slate-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.hasServiceHistory ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#0f1629]">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2.5 rounded-xl text-slate-400 font-medium hover:text-white hover:bg-[#0f1629] transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-white text-[#0a0f1e] font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-lg shadow-blue-400/20"
            >
              Next <span className="text-lg leading-none">→</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-white text-[#0a0f1e] font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-lg shadow-blue-400/20"
            >
              Submit Analysis
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
