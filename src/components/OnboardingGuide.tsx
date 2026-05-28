/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  UploadCloud, 
  Brain, 
  LayoutDashboard, 
  Sparkles, 
  FolderOpen, 
  Globe, 
  Camera, 
  Clipboard,
  CheckCircle2,
  TrendingUp,
  Award
} from "lucide-react";
import { useTranslation } from "../lib/i18n";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Translations dictionary specifically for the Onboarding Guide across 5 languages
const guideTranslations: Record<string, {
  skip: string;
  prev: string;
  next: string;
  start: string;
  ofStep: string;
  steps: {
    title: string;
    subtitle: string;
    badge: string;
    highlights: string[];
  }[];
}> = {
  ko: {
    skip: "건너뛰기",
    prev: "이전",
    next: "다음",
    start: "시작하기",
    ofStep: "스텝",
    steps: [
      {
        badge: "스텝 1",
        title: "다양한 데이터 업로드 환경 지원",
        subtitle: "단조 공정 지표 및 다양한 형식의 재무 파일을 스마트하고 다각적인 방법으로 입수(Ingest)합니다.",
        highlights: [
          "로컬 파일 드래그 & 드롭 (PDF, Excel, CSV, TXT 완벽 지원)",
          "Google Drive 연동을 통해 클라우드 문서를 실시간 동기화",
          "공개 웹 주소(URL)에서 즉시 문서를 내려받는 전용 인제스트 모드",
          "모바일 카메라 / 모니터 화면 캡처 특화형 고정밀 OCR 스캔",
          "클립보드 데이터 복사(Ctrl+V) 자동 인식 가속화"
        ]
      },
      {
        badge: "스텝 2",
        title: "AI 기반 심층 비율 진단 및 의견",
        subtitle: "원자재 치수, 가공 공차 분석부터 듀퐁 분해 방식 핵심 재무 비율 도출까지 AI가 심층 분석합니다.",
        highlights: [
          "풍부한 도메인 지식을 갖춘 AI 모델 기반 고성능 휴리스틱 추출 엔진",
          "수익성, 안전성, 상호 비교 지수를 자동으로 매핑 및 재구성",
          "복잡한 재무 비율 분해 및 재정적 강점/약점 직관적 구조화",
          "공정 사양 및 중량 계산 분석에 따른 정교한 종합 가이드라인 제공"
        ]
      },
      {
        badge: "스텝 3",
        title: "한눈에 보는 대시보드 & 컴패니언 뷰",
        subtitle: "계산된 핵심 성과 지표(KPI)와 역동적인 차트를 통해 기업의 현황을 입체적으로 가시화합니다.",
        highlights: [
          "주요 재무 추이를 쉽게 관찰할 수 있는 고해상도 대시보드 가시성",
          "과거 이력 저장 및 상호 피어(Peer) 벤치마크 기업 관리 분석 패널",
          "공정 최적화 및 타사 가공 변형 비율을 한눈에 비교하는 차트 툴",
          "PDF/HTML 등 비즈니스 사양에 대응하는 완벽한 아카이빙 내보내기"
        ]
      }
    ]
  },
  en: {
    skip: "Skip Guide",
    prev: "Back",
    next: "Next",
    start: "Get Started",
    ofStep: "Step",
    steps: [
      {
        badge: "STEP 1",
        title: "Multichannel Ingestion Pipeline",
        subtitle: "Ingest financial sheets or dimensional specifications from five independent sources effortlessly.",
        highlights: [
          "Fast file uploads (CSV, PDF, Excel, & TXT) with smooth responsive drag & drop",
          "Google Drive integration to sync business cloud datasheet ledger in real-time",
          "Web Ingest from public URLs to pull materials configuration data securely",
          "Mobile Desk OCR Capture scan reading mechanical specs boundaries",
          "Deep automatic Clipboard background monitoring with shortcut (Ctrl+V) listener"
        ]
      },
      {
        badge: "STEP 2",
        title: "AI Deep Decomposition Strategy",
        subtitle: "Drive robust DuPont modeling, advanced ratio breakdown, and deep manufacturing analysis automatically.",
        highlights: [
          "Smart AI Semantic parser turning unformatted ledger to structured dataset",
          "Detailed profitability metrics mapping with custom diagnostic parameters",
          "DuPont return decomposition for strategic strengths and liquidity warnings",
          "Immediate actionable investment feedback based on domain-focused heuristics"
        ]
      },
      {
        badge: "STEP 3",
        title: "Dynamic Visual Companion",
        subtitle: "View compiled mechanical metadata and clean ledger trends side-by-side using unified dashboard boards.",
        highlights: [
          "Modern interactive charting with responsive grids styling",
          "Peer benchmark compare matrix panel tracking historic metrics archives",
          "Deep dynamic chart indicators analyzing revenue patterns & margin splits",
          "Flexible local persist storage for rapid refresh and offline accessibility"
        ]
      }
    ]
  },
  ja: {
    skip: "スキップ",
    prev: "戻る",
    next: "次へ",
    start: "使ってみる",
    ofStep: "ステップ",
    steps: [
      {
        badge: "ステップ 1",
        title: "多様なインポート環境をサポート",
        subtitle: "財務資料や加工仕様書テキストをスマートかつ多角的な方法で迅速に取り込みます。",
        highlights: [
          "ローカルファイルのドラッグ＆ドロップ（PDF、Excel、CSV、TXTに完全対応）",
          "Google ドライブ連携によるクラウド資料のリアルタイム同期機能",
          "公開Webアドレス（URL）からシステムが直接ダウンロードを取得可能",
          "カメラ・ウェブカム対応の高精度OCRスキャン読込インターフェース",
          "クリップボードの内容（Ctrl+V）を自動判別してお手軽インポート"
        ]
      },
      {
        badge: "ステップ 2",
        title: "AI高度解析モデルと詳細診断",
        subtitle: "許容誤差の自動計算からデュポン分解手法による財務健全性診断まで、AIが瞬時に導きます。",
        highlights: [
          "最適化されたAIモデルによる信頼性の高い数値プロファイリング抽出エンジン",
          "収益率、負債構造、レバレッジ等、比率要素のセキュア算出マッピング",
          "複合財務指標のブレイクダウン、強みと弱みのポイント整理",
          "単鍛造および材料重量・加工マージンの科学的な分析提案"
        ]
      },
      {
        badge: "ステップ 3",
        title: "直感的なダッシュボード＆履歴アセンブリ",
        subtitle: "算出された重要業績評価指標（KPI）と動的チャートにより、進捗や数値を統合管理します。",
        highlights: [
          "財務トレンドおよびマージン推移をビジュアル検証するクリーンコンポーネント",
          "過去ログのデータベース保存および他社比較・ピア分析管理パネル",
          "PDF/HTMLとして保存・共有するための包括的なビジネスレポート出力",
          "快適なダークアクセントUIとローカル永続ストレージによる即時アクセス"
        ]
      }
    ]
  },
  zh: {
    skip: "跳过",
    prev: "上一步",
    next: "下一步",
    start: "立即体验",
    ofStep: "步骤",
    steps: [
      {
        badge: "步骤 1",
        title: "多渠道智能数据汇入",
        subtitle: "支持五种高效方式将财务报表或锻造工件尺寸规格读取并同步到云端。",
        highlights: [
          "拖拽极速解析本地常用格式文档 (支持 PDF, Excel, CSV, TXT)",
          "轻松接入 Google Drive 实现云盘文件实时传输与双向关联",
          "提供专用 Web URL 参数直连提取外网规范文件",
          "高分辨率摄像及 OCR 重构框架, 自动化对齐公差规格",
          "全局剪切板快捷捕获 (Ctrl+V) 即时生成可分析指标"
        ]
      },
      {
        badge: "步骤 2",
        title: "AI 深度指标诊断与决策意见",
        subtitle: "通过杜邦分析模型深度解构经营周转，自适应预测工件重量与合金余量配置。",
        highlights: [
          "搭载大语言模型(LLM)自研启发式参数重组算力模块",
          "多维度评估周转健康度, 为高危指标自动触发警报",
          "结构化梳理企业内部护城河与安全裕度瓶颈",
          "一键获取贴近真实现场的锻造投资安全级别与工艺指导"
        ]
      },
      {
        badge: "步骤 3",
        title: "一站式全景数据看板",
        subtitle: "利用高响应速度的 Recharts 关联统计卡片，清晰呈现历史同比趋势。",
        highlights: [
          "支持财务大类、工艺毛坯配料等重点损耗比对的可视化直采",
          "配备多方案模拟对照的本地历史库及对标企业分析层",
          "极速生成完整 PDF 或 HTML 精装分析成果说明文件",
          "无锁零滞后离线存储, 全面护航敏感制造商业隐私"
        ]
      }
    ]
  },
  de: {
    skip: "Uberspringen",
    prev: "Zurück",
    next: "Weiter",
    start: "Loslegen",
    ofStep: "Schritt",
    steps: [
      {
        badge: "SCHRITT 1",
        title: "Multichannel Ingest-Pipeline",
        subtitle: "Importieren Sie Ihre GuV-Berichte oder Maßtoleranz-Dokumente flexibel über fünf Kanäle.",
        highlights: [
          "Lokaler Drag-and-Drop Uploader (Unterstützt PDF, Excel, CSV & TXT)",
          "Google Drive Anbindung für nahtlose Echtzeit-Cloud-Synchronisierung",
          "Direkter Web-Import über öffentliche URLs für maximalen Komfort",
          "Mobiles Kamera-/Bildschirm-Capture-OCR für Maßzeichnungen",
          "Automatische Erkennung kopierter Daten direkt aus der Zwischenablage (Strg+V)"
        ]
      },
      {
        badge: "SCHRITT 2",
        title: "AI-Gesamtdiagnose & DuPont-Modell",
        subtitle: "Extrahieren Sie betriebene Kennzahlen und berechnen Sie Soll-Toleranzen automatisiert via KI.",
        highlights: [
          "Leistungsstarker heuristischer Text-Parser mit tiefer Branchenexpertise",
          "Dynamisches Mapping wichtiger Kennzahlen (ROE, ROA, Cash Flow, Schuldenquote)",
          "Visuelle Analyse geschäftlicher Stärken und potenzieller Risikofaktoren",
          "Klare Handlungsempfehlungen nach modernsten Analysestandards"
        ]
      },
      {
        badge: "SCHRITT 3",
        title: "Zentralisierte Dashboard-Erlebnisse",
        subtitle: "Visualisieren Sie Ertragskurven und Materialgewichte über interaktive Infografiken.",
        highlights: [
          "Benutzerfreundliche Datenvisualisierung mit agilen Kennzahlenkarten",
          "Integrierte Firmenverwaltung zum Vergleichen historischer Datensätze",
          "Einfacher PDF- oder HTML-Export für Berichterstattungen",
          "Sichere, DSGVO-konforme lokale Speicherung direkt in Ihrem Browser"
        ]
      }
    ]
  }
};

export const OnboardingGuide: React.FC<Props> = ({ isOpen, onClose }) => {
  const { language } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  // Fallback to English if layout language not in dictionary
  const currentLang = guideTranslations[language] ? language : "en";
  const tr = guideTranslations[currentLang];
  const stepData = tr.steps[currentStep];

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCompleteOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem("finalyze_onboarding_completed", "true");
    onClose();
  };

  // Get illustrative decorations depending on the card step
  const renderStepIcon = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="relative w-full h-44 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-center overflow-hidden mb-6">
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:16px_16px]" />
            <div className="flex gap-4 items-center relative z-10">
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-14 h-14 bg-white shadow-md border border-slate-100 rounded-xl flex items-center justify-center text-primary"
              >
                <UploadCloud size={28} />
              </motion.div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-1.5">
                  <span className="p-1.5 bg-slate-100 rounded-lg text-slate-500 text-[10px]"><FolderOpen size={10} /></span>
                  <span className="p-1.5 bg-slate-100 rounded-lg text-slate-500 text-[10px]"><Globe size={10} /></span>
                  <span className="p-1.5 bg-slate-100 rounded-lg text-slate-500 text-[10px]"><Camera size={10} /></span>
                  <span className="p-1.5 bg-slate-100 rounded-lg text-slate-500 text-[10px]"><Clipboard size={10} /></span>
                </div>
                <div className="h-1.5 w-24 bg-primary/20 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ["0%", "100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 3, times: [0, 0.8, 1] }}
                    className="h-full bg-primary" 
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="relative w-full h-44 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-center overflow-hidden mb-6">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="flex flex-col items-center gap-3 relative z-10">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-16 h-16 bg-white shadow-lg border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600"
              >
                <Brain size={32} />
              </motion.div>
              <div className="flex gap-2 items-center text-indigo-900">
                <Sparkles size={11} className="text-amber-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">AI Analytical Inference</span>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="relative w-full h-44 bg-teal-50/70 border border-teal-100 rounded-2xl flex items-center justify-center overflow-hidden mb-6">
            <div className="absolute inset-x-0 bottom-0 h-16 bg-white/70 border-t border-teal-100 flex items-center justify-around px-4">
              <div className="h-2 w-10 bg-slate-200 rounded-full" />
              <div className="h-2 w-16 bg-primary/30 rounded-full" />
              <div className="h-3 w-14 bg-emerald-500/20 rounded-full border border-emerald-500/30" />
            </div>
            <div className="flex gap-4 items-end justify-center h-20 relative z-10 w-full px-12">
              <motion.div 
                initial={{ height: "10%" }} 
                animate={{ height: "45%" }} 
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 2, delay: 0 }}
                className="w-5 bg-teal-300 rounded-t-md" 
              />
              <motion.div 
                initial={{ height: "15%" }} 
                animate={{ height: "80%" }} 
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.8, delay: 0.3 }}
                className="w-5 bg-primary/80 rounded-t-md relative flex items-center justify-center" 
              >
                <TrendingUp size={10} className="text-white absolute -top-4" />
              </motion.div>
              <motion.div 
                initial={{ height: "10%" }} 
                animate={{ height: "55%" }} 
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.2, delay: 0.1 }}
                className="w-5 bg-emerald-400 rounded-t-md" 
              />
              <motion.div 
                initial={{ height: "20%" }} 
                animate={{ height: "90%" }} 
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5, delay: 0.5 }}
                className="w-5 bg-indigo-500 rounded-t-md" 
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCompleteOnboarding}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          id="onboarding-backdrop"
        />

        {/* Modal card content wrapper */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
          className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden border border-slate-100 z-10"
          id="onboarding-guide-modal"
        >
          {/* Top header containing Step Badge & Skip Option */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-2.5 py-0.5 bg-primary-bg text-primary text-[10px] font-black rounded-md tracking-wider uppercase">
              {stepData.badge}
            </span>
            <button 
              onClick={handleCompleteOnboarding}
              className="text-xs font-bold text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{tr.skip}</span>
              <X size={14} />
            </button>
          </div>

          {/* Graphical Demonstration Visual block */}
          {renderStepIcon()}

          {/* Stepped interactive content description */}
          <div className="space-y-3.5 mb-6">
            <h2 className="text-xl font-black text-text-primary tracking-tight leading-snug">
              {stepData.title}
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              {stepData.subtitle}
            </p>

            <ul className="space-y-2 pt-2 border-t border-slate-50">
              {stepData.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2 text-[11px] text-text-primary font-bold">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-normal">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Custom Footer navigation bar controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {/* Step numeric labels indicator dots */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map((sIndex) => (
                <button
                  key={sIndex}
                  onClick={() => setCurrentStep(sIndex)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    currentStep === sIndex ? "bg-primary w-4" : "bg-slate-200 hover:bg-slate-350"
                  }`}
                  aria-label={`Go to step ${sIndex + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} />
                  <span>{tr.prev}</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-primary/10 cursor-pointer"
              >
                <span>{currentStep === 2 ? tr.start : tr.next}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
