# CarKnox - AI-Powered Used Car Analysis Platform

## Project Overview

CarKnox is a Next.js web application that helps users evaluate used car listings in the Indian market. It uses AI (via Groq API with Llama-3.3-70B model) to analyze car listings, determine fair pricing, predict service costs, identify required spare parts, and provide buy/avoid recommendations with negotiation tips.

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14.2.35 (App Router) |
| Language | TypeScript |
| UI Library | React 18 |
| Styling | Tailwind CSS 3.4.1 |
| Animation | Framer Motion 12.38.0 |
| Forms | React Hook Form 7.74.0 |
| Validation | Zod 4.3.6 |
| PDF Generation | jsPDF 4.2.1, jspdf-autotable 5.0.7 |
| HTML Parsing | Cheerio 1.2.0 |
| Utilities | clsx, tailwind-merge |

## Project Structure

```
carknox.ai/
├── app/
│   ├── layout.tsx                 # Root layout with Navbar/Footer
│   ├── page.tsx                   # Main homepage with form & results
│   └── api/
│       ├── extract/route.ts     # URL auto-fill API endpoint
│       └── analyze/route.ts     # Car analysis API endpoint
├── components/
│   ├── AnalysisForm.tsx         # Multi-step input form (3 steps)
│   ├── ResultsPanel.tsx          # Analysis results display
│   ├── Hero.tsx                 # Landing hero section
│   ├── Navbar.tsx               # Navigation bar
│   ├── Footer.tsx               # Footer component
│   ├── ImageUploader.tsx        # Image upload component
│   ├── VerdictBadge.tsx         # Price verdict badge
│   ├── PriceBreakdown.tsx      # Price comparison card
│   ├── ServiceCostCard.tsx     # Service costs breakdown
│   ├── PartsTable.tsx          # Spare parts table
│   ├── ProsConsGrid.tsx        # Pros & cons display
│   ├── FinalRecommendation.tsx   # Buy/avoid verdict + tips
│   └── SkeletonLoader.tsx      # Loading animation
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── utils.ts                # Utility functions (cn, formatINR)
│   ├── mockData.ts              # Demo analysis result
│   └── pdf-generator.ts         # PDF report generation
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── .env.local                  # Environment variables
```

## Core Features

### 1. URL Auto-Fill (Smart Data Extraction)

**Endpoint:** `POST /api/extract`

**Functionality:**
- Fetches HTML from any used car listing URL (OLX, Cars24, Spinny, etc.)
- Extracts car data using multiple strategies:
  - `__NEXT_DATA__` for Next.js sites
  - JSON-LD structured data
  - Meta tags (og:title, og:description)
  - Page body text mining
  - URL slug parsing for make/model/year hints
- Sends extracted data to Groq AI for intelligent parsing
- Returns normalized car details

**Supported Data Points:**
- Asking price (converts from lakh/commas)
- Car make & model
- Year of manufacture
- Mileage (km driven)
- Fuel type (Petrol/Diesel/CNG/Electric/Hybrid)
- Transmission (Manual/Automatic)
- Owner count (1st/2nd/3rd/4th+)
- Service history availability
- Location (city in India)

### 2. AI Car Analysis

**Endpoint:** `POST /api/analyze`

**Functionality:**
- Takes complete car details from form
- Sends to Groq AI (Llama-3.3-70B-versatile) for evaluation
- Returns comprehensive analysis with:

#### Price Analysis
- **Price Verdict:** GOOD_DEAL | FAIR | OVERPRICED
- **Estimated Fair Price:** Market value based on make/model/year/mileage
- **Price Confidence:** LOW | MEDIUM | HIGH
- **Verdict Reason:** Explanation text

#### Service Cost Prediction
- **First Year Service Cost:** Estimated total
- **Breakdown:** Array of items with:
  - Service item name
  - Cost (INR)
  - Priority (URGENT | SOON | ROUTINE)

#### Spare Parts Prediction
- **Spare Parts:** Array with:
  - Part name
  - Reason for replacement
  - Estimated cost
  - Urgency (IMMEDIATE | WITHIN_6_MONTHS | WITHIN_1_YEAR)
  - Essential flag (boolean)

#### Pros & Cons
- **Pros:** Array of positive points
- **Cons:** Array of negative points

#### Final Recommendation
- **Verdict:** BUY | AVOID | NEGOTIATE
- **Reason:** Detailed explanation
- **Negotiation Tip:** Specific strategy including:
  - Counter-offer amount
  - Justification breakdown
  - Walk-away price
  - Market-specific tactics

### 3. Multi-Step Analysis Form

**Step 1: Listing Details**
- Listing URL (with auto-fill button)
- Asking Price
- Car Make
- Car Model
- Year of Manufacture
- Mileage
- Fuel Type
- Transmission
- Location

**Step 2: Condition**
- Condition Description (free text)
- Owner Count (1st/2nd/3rd/4th+)
- Service History (toggle)

**Step 3: Photos**
- Image uploader (optional, stores URLs)

### 4. Results Display

**Components:**
- Verdict badge with color coding
- Price breakdown (asking vs fair vs total cost)
- Service cost card with itemized breakdown
- Parts table with urgency indicators
- Pros/Cons grid
- Final recommendation with negotiation tips

### 5. PDF Report Generation

**Functionality:**
- Generates downloadable PDF report
- Dark theme styling
- Includes all analysis data
- Professional layout
- Automatic file naming

## UI/UX Features

### Visual Design
- Dark theme with blue accents
- Futuristic aesthetic
- Responsive design (mobile-first)
- Dot grid background pattern

### Animations
- Hero section parallax
- Staggered text reveals
- Smooth form transitions
- Spring-loaded results panel
- Bouncing scroll indicator

### Interactions
- Auto-fill button with loading state
- Form validation with error messages
- Multi-step form with progress indicator
- Re-analyze button
- PDF download with loading state

## API Integration

### Groq API Configuration

**Required Environment Variable:**
```
GROQ_API_KEY=your_groq_api_key
```

**Model Used:** `llama-3.3-70b-versatile`

**Endpoints:**
- Extract: `https://api.groq.com/openai/v1/chat/completions`
- Analyze: `https://api.groq.com/openai/v1/chat/completions`

## Type Definitions

### AnalysisFormData
```typescript
interface AnalysisFormData {
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
```

### AnalysisResult
```typescript
interface AnalysisResult {
  priceVerdict: 'FAIR' | 'OVERPRICED' | 'GOOD_DEAL';
  priceVerdictReason: string;
  estimatedFairPrice: number;
  priceConfidence: 'LOW' | 'MEDIUM' | 'HIGH';
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
```

## Running the Project

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Environment Variables

Create `.env.local` in root:
```env
GROQ_API_KEY=your_actual_groq_api_key
```

## Supported Car Listing Sites

The auto-fill feature works with sites that:
- Have accessible HTML (not heavily rate-limited)
- Embed car data in structured formats
- Examples: OLX India, Cars24, Spinny, Cardekho, Gaadi

Note: Some sites may block automated access. Users can manually fill the form if auto-fill fails.

## Disclaimer

This analysis is AI-generated. Always get a physical inspection by a certified mechanic before making any purchase decision.

---

## Changelog — 11 June 2026

### 1. Navbar: Restored Dealerships & Owner Portal Buttons

**File:** `components/Navbar.tsx`

**Problem:** The two navigation buttons on the top right of the homepage navbar were missing.

**Fix:** Added two pill-style anchor links to the right side of the navbar:
- **Dealerships** (`href="/dealerships"`) — links to the dealership directory
- **Owner Portal** (`href="/dealerships/dashboard"`) — links to the dealership owner dashboard

**Styling:**
- Dark pill buttons (`bg-[#1a1a2e]`, `rounded-full`)
- White text (`text-white text-sm font-medium`)
- Hover state (`hover:bg-[#252545]`)

**No other page content was modified.**

---

### 2. Top Dealerships Banner: Auto-Scroll Marquee

**File:** `components/TopDealershipsBanner.tsx`  
**Associated:** `app/globals.css` (removed unused keyframes)

**Problem:** The premium partner cards rendered statically with no scrolling animation.

**Root cause:** The animation was originally designed to use CSS `@keyframes dealership-scroll` with `translateX(-50%)`, but multiple approaches failed:
- JSX `<style>` tags are stripped by Next.js App Router
- CSS `@keyframes` in `globals.css` was unreliable due to processing order
- Standalone `animate()` from framer-motion had type compatibility issues

**Fix:** Rewired the animation using framer-motion's `motion.div` + `useAnimationControls` — the standard framer-motion pattern already used throughout the codebase.

**Implementation:**
```tsx
const controls = useAnimationControls();

useEffect(() => {
  controls.start({ x: '-50%', transition: scrollTransition });
}, [controls]);
```

**Scroll behavior:**
- **Continuous left scroll:** `repeat: Infinity, repeatType: 'loop'` over 28 seconds
- **Pause on hover:** `controls.stop()` freezes the track at its current position
- **Resume on leave:** `controls.start({ x: '-50%', ... })` restarts the scroll from the current position
- **Seamless loop:** The dealer data array is doubled (`[...dealers, ...dealers]`) so the instant reset snap is invisible
- **Width:** `width: 'max-content'` on the flex track ensures all cards are in-flow

**Cleanup:**
- Removed unused `@keyframes dealership-scroll` from `app/globals.css`
- Removed all CSS-based animation approaches (inline styles, useEffect-injected keyframes)
- No conflicting animation classes on the element