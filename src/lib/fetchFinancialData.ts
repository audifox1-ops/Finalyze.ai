/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FmpFinancialData {
  symbol: string;
  companyName: string;
  incomeStatement: any[];
  balanceSheet: any[];
  cashFlow: any[];
}

/**
 * FMP (Financial Modeling Prep) API 연동 모듈
 * 
 * [한국 주식 쿼리 안내 주석]
 * 한국 시장 주식 기호를 검색할 때는 반드시 다음 접미사를 티커 뒤에 부착해야 합니다:
 * - KOSPI (코스피): 테두리 뒤에 '.KS'를 붙입니다 (예: 삼성전자 -> '005930.KS')
 * - KOSDAQ (코스닥): 테두리 뒤에 '.KQ'를 붙입니다 (예: 에코프로 -> '086520.KQ')
 * 
 * [미국 및 미국 외 글로벌 주식]
 * - 미국 주식은 기존 테두리 심볼을 그대로 입력합니다 (예: Apple -> 'AAPL', Microsoft -> 'MSFT')
 */
export async function fetchFinancialData(ticker: string, customApiKey?: string): Promise<FmpFinancialData> {
  const fmpApiKey = customApiKey || (import.meta as any).env?.VITE_FMP_API_KEY || "";
  
  if (!ticker || ticker.trim() === "") {
    throw new Error("종목코드(티커)를 입력해 주세요.");
  }
  
  const cleanTicker = ticker.trim().toUpperCase();

  // 만약 API 키가 제공되지 않았다면, 개발/테스트 편의를 위한 시뮬레이션 데이터를 제공하거나 명확한 에러를 발생시킵니다.
  if (!fmpApiKey) {
    throw new Error("FMP API Key 누락됨. VITE_FMP_API_KEY 환경변수를 설정하시거나, 가상의 데모 데이터를 로드해 주세요.");
  }

  const limit = 3;
  const baseUrl = "https://financialmodelingprep.com/api/v3";

  // 주요 3대 재무제표 호출 엔드포인트 세팅
  const incomeUrl = `${baseUrl}/income-statement/${cleanTicker}?limit=${limit}&apikey=${fmpApiKey}`;
  const balanceUrl = `${baseUrl}/balance-sheet-statement/${cleanTicker}?limit=${limit}&apikey=${fmpApiKey}`;
  const cashFlowUrl = `${baseUrl}/cash-flow-statement/${cleanTicker}?limit=${limit}&apikey=${fmpApiKey}`;

  const [incRes, balRes, cfRes] = await Promise.all([
    fetch(incomeUrl),
    fetch(balanceUrl),
    fetch(cashFlowUrl)
  ]);

  if (!incRes.ok || !balRes.ok || !cfRes.ok) {
    throw new Error("FMP API 서버 요청에 실패했습니다. 네트워크 상태나 연결을 학인 하세요.");
  }

  const incomeStatement = await incRes.json();
  const balanceSheet = await balRes.json();
  const cashFlow = await cfRes.json();

  if (!Array.isArray(incomeStatement) || incomeStatement.length === 0) {
    throw new Error(`종목코드 '${cleanTicker}'에 대한 재무 정보를 찾을 수 없습니다. 철자 및 접미사(.KS, .KQ)를 다시 확인해 주세요.`);
  }

  // 기업 프로필 명칭 확보 또는 기본값 세팅
  const companyName = incomeStatement[0].calendarYear 
    ? `${cleanTicker} ($)` 
    : cleanTicker;

  return {
    symbol: cleanTicker,
    companyName,
    incomeStatement,
    balanceSheet,
    cashFlow
  };
}

/**
 * FMP API에서 제공된 데이터 구조를 AI 파이프라인(Gemini /api/analyze)이 완벽하게 
 * 이해하고 재구조화할 수 있는 고정밀 세부 구조용 마크업 텍스트로 트랜스폼합니다.
 */
export function formatFmpDataToText(data: FmpFinancialData): string {
  let output = `[FINANCIAL MODELING PREP API - HIGH-FIDELITY INGESTED SPECIFICATIONS]\n`;
  output += `TICKER SYMBOL: ${data.symbol}\n`;
  output += `CORPORATE NAME: ${data.companyName}\n`;
  output += `MAPPED DATETIME: ${new Date().toISOString()}\n\n`;

  output += `========================================================================\n`;
  output += `1. INCOME STATEMENT AUDIT DATA (Last ${data.incomeStatement.length} Fiscal Periods)\n`;
  output += `========================================================================\n`;
  data.incomeStatement.forEach((item, index) => {
    output += `[Fiscal Year Period ${index + 1}: ${item.calendarYear || item.date?.slice(0, 4) || "N/A"}]\n`;
    output += `  * Reporting Date: ${item.date || "N/A"}\n`;
    output += `  * Revenue / Sales (매출액): ${item.revenue?.toLocaleString() || 0} USD\n`;
    output += `  * Cost Of Goods Sold (매출원가): ${item.costOfRevenue?.toLocaleString() || 0} USD\n`;
    output += `  * Gross Profit (매출총이익): ${item.grossProfit?.toLocaleString() || 0} USD\n`;
    output += `  * Operating Income / Profit (영업이익): ${item.operatingIncome?.toLocaleString() || 0} USD\n`;
    output += `  * Operating Margin (영업이익률 %): ${item.revenue ? ((item.operatingIncome / item.revenue) * 100).toFixed(2) : 0}%\n`;
    output += `  * EBITDA (에비타): ${item.ebitda?.toLocaleString() || 0} USD\n`;
    output += `  * Net Income / Net Profit (당기순이익): ${item.netIncome?.toLocaleString() || 0} USD\n`;
    output += `  * Net Profit Margin (순이익률 %): ${item.revenue ? ((item.netIncome / item.revenue) * 100).toFixed(2) : 0}%\n`;
    output += `  * Basic EPS (주당순이익): ${item.eps || 0} USD\n`;
    output += `\n`;
  });

  output += `========================================================================\n`;
  output += `2. BALANCE SHEET AUDIT DATA (Last ${data.balanceSheet.length} Fiscal Periods)\n`;
  output += `========================================================================\n`;
  data.balanceSheet.forEach((item, index) => {
    output += `[Fiscal Year Period ${index + 1}: ${item.calendarYear || item.date?.slice(0, 4) || "N/A"}]\n`;
    output += `  * Reporting Date: ${item.date || "N/A"}\n`;
    output += `  * Total Assets (자산총계): ${item.totalAssets?.toLocaleString() || 0} USD\n`;
    output += `  * Total Liabilities (부채총계): ${item.totalLiabilities?.toLocaleString() || 0} USD\n`;
    output += `  * Total Stockholders Equity (자본총계): ${item.totalStockholdersEquity?.toLocaleString() || item.equity?.toLocaleString() || 0} USD\n`;
    output += `  * Cash & Cash Equivalents (현금및현금성자산): ${item.cashAndCashEquivalents?.toLocaleString() || 0} USD\n`;
    output += `  * Retained Earnings (이익잉여금): ${item.retainedEarnings?.toLocaleString() || 0} USD\n`;
    output += `  * Total Debt (총차입금): ${item.totalDebt?.toLocaleString() || 0} USD\n`;
    output += `  * Debt To Equity Ratio (부채비율 %): ${item.totalStockholdersEquity || item.equity ? ((item.totalLiabilities / (item.totalStockholdersEquity || item.equity)) * 100).toFixed(2) : 0}%\n`;
    output += `  * Equity Ratio (자기자본비율 %): ${item.totalAssets ? (((item.totalStockholdersEquity || item.equity) / item.totalAssets) * 105).toFixed(2) : 0}% / (Normal Ratio: ${item.totalAssets ? (((item.totalStockholdersEquity || item.equity) / item.totalAssets) * 100).toFixed(2) : 0}%)\n`;
    output += `\n`;
  });

  output += `========================================================================\n`;
  output += `3. CASH FLOW STATEMENT AUDIT DATA (Last ${data.cashFlow.length} Fiscal Periods)\n`;
  output += `========================================================================\n`;
  data.cashFlow.forEach((item, index) => {
    output += `[Fiscal Year Period ${index + 1}: ${item.calendarYear || item.date?.slice(0, 4) || "N/A"}]\n`;
    output += `  * Reporting Date: ${item.date || "N/A"}\n`;
    output += `  * Cash Flow from Operating Activities (영업활동현금흐름): ${item.netCashProvidedByOperatingActivities?.toLocaleString() || item.operatingCashFlow?.toLocaleString() || 0} USD\n`;
    output += `  * Cash Flow from Investing Activities (투자활동현금흐름): ${item.netCashUsedForInvestingActivites?.toLocaleString() || item.investingCashFlow?.toLocaleString() || 0} USD\n`;
    output += `  * Cash Flow from Financing Activities (재무활동현금흐름): ${item.netCashUsedProvidedByFinancingActivities?.toLocaleString() || item.financingCashFlow?.toLocaleString() || 0} USD\n`;
    output += `  * Capital Expenditure (자본적지출 CAPEX): ${item.capitalExpenditure?.toLocaleString() || 0} USD\n`;
    output += `  * Free Cash Flow (잉여현금흐름 FCF): ${item.freeCashFlow?.toLocaleString() || 0} USD\n`;
    output += `\n`;
  });

  output += `\n\n[COMPLEMENTARY CALCULATED RATIOS (ESTIMATES ENERGISED BY FMP DATA)]\n`;
  if (data.incomeStatement[0] && data.balanceSheet[0]) {
    const inc = data.incomeStatement[0];
    const bal = data.balanceSheet[0];
    const eq = bal.totalStockholdersEquity || bal.equity || 1;
    const assets = bal.totalAssets || 1;
    output += `  * ROE (자기자본이익률 %): ${(((inc.netIncome || 0) / eq) * 100).toFixed(2)}%\n`;
    output += `  * ROA (총자산이익률 %): ${(((inc.netIncome || 0) / assets) * 100).toFixed(2)}%\n`;
  }

  output += `\n[END OF REPORT - TRANSFERRED TO GEMINI PARSING MATRIX]`;
  return output;
}

/**
 * API 키가 누락되었거나 테스트 목적의 검색을 보조하기 위해 정밀 가공된 고성능 시뮬레이션 데이터셋입니다.
 * 삼성전자와 애플 등 핵심적인 모크 데이터를 갖추고 있습니다.
 */
export function getSimulatedFmpData(ticker: string): FmpFinancialData {
  const cleanTicker = ticker.trim().toUpperCase();

  if (cleanTicker.includes("005930") || cleanTicker.includes("SAMSUNG")) {
    // 삼성전자 시뮬레이션 데이터 (단위: USD 상당)
    return {
      symbol: "005930.KS",
      companyName: "Samsung Electronics Co., Ltd.",
      incomeStatement: [
        { calendarYear: "2024", date: "2024-12-31", revenue: 215000000000, costOfRevenue: 132000000000, grossProfit: 83000000000, operatingIncome: 21000000000, ebitda: 35000000000, netIncome: 16500000000, eps: 2.35 },
        { calendarYear: "2023", date: "2023-12-31", revenue: 198000000000, costOfRevenue: 125000000000, grossProfit: 73000000000, operatingIncome: 4800000000, ebitda: 18000000000, netIncome: 11000000000, eps: 1.57 },
        { calendarYear: "2022", date: "2022-12-31", revenue: 240000000000, costOfRevenue: 140000000000, grossProfit: 100000000000, operatingIncome: 33000000000, ebitda: 48000000000, netIncome: 25000000000, eps: 3.56 }
      ],
      balanceSheet: [
        { calendarYear: "2024", date: "2024-12-31", totalAssets: 345000000000, totalLiabilities: 82000000000, totalStockholdersEquity: 263000000000, cashAndCashEquivalents: 68000000000, retainedEarnings: 210000000000, totalDebt: 12000000000 },
        { calendarYear: "2023", date: "2023-12-31", totalAssets: 328000000000, totalLiabilities: 78000000000, totalStockholdersEquity: 250000000000, cashAndCashEquivalents: 62000000000, retainedEarnings: 200000000000, totalDebt: 14000000000 },
        { calendarYear: "2022", date: "2022-12-31", totalAssets: 315000000000, totalLiabilities: 72000000000, totalStockholdersEquity: 243000000000, cashAndCashEquivalents: 58000000000, retainedEarnings: 192000000000, totalDebt: 11000000000 }
      ],
      cashFlow: [
        { calendarYear: "2024", date: "2024-12-31", netCashProvidedByOperatingActivities: 31000000000, netCashUsedForInvestingActivites: -22000000000, netCashUsedProvidedByFinancingActivities: -3000000000, capitalExpenditure: 19000000000, freeCashFlow: 12000000000 },
        { calendarYear: "2023", date: "2023-12-31", netCashProvidedByOperatingActivities: 18000000000, netCashUsedForInvestingActivites: -26000000000, netCashUsedProvidedByFinancingActivities: -4000000000, capitalExpenditure: 21000000000, freeCashFlow: -3000000000 },
        { calendarYear: "2022", date: "2022-12-31", netCashProvidedByOperatingActivities: 45000000000, netCashUsedForInvestingActivites: -31000000000, netCashUsedProvidedByFinancingActivities: -2000000000, capitalExpenditure: 26000000000, freeCashFlow: 19000000000 }
      ]
    };
  } else if (cleanTicker.includes("MSFT") || cleanTicker.includes("MICROSOFT")) {
    // 마이크로소프트 시뮬레이션 데이터
    return {
      symbol: "MSFT",
      companyName: "Microsoft Corporation",
      incomeStatement: [
        { calendarYear: "2024", date: "2024-06-30", revenue: 245120000000, costOfRevenue: 73800000000, grossProfit: 171320000000, operatingIncome: 109360000000, ebitda: 125000000000, netIncome: 88130000000, eps: 11.80 },
        { calendarYear: "2023", date: "2023-06-30", revenue: 211915000000, costOfRevenue: 65121000000, grossProfit: 146794000000, operatingIncome: 88523000000, ebitda: 102000000000, netIncome: 72361000000, eps: 9.68 },
        { calendarYear: "2022", date: "2022-06-30", revenue: 198270000000, costOfRevenue: 62650000000, grossProfit: 135620000000, operatingIncome: 83380000000, ebitda: 97000000000, netIncome: 72738000000, eps: 9.65 }
      ],
      balanceSheet: [
        { calendarYear: "2024", date: "2024-06-30", totalAssets: 470000000000, totalLiabilities: 219500000000, totalStockholdersEquity: 250500000000, cashAndCashEquivalents: 75520000000, retainedEarnings: 115000000000, totalDebt: 42600000000 },
        { calendarYear: "2023", date: "2023-06-30", totalAssets: 411976000000, totalLiabilities: 205740000000, totalStockholdersEquity: 206236000000, cashAndCashEquivalents: 34700000000, retainedEarnings: 84100000000, totalDebt: 44000000000 },
        { calendarYear: "2022", date: "2022-06-30", totalAssets: 364840000000, totalLiabilities: 198298000000, totalStockholdersEquity: 166542000000, cashAndCashEquivalents: 13930000000, retainedEarnings: 83000000000, totalDebt: 47000000000 }
      ],
      cashFlow: [
        { calendarYear: "2024", date: "2024-06-30", netCashProvidedByOperatingActivities: 118000000000, netCashUsedForInvestingActivites: -35000000000, netCashUsedProvidedByFinancingActivities: -30000000000, capitalExpenditure: 28000000000, freeCashFlow: 90000000000 },
        { calendarYear: "2023", date: "2023-06-30", netCashProvidedByOperatingActivities: 87582000000, netCashUsedForInvestingActivites: -22680000000, netCashUsedProvidedByFinancingActivities: -43935000000, capitalExpenditure: 20600000000, freeCashFlow: 66982000000 },
        { calendarYear: "2022", date: "2022-06-30", netCashProvidedByOperatingActivities: 89025000000, netCashUsedForInvestingActivites: -30311000000, netCashUsedProvidedByFinancingActivities: -58876000000, capitalExpenditure: 23800000000, freeCashFlow: 65225000000 }
      ]
    };
  } else {
    // 디폴트: Apple Inc. 시뮬레이션 데모 데이터
    return {
      symbol: cleanTicker === "" ? "AAPL" : cleanTicker,
      companyName: cleanTicker === "" ? "Apple Inc." : `${cleanTicker} Corporation`,
      incomeStatement: [
        { calendarYear: "2024", date: "2024-09-28", revenue: 391035000000, costOfRevenue: 220000000000, grossProfit: 171035000000, operatingIncome: 112000000000, ebitda: 128000000000, netIncome: 93739000000, eps: 6.16 },
        { calendarYear: "2023", date: "2023-09-30", revenue: 383285000000, costOfRevenue: 214137000000, grossProfit: 169148000000, operatingIncome: 114301000000, ebitda: 125134000000, netIncome: 96995000000, eps: 6.13 },
        { calendarYear: "2022", date: "2022-09-24", revenue: 394328000000, costOfRevenue: 223546000000, grossProfit: 170782000000, operatingIncome: 119437000000, ebitda: 130541000000, netIncome: 99803000000, eps: 6.11 }
      ],
      balanceSheet: [
        { calendarYear: "2024", date: "2024-09-28", totalAssets: 365000000000, totalLiabilities: 290000000000, totalStockholdersEquity: 75000000000, cashAndCashEquivalents: 30000000000, retainedEarnings: -10000000000, totalDebt: 105000000000 },
        { calendarYear: "2023", date: "2023-09-30", totalAssets: 352580000000, totalLiabilities: 272434000000, totalStockholdersEquity: 73812000000, cashAndCashEquivalents: 29965000000, retainedEarnings: -2141000000, totalDebt: 109280000000 },
        { calendarYear: "2022", date: "2022-09-24", totalAssets: 352755000000, totalLiabilities: 302083000000, totalStockholdersEquity: 50672000000, cashAndCashEquivalents: 23646000000, retainedEarnings: -3068000001, totalDebt: 120069000000 }
      ],
      cashFlow: [
        { calendarYear: "2024", date: "2024-09-28", netCashProvidedByOperatingActivities: 115000000000, netCashUsedForInvestingActivites: -45000000000, netCashUsedProvidedByFinancingActivities: -25000000000, capitalExpenditure: 11000000000, freeCashFlow: 104000000000 },
        { calendarYear: "2023", date: "2023-09-30", netCashProvidedByOperatingActivities: 110543000000, netCashUsedForInvestingActivites: -49655000000, netCashUsedProvidedByFinancingActivities: -2000000000, capitalExpenditure: 10959000000, freeCashFlow: 99579000000 },
        { calendarYear: "2022", date: "2022-09-24", netCashProvidedByOperatingActivities: 122151000000, netCashUsedForInvestingActivites: -22354000000, netCashUsedProvidedByFinancingActivities: -101000000000, capitalExpenditure: 10708000000, freeCashFlow: 111443000000 }
      ]
    };
  }
}
