/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from "recharts";
import { YoYFinancial } from "../types";

interface Props {
  yearOverYearData: YoYFinancial[];
}

export const FinancialChart: React.FC<Props> = ({ yearOverYearData }) => {
  const formatValue = (val: number) => {
    if (Math.abs(val) >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    return `$${(val / 1000).toFixed(0)}K`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-6">
      {/* 1. Revenue, EBITDA & Net Income Line Trend */}
      <div className="bg-surface-card p-6 rounded-3xl border border-border flex flex-col justify-between shadow-sm">
        <div>
          <h3 className="text-base font-bold text-text-primary">Earning Power YoY</h3>
          <p className="text-xs text-text-secondary mb-6">Revenue expansion matched with EBITDA & Net Profit margins</p>
        </div>
        <div className="h-[280px] w-full min-w-0">
          <ResponsiveContainer width="100%" height={280} minWidth={0}>
            <LineChart data={yearOverYearData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="year" stroke="var(--color-text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatValue} />
              <Tooltip 
                formatter={(value: any) => [formatValue(Number(value)), ""]}
                contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid var(--color-border)", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
              />
              <Legend verticalAlign="top" align="right" fontSize={11} iconType="circle" />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="var(--color-primary-light)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="ebitda" name="EBITDA" stroke="#818CF8" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="netIncome" name="Net Income" stroke="var(--color-success)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Balance Sheet Capital Allocation (Liabilities vs Equity) */}
      <div className="bg-surface-card p-6 rounded-3xl border border-border flex flex-col justify-between shadow-sm">
        <div>
          <h3 className="text-base font-bold text-text-primary">Capital Structure Growth</h3>
          <p className="text-xs text-text-secondary mb-6">Balance sheet leverage ratio between Liabilities & Equity</p>
        </div>
        <div className="h-[280px] w-full min-w-0">
          <ResponsiveContainer width="100%" height={280} minWidth={0}>
            <BarChart data={yearOverYearData} stackOffset="sign">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="year" stroke="var(--color-text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatValue} />
              <Tooltip 
                formatter={(value: any) => [formatValue(Number(value)), ""]}
                contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid var(--color-border)", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
              />
              <Legend verticalAlign="top" align="right" fontSize={11} iconType="circle" />
              <Bar dataKey="equity" name="Book Value Equity" fill="var(--color-primary)" stackId="a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="totalLiabilities" name="Total Liabilities" fill="#94A3B8" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Cash Flow Quality (OCF and FCF area trends) */}
      <div className="bg-surface-card p-6 rounded-3xl border border-border flex flex-col justify-between lg:col-span-2 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-text-primary">Liquidity & Cash Conversion Trend</h3>
          <p className="text-xs text-text-secondary mb-6">Comparison of Cash Flows from Operations with fully realized Free Cash Flow (FCF)</p>
        </div>
        <div className="h-[280px] w-full min-w-0">
          <ResponsiveContainer width="100%" height={280} minWidth={0}>
            <AreaChart data={yearOverYearData}>
              <defs>
                <linearGradient id="colorOcf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary-light)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--color-primary-light)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFcf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="year" stroke="var(--color-text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatValue} />
              <Tooltip 
                formatter={(value: any) => [formatValue(Number(value)), ""]}
                contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid var(--color-border)", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
              />
              <Legend verticalAlign="top" align="right" fontSize={11} iconType="circle" />
              <Area type="monotone" dataKey="operatingCashFlow" name="Operating Cash Flow" stroke="var(--color-primary-light)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOcf)" />
              <Area type="monotone" dataKey="fcf" name="Free Cash Flow (FCF)" stroke="var(--color-success)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFcf)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
