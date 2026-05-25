import { ScenarioType } from "@/types/forecast";
import { getScenarioAssumptions } from "./scenarioAssumptions";
import { historicalCorporateData } from "./historicalData";

/**
 * Projects corporate revenue for 2026-2030 based on scenario assumptions.
 * Starts from 2025 Actuals ($44,111M).
 */
export function forecastRevenue(scenario: ScenarioType): Record<number, number> {
  const assumptions = getScenarioAssumptions(scenario);
  const revenueGrowth = assumptions.revenueGrowth;

  const baseYearData = historicalCorporateData[historicalCorporateData.length - 1];
  const baseRevenue = baseYearData.incomeStatement.revenue; // 44111

  const results: Record<number, number> = {
    2025: baseRevenue,
  };

  let currentRevenue = baseRevenue;
  const years = [2026, 2027, 2028, 2029, 2030];

  for (const year of years) {
    const growthRate = revenueGrowth[year.toString()];
    if (growthRate !== undefined) {
      currentRevenue = currentRevenue * (1 + growthRate);
      results[year] = Math.round(currentRevenue * 100) / 100;
    }
  }

  return results;
}
