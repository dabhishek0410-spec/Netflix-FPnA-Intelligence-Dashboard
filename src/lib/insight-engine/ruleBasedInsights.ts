import { AnalystInsight } from "@/types/insights";
import { CorporateMetrics } from "@/types/financial";
import { RegionalSplit } from "@/types/regions";
import { ScenarioForecastResult, ScenarioType } from "@/types/forecast";
import { calculateYoYGrowth } from "../calculations/growth";
import { formatPercentage, formatBps, formatCurrency } from "../calculations/formatters";

/**
 * Scans historical actuals and forecasted scenarios to generate structured corporate FP&A insights.
 * Implements the 10 specified trigger rules across all relevant timelines and scenarios.
 */
export function generateRuleBasedInsights(
  historicalCorporate: CorporateMetrics[],
  historicalRegional: RegionalSplit[],
  forecasts: Record<ScenarioType, ScenarioForecastResult>
): AnalystInsight[] {
  const insights: AnalystInsight[] = [];
  const scenarios: ScenarioType[] = ["base", "bear", "bull"];

  // =========================================================================
  // RULE 1: Positive Operating Leverage (OpInc growth > Revenue growth)
  // Scan historical actuals & all forecast scenarios
  // =========================================================================
  
  // Historical Actuals for Rule 1
  for (let i = 1; i < historicalCorporate.length; i++) {
    const cur = historicalCorporate[i];
    const prev = historicalCorporate[i - 1];
    const revGrowth = calculateYoYGrowth(cur.incomeStatement.revenue, prev.incomeStatement.revenue);
    const opIncGrowth = calculateYoYGrowth(cur.incomeStatement.operatingIncome, prev.incomeStatement.operatingIncome);

    if (revGrowth > 0 && opIncGrowth > revGrowth) {
      insights.push({
        id: `Rule1_Hist_${cur.year}`,
        title: `Positive Operating Leverage Demonstrated in FY${cur.year}`,
        period: `FY${cur.year}`,
        metric: "Operating Income",
        actualValue: cur.incomeStatement.operatingIncome,
        priorValue: prev.incomeStatement.operatingIncome,
        variance: cur.incomeStatement.operatingIncome - prev.incomeStatement.operatingIncome,
        variancePercent: opIncGrowth,
        triggerRule: "Rule 1: Operating Income growth exceeds Revenue growth",
        explanation: `Operating income grew by ${formatPercentage(opIncGrowth)} on revenue growth of ${formatPercentage(revGrowth)}. This indicates that Netflix's subscription-based model is successfully scaling fixed content and operating expenses, allowing margin flow-through to accelerate.`,
        driver: "Scalable fixed cost base on content library.",
        sourceType: "Actual",
        confidence: "High",
        sourceReference: `10-K FY${cur.year}`,
      });
    }
  }

  // Dynamic Forecast Scenarios for Rule 1 (Operating Leverage / Deleverage)
  for (const scenario of scenarios) {
    const periods = forecasts[scenario].periods;
    for (let i = 0; i < periods.length; i++) {
      const cur = periods[i].metrics;
      const prev = i === 0 
        ? historicalCorporate[historicalCorporate.length - 1] 
        : periods[i - 1].metrics;

      const revGrowth = calculateYoYGrowth(cur.incomeStatement.revenue, prev.incomeStatement.revenue);
      const opIncGrowth = calculateYoYGrowth(cur.incomeStatement.operatingIncome, prev.incomeStatement.operatingIncome);

      if (revGrowth > 0) {
        if (opIncGrowth > revGrowth) {
          insights.push({
            id: `Rule1_FC_${scenario}_${cur.year}`,
            title: `Operating Leverage Expansion Projected for FY${cur.year} (${scenario.toUpperCase()} Case)`,
            period: `FY${cur.year}`,
            scenario: scenario,
            metric: "Operating Income",
            forecastValue: cur.incomeStatement.operatingIncome,
            priorValue: prev.incomeStatement.operatingIncome,
            variance: cur.incomeStatement.operatingIncome - prev.incomeStatement.operatingIncome,
            variancePercent: opIncGrowth,
            triggerRule: "Rule 1: Operating Income growth exceeds Revenue growth",
            explanation: `Operating income is projected to expand by ${formatPercentage(opIncGrowth)} YoY under ${scenario.toUpperCase()} Case parameters, outstripping forecasted revenue growth of ${formatPercentage(revGrowth)}. This delivers margin expansion as fixed amortized costs are distributed across a larger membership base.`,
            driver: "Optimized corporate opex margins and content leverage.",
            sourceType: "Analyst Assumption",
            confidence: "High",
            sourceReference: `${scenario.toUpperCase()} Forecast Model 2026-2030`,
          });
        } else {
          // Negative Operating Leverage (Operating Deleverage Warning)
          insights.push({
            id: `Rule1_FC_${scenario}_${cur.year}_Deleverage`,
            title: `Operating Margin Compression Warning in FY${cur.year} (${scenario.toUpperCase()} Case)`,
            period: `FY${cur.year}`,
            scenario: scenario,
            metric: "Operating Income",
            forecastValue: cur.incomeStatement.operatingIncome,
            priorValue: prev.incomeStatement.operatingIncome,
            variance: cur.incomeStatement.operatingIncome - prev.incomeStatement.operatingIncome,
            variancePercent: opIncGrowth,
            triggerRule: "Rule 1: Operating Deleverage (Operating Income underperforms Revenue growth)",
            explanation: `Operating income is projected to grow by only ${formatPercentage(opIncGrowth)} YoY under active ${scenario.toUpperCase()} parameters, underperforming revenue growth of ${formatPercentage(revGrowth)}. This negative operating leverage signals margin contraction as operational costs grow faster than subscriber additions.`,
            driver: "Rigid opex structures and high straight-line content library amortization.",
            sourceType: "Analyst Assumption",
            confidence: "High",
            sourceReference: `${scenario.toUpperCase()} Forecast Model 2026-2030`,
          });
        }
      }
    }
  }

  // =========================================================================
  // RULE 2: Expense Margin Drag (Expense growth > Revenue growth + 5 percentage points for actuals, +0 percentage points for forecasts)
  // Check across all scenarios
  // =========================================================================
  for (const scenario of scenarios) {
    const periods = forecasts[scenario].periods;
    for (let i = 0; i < periods.length; i++) {
      const cur = periods[i].metrics;
      const prev = i === 0 
        ? historicalCorporate[historicalCorporate.length - 1] 
        : periods[i - 1].metrics;

      const revGrowth = calculateYoYGrowth(cur.incomeStatement.revenue, prev.incomeStatement.revenue);
      const totalExpensesCur = cur.incomeStatement.costOfRevenues + cur.incomeStatement.operatingExpenses;
      const totalExpensesPrev = prev.incomeStatement.costOfRevenues + prev.incomeStatement.operatingExpenses;
      const expGrowth = calculateYoYGrowth(totalExpensesCur, totalExpensesPrev);

      // Forecast scenario threshold is set to +0.0% to catch all operational drags
      if (expGrowth > revGrowth) {
        insights.push({
          id: `Rule2_FC_${scenario}_${cur.year}`,
          title: `Expense Margin Drag Warning in FY${cur.year} (${scenario.toUpperCase()} Case)`,
          period: `FY${cur.year}`,
          scenario: scenario,
          metric: "Total Expenses",
          forecastValue: totalExpensesCur,
          priorValue: totalExpensesPrev,
          variance: totalExpensesCur - totalExpensesPrev,
          variancePercent: expGrowth,
          triggerRule: "Rule 2: Expense growth exceeds Revenue growth",
          explanation: `Total expenses are projected to grow by ${formatPercentage(expGrowth)} YoY under active ${scenario.toUpperCase()} parameters, which is ${formatPercentage(expGrowth - revGrowth)} faster than revenue growth of ${formatPercentage(revGrowth)}. This creates significant negative leverage, driving immediate operating margin contraction.`,
          driver: "Sticky production overhead and international operational inefficiencies.",
          sourceType: "Analyst Assumption",
          confidence: "Medium",
          sourceReference: `${scenario.toUpperCase()} Forecast Model 2026-2030`,
        });
      }
    }
  }

  // =========================================================================
  // RULE 3: Regional Outperformer (Regional growth > Total growth + 3 percentage points)
  // Check across all forecast scenarios
  // =========================================================================
  for (const scenario of scenarios) {
    const periods = forecasts[scenario].periods;
    for (let i = 0; i < periods.length; i++) {
      const curReg = periods[i].regionalMetrics;
      const prevReg = i === 0 
        ? historicalRegional[historicalRegional.length - 1] 
        : periods[i - 1].regionalMetrics;

      const totalGrowth = calculateYoYGrowth(curReg.totalRevenue, prevReg.totalRevenue);
      const regions: ("UCAN" | "EMEA" | "LATAM" | "APAC")[] = ["UCAN", "EMEA", "LATAM", "APAC"];
      
      for (const reg of regions) {
        const regGrowth = calculateYoYGrowth(curReg.regions[reg].revenue, prevReg.regions[reg].revenue);
        if (regGrowth > totalGrowth + 0.03) {
          insights.push({
            id: `Rule3_FC_${scenario}_${curReg.year}_${reg}`,
            title: `${reg} Regional Growth Outperformance in FY${curReg.year} (${scenario.toUpperCase()} Case)`,
            period: `FY${curReg.year}`,
            scenario: scenario,
            metric: `${reg} Segment Revenue`,
            forecastValue: curReg.regions[reg].revenue,
            priorValue: prevReg.regions[reg].revenue,
            variance: curReg.regions[reg].revenue - prevReg.regions[reg].revenue,
            variancePercent: regGrowth,
            triggerRule: "Rule 3: Regional growth exceeds total growth by > 3 percentage points",
            explanation: `${reg} segment revenue is projected to grow by ${formatPercentage(regGrowth)} YoY under ${scenario.toUpperCase()} Case parameters, outperforming total corporate growth of ${formatPercentage(totalGrowth)} by ${formatPercentage(regGrowth - totalGrowth)}. This highlights a highly favorable competitive dynamic or pricing elasticity in this region.`,
            driver: `APAC/EMEA growth premium driven by high local-language content engagement and ad-tier conversion.`,
            sourceType: "Analyst Assumption",
            confidence: "Medium",
            sourceReference: `${scenario.toUpperCase()} Regional Split Forecast Engine`,
          });
        }
      }
    }
  }

  // =========================================================================
  // RULE 4: Content Cost Pressure (Cost of revenues % of revenue increases > 1% YoY for actuals, > 0.5% YoY for forecasts)
  // Check actuals and all forecast scenarios
  // =========================================================================
  
  // Historical Actuals for Rule 4
  for (let i = 1; i < historicalCorporate.length; i++) {
    const cur = historicalCorporate[i];
    const prev = historicalCorporate[i - 1];
    const curCostRatio = cur.incomeStatement.costOfRevenues / cur.incomeStatement.revenue;
    const prevCostRatio = prev.incomeStatement.costOfRevenues / prev.incomeStatement.revenue;

    if (curCostRatio > prevCostRatio + 0.01) {
      insights.push({
        id: `Rule4_Hist_${cur.year}`,
        title: `Content Amortization & Delivery Cost Pressure in FY${cur.year}`,
        period: `FY${cur.year}`,
        metric: "Cost of Revenues % of Revenue",
        actualValue: curCostRatio,
        priorValue: prevCostRatio,
        variance: curCostRatio - prevCostRatio,
        variancePercent: (curCostRatio - prevCostRatio),
        triggerRule: "Rule 4: Cost of revenues as % of revenue increases by > 1 percentage point YoY",
        explanation: `Cost of revenues as a percentage of revenue increased from ${formatPercentage(prevCostRatio)} to ${formatPercentage(curCostRatio)}, an expansion of ${formatBps(curCostRatio - prevCostRatio)}. This indicates that content amortization or delivery scale costs are expanding faster than top-line monetisation.`,
        driver: "Increased content amortization from legacy big-budget deals.",
        sourceType: "Actual",
        confidence: "High",
        sourceReference: `10-K FY${cur.year}`,
      });
    }
  }

  // Forecast Scenarios for Rule 4 (Threshold is set to +0.5% to reflect forecast increments)
  for (const scenario of scenarios) {
    const periods = forecasts[scenario].periods;
    for (let i = 0; i < periods.length; i++) {
      const cur = periods[i].metrics;
      const prev = i === 0 
        ? historicalCorporate[historicalCorporate.length - 1] 
        : periods[i - 1].metrics;

      const curCostRatio = cur.incomeStatement.costOfRevenues / cur.incomeStatement.revenue;
      const prevCostRatio = prev.incomeStatement.costOfRevenues / prev.incomeStatement.revenue;

      if (curCostRatio > prevCostRatio + 0.005) {
        insights.push({
          id: `Rule4_FC_${scenario}_${cur.year}`,
          title: `Projected Content Cost Pressure in FY${cur.year} (${scenario.toUpperCase()} Case)`,
          period: `FY${cur.year}`,
          scenario: scenario,
          metric: "Cost of Revenues % of Revenue",
          forecastValue: curCostRatio,
          priorValue: prevCostRatio,
          variance: curCostRatio - prevCostRatio,
          variancePercent: (curCostRatio - prevCostRatio),
          triggerRule: "Rule 4: Cost of revenues as % of revenue increases YoY",
          explanation: `Cost of revenues as a percentage of revenue is projected to increase from ${formatPercentage(prevCostRatio)} to ${formatPercentage(curCostRatio)} YoY in the ${scenario.toUpperCase()} Case, expanding by ${formatBps(curCostRatio - prevCostRatio)}. This marks a potential margin squeeze as content outlays outpace pricing adjustments.`,
          driver: "Escalated licensing fees or straight-line library amortization surges.",
          sourceType: "Analyst Assumption",
          confidence: "Medium",
          sourceReference: `${scenario.toUpperCase()} Expense Projection Module`,
        });
      }
    }
  }

  // =========================================================================
  // RULE 5: G&A One-time / Transaction Pressure (G&A growth > 25% YoY)
  // Check across all scenarios
  // =========================================================================
  for (const scenario of scenarios) {
    const periods = forecasts[scenario].periods;
    for (let i = 0; i < periods.length; i++) {
      const cur = periods[i].metrics;
      const prev = i === 0 
        ? historicalCorporate[historicalCorporate.length - 1] 
        : periods[i - 1].metrics;

      const gaGrowth = calculateYoYGrowth(cur.incomeStatement.generalAndAdministrative, prev.incomeStatement.generalAndAdministrative);
      
      if (gaGrowth > 0.25) {
        insights.push({
          id: `Rule5_FC_${scenario}_${cur.year}`,
          title: `G&A Expense Spike & Restructuring Friction in FY${cur.year} (${scenario.toUpperCase()} Case)`,
          period: `FY${cur.year}`,
          scenario: scenario,
          metric: "G&A Expenses",
          forecastValue: cur.incomeStatement.generalAndAdministrative,
          priorValue: prev.incomeStatement.generalAndAdministrative,
          variance: cur.incomeStatement.generalAndAdministrative - prev.incomeStatement.generalAndAdministrative,
          variancePercent: gaGrowth,
          triggerRule: "Rule 5: G&A growth is > 25% YoY (indicative of one-time transactions or restructuring)",
          explanation: `General & administrative expenses spike by ${formatPercentage(gaGrowth)} YoY under ${scenario.toUpperCase()} Case parameters, rising to ${formatCurrency(cur.incomeStatement.generalAndAdministrative, true)}. This extraordinary growth indicates severe G&A friction, transaction-related advisory charges, or structural integration events.`,
          driver: "One-time corporate transactions, litigation settlement provisions, or M&A restructuring expenses.",
          sourceType: "Analyst Assumption",
          confidence: "Medium",
          sourceReference: `${scenario.toUpperCase()} Scenario Restructuring Plan`,
        });
      }
    }
  }

  // =========================================================================
  // RULE 6: FX Impact (Reported vs. FX-neutral growth difference > 2 percentage points)
  // Handled for FY2022 historical (Actual Netflix shock year)
  // =========================================================================
  const h2022 = historicalCorporate.find(d => d.year === 2022);
  const h2021 = historicalCorporate.find(d => d.year === 2021);
  if (h2022 && h2021) {
    const fxNeutralGrowth2022 = 0.100; // 10% FX-neutral growth
    const reportedGrowth2022 = calculateYoYGrowth(
      h2022.incomeStatement.revenue,
      h2021.incomeStatement.revenue
    );

    if (Math.abs(fxNeutralGrowth2022 - reportedGrowth2022) > 0.02) {
      insights.push({
        id: `Rule6_Hist_2022`,
        title: `Significant Currency Headwinds Impacting FY2022 Reported Growth`,
        period: "FY2022",
        metric: "Revenue growth rate",
        actualValue: reportedGrowth2022,
        priorValue: fxNeutralGrowth2022,
        variance: reportedGrowth2022 - fxNeutralGrowth2022,
        variancePercent: reportedGrowth2022 - fxNeutralGrowth2022,
        triggerRule: "Rule 6: Difference between Reported and FX-Neutral growth exceeds 2 percentage points",
        explanation: `Reported revenue growth of ${formatPercentage(reportedGrowth2022)} was severely depressed by a strong USD compared to FX-neutral revenue growth of ${formatPercentage(fxNeutralGrowth2022)}. This represents an FX haircut of ${formatBps(fxNeutralGrowth2022 - reportedGrowth2022)} on top-line growth.`,
        driver: "Strengthening of the US Dollar against EUR, GBP, and JPY.",
        sourceType: "Actual",
        confidence: "High",
        sourceReference: "FY2022 Netflix Shareholder Letter",
      });
    }
  }

  // =========================================================================
  // RULE 7: Forecast Upside (Bull case revenue > Base case by > 5% by 2030)
  // Assign dynamically to BULL scenario
  // =========================================================================
  const base2030Rev = forecasts.base.periods[4].metrics.incomeStatement.revenue;
  const bull2030Rev = forecasts.bull.periods[4].metrics.incomeStatement.revenue;
  const revUpside = (bull2030Rev - base2030Rev) / base2030Rev;

  if (revUpside > 0.05) {
    insights.push({
      id: `Rule7_FC_2030`,
      title: `Substantial Top-Line Forecast Upside Potential by FY2030`,
      period: "FY2030",
      scenario: "bull",
      metric: "Projected Revenue",
      forecastValue: bull2030Rev,
      priorValue: base2030Rev,
      variance: bull2030Rev - base2030Rev,
      variancePercent: revUpside,
      triggerRule: "Rule 7: Bull case revenue exceeds Base case by > 5% in the terminal year (2030)",
      explanation: `The Bull case scenario projects terminal 2030 revenue of ${formatCurrency(bull2030Rev, true)}, representing a ${formatPercentage(revUpside)} upside over the Base case projection of ${formatCurrency(base2030Rev, true)}. This reflects significant ad-tier and gaming monetization accelerators.`,
      driver: "Rapid scale-up of global ad network and licensing revenue streams.",
      sourceType: "Historical Trend",
      confidence: "Medium",
      sourceReference: "Scenario Sensitivity Summary",
    });
  }

  // =========================================================================
  // RULE 8: Forecast Downside (Bear case operating margin > 200 bps below Base case by 2030)
  // Assign dynamically to BEAR scenario to prevent leakage into Bull or Base
  // =========================================================================
  const base2030Margin = forecasts.base.periods[4].metrics.incomeStatement.operatingMargin;
  const bear2030Margin = forecasts.bear.periods[4].metrics.incomeStatement.operatingMargin;
  const marginGap = base2030Margin - bear2030Margin;

  if (marginGap > 0.02) {
    insights.push({
      id: `Rule8_FC_2030`,
      title: `Critical Terminal Margin Downside Risk Exposed (Bear Case)`,
      period: "FY2030",
      scenario: "bear",
      metric: "Operating Margin",
      forecastValue: bear2030Margin,
      priorValue: base2030Margin,
      variance: -marginGap,
      variancePercent: -marginGap,
      triggerRule: "Rule 8: Bear case operating margin is > 200 bps below the Base case by 2030",
      explanation: `In the Bear scenario, Netflix's 2030 operating margin falls to ${formatPercentage(bear2030Margin)}, which is ${formatBps(marginGap)} lower than the Base case of ${formatPercentage(base2030Margin)}. This downside highlights margin vulnerability if subscriber growth stalls and content inflation persists.`,
      driver: "Loss of pricing power and sticky operational fixed expenses.",
      sourceType: "Historical Trend",
      confidence: "Medium",
      sourceReference: "Scenario Margin Variance Report",
    });
  }

  // =========================================================================
  // RULE 9: FCF Expansion (FCF conversion improves > 300 bps over forecast 2025 to 2030)
  // Scan actuals and all forecast scenarios
  // =========================================================================
  
  // Historical Actuals for Rule 9 (YoY 2022 to 2023 had massive FCF expansion)
  const h2022_cf = historicalCorporate.find(d => d.year === 2022);
  const h2023_cf = historicalCorporate.find(d => d.year === 2023);
  if (h2022_cf && h2023_cf) {
    const fcfConv2022 = h2022_cf.cashFlowStatement.fcfConversionOfRevenue;
    const fcfConv2023 = h2023_cf.cashFlowStatement.fcfConversionOfRevenue;
    const histFcfExpansion = fcfConv2023 - fcfConv2022;

    if (histFcfExpansion > 0.03) {
      insights.push({
        id: `Rule9_Hist_2023`,
        title: `Incredible Free Cash Flow Conversion Expansion in FY2023`,
        period: "FY2023",
        metric: "FCF Conversion of Revenue",
        actualValue: fcfConv2023,
        priorValue: fcfConv2022,
        variance: histFcfExpansion,
        variancePercent: histFcfExpansion,
        triggerRule: "Rule 9: Free Cash Flow conversion of revenue improves by > 300 bps",
        explanation: `Free cash flow conversion of revenue grew from ${formatPercentage(fcfConv2022)} in 2022 to ${formatPercentage(fcfConv2023)} in 2023, a massive increase of ${formatBps(histFcfExpansion)}. This structural turnaround was driven by a temporary reduction in content cash spent due to Hollywood strikes combined with sustained subscriber gains.`,
        driver: "Lower operational content spend combined with ongoing membership expansion.",
        sourceType: "Actual",
        confidence: "High",
        sourceReference: "FY2023 Statement of Cash Flows",
      });
    }
  }

  // Forecast Scenarios for Rule 9 (Improvement from 2025 actual to 2030 terminal)
  const actual2025FcfConv = historicalCorporate[historicalCorporate.length - 1].cashFlowStatement.fcfConversionOfRevenue;
  
  for (const scenario of scenarios) {
    const periods = forecasts[scenario].periods;
    const terminal2030FcfConv = periods[4].metrics.cashFlowStatement.fcfConversionOfRevenue;
    const forecastFcfExpansion = terminal2030FcfConv - actual2025FcfConv;

    if (forecastFcfExpansion > 0.03) {
      insights.push({
        id: `Rule9_FC_${scenario}_2030`,
        title: `FCF Conversion Reaches Record High by 2030 (${scenario.toUpperCase()} Case)`,
        period: "FY2030",
        scenario: scenario,
        metric: "FCF Conversion of Revenue",
        forecastValue: terminal2030FcfConv,
        priorValue: actual2025FcfConv,
        variance: forecastFcfExpansion,
        variancePercent: forecastFcfExpansion,
        triggerRule: "Rule 9: Free Cash Flow conversion of revenue improves by > 300 bps over the forecast period",
        explanation: `Free cash flow conversion of revenue is projected to reach ${formatPercentage(terminal2030FcfConv)} by 2030 in the ${scenario.toUpperCase()} Case, representing an expansion of ${formatBps(forecastFcfExpansion)} over the 2025 base conversion. This reveals a highly cash-generative corporate engine under active scenario parameters.`,
        driver: "Rapid operating margin growth and highly efficient content capital deployment.",
        sourceType: "Analyst Assumption",
        confidence: "High",
        sourceReference: `${scenario.toUpperCase()} Cash Flow Model`,
      });
    }
  }

  // =========================================================================
  // RULE 10: Regional Forecast Dependence (APAC/EMEA contributes > 50% of growth)
  // Check across all scenarios
  // =========================================================================
  const base2025Reg = historicalRegional[historicalRegional.length - 1]; // 2025 actual regional

  for (const scenario of scenarios) {
    const periods = forecasts[scenario].periods;
    const reg2030 = periods[4].regionalMetrics; // 2030 forecasted regional

    const totalGrowth2025To2030 = reg2030.totalRevenue - base2025Reg.totalRevenue;
    const emeaGrowth = reg2030.regions.EMEA.revenue - base2025Reg.regions.EMEA.revenue;
    const apacGrowth = reg2030.regions.APAC.revenue - base2025Reg.regions.APAC.revenue;
    const contribution = (emeaGrowth + apacGrowth) / totalGrowth2025To2030;

    if (contribution > 0.50) {
      insights.push({
        id: `Rule10_FC_${scenario}_2030`,
        title: `High Regional Dependence on EMEA and APAC for Growth (${scenario.toUpperCase()} Case)`,
        period: "FY2026-FY2030",
        scenario: scenario,
        metric: "Growth Contribution Share",
        forecastValue: contribution,
        variancePercent: contribution,
        triggerRule: "Rule 10: EMEA & APAC contribute > 50% of forecasted growth",
        explanation: `Combined, the EMEA and APAC regional segments are projected to deliver ${formatPercentage(contribution)} of Netflix's total top-line growth over the next five years under the active ${scenario.toUpperCase()} Case. This indicates that Netflix's expansion is heavily dependent on international customer acquisition, while domestic markets (UCAN) reach maturity.`,
        driver: "Saturated domestic market scaling vs. expanding international ad-tier and local content programs.",
        sourceType: "Historical Trend",
        confidence: "High",
        sourceReference: `${scenario.toUpperCase()} Regional Growth Share Analysis`,
      });
    }
  }

  return insights;
}
