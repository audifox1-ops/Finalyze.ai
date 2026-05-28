import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Initialize Gemini Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json"
  }
});

// API Route for Financial Analysis
app.post("/api/analyze", async (req, res) => {
  try {
    const { textContent } = req.body;

    if (!textContent || textContent.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Empty or invalid document text provided." });
    }

    const prompt = `
      You are an expert professional financial analyst & investment advisor.
      Analyze the provided financial statement raw text or tabular metrics, perform robust parsing, extract critical figures, and return a perfectly structured financial evaluation.

      If specific values are missing or are represented as high-level indicators, use your deep financial knowledge to perform professional interpolation and estimate surrounding periods so the trends remain fully complete and mathematically sound.

      Return a single JSON object strictly matching the following schema. Keep numerical values as numbers:

      {
        "company": {
          "name": "Extract company name, or use 'Valued Enterprise' as fallback",
          "fiscalYear": "Latest reported fiscal year e.g. 'FY2024' or 'FY2025'",
          "industry": "Identified industry sector e.g. Technology, Manufacturing, Healthcare, Retail"
        },
        "incomeStatement": {
          "revenue": 1250000,
          "operatingProfit": 210000,
          "netIncome": 160000,
          "ebitda": 265000,
          "operatingMargin": 16.8,
          "netMargin": 12.8
        },
        "balanceSheet": {
          "totalAssets": 5200000,
          "totalLiabilities": 2200000,
          "equity": 3000000,
          "debtToEquityRatio": 73.3,
          "equityRatio": 57.7
        },
        "cashFlow": {
          "operating": 285000,
          "investing": -95000,
          "financing": -110000,
          "fcf": 190000
        },
        "keyMetrics": {
          "roe": 12.5,
          "roa": 8.1,
          "per": 18.5,
          "pbr": 2.1,
          "eps": 4.5
        },
        "yearOverYear": [
          {
            "year": "2021",
            "revenue": 950000,
            "operatingProfit": 140000,
            "netIncome": 105000,
            "ebitda": 180000,
            "totalAssets": 4500000,
            "totalLiabilities": 2000000,
            "equity": 2500000,
            "operatingCashFlow": 210000,
            "fcf": 130000
          },
          {
            "year": "2022",
            "revenue": 1050000,
            "operatingProfit": 165000,
            "netIncome": 120000,
            "ebitda": 210000,
            "totalAssets": 4800000,
            "totalLiabilities": 2100000,
            "equity": 2700000,
            "operatingCashFlow": 240000,
            "fcf": 160000
          },
          {
            "year": "2023",
            "revenue": 1180000,
            "operatingProfit": 192000,
            "netIncome": 145000,
            "ebitda": 245000,
            "totalAssets": 5000000,
            "totalLiabilities": 2150000,
            "equity": 2850000,
            "operatingCashFlow": 270000,
            "fcf": 180000
          },
          {
            "year": "2024",
            "revenue": 1320000,
            "operatingProfit": 225000,
            "netIncome": 175000,
            "ebitda": 285000,
            "totalAssets": 5300000,
            "totalLiabilities": 2250000,
            "equity": 3050000,
            "operatingCashFlow": 310000,
            "fcf": 210000
          }
        ],
        "summary": "Provide a comprehensive high-fidelity professional strategic overview of the company's fiscal fitness, sales scalability, capital efficiency, and debt tolerance.",
        "strengths": [
          "1st Core investment strength (e.g., Rising operating margins, strong FCF conversion)",
          "2nd Core investment strength (e.g., Minimal external debt leverage, high liquidity)",
          "3rd Core investment strength"
        ],
        "weaknesses": [
          "1st Fundamental risk indicator (e.g., Asset utilization challenges, inventory build-up)",
          "2nd Fundamental risk indicator (e.g., Moderate cash flow from investments squeeze)",
          "3rd Fundamental risk indicator"
        ],
        "investmentOpinion": "Aggressive, Neutral, or Conservative - choose one and provide a clear recommendation"
      }

      Provide ONLY the JSON response object. Do not wrap in markdown or backticks.

      Input financial content for analysis:
      ${textContent}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    const parsedData = JSON.parse(text);
    
    // Server-side validation of parsed data to prevent client render crashes
    if (!parsedData.company || !parsedData.incomeStatement || !parsedData.balanceSheet || !parsedData.cashFlow || !parsedData.keyMetrics || !parsedData.yearOverYear) {
      throw new Error("Extracted JSON does not match the full required financial schema layout.");
    }

    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Advanced AI Parsing Error:", error);
    res.status(500).json({ success: false, error: `Analysis Error: ${error.message}` });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer();
