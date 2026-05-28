/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Tooltip
} from "recharts";
import { 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  HelpCircle,
  PiggyBank,
  ThumbsUp,
  Activity,
  Award,
  Zap,
  CheckCircle2,
  Lock
} from "lucide-react";
import { AnalysisResult } from "../types";
import { cn } from "../lib/utils";

interface Props {
  data: AnalysisResult;
}

export const StrengthsWeaknessesAnalysis: React.FC<Props> = ({ data }) => {
  // Sort YoY list
  const sortedYoY = [...data.yearOverYear].sort((a, b) => Number(a.year) - Number(b.year));
  const latestIndex = sortedYoY.length - 1;
  const latestFi = sortedYoY[latestIndex] || data.incomeStatement;

  // 1. Calculate Real Dynamic Health Normalized Scores (0 - 100 scaling)
  // 수익성 (Profitability)
  const profitabilityScore = Math.min(100, Math.max(10, Math.round(data.keyMetrics.roe * 3.5 + data.incomeStatement.operatingMargin * 3)));
  
  // 성장성 (Growth)
  let growthScore = 55; // default fallback
  if (sortedYoY.length >= 2) {
    const oldest = sortedYoY[0];
    const latest = sortedYoY[sortedYoY.length - 1];
    if (oldest.revenue > 0) {
      const revenueCagr = (Math.pow(latest.revenue / oldest.revenue, 1 / (sortedYoY.length - 1)) - 1) * 100;
      growthScore = Math.min(100, Math.max(15, Math.round(revenueCagr * 4.5 + 40)));
    }
  }

  // 안정성 (Stability)
  const stabilityScore = Math.min(100, Math.max(10, Math.round(150 - data.balanceSheet.debtToEquityRatio * 0.8)));

  // 유동성 (Liquidity)
  const liquidityScore = Math.min(100, Math.max(15, Math.round(data.balanceSheet.equityRatio * 1.3)));

  // 효율성 (Efficiency)
  const efficiencyScore = Math.min(100, Math.max(10, Math.round(data.keyMetrics.roa * 6.5 + data.keyMetrics.pbr * 10)));

  // 현금창출력 (Cash Conversion)
  const cashGenScore = Math.min(100, Math.max(12, Math.round((data.cashFlow.operating / Math.max(1, data.incomeStatement.revenue)) * 350 + 20)));

  // Radar Data set representing company vs sector baseline benchmarks
  const radarData = [
    { subject: "Profitability (수익성)", Target: profitabilityScore, IndustryAvg: 60 },
    { subject: "Growth (성장성)", Target: growthScore, IndustryAvg: 55 },
    { subject: "Stability (안정성)", Target: stabilityScore, IndustryAvg: 70 },
    { subject: "Liquidity (유동성)", Target: liquidityScore, IndustryAvg: 65 },
    { subject: "Efficiency (효율성)", Target: efficiencyScore, IndustryAvg: 50 },
    { subject: "Cash Power (현금창출)", Target: cashGenScore, IndustryAvg: 58 }
  ];

  // 2. Traffic Light Indicator Cards config
  // Operating Margin Indicator
  const getOpMarginLevel = (val: number) => {
    if (val >= 12) return { status: "Good", color: "bg-emerald-500", text: "text-emerald-700 bg-emerald-50 border-emerald-200", desc: "Top 30% Elite Class" };
    if (val >= 6) return { status: "Warning", color: "bg-amber-500", text: "text-amber-700 bg-amber-50 border-amber-200", desc: "Industry Benchmark" };
    return { status: "Critical", color: "bg-rose-500", text: "text-rose-700 bg-rose-55 border-rose-200", desc: "Bottom 30% Underperformer" };
  };
  const opLevel = getOpMarginLevel(data.incomeStatement.operatingMargin);

  // ROE Indicator
  const getRoeLevel = (val: number) => {
    if (val >= 14) return { status: "Good", color: "bg-emerald-500", text: "text-emerald-700 bg-emerald-50 border-emerald-200", desc: "Excellent Compounder" };
    if (val >= 7) return { status: "Warning", color: "bg-amber-500", text: "text-amber-700 bg-amber-50 border-amber-200", desc: "Average Yield" };
    return { status: "Critical", color: "bg-rose-500", text: "text-rose-700 bg-rose-50 border-rose-200", desc: "Low Capital Efficiency" };
  };
  const roeLevel = getRoeLevel(data.keyMetrics.roe);

  // Debt-to-Equity Indicator
  const getDebtLevel = (val: number) => {
    if (val < 70) return { status: "Good", color: "bg-emerald-500", text: "text-emerald-700 bg-emerald-50 border-emerald-200", desc: "Highly Safe Leverage" };
    if (val < 140) return { status: "Warning", color: "bg-amber-500", text: "text-amber-700 bg-amber-50 border-amber-200", desc: "Moderate Leverage" };
    return { status: "Critical", color: "bg-rose-500", text: "text-rose-700 bg-rose-50 border-rose-200", desc: "High Solvency Risk" };
  };
  const debtLevel = getDebtLevel(data.balanceSheet.debtToEquityRatio);

  // Cash Flow Stability Indicator
  const getFcfLevel = (fcf: number, ocf: number) => {
    if (fcf > 0 && ocf >= fcf) return { status: "Good", color: "bg-emerald-500", text: "text-emerald-700 bg-emerald-50 border-emerald-200", desc: "Strong Cash Inflow" };
    if (ocf > 0) return { status: "Warning", color: "bg-amber-500", text: "text-amber-700 bg-amber-50 border-amber-200", desc: "CAPEX Dependency" };
    return { status: "Critical", color: "bg-rose-500", text: "text-rose-700 bg-rose-50 border-rose-200", desc: "Cash Flow Bleeding" };
  };
  const fcfLevel = getFcfLevel(data.cashFlow.fcf, data.cashFlow.operating);

  // Formatting helper
  const currencyFormatter = (bytes: number) => {
    if (Math.abs(bytes) >= 1000000000) return `$${(bytes / 1000000000).toFixed(1)}B`;
    if (Math.abs(bytes) >= 1000000) return `$${(bytes / 1000000).toFixed(1)}M`;
    return `$${(bytes / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* 2-Column top section: Radar visualization (right) & Health indicators (left) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Radar RadarChart representation (Col-span 5) */}
        <div className="bg-surface-card p-6 rounded-3xl border border-border shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-extrabold text-text-primary">Corporate Fiscal Radar</h3>
            <p className="text-xs text-text-secondary mt-1">Multi-axis health score comparison vs Sector Standard averages</p>
          </div>

          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--color-text-secondary)", fontSize: 10, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "var(--color-text-muted)", fontSize: 9 }} />
                
                <Radar name={data.company.name} dataKey="Target" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.25} />
                <Radar name="Sector Benchmark" dataKey="IndustryAvg" stroke="#94A3B8" fill="#E2E8F0" fillOpacity={0.2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "11px" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-border flex justify-center gap-6 text-[11px] font-bold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary/20 border border-primary inline-block" />
              <span className="text-text-primary">{data.company.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300 inline-block" />
              <span className="text-text-secondary">Sector Median (KOSPI/S&P)</span>
            </div>
          </div>
        </div>

        {/* Traffic Lights Cards Grid (Col-span 7) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-text-primary">Core Traffic Signal Audit</h3>
            <p className="text-xs text-text-secondary mt-1">Direct state assessment mapping corporate levels with absolute top tier benchmarks</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
            
            {/* Op Margin Card */}
            <div className="bg-surface-card p-5 rounded-2xl border border-border flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-text-secondary">Operating Margin (영업이익률)</span>
                <div className="flex items-center gap-1.5">
                  <span className={cn("w-2 h-2 rounded-full", opLevel.color)} />
                  <span className={cn("text-[10px] font-black px-1.5 py-0.5 rounded uppercase border", opLevel.text)}>{opLevel.status}</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-text-primary">{data.incomeStatement.operatingMargin.toFixed(1)}%</span>
                <span className="text-[10px] text-text-muted">{opLevel.desc}</span>
              </div>
              
              {/* Sparkline layout embedding trend */}
              <div className="h-[40px] w-full pt-1 border-t border-border">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sortedYoY}>
                    <Area type="monotone" dataKey="operatingProfit" stroke="var(--color-primary-light)" strokeWidth={1.5} fill="var(--color-primary-bg)" fillOpacity={0.3} dot={{ r: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ROE Capital Return Card */}
            <div className="bg-surface-card p-5 rounded-2xl border border-border flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-text-secondary">Return on Equity (ROE)</span>
                <div className="flex items-center gap-1.5">
                  <span className={cn("w-2 h-2 rounded-full", roeLevel.color)} />
                  <span className={cn("text-[10px] font-black px-1.5 py-0.5 rounded uppercase border", roeLevel.text)}>{roeLevel.status}</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-text-primary">{data.keyMetrics.roe.toFixed(1)}%</span>
                <span className="text-[10px] text-text-muted">{roeLevel.desc}</span>
              </div>

              {/* Sparkline */}
              <div className="h-[40px] w-full pt-1 border-t border-border">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sortedYoY}>
                    <Area type="monotone" dataKey="equity" stroke="var(--color-success)" strokeWidth={1.5} fill="#F0FDF4" fillOpacity={0.3} dot={{ r: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Debt to Equity Cards */}
            <div className="bg-surface-card p-5 rounded-2xl border border-border flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-text-secondary">Debt to Equity (부채비율)</span>
                <div className="flex items-center gap-1.5">
                  <span className={cn("w-2 h-2 rounded-full", debtLevel.color)} />
                  <span className={cn("text-[10px] font-black px-1.5 py-0.5 rounded uppercase border", debtLevel.text)}>{debtLevel.status}</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-text-primary">{data.balanceSheet.debtToEquityRatio.toFixed(1)}%</span>
                <span className="text-[10px] text-text-muted">{debtLevel.desc}</span>
              </div>

              {/* Sparkline */}
              <div className="h-[40px] w-full pt-1 border-t border-border">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sortedYoY}>
                    <Area type="monotone" dataKey="totalLiabilities" stroke="#64748B" strokeWidth={1.5} fill="#F8FAFC" fillOpacity={0.3} dot={{ r: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Free Cash Flow Yield Status */}
            <div className="bg-surface-card p-5 rounded-2xl border border-border flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-text-secondary">FCF Outflow Health</span>
                <div className="flex items-center gap-1.5">
                  <span className={cn("w-2 h-2 rounded-full", fcfLevel.color)} />
                  <span className={cn("text-[10px] font-black px-1.5 py-0.5 rounded uppercase border", fcfLevel.text)}>{fcfLevel.status}</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-emerald-600">{currencyFormatter(data.cashFlow.fcf)}</span>
                <span className="text-[10px] text-text-muted">{fcfLevel.desc}</span>
              </div>

              {/* Sparkline */}
              <div className="h-[40px] w-full pt-1 border-t border-border">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sortedYoY}>
                    <Area type="monotone" dataKey="fcf" stroke="var(--color-primary-light)" strokeWidth={1.5} fill="var(--color-primary-bg)" fillOpacity={0.3} dot={{ r: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Under Section: Rich Dynamic AI Analytical Insight panel layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Panel 1: Key Strength with custom icons */}
        <div className="bg-emerald-50/35 border border-emerald-100 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-2 right-2 text-emerald-100 p-4 select-none">
            <ShieldCheck size={56} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShieldCheck size={18} />
              </div>
              <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">A-Grade Growth Anchors</span>
            </div>
            
            <ul className="space-y-3 relative z-10">
              {data.strengths.slice(0, 3).map((st, i) => (
                <li key={i} className="text-xs text-emerald-950 font-medium leading-relaxed flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Panel 2: Major Risk with Warning signs */}
        <div className="bg-amber-50/35 border border-amber-100 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-2 right-2 text-amber-100 p-4 select-none">
            <AlertTriangle size={56} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <AlertTriangle size={18} />
              </div>
              <span className="text-xs font-black text-amber-800 uppercase tracking-widest">Strategic Risks & Pressure</span>
            </div>

            <ul className="space-y-3 relative z-10">
              {data.weaknesses.slice(0, 3).map((wk, i) => (
                <li key={i} className="text-xs text-amber-950 font-medium leading-relaxed flex items-start gap-2">
                  <AlertCircle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>{wk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Panel 3: Capital Allocation Opinion */}
        <div className="bg-primary-bg/25 border border-primary/15 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-2 right-2 text-primary/10 p-4 select-none">
            <Award size={56} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary-bg text-primary rounded-xl">
                <Zap size={18} />
              </div>
              <span className="text-xs font-black text-primary uppercase tracking-widest">Investment Summary Overview</span>
            </div>

            <div className="space-y-4 relative z-10">
              <p className="text-xs text-text-secondary leading-relaxed">
                {data.summary.length > 150 ? `${data.summary.substring(0, 150)}...` : data.summary}
              </p>
              
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-[11px] font-bold text-text-muted">Target Stance</span>
                <span className="text-xs font-black text-primary uppercase tracking-wider bg-primary/10 px-3 py-0.5 rounded-full border border-primary/20">
                  {data.investmentOpinion} Focus
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
