/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode, createElement } from "react";

export type Language = "ko" | "en" | "ja" | "zh" | "de";

export interface TranslationPack {
  common: {
    appTitle: string;
    description: string;
    manualSave: string;
    exportPdfHtml: string;
    localArchiveConnected: string;
    autoSynced: string;
    savedSuccessfully: string;
    cancel: string;
    submit: string;
    loading: string;
    delete: string;
    none: string;
    success: string;
    error: string;
  };
  nav: {
    dashboard: string;
    analysis: string;
    reports: string;
    feedbackLogs: string;
    runNewAnalysis: string;
    textPaste?: string;
  };
  upload: {
    title: string;
    subtitle: string;
    dragDrop: string;
    fileLimit: string;
    pastePlaceholder: string;
    orLabel: string;
    pasteLabel: string;
    btnUpload: string;
    btnParse: string;
    parsingLabel: string;
    parseEmptyError: string;
  };
  dashboard: {
    metricsTitle: string;
    kpiRevenue: string;
    kpiOperatingProfit: string;
    kpiNetIncome: string;
    kpiEbitda: string;
    kpiDebtEquity: string;
    kpiEquityRatio: string;
    kpiRoe: string;
    kpiRoa: string;
    kpiPer: string;
    kpiPbr: string;
    financialsSummary: string;
    strengthsLabel: string;
    weaknessesLabel: string;
    recommendationLabel: string;
    operatingMargin: string;
    netMargin: string;
    totalAssets: string;
    totalLiabilities: string;
    equity: string;
  };
  emptyState: {
    title: string;
    subtitle: string;
    button: string;
    step1: string;
    step1Desc: string;
    step2: string;
    step2Desc: string;
    step3: string;
    step3Desc: string;
  };
  feedback: {
    button: string;
    title: string;
    subtitle: string;
    appraisal: string;
    classification: string;
    bugReport: string;
    featureSuggest: string;
    praiseAccent: string;
    generalInquiry: string;
    summaryTitle: string;
    detailedDesc: string;
    screenshotLabel: string;
    submitBtn: string;
    historyTitle: string;
    historySubtitle: string;
    noLogs: string;
    clearLogs: string;
    toastSubmitted: string;
  };
}

export const translations: Record<Language, TranslationPack> = {
  ko: {
    common: {
      appTitle: "Finalyze.ai",
      description: "단조 공정 엔지니어를 위한 치수 인식, 여유치 자동 할당 및 중량 계산기",
      manualSave: "수동 저장하기 (Save)",
      exportPdfHtml: "PDF/HTML 내보내기",
      localArchiveConnected: "로컬 보관소 연동됨",
      autoSynced: "보안 자동 동기화 적용. 다양한 내보내기 형식을 아래에서 선택하세요.",
      savedSuccessfully: "성공적으로 로컬 보관소에 저장되었습니다!",
      cancel: "취소",
      submit: "제출하기",
      loading: "불러오는 중...",
      delete: "삭제",
      none: "없음",
      success: "성공",
      error: "오류"
    },
    nav: {
      dashboard: "대시보드",
      analysis: "AI 분석 인제스트",
      reports: "레포트 보관소",
      feedbackLogs: "피드백 로그",
      runNewAnalysis: "새로운 AI 분석 실행"
    },
    upload: {
      title: "재무제표 & 원자재 텍스트 업로드",
      subtitle: "재무 문건이나 가공 공차, 단조 재질 사양을 드래그하거나 직접 붙여넣으세요.",
      dragDrop: "재무제표 또는 공정 사양서 파일을 여기에 드래그앤드롭 하세요.",
      fileLimit: "PDF, 이미지, TXT 또는 CSV 지원 (최대 10MB)",
      pastePlaceholder: "여기에 원시 재무제표 텍스트, 가공 치수 테이블 또는 단조 공정 분석용 원자재 데이터를 직접 입력(Ctrl+V)하세요...",
      orLabel: "또는",
      pasteLabel: "원시 텍스트(Raw Text) 직접 입력",
      btnUpload: "파일 선택하기",
      btnParse: "AI 공정 및 재무 데이터 분석 시작",
      parsingLabel: "AI 모델이 재무제표의 치수, 공차 및 손익 구조를 계산하는 중...",
      parseEmptyError: "분석할 텍스트를 입력하거나 파일을 마운트하십시오."
    },
    dashboard: {
      metricsTitle: "핵심 기업 경영 재무 분석 지표",
      kpiRevenue: "매출액 (Revenue)",
      kpiOperatingProfit: "영업이익 (Operating Profit)",
      kpiNetIncome: "당기순이익 (Net Income)",
      kpiEbitda: "EBITDA (세전영업이익)",
      kpiDebtEquity: "부채비율 (Debt to Equity)",
      kpiEquityRatio: "자기자본비율 (Equity Ratio)",
      kpiRoe: "ROE (자기자본이익률)",
      kpiRoa: "ROA (총자산이익률)",
      kpiPer: "PER (주가수익비율)",
      kpiPbr: "PBR (주가순자산비율)",
      financialsSummary: "AI 종합 진단 및 의견",
      strengthsLabel: "핵심 강점 분석 (Strengths)",
      weaknessesLabel: "잠재적 취약점 (Weaknesses)",
      recommendationLabel: "엔지니어링 투자 의견 (Recommendation)",
      operatingMargin: "영업이익률",
      netMargin: "순이익률",
      totalAssets: "자산총계",
      totalLiabilities: "부채총계",
      equity: "자본총계"
    },
    emptyState: {
      title: "아직 활성화된 대시보드가 없습니다",
      subtitle: "단조 공정의 생산성 계산 및 투자 리스크 분석을 위해 먼저 재무제표나 가공 치수 데이터를 업로드/입력해주세요.",
      button: "첫 AI 분석 시작하기",
      step1: "1단계: 데이터 인제스트",
      step1Desc: "회사의 손익계산서, 대차대조표 텍스트나 원자재 사양 문서를 업로드합니다.",
      step2: "2단계: AI 자동 리팩토링",
      step2Desc: "Gemini API가 치수 인식, 여유치 자동 할당 및 핵심 재무 비율을 즉시 추출합니다.",
      step3: "3단계: 정밀 대시보드 시각화",
      step3Desc: "듀퐁 분석 분해, 수동/자동 로컬 아카이빙, 고해상도 PDF 보고서 등 전문 가공 데이터를 확인합니다."
    },
    feedback: {
      button: "피드백",
      title: "피드백 서비스 제안",
      subtitle: "사용 중 개선하고 싶은 사항이나 버그를 전송해 주시면 검토 후 즉시 수정하겠습니다.",
      appraisal: "전반적인 도구 만족도 평가 (별점)",
      classification: "제출 피드백 분석 유형",
      bugReport: "버그 신고",
      featureSuggest: "기능 제안",
      praiseAccent: "칭찬/추천",
      generalInquiry: "기타 문의",
      summaryTitle: "한줄 제목 요약",
      detailedDesc: "상세 내용 (최대 500자)",
      screenshotLabel: "화면 스크린샷 레퍼런스 첨부 (선택)",
      submitBtn: "피드백 제출 완료하기",
      historyTitle: "로컬 피드백 보관소 로그",
      historySubtitle: "브라우저 보안 인덱스에 저장된 수동 제출 기록 목록",
      noLogs: "등록된 피드백 로그가 없습니다.",
      clearLogs: "로그 전체 초기화",
      toastSubmitted: "피드백이 수동 보관소에 안전하게 누적 저장되었습니다!"
    }
  },
  en: {
    common: {
      appTitle: "Finalyze.ai",
      description: "Dimension awareness, allowance assignment, and weight calculation for forging engineers",
      manualSave: "Save to Local Archive",
      exportPdfHtml: "Export to PDF/HTML",
      localArchiveConnected: "Local Archive Synchronized",
      autoSynced: "Secure offline sync. You can safely export to document formats below.",
      savedSuccessfully: "Successfully logged in local reports storage vault!",
      cancel: "Cancel",
      submit: "Submit",
      loading: "Processing...",
      delete: "Delete",
      none: "None",
      success: "Success",
      error: "Error"
    },
    nav: {
      dashboard: "Dashboard Workspace",
      textPaste: "Data Ingestion",
      analysis: "AI Upload File",
      reports: "Reports Vault",
      feedbackLogs: "Feedback Log",
      runNewAnalysis: "Run Brand New AI Analysis"
    },
    upload: {
      title: "Ingest Financial Documents & Specs",
      subtitle: "Paste or select raw tabular margins, processing specifications, or forge stock bills to structure.",
      dragDrop: "Drag and drop any files or processing charts here.",
      fileLimit: "Supports PDF, images, TXT or CSV (max 10MB)",
      pastePlaceholder: "Paste your raw balance sheets, income text, dimension logs or materials matrix directly here...",
      orLabel: "OR",
      pasteLabel: "Direct Raw Text Ingestion",
      btnUpload: "Choose Local File",
      btnParse: "Synthesize Assets with Forging AI Model",
      parsingLabel: "Forging Master AI is parsing dimensions, margins, and yield ratios...",
      parseEmptyError: "Please enter valid raw logs or attach a processing file first."
    },
    dashboard: {
      metricsTitle: "Corporate Financial & Forging Metrics Monitor",
      kpiRevenue: "Revenue",
      kpiOperatingProfit: "Operating Profit",
      kpiNetIncome: "Net Income",
      kpiEbitda: "EBITDA Earnings",
      kpiDebtEquity: "Debt to Equity Ratio",
      kpiEquityRatio: "Equity Ratio",
      kpiRoe: "Return on Equity (ROE)",
      kpiRoa: "Return on Assets (ROA)",
      kpiPer: "PER Multiple",
      kpiPbr: "PBR Multiple",
      financialsSummary: "AI Diagnostic Analysis",
      strengthsLabel: "Key Strengths",
      weaknessesLabel: "Latent Risks & Limitations",
      recommendationLabel: "Engineering Strategic Recommendation",
      operatingMargin: "Operating Margin",
      netMargin: "Net Profit Margin",
      totalAssets: "Total Assets",
      totalLiabilities: "Total Liabilities",
      equity: "Total Equity"
    },
    emptyState: {
      title: "No Activated Dashboard Insights Yet",
      subtitle: "First, upload or paste raw balance ledger texts or component engineering dimensions to run analysis.",
      button: "Kick Off First AI Analysis",
      step1: "Step 1: Input Raw Data Ledger",
      step1Desc: "Upload income statements, balance sheets, or plant forging size specifications.",
      step2: "Step 2: AI Dynamic Optimization",
      step2Desc: "Our built-in Gemini API parses sizing allowances and generates core leverage ratios.",
      step3: "Step 3: Interactive Visualizations",
      step3Desc: "Examine DuPont Dupont breakdowns, export reports, and save records to local Vault files."
    },
    feedback: {
      button: "Feedback Support",
      title: "Submit User Experience Feedback",
      subtitle: "Help us refine forging tolerances, analytical layout options, and speed.",
      appraisal: "Overall App Satisfaction Rating (Stars)",
      classification: "A feedback category style labels",
      bugReport: "Bug Report & Issue",
      featureSuggest: "Feature Recommendation",
      praiseAccent: "Compliment & Praise",
      generalInquiry: "General Inquiry",
      summaryTitle: "One-line Summary Header",
      detailedDesc: "Detailed Description (up to 500 chars)",
      screenshotLabel: "Attach screenshot reference capture (Optional)",
      submitBtn: "Commit Local Feedback Log",
      historyTitle: "Local Browser Feedback Vault Logs",
      historySubtitle: "Historic list of reports stored locally in sandbox browser",
      noLogs: "No feedback logs recorded yet.",
      clearLogs: "Wipe all feedback records",
      toastSubmitted: "Feedback logged in browser secure storage index!"
    }
  },
  ja: {
    common: {
      appTitle: "Finalyze.ai",
      description: "鍛造エンジニアのための寸法認識、余肉自動割当、重量計算ウェブアプリ",
      manualSave: "手動保存 (Save)",
      exportPdfHtml: "PDF/HTMLエクスポート",
      localArchiveConnected: "ローカルアーカイブ同期済み",
      autoSynced: "オフライン同期が完了しました。以下のエクスポート形式を使用してください。",
      savedSuccessfully: "ローカルストレージに正常に保存されました。",
      cancel: "キャンセル",
      submit: "送信する",
      loading: "処理中...",
      delete: "削除",
      none: "なし",
      success: "成功",
      error: "エラー"
    },
    nav: {
      dashboard: "ダッシュボード",
      textPaste: "データインジェスト",
      analysis: "AI分析",
      reports: "レポート保管庫",
      feedbackLogs: "フィードバック",
      runNewAnalysis: "新規AI分析の実行"
    },
    upload: {
      title: "財務書類および仕様書のインジェスト",
      subtitle: "決算書、鍛造寸法、余肉データをアップロードまたは貼り付けて構造化します。",
      dragDrop: "財務書類や図面仕様ファイルをここにドロップしてください。",
      fileLimit: "PDF、画像、TXT、CSV対応 (最大10MB)",
      pastePlaceholder: "財務諸表テキスト、寸法テーブル、または分析用生データを貼り付けます...",
      orLabel: "または",
      pasteLabel: "生テキストを直接貼り付け",
      btnUpload: "ファイルを選択",
      btnParse: "鍛造AI分析モデルの実行",
      parsingLabel: "鍛造Master AIが寸法、余裕、マージン比率を解析中...",
      parseEmptyError: "有効なテキストまたはファイルをロードしてください。"
    },
    dashboard: {
      metricsTitle: "企業財務および鍛造指標モニター",
      kpiRevenue: "売上高",
      kpiOperatingProfit: "営業利益",
      kpiNetIncome: "当期純利益",
      kpiEbitda: "EBITDA",
      kpiDebtEquity: "自己資本比率/デットエクイティ",
      kpiEquityRatio: "自己資本比率",
      kpiRoe: "ROE (自己資本利益率)",
      kpiRoa: "ROA (総資産利益率)",
      kpiPer: "PER倍率",
      kpiPbr: "PBR倍率",
      financialsSummary: "AI総合診断・意見",
      strengthsLabel: "コア強み分析",
      weaknessesLabel: "潜在的脆弱点",
      recommendationLabel: "エンジニアリング投資判断",
      operatingMargin: "営業利益率",
      netMargin: "純利益率",
      totalAssets: "総資産",
      totalLiabilities: "負債総計",
      equity: "純資産"
    },
    emptyState: {
      title: "ダッシュボードがまだ有効化されていません",
      subtitle: "鍛造の生産性計算やリスク分析のために、最初に財務、または寸法などのデータをロードしてください。",
      button: "最初のAI分析を開始する",
      step1: "ステップ1: データの取り込み",
      step1Desc: "財務諸表、または鍛造余肉データをロードします。",
      step2: "ステップ2: AIによる自動構造化",
      step2Desc: "Gemini APIが自動的に余余裕値割り当ておよび割合データを取得します。",
      step3: "ステップ3: インタラクティブ表示",
      step3Desc: "デュポン分解図、詳細チャート、ローカルアーカイブ、PDFレポートなどで作業を支援します。"
    },
    feedback: {
      button: "ユーザーフィードバック",
      title: "サービスの改善提案",
      subtitle: "鍛造許容差、データ処理速度、UIデザインに関するご批判・ご提案をお寄せください。",
      appraisal: "総合評価 (満足度スター)",
      classification: "フィードバックカテゴリ",
      bugReport: "バグ報告",
      featureSuggest: "機能要求",
      praiseAccent: "推薦・賞賛",
      generalInquiry: "その他問い合わせ",
      summaryTitle: "一行タイトル",
      detailedDesc: "詳細説明 (最大500文字)",
      screenshotLabel: "画面キャプチャの添付 (任意)",
      submitBtn: "フィードバック送信",
      historyTitle: "ローカル履歴ログ",
      historySubtitle: "ローカルセキュリティサンドボックスに保存されたログ一覧",
      noLogs: "登録済みのログはありません。",
      clearLogs: "ログを消去する",
      toastSubmitted: "フィードバックはオフラインデータベースに蓄積保存されました。"
    }
  },
  zh: {
    common: {
      appTitle: "Finalyze.ai",
      description: "锻造工艺工程师专用：尺寸识别、公差自动分配与重量计算工具",
      manualSave: "手动保存 (Save)",
      exportPdfHtml: "导出 PDF/HTML 报告",
      localArchiveConnected: "本地档案库已连接",
      autoSynced: "安全离线自动同步已应用。您可以在下方选择多种导出文件格式。",
      savedSuccessfully: "已成功存入本地Reports保管库内！",
      cancel: "取消",
      submit: "提交",
      loading: "正在处理中...",
      delete: "删除",
      none: "无",
      success: "成功",
      error: "错误"
    },
    nav: {
      dashboard: "数据工作台",
      textPaste: "数据导入",
      analysis: "AI分析上传",
      reports: "分析报告库",
      feedbackLogs: "意见反馈日志",
      runNewAnalysis: "启动全新AI分析"
    },
    upload: {
      title: "上传财务报表或工艺加工规格书",
      subtitle: "拖入或直接粘贴企业损益表、资产负债表文本或锻造尺寸和容余数据。",
      dragDrop: "请将财务报表或工艺参数规划书文件拖拽到此处。",
      fileLimit: "支持 PDF, 图片, TXT 或 CSV (最大 10MB)",
      pastePlaceholder: "请在这里粘贴您的企业原始损益报表、尺寸偏差数据表或锻件材料信息（Ctrl+V）...",
      orLabel: "或者",
      pasteLabel: "直接粘贴原始文本文档",
      btnUpload: "选择电脑本地文件",
      btnParse: "启动智能锻造AI模型分析",
      parsingLabel: "AI模型正在解析材料尺寸、加工公差以及企业损益框架...",
      parseEmptyError: "请您先输入有效的文本或者挂载分析文件。"
    },
    dashboard: {
      metricsTitle: "企业核心财务及锻造综合指标板",
      kpiRevenue: "营业收入",
      kpiOperatingProfit: "营业利润",
      kpiNetIncome: "净利润",
      kpiEbitda: "EBITDA 息税折旧摊销前利润",
      kpiDebtEquity: "资产负债率 (Debt to Equity)",
      kpiEquityRatio: "股东权益比率",
      kpiRoe: "ROE 净资产收益率",
      kpiRoa: "ROA 总资产收益率",
      kpiPer: "PER 估值市盈率",
      kpiPbr: "PBR 估值市净率",
      financialsSummary: "AI 综合诊断与决策建议",
      strengthsLabel: "核心竞争优势 (Strengths)",
      weaknessesLabel: "潜在脆弱环节 (Weaknesses)",
      recommendationLabel: "工程投资评级与导向 (Recommendation)",
      operatingMargin: "营业利润率",
      netMargin: "净利润率",
      totalAssets: "总资产额",
      totalLiabilities: "总负债额",
      equity: "所有者权益"
    },
    emptyState: {
      title: "目前尚无活跃的分析工作台",
      subtitle: "为了评估锻造工艺产出损耗和财务杠杆情况，请先从上传文件或粘贴原始数据开始。",
      button: "启动首项AI智能分析",
      step1: "步骤 1: 数据输入导入",
      step1Desc: "上传公司损益、大账目表或车间尺寸规格工艺书。",
      step2: "步骤 2: AI一键重组提取",
      step2Desc: "嵌入式 Gemini API 将即刻分级处理工艺加工残切多余值并分析公司盈利倍数。",
      step3: "步骤 3: 交互式视觉成图",
      step3Desc: "详细阅览杜邦结构拆解、自研趋势曲线走势、离线报告存档和便捷HTML输出。"
    },
    feedback: {
      button: "技术反馈",
      title: "提交改进与漏洞建议",
      subtitle: "我们会悉心审视您的每一项反馈，优化工艺尺寸容差库与应用速度。",
      appraisal: "系统总体表现评定 (星级打分)",
      classification: "反馈和内容类型归属",
      bugReport: "缺陷与漏洞反馈",
      featureSuggest: "新功能点提议",
      praiseAccent: "给个赞或支持",
      generalInquiry: "其他通用事务咨询",
      summaryTitle: "提交标题概括",
      detailedDesc: "内容阐明 (限500字内)",
      screenshotLabel: "绑定屏幕调试捕获图 (可选)",
      submitBtn: "保存至本地日志中",
      historyTitle: "本地存储记录详情",
      historySubtitle: "本款游览器内部安全沙盒保存的历史上报单列表",
      noLogs: "当前没有留存任何反馈历史书。",
      clearLogs: "清空全部归档记录",
      toastSubmitted: "反馈文件已离线记录至游览器安全缓存池！"
    }
  },
  de: {
    common: {
      appTitle: "Finalyze.ai",
      description: "Dimensionserkennung, Toleranzzuweisung und Gewichtsberechnung für Schmiedeingenieure",
      manualSave: "Manuell Speichern",
      exportPdfHtml: "PDF/HTML Exportieren",
      localArchiveConnected: "Lokales Archiv Verbundet",
      autoSynced: "Sichere Offline-Synchronisierung abgeschlossen. Exportformate sind unten verfügbar.",
      savedSuccessfully: "Erfolgreich im lokalen Berichtsarchiv gesichert!",
      cancel: "Abbrechen",
      submit: "Senden",
      loading: "Wird geladen...",
      delete: "Löschen",
      none: "Keine",
      success: "Erfolg",
      error: "Fehler"
    },
    nav: {
      dashboard: "Dashboard",
      textPaste: "Datenerfassung",
      analysis: "AI Upload",
      reports: "Berichtsarchiv",
      feedbackLogs: "Feedback Log",
      runNewAnalysis: "Neue AI Analyse starten"
    },
    upload: {
      title: "Finanzdokumente & Toleranzangaben hochladen",
      subtitle: "Ziehen Sie Gewinn- und Verlustrechnungen, Bilanzen oder Schmiedemaße hierher.",
      dragDrop: "Dateien oder Prozessdiagramme hierher ziehen.",
      fileLimit: "Unterstützt PDF, Bilder, TXT oder CSV (max 10MB)",
      pastePlaceholder: "Fügen Sie Ihre Rohbilanzen, Maße und Rohdaten hier ein...",
      orLabel: "ODER",
      pasteLabel: "Rohtext direkt eingeben",
      btnUpload: "Datei auswählen",
      btnParse: "Analyse mit Forging AI-Modell starten",
      parsingLabel: "Forging Master AI berechnet Toleranzen, Aufmaße und Hebelzahlen...",
      parseEmptyError: "Bitte geben Sie gültigen Rohtext ein oder hängen Sie eine Datei an."
    },
    dashboard: {
      metricsTitle: "Finanzkennzahlen & Toleranz-Monitor",
      kpiRevenue: "Umsatz",
      kpiOperatingProfit: "Betriebsergebnis (EBIT)",
      kpiNetIncome: "Jahresüberschuss",
      kpiEbitda: "EBITDA",
      kpiDebtEquity: "Verschuldungsgrad (D/E)",
      kpiEquityRatio: "Eigenkapitalquote",
      kpiRoe: "Eigenkapitalrentabilität (ROE)",
      kpiRoa: "Gesamtkapitalrentabilität (ROA)",
      kpiPer: "KGV Multiplikator",
      kpiPbr: "KBV Multiplikator",
      financialsSummary: "AI-Gesamtbeurteilung",
      strengthsLabel: "Hauptstärken",
      weaknessesLabel: "Potenzielle Schwächen",
      recommendationLabel: "Anlage- & Prozessbeurteilung",
      operatingMargin: "EBIT-Marge",
      netMargin: "Nettomarge",
      totalAssets: "Bilanzsumme",
      totalLiabilities: "Verbindlichkeiten gesamt",
      equity: "Eigenkapital"
    },
    emptyState: {
      title: "Noch kein aktives Analyse-Board vorhanden",
      subtitle: "Bitte laden Sie Berichte oder Messmaße hoch, um Hebelverhältnisse oder Aufmaße zu berechnen.",
      button: "Erste AI-Analyse starten",
      step1: "Schritt 1: Datenquelle laden",
      step1Desc: "Gewinn- und Verlustrechnung, Schmiedezeichnungen oder Toleranzblätter einpflegen.",
      step2: "Schritt 2: AI-Strukturierung",
      step2Desc: "Die integrierte Gemini API ermittelt Schmiedegewicht, Übermaß und kritische Kreditfaktoren.",
      step3: "Schritt 3: Interaktive Charts",
      step3Desc: "DuPont-Schema, Trendkurven, lokaler Datenspeicher, HTML-Dokumentexport und Berichte."
    },
    feedback: {
      button: "Feedback Senden",
      title: "Anregungen und Fehlerberichte",
      subtitle: "Wir prüfen alle Vorschläge gründlich, um Toleranzen und Reaktionszeiten zu optimieren.",
      appraisal: "Gesamtbewertung der Anwendung (Sterne)",
      classification: "Informationstyp Klassifizierung",
      bugReport: "Fehlermeldung (Bug)",
      featureSuggest: "Funktionswunsch",
      praiseAccent: "Lob & Empfehlung",
      generalInquiry: "Sonstige Anfrage",
      summaryTitle: "Einzeiliger Betreff",
      detailedDesc: "Detaillierte Beschreibung (max. 500 Zeichen)",
      screenshotLabel: "Screenshot anhängen (Optional)",
      submitBtn: "Manuelles Feedback-Log sichern",
      historyTitle: "Lokaler Feedback-Meldungsspeicher",
      historySubtitle: "Liste der im Browser-Sicherheitsbereich abgelegten Meldungen",
      noLogs: "Keine lokalen Einträge gefunden.",
      clearLogs: "Alle Einträge leeren",
      toastSubmitted: "Feedback wurde erfolgreich im Offline-Sandbox-Speicher registriert!"
    }
  }
};

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("finalyze_ai_user_lang");
      if (saved && (saved === "ko" || saved === "en" || saved === "ja" || saved === "zh" || saved === "de")) {
        return saved as Language;
      }
    } catch (e) {
      console.warn("Could not read language from local storage", e);
    }
    return "ko";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("finalyze_ai_user_lang", lang);
    } catch (e) {
      console.warn("Could not write language selection to local storage", e);
    }
  };

  // Helper function to resolve dot-notated translation strings (e.g., "common.appTitle")
  const t = (path: string): string => {
    const parts = path.split(".");
    let current: any = translations[language];
    
    for (const part of parts) {
      if (current === undefined || current === null) {
        // Fallback to English translation
        let fallback: any = translations["en"];
        for (const fPart of parts) {
          if (fallback) fallback = fallback[fPart];
        }
        return fallback || path;
      }
      current = current[part];
    }
    
    return typeof current === "string" ? current : path;
  };

  return createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
