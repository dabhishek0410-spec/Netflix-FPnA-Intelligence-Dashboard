"use client";

import React, { useMemo } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { useDashboard } from "@/components/layout/DashboardContext";
import KpiCard from "@/components/cards/KpiCard";
import GlassCard from "@/components/cards/GlassCard";
import ActualForecastTimeline from "@/components/forecast/ActualForecastTimeline";
import RevenueTrendChart from "@/components/charts/RevenueTrendChart";
import OperatingMarginChart from "@/components/charts/OperatingMarginChart";
import { formatCurrency, formatPercentage, formatNumber } from "@/lib/calculations/formatters";
import { calculateYoYGrowth } from "@/lib/calculations/growth";
import { Tv, Sparkles, Database } from "lucide-react";

const regionMeta: Record<string, { flag: string; fullName: string }> = {
  UCAN:  { flag: "🇺🇸", fullName: "US & Canada"                  },
  EMEA:  { flag: "🇪🇺", fullName: "Europe, Middle East & Africa" },
  LATAM: { flag: "🇧🇷", fullName: "Latin America"                },
  APAC:  { flag: "🇯🇵", fullName: "Asia-Pacific"                 },
};

function ExecutiveContent() {
  const { 
    scenario, 
    selectedYear, 
    historicalCorporate, 
    forecasts, 
    activePeriodData 
  } = useDashboard();

  const metrics = activePeriodData.metrics;
  const isForecast = activePeriodData.isForecast;

  // Extract timeline values (2021-2030) for trend sparklines
  const sparklineData = useMemo(() => {
    const years = Array.from({ length: 10 }, (_, i) => 2021 + i);
    const revs: number[] = [];
    const opIncs: number[] = [];
    const opMargins: number[] = [];
    const subs: number[] = [];
    const arpus: number[] = [];

    years.forEach((yr) => {
      if (yr <= 2025) {
        const h = historicalCorporate.find((d) => d.year === yr)!;
        revs.push(h.incomeStatement.revenue);
        opIncs.push(h.incomeStatement.operatingIncome);
        opMargins.push(h.incomeStatement.operatingMargin);
        subs.push(h.paidMemberships || 0);
        arpus.push(h.arpu || 0);
      } else {
        const f = forecasts[scenario].periods.find((p: any) => p.year === yr)!.metrics;
        revs.push(f.incomeStatement.revenue);
        opIncs.push(f.incomeStatement.operatingIncome);
        opMargins.push(f.incomeStatement.operatingMargin);
        subs.push(f.paidMemberships || 0);
        arpus.push(f.arpu || 0);
      }
    });

    return { revs, opIncs, opMargins, subs, arpus };
  }, [scenario, forecasts, historicalCorporate]);

  // Compute prior metrics for YoY variances
  const priorMetrics = useMemo(() => {
    const priorYear = selectedYear - 1;
    if (priorYear >= 2026) {
      return forecasts[scenario].periods.find((p: any) => p.year === priorYear)!.metrics;
    }
    return historicalCorporate.find((d) => d.year === priorYear);
  }, [selectedYear, scenario, forecasts, historicalCorporate]);

  // Calculate YoY deltas
  const revenueYoY = priorMetrics 
    ? calculateYoYGrowth(metrics.incomeStatement.revenue, priorMetrics.incomeStatement.revenue) 
    : 0.125; // fallback

  const opIncYoY = priorMetrics 
    ? calculateYoYGrowth(metrics.incomeStatement.operatingIncome, priorMetrics.incomeStatement.operatingIncome) 
    : 0.200;

  const marginYoY = priorMetrics 
    ? metrics.incomeStatement.operatingMargin - priorMetrics.incomeStatement.operatingMargin 
    : 0.021;

  const subsYoY = priorMetrics && metrics.paidMemberships && priorMetrics.paidMemberships
    ? calculateYoYGrowth(metrics.paidMemberships, priorMetrics.paidMemberships)
    : 0.052;

  const arpuYoY = priorMetrics && metrics.arpu && priorMetrics.arpu
    ? calculateYoYGrowth(metrics.arpu, priorMetrics.arpu)
    : 0.041;

  // Format charts structures
  const revTrendHist = historicalCorporate.map((d) => ({ year: d.year, revenue: d.incomeStatement.revenue }));
  const revTrendForecast = forecasts[scenario].periods.map((p: any) => ({ year: p.year, revenue: p.metrics.incomeStatement.revenue }));

  const marginForecasts = {
    base: forecasts.base.periods.map((p: any) => ({ year: p.year, operatingMargin: p.metrics.incomeStatement.operatingMargin })),
    bear: forecasts.bear.periods.map((p: any) => ({ year: p.year, operatingMargin: p.metrics.incomeStatement.operatingMargin })),
    bull: forecasts.bull.periods.map((p: any) => ({ year: p.year, operatingMargin: p.metrics.incomeStatement.operatingMargin })),
  };

  return (
    <div className="space-y-6">
      {/* Interactive Time Selector */}
      <ActualForecastTimeline />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        <KpiCard
          title="Revenue"
          value={formatCurrency(metrics.incomeStatement.revenue, true)}
          change={revenueYoY}
          historicalData={sparklineData.revs}
          isForecast={isForecast}
        />
        <KpiCard
          title="Operating Income"
          value={formatCurrency(metrics.incomeStatement.operatingIncome, true)}
          change={opIncYoY}
          historicalData={sparklineData.opIncs}
          isForecast={isForecast}
        />
        <KpiCard
          title="Operating Margin"
          value={formatPercentage(metrics.incomeStatement.operatingMargin)}
          change={marginYoY}
          changeLabel="YoY bps"
          historicalData={sparklineData.opMargins}
          isForecast={isForecast}
        />
        <KpiCard
          title="Paid Memberships"
          value={`${formatNumber(metrics.paidMemberships || 0)}M`}
          change={subsYoY}
          historicalData={sparklineData.subs}
          isForecast={isForecast}
        />
        <KpiCard
          title="ARPU / month"
          value={`$${metrics.arpu?.toFixed(2)}`}
          change={arpuYoY}
          historicalData={sparklineData.arpus}
          isForecast={isForecast}
        />
      </div>

      {/* Core charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Area Chart */}
        <GlassCard
          title="Corporate Revenue Scaling Timeline"
          subtitle="Shaded historical actuals vs dashed long-range forecast targets."
        >
          <RevenueTrendChart
            historicalData={revTrendHist}
            forecastData={revTrendForecast}
            activeYear={selectedYear}
          />
        </GlassCard>

        {/* Operating Margin Composed bounds Chart */}
        <GlassCard
          title="Operating Margin Boundary Envelope"
          subtitle="Projections display Base trajectory bounded by shaded Bull/Bear envelopes."
        >
          <OperatingMarginChart
            historicalData={historicalCorporate.map((d) => ({ year: d.year, operatingMargin: d.incomeStatement.operatingMargin }))}
            forecasts={marginForecasts}
            activeYear={selectedYear}
          />
        </GlassCard>
      </div>

      {/* regional breakdown summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Highlights summary */}
        <div className="lg:col-span-2 h-full flex flex-col">
          <GlassCard
            title="Strategic Financial Statement Overview"
            subtitle={`Consolidated highlights of the active FY${selectedYear} period`}
            className="h-full flex flex-col justify-between"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3.5 text-xs font-mono flex-1">
              {/* Row 1 */}
              <div className="p-3 bg-black/40 border border-netflix-border/50 rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[#666666] font-semibold text-[10px] uppercase block mb-1">Gross Profit</span>
                  <span className="text-[#F5F5F1] font-bold text-sm">{formatCurrency(metrics.incomeStatement.grossProfit, true)}</span>
                </div>
                <span className="text-[#A3A3A3] text-[9px] block mt-1.5 border-t border-netflix-border/30 pt-1">Margin: {formatPercentage(metrics.incomeStatement.grossMargin)}</span>
              </div>

              <div className="p-3 bg-black/40 border border-netflix-border/50 rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[#666666] font-semibold text-[10px] uppercase block mb-1">Operating Income</span>
                  <span className="text-[#F5F5F1] font-bold text-sm">{formatCurrency(metrics.incomeStatement.operatingIncome, true)}</span>
                </div>
                <span className="text-[#A3A3A3] text-[9px] block mt-1.5 border-t border-netflix-border/30 pt-1">Margin: {formatPercentage(metrics.incomeStatement.operatingMargin)}</span>
              </div>

              <div className="p-3 bg-black/40 border border-netflix-border/50 rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[#666666] font-semibold text-[10px] uppercase block mb-1">Free Cash Flow</span>
                  <span className="text-purple-400 font-bold text-sm">{formatCurrency(metrics.cashFlowStatement.freeCashFlow, true)}</span>
                </div>
                <span className="text-purple-400/70 text-[9px] block mt-1.5 border-t border-netflix-border/30 pt-1">Conv: {formatPercentage(metrics.cashFlowStatement.fcfConversionOfRevenue)}</span>
              </div>

              <div className="p-3 bg-black/40 border border-netflix-border/50 rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[#666666] font-semibold text-[10px] uppercase block mb-1">Cash Balance</span>
                  <span className="text-white font-bold text-sm">{formatCurrency(metrics.balanceSheet.cashAndEquivalents, true)}</span>
                </div>
                <span className="text-[#A3A3A3] text-[9px] block mt-1.5 border-t border-netflix-border/30 pt-1">Liquidity Reserve</span>
              </div>

              {/* Row 2 */}
              <div className="p-3 bg-black/40 border border-netflix-border/50 rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[#666666] font-semibold text-[10px] uppercase block mb-1">Marketing Cost</span>
                  <span className="text-[#F5F5F1] font-bold text-sm">{formatCurrency(metrics.incomeStatement.marketing, true)}</span>
                </div>
                <span className="text-[#A3A3A3] text-[9px] block mt-1.5 border-t border-netflix-border/30 pt-1">Acquisition Spend</span>
              </div>

              <div className="p-3 bg-black/40 border border-netflix-border/50 rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[#666666] font-semibold text-[10px] uppercase block mb-1">Tech & Dev Cost</span>
                  <span className="text-[#F5F5F1] font-bold text-sm">{formatCurrency(metrics.incomeStatement.technologyAndDevelopment, true)}</span>
                </div>
                <span className="text-[#A3A3A3] text-[9px] block mt-1.5 border-t border-netflix-border/30 pt-1">R&D & Streaming</span>
              </div>

              <div className="p-3 bg-black/40 border border-netflix-border/50 rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[#666666] font-semibold text-[10px] uppercase block mb-1">G&A Overhead</span>
                  <span className="text-[#F5F5F1] font-bold text-sm">{formatCurrency(metrics.incomeStatement.generalAndAdministrative, true)}</span>
                </div>
                <span className="text-[#A3A3A3] text-[9px] block mt-1.5 border-t border-netflix-border/30 pt-1">Admin & Support</span>
              </div>

              <div className="p-3 bg-black/40 border border-netflix-border/50 rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[#666666] font-semibold text-[10px] uppercase block mb-1">Content Additions</span>
                  <span className="text-emerald-400 font-bold text-sm">{formatCurrency(metrics.contentAssets.additions, true)}</span>
                </div>
                <span className="text-[#A3A3A3] text-[9px] block mt-1.5 border-t border-netflix-border/30 pt-1">Amort: {formatCurrency(metrics.contentAssets.amortization, true)}</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Quick regional card split */}
        <GlassCard
          title="Geographical Splits"
          subtitle={`Segment contribution shares for FY${selectedYear}`}
          className="h-full flex flex-col justify-between"
        >
          <div className="space-y-3.5 pt-2 text-xs flex-1 flex flex-col justify-between">
            {Object.entries(activePeriodData.regional.regions).map(([code, reg]) => {
              const share = (reg.revenue / activePeriodData.regional.totalRevenue) * 100;
              const meta = regionMeta[code] ?? { flag: "🌐", fullName: code };
              return (
                <div key={code} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-bold">
                      <span className="text-sm leading-none">{meta.flag}</span>
                      <span className="text-white">{code}</span>
                      <span className="text-[#666666] font-normal text-[10px]">{meta.fullName}</span>
                    </span>
                    <span className="text-white font-bold">
                      {formatCurrency(reg.revenue, true)} <span className="text-[#A3A3A3] font-normal">({share.toFixed(0)}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-netflix-border/50 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-netflix-red h-full rounded-full transition-all duration-500" 
                      style={{ width: `${share}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default function ExecutivePage() {
  return (
    <DashboardShell title="Executive FP&A Summary">
      <ExecutiveContent />
    </DashboardShell>
  );
}
