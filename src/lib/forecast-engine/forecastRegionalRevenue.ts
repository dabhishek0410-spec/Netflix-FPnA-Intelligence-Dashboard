import { ScenarioType } from "@/types/forecast";
import { RegionalSplit, RegionalMetrics, RegionCode } from "@/types/regions";
import { getScenarioAssumptions } from "./scenarioAssumptions";
import { historicalRegionalData } from "./historicalData";

/**
 * Projects UCAN, EMEA, LATAM, APAC regional splits for 2026-2030.
 * Regional Revenue growth rate = Corporate Revenue Growth Rate + Scenario Regional Growth Premium.
 * Results are normalized to match total corporate revenue.
 */
export function forecastRegionalRevenue(
  year: number,
  corporateRevenue: number,
  corporateGrowthRate: number,
  scenario: ScenarioType,
  priorRegionalSplit?: RegionalSplit
): RegionalSplit {
  const assumptions = getScenarioAssumptions(scenario);
  const premiums = assumptions.regionalGrowthPremium;

  // Use 2025 historical data if priorRegionalSplit is not supplied
  const baseSplit = priorRegionalSplit || historicalRegionalData[historicalRegionalData.length - 1];

  const regions: RegionCode[] = ["UCAN", "EMEA", "LATAM", "APAC"];
  const rawRevenues: Record<RegionCode, number> = {} as any;
  let rawSum = 0;

  // 1. Calculate raw revenues based on growth premiums
  for (const region of regions) {
    const priorRevenue = baseSplit.regions[region].revenue;
    const premium = premiums[region] || 0;
    const regionGrowth = corporateGrowthRate + premium;
    const projectedRaw = priorRevenue * (1 + regionGrowth);
    rawRevenues[region] = projectedRaw;
    rawSum += projectedRaw;
  }

  // 2. Normalize regional revenues so they sum exactly to the corporate revenue
  const normalizationFactor = corporateRevenue / rawSum;
  const normalizedRevenues: Record<RegionCode, number> = {} as any;
  let normalizedSum = 0;

  for (const region of regions) {
    normalizedRevenues[region] = Math.round(rawRevenues[region] * normalizationFactor * 100) / 100;
    normalizedSum += normalizedRevenues[region];
  }

  // Handle rounding variance by adjusting the largest region (UCAN)
  const difference = Math.round((corporateRevenue - normalizedSum) * 100) / 100;
  normalizedRevenues["UCAN"] = Math.round((normalizedRevenues["UCAN"] + difference) * 100) / 100;

  // 3. Project ARPU and calculate memberships: Memberships = Revenue / (ARPU * 12)
  // Let ARPU grow based on inflation/pricing drivers:
  // Base case: ARPU grows 3% in UCAN/EMEA, 2% in LATAM/APAC
  // Bull case: ARPU grows 5% in UCAN/EMEA, 3% in LATAM/APAC
  // Bear case: ARPU grows 1% across all regions
  const updatedRegions: Record<RegionCode, RegionalMetrics> = {} as any;
  let totalMemberships = 0;

  for (const region of regions) {
    const priorMetrics = baseSplit.regions[region];
    let arpuGrowth = 0.02; // default 2%

    if (scenario === "bull") {
      arpuGrowth = ["UCAN", "EMEA"].includes(region) ? 0.05 : 0.03;
    } else if (scenario === "bear") {
      arpuGrowth = 0.005; // 0.5% growth under economic stagnation
    } else {
      arpuGrowth = ["UCAN", "EMEA"].includes(region) ? 0.03 : 0.02;
    }

    const projectedArpu = Math.round(priorMetrics.arpu * (1 + arpuGrowth) * 100) / 100;
    const projectedRevenue = normalizedRevenues[region];
    
    // Revenue (in millions) = Memberships (in millions) * ARPU * 12 months / 10^6
    // Since Memberships and Revenue are in millions, we have:
    // Revenue = Memberships * ARPU * 12 / 10^6 (wait, if Memberships is in millions and Revenue is in millions,
    // then Revenue = Memberships * ARPU * 12 / 10^6? No, if Memberships is 10M, and ARPU is $10/mo,
    // the annual revenue is 10M * $10 * 12 = $1200M. So Revenue = Memberships * ARPU * 12! Yes, the millions scale cancels out!)
    // So Memberships = Revenue / (ARPU * 12)
    const projectedMemberships = Math.round((projectedRevenue / (projectedArpu * 12)) * 10) / 10;
    totalMemberships += projectedMemberships;

    const revenueGrowthYoYPercent = (projectedRevenue - priorMetrics.revenue) / priorMetrics.revenue;
    const membershipGrowthYoYPercent = (projectedMemberships - priorMetrics.paidMemberships) / priorMetrics.paidMemberships;

    updatedRegions[region] = {
      region,
      revenue: projectedRevenue,
      paidMemberships: projectedMemberships,
      arpu: projectedArpu,
      revenueGrowthYoYPercent,
      membershipGrowthYoYPercent,
    };
  }

  return {
    year,
    regions: updatedRegions,
    totalRevenue: corporateRevenue,
    totalMemberships: Math.round(totalMemberships * 10) / 10,
  };
}
