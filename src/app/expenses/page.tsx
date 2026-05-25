"use client";

import React, { useMemo } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { useDashboard } from "@/components/layout/DashboardContext";
import KpiCard from "@/components/cards/KpiCard";
import GlassCard from "@/components/cards/GlassCard";
import ActualForecastTimeline from "@/components/forecast/ActualForecastTimeline";
import ExpenseVarianceChart from "@/components/charts/ExpenseVarianceChart";
import { formatCurrency, formatPercentage } from "@/lib/calculations/formatters";
import { calculateYoYGrowth } from "@/lib/calculations/growth";
import { DollarSign, ShieldAlert, TrendingDown, ArrowRight } from "lucide-react";

function ExpensesContent() {
  const { 
    scenario, 
    selectedYear, 
    historicalCorporate, 
    forecasts, 
    activePeriodData 
  } = useDashboard();

  const metrics = activePeriodData.metrics;
  const isForecast = activePeriodData.isForecast;

  // Extract opex category histories for sparklines
  const sparklineData = useMemo(() => {
    const years = Array.from({ length: 10 }, (_, i) => 2021 + i);
    const costOfRevs: number[] = [];
    const marketing: number[] = [];
    const techDev: number[] = [];
    const ga: number[] = [];

    years.forEach((yr) => {
      if (yr <= 2025) {
        const h = historicalCorporate.find((d) => d.year === yr)!;
        costOfRevs.push(h.incomeStatement.costOfRevenues);
        marketing.push(h.incomeStatement.marketing);
        techDev.push(h.incomeStatement.technologyAndDevelopment);
        ga.push(h.incomeStatement.generalAndAdministrative);
      } else {
        const f = forecasts[scenario].periods.find((p: any) => p.year === yr)!.metrics;
        costOfRevs.push(f.incomeStatement.costOfRevenues);
        marketing.push(f.incomeStatement.marketing);
        techDev.push(f.incomeStatement.technologyAndDevelopment);
        ga.push(f.incomeStatement.generalAndAdministrative);
      }
    });

    return { costOfRevs, marketing, techDev, ga };
  }, [scenario, forecasts, historicalCorporate]);

  // Compute prior period metrics
  const priorMetrics = useMemo(() => {
    const priorYear = selectedYear - 1;
    if (priorYear >= 2026) {
      return forecasts[scenario].periods.find((p: any) => p.year === priorYear)!.metrics;
    }
    return historicalCorporate.find((d) => d.year === priorYear);
  }, [selectedYear, scenario, forecasts, historicalCorporate]);

  // Calculate YoY growths
  const calculateDelta = (curr: number, prev: number | undefined) => {
    if (!prev) return 0.08; // illustrative fallback
    return calculateYoYGrowth(curr, prev);
  };

  const costOfRevsYoY = calculateDelta(metrics.incomeStatement.costOfRevenues, priorMetrics?.incomeStatement.costOfRevenues);
  const marketingYoY = calculateDelta(metrics.incomeStatement.marketing, priorMetrics?.incomeStatement.marketing);
  const techDevYoY = calculateDelta(metrics.incomeStatement.technologyAndDevelopment, priorMetrics?.incomeStatement.technologyAndDevelopment);
  const gaYoY = calculateDelta(metrics.incomeStatement.generalAndAdministrative, priorMetrics?.incomeStatement.generalAndAdministrative);

  // Compute opex % of Revenue
  const rev = metrics.incomeStatement.revenue;
  const costOfRevsRatio = metrics.incomeStatement.costOfRevenues / rev;
  const marketingRatio = metrics.incomeStatement.marketing / rev;
  const techDevRatio = metrics.incomeStatement.technologyAndDevelopment / rev;
  const gaRatio = metrics.incomeStatement.generalAndAdministrative / rev;
  const totalOpExRatio = metrics.incomeStatement.operatingExpenses / rev;

  return (
    <div className="space-y-6">
      {/* Timeline period selector */}
      <ActualForecastTimeline />

      {/* Expense Line Items Sparkline Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          title="Cost of Revenues"
          value={formatCurrency(metrics.incomeStatement.costOfRevenues, true)}
          change={costOfRevsYoY}
          historicalData={sparklineData.costOfRevs}
          isForecast={isForecast}
          changeLabel={`YoY (${formatPercentage(costOfRevsRatio)} of Revenue)`}
        />
        <KpiCard
          title="Marketing Spend"
          value={formatCurrency(metrics.incomeStatement.marketing, true)}
          change={marketingYoY}
          historicalData={sparklineData.marketing}
          isForecast={isForecast}
          changeLabel={`YoY (${formatPercentage(marketingRatio)} of Revenue)`}
        />
        <KpiCard
          title="Technology & Development"
          value={formatCurrency(metrics.incomeStatement.technologyAndDevelopment, true)}
          change={techDevYoY}
          historicalData={sparklineData.techDev}
          isForecast={isForecast}
          changeLabel={`YoY (${formatPercentage(techDevRatio)} of Revenue)`}
        />
        <KpiCard
          title="General & Administrative Expenses"
          value={formatCurrency(metrics.incomeStatement.generalAndAdministrative, true)}
          change={gaYoY}
          historicalData={sparklineData.ga}
          isForecast={isForecast}
          changeLabel={`YoY (${formatPercentage(gaRatio)} of Revenue)`}
        />
      </div>

      {/* Group comparison bar chart and structure panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Expense grouped bars */}
        <div className="lg:col-span-8 flex flex-col">
          <GlassCard
            title="Operating Expense Disclosures & Variance comparison"
            subtitle={`Grouping comparison between FY${selectedYear} and FY${selectedYear - 1}`}
            className="flex-1 flex flex-col justify-between h-full"
          >
            <div className="flex-1 flex flex-col justify-center min-h-[360px] h-full w-full">
              <ExpenseVarianceChart
                currentMetrics={metrics.incomeStatement}
                priorMetrics={priorMetrics?.incomeStatement || metrics.incomeStatement}
                currentLabel={`FY${selectedYear} (${isForecast ? 'FC' : 'ACT'})`}
                priorLabel={`FY${selectedYear - 1} (${selectedYear - 1 >= 2026 ? 'FC' : 'ACT'})`}
                height="h-[360px] lg:h-[390px] xl:h-[400px]"
              />
            </div>
          </GlassCard>
        </div>

        {/* Marginal Efficiencies breakdown */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard
            title="Expense Ratios & Efficiency"
            subtitle={`Operating expense allocation margins for FY${selectedYear}`}
          >
            <div className="space-y-4 pt-1 text-xs">
              <div>
                <div className="flex justify-between items-center font-bold mb-1">
                  <span>Cost of Revenues Share</span>
                  <span className="text-white">{formatPercentage(costOfRevsRatio)}</span>
                </div>
                <div className="w-full bg-netflix-border/50 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${costOfRevsRatio * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center font-bold mb-1">
                  <span>Total Selling, General & Administrative + Technology</span>
                  <span className="text-white">{formatPercentage(totalOpExRatio)}</span>
                </div>
                <div className="w-full bg-netflix-border/50 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${totalOpExRatio * 100}%` }} />
                </div>
              </div>

              <div className="w-full h-[1px] bg-netflix-border/80 my-2" />

              <div className="p-3 bg-black/40 border border-netflix-border/50 rounded-lg text-[11px] leading-relaxed text-[#A3A3A3]">
                <div className="flex items-center gap-1.5 text-netflix-red font-bold text-[10px] uppercase mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Marginal Leverage Audits
                </div>
                Cost of revenues includes corporate physical delivery and content amortization outlays. Selling, General & Administrative expenses include local marketing campaigns and back-office operating expense targets.
              </div>
            </div>
          </GlassCard>

          {/* OpEx detailed listings table */}
          <GlassCard
            title="Operating Expenses Summary"
            subtitle="Values in USD Millions"
          >
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-netflix-border/30">
                <span className="font-sans text-[#A3A3A3]">Total Operating Expenses</span>
                <span className="font-bold text-white">{formatCurrency(metrics.incomeStatement.operatingExpenses, true)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-netflix-border/30">
                <span className="font-sans text-[#A3A3A3]">Gross Margin</span>
                <span className="font-bold text-emerald-400">{formatPercentage(metrics.incomeStatement.grossMargin)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-sans text-[#A3A3A3]">Operating Margin</span>
                <span className="font-bold text-netflix-red">{formatPercentage(metrics.incomeStatement.operatingMargin)}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default function ExpensesPage() {
  return (
    <DashboardShell title="Operating Expense & Margin Analysis">
      <ExpensesContent />
    </DashboardShell>
  );
}
