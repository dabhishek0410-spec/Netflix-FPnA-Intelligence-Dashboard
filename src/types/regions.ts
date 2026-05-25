export type RegionCode = "UCAN" | "EMEA" | "LATAM" | "APAC";

export interface RegionalMetrics {
  region: RegionCode;
  revenue: number;
  paidMemberships: number; // in millions
  arpu: number; // Average Revenue per User / membership per month (USD)
  revenueGrowthYoYPercent?: number;
  membershipGrowthYoYPercent?: number;
}

export interface RegionalSplit {
  year: number;
  quarter?: "Q1" | "Q2" | "Q3" | "Q4";
  regions: Record<RegionCode, RegionalMetrics>;
  totalRevenue: number;
  totalMemberships: number;
}
