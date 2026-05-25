export interface DataSourceMetadata {
  id: string;
  name: string;
  type: "Actual" | "Guidance" | "Historical Trend" | "Analyst Assumption";
  lastUpdated: string;
  description: string;
  coverage: string; // e.g., "2021-2025" or "2026-2030"
  reliability: "Audited" | "Estimated" | "Projected";
  owner: string;
}
