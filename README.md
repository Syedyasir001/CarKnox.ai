# CarKnox - AI-Powered Used Car Analysis Platform

CarKnox is a Next.js web application that helps users evaluate used car listings in the Indian market. It uses AI (via Groq API) to analyze car listings, determine fair pricing, predict service costs, identify required spare parts, and provide buy/avoid recommendations with negotiation tips.

## Quick Start

### Option 1: Try Demo Mode (No API Key Required)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/carknox.ai.git
   cd carknox.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the application**
   Open [http://localhost:3000](http://localhost:3000)

**That's it!** The app runs in **Demo Mode** with simulated analysis results. You can explore all features immediately.

---

### Option 2: Enable Real AI Analysis (Requires API Key)

1. **Get a free Groq API key** at [console.groq.com](https://console.groq.com/)

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Restart the development server**
   ```bash
   npm run dev
   ```

Now the app will use real AI analysis via Groq's Llama-3.3-70B model.

## Features

- **URL Auto-Fill**: Paste any used car listing URL (OLX, Cars24, Spinny) for automatic data extraction
- **AI-Powered Analysis**: Evaluates price fairness, predicts service costs, identifies spare parts needed
- **Smart Recommendations**: Get buy/avoid verdicts with negotiation tips
- **PDF Reports**: Download detailed analysis reports
- **Modern UI**: Dark theme with responsive design

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | Your Groq API key for AI analysis |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **AI Model**: Llama-3.3-70B via Groq API
- **Forms**: React Hook Form + Zod validation
- **PDF Generation**: jsPDF

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Groq API Docs](https://console.groq.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add `GROQ_API_KEY` in environment variables
4. Deploy!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This analysis is AI-generated. Always get a physical inspection by a certified mechanic before making any purchase decision.
