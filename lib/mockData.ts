import { AnalysisResult } from './types';

if (process.env.NODE_ENV === 'production') {
  throw new Error('[CarKnox] mockData.ts must not be imported in production.');
}

export function getMockAnalysis(): AnalysisResult {
  return {
    priceVerdict: 'OVERPRICED',
    priceVerdictReason: 'The asking price of ₹5,50,000 is significantly above the current market average for a 2018 Maruti Swift VXi petrol manual with 62,000 km driven by a 2nd owner. Typical valuation models place this specific variant and condition near ₹4,95,000.',
    estimatedFairPrice: 495000,
    priceConfidence: 'HIGH',
    priceConfidenceReason: 'Demo analysis — not real market data.',
    firstYearServiceCost: {
      estimated: 32000,
      breakdown: [
        { item: 'Engine Oil & Oil Filter', cost: 4500, priority: 'ROUTINE' },
        { item: 'Air Filter & Cabin Filter', cost: 1500, priority: 'ROUTINE' },
        { item: 'Brake Fluid Flush', cost: 1800, priority: 'SOON' },
        { item: 'Coolant Replacement', cost: 2200, priority: 'SOON' },
        { item: 'Throttle Body Cleaning', cost: 1500, priority: 'ROUTINE' },
        { item: 'Wheel Alignment & Balancing', cost: 1500, priority: 'ROUTINE' },
        { item: 'Comprehensive Paid Service Labor', cost: 4000, priority: 'ROUTINE' },
        { item: 'Suspension Overhaul (Front Struts)', cost: 15000, priority: 'URGENT' },
      ]
    },
    spareParts: [
      { partName: 'Clutch Assembly Kit', reason: 'Slipping clutch and stiff pedal', estimatedCost: 8500, urgency: 'WITHIN_6_MONTHS', isEssential: true },
      { partName: 'Front Tyres (Pair)', reason: 'Tread depth below 3mm', estimatedCost: 9500, urgency: 'WITHIN_6_MONTHS', isEssential: true },
      { partName: 'Brake Pads (Front)', reason: 'Worn out pads causing squeaking', estimatedCost: 2500, urgency: 'IMMEDIATE', isEssential: true },
      { partName: 'Wiper Blades (Pair)', reason: 'Rubber deteriorated', estimatedCost: 800, urgency: 'IMMEDIATE', isEssential: true },
      { partName: 'Fog Lamp Bezel', reason: 'Broken right fog lamp housing', estimatedCost: 1200, urgency: 'WITHIN_1_YEAR', isEssential: false },
      { partName: 'Floor Mats (Set)', reason: 'Worn and torn OEM mats', estimatedCost: 3400, urgency: 'WITHIN_1_YEAR', isEssential: false },
    ],
    totalEstimatedCost: 607900,
    pros: [
      'Highly reliable 1.2L K-Series engine known for longevity.',
      'Excellent fuel economy for city driving.',
      'Low maintenance costs and widespread availability of spare parts.',
      'Smooth manual transmission with light clutch action.',
      'Good resale value retention in the Indian market.'
    ],
    cons: [
      'Significantly overpriced compared to current market value for a 2nd owner vehicle.',
      'Build quality and safety ratings are lower compared to segment rivals.',
      'Suspension requires imminent attention based on average wear at 62k kms.',
      'Cabin insulation is average, leading to noticeable road noise at higher speeds.',
      'Upcoming major service and part replacements will add to the initial acquisition cost.'
    ],
    finalRecommendation: 'NEGOTIATE',
    recommendationReason: 'While the Maruti Swift is a reliable and practical choice, the asking price is too high considering the required repairs. With imminent service and spare part replacements, your true acquisition cost will exceed ₹6 lakhs.',
    negotiationTip: 'Point out the impending suspension and clutch work. Start your counter-offer around ₹4,60,000 and try to close the deal at ₹4,75,000 to account for the necessary repairs and maintenance.'
  };
}
