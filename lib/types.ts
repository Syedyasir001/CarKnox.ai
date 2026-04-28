export interface AnalysisFormData {
  listingUrl: string;
  askingPrice: number;
  carMake: string;
  carModel: string;
  yearOfManufacture: number;
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  conditionDescription: string;
  ownerCount: '1st' | '2nd' | '3rd' | '4th+';
  hasServiceHistory: boolean;
  location: string;
  images: string[];
}

export interface ServiceCostItem {
  item: string;
  cost: number;
  priority: 'URGENT' | 'SOON' | 'ROUTINE';
}

export interface SparePartItem {
  partName: string;
  reason: string;
  estimatedCost: number;
  urgency: 'IMMEDIATE' | 'WITHIN_6_MONTHS' | 'WITHIN_1_YEAR';
  isEssential: boolean;
}

export interface ExtractResult {
  askingPrice: number;
  carMake: string;
  carModel: string;
  yearOfManufacture: number;
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  conditionDescription: string;
  ownerCount: '1st' | '2nd' | '3rd' | '4th+';
  hasServiceHistory: boolean;
  location: string;
  listingImages: string[];
}

export interface AnalysisResult {
  priceVerdict: 'FAIR' | 'OVERPRICED' | 'GOOD_DEAL';
  priceVerdictReason: string;
  estimatedFairPrice: number;
  priceConfidence: 'LOW' | 'MEDIUM' | 'HIGH';
  priceConfidenceReason?: string;
  firstYearServiceCost: {
    estimated: number;
    breakdown: ServiceCostItem[];
  };
  spareParts: SparePartItem[];
  totalEstimatedCost: number;
  pros: string[];
  cons: string[];
  finalRecommendation: 'BUY' | 'AVOID' | 'NEGOTIATE';
  recommendationReason: string;
  negotiationTip: string | null;
}
