export interface AnalystInsight {
  id: string;
  title: string;
  period: string;
  scenario?: "base" | "bear" | "bull";
  metric: string;
  actualValue?: number;
  forecastValue?: number;
  priorValue?: number;
  variance?: number;
  variancePercent?: number;
  triggerRule: string;
  explanation: string;
  driver: string;
  sourceType: "Actual" | "Guidance" | "Historical Trend" | "Analyst Assumption";
  confidence: "High" | "Medium" | "Low";
  sourceReference?: string;
}
