/**
 * Calculates YoY growth rate: (current - prior) / Math.abs(prior)
 * Returns 0 if prior is 0 to avoid division by zero or NaN.
 */
export function calculateYoYGrowth(current: number, prior: number): number {
  if (prior === 0) return 0;
  return (current - prior) / Math.abs(prior);
}

/**
 * Calculates sequential (QoQ) growth rate: (current - prior) / Math.abs(prior)
 * Returns 0 if prior is 0.
 */
export function calculateSequentialGrowth(current: number, prior: number): number {
  if (prior === 0) return 0;
  return (current - prior) / Math.abs(prior);
}

/**
 * Calculates Compound Annual Growth Rate (CAGR)
 * Formula: (endValue / startValue) ^ (1 / periods) - 1
 * Returns 0 if startValue or endValue is less than or equal to 0, or periods is less than or equal to 0.
 */
export function calculateCAGR(endValue: number, startValue: number, periods: number): number {
  if (startValue <= 0 || endValue <= 0 || periods <= 0) return 0;
  return Math.pow(endValue / startValue, 1 / periods) - 1;
}
