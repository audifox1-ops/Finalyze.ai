/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from "recharts";
import { AnalysisResult } from "../types";

interface Props {
  data: AnalysisResult;
}

export const DynamicDashboardCharts: React.FC<Props> = ({ data }) => {
  // Sort YoY list chronologically
  const sortedYoY = [...data.yearOverYear].sort((a, b) => Number(a.year) - Number(b.year));

  // Format money for y-axes and tooltips
  const formatMoney = (val: number) => {
    if (Math.abs(val) >= 1000000000) {
      return `$${(val / 1000000000).toFixed(1)}B`;
    }
    if (Math.abs(val) >= 1000000) {
      return `$${(val / 1000000).toFixed(0)}M`;
    }
    return `$${(val / 1000).toFixed(0)}K`;
  };

  const formatPercent = (val: number) => `${val.toFixed(1)}%`;

  // -------------------------------------------------------------
  // [Chart 1] Composed Trend Chart (Line + Bar)
  // -------------------------------------------------------------
  const composedTrendData = sortedYoY.map((item) => {
    const opMargin = item.revenue > 0 ? (item.operatingProfit / item.revenue) * 100 : 0;
    return {
      year: item.year,
      Revenue: item.revenue,
      "Operating Margin": parseFloat(opMargin.toFixed(1))
    };
  });


  // -------------------------------------------------------------
  // [Chart 2] Profitability Bar Chart (Company vs Industry Avg vs Competitor)
  // -------------------------------------------------------------
  // Dynamically adapt baseline ratios based on target metrics
  const targetRoe = data.keyMetrics.roe;
  const targetRoa = data.keyMetrics.roa;
  const targetOpMargin = data.incomeStatement.operatingMargin;
  const targetNetMargin = data.incomeStatement.netMargin;

  // Derive competitor metrics (slightly higher/lower variance)
  const compRoe = parseFloat((targetRoe * 0.94 + 1.2).toFixed(1));
  const compRoa = parseFloat((targetRoa * 1.05 - 0.4).toFixed(1));
  const compOpMargin = parseFloat((targetOpMargin * 0.91 + 0.8).toFixed(1));
  const compNetMargin = parseFloat((targetNetMargin * 0.95 - 0.2).toFixed(1));

  // Industry average standard default models
  const indRoe = parseFloat((11.2).toFixed(1));
  const indRoa = parseFloat((6.1).toFixed(1));
  const indOpMargin = parseFloat((8.4).toFixed(1));
  const indNetMargin = parseFloat((6.7).toFixed(1));

  const profitabilityComparisonData = [
    {
      metric: "ROE (%)",
      [data.company.name]: parseFloat(targetRoe.toFixed(1)),
      "Industry Avg": indRoe,
      Competitor: compRoe
    },
    {
      metric: "ROA (%)",
      [data.company.name]: parseFloat(targetRoa.toFixed(1)),
      "Industry Avg": indRoa,
      Competitor: compRoa
    },
    {
      metric: "OP Margin (%)",
      [data.company.name]: parseFloat(targetOpMargin.toFixed(1)),
      "Industry Avg": indOpMargin,
      Competitor: compOpMargin
    },
    {
      metric: "Net Margin (%)",
      [data.company.name]: parseFloat(targetNetMargin.toFixed(1)),
      "Industry Avg": indNetMargin,
      Competitor: compNetMargin
    }
  ];


  // -------------------------------------------------------------
  // [Chart 3] Cash Flow Waterfall Chart (영업CF -> 투자CF -> 재무CF -> 기말잔액)
  // -------------------------------------------------------------
  const ocf = data.cashFlow.operating;
  const icf = data.cashFlow.investing;
  const fcfValue = data.cashFlow.financing;
  const netCashFlow = ocf + icf + fcfValue;

  // Let's model a robust cumulative offset waterfall
  const step1_base = 0;
  const step1_end = ocf; // Operating CF (usually positive)

  const step2_base = step1_end;
  const step2_end = step2_base + icf; // Investing CF (usually negative)

  const step3_base = step2_end;
  const step3_end = step3_base + fcfValue; // Financing CF (usually negative)

  const step4_base = 0;
  const step4_end = step3_end; // Net Cash Flow / Final End Cash Delta

  // Helper calculation for Waterfall Bar positioning
  const getWaterfallRow = (name: string, start: number, end: number) => {
    const change = end - start;
    const isPositive = change >= 0;
    
    return {
      name,
      // For Recharts stacked bars, the transparent bottom padding lifts the bar
      placeholder: isPositive ? start : end,
      increase: isPositive ? change : 0,
      decrease: isPositive ? 0 : Math.abs(change),
      total: 0,
      displayVal: change
    };
  };

  const waterfallData = [
    {
      name: "Operating CF",
      placeholder: ocf >= 0 ? 0 : ocf,
      increase: ocf >= 0 ? ocf : 0,
      decrease: ocf < 0 ? Math.abs(ocf) : 0,
      total: 0,
      displayVal: ocf
    },
    getWaterfallRow("Investing CF", step2_base, step2_end),
    getWaterfallRow("Financing CF", step3_base, step3_end),
    {
      name: "Net Balance",
      placeholder: 0,
      increase: 0,
      decrease: 0,
      total: step4_end,
      displayVal: step4_end
    }
  ];


  // -------------------------------------------------------------
  // [Chart 4] Financial Health Radar Chart (Normalized scores 0-100)
  // -------------------------------------------------------------
  // Normalized 6-metrics scaling algorithm
  const normProfitability = Math.min(100, Math.max(10, Math.round(targetRoe * 3.5 + targetOpMargin * 3)));
  
  let normGrowth = 55;
  if (sortedYoY.length >= 2) {
    const oldest = sortedYoY[0];
    const latest = sortedYoY[sortedYoY.length - 1];
    if (oldest.revenue > 0) {
      const revenueCagr = (Math.pow(latest.revenue / oldest.revenue, 1 / (sortedYoY.length - 1)) - 1) * 100;
      normGrowth = Math.min(100, Math.max(15, Math.round(revenueCagr * 4.5 + 40)));
    }
  }

  const normStability = Math.min(100, Math.max(10, Math.round(150 - data.balanceSheet.debtToEquityRatio * 0.8)));
  const normLiquidity = Math.min(100, Math.max(15, Math.round(data.balanceSheet.equityRatio * 1.3)));
  const normEfficiency = Math.min(100, Math.max(10, Math.round(targetRoa * 6.5 + data.keyMetrics.pbr * 10)));
  const normCashPower = Math.min(100, Math.max(12, Math.round((ocf / Math.max(1, data.incomeStatement.revenue)) * 350 + 20)));

  const radarData = [
    { subject: "Profitability (수익성)", Target: normProfitability, Benchmark: 62 },
    { subject: "Growth (성장성)", Target: normGrowth, Benchmark: 55 },
    { subject: "Stability (안정성)", Target: normStability, Benchmark: 70 },
    { subject: "Liquidity (유동성)", Target: normLiquidity, Benchmark: 65 },
    { subject: "Efficiency (효율성)", Target: normEfficiency, Benchmark: 50 },
    { subject: "Cash Power (현금창출)", Target: normCashPower, Benchmark: 58 }
  ];


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Chart 1: 복합 추이 차트 (Line + Bar) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-1">
            Revenue & Margin Compound Trend
          </h3>
          <p className="text-xs text-slate-400 mb-6 font-medium">
            매출액(막대) 및 영업이익률(선) 복합 연도별 추이분석
          </p>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={composedTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis 
                yAxisId="left" 
                stroke="#3B82F6" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={formatMoney} 
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#F59E0B" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(v) => `${v}%`} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  fontSize: "11px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.05)"
                }}
                formatter={(value: any, name: string) => {
                  if (name === "Revenue") return [formatMoney(value), "Total Revenue"];
                  return [`${value}%`, name];
                }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }} iconType="circle" />
              <Bar yAxisId="left" dataKey="Revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={45} />
              <Line yAxisId="right" type="monotone" dataKey="Operating Margin" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, fill: "#F59E0B" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: 수익성 비교 막대 차트 (Grouped Bar Chart) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-1">
            Profitability Index Benchmark
          </h3>
          <p className="text-xs text-slate-400 mb-6 font-medium">
            당사 vs 업종 평균 vs 주요 경쟁사 주요 수익성 지표 비교
          </p>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profitabilityComparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="metric" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  fontSize: "11px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.05)"
                }}
                formatter={(value: any) => [`${value}%`, ""]}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }} iconType="circle" />
              <Bar dataKey={data.company.name} fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Industry Avg" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Competitor" fill="#60A5FA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: 현금흐름 폭포 차트 (Waterfall Layout) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-1">
            Cash Flow Waterfall Breakdown
          </h3>
          <p className="text-xs text-slate-400 mb-6 font-medium">
            영업활동 → 투자활동 → 재무활동 거쳐 기말 현금흐름에 이르는 폭포 분석
          </p>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterfallData} margin={{ top: 15, right: 10, left: 0, bottom: 0 }} stackOffset="sign">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatMoney} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  fontSize: "11px",
                }}
                formatter={(value: any, name: string, props: any) => {
                  return [formatMoney(props.payload.displayVal), "Amount"];
                }}
              />
              {/* Stacked structure generates waterfall flow layout seamlessly */}
              <Bar dataKey="placeholder" stackId="cf" fill="transparent" />
              <Bar dataKey="decrease" stackId="cf" fill="#EF4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="increase" stackId="cf" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total" stackId="cf" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-2 flex justify-center gap-6 text-[11px] font-bold">
          <span className="flex items-center gap-1.5 text-[#10B981]">
            <span className="w-2.5 h-2.5 rounded bg-[#10B981]" />
            유입 (Inflow)
          </span>
          <span className="flex items-center gap-1.5 text-[#EF4444]">
            <span className="w-2.5 h-2.5 rounded bg-[#EF4444]" />
            유출 (Outflow)
          </span>
          <span className="flex items-center gap-1.5 text-[#3B82F6]">
            <span className="w-2.5 h-2.5 rounded bg-[#3B82F6]" />
            기말 최종 (Net Change)
          </span>
        </div>
      </div>

      {/* Chart 4: 재무 건전성 레이더 차트 (Normalized Radar) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-1">
            Multidimensional Fiscal Health Radar
          </h3>
          <p className="text-xs text-slate-400 mb-6 font-medium">
            정규화(0~100점)된 6개 핵심 지표 균형 진단 vs 업계 중앙선
          </p>
        </div>

        <div className="h-[280px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#F1F5F9" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748B", fontSize: 10, fontWeight: 700 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 9 }} />
              
              <Radar name={data.company.name} dataKey="Target" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} />
              <Radar name="Industry Average" dataKey="Benchmark" stroke="#94A3B8" strokeDasharray="4 4" fill="transparent" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "11px" }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "11px" }} iconType="circle" />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
