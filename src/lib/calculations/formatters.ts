/**
 * Formats a currency value into standard financial abbreviations (e.g. $12.4B, $350.5M).
 * @param value The value to format.
 * @param inMillions If true, treats the input value as already scaled to millions (e.g. 12000 means $12,000,000,000 or $12B).
 */
export function formatCurrency(value: number, inMillions: boolean = false): string {
  const scaledValue = inMillions ? value * 1_000_000 : value;
  const absValue = Math.abs(scaledValue);
  const sign = scaledValue < 0 ? "-" : "";

  if (absValue >= 1_000_000_000) {
    return `${sign}$${(absValue / 1_000_000_000).toFixed(2)}B`;
  }
  if (absValue >= 1_000_000) {
    return `${sign}$${(absValue / 1_000_000).toFixed(1)}M`;
  }
  if (absValue >= 1_000) {
    return `${sign}$${(absValue / 1_000).toFixed(0)}K`;
  }
  return `${sign}$${absValue.toFixed(0)}`;
}

/**
 * Formats a ratio value into a percentage (e.g., 0.1425 -> "+14.3%" or "14.3%").
 * @param value The decimal value (e.g. 0.125 for 12.5%).
 * @param showSign If true, appends a "+" sign to positive numbers.
 */
export function formatPercentage(value: number, showSign: boolean = false): string {
  const percentValue = value * 100;
  const formatted = `${percentValue.toFixed(1)}%`;
  if (showSign && percentValue > 0) {
    return `+${formatted}`;
  }
  return formatted;
}

/**
 * Formats decimal differences into Basis Points (bps) (e.g., 0.02 -> "+200 bps" or "200 bps").
 * @param value The difference to convert (e.g. 0.005 is 50 bps).
 * @param showSign If true, appends a "+" sign to positive numbers.
 */
export function formatBps(value: number, showSign: boolean = false): string {
  const bps = Math.round(value * 10_000);
  const sign = showSign && bps > 0 ? "+" : "";
  return `${sign}${bps} bps`;
}

/**
 * Formats a generic large quantity (e.g., paid memberships) into standard abbreviations (e.g., 280.5M).
 * @param value The value to format.
 * @param inMillions If true, treats the input value as already scaled to millions.
 */
export function formatNumber(value: number, inMillions: boolean = false): string {
  const scaledValue = inMillions ? value * 1_000_000 : value;
  const absValue = Math.abs(scaledValue);
  const sign = scaledValue < 0 ? "-" : "";

  if (absValue >= 1_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000).toFixed(2)}B`;
  }
  if (absValue >= 1_000_000) {
    return `${sign}${(absValue / 1_000_000).toFixed(1)}M`;
  }
  return scaledValue.toLocaleString(undefined, { maximumFractionDigits: 1 });
}
