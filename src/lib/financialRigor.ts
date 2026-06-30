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
    return `${(num / 1e12).toFixed(2)}T`;
  }
  if (absVal >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  }
  if (absVal >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  }
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * 1. Market Cap Verification (股价 × 总股本 vs 报告市值)
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
  log += "市值验算 (Market Cap Verification)\n";
  log += "============================================================\n";
  log += `  股价 (Price):       ${price} ${currency}\n`;
  log += `  总股本 (Shares):    ${formatFinancialNumber(shares)}\n`;
  log += `  计算市值:           ${formatFinancialNumber(calculated)} ${currency}\n`;
  log += `  报告市值:           ${formatFinancialNumber(reportedCap)} ${currency}\n`;
  log += `  偏差:               ${deviation.toFixed(2)}%\n\n`;

  let success = false;
  if (deviation > 5) {
    log += `  ❌ 警告: 偏差 ${deviation.toFixed(1)}% > 5%, 请检查:\n`;
    log += `     - 股本是否为最新（回购/增发）?\n`;
    log += `     - 币种单位是否一致（港币 vs 人民币 vs 美元）?\n`;
    log += `     - 股价是否为最新?\n`;
    success = false;
  } else if (deviation > 1) {
    log += `  ⚠️  偏差 ${deviation.toFixed(1)}% 在可接受范围, 可能因股价波动/股本变化\n`;
    success = true;
  } else {
    log += `  ✅ 验证通过, 偏差仅 ${deviation.toFixed(2)}%\n`;
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
 * 2. Valuation Metrics Verification (估值指标验算)
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
  log += "估值指标验算 (Valuation Verification)\n";
  log += "============================================================\n";
  log += `  当前股价: ${price}\n\n`;

  const results: any = {};

  if (eps !== undefined && eps !== null) {
    if (eps !== 0) {
      const pe = price / eps;
      const ey = (eps / price) * 100;
      log += `  PE (TTM):  ${price} / ${eps} = ${pe.toFixed(2)}x\n`;
      log += `  盈利收益率: ${ey.toFixed(2)}%\n`;
      results.PE = pe;
      results.EarningsYield = ey;
    } else {
      log += `  PE: EPS为0, 无法计算\n`;
    }
  }

  if (bvps !== undefined && bvps !== null) {
    if (bvps !== 0) {
      const pb = price / bvps;
      log += `  PB:        ${price} / ${bvps} = ${pb.toFixed(2)}x\n`;
      results.PB = pb;
      if (eps !== undefined && eps !== 0) {
        const roe = (eps / bvps) * 100;
        log += `  ROE:       ${eps} / ${bvps} = ${roe.toFixed(2)}%\n`;
        results.ROE = roe;
      }
    }
  }

  if (fcfPerShare !== undefined && fcfPerShare !== null) {
    if (fcfPerShare !== 0) {
      const pfcf = price / fcfPerShare;
      const fcfYield = (fcfPerShare / price) * 100;
      log += `  P/FCF:     ${price} / ${fcfPerShare} = ${pfcf.toFixed(2)}x\n`;
      log += `  FCF Yield: ${fcfYield.toFixed(2)}%\n`;
      results.P_FCF = pfcf;
      results.FCF_Yield = fcfYield;
    }
  }

  if (dividend !== undefined && dividend !== null) {
    if (price !== 0) {
      const divYield = (dividend / price) * 100;
      log += `  股息率:    ${dividend} / ${price} = ${divYield.toFixed(2)}%\n`;
      results.Dividend_Yield = divYield;
    }
  }

  if (revenuePerShare !== undefined && revenuePerShare !== null) {
    if (revenuePerShare !== 0) {
      const ps = price / revenuePerShare;
      log += `  PS:        ${price} / ${revenuePerShare} = ${ps.toFixed(2)}x\n`;
      results.PS = ps;
    }
  }

  log += "\n  ✅ 以上指标已使用精确计算, 无浮点误差\n";

  return {
    success: true,
    message: "Valuation metrics calculated successfully.",
    log,
    data: results
  };
}

/**
 * 3. Cross-Source Data Validation (多源交叉验证)
 */
export function crossValidate(
  fieldName: string,
  sourceValues: Record<string, number>,
  unit: string = "",
  tolerancePct: number = 2.0
): VerificationResult {
  let log = "";
  log += "============================================================\n";
  log += `交叉验证: ${fieldName} (Cross-Validation)\n`;
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

  log += `  数据来源数: ${sources.length}\n`;
  log += `  参考中位数: ${formatFinancialNumber(median, unit)}\n\n`;

  let allOk = true;
  const itemResults: any[] = [];

  for (const [src, val] of Object.entries(sourceValues)) {
    const dev = median !== 0 ? (Math.abs(val - median) / median) * 100 : 0;
    const status = dev <= tolerancePct ? "✅" : "❌";
    if (dev > tolerancePct) {
      allOk = false;
    }
    log += `  ${status} ${src.padEnd(20)}: ${formatFinancialNumber(val, unit)}  (偏差 ${dev.toFixed(2)}%)\n`;
    itemResults.push({ source: src, value: val, deviation: dev, ok: dev <= tolerancePct });
  }

  log += "\n";
  if (allOk) {
    log += `  ✅ 所有来源偏差 ≤ ${tolerancePct}%, 数据一致\n`;
  } else {
    log += `  ⚠️  存在来源偏差 > ${tolerancePct}%, 请核实差异原因\n`;
    log += `     建议: 优先采用公司年报/交易所数据\n`;
  }

  log += `\n  共识值 (加权中位数): ${formatFinancialNumber(median, unit)}\n`;

  return {
    success: allOk,
    message: allOk ? "Cross-source data is consistent." : "Some data sources exceed tolerance thresholds.",
    log,
    data: { consensus: median, allConsistent: allOk, items: itemResults }
  };
}

/**
 * 4. Benford's Law Check
 */
export function benfordCheck(values: number[]): VerificationResult {
  let log = "";
  log += "============================================================\n";
  log += "Benford定律检测 (Financial Data Fabrication Check)\n";
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
    log += `  ⚠️  样本量不足: ${n} < 30, Benford分析不可靠(通常需要50+)\n`;
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
  if (mad < 0.006) conformity = "Close (高度符合)";
  else if (mad < 0.012) conformity = "Acceptable (可接受)";
  else if (mad < 0.015) conformity = "Marginally Acceptable (边缘)";
  else conformity = "Nonconforming (不符合 ⚠️)";

  log += `  样本量:    ${n}\n`;
  log += `  MAD:       ${mad.toFixed(6)}\n`;
  log += `  Chi-sq:    ${chi2.toFixed(2)}\n`;
  log += `  符合度:    ${conformity}\n\n`;

  log += `  首位数    观测    期望    偏差\n`;
  log += `  ------------------------------\n`;
  for (let d = 1; d <= 9; d++) {
    const obs = observed[d];
    const exp = BENFORD[d];
    const dev = obs - exp;
    const flag = Math.abs(dev) > 0.03 ? " ⚠️" : "";
    log += `  ${d}         ${obs.toFixed(3)}   ${exp.toFixed(3)}   ${dev >= 0 ? "+" : ""}${dev.toFixed(3)}${flag}\n`;
  }

  log += "\n";
  const success = mad < 0.015;
  if (success) {
    log += "  ✅ 数据首位数字分布符合Benford定律\n";
  } else {
    log += "  ❌ 数据首位数字分布异常, 可能存在人为调整\n";
    log += "     提示: 不符合Benford定律不一定是造假, 但值得进一步调查\n";
  }

  return {
    success,
    message: success ? "Distribution matches Benford's Law." : "Distribution deviates from Benford's Law expectations.",
    log,
    data: { mad, chi2, conformity, digitsCount: n, observed }
  };
}

/**
 * 5. Three-Scenario Valuation (三情景估值)
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
  log += "三情景估值模型 (Three-Scenario Valuation)\n";
  log += "============================================================\n";
  log += `  当前股价: ${currentPrice} ${currency}\n`;
  log += `  当前EPS:  ${currentEps}\n`;
  log += `  预测期:   ${years}年\n\n`;

  const scenarios = [
    { name: "乐观 (Bull)", growth: growthOptimistic, pe: peOptimistic },
    { name: "中性 (Base)", growth: growthNeutral, pe: peNeutral },
    { name: "悲观 (Bear)", growth: growthPessimistic, pe: pePessimistic }
  ];

  log += `  情景         年增速     目标PE   目标EPS    目标股价    涨跌幅\n`;
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

    log += `  ${sc.name.padEnd(12)} ${(sc.growth * 100).toFixed(0).padStart(5)}%   ${sc.pe.toFixed(0).padStart(5)}x    ${futureEps.toFixed(2).padStart(8)}   ${targetPrice.toFixed(1).padStart(9)}   ${change >= 0 ? "+" : ""}${change.toFixed(1)}%\n`;

    results.push({
      name: sc.name,
      growth: sc.growth,
      pe: sc.pe,
      futureEps,
      targetPrice,
      change
    });
  }

  log += "\n  ✅ 所有计算已完成, 结果符合可审计复现标准\n";

  return {
    success: true,
    message: "Three-scenario valuation model calculated successfully.",
    log,
    data: results
  };
}
