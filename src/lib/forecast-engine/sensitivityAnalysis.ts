import { SensitivityGrid, SensitivityCell } from "@/types/forecast";
import { historicalCorporateData } from "./historicalData";

/**
 * Generates a financial sensitivity grid for 2030.
 * Rows represent different Revenue CAGR assumptions, and columns represent 2030 Operating Margin targets.
 */
export function generateSensitivityGrid(
  growthRates: number[] = [0.05, 0.07, 0.09, 0.11, 0.13, 0.15],
  margins: number[] = [0.28, 0.30, 0.32, 0.34, 0.36]
): SensitivityGrid {
  const baseYearData = historicalCorporateData[historicalCorporateData.length - 1];
  const baseRevenue = baseYearData.incomeStatement.revenue; // 44111

  // 2030 Base FCF conversion of revenue is 22% (0.22)
  const fcfConversion = 0.22;

  const grid: SensitivityCell[][] = [];

  for (const rGrowth of growthRates) {
    const row: SensitivityCell[] = [];
    
    // Project 2030 ending revenue by compounding rGrowth for 5 years (2026-2030) starting from 2025 actual
    const endingRevenue2030 = Math.round(baseRevenue * Math.pow(1 + rGrowth, 5) * 100) / 100;

    for (const opMargin of margins) {
      // Ending FCF scales in tandem with revenue using the 2030 terminal conversion rate (22%)
      // For more sensitivity, we can also scale it slightly with operating margin adjustments (e.g. +0.5x margin delta)
      // Let's keep it simple and mathematically clean: FCF = Revenue * fcfConversion
      // But adding an adjustment for operating leverage makes it even more professional!
      // If margin is higher than 30% baseline, FCF conversion improves. E.g. fcfConversion = 0.22 + (opMargin - 0.33) * 0.8
      const adjustedFcfConversion = Math.max(0.10, Math.round((fcfConversion + (opMargin - 0.335) * 0.7) * 1000) / 1000);
      const endingFCF2030 = Math.round(endingRevenue2030 * adjustedFcfConversion * 100) / 100;

      row.push({
        revenueGrowth: rGrowth,
        operatingMargin: opMargin,
        endingRevenue2030,
        endingOperatingMargin2030: opMargin,
        endingFCF2030,
      });
    }

    grid.push(row);
  }

  return {
    revenueGrowthAxis: growthRates,
    operatingMarginAxis: margins,
    grid,
  };
}
