/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CompanyInfo {
  name: string;
  fiscalYear: string;
  industry: string;
}

export interface IncomeStatement {
  revenue: number;
  operatingProfit: number;
  netIncome: number;
  ebitda: number;
  operatingMargin: number; // in %
  netMargin: number;       // in %
}

export interface BalanceSheet {
  totalAssets: number;
  totalLiabilities: number;
  equity: number;
  debtToEquityRatio: number; // in %
  equityRatio: number;       // in %
}

export interface CashFlow {
  operating: number;
  investing: number;
  financing: number;
  fcf: number;
}

export interface KeyMetrics {
  roe: number; // in %
  roa: number; // in %
  per: number; // Ratio x
  pbr: number; // Ratio x
  eps: number; // Currency numerical value
}

export interface YoYFinancial {
  year: string;
  revenue: number;
  operatingProfit: number;
  netIncome: number;
  ebitda: number;
  totalAssets: number;
  totalLiabilities: number;
  equity: number;
  operatingCashFlow: number;
  fcf: number;
}

export interface AnalysisResult {
  company: CompanyInfo;
  incomeStatement: IncomeStatement;
  balanceSheet: BalanceSheet;
  cashFlow: CashFlow;
  keyMetrics: KeyMetrics;
  yearOverYear: YoYFinancial[];
  summary: string;
  strengths: string[];
  weaknesses: string[];
  investmentOpinion: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  source: 'local' | 'drive' | 'url' | 'camera' | 'clipboard';
  uploadedAt: string;
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
  extractedText?: string;
  extractedData?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
