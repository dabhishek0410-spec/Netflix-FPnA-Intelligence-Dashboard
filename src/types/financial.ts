export interface ContentAssetMetrics {
  additions: number; // Cash spent on content additions
  amortization: number; // Content asset amortization (expense)
  netBookValue: number; // Net content assets on balance sheet
  changeYoY?: number;
  changeYoYPercent?: number;
}

export interface IncomeStatement {
  revenue: number;
  costOfRevenues: number; // Content amortization + other delivery costs
  grossProfit: number;
  grossMargin: number;
  marketing: number;
  technologyAndDevelopment: number;
  generalAndAdministrative: number;
  operatingExpenses: number; // Total OpEx (marketing + tech + G&A)
  operatingIncome: number;
  operatingMargin: number;
  netIncome: number;
  netMargin: number;
}

export interface CashFlowStatement {
  operatingCashFlow: number;
  capitalExpenditures: number;
  freeCashFlow: number;
  fcfConversionOfRevenue: number; // FCF / Revenue
  fcfConversionOfOperatingIncome: number; // FCF / Operating Income
}

export interface BalanceSheet {
  cashAndEquivalents: number;
  contentAssetsNet: number;
  otherAssets: number;
  totalAssets: number;
  shortTermDebt: number;
  longTermDebt: number;
  totalDebt: number;
  otherLiabilities: number;
  totalLiabilities: number;
  equity: number;
}

export interface CorporateMetrics {
  year: number;
  quarter?: "Q1" | "Q2" | "Q3" | "Q4";
  incomeStatement: IncomeStatement;
  cashFlowStatement: CashFlowStatement;
  balanceSheet: BalanceSheet;
  contentAssets: ContentAssetMetrics;
  paidMemberships?: number; // In millions, e.g., 280.5
  arpu?: number; // Average Revenue per User / membership per month, e.g., $11.80
}
