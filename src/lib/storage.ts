/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResult } from "../types";
import { demoCompanyData } from "../data/demoData";

// Define Local Storage schemas
export interface StorageFile {
  id: string;
  name: string;
  url?: string;
  uploadedAt: string;
}

export interface SavedAnalysis {
  id: string;
  analyzedAt: string;
  fiscalYear: string | number;
  parsedData: AnalysisResult;
  aiInsights: {
    strengths: string[];
    risks: string[];
    summary: string;
  };
}

export interface SavedCompany {
  id: string;
  name: string;
  ticker: string;
  industry: string;
  createdAt: string;
  files: StorageFile[];
  analyses: SavedAnalysis[];
}

export interface UserPreferences {
  defaultIndustry: string;
  favoriteCompanies: string[]; // ids of favorite companies
  theme: "light" | "dark";
}

export interface CompanyComparison {
  id: string;
  comparedAt: string;
  company1: {
    id: string;
    name: string;
    ticker: string;
    industry: string;
    roe: number;
    operatingMargin: number;
    debtToEquityRatio: number;
    netIncome: number;
  };
  company2: {
    id: string;
    name: string;
    ticker: string;
    industry: string;
    roe: number;
    operatingMargin: number;
    debtToEquityRatio: number;
    netIncome: number;
  };
  notes?: string;
}

export interface ForgingMasterStore {
  companies: SavedCompany[];
  userPreferences: UserPreferences;
  comparisons: CompanyComparison[];
}

const STORAGE_KEY = "forging_master_ai_store";

// Simulated UUID generation
function generateUUID(): string {
  return "idx-" + Math.random().toString(36).substring(2, 15) + "-" + Date.now().toString(36);
}

// Default Seed Data
const getSeedData = (): ForgingMasterStore => {
  const samsungId = "samsung-elec-id";
  const teslaId = "tesla-automotive-id";

  const samsungAnalysis: SavedAnalysis = {
    id: "sec-analysis-2025",
    analyzedAt: "2026-05-28",
    fiscalYear: "FY2025",
    parsedData: demoCompanyData,
    aiInsights: {
      strengths: demoCompanyData.strengths,
      risks: demoCompanyData.weaknesses,
      summary: demoCompanyData.summary
    }
  };

  // Build a simulated initial Tesla analysis
  const teslaData: AnalysisResult = {
    company: {
      name: "Tesla, Inc.",
      fiscalYear: "FY2024",
      industry: "Automotive & Clean Energy"
    },
    incomeStatement: {
      revenue: 96750000000,
      operatingProfit: 8890000000,
      netIncome: 14990000000,
      ebitda: 14200000000,
      operatingMargin: 9.2,
      netMargin: 15.5
    },
    balanceSheet: {
      totalAssets: 104000000000,
      totalLiabilities: 43000000000,
      equity: 61000000000,
      debtToEquityRatio: 70.4,
      equityRatio: 58.6
    },
    cashFlow: {
      operating: 13200000000,
      investing: -6500000000,
      financing: -2100000000,
      fcf: 6700000000
    },
    keyMetrics: {
      roe: 24.5,
      roa: 14.4,
      per: 45.2,
      pbr: 11.1,
      eps: 4.30
    },
    yearOverYear: [
      {
        year: "2021",
        revenue: 53820000000,
        operatingProfit: 6520000000,
        netIncome: 5640000000,
        ebitda: 9590000000,
        totalAssets: 62100000000,
        totalLiabilities: 30500000000,
        equity: 31600000000,
        operatingCashFlow: 11490000000,
        fcf: 5010000000
      },
      {
        year: "2022",
        revenue: 81460000000,
        operatingProfit: 13650000000,
        netIncome: 12580000000,
        ebitda: 17200000000,
        totalAssets: 82300000000,
        totalLiabilities: 36400000000,
        equity: 45900000000,
        operatingCashFlow: 14720000000,
        fcf: 7560000000
      },
      {
        year: "2023",
        revenue: 96750000000,
        operatingProfit: 8890000000,
        netIncome: 14990000000,
        ebitda: 14200000000,
        totalAssets: 104000000000,
        totalLiabilities: 43000000000,
        equity: 61000000000,
        operatingCashFlow: 13200000000,
        fcf: 6700000000
      }
    ],
    summary: "Tesla values remain robust against sector price volatility through dominant commercial energy storage growth, high market alignment in core AV, and net debt-free liquidity margins.",
    strengths: [
      "Zero net debt leverage structures enhancing high Solvency safety margins.",
      "Dominant commercial solar and stationary grid battery deployment.",
      "Consistently high ROIC yields beating standard high-volume vehicle peers."
    ],
    weaknesses: [
      "Operating margin contraction due to high-growth high-competition pricing strategies.",
      "High geographical reliance on legislative zero-carbon credits.",
      "Inherent cyclical dependencies on automotive supply chain components."
    ],
    investmentOpinion: "Neutral"
  };

  const teslaAnalysis: SavedAnalysis = {
    id: "tsla-analysis-2024",
    analyzedAt: "2026-05-20",
    fiscalYear: "FY2024",
    parsedData: teslaData,
    aiInsights: {
      strengths: teslaData.strengths,
      risks: teslaData.weaknesses,
      summary: teslaData.summary
    }
  };

  return {
    companies: [
      {
        id: samsungId,
        name: "Samsung Electronics",
        ticker: "005930",
        industry: "Semiconductor",
        createdAt: "2026-05-28",
        files: [
          { id: "f-1", name: "Samsung_Electronics_FY2025.pdf", uploadedAt: "2026-05-28" }
        ],
        analyses: [samsungAnalysis]
      },
      {
        id: teslaId,
        name: "Tesla, Inc.",
        ticker: "TSLA",
        industry: "Automotive",
        createdAt: "2026-05-20",
        files: [
          { id: "f-2", name: "Tesla_Filing_10K_2024.pdf", uploadedAt: "2026-05-20" }
        ],
        analyses: [teslaAnalysis]
      }
    ],
    userPreferences: {
      defaultIndustry: "Semiconductor",
      favoriteCompanies: [samsungId],
      theme: "light"
    },
    comparisons: [
      {
        id: "comp-sec-tsla-default",
        comparedAt: "2026-05-28",
        company1: {
          id: samsungId,
          name: "Samsung Electronics",
          ticker: "005930",
          industry: "Semiconductor",
          roe: demoCompanyData.keyMetrics.roe,
          operatingMargin: demoCompanyData.incomeStatement.operatingMargin,
          debtToEquityRatio: demoCompanyData.balanceSheet.debtToEquityRatio,
          netIncome: demoCompanyData.incomeStatement.netIncome
        },
        company2: {
          id: teslaId,
          name: "Tesla, Inc.",
          ticker: "TSLA",
          industry: "Automotive",
          roe: teslaData.keyMetrics.roe,
          operatingMargin: teslaData.incomeStatement.operatingMargin,
          debtToEquityRatio: teslaData.balanceSheet.debtToEquityRatio,
          netIncome: teslaData.incomeStatement.netIncome
        },
        notes: "Cross-sector asset allocation study comparing global consumer electronics lead vs electric vehicle capital expenditure performance."
      }
    ]
  };
};

export const getStorageStore = (): ForgingMasterStore => {
  if (typeof window === "undefined") return getSeedData();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = getSeedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse local storage cache, seeding reset", e);
    const seed = getSeedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
};

export const saveStorageStore = (store: ForgingMasterStore) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

// 1. Save or Update Analysis Result (Auto-save or Manual-save)
export const saveAnalysisResult = (
  companyName: string,
  ticker: string,
  industry: string,
  analysis: AnalysisResult,
  fileName?: string
): { companyId: string; analysisId: string } => {
  const store = getStorageStore();
  const nowStr = new Date().toISOString().split("T")[0];

  // Look for existing company with similar name or ticker
  let company = store.companies.find(
    (c) => 
      c.name.toLowerCase() === companyName.toLowerCase() || 
      c.ticker.toLowerCase() === ticker.toLowerCase()
  );

  let companyId = "";

  if (!company) {
    companyId = generateUUID();
    company = {
      id: companyId,
      name: companyName,
      ticker: ticker || "N/A",
      industry: industry || "General",
      createdAt: nowStr,
      files: [],
      analyses: []
    };
    store.companies.push(company);
  } else {
    companyId = company.id;
  }

  // Add metadata file if provided
  if (fileName) {
    const isFileSaved = company.files.some((f) => f.name === fileName);
    if (!isFileSaved) {
      company.files.push({
        id: generateUUID(),
        name: fileName,
        uploadedAt: nowStr
      });
    }
  }

  const analysisId = generateUUID();
  const savedAnalysis: SavedAnalysis = {
    id: analysisId,
    analyzedAt: nowStr,
    fiscalYear: analysis.company.fiscalYear || "FY2025",
    parsedData: analysis,
    aiInsights: {
      strengths: analysis.strengths,
      risks: analysis.weaknesses,
      summary: analysis.summary
    }
  };

  // Add or update fiscal year analysis
  const existingIndex = company.analyses.findIndex(
    (a) => String(a.fiscalYear) === String(savedAnalysis.fiscalYear)
  );

  if (existingIndex > -1) {
    // Replace with newest analysis
    company.analyses[existingIndex] = savedAnalysis;
  } else {
    company.analyses.push(savedAnalysis);
  }

  saveStorageStore(store);
  return { companyId, analysisId };
};

// 2. Favorite Companies Toggle Manager
export const toggleFavoriteCompany = (companyId: string): boolean => {
  const store = getStorageStore();
  const favorites = store.userPreferences.favoriteCompanies;
  const index = favorites.indexOf(companyId);
  let isFavoriteNow = false;

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(companyId);
    isFavoriteNow = true;
  }

  saveStorageStore(store);
  return isFavoriteNow;
};

// 3. Save Pairwise Company Comparison Analysis
export const saveCompanyComparison = (
  comp1: SavedCompany,
  comp2: SavedCompany,
  notes?: string
): CompanyComparison => {
  const store = getStorageStore();
  const nowStr = new Date().toISOString().split("T")[0];

  const c1Latest = comp1.analyses[comp1.analyses.length - 1]?.parsedData || demoCompanyData;
  const c2Latest = comp2.analyses[comp2.analyses.length - 1]?.parsedData || demoCompanyData;

  const newComparison: CompanyComparison = {
    id: generateUUID(),
    comparedAt: nowStr,
    company1: {
      id: comp1.id,
      name: comp1.name,
      ticker: comp1.ticker,
      industry: comp1.industry,
      roe: c1Latest.keyMetrics?.roe || 0,
      operatingMargin: c1Latest.incomeStatement?.operatingMargin || 0,
      debtToEquityRatio: c1Latest.balanceSheet?.debtToEquityRatio || 0,
      netIncome: c1Latest.incomeStatement?.netIncome || 0
    },
    company2: {
      id: comp2.id,
      name: comp2.name,
      ticker: comp2.ticker,
      industry: comp2.industry,
      roe: c2Latest.keyMetrics?.roe || 0,
      operatingMargin: c2Latest.incomeStatement?.operatingMargin || 0,
      debtToEquityRatio: c2Latest.balanceSheet?.debtToEquityRatio || 0,
      netIncome: c2Latest.incomeStatement?.netIncome || 0
    },
    notes: notes || `Performance benchmarking analysis of ${comp1.name} and ${comp2.name}.`
  };

  store.comparisons.push(newComparison);
  saveStorageStore(store);
  return newComparison;
};

// Get comparisons list
export const getComparisons = (): CompanyComparison[] => {
  return getStorageStore().comparisons;
};

// Delete comparison
export const deleteComparison = (comparisonId: string) => {
  const store = getStorageStore();
  store.comparisons = store.comparisons.filter((c) => c.id !== comparisonId);
  saveStorageStore(store);
};

// Update user preferences settings
export const saveUserPreferences = (prefs: Partial<UserPreferences>) => {
  const store = getStorageStore();
  store.userPreferences = {
    ...store.userPreferences,
    ...prefs
  };
  saveStorageStore(store);
};

// Delete Company record
export const deleteCompanyRecord = (companyId: string) => {
  const store = getStorageStore();
  store.companies = store.companies.filter((c) => c.id !== companyId);
  // Also clean up favorites
  store.userPreferences.favoriteCompanies = store.userPreferences.favoriteCompanies.filter((id) => id !== companyId);
  saveStorageStore(store);
};

// export a beautiful printable layout helper trigger as file download
export const exportToHtmlBackup = (data: AnalysisResult) => {
  const title = `Financial_Report_${data.company.name.replace(/\s+/g, "_")}`;
  const now = new Date().toLocaleDateString();

  const formattedRevenue = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(data.incomeStatement.revenue);
  const formattedIncome = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(data.incomeStatement.netIncome);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${data.company.name} - Executive Audit Report</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @media print {
          body { color: #000; background: #fff; }
          .no-print { display: none !important; }
          .page-break { page-break-after: always; }
        }
      </style>
    </head>
    <body class="bg-slate-50 text-slate-900 font-sans antialiased p-8 lg:p-16">
      <div class="max-w-4xl mx-auto space-y-10 bg-white p-12 rounded-3xl border border-slate-200 shadow-md">
        
        <!-- Header -->
        <div class="flex justify-between items-center border-b pb-8 border-slate-200">
          <div>
            <span class="text-xs font-black text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full uppercase tracking-wider">CONFIDENTIAL AUDIT</span>
            <h1 class="text-3xl font-black text-slate-800 tracking-tight mt-3">${data.company.name}</h1>
            <p class="text-sm text-slate-500 mt-1">Sector Classification: ${data.company.industry} | Segment Target: ${data.company.fiscalYear}</p>
          </div>
          <div class="text-right">
            <p class="text-xs font-bold text-slate-400">REPORT COMPILED</p>
            <p class="text-lg font-black text-slate-700">${now}</p>
          </div>
        </div>

        <!-- Metric overview blocks -->
        <div class="grid grid-cols-4 gap-4">
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p class="text-xs text-slate-400 font-bold">REVENUE</p>
            <p class="text-lg font-bold mt-1 text-slate-800">${formattedRevenue}</p>
          </div>
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p class="text-xs text-slate-400 font-bold">NET INCOME</p>
            <p class="text-lg font-bold mt-1 text-emerald-600">${formattedIncome}</p>
          </div>
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p class="text-xs text-slate-400 font-bold">ROE</p>
            <p class="text-lg font-bold mt-1 text-slate-800">${data.keyMetrics.roe.toFixed(2)}%</p>
          </div>
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p class="text-xs text-slate-400 font-bold">DEBT TO EQUITY</p>
            <p class="text-lg font-bold mt-1 text-slate-800">${data.balanceSheet.debtToEquityRatio.toFixed(2)}%</p>
          </div>
        </div>

        <!-- AI Summary -->
        <div class="space-y-3">
          <h2 class="text-lg font-black text-slate-850 tracking-tight">I. Executive Summation</h2>
          <p class="text-sm text-slate-600 leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-slate-100">${data.summary}</p>
        </div>

        <!-- Strengths / Risks Audit -->
        <div class="grid grid-cols-2 gap-8 pt-4">
          <div class="space-y-3">
            <h3 class="text-sm font-black text-emerald-800 uppercase tracking-widest">Growth Anchors & Strengths</h3>
            <ul class="space-y-2 text-xs text-slate-650">
              ${data.strengths.map(s => `<li class="flex items-start gap-2"><span>🟢</span><span>${s}</span></li>`).join("")}
            </ul>
          </div>
          <div class="space-y-3">
            <h3 class="text-sm font-black text-rose-800 uppercase tracking-widest">Macro/Structural Risk Audits</h3>
            <ul class="space-y-2 text-xs text-slate-650">
              ${data.weaknesses.map(w => `<li class="flex items-start gap-2"><span>⚠️</span><span>${w}</span></li>`).join("")}
            </ul>
          </div>
        </div>

        <!-- Detail Table -->
        <div class="space-y-4 pt-6">
          <h2 class="text-lg font-black text-slate-850 tracking-tight">II. Standard Income & Balances Summary</h2>
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-500 font-bold">
                <th class="p-3">Financial Metric Line Item</th>
                <th class="p-3 text-right">Value Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr>
                <td class="p-3 text-slate-500 font-semibold">Total Revenue</td>
                <td class="p-3 text-right font-bold text-slate-800">${formattedRevenue}</td>
              </tr>
              <tr>
                <td class="p-3 text-slate-500 font-semibold">Operating Profit / Margin</td>
                <td class="p-3 text-right font-bold text-slate-800">${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(data.incomeStatement.operatingProfit)} (${data.incomeStatement.operatingMargin.toFixed(1)}%)</td>
              </tr>
              <tr>
                <td class="p-3 text-slate-500 font-semibold">Net Income after taxation</td>
                <td class="p-3 text-right font-bold text-emerald-600">${formattedIncome} (${data.incomeStatement.netMargin.toFixed(1)}%)</td>
              </tr>
              <tr>
                <td class="p-3 text-slate-500 font-semibold">Consolidated Total Assets</td>
                <td class="p-3 text-right font-bold text-slate-800">${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(data.balanceSheet.totalAssets)}</td>
              </tr>
              <tr>
                <td class="p-3 text-slate-500 font-semibold">Consolidated Total Liabilities</td>
                <td class="p-3 text-right font-bold text-slate-800">${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(data.balanceSheet.totalLiabilities)}</td>
              </tr>
              <tr>
                <td class="p-3 text-slate-500 font-semibold">Net Operating Cash Flow</td>
                <td class="p-3 text-right font-bold text-slate-800">${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(data.cashFlow.operating)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Call to Print Action line -->
        <div class="no-print pt-8 border-t border-slate-100 flex justify-between items-center">
          <p class="text-xs text-slate-400">Generated automatically via Finalyze.ai Local Engine. Click button to print/save natively as high fidelity PDF.</p>
          <button onclick="window.print()" class="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-black shadow-md hover:bg-rose-500 transition-all">
            NATIVE PRINT PANEL (Save PDF)
          </button>
        </div>

      </div>
    </body>
    </html>
  `;

  // Create downloadable file link for browser
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}_Executive_Report.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
