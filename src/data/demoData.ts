/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResult } from "../types";

export const demoCompanyData: AnalysisResult = {
  company: {
    name: "Samsung Electronics (Demo Corp)",
    fiscalYear: "FY2025",
    industry: "Consumer Electronics & Semiconductors"
  },
  incomeStatement: {
    revenue: 258400000000,
    operatingProfit: 35600000000,
    netIncome: 27800000000,
    ebitda: 48900000000,
    operatingMargin: 13.8,
    netMargin: 10.8
  },
  balanceSheet: {
    totalAssets: 452000000000,
    totalLiabilities: 128000000000,
    equity: 324000000000,
    debtToEquityRatio: 39.5,
    equityRatio: 71.7
  },
  cashFlow: {
    operating: 42100000000,
    investing: -28500000000,
    financing: -8200000000,
    fcf: 13600000000
  },
  keyMetrics: {
    roe: 11.2,
    roa: 8.5,
    per: 15.4,
    pbr: 1.35,
    eps: 4.85
  },
  yearOverYear: [
    {
      year: "2021",
      revenue: 218200000000,
      operatingProfit: 29400000000,
      netIncome: 21400000000,
      ebitda: 39600000000,
      totalAssets: 382000000000,
      totalLiabilities: 115000000000,
      equity: 267000000000,
      operatingCashFlow: 32000000000,
      fcf: 9400000000
    },
    {
      year: "2022",
      revenue: 236400000000,
      operatingProfit: 30800000000,
      netIncome: 22800000000,
      ebitda: 41200000000,
      totalAssets: 405000000000,
      totalLiabilities: 120000000000,
      equity: 285000000000,
      operatingCashFlow: 35400000000,
      fcf: 11200000000
    },
    {
      year: "2023",
      revenue: 248900000000,
      operatingProfit: 32600000000,
      netIncome: 24900000000,
      ebitda: 44500000000,
      totalAssets: 428000000000,
      totalLiabilities: 124000000000,
      equity: 304000000000,
      operatingCashFlow: 38600000000,
      fcf: 12400000000
    },
    {
      year: "2024",
      revenue: 258400000000,
      operatingProfit: 35600000000,
      netIncome: 27800000000,
      ebitda: 48900000000,
      totalAssets: 452000000000,
      totalLiabilities: 128000000000,
      equity: 324000000000,
      operatingCashFlow: 42100000000,
      fcf: 13600000000
    }
  ],
  summary: "Samsung Electronics shows a highly resilient operational structure. Driven by advanced High-Bandwidth Memory (HBM) chip demands and balanced foundry investments, the company has consolidated its revenue baseline while remaining at peak capital efficiency margins on equity returns.",
  strengths: [
    "Absolute industry leadership with HBM3e & high-density memory storage nodes.",
    "Very clean book leverage metrics where Debt-to-Equity is maintained under 40.0%.",
    "Consistently sound Free Cash Flow conversion exceeding $13B continuously."
  ],
  weaknesses: [
    "High sensitivity to global semiconductor price cycle curves and raw lithography costs.",
    "Geopolitical chip production trade bottlenecks restricting direct fabrication scaling.",
    "Higher capital expenditure requirement for sub-3nm foundry technology."
  ],
  investmentOpinion: "Aggressive"
};
