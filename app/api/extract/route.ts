import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { extractCache, hashUrl } from '@/lib/cache';
import { SUPPORTED_SITES } from '@/lib/constants';

type ErrorCode = 'FETCH_BLOCKED' | 'FETCH_TIMEOUT' | 'PARSE_FAILED' | 'UNSUPPORTED_SITE' | 'UNKNOWN';

interface ExtractError {
  success: false;
  errorCode: ErrorCode;
  userMessage: string;
}

// Generate supported sites message from the shared constant
const SUPPORTED_SITES_LIST = Array.from(
  new Set(
    SUPPORTED_SITES.map(site => 
      site
        .replace(/^www\./, '')
        .replace(/\.(com|in|co\.in|app)$/, '')
        .split('.')[0]
        .split('/')[0]
    )
  )
).sort().join(', ');

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  FETCH_BLOCKED: 'This site blocks automated access. Please fill in the car details manually.',
  FETCH_TIMEOUT: 'The listing page took too long to load. Try again or fill in details manually.',
  PARSE_FAILED: 'Could not extract car details from this URL. Paste the listing price and details below.',
  UNSUPPORTED_SITE: `Auto-fill works with: ${SUPPORTED_SITES_LIST}. Try one of those links.`,
  UNKNOWN: 'Auto-fill failed. Please enter the car details manually.',
};

// SUPPORTED_SITES is now imported from @/lib/constants

function classifyError(
  status: number | null,
  isAborted: boolean,
  hasSignals: boolean,
  url: string
): ExtractError {
  if (isAborted) {
    return { success: false, errorCode: 'FETCH_TIMEOUT', userMessage: ERROR_MESSAGES.FETCH_TIMEOUT };
  }

  if (status === 403 || status === 429) {
    return { success: false, errorCode: 'FETCH_BLOCKED', userMessage: ERROR_MESSAGES.FETCH_BLOCKED };
  }

  if (!hasSignals) {
    const urlLC = url.toLowerCase();
    const isSupportedSite = SUPPORTED_SITES.some(site => urlLC.includes(site));
    if (!isSupportedSite) {
      return { success: false, errorCode: 'UNSUPPORTED_SITE', userMessage: ERROR_MESSAGES.UNSUPPORTED_SITE };
    }
    return { success: false, errorCode: 'PARSE_FAILED', userMessage: ERROR_MESSAGES.PARSE_FAILED };
  }

  return { success: false, errorCode: 'UNKNOWN', userMessage: ERROR_MESSAGES.UNKNOWN };
}

const SYSTEM_PROMPT = `You are an expert data extraction AI for Indian used car listings.
You will receive multiple data signals extracted from a car listing page. Your job is to intelligently combine them and return the most accurate car details.

Return ONLY a raw valid JSON object, no markdown, no explanation, matching EXACTLY this structure:
{
  "askingPrice": <number>,          // Price in INR. Strip ₹, commas, "lakh" (multiply by 100000 if in lakh). Default: 0
  "carMake": "<string>",            // Brand e.g. "Hyundai", "Maruti Suzuki", "Tata". Default: ""
  "carModel": "<string>",           // Model name e.g. "i20", "Swift", "Nexon". Default: ""
  "yearOfManufacture": <number>,    // 4-digit year e.g. 2019. Default: 0
  "mileage": <number>,              // KM driven as raw integer. Strip commas. Default: 0
  "fuelType": "Petrol" | "Diesel" | "CNG" | "Electric" | "Hybrid",  // Default: "Petrol"
  "transmission": "Manual" | "Automatic",   // Default: "Manual"
  "conditionDescription": "<string>",       // Summarize condition, defects, highlights. Max 150 words.
  "ownerCount": "1st" | "2nd" | "3rd" | "4th+",  // Default: "1st"
  "hasServiceHistory": <boolean>,           // true if service records mentioned
  "location": "<string>"                    // City in India e.g. "Mumbai". Default: ""
}

IMPORTANT RULES:
- If price is mentioned as "X lakh" or "X.XX lakh", convert to integer: 5.5 lakh = 550000
- Be smart about partial data: if the URL says "/maruti-swift-2019/", infer make=Maruti Suzuki, model=Swift, year=2019
- Owner "1 owner", "first owner", "1st owner" all mean "1st"
- Fuel from context: "VTVT" = Petrol, "CRDi" = Diesel, "iTurbo" = Petrol Turbo
- If you find __NEXT_DATA__ JSON, it contains the most accurate data — prioritize it
- For transmission: "AMT", "CVT", "DCT", "AT" all = "Automatic"; "MT" = "Manual"`;

// Extract clues from URL slug (many Indian sites embed make/model/year/city in the URL)
function extractFromUrl(url: string): Record<string, string> {
  const hints: Record<string, string> = {};
  try {
    const parsedUrl = new URL(url);
    const fullPath = (parsedUrl.pathname + ' ' + parsedUrl.hostname).toLowerCase();

    // Detect year (4-digit number between 2000-2026)
    const yearMatch = fullPath.match(/\b(200[0-9]|201[0-9]|202[0-6])\b/);
    if (yearMatch) hints.yearHint = yearMatch[1];

    // Common Indian car makes
    const makes: Record<string, string> = {
      'maruti': 'Maruti Suzuki', 'suzuki': 'Maruti Suzuki',
      'hyundai': 'Hyundai', 'tata': 'Tata', 'honda': 'Honda',
      'toyota': 'Toyota', 'mahindra': 'Mahindra', 'kia': 'Kia',
      'mg': 'MG', 'renault': 'Renault', 'volkswagen': 'Volkswagen',
      'skoda': 'Skoda', 'ford': 'Ford', 'nissan': 'Nissan',
      'bmw': 'BMW', 'mercedes': 'Mercedes-Benz', 'audi': 'Audi',
      'jeep': 'Jeep', 'volvo': 'Volvo', 'lexus': 'Lexus',
      'isuzu': 'Isuzu', 'force': 'Force', 'datsun': 'Datsun',
    };
    for (const [key, value] of Object.entries(makes)) {
      if (fullPath.includes(key)) { hints.makeHint = value; break; }
    }

    // Common Indian car models
    const models: Record<string, string> = {
      'swift': 'Swift', 'dzire': 'Dzire', 'baleno': 'Baleno', 'brezza': 'Brezza',
      'wagonr': 'WagonR', 'wagon-r': 'WagonR', 'ertiga': 'Ertiga',
      'fronx': 'Fronx', 'alto': 'Alto', 'celerio': 'Celerio', 'ignis': 'Ignis',
      's-cross': 'S-Cross', 'vitara': 'Vitara Brezza',
      'creta': 'Creta', 'venue': 'Venue', 'i20': 'i20', 'i10': 'i10',
      'verna': 'Verna', 'exter': 'Exter', 'alcazar': 'Alcazar', 'tucson': 'Tucson',
      'nexon': 'Nexon', 'harrier': 'Harrier', 'safari': 'Safari', 'punch': 'Punch',
      'altroz': 'Altroz', 'tiago': 'Tiago', 'tigor': 'Tigor', 'curvv': 'Curvv',
      'city': 'City', 'amaze': 'Amaze', 'jazz': 'Jazz', 'wrv': 'WR-V',
      'innova': 'Innova', 'fortuner': 'Fortuner', 'hyryder': 'Hyryder', 'glanza': 'Glanza',
      'sonet': 'Sonet', 'seltos': 'Seltos', 'carens': 'Carens',
      'xuv700': 'XUV700', 'xuv400': 'XUV400', 'xuv300': 'XUV300', 'scorpio': 'Scorpio',
      'thar': 'Thar', 'bolero': 'Bolero',
      'kwid': 'Kwid', 'duster': 'Duster', 'kiger': 'Kiger', 'triber': 'Triber',
      'polo': 'Polo', 'vento': 'Vento', 'taigun': 'Taigun', 'virtus': 'Virtus',
      'rapid': 'Rapid', 'kushaq': 'Kushaq', 'slavia': 'Slavia',
      'ecosport': 'EcoSport', 'endeavour': 'Endeavour',
      'magnite': 'Magnite', 'kicks': 'Kicks',
    };
    for (const [key, value] of Object.entries(models)) {
      if (fullPath.includes(key)) { hints.modelHint = value; break; }
    }

    // Detect city from URL
    const cities = ['mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai',
      'kolkata', 'pune', 'ahmedabad', 'jaipur', 'surat', 'lucknow', 'kanpur',
      'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam', 'pimpri',
      'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik',
      'faridabad', 'meerut', 'rajkot', 'kalyan', 'coimbatore', 'kochi'];
    for (const city of cities) {
      if (fullPath.includes(city)) {
        hints.locationHint = city.charAt(0).toUpperCase() + city.slice(1);
        break;
      }
    }
  } catch { }
  return hints;
}

// Extract JSON-LD structured data (schema.org/Car or schema.org/Product)
function extractJsonLd($: ReturnType<typeof cheerio.load>): string {
  const results: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const content = $(el).html() || '';
    if (content.trim()) {
      results.push(content.trim().slice(0, 3000));
    }
  });
  return results.join('\n');
}

// Extract __NEXT_DATA__ (Next.js sites like OLX, Cars24, Spinny)
function extractNextData($: ReturnType<typeof cheerio.load>): string {
  const el = $('#__NEXT_DATA__');
  if (el.length) {
    const content = el.html() || '';
    if (content.length > 50) {
      console.log('[Extract] Found __NEXT_DATA__ with', content.length, 'chars');
      return content.slice(0, 8000);
    }
  }
  return '';
}

// Extract meta tags (og:title, og:description, name=description, etc.)
function extractMeta($: ReturnType<typeof cheerio.load>): Record<string, string> {
  const meta: Record<string, string> = {};
  meta.title = $('title').first().text().trim();
  meta.ogTitle = $('meta[property="og:title"]').attr('content') || '';
  meta.ogDescription = $('meta[property="og:description"]').attr('content') || '';
  meta.description = $('meta[name="description"]').attr('content') || '';
  meta.keywords = $('meta[name="keywords"]').attr('content') || '';
  return meta;
}

// Deep-search a JSON string for car-relevant keys (price, make, model, km, etc.)
function mineJsonForCarData(jsonStr: string): string {
  const relevantKeys = [
    'price', 'askingPrice', 'amount', 'cost', 'make', 'brand', 'manufacturer',
    'model', 'year', 'mileage', 'km', 'kilometer', 'fuel', 'fuelType', 'transmission',
    'gearbox', 'owner', 'registrationYear', 'regYear', 'city', 'location', 'condition',
    'description', 'variant', 'color', 'colour', 'registration', 'title', 'name'
  ];

  try {
    const parsed = JSON.parse(jsonStr);
    const lines: string[] = [];

    const search = (obj: unknown, depth = 0) => {
      if (depth > 8 || !obj || typeof obj !== 'object') return;
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        if (relevantKeys.some(rk => k.toLowerCase().includes(rk.toLowerCase()))) {
          if (v !== null && v !== undefined && String(v).length < 200) {
            lines.push(`${k}: ${v}`);
          }
        }
        if (typeof v === 'object' && v !== null) search(v, depth + 1);
      }
    };
    search(parsed);
    return lines.slice(0, 100).join('\n');
  } catch {
    return '';
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ success: false, errorCode: 'UNKNOWN', userMessage: 'URL is required' }, { status: 400 });
    }

    const cacheKey = hashUrl(url);
    const cached = extractCache.get(cacheKey);
    if (cached) {
      console.log('[Extract] Cache hit for:', url);
      return NextResponse.json(cached, { status: 200, headers: { 'X-Cache': 'HIT' } });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json({ 
        success: false, 
        errorCode: 'UNKNOWN', 
        userMessage: 'Demo Mode: URL auto-fill requires a Groq API key. Please fill in the car details manually, or set GROQ_API_KEY in .env.local for AI-powered auto-fill.' 
      }, { status: 400 });
    }

    // === STEP 1: Extract hints from the URL itself ===
    const urlHints = extractFromUrl(url);
    console.log('[Extract] URL hints:', urlHints);

    // === STEP 2: Fetch the page HTML ===
    let html = '';
    let isAborted = false;
    let responseStatus: number | null = null;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const siteResponse = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-IN,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Referer': 'https://www.google.com/',
        }
      });
      clearTimeout(timeout);

      responseStatus = siteResponse.status;
      if (siteResponse.ok) {
        html = await siteResponse.text();
        console.log(`[Extract] Fetched ${html.length} bytes of HTML`);
      }
    } catch (err) {
      isAborted = err instanceof DOMException && err.name === 'AbortError';
      console.warn('[Extract] Fetch failed:', err instanceof Error ? err.message : 'unknown');
    }

    // === STEP 3: Mine data from HTML ===
    const signals: Record<string, string> = {};
    let listingImages: string[] = [];

    if (html.length > 500) {
      const $ = cheerio.load(html);

      // Priority 1: __NEXT_DATA__ (Next.js SPAs - OLX, Cars24, Spinny)
      const nextData = extractNextData($);
      if (nextData) {
        const mined = mineJsonForCarData(nextData);
        signals.nextData = mined || nextData.slice(0, 4000);
      }

      // Priority 2: JSON-LD structured data
      const jsonLd = extractJsonLd($);
      if (jsonLd) signals.jsonLd = jsonLd;

      // Priority 3: Meta tags
      const meta = extractMeta($);
      if (meta.title || meta.ogTitle) {
        signals.metaTags = JSON.stringify(meta);
      }

      // Priority 3b: Extract listing images
      const rawImages: string[] = [];

      const ogImage = $('meta[property="og:image"]').attr('content');
      if (ogImage && ogImage.startsWith('http')) rawImages.push(ogImage);

      const twitterImage = $('meta[name="twitter:image"]').attr('content');
      if (twitterImage && twitterImage.startsWith('http')) rawImages.push(twitterImage);

      $('img').each((_, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
        if (
          src &&
          src.startsWith('http') &&
          (src.includes('photo') || src.includes('image') ||
            src.includes('media') || src.includes('car') || src.includes('vehicle'))
        ) {
          rawImages.push(src);
        }
      });

      listingImages = Array.from(new Set(rawImages))
        .filter(url => !url.match(/icon|logo|sprite|placeholder/i))
        .slice(0, 8);

      // Priority 4: Page body text
      $('script, style, noscript, svg, img, video, iframe, header, footer, nav, aside').remove();
      const selectors = ['main', '[class*="listing"]', '[class*="detail"]', '[id*="listing"]', 'article', '.content', 'body'];
      for (const sel of selectors) {
        const el = $(sel);
        if (el.length) {
          const text = el.text().replace(/\s+/g, ' ').trim();
          if (text.length > 300) {
            signals.pageText = text.slice(0, 4000);
            break;
          }
        }
      }
    }

    // === STEP 4: Check if we have enough to work with ===
    const hasAnySignals = Object.keys(signals).length > 0 || Object.keys(urlHints).length > 0;

    if (!hasAnySignals) {
      const error = classifyError(responseStatus, isAborted, hasAnySignals, url);
      return NextResponse.json(error, { status: 400 });
    }

    // === STEP 5: Build the Groq prompt from all signals ===
    let userContent = `Listing URL: ${url}\n\n`;

    if (Object.keys(urlHints).length > 0) {
      userContent += `=== URL HINTS ===\n${JSON.stringify(urlHints, null, 2)}\n\n`;
    }
    if (signals.nextData) {
      userContent += `=== NEXT.JS PAGE DATA (HIGHEST PRIORITY) ===\n${signals.nextData}\n\n`;
    }
    if (signals.jsonLd) {
      userContent += `=== JSON-LD STRUCTURED DATA ===\n${signals.jsonLd}\n\n`;
    }
    if (signals.metaTags) {
      userContent += `=== META TAGS ===\n${signals.metaTags}\n\n`;
    }
    if (signals.pageText) {
      userContent += `=== PAGE TEXT ===\n${signals.pageText}\n\n`;
    }

    userContent += `\nExtract all car details from the above data and return the JSON.`;

    console.log(`[Extract] Sending ${userContent.length} chars to Groq`);

    // === STEP 6: Call Groq ===
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        temperature: 0,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('[Extract] Groq error:', errorText);
      return NextResponse.json({ success: false, errorCode: 'UNKNOWN', userMessage: ERROR_MESSAGES.UNKNOWN }, { status: 500 });
    }

    const groqData = await groqResponse.json();
    const rawText = groqData.choices[0].message.content;

    const jsonStr = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    console.log('[Extract] AI JSON response:', jsonStr);

    let extracted: Record<string, unknown>;
    try {
      extracted = JSON.parse(jsonStr);
    } catch {
      console.error('[Extract] JSON parse failed. Raw:', rawText);
      return NextResponse.json({ success: false, errorCode: 'PARSE_FAILED', userMessage: ERROR_MESSAGES.PARSE_FAILED }, { status: 500 });
    }

    // === STEP 7: Normalize & coerce types ===
    extracted.askingPrice = Number(extracted.askingPrice) || 0;
    extracted.mileage = Number(extracted.mileage) || 0;
    extracted.yearOfManufacture = Number(extracted.yearOfManufacture) || 0;
    extracted.hasServiceHistory = Boolean(extracted.hasServiceHistory);

    // Apply URL hints as fallback if AI missed them
    if (!extracted.carMake && urlHints.makeHint) extracted.carMake = urlHints.makeHint;
    if (!extracted.carModel && urlHints.modelHint) extracted.carModel = urlHints.modelHint;
    if (!extracted.yearOfManufacture && urlHints.yearHint) extracted.yearOfManufacture = Number(urlHints.yearHint);
    if (!extracted.location && urlHints.locationHint) extracted.location = urlHints.locationHint;

    // Normalize fuelType
    const ft = String(extracted.fuelType || '').toLowerCase();
    if (ft.includes('diesel') || ft.includes('crdi')) extracted.fuelType = 'Diesel';
    else if (ft.includes('cng')) extracted.fuelType = 'CNG';
    else if (ft.includes('electric') || ft.includes('ev')) extracted.fuelType = 'Electric';
    else if (ft.includes('hybrid')) extracted.fuelType = 'Hybrid';
    else extracted.fuelType = 'Petrol';

    // Normalize transmission
    const tr = String(extracted.transmission || '').toLowerCase();
    if (tr.includes('auto') || tr.includes('amt') || tr.includes('cvt') || tr.includes('dct') || tr === 'at') {
      extracted.transmission = 'Automatic';
    } else {
      extracted.transmission = 'Manual';
    }

    // Normalize ownerCount
    const oc = String(extracted.ownerCount || '1').toLowerCase();
    if (oc.includes('4') || oc.includes('four') || oc.includes('fifth') || oc.includes('5')) {
      extracted.ownerCount = '4th+';
    } else if (oc.includes('3') || oc.includes('third')) {
      extracted.ownerCount = '3rd';
    } else if (oc.includes('2') || oc.includes('second')) {
      extracted.ownerCount = '2nd';
    } else {
      extracted.ownerCount = '1st';
    }

    // Final validation
    const hasMeaningfulData = extracted.carMake || extracted.carModel || (extracted.askingPrice as number) > 0;
    if (!hasMeaningfulData) {
      return NextResponse.json(classifyError(null, false, false, url), { status: 400 });
    }

    // Add listing images to response
    extracted.listingImages = listingImages;

    console.log('[Extract] Success:', extracted);
    extractCache.set(cacheKey, extracted);
    return NextResponse.json(extracted);

  } catch (error: unknown) {
    console.error('[Extract] Unhandled error:', error);
    return NextResponse.json({ success: false, errorCode: 'UNKNOWN', userMessage: ERROR_MESSAGES.UNKNOWN }, { status: 500 });
  }
}
