/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Activity,
  Award,
  Bookmark,
  Download
} from "lucide-react";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { AnalysisResult } from "../types";
import { cn } from "../lib/utils";
import { DynamicDashboardCharts } from "./DynamicDashboardCharts";
import { saveAnalysisResult, exportToHtmlBackup } from "../lib/storage";
import { useTranslation } from "../lib/i18n";

interface Props {
  data: AnalysisResult;
}

export const DashboardView: React.FC<Props> = ({ data }) => {
  const { t, language } = useTranslation();
  // Format helpers
  const formatMoney = (val: number) => {
    if (Math.abs(val) >= 1000000000) {
      return `$${(val / 1000000000).toFixed(2)}B`;
    }
    if (Math.abs(val) >= 1000000) {
      return `$${(val / 1000000).toFixed(1)}M`;
    }
    return `$${(val / 1000).toFixed(0)}K`;
  };

  const formatPercent = (val: number) => `${val.toFixed(1)}%`;

  // YoY calculations for KPI 1 (Latest revenue vs previous year)
  const yoyList = [...data.yearOverYear].sort((a, b) => Number(a.year) - Number(b.year));
  const latestYoY = yoyList[yoyList.length - 1];
  const previousYoY = yoyList[yoyList.length - 2];
  
  let revenueGrowthStr = "0.0%";
  let isRevGrowing = true;
  if (latestYoY && previousYoY) {
    const growth = ((latestYoY.revenue - previousYoY.revenue) / previousYoY.revenue) * 100;
    revenueGrowthStr = `${Math.abs(growth).toFixed(1)}%`;
    isRevGrowing = growth >= 0;
  }

  // Color-coded logic for Operating Margin (KPI 2)
  const opMargin = data.incomeStatement.operatingMargin;
  const opMarginColor = opMargin >= 10 
    ? "text-emerald-600 bg-emerald-50/50 border-emerald-100" 
    : opMargin >= 5 
      ? "text-amber-600 bg-amber-50/50 border-amber-100" 
      : "text-rose-600 bg-rose-50/50 border-rose-100";

  // Debt to equity indicator (KPI 3)
  const dToE = data.balanceSheet.debtToEquityRatio;
  const deStatus = dToE < 80 
    ? { text: "Low Solvency Risk", color: "bg-emerald-500" } 
    : dToE < 150 
      ? { text: "Moderate Solvency", color: "bg-amber-500" } 
      : { text: "Leveraged Structure", color: "bg-rose-500" };

  // ROE Indicator (KPI 4)
  const roeVal = data.keyMetrics.roe;
  const roeVsAvg = roeVal - 10.0; // Industry avg comparison (assume 10% average)

  // Chart Mix Dataset mapping
  const chartData = yoyList.map((item) => ({
    year: item.year,
    Revenue: item.revenue,
    "Operating Profit": item.operatingProfit,
    "Net Margin %": ((item.netIncome / item.revenue) * 100).toFixed(1)
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Print-Only Header (Exclusively rendered on physical A4 or PDF printed state) */}
      <div className="hidden print:flex items-center justify-between border-b-2 pb-6 mb-8 border-slate-300 w-full">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-3" />
            <span className="text-[10px] font-black tracking-widest text-[#1E40AF] uppercase">Finalyze.ai Executive Diagnostic Report</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1.5">{data.company.name}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Industry Sector: {data.company.industry || "General Domain"} | Audited Fiscal Segment: {data.company.fiscalYear || "FY2025"}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[9px] uppercase tracking-widest text-slate-400 block font-bold">Report Generated</span>
          <span className="text-xs font-black text-slate-700 block">{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          <span className="text-[8px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 font-extrabold inline-block mt-1">CONFIDENTIAL CLASSIFIED</span>
        </div>
      </div>

      {/* Dynamic Action Panel */}
      <div className="bg-white p-4 rounded-3xl border border-slate-105 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100/50">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-800">{t("common.localArchiveConnected")} ({data.company.name})</p>
            <p className="text-[10px] text-slate-400 font-medium">{t("common.autoSynced")}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 flex-wrap">
          <button 
            type="button"
            onClick={() => {
              try {
                saveAnalysisResult(
                  data.company.name,
                  data.company.name.slice(0, 4).toUpperCase(),
                  data.company.industry || "General",
                  data,
                  "Manual_Save_Archive.txt"
                );
                alert(`"${data.company.name}" ${t("common.savedSuccessfully")}`);
              } catch (err) {
                console.error(err);
              }
            }}
            className="flex-1 sm:flex-initial px-4 py-2 bg-primary hover:bg-primary-light text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-primary/10 cursor-pointer"
          >
            <Bookmark size={13} />
            <span>{t("common.manualSave")}</span>
          </button>

          <button 
            type="button"
            onClick={() => {
              exportToHtmlBackup(data);
            }}
            className="flex-1 sm:flex-initial px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white text-slate-650 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download size={13} />
            <span>{t("common.exportPdfHtml")}</span>
          </button>

          <button 
            type="button"
            onClick={() => {
              window.print();
            }}
            className="flex-1 sm:flex-initial px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-rose-600/10 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>{language === "ko" ? "PDF 리포트 다운로드" : "Download PDF Report"}</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Net Revenue with YoY change */}
        <div className="bg-surface-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">{t("dashboard.kpiRevenue")}</span>
            <span className="text-2xl font-black text-text-primary tracking-tight">
              {formatMoney(data.incomeStatement.revenue)}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            <span className={cn(
              "inline-flex items-center gap-0.5 text-xs font-extrabold px-2 py-0.5 rounded",
              isRevGrowing ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            )}>
              {isRevGrowing ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {revenueGrowthStr}
            </span>
            <span className="text-[11px] text-text-muted">YoY Trend</span>
          </div>
        </div>

        {/* KPI 2: Operating Margin Color Coding */}
        <div className="bg-surface-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">{t("dashboard.operatingMargin")}</span>
            <span className="text-2xl font-black text-text-primary tracking-tight">
              {formatPercent(opMargin)}
            </span>
          </div>
          <div className="mt-4">
            <span className={cn("text-[11px] font-bold px-2 py-1 rounded border uppercase tracking-wider", opMarginColor)}>
              {opMargin >= 10 ? "High Earning Power" : opMargin >= 5 ? "Average Power" : "Alert: Low Return"}
            </span>
          </div>
        </div>

        {/* KPI 3: Debt Ratio Gauge */}
        <div className="bg-surface-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">{t("dashboard.kpiDebtEquity")}</span>
            <span className="text-2xl font-black text-text-primary tracking-tight">
              {formatPercent(dToE)}
            </span>
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-text-secondary">{deStatus.text}</span>
              <span className="text-text-muted">Target: &lt;100%</span>
            </div>
            {/* Visual Mini Gauge */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full", deStatus.color)} style={{ width: `${Math.min(dToE, 100)}%` }} />
            </div>
          </div>
        </div>

        {/* KPI 4: ROE (Return on Equity) Comparison */}
        <div className="bg-surface-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">{t("dashboard.kpiRoe")}</span>
            <span className="text-2xl font-black text-text-primary tracking-tight">
              {formatPercent(roeVal)}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            <span className={cn(
              "inline-flex items-center gap-0.5 text-xs font-extrabold px-2 py-0.5 rounded",
              roeVsAvg >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            )}>
              {roeVsAvg >= 0 ? "+" : ""}
              {roeVsAvg.toFixed(1)}%p
            </span>
            <span className="text-[11px] text-text-muted">vs Benchmark (10.0%)</span>
          </div>
        </div>

      </div>

      {/* Key Financial Health Ratios & Metrics Grid */}
      <div className="bg-surface-card p-6 rounded-3xl border border-border shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-bold text-text-primary">{t("dashboard.metricsTitle")}</h3>
          <p className="text-xs text-text-secondary mt-1">Multi-perspective corporate efficiency & performance assessment criteria</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: "ROA (Return on Assets)", val: formatPercent(data.keyMetrics.roa), status: "Solid Ratio" },
            { label: "EBITDA Yield (매출 대비)", val: formatPercent((data.incomeStatement.ebitda / Math.max(1, data.incomeStatement.revenue)) * 105), status: "Stable Yield" },
            { label: "Net Profit Margin (순이익률)", val: formatPercent(data.incomeStatement.netMargin), status: "Healthy Margins" },
            { label: "P/E Multiple (PER)", val: `${data.keyMetrics.per.toFixed(1)}x`, status: "Market Value" },
            { label: "P/B Multiple (PBR)", val: `${data.keyMetrics.pbr.toFixed(1)}x`, status: "Value Play" },
            { label: "Earnings Per Share (EPS)", val: `$${data.keyMetrics.eps.toFixed(2)}`, status: "Accretive" }
          ].map((m, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between text-sm shadow-sm">
              <span className="font-medium text-text-secondary">{m.label}</span>
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-text-primary">{m.val}</span>
                <span className="text-[10px] font-black text-primary bg-primary-bg px-2 py-0.5 rounded border border-primary/10">
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Advanced Audit Chart Suite */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
            <span className="p-1 px-2.5 bg-primary text-white text-[10px] font-black rounded-lg uppercase tracking-wider">Suite</span>
            Core Dynamic Diagnostic Charts (동적 핵심 진단 차트)
          </h3>
          <p className="text-xs text-text-secondary">Highly responsive cross-audit metrics visualizing financial stability, waterfall flows, and growth vectors</p>
        </div>
        <DynamicDashboardCharts data={data} />
      </div>

      {/* AI Comment box (Blue color) */}
      <div className="bg-primary-bg/30 border border-primary/20 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-primary/10 select-none">
          <Sparkles size={120} />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Sparkles size={18} />
            <span className="text-sm uppercase tracking-wider">{t("dashboard.financialsSummary")}</span>
          </div>

          <p className="text-text-primary text-base leading-relaxed max-w-4xl">
            {data.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-primary/10">
            {/* Strengths */}
            <div className="space-y-3">
              <h4 className="text-emerald-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={16} />
                {t("dashboard.strengthsLabel")}
              </h4>
              <ul className="space-y-2">
                {data.strengths.slice(0, 3).map((st, i) => (
                  <li key={i} className="text-xs text-text-secondary flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div className="space-y-3">
              <h4 className="text-amber-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle size={16} />
                {t("dashboard.weaknessesLabel")}
              </h4>
              <ul className="space-y-2">
                {data.weaknesses.slice(0, 3).map((wk, i) => (
                  <li key={i} className="text-xs text-text-secondary flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
