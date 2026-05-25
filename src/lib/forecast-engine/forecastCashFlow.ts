import { ScenarioType } from "@/types/forecast";
import { CashFlowStatement, BalanceSheet, ContentAssetMetrics } from "@/types/financial";
import { getScenarioAssumptions } from "./scenarioAssumptions";
import { historicalCorporateData } from "./historicalData";

/**
 * Projects Free Cash Flow and integrates it with the Balance Sheet and Content Asset metrics.
 * Uses target FCF conversion of revenue.
 */
export function forecastCashFlowAndBalanceSheet(
  year: number,
  revenue: number,
  operatingIncome: number,
  netIncome: number,
  costOfRevenues: number,
  scenario: ScenarioType,
  priorYearBalanceSheet?: BalanceSheet,
  priorYearContentAssets?: ContentAssetMetrics
): {
  cashFlow: CashFlowStatement;
  balanceSheet: BalanceSheet;
  contentAssets: ContentAssetMetrics;
} {
  const assumptions = getScenarioAssumptions(scenario);
  const fcfConversion = assumptions.fcfConversionOfRevenue[year.toString()] || 0.20;

  // 1. Free Cash Flow Projections
  const freeCashFlow = Math.round(revenue * fcfConversion * 100) / 100;
  
  // Capex is modeled as 1.13% of revenue (historical trend)
  const capitalExpenditures = Math.round(revenue * 0.0113 * 100) / 100;
  
  // FCF = Operating Cash Flow - Capex => Operating Cash Flow = FCF + Capex
  const operatingCashFlow = Math.round((freeCashFlow + capitalExpenditures) * 100) / 100;

  const fcfConversionOfRevenue = Math.round((freeCashFlow / revenue) * 1000) / 1000;
  const fcfConversionOfOperatingIncome = Math.round((freeCashFlow / operatingIncome) * 1000) / 1000;

  const cashFlow: CashFlowStatement = {
    operatingCashFlow,
    capitalExpenditures: -capitalExpenditures, // Stored as a negative outflow
    freeCashFlow,
    fcfConversionOfRevenue,
    fcfConversionOfOperatingIncome,
  };

  // 2. Content Asset Metrics (T-Account model)
  // Content amortization is typically ~85% of Cost of Revenues for Netflix
  const amortization = Math.round(costOfRevenues * 0.85 * 100) / 100;
  
  // Spend on Content Additions (additions vs amortization ratio depends on scenario)
  // Bull case: Netflix increases library spend, base case is moderate additions, bear case limits spend
  let additionsRatio = 1.15; // standard base
  if (scenario === "bull") additionsRatio = 1.25;
  if (scenario === "bear") additionsRatio = 1.05;

  const additions = Math.round(amortization * additionsRatio * 100) / 100;

  // Retrieve base values from 2025 actuals if prior is not supplied
  const baseBS = priorYearBalanceSheet || historicalCorporateData[historicalCorporateData.length - 1].balanceSheet;
  const baseCA = priorYearContentAssets || historicalCorporateData[historicalCorporateData.length - 1].contentAssets;

  // Content Asset T-Account: Ending Net Book Value = Prior Net Book Value + Additions - Amortization
  const contentAssetsNet = Math.round((baseBS.contentAssetsNet + additions - amortization) * 100) / 100;

  const contentAssets: ContentAssetMetrics = {
    additions,
    amortization,
    netBookValue: contentAssetsNet,
  };

  // 3. Balance Sheet Projections
  // Cash rolls forward: Ending Cash = Prior Cash + FCF - Debt Paydowns
  // Assume a slight debt paydown in Base/Bull and debt accumulation or flat in Bear
  let debtPaydown = 0;
  if (scenario === "base" || scenario === "bull") {
    debtPaydown = 500; // pay down $500M of long term debt per year
  }

  const cashAndEquivalents = Math.round((baseBS.cashAndEquivalents + freeCashFlow - debtPaydown) * 100) / 100;

  const shortTermDebt = baseBS.shortTermDebt; // keep short-term stable
  const longTermDebt = Math.max(0, Math.round((baseBS.longTermDebt - debtPaydown) * 100) / 100);
  const totalDebt = Math.round((shortTermDebt + longTermDebt) * 100) / 100;

  // Equity increases by Net Income (retained earnings)
  const equity = Math.round((baseBS.equity + netIncome) * 100) / 100;

  // Other liabilities scale with revenue growth
  const revenueGrowthFactor = priorYearBalanceSheet ? (revenue / (baseBS.totalAssets * 0.8)) : 1.10; // estimate
  const otherLiabilities = Math.round(baseBS.otherLiabilities * 1.05 * 100) / 100; // grows at steady 5%

  const totalLiabilities = Math.round((totalDebt + otherLiabilities) * 100) / 100;

  // Balance sheet must balance: Assets = Liabilities + Equity
  const totalAssets = Math.round((totalLiabilities + equity) * 100) / 100;

  // Other Assets is the plug to ensure balance sheet balances perfectly
  const otherAssets = Math.round((totalAssets - cashAndEquivalents - contentAssetsNet) * 100) / 100;

  const balanceSheet: BalanceSheet = {
    cashAndEquivalents,
    contentAssetsNet,
    otherAssets,
    totalAssets,
    shortTermDebt,
    longTermDebt,
    totalDebt,
    otherLiabilities,
    totalLiabilities,
    equity,
  };

  return {
    cashFlow,
    balanceSheet,
    contentAssets,
  };
}
