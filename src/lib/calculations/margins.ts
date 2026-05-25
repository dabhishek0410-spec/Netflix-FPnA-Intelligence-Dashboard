/**
 * Calculates Gross Profit Margin: grossProfit / revenue
 */
export function calculateGrossMargin(grossProfit: number, revenue: number): number {
  if (revenue === 0) return 0;
  return grossProfit / revenue;
}

/**
 * Calculates Operating Margin: operatingIncome / revenue
 */
export function calculateOperatingMargin(operatingIncome: number, revenue: number): number {
  if (revenue === 0) return 0;
  return operatingIncome / revenue;
}

/**
 * Calculates Net Margin: netIncome / revenue
 */
export function calculateNetMargin(netIncome: number, revenue: number): number {
  if (revenue === 0) return 0;
  return netIncome / revenue;
}

export interface MarginSet {
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
}

/**
 * Convenience method to calculate gross, operating, and net margins
 */
export function calculateMargins(
  revenue: number,
  grossProfit: number,
  operatingIncome: number,
  netIncome: number
): MarginSet {
  return {
    grossMargin: calculateGrossMargin(grossProfit, revenue),
    operatingMargin: calculateOperatingMargin(operatingIncome, revenue),
    netMargin: calculateNetMargin(netIncome, revenue),
  };
}
