import { CorporateMetrics } from "./financial";
import { RegionalSplit } from "./regions";

export type ScenarioType = "base" | "bear" | "bull";

export interface ScenarioGrowthAssumptions {
  revenueGrowth: Record<string, number>;
  operatingMargin: Record<string, number>;
  regionalGrowthPremium: Record<string, number>; // UCAN, EMEA, LATAM, APAC premiums
  fcfConversionOfRevenue: Record<string, number>;
}

export type ForecastAssumptions = Record<ScenarioType, ScenarioGrowthAssumptions>;

export interface ForecastPeriod {
  year: number;
  scenario: ScenarioType;
  metrics: CorporateMetrics;
  regionalMetrics: RegionalSplit;
}

export interface ScenarioForecastResult {
  scenario: ScenarioType;
  periods: ForecastPeriod[];
}

export interface SensitivityCell {
  revenueGrowth: number;
  operatingMargin: number;
  endingRevenue2030: number;
  endingOperatingMargin2030: number;
  endingFCF2030: number;
}

export interface SensitivityGrid {
  revenueGrowthAxis: number[]; // row values
  operatingMarginAxis: number[]; // col values
  grid: SensitivityCell[][];
}
