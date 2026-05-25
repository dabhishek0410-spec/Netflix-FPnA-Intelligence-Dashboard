import { ScenarioType, ScenarioForecastResult, ForecastPeriod } from "@/types/forecast";
import { forecastRevenue } from "./forecastRevenue";
import { forecastIncomeStatement } from "./forecastExpenses";
import { forecastRegionalRevenue } from "./forecastRegionalRevenue";
import { forecastCashFlowAndBalanceSheet } from "./forecastCashFlow";
import { historicalCorporateData, historicalRegionalData } from "./historicalData";
import { CorporateMetrics } from "@/types/financial";

/**
 * Executes a full 5-year forecast (2026-2030) for a given scenario.
 * Returns an integrated set of financial statements, regional splits, and metrics.
 */
export function generateForecast(scenario: ScenarioType): ScenarioForecastResult {
  const projectedRevenues = forecastRevenue(scenario);
  const years = [2026, 2027, 2028, 2029, 2030];
  const periods: ForecastPeriod[] = [];

  let priorCorporate = historicalCorporateData[historicalCorporateData.length - 1];
  let priorRegional = historicalRegionalData[historicalRegionalData.length - 1];

  for (const year of years) {
    const revenue = projectedRevenues[year];
    const priorRevenue = priorCorporate.incomeStatement.revenue;
    const growthRate = (revenue - priorRevenue) / priorRevenue;

    // 1. Forecast Income Statement expenses
    const incomeStatement = forecastIncomeStatement(year, revenue, scenario, priorCorporate.incomeStatement);

    // 2. Forecast Regional Splits
    const regionalSplit = forecastRegionalRevenue(year, revenue, growthRate, scenario, priorRegional);

    // 3. Forecast Cash Flows & Balance Sheet
    const { cashFlow, balanceSheet, contentAssets } = forecastCashFlowAndBalanceSheet(
      year,
      revenue,
      incomeStatement.operatingIncome,
      incomeStatement.netIncome,
      incomeStatement.costOfRevenues,
      scenario,
      priorCorporate.balanceSheet,
      priorCorporate.contentAssets
    );

    // Paid memberships and ARPU are aligned with regional aggregates
    const paidMemberships = regionalSplit.totalMemberships;
    const arpu = Math.round((revenue / (paidMemberships || 1) / 12) * 100) / 100;

    const corporateMetrics: CorporateMetrics = {
      year,
      incomeStatement,
      cashFlowStatement: cashFlow,
      balanceSheet,
      contentAssets,
      paidMemberships,
      arpu,
    };

    periods.push({
      year,
      scenario,
      metrics: corporateMetrics,
      regionalMetrics: regionalSplit,
    });

    priorCorporate = corporateMetrics;
    priorRegional = regionalSplit;
  }

  return {
    scenario,
    periods,
  };
}

/**
 * Helper to generate forecasts for all three scenarios (Base, Bear, Bull).
 */
export function generateAllForecasts(): Record<ScenarioType, ScenarioForecastResult> {
  return {
    base: generateForecast("base"),
    bear: generateForecast("bear"),
    bull: generateForecast("bull"),
  };
}
