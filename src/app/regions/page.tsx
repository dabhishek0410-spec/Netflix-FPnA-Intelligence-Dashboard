"use client";

import React, { useMemo } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { useDashboard } from "@/components/layout/DashboardContext";
import GlassCard from "@/components/cards/GlassCard";
import ActualForecastTimeline from "@/components/forecast/ActualForecastTimeline";
import RegionalHeatmap from "@/components/charts/RegionalHeatmap";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/calculations/formatters";
import { calculateYoYGrowth } from "@/lib/calculations/growth";
import { Users, DollarSign, TrendingUp, HelpCircle } from "lucide-react";

const regionMeta: Record<string, { flag: string; fullName: string; sub: string }> = {
  UCAN:  { flag: "🇺🇸", fullName: "US & Canada",          sub: "Domestic mature market"       },
  EMEA:  { flag: "🇪🇺", fullName: "Europe, Middle East & Africa", sub: "Primary growth accelerator" },
  LATAM: { flag: "🇧🇷", fullName: "Latin America",          sub: "Emerging market expansion"    },
  APAC:  { flag: "🇯🇵", fullName: "Asia-Pacific",           sub: "Highest membership growth"    },
};

function RegionsContent() {
  const { 
    scenario, 
    selectedYear, 
    historicalRegional, 
    forecasts, 
    activePeriodData 
  } = useDashboard();

  const currentRegional = activePeriodData.regional;
  const isForecast = activePeriodData.isForecast;

  // Compute prior year regional metrics
  const priorRegional = useMemo(() => {
    const priorYear = selectedYear - 1;
    if (priorYear >= 2026) {
      return forecasts[scenario].periods.find((p: any) => p.year === priorYear)!.regionalMetrics;
    }
    // For 2026, previous is 2025 actual.
    // Historical regional data goes up to 2025.
    return historicalRegional.find((d) => d.year === priorYear) || historicalRegional[historicalRegional.length - 1];
  }, [selectedYear, scenario, forecasts, historicalRegional]);

  const regionCodes: ("UCAN" | "EMEA" | "LATAM" | "APAC")[] = ["UCAN", "EMEA", "LATAM", "APAC"];

  // Compute corporate average growth rate
  const corporateGrowth = useMemo(() => {
    const currTotal = currentRegional.totalRevenue;
    const prevTotal = priorRegional.totalRevenue;
    return prevTotal > 0 ? (currTotal - prevTotal) / prevTotal : 0.10;
  }, [currentRegional, priorRegional]);

  return (
    <div className="space-y-6">
      {/* Timeline Selector */}
      <ActualForecastTimeline />

      {/* Regional Performance Heatmap Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap matrix */}
        <div className="lg:col-span-8">
          <GlassCard
            title="YoY Growth Matrix by Region"
            subtitle="Interactive heatmapping YoY metric growths (Paid memberships, Revenue, ARPU) across geopolitical segments."
          >
            <RegionalHeatmap 
              currentData={currentRegional} 
              priorData={priorRegional} 
            />
          </GlassCard>
        </div>

        {/* Growth Premium breakdown */}
        <div className="lg:col-span-4 space-y-6 self-start">
          <GlassCard
            title="Strategic Growth Premiums"
            subtitle={`Relative performance (pp vs Corp Average of ${formatPercentage(corporateGrowth)})`}
          >
            <div className="space-y-4 pt-1 text-xs select-none">
              {regionCodes.map((code) => {
                const curVal = currentRegional.regions[code];
                const prevVal = priorRegional.regions[code];
                const regGrowth = prevVal.revenue > 0 ? (curVal.revenue - prevVal.revenue) / prevVal.revenue : 0;
                
                // Growth Premium = Region growth - Corp growth
                const premium = regGrowth - corporateGrowth;
                const isPositive = premium > 0;
                const isNegative = premium < 0;

                const meta = regionMeta[code];
                return (
                  <div key={code} className="p-3.5 bg-black/40 border border-netflix-border/50 rounded-lg flex justify-between items-center">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-white tracking-wider flex items-center gap-2">
                        <span className="text-base leading-none">{meta.flag}</span>
                        <span>{code}</span>
                      </span>
                      <span className="text-[10px] text-[#A3A3A3]">{meta.fullName} · Growth: {formatPercentage(regGrowth)}</span>
                    </div>

                    <div className="text-right">
                      <span className={`font-mono font-bold text-sm ${
                        isPositive 
                          ? 'text-emerald-400' 
                          : isNegative 
                          ? 'text-rose-400' 
                          : 'text-[#A3A3A3]'
                      }`}>
                        {isPositive ? "+" : ""}{(premium * 100).toFixed(1)} pp
                      </span>
                      <span className="block text-[8px] text-[#666666] font-semibold uppercase tracking-wider mt-0.5">
                        {isPositive ? "Premium" : isNegative ? "Discount" : "Neutral"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

        </div>
      </div>

      {/* Full-width allocation footnote */}
      <GlassCard className="mt-6">
        <div className="flex items-start gap-2.5 text-xs text-[#A3A3A3] leading-relaxed select-none">
          <HelpCircle className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
          <span>
            <span className="text-[#F5F5F1] font-semibold">Segment Allocation Note:</span> UCAN accounts for domestic mature markets, while APAC and EMEA represent primary growth accelerators. ARPU balances vary by localised pricing structures and membership tier conversions.
          </span>
        </div>
      </GlassCard>

      {/* Regional Detail Cards Grid */}
      <span className="text-[#666666] text-xs font-bold uppercase tracking-wider block mt-4 select-none">
        Geographical Segment details for FY{selectedYear}
      </span>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {regionCodes.map((code) => {
          const curVal = currentRegional.regions[code];
          const prevVal = priorRegional.regions[code];

          const memGrowth = prevVal.paidMemberships > 0 
            ? (curVal.paidMemberships - prevVal.paidMemberships) / prevVal.paidMemberships 
            : 0.05;

          const meta = regionMeta[code];
          return (
            <GlassCard
              key={code}
              interactive
              title={
                <span className="flex items-center gap-2">
                  <span className="text-xl leading-none">{meta.flag}</span>
                  <span>{code} <span className="text-[#A3A3A3] font-normal text-xs">· {meta.fullName}</span></span>
                </span>
              }
              subtitle={`${meta.sub} · FY${selectedYear}`}
              glowColor="rgba(229, 9, 20, 0.02)"
            >
              <div className="space-y-3.5 text-xs select-none">
                {/* Revenue */}
                <div className="flex justify-between py-1.5 border-b border-netflix-border/30">
                  <span className="text-[#A3A3A3] font-medium">Revenue</span>
                  <span className="font-bold text-white">{formatCurrency(curVal.revenue, true)}</span>
                </div>

                {/* Paid memberships */}
                <div className="flex justify-between py-1.5 border-b border-netflix-border/30">
                  <span className="text-[#A3A3A3] font-medium">Paid Memberships</span>
                  <div className="text-right">
                    <span className="font-bold text-white block">{curVal.paidMemberships.toFixed(1)}M</span>
                    <span className={`text-[9px] font-semibold ${memGrowth > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {memGrowth > 0 ? "+" : ""}{formatPercentage(memGrowth)} YoY
                    </span>
                  </div>
                </div>

                {/* ARPU */}
                <div className="flex justify-between py-1">
                  <span className="text-[#A3A3A3] font-medium">ARPU / month</span>
                  <span className="font-bold text-netflix-red">${curVal.arpu.toFixed(2)}</span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

export default function RegionsPage() {
  return (
    <DashboardShell title="Geographical Segment Analysis">
      <RegionsContent />
    </DashboardShell>
  );
}
