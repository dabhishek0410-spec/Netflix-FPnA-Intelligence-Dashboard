/**
 * Calculates G&A as a percentage of revenue
 */
export function calculateGaAPercentOfRevenue(gaa: number, revenue: number): number {
  if (revenue === 0) return 0;
  return gaa / revenue;
}

/**
 * Calculates S&M (Marketing) as a percentage of revenue
 */
export function calculateSmPercentOfRevenue(marketing: number, revenue: number): number {
  if (revenue === 0) return 0;
  return marketing / revenue;
}

/**
 * Calculates Tech & Dev as a percentage of revenue
 */
export function calculateTechDevPercentOfRevenue(techDev: number, revenue: number): number {
  if (revenue === 0) return 0;
  return techDev / revenue;
}

/**
 * Calculates Free Cash Flow conversion of Revenue: FCF / Revenue
 */
export function calculateFCFConversionOfRevenue(fcf: number, revenue: number): number {
  if (revenue === 0) return 0;
  return fcf / revenue;
}

/**
 * Calculates Free Cash Flow conversion of Operating Income: FCF / Operating Income
 */
export function calculateFCFConversionOfOperatingIncome(fcf: number, operatingIncome: number): number {
  if (operatingIncome === 0) return 0;
  return fcf / operatingIncome;
}
