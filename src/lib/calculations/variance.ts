/**
 * Calculates absolute variance: current - prior
 */
export function calculateAbsoluteVariance(current: number, prior: number): number {
  return current - prior;
}

/**
 * Calculates percent variance: (current - prior) / Math.abs(prior)
 * Returns 0 if prior is 0 to avoid division by zero or NaN.
 */
export function calculatePercentVariance(current: number, prior: number): number {
  if (prior === 0) return 0;
  return (current - prior) / Math.abs(prior);
}

export interface VarianceResult {
  absolute: number;
  percent: number;
}

/**
 * Helper to compute both absolute and percentage variance
 */
export function calculateVariance(current: number, prior: number): VarianceResult {
  return {
    absolute: calculateAbsoluteVariance(current, prior),
    percent: calculatePercentVariance(current, prior),
  };
}
