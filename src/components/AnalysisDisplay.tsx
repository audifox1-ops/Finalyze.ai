/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  ShieldCheck, 
  AlertCircle, 
  Bookmark,
  Building2,
  Calendar,
  Wallet,
  Coins,
  ArrowRightLeft,
  Gem,
  Percent,
  Download,
  Share2,
  ChevronRight
} from "lucide-react";
import { AnalysisResult, YoYFinancial } from "../types";
import { FinancialChart } from "./FinancialChart";
import { StrengthsWeaknessesAnalysis } from "./StrengthsWeaknessesAnalysis";
import { cn } from "../lib/utils";

interface Props {
  data: AnalysisResult;
}

export const AnalysisDisplay: React.FC<Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<"summary" | "income" | "balance" | "ratio" | "audit">("summary");

  const getOpinionColor = (opinion: string) => {
    switch (opinion.toLowerCase()) {
      case "aggressive": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "neutral": return "bg-primary-bg text-primary border-primary/20";
      case "conservative": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-surface text-text-secondary border-border";
    }
  };

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatPercentage = (val: number) => {
    return `${val.toFixed(1)}%`;
  };

  const tabs = [
    { id: "summary", label: "Executive Summary", icon: Bookmark },
    { id: "income", label: "Income & YoY", icon: Coins },
    { id: "balance", label: "Balance & Cash Flows", icon: Wallet },
    { id: "ratio", label: "Valuation Metrics", icon: Percent },
    { id: "audit", label: "Strengths & Risks Audit", icon: ShieldCheck }
  ] as const;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-6xl mx-auto space-y-6"
    >
      {/* Header Info Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-surface-card p-8 rounded-3xl shadow-sm border border-border">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-primary bg-primary-bg px-3 py-1 rounded-full uppercase tracking-wider">
              Diagnostic Complete
            </span>
            <span className="text-text-muted">•</span>
            <span className="text-xs text-text-secondary flex items-center gap-1">
              <Calendar size={14} />
              {data.company.fiscalYear} Statement
            </span>
            <span className="text-text-muted hidden sm:inline">•</span>
            <span className="text-xs text-text-secondary hidden sm:flex items-center gap-1">
              <Building2 size={14} />
              {data.company.industry} Industry
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            {data.company.name}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-3 bg-surface border border-border hover:bg-border/30 rounded-xl text-text-secondary transition-colors" title="Export Report">
            <Download size={18} />
          </button>
          <button className="p-3 bg-surface border border-border hover:bg-border/30 rounded-xl text-text-secondary transition-colors" title="Share Report">
            <Share2 size={18} />
          </button>
          <div className={cn("px-6 py-3 rounded-2xl border flex items-center gap-2", getOpinionColor(data.investmentOpinion))}>
            <Target size={18} />
            <span className="font-extrabold text-sm uppercase tracking-wide">{data.investmentOpinion}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border overflow-x-auto scroller-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-4.5 border-b-2 font-bold text-sm tracking-tight transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "border-primary text-primary" 
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Structured Content Views */}
      <div className="min-h-[400px]">
        {activeTab === "summary" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {/* Left summary area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-surface-card p-8 rounded-3xl border border-border space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Bookmark size={20} />
                  <span>Strategic Investor Summary</span>
                </div>
                <p className="text-text-secondary text-base leading-relaxed">
                  {data.summary}
                </p>
              </div>

              {/* Instant Health Checklist Card */}
              <div className="bg-surface-card p-8 rounded-3xl border border-border space-y-6">
                <h3 className="font-bold text-text-primary">At-A-Glance Valuation Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-surface rounded-2xl border border-border flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-muted">Capital Efficiency (ROE)</p>
                      <p className="text-lg font-extrabold text-text-primary mt-1">{formatPercentage(data.keyMetrics.roe)}</p>
                    </div>
                    <span className={cn("text-xs font-bold px-2 py-1 rounded-md", data.keyMetrics.roe > 10 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                      {data.keyMetrics.roe > 10 ? "High" : "Moderate"}
                    </span>
                  </div>

                  <div className="p-4 bg-surface rounded-2xl border border-border flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-muted">Leverage (D/E Ratio)</p>
                      <p className="text-lg font-extrabold text-text-primary mt-1">{formatPercentage(data.balanceSheet.debtToEquityRatio)}</p>
                    </div>
                    <span className={cn("text-xs font-bold px-2 py-1 rounded-md", data.balanceSheet.debtToEquityRatio < 100 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                      {data.balanceSheet.debtToEquityRatio < 100 ? "Stable Leverage" : "Aggressive Leverage"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses Panel */}
            <div className="space-y-4">
              <div className="bg-emerald-50/40 p-6 rounded-3xl border border-emerald-100 flex flex-col justify-between">
                <div>
                  <h3 className="text-emerald-900 font-extrabold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <ShieldCheck size={20} className="text-emerald-600" />
                    Strategic Strengths
                  </h3>
                  <ul className="space-y-4">
                    {data.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-emerald-800 text-sm font-semibold">
                        <TrendingUp size={16} className="mt-0.5 text-emerald-600 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50/40 p-6 rounded-3xl border border-amber-100 flex flex-col justify-between">
                <div>
                  <h3 className="text-amber-900 font-extrabold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <AlertCircle size={20} className="text-amber-600" />
                    Key Risk Indicators
                  </h3>
                  <ul className="space-y-4">
                    {data.weaknesses.map((weak, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-amber-800 text-sm font-semibold">
                        <TrendingDown size={16} className="mt-0.5 text-amber-600 shrink-0" />
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "income" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top metrics bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Net Revenue", value: formatMoney(data.incomeStatement.revenue) },
                { title: "Operating Profit", value: formatMoney(data.incomeStatement.operatingProfit) },
                { title: "EBITDA", value: formatMoney(data.incomeStatement.ebitda) },
                { title: "Net Income", value: formatMoney(data.incomeStatement.netIncome) },
              ].map((m, idx) => (
                <div key={idx} className="bg-surface-card p-5 rounded-2xl border border-border">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1">{m.title}</span>
                  <p className="text-xl font-black text-text-primary">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Income Statement data tables */}
            <div className="bg-surface-card rounded-3xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="font-extrabold text-text-primary text-base">Key YoY Trend Data (Korean Standard GAAP Integration)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-surface text-text-secondary font-bold border-b border-border">
                    <tr>
                      <th className="p-4 pl-6">Reported Year</th>
                      <th className="p-4">Revenue (매출액)</th>
                      <th className="p-4">Operating Profit (영업이익)</th>
                      <th className="p-4">Net income (당기순이익)</th>
                      <th className="p-4">EBITDA</th>
                      <th className="p-4 pr-6 text-right">FCF Convergence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.yearOverYear.map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface/40 transition-colors">
                        <td className="p-4 pl-6 font-bold text-text-primary text-sm">{row.year}</td>
                        <td className="p-4 text-text-primary font-semibold">{formatMoney(row.revenue)}</td>
                        <td className="p-4 text-text-primary font-medium">{formatMoney(row.operatingProfit)}</td>
                        <td className="p-4 text-text-primary font-medium">{formatMoney(row.netIncome)}</td>
                        <td className="p-4 text-text-secondary">{formatMoney(row.ebitda)}</td>
                        <td className="p-4 pr-6 text-right font-semibold text-primary">{formatMoney(row.fcf)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "balance" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Key Ratios Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-card p-6 rounded-3xl border border-border space-y-4">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Book Solvency Ratio</h4>
                <div>
                  <p className="text-xs text-text-secondary mb-1">Total Assets: <span className="font-bold text-text-primary">{formatMoney(data.balanceSheet.totalAssets)}</span></p>
                  <p className="text-xs text-text-secondary">Liabilities: <span className="font-bold text-text-primary">{formatMoney(data.balanceSheet.totalLiabilities)}</span></p>
                </div>
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-bold text-text-primary">Equity Capitalization</span>
                  <span className="text-base font-black text-primary">{formatMoney(data.balanceSheet.equity)}</span>
                </div>
              </div>

              <div className="bg-surface-card p-6 rounded-3xl border border-border space-y-4">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Solvency Health</h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Equity Ratio (자기자본)</span>
                  <span className="text-sm font-bold text-text-primary">{formatPercentage(data.balanceSheet.equityRatio)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Debt to Equity (부채비율)</span>
                  <span className="text-sm font-bold text-text-primary">{formatPercentage(data.balanceSheet.debtToEquityRatio)}</span>
                </div>
                <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all", 
                      data.balanceSheet.debtToEquityRatio < 100 ? "bg-success" : "bg-warning"
                    )}
                    style={{ width: `${Math.min(data.balanceSheet.debtToEquityRatio, 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-surface-card p-6 rounded-3xl border border-border space-y-4">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Cash Flow Allocation</h4>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-secondary">Operating flow</span>
                    <span className="font-semibold text-emerald-600">{formatMoney(data.cashFlow.operating)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-secondary">Investing outflow</span>
                    <span className="font-semibold text-rose-600">{formatMoney(data.cashFlow.investing)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-secondary">Financing adjustment</span>
                    <span className="font-semibold text-slate-600">{formatMoney(data.cashFlow.financing)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-border flex justify-between items-center">
                  <span className="text-xs font-bold text-text-primary">Free Cash Flow (FCF)</span>
                  <span className="text-sm font-black text-emerald-600">{formatMoney(data.cashFlow.fcf)}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-card rounded-3xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="font-extrabold text-text-primary text-base">Book Solvency & Cash Trend YoY</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-surface text-text-secondary font-bold border-b border-border">
                    <tr>
                      <th className="p-4 pl-6">Reported Year</th>
                      <th className="p-4">Total Assets (총자산)</th>
                      <th className="p-4">Total Liabilities (총부채)</th>
                      <th className="p-4">Equity Capital (자기자본)</th>
                      <th className="p-4">Operating Cash Flow</th>
                      <th className="p-4 pr-6 text-right">Free Cash Flow (FCF)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.yearOverYear.map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface/40 transition-colors">
                        <td className="p-4 pl-6 font-bold text-text-primary text-sm">{row.year}</td>
                        <td className="p-4 text-text-primary font-semibold">{formatMoney(row.totalAssets)}</td>
                        <td className="p-4 text-text-primary font-medium">{formatMoney(row.totalLiabilities)}</td>
                        <td className="p-4 text-text-primary font-medium">{formatMoney(row.equity)}</td>
                        <td className="p-4 text-emerald-600">{formatMoney(row.operatingCashFlow)}</td>
                        <td className="p-4 pr-6 text-right font-semibold text-emerald-700">{formatMoney(row.fcf)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ratio" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Valuation Index Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { name: "ROE (Return on Equity)", val: formatPercentage(data.keyMetrics.roe), helper: "Equity diagnostic return efficiency" },
                { name: "ROA (Return on Assets)", val: formatPercentage(data.keyMetrics.roa), helper: "Asset usage diagnostic returns" },
                { name: "P/E Ratio (PER)", val: `${data.keyMetrics.per.toFixed(1)}x`, helper: "Price relative to earnings multiple" },
                { name: "P/B Ratio (PBR)", val: `${data.keyMetrics.pbr.toFixed(1)}x`, helper: "Share price relative to book equity value" },
                { name: "Earnings Per Share (EPS)", val: formatMoney(data.keyMetrics.eps), helper: "Calculated profit per outstanding share" },
              ].map((ratio, idx) => (
                <div key={idx} className="bg-surface-card p-6 rounded-2xl border border-border flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-bold text-text-muted block mb-1 uppercase tracking-wide leading-tight">{ratio.name}</span>
                    <p className="text-2xl font-black text-text-primary">{ratio.val}</p>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-tight">{ratio.helper}</p>
                </div>
              ))}
            </div>

            {/* DuPont Analysis representation */}
            <div className="bg-surface-card p-8 rounded-3xl border border-border">
              <h3 className="font-extrabold text-text-primary mb-4 text-lg">DuPont Performance Breakdown Model</h3>
              <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                Equity Returns (ROE) are decomposed into three core drivers of performance strategy: Profitability (Net Profit Margin), Asset Efficiency (Asset Turnover), and Financial Leverage (Equity Multiplier).
              </p>
              
              <div className="flex flex-col md:flex-row items-center gap-6 justify-between bg-surface p-6 rounded-2xl border border-border">
                <div className="text-center p-4">
                  <p className="text-base font-black text-primary">{formatPercentage(data.incomeStatement.netMargin)}</p>
                  <p className="text-xs font-bold text-text-secondary mt-1">Net Margin (%)</p>
                </div>
                <ChevronRight className="rotate-90 md:rotate-0 text-text-muted" />
                <div className="text-center p-4">
                  <p className="text-base font-black text-primary">0.95x</p>
                  <p className="text-xs font-bold text-text-secondary mt-1">Asset Turnover</p>
                </div>
                <ChevronRight className="rotate-90 md:rotate-0 text-text-muted" />
                <div className="text-center p-4">
                  <p className="text-base font-black text-primary">1.75x</p>
                  <p className="text-xs font-bold text-text-secondary mt-1 font-bold">Equity Multiplier</p>
                </div>
                <ChevronRight className="rotate-90 md:rotate-0 text-text-muted" />
                <div className="text-center p-6 bg-primary-bg rounded-xl border border-primary/20">
                  <p className="text-lg font-black text-primary">{formatPercentage(data.keyMetrics.roe)}</p>
                  <p className="text-xs font-extrabold text-primary uppercase tracking-wider mt-1">Resulting ROE</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "audit" && (
          <StrengthsWeaknessesAnalysis data={data} />
        )}
      </div>

      {/* Embedded Chart Suite */}
      <h3 className="text-lg font-bold text-text-primary pt-6">Advanced Visualization Trends</h3>
      <FinancialChart yearOverYearData={data.yearOverYear} />

      {/* Disclosures banner */}
      <div className="text-center py-6 border-t border-border">
         <p className="text-[11px] text-text-muted max-w-2xl mx-auto leading-relaxed">
           Financial Statement Analyzer (Finalyze.ai) provides institutional-grade AI modeling for analysis purposes only. No content herein constitutes a prompt for stock trade matching or fiduciary financial advice under FSC regulations. All computed valuations derive from estimated values mapped on raw filings.
         </p>
      </div>
    </motion.div>
  );
};
