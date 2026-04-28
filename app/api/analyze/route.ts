import { NextRequest, NextResponse } from 'next/server';
import { AnalysisFormData } from '@/lib/types';

const SYSTEM_PROMPT = `You are an expert used car evaluator for the Indian market.
You MUST respond with ONLY a raw valid JSON object — no markdown code fences, no explanation, no preamble.
The JSON must exactly match this structure:
{
  "priceVerdict": "GOOD_DEAL" | "FAIR" | "OVERPRICED",
  "estimatedFairPrice": <number>,
  "totalEstimatedCost": <number>,
  "priceConfidence": "LOW" | "MEDIUM" | "HIGH",
  "priceConfidenceReason": "<string>",
  "priceVerdictReason": "<string>",
  "firstYearServiceCost": {
    "estimated": <number>,
    "breakdown": [
      { "item": "<string>", "cost": <number>, "priority": "URGENT" | "SOON" | "ROUTINE" }
    ]
  },
  "spareParts": [
    { "partName": "<string>", "estimatedCost": <number>, "urgency": "IMMEDIATE" | "WITHIN_6_MONTHS" | "WITHIN_1_YEAR", "reason": "<string>", "isEssential": true | false }
  ],
  "pros": ["<string>"],
  "cons": ["<string>"],
  "finalRecommendation": "BUY" | "AVOID" | "NEGOTIATE",
  "recommendationReason": "<string>",
  "negotiationTip": "<string>" | null
}

CRITICAL CALCULATION RULES:
- firstYearServiceCost.estimated MUST equal the exact sum of all costs in the breakdown array.
- totalEstimatedCost MUST equal: askingPrice + firstYearServiceCost.estimated + sum of all spareParts estimatedCost. Never deviate from this formula.

For the firstYearServiceCost and spareParts fields, you MUST provide highly realistic costs for the Indian market specific to the car's make and model.
1) A luxury car (e.g., BMW, Mercedes, Audi) has significantly higher parts and service costs than a budget or mid-range car (e.g., Maruti, Hyundai, Tata). Adjust prices accordingly.
2) Base the required parts and service strictly on the mileage, year, and the condition description provided by the user.
3) If the condition description mentions specific issues (e.g., 'bald tyres', 'AC not cooling', 'engine noise'), you MUST include those exact parts in the spareParts list with accurate replacement costs.
4) If the mileage is near a major service interval (e.g., 60,000 km, 100,000 km), include major overhaul costs like timing belt/chain, transmission fluid, or suspension overhaul in the service breakdown.

For the negotiationTip field, you must provide a highly specific and accurate negotiation strategy based on the exact car details provided. The tip must include:
1) A precise counter-offer amount in INR calculated by subtracting the estimated immediate repair costs and parts from the asking price, then comparing against the estimatedFairPrice — use whichever is lower as the counter-offer.
2) A specific breakdown explaining exactly why that counter-offer is justified — mention the exact parts that need replacement and their costs by name.
3) A walk-away price — the maximum the buyer should ever pay, calculated as estimatedFairPrice plus 3 percent.
4) A negotiation tactic specific to the Indian used car market such as getting a pre-purchase inspection done first, pointing out specific defects found in the condition description, or referencing similar listings in the same city.
5) If the car is already a GOOD_DEAL, the negotiationTip should still suggest a small negotiation of 2 to 3 percent below asking price as is standard in Indian used car transactions.
The negotiationTip must never be generic. It must always reference the specific car make, model, asking price, and identified issues.

For the priceConfidenceReason field, provide exactly ONE sentence explaining WHY the confidence level is set as LOW, MEDIUM, or HIGH. Examples: "Limited resale data for this variant in Tier-2 cities." for LOW, "High transaction volume for this model ensures accurate pricing." for HIGH. Be specific about what data is available or missing.`;

export async function POST(req: NextRequest) {
  try {
    const body: AnalysisFormData = await req.json();
    console.log("Received body:", JSON.stringify(body, null, 2));

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey === 'your_api_key_here') {
      console.error("GROQ_API_KEY is not set.");
      return NextResponse.json({ error: "API key not configured. Please set GROQ_API_KEY in .env.local and restart the dev server." }, { status: 500 });
    }

    const textSummary = `Please evaluate the following used car listing for the Indian market:

Listing URL: ${body.listingUrl || 'Not provided'}
Asking Price: ₹${body.askingPrice}
Make: ${body.carMake}
Model: ${body.carModel}
Year of Manufacture: ${body.yearOfManufacture}
Mileage: ${body.mileage} km
Fuel Type: ${body.fuelType}
Transmission: ${body.transmission}
Condition Description: ${body.conditionDescription}
Number of Previous Owners: ${body.ownerCount}
Service History Available: ${body.hasServiceHistory ? 'Yes' : 'No'}
Location: ${body.location || 'Not provided'}

Pay special attention to the condition description the user provided — any issues mentioned like engine noise, scratches, AC problems, tyre wear, or known defects must directly influence the negotiationTip and be used as specific leverage points in the negotiation strategy.

Respond with ONLY the JSON object, no markdown, no explanation.`;

    console.log("Sending to Groq...");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 4000,
        temperature: 0.3,
        stream: false,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: textSummary }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error:", errorText);
      return NextResponse.json({ error: "Groq API error", details: errorText }, { status: 500 });
    }

    const data = await response.json();
    const rawText = data.choices[0].message.content;
    console.log("Raw Groq response:", rawText);

    // Strip any markdown fences the model may have added despite instructions
    const jsonStr = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    let result;
    try {
      result = JSON.parse(jsonStr);
    } catch {
      console.error("JSON Parse Error. Raw text was:", rawText);
      return NextResponse.json(
        { error: "AI returned unparseable JSON", rawResponse: rawText },
        { status: 500 }
      );
    }

    // Validate required top-level fields
    const required = ['priceVerdict', 'finalRecommendation', 'spareParts', 'firstYearServiceCost'];
    const missing = required.filter(k => !(k in result));
    if (missing.length > 0) {
      console.error("Missing required fields:", missing, "Full result:", result);
      return NextResponse.json(
        { error: "AI response missing required fields", missing, rawResponse: rawText },
        { status: 500 }
      );
    }

    // --- Normalize & enforce correct calculations ---

    // 1. Handle AI returning "items" instead of "breakdown"
    if (result.firstYearServiceCost) {
      if (!result.firstYearServiceCost.breakdown && result.firstYearServiceCost.items) {
        result.firstYearServiceCost.breakdown = result.firstYearServiceCost.items;
        delete result.firstYearServiceCost.items;
      }
      result.firstYearServiceCost.breakdown = (result.firstYearServiceCost.breakdown ?? []).map((item: Record<string, unknown>) => ({
        ...item,
        // Normalize "urgency" → "priority" if AI used wrong field name
        priority: item.priority ?? item.urgency ?? 'ROUTINE',
      }));

      // 2. Enforce firstYearServiceCost.estimated = sum of breakdown costs
      const breakdownSum = (result.firstYearServiceCost.breakdown as Array<{ cost: number }>)
        .reduce((acc: number, item: { cost: number }) => acc + (item.cost ?? 0), 0);
      result.firstYearServiceCost.estimated = breakdownSum;
    }

    // 3. Enforce totalEstimatedCost = askingPrice + serviceCost + spareParts total
    const serviceCostTotal = result.firstYearServiceCost?.estimated ?? 0;
    const sparesTotal = (result.spareParts ?? []).reduce(
      (acc: number, p: { estimatedCost: number }) => acc + (p.estimatedCost ?? 0),0
    );
    result.totalEstimatedCost = body.askingPrice + serviceCostTotal + sparesTotal;

    console.log("Returning valid result:", JSON.stringify(result, null, 2));
    return NextResponse.json(result);

  } catch (error) {
    console.error("Unhandled Analysis Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
