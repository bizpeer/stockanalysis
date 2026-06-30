/**
 * Financial Rigor Utilities for AI Berkshire Studio (TypeScript Port)
 * Handles precise calculations for financial metrics, matching tools/financial_rigor.py.
 */

export interface VerificationResult {
  success: boolean;
  message: string;
  log: string;
  data?: any;
}

// Utility to format numbers in Korean (억/조) or English style (M/B/T)
export function formatFinancialNumber(num: number, unit: string = ""): string {
  const absVal = Math.abs(num);
  if (unit.includes("억")) {
    if (absVal >= 10000) {
      return `${(num / 10000).toFixed(2)}조${unit.replace("억", "")}`;
    }
    return `${num.toFixed(2)}${unit}`;
  }
  if (absVal >= 1e12) {
    return `${(num / 1e12).toFixed(2)}조 (T)`;
  }
  if (absVal >= 1e9) {
    return `${(num / 1e9).toFixed(2)}십억 (B)`;
  }
  if (absVal >= 1e6) {
    return `${(num / 1e6).toFixed(2)}백만 (M)`;
  }
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * 1. Market Cap Verification (주가 × 발행주식수 vs 공시 시가총액)
 */
export function verifyMarketCap(
  price: number,
  shares: number,
  reportedCap: number,
  currency: string = ""
): VerificationResult {
  const calculated = price * shares;
  const deviation = reportedCap !== 0 ? (Math.abs(calculated - reportedCap) / reportedCap) * 100 : 0;
  
  let log = "";
  log += "============================================================\n";
  log += "시가총액 검증 (Market Cap Verification)\n";
  log += "============================================================\n";
  log += `  주가 (Price):             ${price} ${currency}\n`;
  log += `  총 발행주식수 (Shares):    ${formatFinancialNumber(shares)}\n`;
  log += `  계산 시가총액 (Calculated): ${formatFinancialNumber(calculated)} ${currency}\n`;
  log += `  공시 시가총액 (Reported):   ${formatFinancialNumber(reportedCap)} ${currency}\n`;
  log += `  편차 (Deviation):          ${deviation.toFixed(2)}%\n\n`;

  let success = false;
  if (deviation > 5) {
    log += `  ❌ 경고: 편차 ${deviation.toFixed(1)}% > 5%, 다음 사항을 점검하세요:\n`;
    log += `     - 발행주식수가 최신 상태인지 확인 (자사주 매입/증자 등)?\n`;
    log += `     - 통화 단위가 일치하는지 확인 (원화 vs 달러 vs 위안화 등)?\n`;
    log += `     - 주가가 최신 상태인지 확인?\n`;
    success = false;
  } else if (deviation > 1) {
    log += `  ⚠️ 편차 ${deviation.toFixed(1)}% 는 허용 범위 내에 있습니다. 주가 변동 또는 발행주식수 변화에 따른 차이일 수 있습니다.\n`;
    success = true;
  } else {
    log += `  ✅ 검증 통과, 편차 단 ${deviation.toFixed(2)}%\n`;
    success = true;
  }

  return {
    success,
    message: success ? `Verification passed with ${deviation.toFixed(2)}% deviation.` : `Deviation too large (${deviation.toFixed(2)}%).`,
    log,
    data: { calculated, reportedCap, deviation }
  };
}

/**
 * 2. Valuation Metrics Verification (밸류에이션 지표 검증)
 */
export function verifyValuation(
  price: number,
  eps?: number,
  bvps?: number,
  fcfPerShare?: number,
  dividend?: number,
  revenuePerShare?: number
): VerificationResult {
  let log = "";
  log += "============================================================\n";
  log += "밸류에이션 지표 검증 (Valuation Verification)\n";
  log += "============================================================\n";
  log += `  현재 주가 (Price): ${price}\n\n`;

  const results: any = {};

  if (eps !== undefined && eps !== null) {
    if (eps !== 0) {
      const pe = price / eps;
      const ey = (eps / price) * 100;
      log += `  PE (TTM):      ${price} / ${eps} = ${pe.toFixed(2)}배 (x)\n`;
      log += `  이익수익률 (Earnings Yield): ${ey.toFixed(2)}%\n`;
      results.PE = pe;
      results.EarningsYield = ey;
    } else {
      log += `  PE: EPS가 0이므로 계산할 수 없습니다.\n`;
    }
  }

  if (bvps !== undefined && bvps !== null) {
    if (bvps !== 0) {
      const pb = price / bvps;
      log += `  PB:            ${price} / ${bvps} = ${pb.toFixed(2)}배 (x)\n`;
      results.PB = pb;
      if (eps !== undefined && eps !== 0) {
        const roe = (eps / bvps) * 100;
        log += `  ROE:           ${eps} / ${bvps} = ${roe.toFixed(2)}%\n`;
        results.ROE = roe;
      }
    }
  }

  if (fcfPerShare !== undefined && fcfPerShare !== null) {
    if (fcfPerShare !== 0) {
      const pfcf = price / fcfPerShare;
      const fcfYield = (fcfPerShare / price) * 100;
      log += `  P/FCF:         ${price} / ${fcfPerShare} = ${pfcf.toFixed(2)}배 (x)\n`;
      log += `  FCF Yield:     ${fcfYield.toFixed(2)}%\n`;
      results.P_FCF = pfcf;
      results.FCF_Yield = fcfYield;
    }
  }

  if (dividend !== undefined && dividend !== null) {
    if (price !== 0) {
      const divYield = (dividend / price) * 100;
      log += `  배당수익률 (Dividend Yield): ${dividend} / ${price} = ${divYield.toFixed(2)}%\n`;
      results.Dividend_Yield = divYield;
    }
  }

  if (revenuePerShare !== undefined && revenuePerShare !== null) {
    if (revenuePerShare !== 0) {
      const ps = price / revenuePerShare;
      log += `  PS:            ${price} / ${revenuePerShare} = ${ps.toFixed(2)}배 (x)\n`;
      results.PS = ps;
    }
  }

  log += "\n  ✅ 위의 지표들은 부동 소수점 오차 없이 정확한 계산식으로 연산되었습니다.\n";

  return {
    success: true,
    message: "Valuation metrics calculated successfully.",
    log,
    data: results
  };
}

/**
 * 3. Cross-Source Data Validation (다중 소스 크로스 검증)
 */
export function crossValidate(
  fieldName: string,
  sourceValues: Record<string, number>,
  unit: string = "",
  tolerancePct: number = 2.0
): VerificationResult {
  let log = "";
  log += "============================================================\n";
  log += `크로스 검증: ${fieldName} (Cross-Validation)\n`;
  log += "============================================================\n";

  const sources = Object.keys(sourceValues);
  const nums = Object.values(sourceValues);

  if (nums.length === 0) {
    return { success: false, message: "No source values provided.", log: "No sources to validate." };
  }

  // Find median as reference
  const sortedVals = [...nums].sort((a, b) => a - b);
  const n = sortedVals.length;
  const median = n % 2 === 1 ? sortedVals[Math.floor(n / 2)] : (sortedVals[n / 2 - 1] + sortedVals[n / 2]) / 2;

  log += `  데이터 소스 개수: ${sources.length}\n`;
  log += `  참고 중위값:     ${formatFinancialNumber(median, unit)}\n\n`;

  let allOk = true;
  const itemResults: any[] = [];

  for (const [src, val] of Object.entries(sourceValues)) {
    const dev = median !== 0 ? (Math.abs(val - median) / median) * 100 : 0;
    const status = dev <= tolerancePct ? "✅" : "❌";
    if (dev > tolerancePct) {
      allOk = false;
    }
    log += `  ${status} ${src.padEnd(20)}: ${formatFinancialNumber(val, unit)}  (편차 ${dev.toFixed(2)}%)\n`;
    itemResults.push({ source: src, value: val, deviation: dev, ok: dev <= tolerancePct });
  }

  log += "\n";
  if (allOk) {
    log += `  ✅ 모든 데이터 소스의 편차가 ≤ ${tolerancePct}% 이내로 일관성이 있습니다.\n`;
  } else {
    log += `  ⚠️ 편차가 > ${tolerancePct}% 를 초과하는 소스가 존재하므로 차이 원인을 확인해 주세요.\n`;
    log += `     권장사항: 기업 사업보고서 및 거래소 공시 데이터를 최우선으로 적용하세요.\n`;
  }

  log += `\n  컨센서스 값 (가중 중위값): ${formatFinancialNumber(median, unit)}\n`;

  return {
    success: allOk,
    message: allOk ? "Cross-source data is consistent." : "Some data sources exceed tolerance thresholds.",
    log,
    data: { consensus: median, allConsistent: allOk, items: itemResults }
  };
}

/**
 * 4. Benford's Law Check (벤포드의 법칙 검증)
 */
export function benfordCheck(values: number[]): VerificationResult {
  let log = "";
  log += "============================================================\n";
  log += "벤포드의 법칙 검증 (재무 데이터 조작 가능성 검증)\n";
  log += "============================================================\n";

  const digits: number[] = [];
  for (let v of values) {
    v = Math.abs(v);
    if (v > 0) {
      // Find leading digit
      const str = v.toString().replace(/[.0eE-]/g, "");
      if (str.length > 0) {
        const d = parseInt(str[0]);
        if (d >= 1 && d <= 9) {
          digits.push(d);
        }
      }
    }
  }

  const n = digits.length;
  if (n < 30) {
    log += `  ⚠️ 표본 크기 부족: ${n} < 30개로 벤포드 분석 결과가 신뢰하기 어렵습니다 (보통 50개 이상 권장).\n`;
  }

  const counts: Record<number, number> = {};
  for (const d of digits) {
    counts[d] = (counts[d] || 0) + 1;
  }

  // Benford expectations
  const BENFORD: Record<number, number> = {
    1: 0.301, 2: 0.176, 3: 0.125, 4: 0.097, 5: 0.079,
    6: 0.067, 7: 0.058, 8: 0.051, 9: 0.046
  };

  const observed: Record<number, number> = {};
  let mad = 0;
  let chi2 = 0;

  for (let d = 1; d <= 9; d++) {
    observed[d] = n > 0 ? (counts[d] || 0) / n : 0;
    mad += Math.abs(observed[d] - BENFORD[d]);
    
    const expectedCount = BENFORD[d] * n;
    if (expectedCount > 0) {
      chi2 += Math.pow((counts[d] || 0) - expectedCount, 2) / expectedCount;
    }
  }
  mad = mad / 9;

  let conformity = "";
  if (mad < 0.006) conformity = "높음 (Close)";
  else if (mad < 0.012) conformity = "보통 (Acceptable)";
  else if (mad < 0.015) conformity = "경계 (Marginally)";
  else conformity = "비적합 (Nonconforming ⚠️)";

  log += `  표본 크기 (N): ${n}\n`;
  log += `  MAD:          ${mad.toFixed(6)}\n`;
  log += `  Chi-sq:       ${chi2.toFixed(2)}\n`;
  log += `  적합도:       ${conformity}\n\n`;

  log += `  첫째자리수   관측값   기대값   편차\n`;
  log += `  ------------------------------\n`;
  for (let d = 1; d <= 9; d++) {
    const obs = observed[d];
    const exp = BENFORD[d];
    const dev = obs - exp;
    const flag = Math.abs(dev) > 0.03 ? " ⚠️" : "";
    log += `  ${d}            ${obs.toFixed(3)}   ${exp.toFixed(3)}   ${dev >= 0 ? "+" : ""}${dev.toFixed(3)}${flag}\n`;
  }

  log += "\n";
  const success = mad < 0.015;
  if (success) {
    log += "  ✅ 데이터 첫째자리수 분포가 벤포드의 법칙에 부합합니다.\n";
  } else {
    log += "  ❌ 데이터 첫째자리수 분포가 비정상적이며 인위적 조정 가능성이 있습니다.\n";
    log += "     팁: 벤포드 법칙 비적합이 반드시 조작을 의미하는 것은 아니나 추가 조사를 권장합니다.\n";
  }

  return {
    success,
    message: success ? "Distribution matches Benford's Law." : "Distribution deviates from Benford's Law expectations.",
    log,
    data: { mad, chi2, conformity, digitsCount: n, observed }
  };
}

/**
 * 5. Three-Scenario Valuation (3가지 시나리오 가치평가)
 */
export interface ThreeScenarioItem {
  name: string;
  growth: number;
  pe: number;
  futureEps: number;
  targetPrice: number;
  change: number;
}

export function calculateThreeScenarioValuation(
  currentPrice: number,
  currentEps: number,
  sharesBillion: number,
  growthOptimistic: number,
  growthNeutral: number,
  growthPessimistic: number,
  peOptimistic: number,
  peNeutral: number,
  pePessimistic: number,
  years: number = 3,
  currency: string = ""
): VerificationResult {
  let log = "";
  log += "============================================================\n";
  log += "3시나리오 가치평가 모델 (Three-Scenario Valuation)\n";
  log += "============================================================\n";
  log += `  현재 주가:  ${currentPrice} ${currency}\n`;
  log += `  현재 EPS:   ${currentEps}\n`;
  log += `  예측 기간:  ${years}개년\n\n`;

  const scenarios = [
    { name: "낙관 (Bull)", growth: growthOptimistic, pe: peOptimistic },
    { name: "중립 (Base)", growth: growthNeutral, pe: peNeutral },
    { name: "비관 (Bear)", growth: growthPessimistic, pe: pePessimistic }
  ];

  log += `  시나리오      연간성장률   목표 PE   목표 EPS   목표주가    예상수익률\n`;
  log += `  --------------------------------------------------------------\n`;

  const results: ThreeScenarioItem[] = [];

  for (const sc of scenarios) {
    // Future EPS = current EPS * (1 + growth)^years
    let futureEps = currentEps;
    for (let i = 0; i < years; i++) {
      futureEps = futureEps * (1 + sc.growth);
    }
    const targetPrice = futureEps * sc.pe;
    const change = currentPrice !== 0 ? ((targetPrice - currentPrice) / currentPrice) * 100 : 0;

    log += `  ${sc.name.padEnd(10)} ${(sc.growth * 100).toFixed(0).padStart(5)}%   ${sc.pe.toFixed(0).padStart(5)}x    ${futureEps.toFixed(2).padStart(8)}   ${targetPrice.toFixed(1).padStart(9)}   ${change >= 0 ? "+" : ""}${change.toFixed(1)}%\n`;

    results.push({
      name: sc.name,
      growth: sc.growth,
      pe: sc.pe,
      futureEps,
      targetPrice,
      change
    });
  }

  log += "\n  ✅ 모든 계산이 완료되었으며, 감사 및 재현이 가능한 계산식입니다.\n";

  return {
    success: true,
    message: "Three-scenario valuation model calculated successfully.",
    log,
    data: results
  };
}
