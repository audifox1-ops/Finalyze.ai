/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  UploadCloud, 
  FileText, 
  FileSpreadsheet, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  CheckCircle2,
  FileCheck,
  Link,
  FolderOpen,
  Globe,
  Settings,
  Search,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Cpu,
  TrendingUp,
  Clipboard,
  Camera
} from "lucide-react";
import { UploadedFile } from "../types";
import { cn } from "../lib/utils";
import { useTranslation } from "../lib/i18n";
import { fetchFinancialData, formatFmpDataToText, getSimulatedFmpData } from "../lib/fetchFinancialData";

interface Props {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

interface SearchStockItem {
  name: string;
  ticker: string;
  chosung: string;
}

// Major Korean and Global publicly traded stock presets for ultra-fast local matching
const STOCK_DATABASE: SearchStockItem[] = [
  { name: "삼성전자", ticker: "005930.KS", chosung: "ㅅㅅㅈㅈ" },
  { name: "삼성SDI", ticker: "006400.KS", chosung: "ㅅㅅㅅㄷㅇ" },
  { name: "삼성바이오로직스", ticker: "207940.KS", chosung: "ㅅㅅㅂㅇㄹㅈㅅ" },
  { name: "삼성물산", ticker: "028260.KS", chosung: "ㅅㅅㅁㅅ" },
  { name: "삼성전기", ticker: "009150.KS", chosung: "ㅅㅅㅈㄱ" },
  { name: "삼성중공업", ticker: "010140.KS", chosung: "ㅅㅅㅈㄱㅇ" },
  { name: "삼성생명", ticker: "032830.KS", chosung: "ㅅㅅㅅㅁ" },
  { name: "SK하이닉스", ticker: "000660.KS", chosung: "ㅅㅋㅎㅇㄴㅅ" },
  { name: "SK텔레콤", ticker: "017670.KS", chosung: "ㅅㅋㅌㄹㅋ" },
  { name: "SK이노베이션", ticker: "096770.KS", chosung: "ㅅㅋㅇㄴㅂㅇㅅ" },
  { name: "SK스퀘어", ticker: "402340.KS", chosung: "ㅅㅋㅅㅋㅇ" },
  { name: "현대자동차", ticker: "005380.KS", chosung: "ㅎㄷㅈㄷㅊ" },
  { name: "현대모비스", ticker: "012330.KS", chosung: "ㅎㄷㅁㅂㅅ" },
  { name: "현대제철", ticker: "004020.KS", chosung: "ㅎㄷㅈㅊ" },
  { name: "현대건설", ticker: "000720.KS", chosung: "ㅎㄷㄱㅅ" },
  { name: "현대글로비스", ticker: "086280.KS", chosung: "ㅎㄷㄱㄹㅂㅅ" },
  { name: "현대중공업", ticker: "329180.KS", chosung: "ㅎㄷㅈㄱㅇ" },
  { name: "네이버", ticker: "035420.KS", chosung: "ㄴㅇㅂ" },
  { name: "카카오", ticker: "035720.KS", chosung: "ㅋㅋㅇ" },
  { name: "카카오뱅크", ticker: "323410.KS", chosung: "ㅋㅋㅇㅂㅋ" },
  { name: "카카오페이", ticker: "377300.KS", chosung: "ㅋㅋㅇㅍㅇ" },
  { name: "LG에너지솔루션", ticker: "373220.KS", chosung: "ㄹㅈㅇㄴㅈㅅㄹㅅ" },
  { name: "LG화학", ticker: "051910.KS", chosung: "ㄹㅈㅎㅎ" },
  { name: "LG전자", ticker: "066570.KS", chosung: "ㄹㅈㅈㅈ" },
  { name: "LG디스플레이", ticker: "034220.KS", chosung: "ㄹㅈㄷㅅㅍㄹㅇ" },
  { name: "LG생활건강", ticker: "051900.KS", chosung: "ㄹㅈㅅㅎㄱㄱ" },
  { name: "LG유플러스", ticker: "032640.KS", chosung: "ㄹㅈㅇㅍㄹㅅ" },
  { name: "POSCO홀딩스", ticker: "005490.KS", chosung: "ㅍㅅㅋㅎㄷㅅ" },
  { name: "포스코퓨처엠", ticker: "003670.KS", chosung: "ㅍㅅㅋㅍㅊㅇ" },
  { name: "포스코인터내셔널", ticker: "047050.KS", chosung: "ㅍㅅㅋㅇㅌㄴㅅㄴ" },
  { name: "셀트리온", ticker: "068270.KS", chosung: "ㅅㅌㄹㅇ" },
  { name: "셀트리온제약", ticker: "068760.KS", chosung: "ㅅㅌㄹㅇㅈㅇ" },
  { name: "기아", ticker: "000270.KS", chosung: "ㄱㅇ" },
  { name: "신한지주", ticker: "055550.KS", chosung: "ㅅㅎㅈㅈ" },
  { name: "KB금융", ticker: "105560.KS", chosung: "ㅋㅂㄱㅇ" },
  { name: "하나금융지주", ticker: "086790.KS", chosung: "ㅎㄴㄱㅇㅈㅈ" },
  { name: "우리금융지주", ticker: "316140.KS", chosung: "ㅇㄹㄱㅇㅈㅈ" },
  { name: "기업은행", ticker: "024110.KS", chosung: "ㄱㅇㅇㅎ" },
  { name: "한국전력", ticker: "015760.KS", chosung: "ㅎㄱㅈㄹ" },
  { name: "한국조선해양", ticker: "009540.KS", chosung: "ㅎㄱㅈㅅㅎㅇ" },
  { name: "한국금융지주", ticker: "071050.KS", chosung: "ㅎㄱㄱㅇㅈㅈ" },
  { name: "HMM", ticker: "011200.KS", chosung: "ㅎㅇㅇ" },
  { name: "크래프톤", ticker: "259960.KS", chosung: "ㅋㄹㅍㅌ" },
  { name: "넷마블", ticker: "251270.KS", chosung: "ㄴㅁㅂ" },
  { name: "엔씨소프트", ticker: "036570.KS", chosung: "ㅇㅆㅅㅍㅌ" },
  { name: "메리츠금융지주", ticker: "138040.KS", chosung: "ㅁㄹㅊㄱㅇㅈㅈ" },
  { name: "두산에너빌리티", ticker: "034020.KS", chosung: "ㄷㅅㅇㄴㅂㄹㅌ" },
  { name: "두산밥캣", ticker: "241560.KS", chosung: "ㄷㅅㅂㅋ" },
  { name: "한화오션", ticker: "042660.KS", chosung: "ㅎㅎㅇㅅ" },
  { name: "한화솔루션", ticker: "009830.KS", chosung: "ㅎㅎㅅㄹㅅ" },
  { name: "한화에어로스페이스", ticker: "012450.KS", chosung: "ㅎㅎㅇㅇㄹㅅㅍㅇㅅ" },
  { name: "삼성증권", ticker: "016360.KS", chosung: "ㅅㅅㅈㄱ" },
  { name: "미래에셋증권", ticker: "006800.KS", chosung: "ㅁㄹㅇㅇㅅㅈㄱ" },
  { name: "NH투자증권", ticker: "005940.KS", chosung: "ㄴㅎㅌㅈㅈㄱ" },
  { name: "키움증권", ticker: "039490.KS", chosung: "ㅋㅇㅈㄱ" },
  { name: "에코프로", ticker: "038390.KQ", chosung: "ㅇㅋㅍㄹ" },
  { name: "에코프로비엠", ticker: "247540.KQ", chosung: "ㅇㅋㅍㄹㅂㅇ" },
  { name: "에코프로머티", ticker: "450080.KS", chosung: "ㅇㅋㅍㄹㅁㅌ" },
  { name: "HLB", ticker: "028300.KQ", chosung: "ㅇㅇㅊㅂ" },
  { name: "알테오젠", ticker: "196170.KQ", chosung: "ㅇㅌㅇㅈ" },
  { name: "S-Oil", ticker: "010950.KS", chosung: "ㅇㅅㅇㅇ" },
  { name: "대한항공", ticker: "003490.KS", chosung: "ㄷㅎㅎㄱ" },
  { name: "아시아나항공", ticker: "020560.KS", chosung: "ㅇㅅㅇㄴㅎㄱ" },
  { name: "이마트", ticker: "139480.KS", chosung: "ㅇㅁㅌ" },
  { name: "롯데쇼핑", ticker: "023530.KS", chosung: "ㄹㄷㅅㅍ" },
  { name: "CJ제일제당", ticker: "097950.KS", chosung: "ㅆㅈㅈㅇㅈㄷ" },
  { name: "오뚜기", ticker: "007310.KS", chosung: "ㅇㄸㄱ" },
  { name: "농심", ticker: "004370.KS", chosung: "ㄴㅅ" },
  { name: "유한양행", ticker: "000100.KS", chosung: "ㅇㅎㅇㅎ" },
  { name: "한미약품", ticker: "128940.KS", chosung: "ㅎㅁㅇㅍ" },
  { name: "대웅제약", ticker: "069620.KS", chosung: "ㄷㅇㅈㅇ" },
  { name: "KCC", ticker: "002380.KS", chosung: "ㅋㅆㅆ" },
  { name: "Apple", ticker: "AAPL", chosung: "ㅇㅍ" },
  { name: "Microsoft", ticker: "MSFT", chosung: "ㅁㅇㅋㄹㅅㅍㅌ" },
  { name: "Google", ticker: "GOOGL", chosung: "ㄱㄱ" },
  { name: "Amazon", ticker: "AMZN", chosung: "ㅇㅁㅈ" },
  { name: "Nvidia", ticker: "NVDA", chosung: "ㅇㅂㄷㅇ" },
  { name: "Meta Platforms", ticker: "META", chosung: "ㅁㅌ" },
  { name: "Tesla", ticker: "TSLA", chosung: "ㅌㅅㄹ" },
  { name: "Netflix", ticker: "NFLX", chosung: "ㄴㅍㄹㅅ" }
];

// Extractor helper for Korean initial consonants (chosung)
function getChosung(text: string): string {
  const CHOSUNG_LIST = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
  ];
  let res = "";
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i) - 44032;
    if (code > -1 && code < 11172) {
      res += CHOSUNG_LIST[Math.floor(code / 588)];
    } else {
      res += text.charAt(i);
    }
  }
  return res.toLowerCase();
}

export const UploadForm: React.FC<Props> = ({ onAnalyze, isAnalyzing }) => {
  const { t, language } = useTranslation();
  
  // States for general layout
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchStockItem[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Advanced expansion panels
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "text">("upload");
  const [dragActive, setDragActive] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  
  // Settings / Keys
  const [customFmpKey, setCustomFmpKey] = useState("");
  const [isFetchingTicker, setIsFetchingTicker] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Synchronize environmental FMP key
  useEffect(() => {
    const key = (import.meta as any).env?.VITE_FMP_API_KEY || "";
    setCustomFmpKey(key);
  }, []);

  // Debouncing effect for search input (250ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Click outside listener to dismiss the auto-complete dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Unified Autocomplete Logic (Local instant lookup + Server-side fallback search using Gemini AI)
  useEffect(() => {
    const trimmed = debouncedSearchQuery.trim().toLowerCase();
    if (!trimmed) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // 1. Client-side Instant Lookup
    const inputChosung = getChosung(trimmed);
    const localFiltered = STOCK_DATABASE.filter(item => {
      const nameLower = item.name.toLowerCase();
      const tickerLower = item.ticker.toLowerCase();
      const itemChosung = item.chosung.toLowerCase();
      
      return (
        nameLower.includes(trimmed) ||
        tickerLower.includes(trimmed) ||
        itemChosung.includes(trimmed) ||
        itemChosung.includes(inputChosung)
      );
    });

    setSearchResults(localFiltered);
    setShowDropdown(true);
    setSelectedSearchIndex(-1);

    // 2. Fetch from Backend Search Endpoint (AI matching capability for custom searches)
    const fetchApiSupplementary = async () => {
      setIsSearchingApi(true);
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: trimmed })
        });
        
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setSearchResults(prev => {
              const merged = [...prev];
              json.data.forEach((backendObj: { name: string; ticker: string }) => {
                if (!merged.some(item => item.ticker === backendObj.ticker)) {
                  merged.push({
                    name: backendObj.name,
                    ticker: backendObj.ticker,
                    chosung: getChosung(backendObj.name)
                  });
                }
              });
              return merged.slice(0, 8); // Display at most 8 items
            });
          }
        } else {
          console.warn("AI supplementary lookup was not successful or returned non-JSON. Status:", res.status);
        }
      } catch (err) {
        console.warn("AI supplementary lookup error:", err);
      } finally {
        setIsSearchingApi(false);
      }
    };

    fetchApiSupplementary();
  }, [debouncedSearchQuery]);

  const triggerNotification = (text: string) => {
    setToastText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Keyboard navigation inside dropdown list
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSearchIndex(prev => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSearchIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSearchIndex >= 0 && selectedSearchIndex < searchResults.length) {
        handleStockSelect(searchResults[selectedSearchIndex]);
      } else {
        // Trigger generic custom fetch on entered text if nothing is selected
        handleTickerFetch(searchQuery);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      searchInputRef.current?.blur();
    }
  };

  // Select stock from dropdown list or direct search
  const handleStockSelect = (stockItem: SearchStockItem) => {
    setSearchQuery(stockItem.name);
    setShowDropdown(false);
    handleTickerFetch(stockItem.ticker);
  };

  // Common Stock Ticker Ingestion & Process Flow
  const handleTickerFetch = async (targetTicker: string) => {
    if (!targetTicker.trim()) return;
    
    let resolvedTicker = targetTicker.trim().toUpperCase();
    
    // Check if the input contains Korean characters to resolve to a valid ticker first
    const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(targetTicker);
    
    if (hasKorean) {
      const match = STOCK_DATABASE.find(
        item => item.name.toLowerCase() === targetTicker.trim().toLowerCase() ||
                item.name.replace(/\s+/g, '').toLowerCase() === targetTicker.trim().replace(/\s+/g, '').toLowerCase()
      ) || searchResults.find(
        item => item.name.toLowerCase() === targetTicker.trim().toLowerCase()
      ) || searchResults[0] || STOCK_DATABASE.find(
        item => item.name.toLowerCase().includes(targetTicker.trim().toLowerCase())
      );
      
      if (match) {
        resolvedTicker = match.ticker;
        triggerNotification(
          language === "ko"
            ? `'${targetTicker}'(을)를 종목코드 '${resolvedTicker}'(으)로 자동으로 매칭하여 데이터를 비교분석합니다.`
            : `Automatically resolved '${targetTicker}' to ticker '${resolvedTicker}'.`
        );
      } else {
        const koMsg = `'${targetTicker}'에 매칭되는 종목 코드를 찾을 수 없습니다. 자동완성 목록에서 선택하거나, 영문 티커(예: AAPL) 또는 하단의 돋보기 검색을 이용해 주세요.`;
        const enMsg = `Could not resolve '${targetTicker}' to a valid ticker. Please select from autocomplete or enter a precise symbol.`;
        setErrorMessage(language === "ko" ? koMsg : enMsg);
        return;
      }
    }

    setIsFetchingTicker(true);
    setErrorMessage(null);

    try {
      if (customFmpKey.trim() && customFmpKey.trim() !== "") {
        // Live Fetch from FMP API
        const data = await fetchFinancialData(resolvedTicker, customFmpKey.trim());
        const formattedText = formatFmpDataToText(data);

        triggerNotification(`${resolvedTicker} FMP API data retrieved! Calling AI analysis system...`);
        onAnalyze(formattedText);
      } else {
        // High-Fidelity Local Simulation Fallback with high premium UX
        triggerNotification(
          language === "ko" 
            ? `주의: 현재 FMP API KEY가 등록되지 않아 가상 시뮬레이션 데이터를 전송합니다.` 
            : `FMP Key is empty. Loading high-fidelity historical simulated ledger for ticker ${resolvedTicker}...`
        );

        const simResult = getSimulatedFmpData(resolvedTicker);
        const formattedSimText = formatFmpDataToText(simResult);
        
        onAnalyze(formattedSimText);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to retrieve stock ticker parameters.");
    } finally {
      setIsFetchingTicker(false);
    }
  };

  // File drag-and-drop mechanics
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      Array.from(e.dataTransfer.files).forEach(f => processFile(f as File));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      Array.from(e.target.files).forEach(f => processFile(f as File));
    }
  };

  // Process manual files loaded locally
  const processFile = (file: File) => {
    setErrorMessage(null);
    const validExtensions = ["pdf", "xlsx", "xls", "csv", "txt"];
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!ext || !validExtensions.includes(ext)) {
      setErrorMessage(`${file.name}: ${t("upload.parseEmptyError")}`);
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage(`${file.name}: File size exceeds limit (20MB).`);
      return;
    }

    const newFileId = Math.random().toString(36).substring(7);
    const newFile: UploadedFile = {
      id: newFileId,
      name: file.name,
      size: file.size,
      type: ext,
      source: "local",
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "uploading",
      progress: 0,
      extractedText: ""
    };

    setFiles(prev => [...prev, newFile]);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string || `Raw processed contents of file ${file.name}`;
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        setFiles(prev => 
          prev.map(f => 
            f.id === newFileId 
              ? { ...f, progress, status: progress >= 100 ? "success" : "uploading", extractedText: text } 
              : f
          )
        );
        if (progress >= 100) {
          clearInterval(interval);
          triggerNotification(`${file.name} successfully loaded in Workspace context!`);
          onAnalyze(text);
        }
      }, 100);
    };

    reader.readAsText(file);
  };

  // Manual submit of raw financial or dimension specs
  const handlePasteSubmit = () => {
    if (!pasteText.trim()) return;
    onAnalyze(pasteText);
  };

  return (
    <div id="forging-master-uploader-container" className="w-full max-w-4xl mx-auto space-y-8 relative py-8 px-4 sm:px-6">
      
      {/* Toast Notification */}
      {showToast && (
        <div id="uploader-floating-notification" className="fixed top-8 left-1/2 -translate-x-1/2 z-55 bg-slate-900 border border-slate-700 text-white text-xs font-semibold px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={15} className="text-[#3b82f6] shrink-0" />
          <span className="leading-normal text-slate-100">{toastText}</span>
        </div>
      )}

      {/* Main Title Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div id="app-badge" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-black tracking-wider uppercase border border-slate-200 shadow-sm">
          <Cpu className="text-slate-600 animate-pulse" size={13} />
          <span>Next-Gen Forging Intelligence & Financials</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
          {t("common.appTitle")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          {t("common.description")}
        </p>
      </div>

      {/* RENDER SECTION: Prominent Search Engine (Google Style Search Bar) */}
      <div className="relative max-w-2xl mx-auto space-y-4">
        
        {/* Giant Rounded Input Container with Shadow */}
        <div 
          ref={dropdownRef}
          className="relative group w-full bg-white rounded-3xl border border-slate-300 shadow-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-[#374151] focus-within:border-transparent"
        >
          {/* Glass Inner Flex Bar */}
          <div className="flex items-center pl-5 pr-4 py-4">
            <Search className="text-slate-400 mr-3 shrink-0" size={24} />
            <input 
              ref={searchInputRef}
              id="google-master-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder={t("upload.searchPlaceholder")}
              className="flex-1 text-base sm:text-lg font-black text-slate-800 outline-none bg-transparent placeholder:text-slate-400 placeholder:font-medium uppercase"
              disabled={isAnalyzing || isFetchingTicker}
            />
            
            {/* Realtime API Scanning status spinner */}
            {(isSearchingApi || isFetchingTicker) && (
              <Loader2 size={18} className="animate-spin text-slate-400 justify-self-end mr-2" />
            )}
          </div>

          {/* AUTOCOMPLETE SUGGESTIONS DROPDOWN PANEL */}
          {showDropdown && searchQuery.trim().length > 0 && (
            <div 
              id="search-autocomplete-dropdown-panel" 
              className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 max-h-[380px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="p-2 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  {language === "ko" ? "실시간 연관 검색어" : "Realtime Index Matches"}
                </span>
                <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  {searchResults.length} Match
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-semibold flex flex-col items-center justify-center gap-2">
                  <AlertCircle size={20} className="text-slate-300" />
                  <span>{t("upload.noResults")}</span>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {searchResults.map((stock, idx) => (
                    <div
                      key={stock.ticker}
                      onClick={() => handleStockSelect(stock)}
                      onMouseEnter={() => setSelectedSearchIndex(idx)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3.5 cursor-pointer transition-colors text-left",
                        selectedSearchIndex === idx 
                          ? "bg-slate-100" 
                          : "bg-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <TrendingUp size={14} className={cn("text-[#3b82f6]", selectedSearchIndex === idx ? "animate-bounce" : "")} />
                        <div>
                          <p className="font-extrabold text-sm text-slate-800 tracking-wide">{stock.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-tight">{getChosung(stock.name)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold font-mono px-2 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                          {stock.ticker}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic description helper of search guidelines */}
        <p className="text-center text-[11px] text-slate-400 font-medium max-w-xl mx-auto px-2">
          {t("upload.searchGuide")}
        </p>
      </div>

      {/* Preset Stocks Quick Link Pills */}
      <div id="popular-suggestions-wrap" className="max-w-xl mx-auto flex flex-wrap gap-2 justify-center py-2 animate-in fade-in duration-300">
        {[
          { name: "삼성전자", symbol: "005930.KS" },
          { name: "Apple", symbol: "AAPL" },
          { name: "Microsoft", symbol: "MSFT" },
          { name: "Tesla", symbol: "TSLA" },
          { name: "SK하이닉스", symbol: "000660.KS" }
        ].map((stock) => (
          <button
            key={stock.symbol}
            onClick={() => handleTickerFetch(stock.symbol)}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-900 hover:text-white text-slate-700 rounded-xl border border-slate-200 transition-all font-extrabold text-[11px] flex items-center gap-1 cursor-pointer hover:shadow-md hover:scale-[1.03] duration-200"
          >
            <span className="opacity-75">{stock.name}</span>
            <span className="font-mono tracking-tight text-[10px] bg-slate-50 border border-slate-100 px-1 py-0.5 rounded text-slate-500 group-hover:text-white leading-none">
              {stock.symbol}
            </span>
          </button>
        ))}
      </div>

      {/* API Key settings panel */}
      <div className="max-w-2xl mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <p className="text-[10px] font-black text-slate-400 tracking-wider uppercase">FMP API Settings</p>
          <p className="text-[11px] text-slate-500 leading-tight">가장 정확한 미동종 기업 가공 마진 및 제표 로딩을 위해 API 키를 마운트 하십시오.</p>
        </div>
        <div className="w-full md:w-auto flex items-center gap-2">
          <input 
            type="password" 
            value={customFmpKey}
            onChange={(e) => setCustomFmpKey(e.target.value)}
            placeholder="FMP API Key (VITE_FMP_API_KEY)"
            className="w-full md:w-56 text-xs font-mono px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 bg-white"
          />
        </div>
      </div>

      {errorMessage && (
        <div id="general-search-error-info" className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2 font-bold max-w-2xl mx-auto">
          <AlertCircle size={15} className="shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* TAB CONTROL ACCORDION FOR ADVANCED UPLOADING AND COPY PASTING */}
      <div id="accordion-toggle-area" className="max-w-2xl mx-auto pt-4">
        <button
          onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer font-bold text-xs shadow-xs-outline"
        >
          {showAdvancedPanel ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          <span>{t("upload.orUploadFile")}</span>
        </button>

        {showAdvancedPanel && (
          <div className="mt-4 p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-xl space-y-4 animate-in fade-in duration-300">
            {/* Dynamic tabs */}
            <div className="flex border-b border-slate-100 gap-4">
              <button
                onClick={() => setActiveTab("upload")}
                className={cn(
                  "pb-2 text-xs font-extrabold tracking-wide cursor-pointer flex items-center gap-1.5",
                  activeTab === "upload"
                    ? "border-b-2 border-slate-800 text-slate-800"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <UploadCloud size={13} />
                <span>{t("upload.tabUpload")}</span>
              </button>
              <button
                onClick={() => setActiveTab("text")}
                className={cn(
                  "pb-2 text-xs font-extrabold tracking-wide cursor-pointer flex items-center gap-1.5",
                  activeTab === "text"
                    ? "border-b-2 border-slate-800 text-slate-800"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <FileText size={13} />
                <span>{t("upload.pasteLabel")}</span>
              </button>
            </div>

            {/* Sub content 1: Document Upload */}
            {activeTab === "upload" ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[160px]",
                  dragActive 
                    ? "border-[#4b5563] bg-slate-50" 
                    : "border-slate-200 hover:border-slate-400 hover:bg-slate-50/50"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <UploadCloud size={28} className="text-slate-400 mb-2" />
                <p className="font-extrabold text-slate-800 text-xs sm:text-sm text-center">
                  {dragActive ? "파일을 이제 놓으세요" : t("upload.dragDrop")}
                </p>
                <p className="text-[10px] text-slate-400 text-center mt-1">
                  {t("upload.fileLimit")}
                </p>
              </div>
            ) : (
              /* Sub content 2: Core Text Paste Area */
              <div className="space-y-3">
                <textarea
                  className="w-full h-36 p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none placeholder:text-slate-400"
                  placeholder={t("upload.pastePlaceholder")}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  disabled={isAnalyzing}
                />
                <button
                  onClick={handlePasteSubmit}
                  disabled={isAnalyzing || !pasteText.trim()}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles size={13} />
                  <span>{t("upload.btnParse")}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive analyzed file lists status */}
      {files.length > 0 && (
        <div className="max-w-2xl mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-left">
          <p className="text-[10px] font-black text-slate-400 tracking-wider uppercase">현재 업로드 및 마운트 완료 목록</p>
          <div className="space-y-1.5">
            {files.map(f => (
              <div key={f.id} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-slate-500" />
                  <span className="text-xs font-bold text-slate-800">{f.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase">
                    ACTIVE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
