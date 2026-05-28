/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  getStorageStore, 
  SavedCompany, 
  SavedAnalysis, 
  CompanyComparison,
  toggleFavoriteCompany, 
  saveCompanyComparison, 
  deleteComparison,
  deleteCompanyRecord,
  exportToHtmlBackup
} from "../lib/storage";
import { 
  Building2, 
  Search, 
  Filter, 
  Star, 
  Trash2, 
  Eye, 
  ArrowLeftRight, 
  Plus, 
  Bookmark, 
  Download, 
  CheckCircle,
  HelpCircle,
  Info
} from "lucide-react";
import { AnalysisResult } from "../types";

interface Props {
  onLoadCompanyAnalysis: (data: AnalysisResult) => void;
  activeCompanyId?: string;
}

export const CompanyManagementPanel: React.FC<Props> = ({ onLoadCompanyAnalysis, activeCompanyId }) => {
  const [store, setStore] = useState(getStorageStore());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [compCompanyId1, setCompCompanyId1] = useState("");
  const [compCompanyId2, setCompCompanyId2] = useState("");
  const [comparisonNotes, setComparisonNotes] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  // Reload storage state directly
  const refreshStore = () => {
    setStore(getStorageStore());
  };

  useEffect(() => {
    refreshStore();
  }, [activeCompanyId]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Get list of unique industries
  const industries = ["All", ...Array.from(new Set(store.companies.map((c) => c.industry)))];

  // Filtered companies list
  const filteredCompanies = store.companies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.ticker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === "All" || c.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteCompany(id);
    refreshStore();
    showNotification("Favorite preferences updated successfully.");
  };

  const handleRemoveCompany = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to permanently delete this company and its associated AI reports?")) {
      deleteCompanyRecord(id);
      refreshStore();
      showNotification("Company record cleared.");
    }
  };

  const handleCreateComparison = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compCompanyId1 || !compCompanyId2) {
      alert("Please select two distinct companies to compare.");
      return;
    }
    if (compCompanyId1 === compCompanyId2) {
      alert("Please select two different companies.");
      return;
    }

    const company1 = store.companies.find((c) => c.id === compCompanyId1);
    const company2 = store.companies.find((c) => c.id === compCompanyId2);

    if (company1 && company2) {
      saveCompanyComparison(company1, company2, comparisonNotes);
      setComparisonNotes("");
      setCompCompanyId1("");
      setCompCompanyId2("");
      refreshStore();
      showNotification("Saved pairwise corporate comparison created.");
    }
  };

  const handleRemoveComparison = (id: string) => {
    if (confirm("Delete this saved comparison record?")) {
      deleteComparison(id);
      refreshStore();
      showNotification("Comparison index deleted.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Toast Alert Notice */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-55 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2">
          <CheckCircle size={14} className="text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Grid containing Company list (Col-span 7) & Fast Comparison Creator (Col-span 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Company Archival Registry list (Col-span 7) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Bookmark size={18} className="text-primary" />
                Company Archival Registry
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Filter, preview corporate financials, or trigger offline file compilation</p>
            </div>
            
            {/* Filter buttons */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                <Filter size={11} className="text-slate-400" />
                <select 
                  value={selectedIndustry} 
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="bg-transparent text-[11px] font-bold text-slate-600 focus:outline-none cursor-pointer"
                >
                  {industries.map((indKey) => (
                    <option key={indKey} value={indKey}>{indKey}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-slate-400" />
            </span>
            <input 
              type="text" 
              placeholder="Search companies by corporate name, ticker symbol..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium pl-9 pr-4 py-2 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50 transition-all text-slate-700"
            />
          </div>

          <div className="space-y-4">
            {filteredCompanies.length === 0 ? (
              <div className="p-10 border border-dashed border-slate-100 rounded-2xl text-center space-y-2">
                <p className="text-xs font-bold text-slate-400">No matching cached companies found</p>
                <p className="text-[10px] text-slate-350">Run fresh analyses via the Analysis tab to automatically append results.</p>
              </div>
            ) : (
              filteredCompanies.map((c) => {
                const latestAnalysis = c.analyses[c.analyses.length - 1];
                const isFavorite = store.userPreferences.favoriteCompanies.includes(c.id);

                return (
                  <div 
                    key={c.id}
                    onClick={() => {
                      if (latestAnalysis) onLoadCompanyAnalysis(latestAnalysis.parsedData);
                    }}
                    className="p-5 border border-slate-100 rounded-2xl hover:border-primary/20 hover:bg-slate-50/20 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-primary-bg group-hover:text-primary transition-colors">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-800 tracking-tight">{c.name}</h4>
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase">{c.ticker}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                          {c.industry} | Saved on: {c.createdAt}
                        </p>
                        {latestAnalysis && (
                          <div className="mt-2 text-[10px] text-primary font-bold flex items-center gap-1.5">
                            <span>Analysis Level: {String(latestAnalysis.fiscalYear)}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-400 font-medium">Audited: {latestAnalysis.analyzedAt}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      {/* Favorite button */}
                      <button 
                        onClick={(e) => handleToggleFavorite(c.id, e)}
                        className="p-2 border border-slate-150 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-50 transition-all"
                        title="Mark as Favorite"
                      >
                        <Star size={14} className={isFavorite ? "fill-amber-400 text-amber-500" : ""} />
                      </button>

                      {/* Download PDF / Backup button */}
                      {latestAnalysis && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            exportToHtmlBackup(latestAnalysis.parsedData);
                            showNotification("Filing exported to local browser.");
                          }}
                          className="p-2 border border-slate-150 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-slate-50 transition-all flex items-center gap-1 text-[10px] font-bold"
                          title="Download report offline"
                        >
                          <Download size={14} />
                          <span>Export</span>
                        </button>
                      )}

                      {/* Delete */}
                      <button 
                        onClick={(e) => handleRemoveCompany(c.id, e)}
                        className="p-2 border border-slate-150 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-50 transition-all"
                        title="Delete record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pairwise Comparison Workspace Creator (Col-span 5) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <ArrowLeftRight size={18} className="text-primary" />
              Pairwise Benchmarking
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Select two companies to create a customized comparison card index</p>
          </div>

          <form onSubmit={handleCreateComparison} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Base Anchor Company</label>
              <select 
                value={compCompanyId1}
                onChange={(e) => setCompCompanyId1(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50 text-slate-700 cursor-pointer"
                required
              >
                <option value="">-- Choose Corporate Anchor 1 --</option>
                {store.companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.ticker})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Benchmark Partner</label>
              <select 
                value={compCompanyId2}
                onChange={(e) => setCompCompanyId2(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:border-primary/50 text-slate-700 cursor-pointer"
                required
              >
                <option value="">-- Choose Corporate Anchor 2 --</option>
                {store.companies.map((c) => (
                  <option key={c.id} value={c.id} disabled={c.id === compCompanyId1}>{c.name} ({c.ticker})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target Notes / Objectives</label>
              <textarea 
                rows={2}
                placeholder="Enter custom comparison notes (e.g., Cross-border margin study, industry growth parity)..."
                value={comparisonNotes}
                onChange={(e) => setComparisonNotes(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50 text-slate-700 font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary text-white text-xs font-extrabold rounded-xl hover:bg-primary-light transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/10"
            >
              <Plus size={14} />
              <span>Generate Benchmark Card</span>
            </button>
          </form>

          {/* Quick Info Box */}
          <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed font-semibold">
            <Info size={14} className="text-secondary shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500">
              Saved comparisons evaluate key metrics such as Operating Profit Margin, Return on Equity (ROE), Debt-to-Equity structures, and overall Net earnings directly in comparative matrices.
            </p>
          </div>
        </div>

      </div>

      {/* Comparisons Deck Panel Listing (Full-width grid) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ArrowLeftRight size={16} className="text-primary" />
            Pairwise Benchmark Deck
          </h3>
          <p className="text-xs text-slate-400">Archived performance dashboards comparing margins, gearing, and revenue yield</p>
        </div>

        {store.comparisons.length === 0 ? (
          <div className="bg-white p-12 border border-slate-100 rounded-3xl text-center text-slate-400 space-y-2">
            <p className="text-xs font-bold text-slate-400">No active benchmark cards are loaded</p>
            <p className="text-[10px] text-slate-350">Choose two companies from your archival storage directory above to create one instantly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {store.comparisons.map((item) => (
              <div 
                key={item.id}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 hover:shadow-md transition-shadow relative group"
              >
                {/* Delete Benchmark card */}
                <button 
                  onClick={() => handleRemoveComparison(item.id)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors p-1"
                  title="Remove comparison"
                >
                  <Trash2 size={13} />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Benchmark Index</span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.comparedAt}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-850 mt-2">
                    {item.company1.name} vs {item.company2.name}
                  </h4>
                  {item.notes && (
                    <p className="text-[11px] text-slate-400 mt-1 font-medium italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                {/* Grid Comparison Table */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
                  <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-100 font-black text-slate-500 text-[10px] tracking-wider uppercase p-2.5">
                    <span>Performance</span>
                    <span className="text-right truncate">{item.company1.ticker}</span>
                    <span className="text-right truncate">{item.company2.ticker}</span>
                  </div>
                  
                  <div className="divide-y divide-slate-100 font-bold">
                    {/* row 1 */}
                    <div className="grid grid-cols-3 p-2.5">
                      <span className="text-slate-400 font-medium">Operating Margin</span>
                      <span className="text-right text-slate-700">{item.company1.operatingMargin.toFixed(1)}%</span>
                      <span className="text-right text-slate-700">{item.company2.operatingMargin.toFixed(1)}%</span>
                    </div>
                    {/* row 2 */}
                    <div className="grid grid-cols-3 p-2.5">
                      <span className="text-slate-400 font-medium">Return on Equity</span>
                      <span className="text-right text-slate-700">{item.company1.roe.toFixed(1)}%</span>
                      <span className="text-right text-slate-700">{item.company2.roe.toFixed(1)}%</span>
                    </div>
                    {/* row 3 */}
                    <div className="grid grid-cols-3 p-2.5">
                      <span className="text-slate-400 font-medium">Debt to Equity</span>
                      <span className="text-right text-slate-700">{item.company1.debtToEquityRatio.toFixed(1)}%</span>
                      <span className="text-right text-slate-700">{item.company2.debtToEquityRatio.toFixed(1)}%</span>
                    </div>
                    {/* row 4 */}
                    <div className="grid grid-cols-3 p-2.5">
                      <span className="text-slate-400 font-medium">Net Profit Amount</span>
                      <span className="text-right text-emerald-600">${(item.company1.netIncome / 1000000).toFixed(0)}M</span>
                      <span className="text-right text-emerald-600">${(item.company2.netIncome / 1000000).toFixed(0)}M</span>
                    </div>
                  </div>
                </div>

                {/* Compare overview text recommendation lines */}
                <div className="text-[10px] text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-semibold leading-relaxed flex items-start gap-2">
                  <Info size={12} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    {item.company1.roe > item.company2.roe ? (
                      <span>{item.company1.name} shows enhanced internal growth efficiency margins (ROE: {item.company1.roe.toFixed(1)}% vs {item.company2.roe.toFixed(1)}%). </span>
                    ) : (
                      <span>{item.company2.name} achieves superior returns on shareholder capitalization assets (ROE: {item.company2.roe.toFixed(1)}% vs {item.company1.roe.toFixed(1)}%). </span>
                    )}
                    {item.company1.debtToEquityRatio < item.company2.debtToEquityRatio ? (
                      <span>In terms of risk safety, {item.company1.name} is characterized by healthier low leverage scaling.</span>
                    ) : (
                      <span>From a balance point, {item.company2.name} boasts less vulnerable debt to equity gearing ratios.</span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
